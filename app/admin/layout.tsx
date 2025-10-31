import Link from "next/link"
import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  BarChart3,
  Settings,
  Shield
} from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authResult = await checkAdminAuth()
  
  if (!authResult.authorized) {
    redirect("/signin")
  }

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/jobs", icon: Briefcase, label: "Jobs" },
    { href: "/admin/billing", icon: DollarSign, label: "Billing" },
    { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="font-bold text-xl">Admin Panel</span>
            </Link>
            <Badge variant="default">
              {authResult.admin?.level === "super" ? "Super Admin" : "Moderator"}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {authResult.admin?.email}
            </span>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Exit Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container flex gap-6 py-6">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          <nav className="sticky top-20 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
