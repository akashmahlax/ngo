'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const jobs = [
  {
    category: "Education",
    title: "English Teacher for Underprivileged Children",
    src: "/hero1.png",
    content: (
      <div className="space-y-4">
        <Badge>Education</Badge>
        <h3 className="text-2xl font-bold">English Teacher Position</h3>
        <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span>Delhi, India</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>10-15 hours/week</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <span>5 volunteers needed</span>
          </div>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300">
          Teach English to children from underprivileged backgrounds. Help them develop language skills and confidence. 
          Previous teaching experience preferred but not required. Training will be provided.
        </p>
        <div className="mt-4">
          <p className="font-semibold">Skills Required:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline">English Proficiency</Badge>
            <Badge variant="outline">Teaching</Badge>
            <Badge variant="outline">Communication</Badge>
            <Badge variant="outline">Patience</Badge>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Healthcare",
    title: "Medical Camp Volunteer",
    src: "/hero1.png",
    content: (
      <div className="space-y-4">
        <Badge>Healthcare</Badge>
        <h3 className="text-2xl font-bold">Medical Camp Support</h3>
        <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span>Mumbai, India</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>Weekend commitment</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <span>10 volunteers needed</span>
          </div>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300">
          Support monthly medical camps in rural areas. Assist doctors, manage patient registration, and help with 
          health awareness programs. Medical background preferred but not mandatory.
        </p>
        <div className="mt-4">
          <p className="font-semibold">Skills Required:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline">Healthcare</Badge>
            <Badge variant="outline">Organization</Badge>
            <Badge variant="outline">Communication</Badge>
            <Badge variant="outline">Empathy</Badge>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Environment",
    title: "Beach Clean-up Coordinator",
    src: "/hero1.png",
    content: (
      <div className="space-y-4">
        <Badge>Environment</Badge>
        <h3 className="text-2xl font-bold">Coastal Conservation</h3>
        <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span>Goa, India</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>Monthly events</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <span>20 volunteers needed</span>
          </div>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300">
          Lead beach clean-up drives and marine conservation efforts. Organize volunteers, manage waste segregation, 
          and conduct environmental awareness sessions for local communities.
        </p>
        <div className="mt-4">
          <p className="font-semibold">Skills Required:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline">Leadership</Badge>
            <Badge variant="outline">Organization</Badge>
            <Badge variant="outline">Environmental Science</Badge>
            <Badge variant="outline">Community Engagement</Badge>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Community",
    title: "Youth Mentor Program",
    src: "/hero1.png",
    content: (
      <div className="space-y-4">
        <Badge>Community</Badge>
        <h3 className="text-2xl font-bold">Youth Development</h3>
        <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span>Bangalore, India</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>2 hours/week</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <span>15 mentors needed</span>
          </div>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300">
          Mentor young adults from economically disadvantaged backgrounds. Guide them in career planning, skill development, 
          and personal growth. Share your professional experience and help shape future leaders.
        </p>
        <div className="mt-4">
          <p className="font-semibold">Skills Required:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline">Mentoring</Badge>
            <Badge variant="outline">Career Guidance</Badge>
            <Badge variant="outline">Communication</Badge>
            <Badge variant="outline">Motivation</Badge>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Technology",
    title: "Digital Literacy Trainer",
    src: "/hero1.png",
    content: (
      <div className="space-y-4">
        <Badge>Technology</Badge>
        <h3 className="text-2xl font-bold">Tech Education</h3>
        <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span>Remote / Hybrid</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>5 hours/week</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <span>8 trainers needed</span>
          </div>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300">
          Teach basic computer skills and internet safety to adults and seniors. Help bridge the digital divide by 
          empowering individuals with essential technology skills for modern life.
        </p>
        <div className="mt-4">
          <p className="font-semibold">Skills Required:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline">Computer Skills</Badge>
            <Badge variant="outline">Teaching</Badge>
            <Badge variant="outline">Patience</Badge>
            <Badge variant="outline">Communication</Badge>
          </div>
        </div>
      </div>
    ),
  },
]

export function RecentJobsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % jobs.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + jobs.length) % jobs.length)
  }

  return (
    <section className="relative bg-neutral-50 py-20 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Latest Opportunities
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Explore the newest volunteer positions from verified NGOs
          </p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden rounded-xl">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {jobs.map((job, index) => (
              <div key={index} className="min-w-full px-4">
                <Card className="overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700">
                  <div className="grid md:grid-cols-2 gap-6 p-6 lg:p-8">
                    {/* Image */}
                    <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                      <Image
                        src={job.src}
                        alt={job.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="text-white">
                      {job.content}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="pointer-events-auto bg-white/90 hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="pointer-events-auto bg-white/90 hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {jobs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-purple-600' : 'w-2 bg-neutral-300 dark:bg-neutral-700'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
