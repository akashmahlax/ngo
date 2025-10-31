import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin()
    const body = await request.json()

    const { id } = await params
    const { users } = await getCollections()
    const userId = new ObjectId(id)

    const user = await users.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't allow banning other admins
    if (user.isAdmin) {
      return NextResponse.json(
        { error: "Cannot ban admin users" },
        { status: 403 }
      )
    }

    const updateData: any = {
      banned: body.banned,
      updatedAt: new Date()
    }

    if (body.banned) {
      updateData.bannedAt = new Date()
      updateData.bannedReason = body.reason || "No reason provided"
      updateData.bannedBy = admin!.id
    } else {
      updateData.bannedAt = null
      updateData.bannedReason = null
      updateData.bannedBy = null
    }

    await users.updateOne(
      { _id: userId },
      { $set: updateData }
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating ban status:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update ban status" },
      { status: 500 }
    )
  }
}
