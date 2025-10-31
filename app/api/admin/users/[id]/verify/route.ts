import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const body = await request.json()

    const { id } = await params
    const { users } = await getCollections()
    const userId = new ObjectId(id)

    const user = await users.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.role !== "ngo") {
      return NextResponse.json(
        { error: "Only NGOs can be verified" },
        { status: 400 }
      )
    }

    await users.updateOne(
      { _id: userId },
      { 
        $set: { 
          verified: body.verified,
          updatedAt: new Date()
        } 
      }
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating verification:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update verification" },
      { status: 500 }
    )
  }
}
