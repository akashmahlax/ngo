import { auth } from "@/auth"
import { CheckoutButton } from "@/components/billing/CheckoutButton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Crown, Sparkles, Zap, Shield, TrendingUp, Users, Briefcase } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
            <Sparkles className="h-3 w-3 mr-1" />
            Special Launch Pricing - ₹1/month
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Unlock Your Full Potential
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isVolunteer && "Apply to unlimited opportunities and stand out with premium features"}
            {isNGO && "Post unlimited jobs and reach the best volunteers with advanced tools"}
            {!isVolunteer && !isNGO && "Choose the perfect plan for your journey"}
          </p>
          {reason && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {reason === "plan_expired" && "Your plan has expired. Renew to continue accessing premium features."}
                {reason === "post_job" && "Upgrade to NGO Plus to post jobs and reach volunteers."}
                {reason === "dashboard_access" && "Upgrade to access your full dashboard and features."}
                {reason === "apply_job" && "Upgrade to apply to unlimited volunteer opportunities."}
              </p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Volunteer Free Plan */}
          {isVolunteer && (
            <Card className={`relative ${currentPlan === "volunteer_free" ? "border-2 border-blue-500" : ""}`}>
              {currentPlan === "volunteer_free" && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">
                  Current Plan
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  <CardTitle>Volunteer Free</CardTitle>
                </div>
                <CardDescription>Get started with basic features</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Free</span>
                  <span className="text-muted-foreground ml-2">Forever</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">1 job application per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Browse all opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Basic profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Application tracking</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === "volunteer_free" ? (
                  <Button disabled className="w-full">Current Plan</Button>
                ) : (
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/volunteer">Go to Dashboard</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          {/* Volunteer Plus Plan */}
          {isVolunteer && (
            <Card className={`relative border-2 ${currentPlan === "volunteer_plus" ? "border-amber-500" : "border-amber-200 dark:border-amber-900"} bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20`}>
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-none">
                <Crown className="h-3 w-3 mr-1" />
                {currentPlan === "volunteer_plus" ? "Current Plan" : "Most Popular"}
              </Badge>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-amber-600" />
                  <CardTitle>Volunteer Plus</CardTitle>
                </div>
                <CardDescription>Unlock unlimited applications</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹1</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  🎉 Launch special - Regular price ₹99/month
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-semibold">Unlimited job applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Priority application badge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Advanced profile features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Application analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Save favorite jobs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Email notifications</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === "volunteer_plus" ? (
                  <Button disabled className="w-full">Current Plan</Button>
                ) : (
                  <CheckoutButton plan="volunteer_plus" className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600" />
                )}
              </CardFooter>
            </Card>
          )}

          {/* NGO Base Plan */}
          {isNGO && (
            <Card className={`relative ${currentPlan === "ngo_base" ? "border-2 border-blue-500" : ""}`}>
              {currentPlan === "ngo_base" && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">
                  Current Plan
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-gray-600" />
                  <CardTitle>NGO Base</CardTitle>
                </div>
                <CardDescription>Essential tools to get started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Free</span>
                  <span className="text-muted-foreground ml-2">Forever</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Post up to 3 active jobs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">View applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Basic profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Application management</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === "ngo_base" ? (
                  <Button disabled className="w-full">Current Plan</Button>
                ) : (
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/ngo">Go to Dashboard</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          {/* NGO Plus Plan */}
          {isNGO && (
            <Card className={`relative border-2 ${currentPlan === "ngo_plus" ? "border-purple-500" : "border-purple-200 dark:border-purple-900"} bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20`}>
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none">
                <Crown className="h-3 w-3 mr-1" />
                {currentPlan === "ngo_plus" ? "Current Plan" : "Recommended"}
              </Badge>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <CardTitle>NGO Plus</CardTitle>
                </div>
                <CardDescription>Advanced tools for growth</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹1</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                  🎉 Launch special - Regular price ₹299/month
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-semibold">Unlimited job postings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Featured job listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Verified badge option</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Custom branding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Candidate screening tools</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === "ngo_plus" ? (
                  <Button disabled className="w-full">Current Plan</Button>
                ) : (
                  <CheckoutButton plan="ngo_plus" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" />
                )}
              </CardFooter>
            </Card>
          )}

          {/* Show message if no role detected */}
          {!isVolunteer && !isNGO && (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>Please complete your profile to view available plans</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="/complete-profile">Complete Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Features Grid */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Why Upgrade?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Unlimited Growth</h3>
              <p className="text-sm text-muted-foreground">
                No limits on applications or job postings. Scale as you grow.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Priority Features</h3>
              <p className="text-sm text-muted-foreground">
                Stand out with badges, featured listings, and priority placement.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Advanced Tools</h3>
              <p className="text-sm text-muted-foreground">
                Analytics, insights, and tools to make better decisions.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ or Trust Signals */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Secure payment powered by Razorpay • 💳 Cancel anytime • ⚡ Instant activation
          </p>
        </div>
      </div>
    </div>
  )
}
