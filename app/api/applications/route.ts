import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { canApply, recordApplication } from "@/lib/quotas"
import { z } from "zod"
import { ObjectId } from "mongodb"

const createSchema = z.object({ jobId: z.string().min(1) })

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  const role = (session as any).role
  if (role !== "volunteer") return NextResponse.json({ error: "ONLY_VOLUNTEER" }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 })

  const { users, jobs, applications } = await getCollections()
  const user = await users.findOne({ email: session.user.email })
  if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })

  const job = await jobs.findOne({ _id: new ObjectId(parsed.data.jobId) })
  if (!job || job.status !== "open") return NextResponse.json({ error: "JOB_UNAVAILABLE" }, { status: 404 })

  const isPlus = user.plan === "volunteer_plus"
  const check = await canApply(user._id.toString(), isPlus)
  if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 402 })

  const now = new Date()
  await applications.insertOne({
    jobId: job._id,
    ngoId: job.ngoId,
    volunteerId: user._id,
    status: "applied" as const,
    createdAt: now,
    updatedAt: now,
  })
  await recordApplication(user._id.toString())

  return NextResponse.json({ ok: true })
}


