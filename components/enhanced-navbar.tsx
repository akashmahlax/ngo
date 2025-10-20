"use client"

import * as React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { searchPlatform, SearchResult } from "@/lib/search"
import {
  Menu,
  Search,
  Briefcase,
  Users,
  Building2,
  Heart,
  Home,
  LayoutDashboard,
  Sparkles,
  MapPin,
  Tag
} from "lucide-react"
import SignOut from "@/components/auth/sign-out"
import { getDashboardBase } from "@/lib/nav"

export function EnhancedNavbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  // Handle search
  const handleSearch = React.useCallback(async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchPlatform(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Handle search result selection
  const handleSelectResult = (result: SearchResult) => {
    setSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
    router.push(result.url)
  }

  // Keyboard shortcut for search
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home className="h-4 w-4" />,
    },
    {
      name: "Jobs",
      link: "/jobs",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      name: "Volunteers",
      link: "/volunteers",
      icon: <Users className="h-4 w-4" />,
    },
    {
      name: "NGOs",
      link: "/ngos",
      icon: <Building2 className="h-4 w-4" />,
    },
  ]

  const userNavItems = session?.user ? [
    ...navItems,
    {
      name: "Dashboard",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      link: getDashboardBase((session.user as any).role || "volunteer"),
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
  ] : navItems

  return (
    <>
      {/* Desktop Floating Nav */}
      <div className="hidden md:block">
        <FloatingNav navItems={userNavItems} />
      </div>

      {/* Mobile/Fallback Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-950/80 md:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                <Heart className="h-5 w-5 fill-white text-white" />
              </div>
              <span className="text-lg font-bold text-neutral-900 dark:text-white">
                VolunteerNGO
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="border-t border-neutral-200 py-4 dark:border-neutral-800">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === item.link
                        ? "bg-purple-100 text-purple-900 dark:bg-purple-900/20 dark:text-purple-300"
                        : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {status === "authenticated" && session?.user ? (
                  <>
                    <Link
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      href={getDashboardBase((session.user as any).role || "volunteer")}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <SignOut />
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/signin">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <HoverBorderGradient
                        containerClassName="w-full"
                        className="flex items-center justify-center gap-2 bg-white dark:bg-neutral-950"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Get Started Free</span>
                      </HoverBorderGradient>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Desktop Static Header with Actions */}
      <div className="hidden border-b border-neutral-200 bg-white/50 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/50 md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                <Heart className="h-5 w-5 fill-white text-white" />
              </div>
              <span className="text-xl font-bold text-neutral-900 dark:text-white">
                VolunteerNGO
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                Beta
              </Badge>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              
              <ThemeToggle />

              {status === "authenticated" && session?.user ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Link href={getDashboardBase((session.user as any).role || "volunteer")}>
                    <Button variant="outline" size="sm">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                      {session.user.name?.[0] || session.user.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/signin">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <HoverBorderGradient className="flex items-center gap-2 bg-white dark:bg-neutral-950">
                      <Sparkles className="h-4 w-4" />
                      <span>Get Started</span>
                    </HoverBorderGradient>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Search jobs, volunteers, NGOs..."
          value={searchQuery}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults.length > 0 && (
            <>
              <CommandGroup heading="Jobs">
                {searchResults
                  .filter(result => result.type === 'job')
                  .map((result) => (
                    <CommandItem
                      key={`job-${result.id}`}
                      value={result.title}
                      onSelect={() => handleSelectResult(result)}
                      className="flex items-center gap-3"
                    >
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">{result.title}</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {result.subtitle}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Volunteers">
                {searchResults
                  .filter(result => result.type === 'volunteer')
                  .map((result) => (
                    <CommandItem
                      key={`volunteer-${result.id}`}
                      value={result.title}
                      onSelect={() => handleSelectResult(result)}
                      className="flex items-center gap-3"
                    >
                      <Users className="h-4 w-4 text-green-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">{result.title}</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {result.subtitle}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="NGOs">
                {searchResults
                  .filter(result => result.type === 'ngo')
                  .map((result) => (
                    <CommandItem
                      key={`ngo-${result.id}`}
                      value={result.title}
                      onSelect={() => handleSelectResult(result)}
                      className="flex items-center gap-3"
                    >
                      <Building2 className="h-4 w-4 text-purple-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">{result.title}</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {result.subtitle}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
