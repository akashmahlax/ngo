"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function CompleteProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  
  const [step, setStep] = useState<"role" | "details">("role")
  const [role, setRole] = useState<"volunteer" | "ngo" | null>(null)
  const [orgName, setOrgName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])

  async function handleCompleteProfile() {
    if (!role) {
      setError("Please select a role")
      return
    }

    if (role === "ngo" && !orgName.trim()) {
      setError("Organization name is required for NGOs")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Determine plan based on role
      const plan = role === "ngo" ? "ngo_base" : "volunteer_free"
      
      const res = await fetch("/api/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          plan,
          orgName: role === "ngo" ? orgName : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete profile")
      }

      toast.success("Profile completed successfully!")

      // Update session
      await update()

      // Redirect to dashboard
      const dashboardUrl = role === "ngo" ? "/(dashboard)/ngo" : "/(dashboard)/volunteer"
      router.push(dashboardUrl)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "role" && (
            <div className="space-y-4">
              <RadioGroup value={role || ""} onValueChange={(v) => setRole(v as "volunteer" | "ngo")}>
                <div
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                  onClick={() => setRole("volunteer")}
                >
                  <RadioGroupItem value="volunteer" id="volunteer" />
                  <Label htmlFor="volunteer" className="cursor-pointer flex-1">
                    <div className="font-medium">I'm a Volunteer</div>
                    <div className="text-sm text-muted-foreground">
                      Find and apply for volunteering opportunities
                    </div>
                  </Label>
                </div>

                <div
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                  onClick={() => setRole("ngo")}
                >
                  <RadioGroupItem value="ngo" id="ngo" />
                  <Label htmlFor="ngo" className="cursor-pointer flex-1">
                    <div className="font-medium">I'm from an NGO</div>
                    <div className="text-sm text-muted-foreground">
                      Post jobs and find volunteers
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <Button onClick={() => setStep("details")} disabled={!role || loading} className="w-full">
                Continue
              </Button>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-4">
              {role === "ngo" && (
                <div className="space-y-2">
                  <Label htmlFor="org">Organization Name *</Label>
                  <Input
                    id="org"
                    placeholder="Enter your organization name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
              )}

              {role === "volunteer" && (
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Profile info</div>
                      <div className="text-sm text-muted-foreground">
                        You can complete your full volunteer profile after signing in
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("role")} disabled={loading} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleCompleteProfile}
                  disabled={!role || (role === "ngo" && !orgName.trim()) || loading}
                  className="flex-1"
                >
                  {loading ? "Completing..." : "Complete Profile"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
