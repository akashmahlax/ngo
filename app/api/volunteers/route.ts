import { NextRequest, NextResponse } from "next/server"
import { getCollections } from "@/lib/models"

export async function GET(req: NextRequest) {
  const { users } = await getCollections()

  // Parse query parameters
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "6"), 50)
  const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0")
  const sort = req.nextUrl.searchParams.get("sort") || "recent"

  // Build query with proper typing
  const query = { role: "volunteer" } as any

  // Get volunteers
  const volunteers = await users
    .find(query)
    .project({
      _id: 1,
      name: 1,
      email: 1,
      role: 1,
      skills: 1,
      title: 1,
    })
    .sort(sort === "recent" ? { createdAt: -1 } : { _id: 1 })
    .skip(skip)
    .limit(limit)
    .toArray()

  return NextResponse.json({
    volunteers: volunteers.map((v: any) => ({
      ...v,
      _id: v._id?.toString(),
    })),
    totalCount: await users.countDocuments(query),
  })
}
