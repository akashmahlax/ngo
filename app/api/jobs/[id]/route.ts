import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"
import { z } from "zod"

export async function GET(_req: NextRequest, context: any) {
  try {
    const { params } = context
    const { id } = params

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "INVALID_ID" }, { status: 400 })
    }

    const { jobs, users } = await getCollections()
    
    // Find the job
    const job = await jobs.findOne({ _id: new ObjectId(id) })
    if (!job) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
    }

    // Find the NGO details
    const ngo = await users.findOne(
      { _id: job.ngoId },
      { 
        projection: { 
          _id: 1,
          orgName: 1, 
          name: 1,
          verified: 1, 
          logoUrl: 1, 
          plan: 1,
          focusAreas: 1,
          location: 1,
          description: 1,
          yearEstablished: 1,
          teamSize: 1,
          website: 1
        } 
      }
    )

    // Increment view count
    await jobs.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { viewCount: 1 } }
    )

    // Return enriched job data
    return NextResponse.json({
      job: {
        ...job,
        _id: job._id.toString(),
        ngoId: job.ngoId.toString(),
        ngo: ngo ? {
          _id: ngo._id.toString(),
          name: ngo.orgName || ngo.name,
          verified: ngo.verified || false,
          logoUrl: ngo.logoUrl,
          plan: ngo.plan,
          focusAreas: ngo.focusAreas,
          location: ngo.location,
          description: ngo.description,
          yearEstablished: ngo.yearEstablished,
          teamSize: ngo.teamSize,
          website: ngo.website
        } : null
      }
    })
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
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


