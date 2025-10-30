"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn, useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Lock, Mail, LogIn, KeyRound } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInPageInner />
    </Suspense>
  );
}

function SignInPageInner() {
  const { data: session, status } = useSession();
  const sp = useSearchParams();
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const callbackUrl = sp.get("callbackUrl") || "/";

  useEffect(() => {
    if (status === "authenticated") {
      const sessionWithProfile = session as typeof session & { 
        profileComplete?: boolean;
        role?: "volunteer" | "ngo" | null;
        onboardingStep?: "role" | "profile" | "plan" | "completed" | null;
      };
      
      // If no role, redirect to signup to choose one
      if (!sessionWithProfile?.role) {
        r.push("/signup");
        return;
      }
      
      // If in plan selection step, redirect there
      if (sessionWithProfile.onboardingStep === "plan") {
        r.push("/signup/plan");
        return;
      }
      
      // Otherwise, go to callback URL or role-specific dashboard
      const dashboard = sessionWithProfile.role === "ngo" ? "/ngo" : "/volunteer";
      r.push(callbackUrl === "/" ? dashboard : callbackUrl);
    }
  }, [session, status, r, callbackUrl]);

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  async function handleCredentialsSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error === "CredentialsSignin" ? "Invalid email or password" : "Failed to sign in");
      } else if (res?.ok) {
        toast.success("Signed in successfully");
      }
    } catch (error) {
      console.error("Credentials sign in error:", error)
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuthSignIn(provider: string) {
    setError(null);
    setLoading(true);
    try {
      // Returning users go directly; new users will be caught by middleware
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(`${provider} sign in error:`, error)
      const label = provider.charAt(0).toUpperCase() + provider.slice(1)
      setError(`Failed to sign in with ${label}`)
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
  <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
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

      {/* Content */}
      <div className="relative container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-pink-600 text-white mb-4 shadow-xl"
            >
              <LogIn className="h-8 w-8" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue your journey
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-2xl border-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl">Sign in to your account</CardTitle>
              <CardDescription>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-purple-600 hover:text-pink-600 font-semibold transition-colors">
                  Create one
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

              {[
                {
                  id: "google",
                  label: "Continue with Google",
                  className: "w-full h-11 border-2 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all",
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
                //   id: "github",
                //   label: "Continue with GitHub",
                //   className: "w-full h-11 border-2 hover:border-gray-800 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all",
                //   icon: (
                //     <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                //       <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                //     </svg>
                //   ),
                // },
                {
                  id: "apple",
                  label: "Continue with Apple",
                  className: "w-full h-11 border-2 hover:border-black/80 hover:bg-black/5 dark:hover:bg-white/10 transition-all",
                  icon: (
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.365 1.43c0 1.14-.413 2.075-1.24 2.805-.827.731-1.78 1.154-2.86 1.27-.046-.17-.069-.401-.069-.693 0-1.089.375-2.025 1.126-2.806.751-.781 1.667-1.221 2.747-1.318.02.247.03.483.03.706m4.51 16.622c-.34.983-.83 1.894-1.47 2.733-.79 1.09-1.438 1.84-1.946 2.249-.778.714-1.612 1.08-2.503 1.098-.64 0-1.413-.183-2.32-.55-.908-.367-1.744-.55-2.507-.55-.773 0-1.62.183-2.54.55-.92.367-1.67.56-2.25.58-.867.036-1.713-.335-2.54-1.116-.54-.442-1.208-1.218-2.004-2.33-.86-1.178-1.567-2.546-2.118-4.104-.59-1.705-.884-3.355-.884-4.95 0-1.83.398-3.408 1.195-4.733.626-1.076 1.46-1.919 2.503-2.527s2.163-.92 3.366-.939c.66 0 1.523.211 2.59.632 1.066.422 1.75.634 2.053.634.225 0 .99-.253 2.296-.76 1.232-.472 2.275-.668 3.13-.589 2.31.187 4.05 1.097 5.22 2.731-2.073 1.254-3.11 3.013-3.11 5.278 0 1.761.666 3.225 1.999 4.39.595.53 1.257.938 1.986 1.223-.159.483-.326.95-.5 1.403" />
                    </svg>
                  ),
                },
                {
                  id: "linkedin",
                  label: "Continue with LinkedIn",
                  className: "w-full h-11 border-2 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all",
                  icon: (
                    <svg className="mr-2 h-5 w-5" fill="#0A66C2" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  ),
                },
                {
                  id: "facebook",
                  label: "Continue with Facebook",
                  className: "w-full h-11 border-2 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all",
                  icon: (
                    <svg className="mr-2 h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                },
                {
                  id: "instagram",
                  label: "Continue with Instagram",
                  className: "w-full h-11 border-2 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-all",
                  icon: (
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <defs>
                        <linearGradient id="ig-gradient-signin" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#F58529" />
                          <stop offset="50%" stopColor="#DD2A7B" />
                          <stop offset="100%" stopColor="#515BD4" />
                        </linearGradient>
                      </defs>
                      <rect x="3" y="3" width="18" height="18" rx="5" stroke="url(#ig-gradient-signin)" strokeWidth="2" fill="none" />
                      <circle cx="12" cy="12" r="3.5" stroke="url(#ig-gradient-signin)" strokeWidth="2" fill="none" />
                      <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig-gradient-signin)" />
                    </svg>
                  ),
                },
                // {
                //   id: "twitter",
                //   label: "Continue with X (Twitter)",
                //   className: "w-full h-11 border-2 hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-all",
                //   icon: (
                //     <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                //       <path d="M18.244 2.25h3.308l-7.227 8.26 8.498 11.24H16.36l-5.214-6.81-5.97 6.81H1.868l7.72-8.81L1.5 2.25h7.91l4.71 6.238 4.124-6.238z" />
                //     </svg>
                //   ),
                // },
              ].map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className={provider.className}
                  onClick={() => handleOAuthSignIn(provider.id)}
                  disabled={loading}
                >
                  {provider.icon}
                  {provider.label}
                </Button>
              ))}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-neutral-900 px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleCredentialsSignIn} className="grid gap-4">
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 focus:border-purple-400 transition-colors h-11"
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-pink-600" />
                      Password
                    </Label>
                    <Link 
                      href="/forgot-password" 
                      className="text-xs font-medium text-purple-600 hover:text-pink-600 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 focus:border-pink-400 transition-colors h-11"
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all mt-2"
                  disabled={loading || !email || !password}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Signing you in...
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 pt-4">
              <p className="text-xs text-center text-muted-foreground">
                Protected by enterprise-grade security
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
  );
}
