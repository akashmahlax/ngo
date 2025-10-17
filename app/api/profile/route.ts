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
      location: user.location,
      skills: user.skills,
      socialLinks: user.socialLinks,
      experience: user.experience,
      education: user.education,
      profileVisibility: user.profileVisibility,
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
    await users.updateOne(
      { _id: userId } as any,
      {
        $set: {
          name: body.name,
          bio: body.bio,
          location: body.location,
          skills: body.skills,
          socialLinks: body.socialLinks,
          experience: body.experience,
          education: body.education,
          profileVisibility: body.profileVisibility,
          updatedAt: new Date(),
        },
      }
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