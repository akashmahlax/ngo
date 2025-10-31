import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import clientPromise from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const [job] = await db
      .collection("jobs")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "users",
            localField: "ngoId",
            foreignField: "_id",
            as: "ngo"
          }
        },
        {
          $lookup: {
            from: "applications",
            localField: "_id",
            foreignField: "jobId",
            as: "applications"
          }
        },
        {
          $addFields: {
            ngo: { $arrayElemAt: ["$ngo", 0] },
            applicationCount: { $size: "$applications" }
          }
        },
        {
          $project: {
            applications: 0,
            "ngo.password": 0,
            "ngo.sessions": 0
          }
        }
      ])
      .toArray()

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ job })
  } catch (error: any) {
    console.error("Admin get job error:", error)
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
        { status: 400 }
      )
    }

    // Only super admins and moderators can delete jobs
    if (admin!.level !== "super" && admin!.level !== "moderator") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    // Delete the job
    const result = await db.collection("jobs").deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // Also delete all applications for this job
    await db.collection("applications").deleteMany({
      jobId: new ObjectId(id)
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Admin delete job error:", error)
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}
