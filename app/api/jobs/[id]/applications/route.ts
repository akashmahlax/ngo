import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest, context: any) {
  const { params } = context
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  try {
    const { jobs, applications, users } = await getCollections()
    
    // Verify job ownership
  const job = await jobs.findOne({ _id: new ObjectId(params.id) })
    if (!job) return NextResponse.json({ error: "JOB_NOT_FOUND" }, { status: 404 })
    
    const user = await users.findOne({ email: session.user.email })
    if (!user || job.ngoId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    }

    // Get applications with volunteer details
    const apps = await applications
      .find({ jobId: job._id })
      .sort({ createdAt: -1 })
      .toArray()

    // Populate volunteer details
    const applicationsWithVolunteers = await Promise.all(
      apps.map(async (app) => {
        const volunteer = await users.findOne({ _id: app.volunteerId })
        return {
          _id: String(app._id),
          volunteerId: String(app.volunteerId),
          status: app.status,
          createdAt: app.createdAt,
          volunteer: volunteer ? {
            name: volunteer.name,
            email: volunteer.email,
            skills: volunteer.skills || [],
            bio: volunteer.bio,
            avatarUrl: volunteer.avatarUrl,
          } : null,
        }
      })
    )

    return NextResponse.json({ applications: applicationsWithVolunteers })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
