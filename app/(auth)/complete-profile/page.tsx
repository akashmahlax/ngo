"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function CompleteProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [role, setRole] = useState<"volunteer" | "ngo">("volunteer")
  const [plan, setPlan] = useState<string>("volunteer_free")
  const [loading, setLoading] = useState(false)

  const plansByRole: Record<string, { value: string; label: string; description: string; price: string }[]> = {
    volunteer: [
      { value: "volunteer_free", label: "Volunteer Free", description: "1 application per month", price: "₹0" },
      { value: "volunteer_plus", label: "Volunteer Plus", description: "Unlimited applications", price: "₹199/month" },
    ],
    ngo: [
      { value: "ngo_base", label: "NGO Base", description: "Up to 3 active job postings", price: "₹0" },
      { value: "ngo_plus", label: "NGO Plus", description: "Unlimited job postings", price: "₹499/month" },
    ],
  }

  useEffect(() => {
    // If user is not authenticated, redirect to signin
    if (status === "unauthenticated") {
      router.push("/signin")
    }
    
    // If user already has a role and plan, redirect to dashboard
    if (session?.user && (session as any).role && (session as any).plan) {
      const userRole = (session as any).role
      router.push(userRole === "ngo" ? "/dashboard/ngo" : "/dashboard/volunteer")
    }
  }, [session, status, router])

  async function handleSubmit() {
    setLoading(true)
    try {
      // Update user profile with role and plan
      const res = await fetch("/api/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, plan }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || "Failed to update profile")
      }
      
      // Refresh session to get updated user data
      await signIn("google", { redirect: false })
      toast.success("Profile completed successfully!")
      
      // Redirect to appropriate dashboard or upgrade page
      if (plan.endsWith("plus")) {
        router.push(`/upgrade?plan=${plan}`)
      } else {
        router.push(role === "ngo" ? "/dashboard/ngo" : "/dashboard/volunteer")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to complete profile")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Welcome! Please complete your profile to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="role">I am a...</Label>
            <Select value={role} onValueChange={(v) => { 
              setRole(v as any); 
              setPlan(v === 'ngo' ? 'ngo_base' : 'volunteer_free') 
            }}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="ngo">NGO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="plan">Plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger id="plan">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plansByRole[role].map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{p.label}</div>
                        <div className="text-xs text-muted-foreground">{p.description}</div>
                      </div>
                      <div className="font-semibold">{p.price}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4">
            <Button 
              className="w-full" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? "Saving..." : "Complete Profile"}
            </Button>
          </div>
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}