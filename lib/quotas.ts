import { getCollections } from "@/lib/models"
import { addDays } from "date-fns"

export async function canApply(userId: string, isPlus: boolean) {
  if (isPlus) return { ok: true }
  const { users } = await getCollections()
  const u = await users.findOne({ _id: new (await import('mongodb')).ObjectId(userId) })
  if (!u) return { ok: false, reason: "USER_MISSING" }
  const now = new Date()
  if (now.getTime() - new Date(u.monthlyApplicationResetAt).getTime() >= 30 * 24 * 60 * 60 * 1000) {
    await users.updateOne({ _id: u._id }, { $set: { monthlyApplicationCount: 0, monthlyApplicationResetAt: now } })
    return { ok: true }
  }
  if (u.monthlyApplicationCount < 1) return { ok: true }
  return { ok: false, reason: "LIMIT_REACHED" }
}

export async function recordApplication(userId: string) {
  const { users } = await getCollections()
  await users.updateOne(
    { _id: new (await import('mongodb')).ObjectId(userId) },
    { $inc: { monthlyApplicationCount: 1 } }
  )
}

export async function canPostJob(userId: string, isPlus: boolean, baseLimit = 3) {
  if (isPlus) return { ok: true }
  const { jobs } = await getCollections()
  const active = await jobs.countDocuments({ ngoId: new (await import('mongodb')).ObjectId(userId), status: "open" })
  return { ok: active < baseLimit, active, limit: baseLimit }
}

export async function recordJobPost() {
  // No-op; posting itself creates the record
}


