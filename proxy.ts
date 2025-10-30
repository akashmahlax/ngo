import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "./auth"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication and profile completion
  const volunteerDashboardRoute = "/volunteer"
  const ngoDashboardRoute = "/ngo"
  const ngoPostRoute = "/ngos/post"
  const upgradeRoute = "/upgrade"
  const authCallbackRoute = "/auth-callback"
  
  const isVolunteerRoute = pathname.startsWith(volunteerDashboardRoute)
  const isNgoRoute = pathname.startsWith(ngoDashboardRoute)
  const isNgoPostRoute = pathname.startsWith(ngoPostRoute)
  const isUpgradeRoute = pathname.startsWith(upgradeRoute)
  const isAuthCallbackRoute = pathname.startsWith(authCallbackRoute)
  const isProtectedRoute = isVolunteerRoute || isNgoRoute || isNgoPostRoute || isUpgradeRoute

  // Check session
  const session = await auth()

  // If not authenticated, redirect to signin (except auth-callback which handles its own auth check)
  if (isProtectedRoute && !session?.user) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // If authenticated, perform role-based checks
  if (session?.user) {
    const sessionWithProfile = session as { 
      profileComplete?: boolean
      role?: "volunteer" | "ngo"
      plan?: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus" | null
      planExpiresAt?: string
      onboardingStep?: "role" | "profile" | "plan" | "completed" | null
    }
    
    // If user doesn't have a role yet (new OAuth user who hasn't been through auth-callback),
    // redirect them to sign-up to choose role
    if (isProtectedRoute && !sessionWithProfile.role) {
      return NextResponse.redirect(new URL('/signup', request.url))
    }

    const userRole = sessionWithProfile.role
    const userPlan = sessionWithProfile.plan
    const planExpiresAt = sessionWithProfile.planExpiresAt ? new Date(sessionWithProfile.planExpiresAt) : null
    const isPlanExpired = planExpiresAt && new Date() > planExpiresAt
    const onboardingStep = sessionWithProfile.onboardingStep

    // Only redirect to plan page if explicitly in plan onboarding step
    if (onboardingStep === "plan" && !isUpgradeRoute) {
      return NextResponse.redirect(new URL('/signup/plan', request.url))
    }

    // Role-based access control - Prevent cross-role access
    if (isVolunteerRoute && userRole !== "volunteer") {
      return NextResponse.redirect(new URL('/ngo', request.url))
    }
    
    if (isNgoRoute && userRole !== "ngo") {
      return NextResponse.redirect(new URL('/volunteer', request.url))
    }

    // NGO post job route - Strict access control
    if (isNgoPostRoute) {
      // Must be an NGO to access
      if (userRole !== "ngo") {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // Must have active ngo_plus plan to post jobs
      if (userPlan !== "ngo_plus" || isPlanExpired) {
        // Redirect to upgrade page with context
        const upgradeUrl = new URL('/upgrade', request.url)
        upgradeUrl.searchParams.set('plan', 'ngo_plus')
        upgradeUrl.searchParams.set('reason', 'post_job')
        return NextResponse.redirect(upgradeUrl)
      }
    }

    // Volunteer application limits (free tier)
    if (isVolunteerRoute && userRole === "volunteer") {
      if (userPlan === "volunteer_free" || isPlanExpired) {
        // Add header to show upgrade prompts for limited features
        const response = NextResponse.next()
        response.headers.set('x-plan-tier', 'free')
        response.headers.set('x-upgrade-available', 'true')
        return response
      }
    }

    // Allow access for authenticated users with proper roles
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/volunteer/:path*",
    "/ngo/:path*",
    "/auth-callback",
    "/ngos/post/:path*",
    "/upgrade",
  ],
}