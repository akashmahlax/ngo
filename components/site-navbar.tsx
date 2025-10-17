"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Menu, Search, CommandIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import SignIn from "@/components/auth/sign-in"
import SignOut from "@/components/auth/sign-out"
import { getDashboardBase, getDashboardProfilePath } from "@/lib/nav"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  {
    label: "Jobs",
    items: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Categories", href: "/jobs/categories" },
      { label: "How It Works", href: "/jobs/how-it-works" },
    ],
  },
  {
    label: "NGOs",
    items: [
      { label: "For NGOs", href: "/ngos" },
      { label: "Post a Job", href: "/ngos/post" },
      { label: "Pricing", href: "/ngos/pricing" },
      { label: "Success Stories", href: "/ngos/stories" },
    ],
  },
  {
    label: "Volunteers",
    items: [
      { label: "For Volunteers", href: "/volunteers" },
      { label: "Build Profile", href: "/volunteers/profile" },
      { label: "Badges & Skills", href: "/volunteers/badges" },
      { label: "FAQs", href: "/volunteers/faq" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/guides" },
      { label: "Community", href: "/community" },
      { label: "Help Center", href: "/help" },
    ],
  },
]

export function SiteNavbar() {
  const [open, setOpen] = React.useState(false)
  const [cmdOpen, setCmdOpen] = React.useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()
  // Use the synchronous window location when available so the navbar can
  // decide to hide immediately on first client render (avoids duplicate header)
  const currentPath = typeof window !== "undefined" ? window.location.pathname : pathname
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCmdOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Small typed helpers to avoid using `any` directly
  const role = (session as unknown as { role?: string })?.role
  const userObj = session as unknown as { user?: { avatarUrl?: string; name?: string; email?: string } }

  // Hide the site-wide navbar on dashboard routes to avoid duplicate headers.
  // Our dashboards are available under multiple host paths (app router parallel/
  // segmentized routes). Also hide on top-level '/volunteer' and '/ngo' paths
  // which render dashboard layouts for each role.
  if (
    currentPath &&
    (
      currentPath.startsWith("/dashboard") ||
      currentPath.startsWith("/(dashboard)") ||
      currentPath === "/volunteer" ||
      currentPath.startsWith("/volunteer/") ||
      currentPath === "/ngo" ||
      currentPath.startsWith("/ngo/")
    )
  ) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        {/* Left: Brand + Mobile Menu */}
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 grid gap-2">
                {navItems.map((group) => (
                  <div key={group.label} className="grid gap-1">
                    <span className="text-sm font-medium text-muted-foreground">{group.label}</span>
                    <div className="grid">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary" aria-hidden />
            <span className="font-semibold tracking-tight text-balance">Just Because Asia</span>
          </Link>
        </div>

        {/* Center: Desktop Nav with Submenus */}
        <nav className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link href="/jobs">Jobs</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/volunteers">Volunteers</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/ngos">NGOs</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/ngos/post">Post a Job</Link>
          </Button>
        </nav>

        {/* Right: Actions + User */}
        <div className="hidden items-center gap-2 md:flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent"
                  onClick={() => setCmdOpen(true)}
                  aria-label="Open search"
                >
                  <CommandIcon className="h-4 w-4" />
                  Search
                  <span className="hidden items-center gap-1 md:flex">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open global search</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ThemeToggle />

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={userObj.user?.avatarUrl || undefined} />
                  <AvatarFallback>{userObj.user?.name?.slice(0,2)?.toUpperCase() || "ME"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardBase(role)}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={getDashboardProfilePath(role)}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <span>
                    <SignOut />
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/signup">Sign up</Link>
              </Button>
              <SignIn />
            </div>
          )}
        </div>

        {/* Right (mobile): CTA */}
        <div className="md:hidden">
          <Button asChild>
            <Link href="/ngos/post">Post a Job</Link>
          </Button>
        </div>
      </div>

      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput placeholder="Search jobs, NGOs, categories..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Links">
            <CommandItem asChild>
              <Link href="/jobs">
                <Search className="mr-2 h-4 w-4" />
                Browse Jobs
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/ngos/post">Post a Job</Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/volunteers/profile">Build Profile</Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/jobs/categories">Categories</Link>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Resources">
            <CommandItem asChild>
              <Link href="/blog">Blog</Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/guides">Guides</Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/help">Help Center</Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  )
}
