"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import { AlertCircle, Mail, Lock, Sparkles, Users, Briefcase, ArrowRight, CheckCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Step = "role" | "auth"

const socialProviders = [
  {
    id: "google",
    label: "Continue with Google",
    className:
      "w-full h-11 border-2 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all",
    icon: (
      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
  },
  // {
  //   id: "facebook",
  //   label: "Continue with Facebook",
  //   className:
  //     "w-full h-11 border-2 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all",
  //   icon: (
  //     <svg className="mr-2 h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
  //       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  //     </svg>
  //   ),
  // },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("role")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"volunteer" | "ngo">("volunteer")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  async function handleOAuthSignUp(provider: string) {
    setError(null)
    setLoading(true)
    try {
      await signIn(provider, { callbackUrl: `/auth-callback?role=${role}` })
    } catch (err) {
      console.error(`${provider} sign up error:`, err)
      const label = provider.charAt(0).toUpperCase() + provider.slice(1)
      setError(`Failed to sign up with ${label}`)
    } finally {
      setLoading(false)
    }
  }

  async function submit() {
    setError(null)
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const defaultPlan = role === "ngo" ? "ngo_base" : "volunteer_free"
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, plan: defaultPlan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to create account")
      
      toast.success("Account created successfully!")

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!signInResult?.ok) {
        toast.error("Account created but auto-login failed. Please sign in manually.")
        router.push("/signin")
        return
      }

      router.replace("/signup/plan")
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An error occurred during signup"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
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
          className="absolute -top-40 -left-40 w-96 h-96 bg-linear-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30"
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
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-linear-to-br from-pink-400 to-orange-400 rounded-full blur-3xl opacity-30"
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-purple-400 via-pink-400 to-orange-400 rounded-full blur-3xl opacity-20"
        />
      </div>

      <div className="relative container mx-auto px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-pink-600 text-white mb-4 shadow-xl"
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Join our community and start making a difference today
            </p>
          </div>

          <Card className="shadow-2xl border-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl">Join our community</CardTitle>
              <CardDescription>
                Already have an account?{" "}
                <Link href="/signin" className="text-purple-600 hover:text-pink-600 font-semibold transition-colors">
                  Sign in
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <AnimatePresence mode="wait">
                {step === "role" ? (
                <motion.div
                  key="role"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold">I want to join as</h2>
                    <p className="text-sm text-muted-foreground">
                      Choose your role to get started with the right features
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <button
                      type="button"
                      onClick={() => setRole("volunteer")}
                      className={`text-left rounded-xl border-2 p-5 transition-all duration-200 ${
                        role === "volunteer"
                          ? "border-purple-500 bg-purple-50/70 dark:bg-purple-950/30 shadow-lg scale-[1.02]"
                          : "border-neutral-200 hover:border-purple-300 hover:shadow-md dark:border-neutral-800"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                          role === "volunteer"
                            ? "bg-linear-to-br from-purple-600 to-pink-600 text-white"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
                        }`}>
                          <Users className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold">Volunteer</p>
                            {role === "volunteer" && (
                              <CheckCircle className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Find meaningful opportunities and make an impact
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("ngo")}
                      className={`text-left rounded-xl border-2 p-5 transition-all duration-200 ${
                        role === "ngo"
                          ? "border-purple-500 bg-purple-50/70 dark:bg-purple-950/30 shadow-lg scale-[1.02]"
                          : "border-neutral-200 hover:border-purple-300 hover:shadow-md dark:border-neutral-800"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                          role === "ngo"
                            ? "bg-linear-to-br from-orange-500 to-pink-500 text-white"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600"
                        }`}>
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold">NGO / Organization</p>
                            {role === "ngo" && (
                              <CheckCircle className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Connect with passionate volunteers for your mission
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <Button
                    className="w-full h-12 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-lg text-base font-semibold"
                    onClick={() => setStep("auth")}
                  >
                    Continue as {role === "volunteer" ? "Volunteer" : "NGO"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {error && (
                    <Alert variant="destructive" className="border-red-200 dark:border-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Create your account</h2>
                      <p className="text-sm text-muted-foreground">
                        Signing up as {role === "volunteer" ? "Volunteer" : "NGO"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStep("role")
                        setError(null)
                      }}
                      className="text-purple-600"
                    >
                      Change
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-center">Quick signup with</p>
                    <div className="grid grid-cols-2 gap-3">
                      {socialProviders.map((provider) => (
                        <Button
                          key={provider.id}
                          variant="outline"
                          className={provider.className}
                          onClick={() => handleOAuthSignUp(provider.id)}
                          disabled={loading}
                        >
                          {provider.icon}
                          <span className="truncate">{provider.label.replace("Continue with ", "")}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-neutral-900 px-3 text-muted-foreground">
                        Or with email
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">Full name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-11 pl-10 border-2 focus:border-purple-400"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">Email address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-11 pl-10 border-2 focus:border-pink-400"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-11 pl-10 border-2 focus:border-orange-400"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full h-12 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-lg text-base font-semibold"
                      onClick={submit}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Creating account...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Create account
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="text-purple-600 hover:underline">Terms</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
                  </p>
                </motion.div>
              )}
              </AnimatePresence>
            </CardContent>
          </Card>

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