"use client"

import { usePathname } from "next/navigation"
import { UniversalNavbar } from "@/components/universal-navbar"
import { UniversalFooter } from "@/components/universal-footer"

export function SiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Check if we're in a dashboard route (/(dashboard)/ routes)
  const isDashboardRoute = pathname?.includes("/(dashboard)") || 
                           (pathname?.startsWith("/ngo/") && !pathname?.startsWith("/ngos/")) ||
                           (pathname?.startsWith("/volunteer/") && !pathname?.startsWith("/volunteers/"))
  
  return (
    <>
      {/* Universal navbar shows on all pages except dashboard pages */}
      {!isDashboardRoute && <UniversalNavbar />}
      <main className={isDashboardRoute ? "" : "pt-0"}>{children}</main>
      {/* Universal footer shows everywhere except dashboard pages */}
      {!isDashboardRoute && <UniversalFooter />}
    </>
  )
}