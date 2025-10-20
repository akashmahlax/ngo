import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"
import { z } from "zod"

const schema = z.object({
  status: z.enum(["applied", "shortlisted", "accepted", "rejected", "withdrawn"]).optional(),
  ngoNotes: z.string().max(5000).optional(),
  rating: z.union([z.number().min(1).max(5), z.null()]).optional(),
})

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { params } = context
  const resolvedParams = await params
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  
  type SessionWithRole = typeof session & { role?: "volunteer" | "ngo" }
  const role = (session as SessionWithRole).role

  const { users, applications, jobs } = await getCollections()
  const user = await users.findOne({ email: session.user.email })
  if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })

  const app = await applications.findOne({ _id: new ObjectId(resolvedParams.id) })
  if (!app) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 })

  const { status, ngoNotes, rating } = parsed.data

  // Authorization
  if (role === "ngo") {
    const job = await jobs.findOne({ _id: app.jobId })
    if (!job || String(job.ngoId) !== String(user._id)) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    if (status === "withdrawn") {
      return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 })
    }
  } else if (role === "volunteer") {
    if (String(app.volunteerId) !== String(user._id)) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    // Volunteers can only withdraw
    if (status && status !== "withdrawn") {
      return NextResponse.json({ error: "VOLUNTEERS_CAN_ONLY_WITHDRAW" }, { status: 403 })
    }
    if (ngoNotes !== undefined || rating !== undefined) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    }
  } else {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  // Build update object
  const now = new Date()
  const updateFields: Record<string, unknown> = { updatedAt: now }

  const nextStatus = status && status !== app.status ? status : undefined
  if (nextStatus) {
    updateFields.status = nextStatus
  }
  if (ngoNotes !== undefined) {
    updateFields.ngoNotes = ngoNotes
  }
  if (rating !== undefined) {
    updateFields.rating = rating ?? null
  }

  const updateQuery: Record<string, unknown> = {
    $set: updateFields,
  }

  if (nextStatus) {
    updateQuery.$push = {
      timeline: {
        status: nextStatus,
        date: now,
        note: role === "volunteer" ? "Volunteer withdrew application" : ngoNotes || undefined,
      },
    }
  }

  await applications.updateOne({ _id: app._id }, updateQuery)

  const result = await applications.findOne({ _id: app._id })
  if (!result) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  }

  return NextResponse.json({
    ok: true,
    application: {
      _id: result._id.toString(),
      status: result.status,
      ngoNotes: result.ngoNotes ?? "",
      rating: result.rating ?? null,
      updatedAt: result.updatedAt,
      timeline: (result.timeline ?? []).map((entry) => ({
        status: entry.status,
        date: entry.date,
        note: entry.note,
      })),
    },
  })
}


