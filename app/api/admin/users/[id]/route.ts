import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const { id } = await params
    const { users, jobs, applications } = await getCollections()
    const userId = new ObjectId(id)

    const user = await users.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user stats
    let stats: any = {}
    
    if (user.role === "volunteer") {
      stats.totalApplications = await applications.countDocuments({ volunteerId: userId })
      stats.acceptedApplications = await applications.countDocuments({ 
        volunteerId: userId, 
        status: "accepted" 
      })
      stats.pendingApplications = await applications.countDocuments({ 
        volunteerId: userId, 
        status: "applied" 
      })
    } else if (user.role === "ngo") {
      stats.totalJobs = await jobs.countDocuments({ ngoId: userId })
      stats.activeJobs = await jobs.countDocuments({ ngoId: userId, status: "open" })
      stats.totalApplications = await applications.countDocuments({ ngoId: userId })
    }

    return NextResponse.json({ user, stats })
  } catch (error: any) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch user" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin()

    const { id } = await params
    const { users, jobs, applications } = await getCollections()
    const userId = new ObjectId(id)

    const user = await users.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't allow deleting other admins
    if (user.isAdmin) {
      return NextResponse.json(
        { error: "Cannot delete admin users" },
        { status: 403 }
      )
    }

    // Delete user's data
    if (user.role === "ngo") {
      // Delete NGO's jobs
      const ngoJobs = await jobs.find({ ngoId: userId }).toArray()
      const jobIds = ngoJobs.map(job => job._id)
      
      // Delete applications for NGO's jobs
      if (jobIds.length > 0) {
        await applications.deleteMany({ jobId: { $in: jobIds } })
      }
      
      // Delete NGO's jobs
      await jobs.deleteMany({ ngoId: userId })
    } else {
      // Delete volunteer's applications
      await applications.deleteMany({ volunteerId: userId })
    }

    // Delete user
    await users.deleteOne({ _id: userId })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    )
  }
}
