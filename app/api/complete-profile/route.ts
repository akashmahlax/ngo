import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { z } from "zod"

const schema = z.object({
  role: z.enum(["volunteer", "ngo"]),
  plan: z.enum(["volunteer_free", "volunteer_plus", "ngo_base", "ngo_plus"]),
  orgName: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY", details: parsed.error }, { status: 400 })
  }

  const { role, plan, orgName } = parsed.data

  try {
    const { users } = await getCollections()
    const user = await users.findOne({ email: session.user.email })
    if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })

    // Check if user already has a role (shouldn't happen, but safety check)
    if (user.role) {
      return NextResponse.json({ error: "PROFILE_ALREADY_COMPLETE" }, { status: 400 })
    }

    const now = new Date()
    const updateData: any = {
      role,
      plan,
      monthlyApplicationCount: 0,
      monthlyApplicationResetAt: now,
      updatedAt: now,
    }
    
    // If NGO, set orgName
    if (role === "ngo" && orgName) {
      updateData.orgName = orgName
    }
    
    await users.updateOne(
      { _id: user._id },
      { $set: updateData }
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Complete profile error:", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

