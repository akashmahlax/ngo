import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getCollections, type JobDoc } from "@/lib/models"
import { canPostJob } from "@/lib/quotas"
import { z } from "zod"
import { ObjectId } from "mongodb"

const createSchema = z.object({
  // Basic Information
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  category: z.string().min(1),
  locationType: z.enum(["onsite", "remote", "hybrid"]),
  location: z.string().optional(),
  timezone: z.enum(["IST", "EST", "PST", "GMT", "CST", "JST", "AEST"]).optional(),
  
  // Description & Requirements
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  
  // Position Details
  duration: z.string().optional(),
  commitment: z.enum(["full-time", "part-time", "flexible"]).optional(),
  applicationDeadline: z.string().optional(),
  numberOfPositions: z.number().min(1).optional(),
  startDate: z.string().optional(),
  
  // Experience & Qualifications
  experienceLevel: z.enum(["entry", "intermediate", "advanced", "any"]).optional(),
  educationRequired: z.enum(["high-school", "bachelors", "masters", "phd", "none"]).optional(),
  languagesRequired: z.array(z.string()).optional(),
  certificationRequired: z.string().optional(),
  
  // Work Arrangement
  remoteWorkPolicy: z.enum(["fully-remote", "remote-first", "hybrid-flexible", "occasional-remote"]).optional(),
  workingHoursFlexible: z.boolean().optional(),
  timeCommitmentPerWeek: z.string().optional(),
  
  // Screening & Selection
  applicationQuestions: z.array(z.string()).optional(),
  backgroundCheckRequired: z.boolean().optional(),
  interviewRequired: z.boolean().optional(),
  
  // Compensation
  compensationType: z.enum(["paid", "unpaid", "stipend"]).optional(),
  salaryRange: z.string().optional(),
  stipendAmount: z.string().optional(),
  hourlyRate: z.string().optional(),
  paymentFrequency: z.enum(["hourly", "daily", "monthly", "one-time", "project-based"]).optional(),
  additionalPerks: z.array(z.string()).optional(),
  
  // Impact & Organization
  impactArea: z.array(z.string()).optional(),
  targetBeneficiaries: z.string().optional(),
  urgencyLevel: z.enum(["normal", "urgent", "flexible"]).optional(),
  
  // Accessibility
  accessibilityAccommodations: z.boolean().optional(),
  diversityStatement: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const { jobs } = await getCollections()
  
  // Parse query parameters
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50"), 100)
  const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0")
  
  const list = await jobs
    .find({ status: "open" })
    .project({ 
      title: 1, 
      category: 1, 
      locationType: 1,
      description: 1,
      skills: 1,
      createdAt: 1,
      ngoId: 1
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray()
  
  // Enrich with NGO names and logos
  const { users } = await getCollections()
  const enriched = await Promise.all(
    list.map(async (job) => {
      const ngo = await users.findOne(
        { _id: new ObjectId(job.ngoId?.toString() || "") },
        { projection: { name: 1, orgName: 1, logoUrl: 1, verified: 1, plan: 1 } }
      )
      return {
        ...job,
        _id: job._id?.toString(),
        ngoId: job.ngoId?.toString(),
        ngoName: ngo?.orgName || ngo?.name || "Unknown NGO",
        ngoLogoUrl: ngo?.logoUrl || null,
        ngoVerified: ngo?.verified || false,
        ngoPlan: ngo?.plan || "ngo_base"
      }
    })
  )
  
  return NextResponse.json({ jobs: enriched, count: enriched.length })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  
  const sessionWithRole = session as { role?: string; plan?: string; planExpiresAt?: string }
  const role = sessionWithRole.role
  if (role !== "ngo") return NextResponse.json({ error: "ONLY_NGO" }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "INVALID_BODY", details: parsed.error }, { status: 400 })

  const { users, jobs } = await getCollections()
  const user = await users.findOne({ email: session.user.email })
  if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
  
  // Check plan and expiry
  const plan = user.plan || "ngo_base"
  const planExpiresAt = user.planExpiresAt ? new Date(user.planExpiresAt) : null
  const isPlanExpired = planExpiresAt && new Date() > planExpiresAt
  
  if (isPlanExpired) {
    return NextResponse.json({ 
      error: "PLAN_EXPIRED", 
      message: "Your plan has expired. Please renew to continue posting jobs." 
    }, { status: 402 })
  }
  
  const isPlus = plan === "ngo_plus"
  const check = await canPostJob(user._id.toString(), isPlus)
  
  if (!check.ok) {
    return NextResponse.json({ 
      error: "LIMIT_REACHED",
      message: `You have reached your job posting limit. Free plan allows ${check.limit} active jobs. Upgrade to NGO Plus for unlimited postings.`,
      active: check.active,
      limit: check.limit
    }, { status: 402 })
  }

  const now = new Date()
  const data = parsed.data
  
  const doc: Omit<JobDoc, '_id'> & Record<string, any> = {
    ngoId: new ObjectId(user._id),
    // Basic fields
    title: data.title,
    description: data.description,
    category: data.category,
    locationType: data.locationType,
    location: data.location || undefined,
    timezone: data.timezone || undefined,
    
    // Arrays
    responsibilities: data.responsibilities || [],
    requirements: data.requirements || [],
    benefits: data.benefits || [],
    skills: data.skills || [],
    languagesRequired: data.languagesRequired || [],
    applicationQuestions: data.applicationQuestions || [],
    impactArea: data.impactArea || [],
    additionalPerks: data.additionalPerks || [],
    
    // Position details
    duration: data.duration || undefined,
    commitment: data.commitment || undefined,
    applicationDeadline: data.applicationDeadline || undefined,
    numberOfPositions: data.numberOfPositions || 1,
    startDate: data.startDate || undefined,
    
    // Experience & qualifications
    experienceLevel: data.experienceLevel || undefined,
    educationRequired: data.educationRequired || undefined,
    certificationRequired: data.certificationRequired || undefined,
    
    // Work arrangement
    remoteWorkPolicy: data.remoteWorkPolicy || undefined,
    workingHoursFlexible: data.workingHoursFlexible || false,
    timeCommitmentPerWeek: data.timeCommitmentPerWeek || undefined,
    
    // Screening
    backgroundCheckRequired: data.backgroundCheckRequired || false,
    interviewRequired: data.interviewRequired !== undefined ? data.interviewRequired : true,
    
    // Compensation
    compensationType: data.compensationType || undefined,
    salaryRange: data.salaryRange || undefined,
    stipendAmount: data.stipendAmount || undefined,
    hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
    paymentFrequency: data.paymentFrequency || undefined,
    
    // Impact
    targetBeneficiaries: data.targetBeneficiaries || undefined,
    urgencyLevel: data.urgencyLevel || "normal",
    
    // Accessibility
    accessibilityAccommodations: data.accessibilityAccommodations || false,
    diversityStatement: data.diversityStatement || undefined,
    
    // System fields
    status: "open" as const,
    createdAt: now,
    updatedAt: now,
  }
  
  const { insertedId } = await jobs.insertOne(doc as JobDoc)
  return NextResponse.json({ jobId: String(insertedId), message: "Job posted successfully!" })
}


