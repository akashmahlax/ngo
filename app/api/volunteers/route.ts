import { NextRequest, NextResponse } from "next/server"
import { getCollections } from "@/lib/models"

export async function GET(req: NextRequest) {
  const { users } = await getCollections()

  // Parse query parameters
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "6"), 50)
  const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0")
  const sort = req.nextUrl.searchParams.get("sort") || "recent"

  // Build query with proper typing
  const query = { role: "volunteer" as const }

  // Determine sort order
  const sortOrder =
    sort === "rating"
      ? ({ rating: -1, completedProjects: -1 } as const)
      : sort === "projects"
        ? ({ completedProjects: -1 } as const)
        : ({ createdAt: -1 } as const)

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
      bio: 1,
      location: 1,
      hourlyRate: 1,
      ngoHourlyRate: 1,
      availability: 1,
      responseTime: 1,
      currentWorkStatus: 1,
      completedProjects: 1,
      activeProjects: 1,
      successRate: 1,
      rating: 1,
      hoursWorked: 1,
      avatarUrl: 1,
      createdAt: 1,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort(sortOrder as any)
    .skip(skip)
    .limit(limit)
    .toArray()

  return NextResponse.json({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    volunteers: volunteers.map((v: any) => ({
      ...v,
      _id: v._id?.toString(),
    })),
    totalCount: await users.countDocuments(query),
  })
}
