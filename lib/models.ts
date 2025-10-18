import client from "@/lib/db"
import { ObjectId } from "mongodb"

export type UserRole = "volunteer" | "ngo"
export type UserPlan = "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus"

export type UserDoc = {
  _id: ObjectId
  name?: string
  email: string
  passwordHash?: string | null
  role: UserRole
  plan: UserPlan
  planExpiresAt: Date | null
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
  orgName?: string
  website?: string
  verified?: boolean
  orgType?: string
  registrationNumber?: string
  phone?: string
  address?: string
  focusAreas?: string[]
  teamSize?: string
  notifications?: {
    emailApplications: boolean
    emailMessages: boolean
    emailUpdates: boolean
  }
  privacy?: {
    profileVisibility: "public" | "private"
    showEmail: boolean
  }
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


