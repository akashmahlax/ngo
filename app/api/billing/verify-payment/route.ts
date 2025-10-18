import { NextRequest, NextResponse } from "next/server"
import { getCollections } from "@/lib/models"
import { auth } from "@/auth"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "MISSING_PARAMETERS" }, { status: 400 })
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET as string
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "INVALID_SIGNATURE", success: false }, { status: 400 })
    }

    // Payment is verified, update database
    const { orders, users } = await getCollections()
    
    const order = await orders.findOne({ orderId: razorpay_order_id })
    if (!order) {
      return NextResponse.json({ error: "ORDER_NOT_FOUND", success: false }, { status: 404 })
    }

    // Update order status
    await orders.updateOne(
      { _id: order._id },
      { 
        $set: { 
          status: "paid", 
          paidAt: new Date(),
          paymentId: razorpay_payment_id,
          signature: razorpay_signature
        } 
      }
    )

    // Update user's plan (30 days from now)
    const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await users.updateOne(
      { _id: order.userId },
      { 
        $set: { 
          plan: order.planTarget, 
          planExpiresAt,
          planActivatedAt: new Date()
        } 
      }
    )

    return NextResponse.json({ 
      success: true, 
      message: "Payment verified and plan activated" 
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ 
      error: "VERIFICATION_FAILED", 
      success: false 
    }, { status: 500 })
  }
}
