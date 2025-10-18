import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { z } from "zod"
import { getCollections } from "@/lib/models"
import { auth } from "@/auth"

const bodySchema = z.object({ plan: z.enum(["volunteer_plus", "ngo_plus"]) })

const PRICES: Record<string, number> = {
  volunteer_plus: 100, // in paise (INR 1) - Testing price
  ngo_plus: 100,       // in paise (INR 1) - Testing price
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const json = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 })
  const plan = parsed.data.plan

  const amount = PRICES[plan]
  if (!amount) return NextResponse.json({ error: "INVALID_PLAN" }, { status: 400 })

  const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  })

  const receipt = `order_${Date.now()}`
  const order = await rzp.orders.create({ amount, currency: "INR", receipt })

  const { users, orders } = await getCollections()
  const user = await users.findOne({ email: session.user.email })
  if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })

  await orders.insertOne({
    userId: user._id,
    role: user.role,
    planTarget: plan,
    orderId: order.id,
    amount,
    currency: "INR",
    status: "created",
    receipt,
    createdAt: new Date(),
  } as any)

  return NextResponse.json({ order, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID })
}


