'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  Heart,
  Users,
  Sparkles,
  TrendingUp,
  Shield,
  Globe2
} from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <Badge className="mb-6 gap-1.5 px-4 py-1.5" variant="secondary">
            <Sparkles className="h-3.5 w-3.5" />
            Where Purpose Meets Action
          </Badge>
          
          <h1 className="text-balance text-4xl font-bold leading-tight md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
            Transform Lives Through
            <span className="text-primary block mt-2">Meaningful Volunteering</span>
          </h1>
          
          <p className="text-pretty text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Connect with verified NGOs, discover opportunities aligned with your skills, 
            and create measurable impact in communities worldwide.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" className="gap-2 text-lg px-8">
              <Link href="/jobs">
                <Heart className="h-5 w-5" />
                Find Opportunities
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8">
              <Link href="/signup">
                <Users className="h-5 w-5" />
                Join as NGO
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>100% Verified Organizations</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Track Your Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-primary" />
              <span>Global Opportunities</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">For Volunteers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover roles that match your skills, build your portfolio, and make real change
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">For NGOs</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Find qualified volunteers, streamline hiring, and measure program outcomes
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Impact</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                See the difference you're making with analytics and impact dashboards
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
