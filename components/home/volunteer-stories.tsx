'use client'

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

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

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="min-w-[300px] md:min-w-[400px] flex-shrink-0 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
              <div className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div>
                  <p className="font-semibold text-sm text-neutral-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
