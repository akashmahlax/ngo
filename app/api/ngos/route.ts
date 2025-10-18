import { NextRequest, NextResponse } from "next/server"
import { getCollections } from "@/lib/models"

export async function GET(req: NextRequest) {
  const { users, jobs } = await getCollections()

  // Parse query parameters
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "6"), 50)
  const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0")
  const sort = req.nextUrl.searchParams.get("sort") || "active"

  // Build query
  const query = { role: "ngo" } as any

  // Get NGOs
  const ngos = await users
    .find(query)
    .project({
      _id: 1,
      name: 1,
      email: 1,
      description: 1,
      category: 1,
    })
    .sort(sort === "active" ? { createdAt: -1 } : { _id: 1 })
    .skip(skip)
    .limit(limit)
    .toArray()

  // Enrich with active job count
  const enriched = await Promise.all(
    ngos.map(async (ngo: any) => {
      const activeJobs = await jobs.countDocuments({
        ngoId: ngo._id,
        status: "open",
      })
      return {
        ...ngo,
        _id: ngo._id?.toString(),
        activeJobs,
      }
    })
  )

  return NextResponse.json({
    ngos: enriched,
    totalCount: await users.countDocuments(query),
  })
}
