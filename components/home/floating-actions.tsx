'use client'

import { FloatingDock } from "@/components/ui/floating-dock"
import { Home, Briefcase, Users, Building2, BarChart3, MessageSquare } from "lucide-react"

export function FloatingActions() {
  const links = [
    {
      title: "Home",
      icon: <Home className="size-full" />,
      href: "/",
    },
    {
      title: "Find Jobs",
      icon: <Briefcase className="size-full" />,
      href: "/jobs",
    },
    {
      title: "Volunteers",
      icon: <Users className="size-full" />,
      href: "/volunteers",
    },
    {
      title: "NGOs",
      icon: <Building2 className="size-full" />,
      href: "/ngos",
    },
    {
      title: "Dashboard",
      icon: <BarChart3 className="size-full" />,
      href: "/dashboard",
    },
    {
      title: "Contact",
      icon: <MessageSquare className="size-full" />,
      href: "/contact",
    },
  ]

  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <FloatingDock items={links} desktopClassName="gap-4" mobileClassName="gap-4" />
    </div>
  )
}
