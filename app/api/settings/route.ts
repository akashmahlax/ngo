import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { users } = await getCollections()
    const userId = new ObjectId((session as any).userId)
    
    const user = await users.findOne({ _id: userId } as any)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      email: user.email,
      name: user.name,
      title: user.title,
      bio: user.bio,
      location: user.location,
      skills: user.skills,
      hourlyRate: user.hourlyRate,
      ngoHourlyRate: user.ngoHourlyRate,
      availability: user.availability,
      responseTime: user.responseTime,
      currentWorkStatus: user.currentWorkStatus,
      completedProjects: user.completedProjects,
      activeProjects: user.activeProjects,
      successRate: user.successRate,
      rating: user.rating,
      notifications: user.notifications || {
        emailApplications: true,
        emailMessages: true,
        emailUpdates: false,
      },
      privacy: user.privacy || {
        profileVisibility: "public",
        showEmail: false,
      },
    })
  } catch (error) {
    console.error("Settings fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { users } = await getCollections()
    const userId = new ObjectId((session as any).userId)

    // Update user settings
    const updateData: any = {
      updatedAt: new Date(),
    }

    // Update email if provided
    if (body.email && body.email !== session.user.email) {
      // Check if email is already taken
      const existingUser = await users.findOne({ 
        email: body.email,
        _id: { $ne: userId }
      } as any)
      
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        )
      }
      
      updateData.email = body.email
    }

    // Update notifications if provided
    if (body.notifications) {
      updateData.notifications = body.notifications
    }

    // Update privacy settings if provided
    if (body.privacy) {
      updateData.privacy = body.privacy
    }

    // Update profile settings if provided
    if (body.profile) {
      if (body.profile.name !== undefined) updateData.name = body.profile.name
      if (body.profile.title !== undefined) updateData.title = body.profile.title
      if (body.profile.bio !== undefined) updateData.bio = body.profile.bio
      if (body.profile.location !== undefined) updateData.location = body.profile.location
      if (body.profile.skills !== undefined) updateData.skills = body.profile.skills
      if (body.profile.hourlyRate !== undefined) updateData.hourlyRate = body.profile.hourlyRate
      if (body.profile.ngoHourlyRate !== undefined) updateData.ngoHourlyRate = body.profile.ngoHourlyRate
      if (body.profile.availability !== undefined) updateData.availability = body.profile.availability
      if (body.profile.responseTime !== undefined) updateData.responseTime = body.profile.responseTime
      if (body.profile.currentWorkStatus !== undefined) updateData.currentWorkStatus = body.profile.currentWorkStatus
      if (body.profile.completedProjects !== undefined) updateData.completedProjects = body.profile.completedProjects
      if (body.profile.activeProjects !== undefined) updateData.activeProjects = body.profile.activeProjects
      if (body.profile.successRate !== undefined) updateData.successRate = body.profile.successRate
      if (body.profile.rating !== undefined) updateData.rating = body.profile.rating
    }

    await users.updateOne(
      { _id: userId } as any,
      { $set: updateData }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}