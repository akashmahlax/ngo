import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"

const bodySchema = z.object({
  role: z.enum(["volunteer", "ngo"]),
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

  const { role } = parsed.data

  try {
    const { users } = await getCollections()
    const user = await users.findOne({ email: session.user.email })
    if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })

    // If role is already set, don't override
    if (user.role === "volunteer" || user.role === "ngo") {
      return NextResponse.json({ ok: true, role: user.role, plan: user.plan })
    }

    const freePlan = role === "ngo" ? "ngo_base" : "volunteer_free"
    const now = new Date()

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          role,
          plan: freePlan,
          planActivatedAt: now,
          planExpiresAt: null,
          pendingPlan: null,
          updatedAt: now,
        },
      }
    )

    return NextResponse.json({ ok: true, role, plan: freePlan })
  } catch (e) {
    console.error("assign-role error:", e)
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}
