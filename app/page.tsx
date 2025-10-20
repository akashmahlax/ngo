import { Hero } from "@/components/hero"
import { FeaturedVolunteersCarousel } from "@/components/home/featured-volunteers-carousel"
import { RecentJobsStacked } from "@/components/home/recent-jobs-stacked"
import { FeaturedNGOSpotlight } from "@/components/home/featured-ngo-spotlight"
import { FAQ } from "@/components/faq"

export default function HomePage() {
  return (
    <>
      <main className="relative">
        {/* Hero Section with Volunteer Photos & 3D Cards */}
        <Hero />

        {/* Featured Volunteers Carousel - Horizontally Scrollable */}
        <FeaturedVolunteersCarousel />

        {/* Recent Volunteer Opportunities - Stacked Cards */}
        <RecentJobsStacked />

        {/* Featured NGO Partners - Spotlight with Carousel */}
        <FeaturedNGOSpotlight />

        {/* FAQ Section */}
        <FAQ />
      </main>
    </>
  )
}
