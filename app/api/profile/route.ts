import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"

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
      name: user.name,
      bio: user.bio,
      description: user.description,
      location: user.location,
      skills: user.skills,
      socialLinks: user.socialLinks,
      experience: user.experience,
      education: user.education,
      profileVisibility: user.profileVisibility,
      avatarUrl: user.avatarUrl,
      coverPhotoUrl: user.coverPhotoUrl,
      // NGO specific fields
      orgName: user.orgName,
      website: user.website,
      orgType: user.orgType,
      registrationNumber: user.registrationNumber,
      yearEstablished: user.yearEstablished,
      phone: user.phone,
      address: user.address,
      focusAreas: user.focusAreas,
      teamSize: user.teamSize,
      verified: user.verified,
      impactStats: user.impactStats || {
        volunteersHelped: 0,
        projectsCompleted: 0,
        peopleImpacted: 0,
      },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
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

    // Update user profile
    const updateData: any = {
      name: body.name,
      bio: body.bio,
      description: body.description,
      location: body.location,
      skills: body.skills,
      socialLinks: body.socialLinks,
      experience: body.experience,
      education: body.education,
      profileVisibility: body.profileVisibility,
      // NGO specific fields
      orgName: body.orgName,
      website: body.website,
      orgType: body.orgType,
      registrationNumber: body.registrationNumber,
      yearEstablished: body.yearEstablished,
      phone: body.phone,
      address: body.address,
      focusAreas: body.focusAreas,
      teamSize: body.teamSize,
      verified: body.verified,
      impactStats: body.impactStats,
      updatedAt: new Date(),
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    await users.updateOne(
      { _id: userId } as any,
      { $set: updateData }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}