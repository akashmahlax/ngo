import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { users, jobs, applications } = await getCollections()
    const userId = new ObjectId((session as any).userId)
    const role = (session as any).role || "volunteer"

    // Get user to check for avatar
    const user = await users.findOne({ _id: userId } as any)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user's avatar from Cloudinary if exists
    if (user.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(user.cloudinaryPublicId)
      } catch (error) {
        console.error("Error deleting avatar from Cloudinary:", error)
      }
    }

    // Delete user data based on role
    if (role === "ngo") {
      // Delete NGO's jobs
      const ngoJobs = await jobs.find({ ngoId: userId }).toArray()
      const jobIds = ngoJobs.map(job => job._id)
      
      // Delete applications for NGO's jobs
      if (jobIds.length > 0) {
        await applications.deleteMany({ jobId: { $in: jobIds } })
      }
      
      // Delete NGO's jobs
      await jobs.deleteMany({ ngoId: userId })
      
      // Delete applications where this NGO is the volunteer
      await applications.deleteMany({ volunteerId: userId })
    } else {
      // Delete volunteer's applications
      await applications.deleteMany({ volunteerId: userId })
    }

    // Delete user account
    await users.deleteOne({ _id: userId } as any)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Account deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    )
  }
}