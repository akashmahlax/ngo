"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function OAuthCompletePage() {
  const sp = useSearchParams()
  const router = useRouter()
  const { status, data, update } = useSession()

  const [role, setRole] = useState<"volunteer" | "ngo" | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const r = sp.get("role") as "volunteer" | "ngo" | null
    if (r === "volunteer" || r === "ngo") setRole(r)
  }, [sp])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin")
    }
  }, [status, router])

  useEffect(() => {
    // If user already has a role, skip assignment and redirect
    const s = data as typeof data & { role?: "volunteer" | "ngo" }
    if (status === "authenticated" && s?.role) {
      const redirect = sp.get("redirect")
      if (redirect) router.replace(redirect)
      else router.replace(s.role === "ngo" ? "/(dashboard)/ngo" : "/(dashboard)/volunteer")
    }
  }, [status, data, sp, router])

  async function assign() {
    if (!role) {
      setError("Please choose a role")
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/assign-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json?.error || "Failed to set role")
      await update()
      const redirect = sp.get("redirect")
      if (redirect) router.replace(redirect)
      else router.replace(role === "ngo" ? "/(dashboard)/ngo" : "/(dashboard)/volunteer")
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Choose your role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <RadioGroup value={role || ""} onValueChange={(v: string) => setRole(v as "volunteer" | "ngo")}>
            <div className="flex items-center gap-3 p-3 border rounded-md cursor-pointer" onClick={() => setRole("volunteer")}>
              <RadioGroupItem value="volunteer" id="volunteer" />
              <Label htmlFor="volunteer" className="cursor-pointer">I am a Volunteer</Label>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-md cursor-pointer" onClick={() => setRole("ngo")}>
              <RadioGroupItem value="ngo" id="ngo" />
              <Label htmlFor="ngo" className="cursor-pointer">I am from an NGO</Label>
            </div>
          </RadioGroup>
          <Button className="w-full" onClick={assign} disabled={loading}>Continue</Button>
        </CardContent>
      </Card>
    </div>
  )
}
