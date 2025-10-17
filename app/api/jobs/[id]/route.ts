import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"
import { z } from "zod"

export async function GET(_req: NextRequest, context: any) {
  const { params } = context
  const { jobs } = await getCollections()
  const job = await jobs.findOne({ _id: new ObjectId(params.id) })
  if (!job) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  return NextResponse.json({ job })
}

const patchSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  status: z.enum(["open", "closed"]).optional(),
})

export async function PATCH(req: NextRequest, context: any) {
  const { params } = context
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const { users, jobs } = await getCollections()
  const user = await users.findOne({ email: session.user.email })
  if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })

  const job = await jobs.findOne({ _id: new ObjectId(params.id) })
  if (!job) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  if (job.ngoId.toString() !== user._id.toString()) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 })

  const update: any = { ...parsed.data, updatedAt: new Date() }
  await jobs.updateOne({ _id: job._id }, { $set: update })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, context: any) {
  const { params } = context
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const { users, jobs } = await getCollections()
  const user = await users.findOne({ email: session.user.email })
  if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })

  const job = await jobs.findOne({ _id: new ObjectId(params.id) })
  if (!job) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  if (job.ngoId.toString() !== user._id.toString()) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })

  await jobs.deleteOne({ _id: job._id })
  return NextResponse.json({ ok: true })
}


