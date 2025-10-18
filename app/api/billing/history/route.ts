import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  try {
    const { users, orders } = await getCollections()
    
    const user = await users.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
    }

    // Get all orders for this user
    const userOrders = await orders
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .toArray()

    const payments = userOrders.map((order) => ({
      id: order._id.toString(),
      orderId: order.orderId,
      amount: order.amount / 100, // Convert paise to rupees
      status: order.status,
      plan: order.planTarget,
      createdAt: order.createdAt,
      paidAt: order.paidAt || null,
      paymentId: order.razorpayPaymentId || null,
    }))

    return NextResponse.json({ payments })
  } catch (error) {
    console.error("Error fetching payment history:", error)
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}
