import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import clientPromise from "@/lib/db"

export async function GET() {
  try {
    const admin = await requireAdmin()

    // Only super admins can view settings
    if (admin!.level !== "super") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const settings = await db.collection("settings").findOne({ _id: "platform" as any })

    return NextResponse.json({ settings: settings || {} })
  } catch (error: any) {
    console.error("Admin get settings error:", error)
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()

    // Only super admins can modify settings
    if (admin!.level !== "super") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const body = await request.json()

    const client = await clientPromise
    const db = client.db()

    await db.collection("settings").updateOne(
      { _id: "platform" as any },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
          updatedBy: admin!.id
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Admin save settings error:", error)
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}
