import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { z } from "zod"

const bodySchema = z.object({ 
  newRole: z.enum(["volunteer", "ngo"]) 
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  try {
    const json = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 })
    }

    const { newRole } = parsed.data
    const { users } = await getCollections()
    
    const user = await users.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
    }

    // Check if already this role
    if (user.role === newRole) {
      return NextResponse.json({ error: "ALREADY_THIS_ROLE" }, { status: 400 })
    }

    // Determine the free plan for new role
    const newFreePlan = newRole === "volunteer" ? "volunteer_free" : "ngo_base"

    // Switch role and downgrade to free plan (they can upgrade after)
    await users.updateOne(
      { _id: user._id },
      { 
        $set: { 
          role: newRole,
          plan: newFreePlan,
          planExpiresAt: null,
          planActivatedAt: null,
          planCancelled: false,
          planCancelledAt: null,
          updatedAt: new Date()
        } 
      }
    )

    return NextResponse.json({ 
      success: true,
      message: `Role switched to ${newRole}. You are now on the free plan.`,
      newRole,
      newPlan: newFreePlan
    })
  } catch (error) {
    console.error("Error switching role:", error)
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}
