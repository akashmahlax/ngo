import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"

export async function POST() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  try {
    const { users } = await getCollections()
    
    const user = await users.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
    }

    // Check if user has an active plan
    if (!user.plan || user.plan === "volunteer_free" || user.plan === "ngo_base") {
      return NextResponse.json({ error: "NO_ACTIVE_PLAN" }, { status: 400 })
    }

    // Mark plan as cancelled but keep it active until expiry
    await users.updateOne(
      { _id: user._id },
      { 
        $set: { 
          planCancelled: true,
          planCancelledAt: new Date(),
          updatedAt: new Date()
        } 
      }
    )

    return NextResponse.json({ 
      success: true,
      message: "Subscription cancelled. You will retain access until the expiry date.",
      expiresAt: user.planExpiresAt
    })
  } catch (error) {
    console.error("Error cancelling subscription:", error)
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}
