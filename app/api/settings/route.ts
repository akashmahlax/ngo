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