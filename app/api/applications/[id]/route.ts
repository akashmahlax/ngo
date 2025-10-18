import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"
import { z } from "zod"

const schema = z.object({ 
  status: z.enum(["applied", "shortlisted", "accepted", "rejected", "withdrawn"]) 
})

export async function PATCH(req: NextRequest, context: any) {
  const { params } = context
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  const role = (session as any).role

  const { users, applications, jobs } = await getCollections()
  const user = await users.findOne({ email: session.user.email })
  if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })

  const app = await applications.findOne({ _id: new ObjectId(params.id) })
  if (!app) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 })

  if (role === "ngo") {
    const job = await jobs.findOne({ _id: app.jobId })
    if (!job || String(job.ngoId) !== String(user._id)) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  } else if (role === "volunteer") {
    if (String(app.volunteerId) !== String(user._id)) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  } else {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  await applications.updateOne(
    { _id: app._id },
    { $set: { status: parsed.data.status, updatedAt: new Date() } }
  )

  return NextResponse.json({ ok: true })
}


