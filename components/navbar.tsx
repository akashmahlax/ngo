'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Handshake, Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { ThemeProvider } from './theme-provider'
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/jobs', label: 'Jobs' },
    { href: '/projects', label: 'Projects' },
    { href: '/ngos', label: 'NGOs' },
    { href: '/volunteers', label: 'Volunteers' },
  ]

  return (
    <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Handshake className="h-6 w-6" />
            <Link href="/" className="font-semibold tracking-tight">
              VolunteerNGO
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {links.map(link => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="h-5 w-px bg-border" />
            <Link href="/auth/signin">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Post a Job</Button>
            </Link>
            <ThemeToggle />
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mt-10 flex flex-col gap-4">
                  {links.map(link => (
                    <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-base">
                      {link.label}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-2" />
                  <Link href="/auth/signin" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full">Sign in</Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full">Post a Job</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
}


