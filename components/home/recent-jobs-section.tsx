"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ArrowRight, Briefcase } from "lucide-react"
import { apiGet } from "@/lib/api-client"

interface Job {
  _id: string
  title: string
  category?: string
  locationType?: string
  description?: string
  ngoName?: string
  createdAt: string
}

// Fallback data when API fails or returns no data
const FALLBACK_JOBS: Job[] = [
  {
    _id: "fallback-1",
    title: "Community Health Educator",
    category: "Health",
    locationType: "remote",
    description: "Help educate communities about preventive healthcare and wellness programs.",
    ngoName: "Global Health Initiative",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "fallback-2",
    title: "Environmental Conservation Volunteer",
    category: "Climate",
    locationType: "onsite",
    description: "Join our team in protecting local ecosystems and promoting sustainable practices.",
    ngoName: "Green Earth Foundation",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "fallback-3",
    title: "Education Program Coordinator",
    category: "Education",
    locationType: "hybrid",
    description: "Coordinate after-school programs and mentorship initiatives for underserved youth.",
    ngoName: "Bright Futures Academy",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "fallback-4",
    title: "Social Media Manager",
    category: "Operations",
    locationType: "remote",
    description: "Manage our social media presence and help us reach more supporters.",
    ngoName: "Impact Network",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "fallback-5",
    title: "Fundraising Assistant",
    category: "Operations",
    locationType: "hybrid",
    description: "Support fundraising campaigns and donor relationship management.",
    ngoName: "Community Support Services",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "fallback-6",
    title: "Youth Mentor",
    category: "Education",
    locationType: "onsite",
    description: "Mentor young people and help them achieve their educational goals.",
    ngoName: "Youth Empowerment Project",
    createdAt: new Date().toISOString(),
  },
]

export function RecentJobsSection() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await apiGet("/api/jobs?limit=6")
        const fetchedJobs = (data as any)?.jobs || []
        // Use fallback data if no jobs returned
        setJobs(fetchedJobs.length > 0 ? fetchedJobs : FALLBACK_JOBS)
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
        // Use fallback data on error
        setJobs(FALLBACK_JOBS)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl font-semibold md:text-3xl mb-8">Recent Job Opportunities</h2>
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </section>
    )
  }

  if (!jobs.length) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 border-t">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold md:text-3xl">Recent Job Opportunities</h2>
          <p className="text-muted-foreground mt-2">Explore volunteer roles from verified NGOs</p>
        </div>
        <Button asChild variant="outline" className="hidden sm:flex">
          <Link href="/jobs">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Carousel className="w-full" opts={{ align: "start", loop: true }}>
        <CarouselContent className="-ml-4">
          {jobs.map((job) => (
            <CarouselItem key={job._id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Link href={`/jobs/${job._id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-l-4 border-l-primary/20 hover:border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="mt-1 font-medium">
                          {job.ngoName || "Verified NGO"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    {job.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {job.category && (
                        <Badge variant="secondary" className="font-normal">
                          {job.category}
                        </Badge>
                      )}
                      {job.locationType && (
                        <Badge variant="outline" className="capitalize font-normal">
                          {job.locationType}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                        View Details →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      <Button asChild variant="outline" className="w-full mt-6 sm:hidden">
        <Link href="/jobs">
          View All Jobs <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </section>
  )
}
