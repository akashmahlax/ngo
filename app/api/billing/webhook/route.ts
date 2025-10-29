export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { getCollections } from "@/lib/models"
import crypto from "crypto"

// Use Web Crypto API for Edge Runtime compatibility
async function verifyRazorpaySignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    // Prefer Node crypto HMAC for reliability in Node runtime
    const expected = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex")
    return expected === signature
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

export async function POST(req: NextRequest) {
  const bodyText = await req.text()
  const signature = req.headers.get("x-razorpay-signature") || ""

  // Verify the signature using Web Crypto API
  const isValid = await verifyRazorpaySignature(bodyText, signature, process.env.RAZORPAY_KEY_SECRET as string)
  
  if (!isValid) {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 })
  }

  const payload = JSON.parse(bodyText)
  const event = payload.event as string
  const { orders, users } = await getCollections()

  if (event === "payment.captured" || event === "order.paid") {
    const paymentEntity = payload.payload?.payment?.entity
    const orderEntity = payload.payload?.order?.entity
    const orderId = orderEntity?.id || paymentEntity?.order_id
    if (!orderId) return NextResponse.json({ ok: true })

    const order = await orders.findOne({ orderId })
    if (!order) return NextResponse.json({ ok: true })

    await orders.updateOne(
      { _id: order._id }, 
      { $set: { 
        status: "paid", 
        paidAt: new Date(),
        razorpayPaymentId: paymentEntity?.id || order.razorpayPaymentId || null,
      } }
    )

    const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await users.updateOne(
      { _id: order.userId },
      { $set: { 
        plan: order.planTarget, 
        planExpiresAt,
        planActivatedAt: new Date(),
        pendingPlan: null,
        planCancelled: false,
        planCancelledAt: null,
        updatedAt: new Date(),
      } }
    )
  }

  return NextResponse.json({ ok: true })
}

// Configure route to run on Edge Runtime
export const preferredRegion = 'auto'