import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const sessionWithRole = session as { role?: string; plan?: string }
  const role = sessionWithRole.role

  if (role !== "ngo") {
    return NextResponse.json({ error: "ONLY_NGO" }, { status: 403 })
  }

  const { users, jobs } = await getCollections()
  const user = await users.findOne({ email: session.user.email })
  
  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
  }

  const plan = user.plan || "ngo_base"
  const isPlus = plan === "ngo_plus"
  const baseLimit = 3

  // Count active jobs
  const active = await jobs.countDocuments({ 
    ngoId: new ObjectId(user._id), 
    status: "open" 
  })

  return NextResponse.json({
    active,
    limit: isPlus ? 999 : baseLimit,
    isPlus,
    canPost: isPlus || active < baseLimit,
    plan
  })
}
