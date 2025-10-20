import { Hero } from "@/components/hero"
import { RecentJobsSection } from "@/components/home/recent-jobs-section-new"
import { TopVolunteersSection } from "@/components/home/top-volunteers-section-new"
import { FeaturedNGOSection } from "@/components/home/featured-ngo-section"
import { FAQ } from "@/components/faq"

export default function HomePage() {
  return (
    <>
      <main className="relative">
        {/* Hero Section with Volunteer Photos & 3D Cards */}
        <Hero />

        {/* Recent Volunteer Opportunities */}
        <RecentJobsSection />

        {/* Top Volunteers with Apple Carousel & Infinite Moving Cards */}
        <TopVolunteersSection />

        {/* Featured NGO Partners with 3D Pins */}
        <FeaturedNGOSection />

        {/* FAQ Section */}
        <FAQ />
      </main>
    </>
  )
}
