import {
  LayoutDashboard,
  FileText,
  Users,
  User,
  Settings,
} from "lucide-react"

export interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export interface NavItems {
  volunteer: NavItem[]
  ngo: NavItem[]
}

export const navItems: NavItems = {
  volunteer: [
    {
      name: "Dashboard",
      href: "/volunteer",
      icon: LayoutDashboard,
    },
    {
      name: "Applications",
      href: "/volunteer/applications",
      icon: FileText,
    },
    {
      name: "Profile",
      href: "/volunteer/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/volunteer/settings",
      icon: Settings,
    },
  ],
  ngo: [
    {
      name: "Dashboard",
      href: "/ngo",
      icon: LayoutDashboard,
    },
    {
      name: "Jobs",
      href: "/ngo/jobs",
      icon: FileText,
    },
    {
      name: "Find Volunteers",
      href: "/volunteers",
      icon: Users,
    },
    {
      name: "Profile",
      href: "/ngo/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/ngo/settings",
      icon: Settings,
    },
  ],
}

export function getDashboardBase(role?: string) {
  if (role === "ngo") return "/ngo"
  if (role === "volunteer") return "/volunteer"
  if (role === "admin") return "/admin"
  return "/volunteer"
}

export function getDashboardProfilePath(role?: string) {
  if (role === "admin") return "/admin"
  return `${getDashboardBase(role)}/profile`
}
