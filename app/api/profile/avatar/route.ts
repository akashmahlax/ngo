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

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." 
      }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 5MB." 
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "ngo-platform/avatars",
          public_id: `avatar_${session.user.id}_${Date.now()}`,
          transformation: {
            width: 400,
            height: 400,
            crop: "fill",
            gravity: "face",
            quality: "auto",
          },
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    }) as any

    // Update user in database
    const { users } = await getCollections()
    const userId = new ObjectId((session as any).userId)
    
    // Delete old avatar if exists
    const user = await users.findOne({ _id: userId })
    if (user?.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(user.cloudinaryPublicId)
      } catch (error) {
        console.error("Error deleting old avatar:", error)
      }
    }

    // Update user with new avatar
    await users.updateOne(
      { _id: userId },
      {
        $set: {
          avatarUrl: result.secure_url,
          cloudinaryPublicId: result.public_id,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({
      success: true,
      avatarUrl: result.secure_url,
    })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { users } = await getCollections()
    const userId = new ObjectId((session as any).userId)
    
    const user = await users.findOne({ _id: userId })
    if (!user?.cloudinaryPublicId) {
      return NextResponse.json({ error: "No avatar to delete" }, { status: 404 })
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(user.cloudinaryPublicId)
    } catch (error) {
      console.error("Error deleting avatar from Cloudinary:", error)
    }

    // Remove from database
    await users.updateOne(
      { _id: userId },
      {
        $unset: {
          avatarUrl: "",
          cloudinaryPublicId: "",
        },
        $set: {
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Avatar delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete avatar" },
      { status: 500 }
    )
  }
}
