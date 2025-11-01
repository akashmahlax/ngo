import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"

const VALID_ROLES = ["volunteer", "ngo", "admin"] as const
const ADMIN_LEVELS = ["super", "moderator", "support"] as const

type UserRole = (typeof VALID_ROLES)[number]
type AdminLevel = (typeof ADMIN_LEVELS)[number]

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const newRole: UserRole | undefined = VALID_ROLES.includes(body.role) ? body.role : undefined
    const makeAdmin: boolean = body.makeAdmin === true
    const adminLevel: AdminLevel | undefined = ADMIN_LEVELS.includes(body.adminLevel)
      ? body.adminLevel
      : undefined
    const adminPermissions: string[] | undefined = Array.isArray(body.adminPermissions)
      ? body.adminPermissions.map((p: unknown) => String(p))
      : undefined

    if (!newRole && !makeAdmin) {
      return NextResponse.json(
        { error: "Provide a role or makeAdmin flag" },
        { status: 400 }
      )
    }

    const { users } = await getCollections()
    const userId = new ObjectId(id)
    const user = await users.findOne({ _id: userId })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.banned) {
      return NextResponse.json(
        { error: "Cannot change role of banned users" },
        { status: 400 }
      )
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }

    // Handle role change
    if (newRole) {
      if (newRole === "admin") {
        // Promoting to admin
        updates.isAdmin = true
        updates.adminLevel = adminLevel || "moderator"
        updates.adminPermissions = adminPermissions || ["manage_users"]
        // Keep their existing volunteer/ngo role if they have one
      } else {
        // Changing between volunteer and ngo
        updates.role = newRole
        
        // If they were an admin-only user, they now have a role
        // but we don't remove admin privileges unless explicitly requested
      }
    }

    // Handle explicit admin promotion
    if (makeAdmin) {
      updates.isAdmin = true
      updates.adminLevel = adminLevel || "moderator"
      updates.adminPermissions = adminPermissions || ["manage_users"]
    }

    await users.updateOne({ _id: userId }, { $set: updates })

    const updated = await users.findOne({ _id: userId })

    if (!updated) {
      return NextResponse.json({ error: "User not found after update" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: updated._id.toString(),
        name: updated.name || updated.orgName,
        email: updated.email,
        role: updated.role,
        isAdmin: updated.isAdmin || false,
        adminLevel: updated.adminLevel,
        adminPermissions: updated.adminPermissions || [],
      },
    })
  } catch (error: any) {
    console.error("Error changing user role:", error)
    return NextResponse.json(
      { error: error.message || "Failed to change user role" },
      { status: 500 }
    )
  }
}
