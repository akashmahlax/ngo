import { NextRequest, NextResponse } from "next/server"
import { getCollections } from "@/lib/models"

// Use Web Crypto API for Edge Runtime compatibility
async function verifyRazorpaySignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    )
    
    const signatureArrayBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body)
    )
    
    const expectedSignature = Array.from(new Uint8Array(signatureArrayBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
    
    return expectedSignature === signature
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
    const entity = payload.payload?.order?.entity || (payload.payload?.payment?.entity?.order_id && { id: payload.payload.payment.entity.order_id })
    const orderId = entity?.id
    if (!orderId) return NextResponse.json({ ok: true })

    const order = await orders.findOne({ orderId })
    if (!order) return NextResponse.json({ ok: true })

    await orders.updateOne({ _id: order._id }, { $set: { status: "paid", paidAt: new Date() } })

    const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await users.updateOne(
      { _id: order.userId },
      { $set: { plan: order.planTarget, planExpiresAt } }
    )
  }

  return NextResponse.json({ ok: true })
}

// Configure route to run on Edge Runtime
export const runtime = 'edge'
export const preferredRegion = 'auto'