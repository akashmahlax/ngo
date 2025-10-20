import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections, type ApplicationDoc, type JobDoc, type UserDoc } from "@/lib/models"
import { canApply, recordApplication } from "@/lib/quotas"
import { z } from "zod"
import { ObjectId } from "mongodb"
import type { Filter } from "mongodb"

const applicationStatuses = [
  "applied",
  "shortlisted",
  "accepted",
  "rejected",
  "withdrawn",
] as const

type ApplicationStatus = (typeof applicationStatuses)[number]

const createSchema = z.object({
  jobId: z.string().min(1),
  coverLetter: z.string().max(5000).optional(),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  try {
    const { applications, jobs, users } = await getCollections()
    type SessionRole = "volunteer" | "ngo"
    const sessionData = session as { userId?: string; role?: SessionRole }
    if (!sessionData.userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
    }

    const userId = new ObjectId(sessionData.userId)
    const role = sessionData.role
    if (role !== "volunteer" && role !== "ngo") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const jobIdParam = searchParams.get("jobId")
    const statusParam = searchParams.get("status") as ApplicationStatus | null

    if (jobIdParam && !ObjectId.isValid(jobIdParam)) {
      return NextResponse.json({ error: "INVALID_JOB_ID" }, { status: 400 })
    }

    if (statusParam && !applicationStatuses.includes(statusParam)) {
      return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 })
    }

    // Build query based on role
    const query: Filter<ApplicationDoc> = role === "volunteer"
      ? { volunteerId: userId }
      : { ngoId: userId }

    if (jobIdParam) {
      query.jobId = new ObjectId(jobIdParam)
    }

    if (statusParam) {
      query.status = statusParam
    }

    // Fetch applications sorted by most recent
    const apps = await applications.find(query).sort({ createdAt: -1 }).toArray()

    // Populate job and NGO/volunteer details
    const jobCache = new Map<string, JobDoc | null>()
    const userCache = new Map<string, UserDoc | null>()

    type EnrichedApplication = {
      _id: string
      status: ApplicationStatus
      appliedAt: Date
      updatedAt: Date
      coverLetter: string
      ngoNotes: string
      rating: number | null
      timeline: Array<{ status: string; date: Date; note?: string }>
      job: {
        _id: string
        title: string
        location?: string
        type?: string
        category?: string
      } | null
      ngo: {
        _id: string
        name?: string
        orgName?: string
        avatarUrl?: string
      } | null
      volunteer: {
        _id: string
        name?: string
        email?: string
        avatarUrl?: string
        location?: string
        skills: string[]
        bio?: string
      } | null
    }

    const enrichedApps: EnrichedApplication[] = await Promise.all(
      apps.map(async (app) => {
        const jobCacheKey = app.jobId.toString()
        const ngoCacheKey = app.ngoId.toString()
        const volunteerCacheKey = app.volunteerId.toString()

        let job = jobCache.get(jobCacheKey)
        if (job === undefined) {
          job = await jobs.findOne({ _id: app.jobId })
          jobCache.set(jobCacheKey, job ?? null)
        }

        let ngo = userCache.get(ngoCacheKey)
        if (ngo === undefined) {
          ngo = await users.findOne({ _id: app.ngoId })
          userCache.set(ngoCacheKey, ngo ?? null)
        }

        let volunteer = userCache.get(volunteerCacheKey)
        if (volunteer === undefined) {
          volunteer = await users.findOne({ _id: app.volunteerId })
          userCache.set(volunteerCacheKey, volunteer ?? null)
        }

        const status = app.status as ApplicationStatus

        return {
          _id: app._id.toString(),
          status,
          appliedAt: app.createdAt,
          updatedAt: app.updatedAt,
          coverLetter: app.coverLetter || "",
          ngoNotes: app.ngoNotes || "",
          rating: app.rating || null,
          timeline: (app.timeline || []).map((entry) => ({
            status: entry.status,
            date: entry.date,
            note: entry.note,
          })),
          job: job ? {
            _id: job._id.toString(),
            title: job.title,
            location: job.location,
            type: job.type,
            category: job.category
          } : null,
          ngo: ngo ? {
            _id: ngo._id.toString(),
            name: ngo.name,
            orgName: ngo.orgName || ngo.name,
            avatarUrl: ngo.avatarUrl
          } : null,
          volunteer: volunteer ? {
            _id: volunteer._id.toString(),
            name: volunteer.name,
            email: volunteer.email,
            avatarUrl: volunteer.avatarUrl,
            location: volunteer.location,
            skills: volunteer.skills || [],
            bio: volunteer.bio,
          } : null
        }
      })
    )

    const statusSummary = enrichedApps.reduce<Record<ApplicationStatus, number>>((acc, app) => {
      acc[app.status] += 1
      return acc
    }, applicationStatuses.reduce((acc, status) => {
      acc[status] = 0
      return acc
    }, {} as Record<ApplicationStatus, number>))

    return NextResponse.json({
      applications: enrichedApps,
      summary: {
        total: enrichedApps.length,
        byStatus: statusSummary,
      }
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  
  const sessionData = session as {
    role?: string
    plan?: string
    planExpiresAt?: string
  }
  
  const role = sessionData.role
  if (role !== "volunteer") return NextResponse.json({ error: "ONLY_VOLUNTEER" }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 })

  const { users, jobs, applications } = await getCollections()
  const user = await users.findOne({ email: session.user.email })
  if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })

  // Check if user has valid plan
  const userPlan = user.plan
  const planExpiresAt = user.planExpiresAt ? new Date(user.planExpiresAt) : null
  const isPlanExpired = planExpiresAt && new Date() > planExpiresAt
  
  // Only volunteer_free and active volunteer_plus can apply
  if (userPlan !== "volunteer_free" && userPlan !== "volunteer_plus") {
    return NextResponse.json({ 
      error: "INVALID_PLAN",
      message: "You need a valid volunteer plan to apply for jobs."
    }, { status: 403 })
  }
  
  if (isPlanExpired) {
    return NextResponse.json({ 
      error: "PLAN_EXPIRED",
      message: "Your plan has expired. Please renew to continue applying for jobs."
    }, { status: 403 })
  }

  const job = await jobs.findOne({ _id: new ObjectId(parsed.data.jobId) })
  if (!job || job.status !== "open") return NextResponse.json({ error: "JOB_UNAVAILABLE" }, { status: 404 })

  const isPlus = user.plan === "volunteer_plus" && !isPlanExpired
  const check = await canApply(user._id.toString(), isPlus)
  if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 402 })

  const existingApplication = await applications.findOne({
    jobId: job._id,
    volunteerId: user._id,
    status: { $ne: "withdrawn" },
  })

  if (existingApplication) {
    return NextResponse.json(
      { error: "ALREADY_APPLIED", message: "You have already applied to this opportunity." },
      { status: 409 }
    )
  }

  const now = new Date()
  const newApplication: Omit<ApplicationDoc, "_id"> = {
    jobId: job._id,
    ngoId: job.ngoId,
    volunteerId: user._id,
    status: "applied" as const,
    coverLetter: parsed.data.coverLetter?.trim() || undefined,
    timeline: [
      {
        status: "applied",
        date: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  }
  // Insert application. Use insertOne with a typed document shape accepted by our driver.
  await applications.insertOne(newApplication as unknown as ApplicationDoc)
  await recordApplication(user._id.toString())

  return NextResponse.json({ ok: true })
}


