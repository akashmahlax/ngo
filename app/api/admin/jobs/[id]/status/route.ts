import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import clientPromise from "@/lib/db"
import { ObjectId } from "mongodb"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const body = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
        { status: 400 }
      )
    }

    // Only super admins and moderators can change job status
    if (admin!.level !== "super" && admin!.level !== "moderator") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const { status, reason } = body

    if (!status || !["open", "closed"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be 'open' or 'closed'" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const updateData: any = {
      status,
      moderatedBy: admin!.id,
      moderatedAt: new Date()
    }

    if (status === "closed" && reason) {
      updateData.moderationNotes = reason
    }

    const result = await db.collection("jobs").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Admin job status error:", error)
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}
