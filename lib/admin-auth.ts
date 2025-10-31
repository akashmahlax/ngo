import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function checkAdminAuth() {
  const session = await auth()
  
  if (!session?.user) {
    return { authorized: false, admin: null, error: "Unauthorized" }
  }

  const sessionData = session as { userId?: string; role?: string }
  if (!sessionData.userId) {
    return { authorized: false, admin: null, error: "Invalid session" }
  }

  const { users } = await getCollections()
  const userId = new ObjectId(sessionData.userId)
  
  const user = await users.findOne({ _id: userId })
  
  if (!user) {
    return { authorized: false, admin: null, error: "User not found" }
  }

  if (!user.isAdmin) {
    return { authorized: false, admin: null, error: "Admin access required" }
  }

  if (user.banned) {
    return { authorized: false, admin: null, error: "Account banned" }
  }

  return { 
    authorized: true, 
    admin: {
      id: user._id,
      email: user.email,
      name: user.name,
      level: user.adminLevel || "moderator",
      permissions: user.adminPermissions || []
    },
    error: null 
  }
}

export async function requireAdmin() {
  const result = await checkAdminAuth()
  if (!result.authorized) {
    throw new Error(result.error || "Unauthorized")
  }
  return result.admin
}
