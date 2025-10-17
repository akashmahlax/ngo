import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = [
    "/(dashboard)",
    "/ngos/post",
    "/complete-profile"
  ]

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // For now, just redirect to signin for protected routes
  // The actual auth check will happen in the page components
  if (isProtectedRoute) {
    // Check if user has auth cookie
    const sessionToken = request.cookies.get('authjs.session-token') || 
                        request.cookies.get('__Secure-authjs.session-token')
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/(dashboard)/(.*)",
    "/ngos/post",
    "/complete-profile",
  ],
}