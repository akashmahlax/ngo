"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckoutButton } from "@/components/billing/CheckoutButton"
import { Lock, AlertCircle } from "lucide-react"

export function ApplyButton({ jobId }: { jobId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!session?.user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Sign in to apply for this role</p>
        <Button onClick={() => router.push("/signin")} className="w-full">
          Sign In
        </Button>
      </div>
    )
  }

  const userSession = session as {
    role?: string
    plan?: string
    planExpiresAt?: string
  }

  const role = userSession.role
  const plan = userSession.plan
  const planExpiresAt = userSession.planExpiresAt ? new Date(userSession.planExpiresAt) : null
  const isPlanExpired = planExpiresAt && new Date() > planExpiresAt

  if (role !== "volunteer") {
    return (
      <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          Only volunteers can apply for jobs. Please sign up as a volunteer.
        </AlertDescription>
      </Alert>
    )
  }

  // Check if user has valid plan (volunteer_free or active volunteer_plus)
  const hasValidPlan = plan === "volunteer_free" || (plan === "volunteer_plus" && !isPlanExpired)

  if (!hasValidPlan || isPlanExpired) {
    return (
      <Alert className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-900/50">
        <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
        <AlertDescription>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100 mb-1">
                {isPlanExpired ? "Your Plan Has Expired" : "Valid Plan Required"}
              </p>
              <p className="text-sm text-red-800 dark:text-red-200">
                {isPlanExpired 
                  ? "Your subscription has expired. Renew your plan to continue applying for jobs."
                  : "You need an active volunteer plan to apply for jobs. Sign up for free or upgrade to Plus for unlimited applications."
                }
              </p>
            </div>
            <div className="flex gap-2">
              {!plan && (
                <Button onClick={() => router.push("/complete-profile")} className="flex-1">
                  Complete Profile
                </Button>
              )}
              <CheckoutButton plan="volunteer_plus" />
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  const isPlus = plan === "volunteer_plus"
  const isExpired = isPlanExpired

  async function handleApply() {
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 402) {
          setError("You've reached your monthly application limit. Upgrade to Volunteer Plus for unlimited applications.")
        } else {
          setError(data.error || "Failed to apply")
        }
        return
      }
      
      router.push("/volunteer/applications")
    } catch {
      setError("Failed to apply")
    } finally {
      setLoading(false)
    }
  }

  if (isExpired) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Your plan has expired. Renew to continue applying.</p>
        <CheckoutButton plan="volunteer_plus" />
      </div>
    )
  }

  if (!isPlus && !isExpired) {
    return (
      <div className="space-y-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800">
              Free plan: 1 application per month. Upgrade for unlimited applications.
            </p>
          </CardContent>
        </Card>
        <Button onClick={handleApply} disabled={loading} className="w-full">
          {loading ? "Applying..." : "Apply Now"}
        </Button>
        <CheckoutButton plan="volunteer_plus" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}
      <Button onClick={handleApply} disabled={loading} className="w-full">
        {loading ? "Applying..." : "Apply Now"}
      </Button>
    </div>
  )
}
