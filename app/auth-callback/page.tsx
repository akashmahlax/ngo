"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

function AuthCallbackContent() {
  const sp = useSearchParams()
  const router = useRouter()
  const { status, data, update } = useSession()
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)

  useEffect(() => {
    // Prevent double execution
    if (processed || processing) return

    if (status === "loading") return

    if (status === "unauthenticated") {
      router.replace("/signin")
      return
    }

    if (status !== "authenticated") return

    const sessionData = data as typeof data & {
      role?: "volunteer" | "ngo" | null
      plan?: string | null
      onboardingStep?: "role" | "profile" | "plan" | "completed" | null
    }

    const redirect = sp?.get("redirect")
    const roleParam = sp?.get("role") as "volunteer" | "ngo" | null
    const dashboardUrl = sessionData?.role === "ngo" ? "/ngo" : "/volunteer"

    // If user already has completed onboarding, go straight to dashboard
    if (sessionData?.role && sessionData.onboardingStep === "completed") {
      router.replace(redirect || dashboardUrl)
      return
    }

    // If user has a role but is in plan step, go to plan page
    if (sessionData?.role && sessionData.onboardingStep === "plan") {
      const planUrl = redirect 
        ? `/signup/plan?redirect=${encodeURIComponent(redirect)}`
        : "/signup/plan"
      router.replace(planUrl)
      return
    }

    // If user already has a role (even without onboarding step), go to dashboard
    if (sessionData?.role) {
      router.replace(redirect || dashboardUrl)
      return
    }

    // User doesn't have a role yet - need to assign it
    if (!roleParam || (roleParam !== "volunteer" && roleParam !== "ngo")) {
      toast.error("Invalid role specified")
      router.replace("/signup")
      return
    }

    // Assign role only if we haven't processed yet
    setProcessing(true)
    setProcessed(true)

    fetch("/api/auth/assign-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: roleParam }),
    })
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok || !json.ok) {
          throw new Error(json?.error || "Failed to set role")
        }

        // Refresh session
        await update()

        // Give session a moment to update
        setTimeout(() => {
          // After role assignment, new users go to plan page
          const planUrl = redirect
            ? `/signup/plan?redirect=${encodeURIComponent(redirect)}`
            : "/signup/plan"
          router.replace(planUrl)
        }, 500)
      })
      .catch((err) => {
        console.error("Role assignment error:", err)
        toast.error("Failed to complete setup")
        setProcessed(false)
        setProcessing(false)
        router.replace("/signup")
      })
  }, [status, data, sp, router, processing, processed, update])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-muted-foreground">Setting up your account...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
