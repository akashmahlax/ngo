"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { navItems, getDashboardBase, getDashboardProfilePath } from "@/lib/nav"
import {
  Bell,
  CreditCard,
  Crown,
  Settings,
  User,
  Github,
  Twitter,
  Linkedin,
  Heart,
  LogOut,
  ShieldCheck,
} from "lucide-react"
import SignOut from "@/components/auth/sign-out"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

function AppSidebar({ role, plan, isPlus, daysUntilExpiry, isPureAdmin }: { role: "volunteer" | "ngo", plan: string, isPlus: boolean, daysUntilExpiry: number | null, isPureAdmin: boolean }) {
  const pathname = usePathname()
  const userNavItems = navItems[role as keyof typeof navItems] || navItems.volunteer

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-sidebar-primary-foreground">
                  <span className="text-white font-bold text-sm">JB</span>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Just Because</span>
                  <span className="text-xs text-muted-foreground capitalize">{role} Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {userNavItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.name}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
  {isPlus && !isPureAdmin && daysUntilExpiry !== null && daysUntilExpiry <= 7 && (
          <div className="rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-3 mx-2 mb-2 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold">Plus Plan</span>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs h-5">
                <Crown className="h-3 w-3" />
              </Badge>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Renews in {daysUntilExpiry} days
            </p>
          </div>
        )}
        
  {!isPlus && !isPureAdmin && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`/upgrade?plan=${role}_plus`}>
                  <Crown className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent" />
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-semibold">
                    Upgrade to Plus
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session?.user) return null

  // Handle admin users viewing dashboards
  const rawRole = session.role as string | null
  const isAdmin = Boolean((session as any).isAdmin || rawRole === "admin")
  const isPureAdmin = isAdmin && (!rawRole || rawRole === "admin")

  let viewRole: "volunteer" | "ngo" = rawRole === "ngo" ? "ngo" : "volunteer"

  if (isAdmin) {
    if (pathname.startsWith("/ngo")) {
      viewRole = "ngo"
    } else if (pathname.startsWith("/volunteer")) {
      viewRole = "volunteer"
    } else if (rawRole === "ngo") {
      viewRole = "ngo"
    }
  }

  const plan = session.plan || "free"
  const planExpiresAt = session.planExpiresAt ? new Date(session.planExpiresAt) : null
  const isPlus = plan?.includes("plus") || false
  const daysUntilExpiry = planExpiresAt 
    ? Math.ceil((planExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const userNavItems = navItems[viewRole as keyof typeof navItems] || navItems.volunteer

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar
          role={viewRole}
          plan={plan || "free"}
          isPlus={isPlus}
          daysUntilExpiry={daysUntilExpiry}
          isPureAdmin={isPureAdmin}
        />
        
        <main className="flex-1 flex flex-col">
          {/* Creative Floating Navbar */}
          <div className="sticky top-0 z-30 p-4 pb-0">
            <header className="bg-card/80 backdrop-blur-xl border rounded-2xl shadow-lg px-6 py-3 mx-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-2 hover:bg-accent/50 rounded-lg transition-colors" />
                <Separator orientation="vertical" className="h-6" />
                
                <div className="flex-1">
                  <nav className="text-sm breadcrumbs flex items-center gap-2">
                    <Link 
                      href={getDashboardBase(viewRole)} 
                      className="text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1 hover:bg-accent/50"
                    >
                      {viewRole === "ngo" ? "NGO Portal" : "Volunteer Hub"}
                    </Link>
                    <div className="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
                    <div className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-semibold">
                      {userNavItems.find((item) => item.href === pathname)?.name || "Dashboard"}
                    </div>
                    {isAdmin && (
                      <>
                        <div className="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
                        <Badge variant="default" className="bg-red-600 hover:bg-red-700 text-white">
                          Admin View
                        </Badge>
                      </>
                    )}
                  </nav>
                </div>

                <div className="flex items-center gap-1">
                  <ThemeToggle />

                  {isAdmin && (
                    <>
                      <Separator orientation="vertical" className="h-6 mx-2" />
                      <Button asChild variant="default" size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        <Link href="/admin">
                          <Settings className="h-3 w-3 mr-1" />
                          Back to Admin
                        </Link>
                      </Button>
                    </>
                  )}

                  {/* <Button variant="ghost" size="icon" className="relative hover:bg-accent/50 rounded-lg transition-colors">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
                  </Button> */}

                  <Separator orientation="vertical" className="h-6 mx-2" />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-3 px-3 hover:bg-accent/50 rounded-xl transition-all duration-200 hover:scale-105">
                        <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                          <AvatarImage src={session.user.avatarUrl || session.user.image || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-white text-xs font-bold">
                            {session.user.name?.slice(0, 2).toUpperCase() || "ME"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:flex flex-col items-start">
                          <span className="text-sm font-semibold leading-none">
                            {session.user.name || "User"}
                          </span>
                          <div className="flex items-center gap-1 mt-0.5">
                            {isPureAdmin ? (
                              <ShieldCheck className="h-3 w-3 text-red-500" />
                            ) : isPlus ? (
                              <Crown className="h-3 w-3 text-amber-500" />
                            ) : (
                              <div className="h-3 w-3 rounded-full bg-muted" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {isPureAdmin ? "Admin Access" : isPlus ? "Plus Member" : "Free Member"}
                            </span>
                          </div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 rounded-xl border-2" align="end">
                      <DropdownMenuLabel className="font-normal p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                            <AvatarImage src={session.user.avatarUrl || session.user.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-bold">
                              {session.user.name?.slice(0, 2).toUpperCase() || "ME"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-semibold">
                              {session.user.name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {session.user.email}
                            </p>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className="text-xs capitalize px-2 py-0.5">
                                {isPureAdmin ? "Admin" : (rawRole || viewRole)}
                              </Badge>
                              <Badge
                                variant={isPureAdmin ? "destructive" : isPlus ? "default" : "secondary"}
                                className={cn(
                                  "text-xs px-2 py-0.5",
                                  isPlus && !isPureAdmin ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : undefined
                                )}
                              >
                                {isPureAdmin ? (
                                  <div className="flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    Admin
                                  </div>
                                ) : isPlus ? (
                                  <div className="flex items-center gap-1">
                                    <Crown className="h-3 w-3" />
                                    Plus
                                  </div>
                                ) : "Free"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={getDashboardProfilePath(viewRole)} className="flex items-center gap-3 p-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Profile</span>
                            <span className="text-xs text-muted-foreground">Manage your profile</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/${viewRole}/settings`} className="flex items-center gap-3 p-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900/20">
                            <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Settings</span>
                            <span className="text-xs text-muted-foreground">Account preferences</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/${viewRole}/billing`} className="flex items-center gap-3 p-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                            <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Billing</span>
                            <span className="text-xs text-muted-foreground">Subscription & payments</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      {!isPlus && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/upgrade" className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg mx-2 my-1">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-500">
                                <Crown className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                  Upgrade Plan
                                </span>
                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                  Unlock premium features
                                </span>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="p-3 cursor-pointer">
                        <SignOut />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {children}
          </div>

          {/* Dashboard Footer */}
          <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
            <div className="container mx-auto px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                {/* Brand */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">JB</span>
                    </div>
                    <span className="font-semibold text-sm">Just Because Asia</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Connecting passionate volunteers with impactful NGOs.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="font-semibold mb-2 text-xs">Quick Links</h3>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li><Link href="/jobs" className="hover:text-foreground transition-colors">Browse Jobs</Link></li>
                    <li><Link href="/volunteers" className="hover:text-foreground transition-colors">Find Volunteers</Link></li>
                    <li><Link href="/ngos" className="hover:text-foreground transition-colors">Explore NGOs</Link></li>
                    <li><Link href="/upgrade" className="hover:text-foreground transition-colors">Pricing</Link></li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="font-semibold mb-2 text-xs">Resources</h3>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                    <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                    <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                    <li><Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                  </ul>
                </div>

                {/* Social */}
                <div>
                  <h3 className="font-semibold mb-2 text-xs">Connect</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                      <Link href="#" target="_blank">
                        <Twitter className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                      <Link href="#" target="_blank">
                        <Linkedin className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                      <Link href="#" target="_blank">
                        <Github className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                    Made with <Heart className="h-3 w-3 inline text-red-500 fill-red-500" /> for a better world
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
                <p>© 2025 Just Because Asia. All rights reserved.</p>
                <div className="flex gap-4">
                  <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                  <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                  <Link href="#" className="hover:text-foreground transition-colors">Cookies</Link>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  )
}
