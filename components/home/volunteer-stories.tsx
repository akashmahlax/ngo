'use client'

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

const testimonials = [
  {
    quote:
      "Volunteering through this platform has been life-changing. I've taught over 100 children and watched them grow. The dashboard helps me track my impact, and the NGO vetting process ensures I'm working with legitimate organizations.",
    name: "Priya Sharma",
    title: "English Teacher Volunteer - 2 Years Active",
  },
  {
    quote:
      "As an NGO, this platform has revolutionized our volunteer recruitment. We've connected with skilled professionals who are genuinely passionate about our cause. The application process is streamlined and professional.",
    name: "Rajesh Kumar",
    title: "Director, Green Earth Foundation",
  },
  {
    quote:
      "I started as a part-time volunteer and it opened up a whole new world of opportunities. The skills I developed here helped me transition into a career in social work. Forever grateful for this platform!",
    name: "Anita Desai",
    title: "Community Development Specialist",
  },
  {
    quote:
      "The impact analytics feature is incredible. I can see exactly how many hours I've contributed and the lives I've touched. It's motivating to see your work visualized in such a meaningful way.",
    name: "Vikram Singh",
    title: "Healthcare Volunteer - 500+ Hours",
  },
  {
    quote:
      "Finding reliable volunteers was always a challenge until we joined this platform. The quality of volunteers we get is outstanding, and the platform's tools make management so much easier.",
    name: "Sarah Thompson",
    title: "Program Manager, Health For All",
  },
  {
    quote:
      "I love how I can filter opportunities by my skills and location. The platform matched me with a perfect project where I could use my tech skills to teach digital literacy to seniors. Truly impactful!",
    name: "Arjun Patel",
    title: "Software Engineer & Volunteer",
  },
]

export function VolunteerStories() {
  return (
    <section className="relative bg-white py-20 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Stories of Impact
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Hear from volunteers and NGOs who are creating change through our platform
          </p>
        </div>

        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
          pauseOnHover
        />
      </div>
    </section>
  )
}
