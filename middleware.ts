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

    // Volunteers trying to access NGO post job page - BLOCK
    if (isNgoPostRoute && userRole === "volunteer") {
      return NextResponse.redirect(new URL('/volunteer', request.url))
    }

    // NGO post route - must have ngo_plus plan with active subscription
    if (isNgoPostRoute) {
      if (userRole !== "ngo") {
        return NextResponse.redirect(new URL('/', request.url))
      }
      if (userPlan !== "ngo_plus" || isPlanExpired) {
        return NextResponse.redirect(new URL('/upgrade?plan=ngo_plus&reason=post_job', request.url))
      }
    }

    // Volunteer dashboard access - only volunteer_free and volunteer_plus with active plan
    if (isVolunteerRoute && userRole === "volunteer") {
      if (userPlan !== "volunteer_free" && userPlan !== "volunteer_plus") {
        return NextResponse.redirect(new URL('/upgrade?plan=volunteer_plus&reason=dashboard_access', request.url))
      }
      // If volunteer_plus but expired, redirect to upgrade
      if (userPlan === "volunteer_plus" && isPlanExpired) {
        return NextResponse.redirect(new URL('/upgrade?plan=volunteer_plus&reason=plan_expired', request.url))
      }
    }

    // NGO dashboard access - require ngo_plus (paid plan only, except ngo_base can view billing)
    if (isNgoRoute && userRole === "ngo") {
      // Allow access to billing page for all NGOs to upgrade
      const isBillingRoute = pathname.startsWith("/ngo/billing")
      
      if (!isBillingRoute && userPlan !== "ngo_plus") {
        return NextResponse.redirect(new URL('/upgrade?plan=ngo_plus&reason=dashboard_access', request.url))
      }
      
      // If ngo_plus but expired, redirect to upgrade
      if (userPlan === "ngo_plus" && isPlanExpired) {
        if (!isBillingRoute) {
          return NextResponse.redirect(new URL('/upgrade?plan=ngo_plus&reason=plan_expired', request.url))
        }
      }
    }

    // Cross-role access prevention
    if (isVolunteerRoute && userRole !== "volunteer") {
      return NextResponse.redirect(new URL('/ngo', request.url))
    }
    if (isNgoRoute && userRole !== "ngo") {
      return NextResponse.redirect(new URL('/volunteer', request.url))
    }
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