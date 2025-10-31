import clientPromise from "@/lib/db"

export interface PlatformSettings {
  // Platform Settings
  siteName: string
  siteUrl: string
  supportEmail: string
  
  // Feature Flags
  enableRegistration: boolean
  enableJobPosting: boolean
  enableApplications: boolean
  enablePayments: boolean
  enableEmailNotifications: boolean
  
  // Quotas - Free Tier
  freeJobsPerMonth: number
  freeFeaturedJobs: number
  freeApplicationsPerJob: number
  
  // Quotas - Premium Tier
  premiumJobsPerMonth: number
  premiumFeaturedJobs: number
  premiumApplicationsPerJob: number
  
  // Quotas - Enterprise Tier
  enterpriseJobsPerMonth: number
  enterpriseFeaturedJobs: number
  enterpriseApplicationsPerJob: number
  
  // Moderation
  autoModeration: boolean
  requireNGOVerification: boolean
  requireEmailVerification: boolean
  
  // Email Settings
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  
  // Payment Settings
  razorpayKeyId: string
  razorpayKeySecret: string
  
  // Other
  maintenanceMode: boolean
}

const defaultSettings: PlatformSettings = {
  siteName: "Just Because Asia",
  siteUrl: "http://localhost:3000",
  supportEmail: "support@justbecause.asia",
  
  enableRegistration: true,
  enableJobPosting: true,
  enableApplications: true,
  enablePayments: true,
  enableEmailNotifications: false,
  
  freeJobsPerMonth: 3,
  freeFeaturedJobs: 0,
  freeApplicationsPerJob: 50,
  
  premiumJobsPerMonth: 20,
  premiumFeaturedJobs: 5,
  premiumApplicationsPerJob: 200,
  
  enterpriseJobsPerMonth: -1,
  enterpriseFeaturedJobs: 20,
  enterpriseApplicationsPerJob: -1,
  
  autoModeration: false,
  requireNGOVerification: false,
  requireEmailVerification: false,
  
  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPassword: "",
  
  razorpayKeyId: "",
  razorpayKeySecret: "",
  
  maintenanceMode: false,
}

let cachedSettings: PlatformSettings | null = null
let cacheTime: number = 0
const CACHE_DURATION = 60000 // 1 minute

export async function getPlatformSettings(): Promise<PlatformSettings> {
  // Return cached settings if still valid
  if (cachedSettings && Date.now() - cacheTime < CACHE_DURATION) {
    return cachedSettings
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const settings = await db.collection("settings").findOne({ _id: "platform" as any })

    if (settings) {
      cachedSettings = { ...defaultSettings, ...settings }
    } else {
      cachedSettings = defaultSettings
    }

    cacheTime = Date.now()
    return cachedSettings
  } catch (error) {
    console.error("Error loading platform settings:", error)
    return defaultSettings
  }
}

export async function invalidateSettingsCache() {
  cachedSettings = null
  cacheTime = 0
}

export async function isMaintenanceMode(): Promise<boolean> {
  const settings = await getPlatformSettings()
  return settings.maintenanceMode
}

export async function canRegister(): Promise<boolean> {
  const settings = await getPlatformSettings()
  return settings.enableRegistration
}

export async function canPostJobs(): Promise<boolean> {
  const settings = await getPlatformSettings()
  return settings.enableJobPosting
}

export async function canApply(): Promise<boolean> {
  const settings = await getPlatformSettings()
  return settings.enableApplications
}

export async function canMakePayments(): Promise<boolean> {
  const settings = await getPlatformSettings()
  return settings.enablePayments
}

export function getJobQuota(plan: string): number {
  if (!cachedSettings) return 3
  
  if (plan?.includes("enterprise")) {
    return cachedSettings.enterpriseJobsPerMonth
  } else if (plan?.includes("plus") || plan?.includes("premium")) {
    return cachedSettings.premiumJobsPerMonth
  }
  return cachedSettings.freeJobsPerMonth
}

export function getFeaturedJobQuota(plan: string): number {
  if (!cachedSettings) return 0
  
  if (plan?.includes("enterprise")) {
    return cachedSettings.enterpriseFeaturedJobs
  } else if (plan?.includes("plus") || plan?.includes("premium")) {
    return cachedSettings.premiumFeaturedJobs
  }
  return cachedSettings.freeFeaturedJobs
}

export function getApplicationQuota(plan: string): number {
  if (!cachedSettings) return 50
  
  if (plan?.includes("enterprise")) {
    return cachedSettings.enterpriseApplicationsPerJob
  } else if (plan?.includes("plus") || plan?.includes("premium")) {
    return cachedSettings.premiumApplicationsPerJob
  }
  return cachedSettings.freeApplicationsPerJob
}
