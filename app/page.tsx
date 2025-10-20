import { Hero } from "@/components/hero"
import { RecentJobsSection } from "@/components/home/recent-jobs-section"
import { TopVolunteersSection } from "@/components/home/top-volunteers-section"
import { NGOSpotlightSection } from "@/components/home/ngo-spotlight-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
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
        <Hero />

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
