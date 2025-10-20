'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Clock,
  Users,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Building2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

// Fallback data
const fallbackJobs = [
  {
    _id: "1",
    title: "English Teacher for Underprivileged Children",
    description: "Teach English to children from underprivileged backgrounds. Help them develop language skills.",
    category: "Education",
    location: "Delhi, India",
    type: "Part-time",
    skills: ["Teaching", "English", "Communication"],
    ngoId: { orgName: "Teach India Foundation", logoUrl: "" },
    applicationsCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Medical Camp Volunteer",
    description: "Support monthly medical camps in rural areas. Assist doctors and manage patient registration.",
    category: "Healthcare",
    location: "Mumbai, India",
    type: "Weekend",
    skills: ["Healthcare", "Organization", "Communication"],
    ngoId: { orgName: "Health For All", logoUrl: "" },
    applicationsCount: 25,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Beach Clean-up Coordinator",
    description: "Lead beach clean-up drives and marine conservation efforts. Organize volunteers.",
    category: "Environment",
    location: "Goa, India",
    type: "Full-time",
    skills: ["Leadership", "Environment", "Organization"],
    ngoId: { orgName: "Green Earth Warriors", logoUrl: "" },
    applicationsCount: 8,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Youth Mentor Program",
    description: "Mentor young adults with career guidance and skill development programs.",
    category: "Community",
    location: "Bangalore, India",
    type: "Part-time",
    skills: ["Mentoring", "Career Guidance", "Communication"],
    ngoId: { orgName: "Youth Empowerment Network", logoUrl: "" },
    applicationsCount: 15,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "Digital Literacy Trainer",
    description: "Teach basic computer skills and internet safety to adults and seniors.",
    category: "Technology",
    location: "Pune, India",
    type: "Remote",
    skills: ["Computer Skills", "Teaching", "Patience"],
    ngoId: { orgName: "Tech For Good", logoUrl: "" },
    applicationsCount: 20,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6",
    title: "Food Distribution Volunteer",
    description: "Help distribute food to homeless and underprivileged communities.",
    category: "Community",
    location: "Chennai, India",
    type: "Weekend",
    skills: ["Empathy", "Organization", "Physical Fitness"],
    ngoId: { orgName: "Hunger Relief Foundation", logoUrl: "" },
    applicationsCount: 30,
    createdAt: new Date().toISOString(),
  },
]

const categoryColors: Record<string, string> = {
  Education: "bg-blue-500",
  Healthcare: "bg-red-500",
  Environment: "bg-green-500",
  Technology: "bg-purple-500",
  Community: "bg-orange-500",
  "Animal Welfare": "bg-pink-500",
}

const categoryImages: Record<string, string> = {
  Education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  Healthcare: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  Environment: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
  Technology: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  Community: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
  "Animal Welfare": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80",
}

interface Job {
  _id: string
  title: string
  description: string
  category?: string
  location?: string
  type?: string
  skills?: string[]
  ngoId: {
    orgName?: string
    logoUrl?: string
  }
  applicationsCount?: number
  createdAt: string
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (diffInDays > 7) return `${Math.floor(diffInDays / 7)}w ago`
  if (diffInDays > 0) return `${diffInDays}d ago`
  if (diffInHours > 0) return `${diffInHours}h ago`
  return 'Just now'
}

