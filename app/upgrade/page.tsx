import { auth } from "@/auth"
import { CheckoutButton } from "@/components/billing/CheckoutButton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Crown, Sparkles, Zap, Shield, TrendingUp, Users, Briefcase, Lock, Star, BarChart, Bell } from "lucide-react"
import Link from "next/link"

type UpgradeSearchParams = {
  plan?: "volunteer_plus" | "ngo_plus"
  reason?: string
}

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<UpgradeSearchParams>
}) {
  const [params, session] = await Promise.all([searchParams, auth()])
  type SessionWithRole = typeof session & {
    role?: "volunteer" | "ngo"
    plan?: string
    user?: {
      role?: "volunteer" | "ngo"
    }
  }
  const sessionWithRole = session as SessionWithRole
  const userRole = sessionWithRole?.role || sessionWithRole?.user?.role
  const currentPlan = sessionWithRole?.plan || "volunteer_free"
  const reason = params?.reason

  // Determine which plans to show based on user role
  const isVolunteer = userRole === "volunteer"
  const isNGO = userRole === "ngo"

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-full blur-3xl opacity-10" />
      </div>

      <div className="relative container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white border-none px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 mr-1" />
            Special Launch Pricing - ₹1/month
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Unlock Your Full Potential
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            {isVolunteer && "Apply to unlimited opportunities and stand out with premium features"}
            {isNGO && "Post unlimited jobs and reach the best volunteers with advanced tools"}
            {!isVolunteer && !isNGO && "Choose the perfect plan for your journey"}
          </p>
          {reason && (
            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-900/50 rounded-xl max-w-md mx-auto shadow-lg">
              <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">
                {reason === "plan_expired" && "⏰ Your plan has expired. Renew to continue accessing premium features."}
                {reason === "post_job" && "🚀 Upgrade to NGO Plus to post jobs and reach volunteers."}
                {reason === "dashboard_access" && "✨ Upgrade to access your full dashboard and features."}
                {reason === "apply_job" && "💼 Upgrade to apply to unlimited volunteer opportunities."}
              </p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-16">
          {/* Volunteer Free Plan */}
          {isVolunteer && (
            <Card className={`relative transition-all hover:shadow-xl ${
              currentPlan === "volunteer_free" 
                ? "border-2 border-purple-500 shadow-xl" 
                : "border-2 hover:border-purple-300"
            }`}>
              {currentPlan === "volunteer_free" && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Current Plan
                </Badge>
              )}
              <CardHeader className="pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Free</CardTitle>
                </div>
                <CardDescription className="text-base">Get started with basic features</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold">₹0</span>
                  <span className="text-muted-foreground ml-2 text-lg">Forever</span>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">1 job application per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Browse all opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Basic profile features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Application tracking</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === "volunteer_free" ? (
                  <Button disabled className="w-full h-11">
                    <Star className="h-4 w-4 mr-2" />
                    Current Plan
                  </Button>
                ) : (
                  <Button variant="outline" asChild className="w-full h-11 border-2">
                    <Link href="/volunteer">Go to Dashboard</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          {/* Volunteer Plus Plan */}
          {isVolunteer && (
            <Card className={`relative border-2 transition-all ${
              currentPlan === "volunteer_plus" 
                ? "border-purple-500 shadow-2xl scale-105" 
                : "border-purple-300 dark:border-purple-700 hover:border-purple-400 hover:shadow-2xl lg:scale-105"
            } bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20`}>
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none shadow-xl">
                <Crown className="h-3 w-3 mr-1" />
                {currentPlan === "volunteer_plus" ? "Current Plan" : "Most Popular"}
              </Badge>
              <CardHeader className="pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Plus</CardTitle>
                </div>
                <CardDescription className="text-base">Unlock unlimited applications</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹1</span>
                  <span className="text-muted-foreground ml-2 text-lg">/month</span>
                </div>
                <div className="mt-2 p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                  <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 text-center">
                    🎉 Launch Offer - Regular price ₹99/mo
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Zap className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold">Unlimited job applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Priority application badge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Advanced profile features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Detailed analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Save unlimited favorite jobs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Real-time email notifications</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === "volunteer_plus" ? (
                  <Button disabled className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600">
                    <Star className="h-4 w-4 mr-2" />
                    Current Plan
                  </Button>
                ) : (
                  <CheckoutButton 
                    plan="volunteer_plus" 
                    className="w-full h-11 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-lg hover:shadow-xl text-base font-semibold" 
                  />
                )}
              </CardFooter>
            </Card>
          )}

          {/* NGO Base Plan */}
          {isNGO && (
            <Card className={`relative transition-all hover:shadow-xl ${
              currentPlan === "ngo_base" 
                ? "border-2 border-purple-500 shadow-xl" 
                : "border-2 hover:border-purple-300"
            }`}>
              {currentPlan === "ngo_base" && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Current Plan
                </Badge>
              )}
              <CardHeader className="pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Base</CardTitle>
                </div>
                <CardDescription className="text-base">Essential tools to get started</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold">₹0</span>
                  <span className="text-muted-foreground ml-2 text-lg">Forever</span>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Post up to 3 active jobs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">View and manage applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Basic organization profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Application tracking tools</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === "ngo_base" ? (
                  <Button disabled className="w-full h-11">
                    <Star className="h-4 w-4 mr-2" />
                    Current Plan
                  </Button>
                ) : (
                  <Button variant="outline" asChild className="w-full h-11 border-2">
                    <Link href="/ngo">Go to Dashboard</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          {/* NGO Plus Plan */}
          {isNGO && (
            <Card className={`relative border-2 transition-all ${
              currentPlan === "ngo_plus" 
                ? "border-purple-500 shadow-2xl scale-105" 
                : "border-purple-300 dark:border-purple-700 hover:border-purple-400 hover:shadow-2xl lg:scale-105"
            } bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20`}>
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none shadow-xl">
                <Crown className="h-3 w-3 mr-1" />
                {currentPlan === "ngo_plus" ? "Current Plan" : "Recommended"}
              </Badge>
              <CardHeader className="pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Plus</CardTitle>
                </div>
                <CardDescription className="text-base">Advanced tools for growth</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹1</span>
                  <span className="text-muted-foreground ml-2 text-lg">/month</span>
                </div>
                <div className="mt-2 p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                  <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 text-center">
                    🎉 Launch Offer - Regular price ₹299/mo
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Zap className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold">Unlimited job postings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Featured job listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Advanced analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Priority customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Verified organization badge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Custom branding options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Candidate screening tools</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === "ngo_plus" ? (
                  <Button disabled className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600">
                    <Star className="h-4 w-4 mr-2" />
                    Current Plan
                  </Button>
                ) : (
                  <CheckoutButton 
                    plan="ngo_plus" 
                    className="w-full h-11 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-lg hover:shadow-xl text-base font-semibold" 
                  />
                )}
              </CardFooter>
            </Card>
          )}

          {/* Show message if no role detected */}
          {!isVolunteer && !isNGO && (
            <Card className="col-span-full border-2 border-purple-300 dark:border-purple-700">
              <CardHeader>
                <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
                <CardDescription className="text-base">Please complete your profile to view available plans</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link href="/complete-profile">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Complete Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Why Upgrade Today?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Unlimited Growth</h3>
              <p className="text-sm text-muted-foreground">
                No limits on applications or job postings. Scale as you grow without restrictions.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-2 border-pink-200 dark:border-pink-800 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Stand Out</h3>
              <p className="text-sm text-muted-foreground">
                Get priority badges, featured listings, and premium placement to shine.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BarChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Advanced Insights</h3>
              <p className="text-sm text-muted-foreground">
                Access powerful analytics and tools to make data-driven decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Secure payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-pink-600" />
                <span className="font-medium">Instant activation</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
            <p className="text-center mt-4 text-xs text-muted-foreground">
              Powered by Razorpay • 256-bit SSL encryption • PCI DSS compliant
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
