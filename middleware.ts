import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication and profile completion
  const protectedRoutes = ["/(dashboard)", "/ngos/post"]
  const completeProfileRoutes = ["/(auth)/complete-profile"]
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isCompleteProfileRoute = completeProfileRoutes.some(route => pathname.startsWith(route))

  // Check session
  const session = await auth()

  // If not authenticated, redirect to signin
  if ((isProtectedRoute || isCompleteProfileRoute) && !session?.user) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // If profile not complete and accessing dashboard/protected route, redirect to complete-profile
  if (isProtectedRoute && session?.user) {
    const sessionWithProfile = session as { profileComplete?: boolean }
    if (!sessionWithProfile.profileComplete) {
      return NextResponse.redirect(new URL('/(auth)/complete-profile', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/(dashboard)/(.*)",
    "/(auth)/complete-profile",
    "/ngos/post",
  ],
}