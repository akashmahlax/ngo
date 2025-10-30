import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { z } from "zod"

const bodySchema = z.object({
  plan: z.enum(["volunteer_free", "ngo_base"]),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 })
  }

  const selectedPlan = parsed.data.plan

  try {
    const { users } = await getCollections()
    const user = await users.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
    }

    if (!user.role) {
      return NextResponse.json({ error: "ROLE_REQUIRED" }, { status: 400 })
    }

    const expectedPlan = user.role === "ngo" ? "ngo_base" : "volunteer_free"
    if (selectedPlan !== expectedPlan) {
      return NextResponse.json({ error: "PLAN_ROLE_MISMATCH" }, { status: 400 })
    }

    if (user.plan === expectedPlan && user.onboardingStep === "completed") {
      return NextResponse.json({ ok: true, plan: expectedPlan })
    }

    const now = new Date()
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          plan: selectedPlan,
          onboardingStep: "completed",
          planActivatedAt: now,
          planExpiresAt: null,
          pendingPlan: null,
          updatedAt: now,
        },
      }
    )

    return NextResponse.json({ ok: true, plan: selectedPlan })
  } catch (error) {
    console.error("assign-plan error:", error)
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}
