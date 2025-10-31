import client from "@/lib/db"
import { ObjectId } from "mongodb"

export type UserRole = "volunteer" | "ngo" | "admin"
export type UserPlan = "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus"

export type UserDoc = {
  _id: ObjectId
  name?: string
  email: string
  passwordHash?: string | null
  role: UserRole
  plan: UserPlan
  // Admin-specific fields
  isAdmin?: boolean
  adminLevel?: "super" | "moderator" | "support"
  adminPermissions?: string[]
  planExpiresAt: Date | null
  planActivatedAt?: Date | null
  planCancelled?: boolean
  planCancelledAt?: Date | null
  passwordResetToken?: string | null
  passwordResetExpiry?: Date | null
  pendingPlan?: UserPlan | null
  onboardingStep?: "role" | "profile" | "plan" | "completed"
  monthlyApplicationCount: number
  monthlyApplicationResetAt: Date
  bio?: string
  skills?: string[]
  location?: string
  avatarUrl?: string
  cloudinaryPublicId?: string
  profileVisibility?: "public" | "private"
  socialLinks?: {
    linkedin?: string
    github?: string
    website?: string
    twitter?: string
  }
  experience?: Array<{
    title: string
    company: string
    duration: string
    description?: string
  }>
  education?: Array<{
    degree: string
    institution: string
    year: string
    description?: string
  }>
  // Email verification fields
  emailVerified?: Date | null
  emailVerificationToken?: string
  emailVerificationExpiry?: Date
  // Volunteer-specific fields
  expectedSalary?: string // e.g., "₹15,000 - ₹20,000/month"
  hourlyRate?: number // e.g., 500 (₹500/hour)
  ngoHourlyRate?: number // Rate NGO pays (may be different from volunteer rate)
  availability?: "full-time" | "part-time" | "flexible" | "weekends"
  totalEarnings?: number // Total earned through platform
  hoursWorked?: number // Total hours worked
  title?: string // Professional title/role
  successRate?: number // 0-100 percentage
  responseTime?: string // e.g., "< 1 hour", "< 24 hours"
  currentWorkStatus?: string // e.g., "Available", "Busy - 2 projects", "Not available"
  completedProjects?: number // Number of completed projects
  activeProjects?: number // Number of ongoing projects
  rating?: number // 0-5 star rating
  // NGO-specific fields
  orgName?: string
  website?: string
  verified?: boolean
  orgType?: string
  registrationNumber?: string
  phone?: string
  address?: string
  focusAreas?: string[]
  teamSize?: string
  yearEstablished?: string
  description?: string // Detailed NGO description
  impactStats?: {
    volunteersHelped?: number
    projectsCompleted?: number
    peopleImpacted?: number
  }
  logoUrl?: string
  logoPublicId?: string
  coverPhotoUrl?: string
  coverPhotoPublicId?: string
  notifications?: {
    emailApplications: boolean
    emailMessages: boolean
    emailUpdates: boolean
  }
  privacy?: {
    profileVisibility: "public" | "private"
    showEmail: boolean
  }
  // Security and audit fields
  lastLoginAt?: Date
  lastPasswordChangeAt?: Date
  failedLoginAttempts?: number
  accountLockedUntil?: Date | null
  banned?: boolean
  bannedAt?: Date | null
  bannedReason?: string
  bannedBy?: ObjectId | null
  // Metadata
  createdAt: Date
  updatedAt: Date
}

export type JobDoc = {
  _id: ObjectId
  ngoId: ObjectId
  title: string
  description: string
  category?: string
  location?: string
  type?: string
  locationType?: "onsite" | "remote" | "hybrid"
  skills?: string[]
  benefits?: string[]
  requirements?: string[]
  duration?: string
  commitment?: "full-time" | "part-time" | "flexible"
  applicationDeadline?: string
  numberOfPositions?: number
  // Payment & Compensation fields
  compensationType?: "paid" | "unpaid" | "stipend"
  salaryRange?: string // e.g., "₹10,000 - ₹15,000/month"
  stipendAmount?: string // e.g., "₹5,000/month"
  hourlyRate?: number // e.g., 500 (₹500/hour)
  paymentFrequency?: "hourly" | "daily" | "monthly" | "one-time" | "project-based"
  additionalPerks?: string[] // e.g., ["Food provided", "Travel allowance"]
  // Meta fields
  applicationCount?: number
  viewCount?: number
  status: "open" | "closed"
  createdAt: Date
  updatedAt: Date
}

export type ApplicationDoc = {
  _id: ObjectId
  jobId: ObjectId
  ngoId: ObjectId
  volunteerId: ObjectId
  status: "applied" | "shortlisted" | "accepted" | "rejected" | "withdrawn"
  coverLetter?: string
  notes?: string
  ngoNotes?: string
  rating?: number
  timeline?: Array<{
    status: string
    date: Date
    note?: string
  }>
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus = "created" | "paid" | "failed"
export type OrderDoc = {
  _id: ObjectId
  userId: ObjectId
  role: UserRole
  planTarget: Extract<UserPlan, "volunteer_plus" | "ngo_plus">
  orderId: string
  amount: number
  currency: string
  status: OrderStatus
  receipt?: string
  createdAt: Date
  paidAt?: Date
  razorpayPaymentId?: string
  razorpaySignature?: string
}

export async function getCollections() {
  await client.connect()
  const db = client.db()
  return {
    users: db.collection<UserDoc>("users"),
    jobs: db.collection<JobDoc>("jobs"),
    applications: db.collection<ApplicationDoc>("applications"),
    orders: db.collection<OrderDoc>("orders"),
  }
}


