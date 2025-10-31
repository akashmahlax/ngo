import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import clientPromise from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const [order] = await db
      .collection("orders")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$user", 0] }
          }
        },
        {
          $project: {
            "user.password": 0,
            "user.sessions": 0
          }
        }
      ])
      .toArray()

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })
  } catch (error: any) {
    console.error("Admin get order error:", error)
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}
