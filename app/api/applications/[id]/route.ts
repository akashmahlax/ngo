import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"
import { z } from "zod"

const schema = z.object({ 
  status: z.enum(["applied", "shortlisted", "accepted", "rejected", "withdrawn"]).optional(),
  ngoNotes: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
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

  // Authorization
  if (role === "ngo") {
    const job = await jobs.findOne({ _id: app.jobId })
    if (!job || String(job.ngoId) !== String(user._id)) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  } else if (role === "volunteer") {
    if (String(app.volunteerId) !== String(user._id)) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    // Volunteers can only withdraw
    if (parsed.data.status && parsed.data.status !== "withdrawn") {
      return NextResponse.json({ error: "VOLUNTEERS_CAN_ONLY_WITHDRAW" }, { status: 403 })
    }
  } else {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  // Build update object
  const updateObj: Record<string, Date | string | number> = {
    updatedAt: new Date()
  }

  if (parsed.data.status) {
    updateObj.status = parsed.data.status
  }
  if (parsed.data.ngoNotes !== undefined) {
    updateObj.ngoNotes = parsed.data.ngoNotes
  }
  if (parsed.data.rating !== undefined) {
    updateObj.rating = parsed.data.rating
  }

  // Add timeline entry if status changed
  const timelineUpdate = parsed.data.status ? {
    $push: {
      timeline: {
        status: parsed.data.status,
        date: new Date(),
        note: parsed.data.ngoNotes || undefined,
      }
    }
  } : {}

  await applications.updateOne(
    { _id: app._id },
    { $set: updateObj, ...timelineUpdate }
  )

  return NextResponse.json({ ok: true, status: parsed.data.status || app.status })
}


