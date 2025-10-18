import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

// Use Node.js runtime to avoid Edge runtime issues with MongoDB
export const runtime = "nodejs"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication and profile completion
  const dashboardRoutes = ["/volunteer", "/ngo"]
  const ngoPostRoute = "/ngos/post"
  const completeProfileRoute = "/complete-profile"
  
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route))
  const isNgoPostRoute = pathname.startsWith(ngoPostRoute)
  const isCompleteProfileRoute = pathname.startsWith(completeProfileRoute)
  const isProtectedRoute = isDashboardRoute || isNgoPostRoute

  // Check session
  const session = await auth()

  // If not authenticated, redirect to signin
  if ((isProtectedRoute || isCompleteProfileRoute) && !session?.user) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // If profile not complete and accessing dashboard/protected route, redirect to complete-profile
  if (isProtectedRoute && session?.user) {
    const sessionWithProfile = session as { profileComplete?: boolean; role?: string; plan?: string }
    
    if (!sessionWithProfile.profileComplete) {
      return NextResponse.redirect(new URL('/complete-profile', request.url))
    }

    // Special check for NGO post route - must have ngo_plus plan
    if (isNgoPostRoute) {
      if (sessionWithProfile.role !== "ngo") {
        return NextResponse.redirect(new URL('/ngo', request.url))
      }
      if (sessionWithProfile.plan !== "ngo_plus") {
        return NextResponse.redirect(new URL('/upgrade?plan=ngo_plus', request.url))
      }
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