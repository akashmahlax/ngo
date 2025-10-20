'use client'

import { StickyScroll } from "@/components/ui/sticky-scroll-reveal"
import { Shield, Target, Users, BarChart3 } from "lucide-react"

const content = [
  {
    title: "Verified NGO Network",
    description:
      "Every NGO on our platform undergoes rigorous verification to ensure authenticity and impact. We partner only with organizations that demonstrate transparency, accountability, and proven track records of creating positive change in their communities.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 p-8">
        <Shield className="size-32 text-white" />
      </div>
    ),
  },
  {
    title: "Smart Skill Matching",
    description:
      "Our AI-powered matching algorithm connects volunteers with opportunities that perfectly align with their skills, interests, and availability. Whether you're a developer, teacher, healthcare professional, or community organizer, find opportunities where your talents make the biggest difference.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-8">
        <Target className="size-32 text-white" />
      </div>
    ),
  },
  {
    title: "Community Building",
    description:
      "Join a global community of changemakers. Connect with like-minded volunteers, share experiences, collaborate on projects, and build lasting relationships with NGOs and fellow volunteers. Our platform fosters meaningful connections that extend beyond individual projects.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-500 p-8">
        <Users className="size-32 text-white" />
      </div>
    ),
  },
  {
    title: "Impact Analytics",
    description:
      "Track your volunteer journey with comprehensive analytics. See your hours contributed, lives impacted, and skills developed. Download certificates, generate reports for your resume or portfolio, and visualize your social impact over time with beautiful dashboards and insights.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500 p-8">
        <BarChart3 className="size-32 text-white" />
      </div>
    ),
  },
]

export function StickyFeatures() {
  return (
    <section className="relative">
      <div className="mb-12 px-4 pt-20 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-5xl">
          Platform Features
        </h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
          Everything you need to create meaningful impact
        </p>
      </div>
      <StickyScroll content={content} />
    </section>
  )
}
