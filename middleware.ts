import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

// Use Node.js runtime to avoid Edge runtime issues with MongoDB
export const runtime = "nodejs"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication and profile completion
  const volunteerDashboardRoute = "/volunteer"
  const ngoDashboardRoute = "/ngo"
  const ngoPostRoute = "/ngos/post"
  const completeProfileRoute = "/complete-profile"
  
  const isVolunteerRoute = pathname.startsWith(volunteerDashboardRoute)
  const isNgoRoute = pathname.startsWith(ngoDashboardRoute)
  const isNgoPostRoute = pathname.startsWith(ngoPostRoute)
  const isCompleteProfileRoute = pathname.startsWith(completeProfileRoute)
  const isProtectedRoute = isVolunteerRoute || isNgoRoute || isNgoPostRoute

  // Check session
  const session = await auth()

  // If not authenticated, redirect to signin
  if ((isProtectedRoute || isCompleteProfileRoute) && !session?.user) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // If profile not complete and accessing dashboard/protected route, redirect to complete-profile
  if (isProtectedRoute && session?.user) {
    const sessionWithProfile = session as { 
      profileComplete?: boolean
      role?: string
      plan?: string
      planExpiresAt?: string
    }
    
    if (!sessionWithProfile.profileComplete) {
      return NextResponse.redirect(new URL('/complete-profile', request.url))
    }

    const userRole = sessionWithProfile.role
    const userPlan = sessionWithProfile.plan
    const planExpiresAt = sessionWithProfile.planExpiresAt ? new Date(sessionWithProfile.planExpiresAt) : null
    const isPlanExpired = planExpiresAt && new Date() > planExpiresAt

    // Volunteers trying to access NGO post job page - BLOCK (hard redirect)
    if (isNgoPostRoute && userRole === "volunteer") {
      return NextResponse.redirect(new URL('/volunteer', request.url))
    }

    // NGO post route - must have ngo_plus plan with active subscription
    if (isNgoPostRoute) {
      if (userRole !== "ngo") {
        return NextResponse.redirect(new URL('/', request.url))
      }
      // Allow access but add headers to show upgrade prompts
      if (userPlan !== "ngo_plus" || isPlanExpired) {
        const response = NextResponse.next()
        response.headers.set('x-upgrade-required', 'true')
        response.headers.set('x-upgrade-plan', 'ngo_plus')
        response.headers.set('x-upgrade-reason', isPlanExpired ? 'plan_expired' : 'post_job')
        return response
      }
    }

    // Cross-role access prevention (only hard redirect for wrong role)
    if (isVolunteerRoute && userRole !== "volunteer") {
      return NextResponse.redirect(new URL('/ngo', request.url))
    }
    if (isNgoRoute && userRole !== "ngo") {
      return NextResponse.redirect(new URL('/volunteer', request.url))
    }
    
    // ALLOW ALL DASHBOARD ACCESS - No redirects based on plan
    // Users can access their dashboards regardless of plan
    // Individual features will show upgrade prompts if needed
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/volunteer/:path*",
    "/ngo/:path*",
    "/complete-profile",
    "/ngos/post/:path*",
  ],
}