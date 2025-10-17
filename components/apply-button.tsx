"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckoutButton } from "@/components/billing/CheckoutButton"

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

  const role = (session as any).role
  if (role !== "volunteer") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Only volunteers can apply for jobs</p>
        <Button onClick={() => router.push("/signup")} variant="outline" className="w-full">
          Sign up as Volunteer
        </Button>
      </div>
    )
  }

  const plan = (session as any).plan
  const isPlus = plan === "volunteer_plus"
  const isExpired = (session as any).planExpiresAt && new Date((session as any).planExpiresAt) < new Date()

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
      
      router.push("/(dashboard)/volunteer/applications")
    } catch (e) {
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
