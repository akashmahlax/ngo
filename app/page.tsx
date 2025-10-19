import { RecentJobsSection } from "@/components/home/recent-jobs-section"
import { TopVolunteersSection } from "@/components/home/top-volunteers-section"
import { NGOSpotlightSection } from "@/components/home/ngo-spotlight-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { FeatureCards } from "@/components/feature-cards"
import { CategoryBento } from "@/components/category-bento"
import { StatsStrip } from "@/components/stats-strip"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
export default function HomePage() {
  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b">
          <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2 md:py-16 lg:py-20">
            <div className="flex flex-col justify-center gap-6">
              <Badge className="w-fit" variant="secondary">
                NGOs + Volunteers
              </Badge>
              <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
                Connect NGOs with skilled volunteers for real impact
              </h1>
              <p className="text-pretty text-muted-foreground md:text-lg">
                Discover mission-aligned projects, streamline applications, and track outcomes with professional analytics.
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative order-first aspect-[4/3] overflow-hidden rounded-xl border md:order-last md:aspect-auto">
              <Image
                src="/hero1.png"
                alt="Volunteers collaborating"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsStrip />

        {/* NEW PHASE 2 SECTIONS */}
        <RecentJobsSection />
        <TopVolunteersSection />
        <NGOSpotlightSection />

        {/* Features & Categories */}
        <FeatureCards />
        <CategoryBento />

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid items-center gap-6 rounded-xl border bg-secondary p-6 md:grid-cols-2">
            <div>
              <h2 className="text-balance text-2xl font-semibold md:text-3xl">Ready to create impact?</h2>
              <p className="text-pretty text-muted-foreground">
                Join thousands of volunteers and NGOs collaborating globally.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/signup">Join as Volunteer</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/ngos/post">Post a Job</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials & FAQ */}
        <Testimonials />
        <FAQ />
      </main>
    </>
  )
}
