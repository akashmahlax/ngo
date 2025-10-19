"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Mail, 
  ArrowRight, 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram,
  Briefcase,
  Users,
  Building2,
  FileText,
  Shield,
  HelpCircle,
  Phone,
  MapPin,
  Crown,
  Zap,
  Sparkles
} from "lucide-react"

const footerSections = {
  platform: {
    title: "Platform",
    links: [
      { title: "Browse Jobs", href: "/jobs" },
      { title: "Find Volunteers", href: "/volunteers" },
      { title: "Organizations", href: "/ngos" },
      { title: "Success Stories", href: "/stories" },
    ]
  },
  forNGOs: {
    title: "For Organizations", 
    links: [
      { title: "Post a Job", href: "/ngos/post" },
      { title: "Pricing Plans", href: "/pricing" },
      { title: "How It Works", href: "/ngos/how-it-works" },
      { title: "Best Practices", href: "/ngos/best-practices" },
    ]
  },
  forVolunteers: {
    title: "For Volunteers",
    links: [
      { title: "Build Profile", href: "/volunteers/profile" },
      { title: "Application Tips", href: "/volunteers/tips" },
      { title: "Skill Badges", href: "/volunteers/badges" },
      { title: "Community", href: "/community" },
    ]
  },
  resources: {
    title: "Resources",
    links: [
      { title: "Help Center", href: "/help" },
      { title: "Blog", href: "/blog" },
      { title: "API Documentation", href: "/api-docs" },
      { title: "Guides", href: "/guides" },
    ]
  },
  company: {
    title: "Company",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Careers", href: "/careers" },
      { title: "Press Kit", href: "/press" },
      { title: "Contact", href: "/contact" },
    ]
  },
  legal: {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Cookie Policy", href: "/cookies" },
      { title: "Data Protection", href: "/data-protection" },
    ]
  }
}

const quickActions = [
  { title: "Dashboard", href: "/dashboard", icon: Briefcase, description: "Access your dashboard" },
  { title: "Applications", href: "/applications", icon: FileText, description: "Track your applications" },
  { title: "Messages", href: "/messages", icon: Mail, description: "View conversations" },
  { title: "Settings", href: "/settings", icon: Shield, description: "Account settings" },
]

export function UniversalFooter() {
  const { data: session } = useSession()
  const user = session?.user as any
  const role = (session as any)?.role
  const plan = (session as any)?.plan
  const isPlusUser = plan === "volunteer_plus" || plan === "ngo_plus"
  const isAuthenticated = !!session

  return (
    <footer className="bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-muted/5 dark:to-muted/10 border-t">
      <div className="container mx-auto px-4 py-12">
        
        {/* Authenticated User Section */}
        {isAuthenticated && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border border-primary/20 rounded-3xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center relative">
                    <Heart className="h-6 w-6 text-primary" />
                    {isPlusUser && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">Welcome back, {user?.name?.split(' ')[0] || 'there'}!</h3>
                      {isPlusUser && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          Plus
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {role === "volunteer" 
                        ? "Keep making a difference in your community" 
                        : "Continue building your team of changemakers"
                      }
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {quickActions.map((action) => (
                    <Link 
                      key={action.title}
                      href={action.href}
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-background/60 hover:bg-background/80 border border-transparent hover:border-primary/30 transition-all"
                    >
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                        <action.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="hidden xl:block">
                        <p className="font-semibold text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/5 dark:via-primary/2 dark:to-primary/5 rounded-3xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Stay Connected
                </h3>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Get the latest opportunities, success stories, and platform updates delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input 
                  placeholder="Enter your email address..." 
                  className="rounded-2xl border-primary/20 focus:border-primary/40 bg-background/60"
                />
                <Button className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-6">
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Join 10,000+ changemakers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wide text-foreground/90">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/25 transition-all">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Just Because Asia
                </span>
                <p className="text-xs text-muted-foreground -mt-1">
                  Connecting hearts, changing lives
                </p>
              </div>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:hello@justbecauseasia.org" className="hover:text-primary transition-colors">
                hello@justbecauseasia.org
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Singapore, Asia</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {[
              { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
              { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              { icon: Github, href: "https://github.com", label: "GitHub" },
            ].map((social) => (
              <Button
                key={social.label}
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-2xl hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <a 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="mt-8 mb-6" />

        {/* Final Copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            © 2025 Just Because Asia. All rights reserved. Made with{" "}
            <Heart className="inline h-4 w-4 text-red-500" />{" "}
            for changemakers worldwide.
          </p>
          <div className="flex items-center justify-center sm:justify-end gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
            <Link href="/accessibility" className="hover:text-primary transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}