import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { canPostJob } from "@/lib/quotas"
import { z } from "zod"
import { ObjectId } from "mongodb"

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().optional(),
  locationType: z.enum(["onsite", "remote", "hybrid"]).optional(),
  skills: z.array(z.string()).optional(),
})

export async function GET() {
  const { jobs } = await getCollections()
  const list = await jobs
    .find({ status: "open" })
    .project({ title: 1, category: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray()
  return NextResponse.json({ jobs: list })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  const role = (session as any).role as string | undefined
  if (role !== "ngo") return NextResponse.json({ error: "ONLY_NGO" }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 })

  const { users, jobs } = await getCollections()
  const user = await users.findOne({ email: session.user.email })
  if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
  const isPlus = user.plan === "ngo_plus"
  const check = await canPostJob(user._id.toString(), isPlus)
  if (!check.ok) return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 402 })

  const now = new Date()
  const { title, description, category, locationType, skills } = parsed.data
  const doc = {
    ngoId: new ObjectId(user._id),
    title,
    description,
    category,
    locationType,
    skills: skills ?? [],
    status: "open" as const,
    createdAt: now,
    updatedAt: now,
  }
  const { insertedId } = await jobs.insertOne(doc as any)
  return NextResponse.json({ jobId: String(insertedId) })
}


