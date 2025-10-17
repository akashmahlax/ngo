"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  User,
  Settings,
  Crown,
  Menu,
  LogOut,
  Bell,
} from "lucide-react"
import SignOut from "@/components/auth/sign-out"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = {
  volunteer: [
    {
      name: "Dashboard",
      href: "/dashboard/volunteer",
      icon: LayoutDashboard,
    },
    {
      name: "Applications",
      href: "/dashboard/volunteer/applications",
      icon: FileText,
    },
    {
      name: "Profile",
      href: "/dashboard/volunteer/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/dashboard/volunteer/settings",
      icon: Settings,
    },
  ],
  ngo: [
    {
      name: "Dashboard",
      href: "/dashboard/ngo",
      icon: LayoutDashboard,
    },
    {
      name: "Jobs",
      href: "/dashboard/ngo/jobs",
      icon: FileText,
    },
    {
      name: "Find Volunteers",
      href: "/volunteers",
      icon: Users,
    },
    {
      name: "Profile",
      href: "/dashboard/ngo/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/dashboard/ngo/settings",
      icon: Settings,
    },
  ],
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session?.user) return null

  const role = (session as any).role || "volunteer"
  const plan = (session as any).plan
  const isPlus = plan?.includes("plus")
  const isExpired = (session as any).planExpiresAt && 
    new Date((session as any).planExpiresAt) < new Date()

  const navItems = navigation[role as keyof typeof navigation] || navigation.volunteer

  const Sidebar = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary" />
          <span className="font-semibold">Just Because Asia</span>
        </Link>
      </div>
      
      <Separator />
      
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <Separator />
      
      <div className="p-3">
        {!isPlus && (
          <Link
            href="/upgrade"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-accent"
            onClick={() => setSidebarOpen(false)}
          >
            <Crown className="h-4 w-4" />
            Upgrade Plan
          </Link>
        )}
        
        {isExpired && (
          <div className="rounded-md bg-amber-50 border border-amber-200 p-3 mb-3">
            <p className="text-xs text-amber-800">
              Your plan has expired. <Link href="/upgrade" className="underline">Renew now</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">
              {navItems.find(item => item.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={(session.user as any).avatarUrl} />
                    <AvatarFallback>
                      {session.user.name?.slice(0, 2).toUpperCase() || "ME"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {role}
                      </Badge>
                      <Badge variant={isPlus ? "default" : "secondary"} className="text-xs">
                        {plan?.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/volunteer/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/volunteer/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {!isPlus && (
                  <DropdownMenuItem asChild>
                    <Link href="/upgrade">
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade Plan
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
