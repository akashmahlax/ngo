"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Sparkles, Check, Crown, ArrowLeft, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const volunteerPlans = {
  free: {
    id: "volunteer_free" as const,
    name: "Volunteer Free",
    price: "₹0",
    description: "Perfect to explore opportunities",
    features: [
      "Apply to 1 job each month",
      "Browse all NGO openings",
      "Basic profile visibility",
      "Track your applications",
    ],
  },
  plus: {
    id: "volunteer_plus" as const,
    name: "Volunteer Plus",
    price: "₹1/mo",
    description: "Unlimited access to grow faster",
    features: [
      "Unlimited job applications",
      "Priority profile highlighting",
      "Advanced analytics",
      "Instant email notifications",
    ],
  },
}

const ngoPlans = {
  free: {
    id: "ngo_base" as const,
    name: "NGO Base",
    price: "₹0",
    description: "Get started with essential tools",
    features: [
      "Post up to 3 active roles",
      "Manage applications",
      "Basic organization page",
      "Volunteer messaging",
    ],
  },
  plus: {
    id: "ngo_plus" as const,
    name: "NGO Plus",
    price: "₹1/mo",
    description: "Grow your impact faster",
    features: [
      "Unlimited job postings",
      "Featured listings & boosting",
      "Advanced analytics dashboard",
      "Priority customer support",
    ],
  },
}

function SignupPlanContent() {
  const { status, data, update } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectingFree, setSelectingFree] = useState(false)

  const session = data as typeof data & {
    role?: "volunteer" | "ngo" | null
    plan?: string | null
    onboardingStep?: "role" | "profile" | "plan" | "completed" | null
  }

  const redirect = searchParams?.get("redirect")

  useEffect(() => {
    if (status === "unauthenticated") {
      const url = new URL("/signin", window.location.origin)
      url.searchParams.set("callbackUrl", "/signup/plan")
      router.replace(url.toString())
    }
  }, [status, router])

  useEffect(() => {
    if (status !== "authenticated") return
    if (!session?.role) {
      router.replace("/signup")
      return
    }

    if (session.onboardingStep === "completed" || (session.plan && session.plan !== "volunteer_free" && session.plan !== "ngo_base")) {
      const target = redirect || (session.role === "ngo" ? "/ngo" : "/volunteer")
      router.replace(target)
    }
  }, [session, status, router, redirect])

  const plans = useMemo(() => {
    if (!session?.role) return null
    return session.role === "ngo" ? ngoPlans : volunteerPlans
  }, [session?.role])

  const freePlanId = plans?.free.id
  const plusPlanId = plans?.plus.id

  async function handleChooseFreePlan() {
    if (!freePlanId) return
    setSelectingFree(true)
    try {
      const res = await fetch("/api/auth/assign-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: freePlanId }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Failed to confirm plan")
      }

      await update()
      toast.success("You're all set!")
      const target = redirect || (session?.role === "ngo" ? "/ngo" : "/volunteer")
      router.replace(target)
    } catch (error) {
      console.error("assign-plan error", error)
      toast.error(error instanceof Error ? error.message : "Unable to confirm plan right now")
    } finally {
      setSelectingFree(false)
    }
  }

  function handleChoosePlusPlan() {
    if (!plusPlanId) return
    const url = new URL("/upgrade", window.location.origin)
    url.searchParams.set("plan", plusPlanId)
    router.push(url.toString())
  }

  if (status !== "authenticated" || !plans) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-linear-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-linear-to-br from-pink-400 to-orange-400 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-purple-400 via-pink-400 to-orange-400 rounded-full blur-3xl opacity-20"
        />
      </div>

      <div className="relative container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center gap-3 text-sm font-medium text-purple-700 dark:text-purple-200 mb-6">
          <Link href="/signup" className="inline-flex items-center gap-1 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to role selection
          </Link>
          <span className="text-purple-400">/</span>
          <span className="uppercase tracking-wide">Step 3 of 3 · Choose your plan</span>
        </div>

        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-pink-600 text-white mb-4 shadow-xl"
          >
            <Sparkles className="h-8 w-8" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Choose the plan that fits you best
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confirm your starting plan. You can upgrade anytime for more superpowers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 shadow-lg bg-white/85 dark:bg-neutral-900/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-neutral-900/90 text-white flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{plans.free.name}</CardTitle>
                  <CardDescription>{plans.free.description}</CardDescription>
                </div>
              </div>
              <div className="text-4xl font-bold">{plans.free.price}</div>
            </CardHeader>
            <CardContent className="space-y-3">
              {plans.free.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <div className="mt-1 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </CardContent>
            <div className="px-6 pb-6">
              <Button
                className="w-full h-11 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-lg hover:shadow-xl"
                onClick={handleChooseFreePlan}
                disabled={selectingFree}
              >
                {selectingFree ? "Confirming..." : "Start with Free"}
              </Button>
            </div>
          </Card>

          <Card className="border-2 border-purple-300 dark:border-purple-700 shadow-xl bg-white/90 dark:bg-neutral-900/80 backdrop-blur-xl relative overflow-hidden">
            <span className="absolute top-5 right-5 inline-flex items-center gap-1 text-xs font-semibold bg-linear-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full shadow-md">
              <Crown className="h-3 w-3" />
              Most popular
            </span>
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{plans.plus.name}</CardTitle>
                  <CardDescription>{plans.plus.description}</CardDescription>
                </div>
              </div>
              <div className="text-4xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                {plans.plus.price}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-200 font-semibold mt-2">
                🎉 Launch offer — upgrade anytime for more reach
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {plans.plus.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <div className="mt-1 h-5 w-5 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </CardContent>
            <div className="px-6 pb-6">
              <Button
                variant="outline"
                className="w-full h-11 border-2 border-purple-400 text-purple-600 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                onClick={handleChoosePlusPlan}
              >
                Preview Plus & Upgrade
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SignupPlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <SignupPlanContent />
    </Suspense>
  )
}
