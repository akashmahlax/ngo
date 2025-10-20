'use client'

import { Timeline } from "@/components/ui/timeline"
import { UserPlus, Search, HandHeart, BarChart3 } from "lucide-react"

const timelineData = [
  {
    title: "Sign Up",
    content: (
      <div>
        <div className="mb-8 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <UserPlus className="size-6 text-blue-500" />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Create Your Account
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Sign up as a volunteer or NGO in under 2 minutes. Complete your profile with your skills, interests, and availability.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="font-semibold text-neutral-900 dark:text-white">For Volunteers</p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Showcase your skills, experience, and causes you care about
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="font-semibold text-neutral-900 dark:text-white">For NGOs</p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Post opportunities and get verified to attract quality volunteers
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Discover",
    content: (
      <div>
        <div className="mb-8 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
            <Search className="size-6 text-purple-500" />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Find Perfect Matches
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Browse opportunities tailored to your skills and interests. Our AI-powered matching system connects you with causes that align with your passion.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:border-neutral-800 dark:from-purple-950/30 dark:to-pink-950/30">
          <p className="font-semibold text-neutral-900 dark:text-white">Smart Filters</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li>• Filter by location, skills, and time commitment</li>
            <li>• Save searches and get instant notifications</li>
            <li>• View detailed NGO profiles and impact metrics</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Engage",
    content: (
      <div>
        <div className="mb-8 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
            <HandHeart className="size-6 text-green-500" />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Make an Impact
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Apply to opportunities, connect with NGOs, and start volunteering. Track your hours and document your contributions in real-time.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-2xl font-bold text-green-600">500+</p>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Active Projects</p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-2xl font-bold text-blue-600">10k+</p>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Volunteers</p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-2xl font-bold text-purple-600">98%</p>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Satisfaction</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Track & Grow",
    content: (
      <div>
        <div className="mb-8 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-pink-500/10">
            <BarChart3 className="size-6 text-pink-500" />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Measure Your Impact
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              View comprehensive analytics of your volunteer work. Get certificates, badges, and build a portfolio of your social impact achievements.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-gradient-to-br from-pink-50 to-orange-50 p-6 dark:border-neutral-800 dark:from-pink-950/30 dark:to-orange-950/30">
          <p className="font-semibold text-neutral-900 dark:text-white">Dashboard Features</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li>• Real-time hours tracking and reporting</li>
            <li>• Downloadable impact certificates</li>
            <li>• Share achievements on social media</li>
            <li>• Build your volunteer resume</li>
          </ul>
        </div>
      </div>
    ),
  },
]

export function HowItWorksTimeline() {
  return (
    <section className="relative">
      <Timeline data={timelineData} />
    </section>
  )
}