export function RecentJobsBento() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs?limit=6&sort=recent')
        if (response.ok) {
          const data = await response.json()
          if (data.jobs && data.jobs.length > 0) {
            setJobs(data.jobs)
          } else {
            setJobs(fallbackJobs)
          }
        } else {
          setJobs(fallbackJobs)
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
        setJobs(fallbackJobs)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const displayJobs = jobs.length > 0 ? jobs : fallbackJobs

  if (loading) {
    return (
      <section className="relative bg-white py-20 dark:bg-neutral-950">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400">Loading opportunities...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-white py-20 dark:bg-neutral-950">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="mr-2 h-3 w-3" />
            Latest Opportunities
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
            Recent Volunteer Jobs
          </h2>
          <p className="mx-auto max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
            Find meaningful opportunities to make a difference in your community
          </p>
        </motion.div>

        {/* Desktop: Bento Grid, Mobile: Horizontal Scroll */}
        <div className="hidden lg:block">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-4 gap-4 auto-rows-[280px]">
            {displayJobs.map((job, index) => {
              // First job gets featured (spans 2 columns and 2 rows)
              const isFeatured = index === 0
              const isWide = index === 1 || index === 3
              const isTall = index === 2
              
              return (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`
                    group relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-300
                    ${isFeatured ? 'col-span-2 row-span-2' : ''}
                    ${isWide ? 'col-span-2' : ''}
                    ${isTall ? 'row-span-2' : ''}
                  `}
                >
                  <Link href={`/jobs/${job._id}`} className="block h-full">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={categoryImages[job.category || 'Community']}
                        alt={job.title}
                        fill
                        className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
                        sizes={isFeatured ? "50vw" : isWide ? "40vw" : "25vw"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-6">
                      {/* Top Section */}
                      <div className="space-y-3">
                        {/* Category Badge */}
                        <Badge className={`${categoryColors[job.category || 'Community']} text-white border-0`}>
                          {job.category || 'Community'}
                        </Badge>

                        {/* Title */}
                        <h3 className={`font-bold text-white ${isFeatured ? 'text-2xl' : 'text-lg'} line-clamp-2`}>
                          {job.title}
                        </h3>

                        {/* Description - Only show on featured and tall cards */}
                        {(isFeatured || isTall) && (
                          <p className="text-sm text-white/80 line-clamp-3">
                            {job.description}
                          </p>
                        )}
                      </div>

                      {/* Bottom Section */}
                      <div className="space-y-3">
                        {/* NGO Name */}
                        <div className="flex items-center gap-2 text-white/90">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm font-medium line-clamp-1">
                            {job.ngoId?.orgName || 'NGO'}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-white/80">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{job.location || 'Remote'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(job.createdAt)}</span>
                          </div>
                          {job.applicationsCount !== undefined && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{job.applicationsCount} applied</span>
                            </div>
                          )}
                        </div>

                        {/* Skills - Only on featured */}
                        {isFeatured && job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 3).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-white/20 text-white border-0">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Type Badge */}
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                            <Briefcase className="mr-1 h-3 w-3" />
                            {job.type || 'Flexible'}
                          </Badge>
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="rounded-full bg-white/20 backdrop-blur-sm p-2 text-white shadow-lg">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden relative">
          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory">
            {displayJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="snap-start flex-shrink-0 w-[85vw] sm:w-[70vw]"
              >
                <Link href={`/jobs/${job._id}`} className="block group">
                  <div className="relative h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={categoryImages[job.category || 'Community']}
                        alt={job.title}
                        fill
                        className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
                        sizes="85vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-6">
                      {/* Top Section */}
                      <div className="space-y-3">
                        <Badge className={`${categoryColors[job.category || 'Community']} text-white border-0`}>
                          {job.category || 'Community'}
                        </Badge>

                        <h3 className="text-xl font-bold text-white line-clamp-2">
                          {job.title}
                        </h3>

                        <p className="text-sm text-white/80 line-clamp-3">
                          {job.description}
                        </p>
                      </div>

                      {/* Bottom Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white/90">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm font-medium line-clamp-1">
                            {job.ngoId?.orgName || 'NGO'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-white/80">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{job.location || 'Remote'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(job.createdAt)}</span>
                          </div>
                          {job.applicationsCount !== undefined && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{job.applicationsCount} applied</span>
                            </div>
                          )}
                        </div>

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 3).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-white/20 text-white border-0">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                          <Briefcase className="mr-1 h-3 w-3" />
                          {job.type || 'Flexible'}
                        </Badge>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="rounded-full bg-white/20 backdrop-blur-sm p-2 text-white shadow-lg">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicator - Left */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-8 w-20 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80"></div>
          
          {/* Scroll Indicator - Right */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-8 w-20 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80"></div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/jobs">
            <Button size="lg" className="group bg-blue-600 hover:bg-blue-700 text-white">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
