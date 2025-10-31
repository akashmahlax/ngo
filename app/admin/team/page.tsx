import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/lib/admin-auth"
import { getCollections } from "@/lib/models"
import { AdminTeamManager } from "@/components/admin/admin-team-manager"
import { ObjectId } from "mongodb"

const ADMIN_LEVELS = ["super", "moderator", "support"] as const

type AdminLevel = (typeof ADMIN_LEVELS)[number]

type AdminDoc = {
  _id: ObjectId
  name?: string
  orgName?: string
  email: string
  role?: string
  adminLevel?: AdminLevel
  adminPermissions?: string[]
  createdAt: Date
  lastLoginAt?: Date | null
}

function serializeAdmin(doc: AdminDoc) {
  const id = doc._id instanceof ObjectId ? doc._id.toHexString() : String(doc._id)
  return {
    id,
    name: doc.name || doc.orgName || doc.email,
    email: doc.email,
    role: doc.role,
    adminLevel: ADMIN_LEVELS.includes(doc.adminLevel as AdminLevel)
      ? (doc.adminLevel as AdminLevel)
      : "moderator",
    adminPermissions: Array.isArray(doc.adminPermissions) ? doc.adminPermissions : [],
    createdAt: doc.createdAt?.toISOString?.() || new Date().toISOString(),
    lastLoginAt: doc.lastLoginAt && doc.lastLoginAt instanceof Date ? doc.lastLoginAt.toISOString() : null,
  }
}

export default async function AdminTeamPage() {
  const authResult = await checkAdminAuth()

  if (!authResult.authorized) {
    redirect("/signin")
  }

  const { users } = await getCollections()
  const adminDocs = await users
    .find({ isAdmin: true })
    .sort({ createdAt: 1 })
    .toArray()

  const admins = adminDocs.map((doc) => serializeAdmin(doc as unknown as AdminDoc))

  return (
    <div className="container mx-auto max-w-6xl space-y-6 py-8">
      <AdminTeamManager initialAdmins={admins} />
    </div>
  )
}
