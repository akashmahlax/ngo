"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function SignupPage() {
  const r = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"volunteer" | "ngo">("volunteer")
  const [plan, setPlan] = useState<string>("volunteer_free")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const validateForm = () => {
    if (!name.trim()) {
      setError("Name is required")
      return false
    }
    if (!email.trim()) {
      setError("Email is required")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid")
      return false
    }
    if (!password) {
      setError("Password is required")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    return true
  }

  async function submit() {
    setError(null)
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to create account")
      
      toast.success("Account created successfully!")
      
      if (String(plan).endsWith("plus")) {
        r.push("/upgrade?plan=" + plan)
      } else {
        // Sign in the user automatically after signup
        const signInRes = await fetch("/api/auth/callback/credentials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        
        if (signInRes.ok) {
          r.push(role === "ngo" ? "/dashboard/ngo" : "/dashboard/volunteer")
        } else {
          r.push("/signin")
        }
      }
    } catch (e: any) {
      setError(e.message || "An error occurred during signup")
      toast.error(e.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-md">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="Enter your full name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Create a password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(v) => { setRole(v as any); setPlan(v === 'ngo' ? 'ngo_base' : 'volunteer_free') }}>
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
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={submit} 
            disabled={loading || !name || !email || !password}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}