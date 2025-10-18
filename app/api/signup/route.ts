import { NextRequest, NextResponse } from "next/server"
import client from "@/lib/db"
import { hash } from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["volunteer", "ngo"]),
  plan: z.enum(["volunteer_free", "volunteer_plus", "ngo_plus"]).optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { name, email, password, role, plan } = parsed.data

  // CRITICAL FIX: Always set free tier on signup, only upgrade after payment verification
  const freeTierPlan = role === "volunteer" ? "volunteer_free" : "ngo_base"
  
  // Track if user requested a Plus plan so we can redirect to upgrade page
  const requestedPlusPlan = plan && plan.endsWith("plus")

  try {
    await client.connect()
    const db = client.db()
    const users = db.collection("users")

    const existing = await users.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const passwordHash = await hash(password, 10)
    const now = new Date()
    const doc = {
      name,
      email,
      passwordHash,
      role,
      plan: freeTierPlan, // Always free tier - only upgrade after payment
      planExpiresAt: null as Date | null, // set upon payment for plus plans
      monthlyApplicationCount: 0,
      monthlyApplicationResetAt: now,
      createdAt: now,
      updatedAt: now,
    }
    const { insertedId } = await users.insertOne(doc)

    return NextResponse.json({ 
      userId: insertedId.toString(), 
      requiresUpgradePayment: requestedPlusPlan 
    })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}


