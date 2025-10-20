"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User, Mail, Lock, UserCircle, CreditCard, Check, Sparkles } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SignupPage() {
  const r = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"volunteer" | "ngo">("volunteer")
  const [plan, setPlan] = useState<string>("volunteer_free")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const plansByRole: Record<string, { value: string; label: string; description: string; price: string; features: string[] }[]> = {
    volunteer: [
      { 
        value: "volunteer_free", 
        label: "Free", 
        description: "Perfect for getting started", 
        price: "₹0",
        features: ["1 application per month", "Basic profile", "Job browsing"]
      },
      { 
        value: "volunteer_plus", 
        label: "Plus", 
        description: "Unlimited access", 
        price: "₹199/mo",
        features: ["Unlimited applications", "Priority support", "Advanced analytics"]
      },
    ],
    ngo: [
      { 
        value: "ngo_base", 
        label: "Base", 
        description: "For small organizations", 
        price: "₹0",
        features: ["Up to 3 active postings", "Basic dashboard", "Volunteer management"]
      },
      { 
        value: "ngo_plus", 
        label: "Plus", 
        description: "Full platform access", 
        price: "₹499/mo",
        features: ["Unlimited postings", "Advanced analytics", "Priority placement"]
      },
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
      
      // Sign in the user automatically after signup
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!signInResult?.ok) {
        toast.error("Account created but auto-login failed. Please sign in manually.")
        r.push("/signin")
        return
      }

      // Redirect based on plan selection
      if (String(plan).endsWith("plus")) {
        r.push("/upgrade?plan=" + plan)
      } else {
        r.push(role === "ngo" ? "/ngo" : "/volunteer")
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An error occurred during signup"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const selectedPlanDetails = plansByRole[role].find(p => p.value === plan)

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-full blur-3xl opacity-20"
        />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white mb-4 shadow-xl"
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Join our community and start making a difference today
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-2xl border-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl">Get started for free</CardTitle>
              <CardDescription>
                Already have an account?{" "}
                <Link href="/signin" className="text-purple-600 hover:text-pink-600 font-semibold transition-colors">
                  Sign in
                </Link>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="grid gap-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Alert variant="destructive" className="border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  Full Name
                </Label>
                <Input 
                  id="name" 
                  placeholder="Enter your full name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 focus:border-purple-400 transition-colors"
                  disabled={loading}
                />
              </div>
              
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-pink-600" />
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 focus:border-pink-400 transition-colors"
                  disabled={loading}
                />
              </div>
              
              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange-600" />
                  Password
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Create a strong password (min. 6 characters)" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 focus:border-orange-400 transition-colors"
                  disabled={loading}
                />
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-2" />
              
              {/* Role Selection */}
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-sm font-semibold flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-purple-600" />
                  I am a
                </Label>
                <Select value={role} onValueChange={(v) => { 
                  const newRole = v as "volunteer" | "ngo"
                  setRole(newRole)
                  setPlan(newRole === 'ngo' ? 'ngo_base' : 'volunteer_free')
                }} disabled={loading}>
                  <SelectTrigger id="role" className="border-2 focus:border-purple-400">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Volunteer - Looking for opportunities</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ngo">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>NGO - Recruiting volunteers</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Plan Selection */}
              <div className="grid gap-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-pink-600" />
                  Choose Your Plan
                </Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {plansByRole[role].map((p) => (
                    <motion.div
                      key={p.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all ${
                          plan === p.value 
                            ? 'border-2 border-purple-500 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20' 
                            : 'border-2 hover:border-purple-300 dark:hover:border-purple-700'
                        }`}
                        onClick={() => !loading && setPlan(p.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg">{p.label}</h3>
                                {plan === p.value && (
                                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{p.description}</p>
                              <p className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {p.price}
                              </p>
                            </div>
                          </div>
                          <ul className="space-y-1.5">
                            {p.features.map((feature, idx) => (
                              <li key={idx} className="text-xs flex items-start gap-1.5">
                                <Check className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 pt-6">
              <Button 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all" 
                onClick={submit} 
                disabled={loading || !name || !email || !password}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Creating your account...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-purple-600 hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
              </p>
            </CardFooter>
          </Card>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            <p className="flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              Your data is encrypted and secure
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
