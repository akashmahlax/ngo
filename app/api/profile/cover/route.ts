import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"

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

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file, "cover-photos")

    // Update user in database
    const { users } = await getCollections()
    const userId = new ObjectId((session as any).userId)

    // Delete old cover photo if exists
    const user = await users.findOne({ _id: userId } as any)
    if (user?.coverPhotoPublicId) {
      await deleteFromCloudinary(user.coverPhotoPublicId)
    }

    await users.updateOne(
      { _id: userId } as any,
      {
        $set: {
          coverPhotoUrl: result.url,
          coverPhotoPublicId: result.publicId,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({
      coverPhotoUrl: result.url,
      coverPhotoPublicId: result.publicId,
    })
  } catch (error) {
    console.error("Cover photo upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload cover photo" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { users } = await getCollections()
    const userId = new ObjectId((session as any).userId)

    const user = await users.findOne({ _id: userId } as any)
    if (user?.coverPhotoPublicId) {
      await deleteFromCloudinary(user.coverPhotoPublicId)
    }

    await users.updateOne(
      { _id: userId } as any,
      {
        $set: {
          updatedAt: new Date(),
        },
        $unset: {
          coverPhotoUrl: "",
          coverPhotoPublicId: "",
        },
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cover photo deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete cover photo" },
      { status: 500 }
    )
  }
}
