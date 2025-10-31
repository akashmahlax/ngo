import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"

const ADMIN_LEVELS = ["super", "moderator", "support"] as const

type AdminLevel = (typeof ADMIN_LEVELS)[number]

type AdminResponse = {
  id: string
  name: string
  email: string
  role?: string
  adminLevel: AdminLevel
  adminPermissions: string[]
  createdAt: string
  lastLoginAt: string | null
}

function serializeAdmin(user: any): AdminResponse {
  return {
    id: user._id instanceof ObjectId ? user._id.toString() : String(user._id),
    name: user.name || user.orgName || user.email,
    email: user.email,
    role: user.role,
    adminLevel: ADMIN_LEVELS.includes(user.adminLevel) ? user.adminLevel : "moderator",
    adminPermissions: Array.isArray(user.adminPermissions) ? user.adminPermissions : [],
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : new Date().toISOString(),
    lastLoginAt: user.lastLoginAt instanceof Date ? user.lastLoginAt.toISOString() : null,
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const level: AdminLevel | undefined = ADMIN_LEVELS.includes(body.level)
      ? body.level
      : undefined
    const permissions: string[] | undefined = Array.isArray(body.permissions)
      ? body.permissions.map((p: unknown) => String(p))
      : undefined

    if (!level && !permissions) {
      return NextResponse.json(
        { error: "No changes provided" },
        { status: 400 }
      )
    }

    const { users } = await getCollections()
    const userId = new ObjectId(id)
    const user = await users.findOne({ _id: userId })

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (level) updates.adminLevel = level
    if (permissions) updates.adminPermissions = permissions

    await users.updateOne({ _id: userId }, { $set: updates })

    const updated = await users.findOne({ _id: userId })

    return NextResponse.json({ admin: serializeAdmin(updated) })
  } catch (error: any) {
    console.error("Error updating admin:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update admin" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actingAdmin = await requireAdmin()
    const { id } = await params

    const { users } = await getCollections()
    const targetId = new ObjectId(id)
    const actingAdminId = actingAdmin?.id instanceof ObjectId
      ? actingAdmin.id.toString()
      : actingAdmin?.id

    if (actingAdminId && String(actingAdminId) === id) {
      return NextResponse.json(
        { error: "You cannot remove yourself from the admin team" },
        { status: 400 }
      )
    }

    const target = await users.findOne({ _id: targetId })
    if (!target || !target.isAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    const adminCount = await users.countDocuments({ isAdmin: true })
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "At least one admin must remain" },
        { status: 400 }
      )
    }

    await users.updateOne(
      { _id: targetId },
      {
        $set: { updatedAt: new Date() },
        $unset: { isAdmin: "", adminLevel: "", adminPermissions: "" },
      }
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error removing admin:", error)
    return NextResponse.json(
      { error: error.message || "Failed to remove admin" },
      { status: 500 }
    )
  }
}
