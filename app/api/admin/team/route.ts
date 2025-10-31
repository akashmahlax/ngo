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

export async function GET() {
  try {
    await requireAdmin()

    const { users } = await getCollections()
    const admins = await users
      .find({ isAdmin: true })
      .sort({ createdAt: 1 })
      .toArray()

    return NextResponse.json({
      admins: admins.map((admin) => serializeAdmin(admin)),
    })
  } catch (error: any) {
    console.error("Error fetching admin team:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin team" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const rawEmail: unknown = body.email
    const rawUserId: unknown = body.userId
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : ""
    const level: AdminLevel = ADMIN_LEVELS.includes(body.level) ? body.level : "moderator"
    const permissions: string[] = Array.isArray(body.permissions)
      ? body.permissions.map((p: unknown) => String(p))
      : []

    const { users } = await getCollections()
    let query: Record<string, unknown> | null = null

    if (typeof rawUserId === "string" && ObjectId.isValid(rawUserId)) {
      query = { _id: new ObjectId(rawUserId) }
    } else if (email && email.includes("@")) {
      query = { email }
    }

    if (!query) {
      return NextResponse.json({ error: "Provide a valid email or user id" }, { status: 400 })
    }

    const user = await users.findOne(query)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.isAdmin) {
      return NextResponse.json({ error: "User is already an admin" }, { status: 409 })
    }

    if (user.banned) {
      return NextResponse.json({ error: "Banned users cannot be promoted" }, { status: 400 })
    }

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          isAdmin: true,
          adminLevel: level,
          adminPermissions: permissions,
          updatedAt: new Date(),
        },
      }
    )

    const updated = await users.findOne({ _id: user._id })

    return NextResponse.json(
      { admin: serializeAdmin(updated) },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error promoting admin:", error)
    return NextResponse.json(
      { error: error.message || "Failed to promote admin" },
      { status: 500 }
    )
  }
}
