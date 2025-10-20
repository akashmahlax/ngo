"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Calendar, 
  Users, 
  Bookmark, 
  Share2, 
  ArrowLeft,
  Clock,
  Briefcase,
  Building2,
  CheckCircle2,
  Star,
  Heart,
  TrendingUp,
  Award,
  Globe,
  DollarSign,
  Zap
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ApplyButton } from "@/components/apply-button"
import { toast } from "sonner"
import Image from "next/image"

type JobData = {
  _id: string
  title: string
  description: string
  ngo: {
    _id: string
    name: string
    verified: boolean
    logoUrl?: string
    plan?: string
    focusAreas?: string[]
    location?: string
    description?: string
  }
  category?: string
  locationType?: "onsite" | "remote" | "hybrid"
  location?: string
  createdAt: string
  skills?: string[]
  benefits?: string[]
  requirements?: string[]
  responsibilities?: string[]
  duration?: string
  commitment?: "full-time" | "part-time" | "flexible"
  applicationDeadline?: string
  numberOfPositions?: number
  compensationType?: "paid" | "unpaid" | "stipend"
  salaryRange?: string
  stipendAmount?: string
  hourlyRate?: number
  applicationCount?: number
  viewCount?: number
}

// Category colors matching homepage
const categoryColors: Record<string, string> = {
  Education: 'from-blue-500 to-indigo-600',
  Healthcare: 'from-green-500 to-emerald-600',
  Environment: 'from-emerald-500 to-teal-600',
  'Animal Welfare': 'from-pink-500 to-rose-600',
  Community: 'from-purple-500 to-violet-600',
  'Women Empowerment': 'from-orange-500 to-red-600',
  Technology: 'from-cyan-500 to-blue-600',
  default: 'from-gray-500 to-slate-600'
}

export function JobDetailPageClient({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`)
        if (!res.ok) {
          if (res.status === 404) {
            toast.error("Job not found")
            return
          }
          throw new Error("Failed to fetch job")
        }
        const data = await res.json()
        setJob(data.job)
      } catch (error) {
        console.error("Error fetching job:", error)
        toast.error("Failed to load job details")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId])

  const handleShare = () => {
    if (!job) return
    
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this volunteer opportunity: ${job.title}`,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-6">The opportunity you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link href="/jobs">Browse All Opportunities</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const gradientClass = categoryColors[job.category || 'default'] || categoryColors.default

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
      {/* Hero Section */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradientClass}`}>
        {/* Decorative elements */}
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute -right-20 top-10 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 py-8 sm:py-12">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            asChild 
            className="mb-6 text-white hover:bg-white/20 hover:text-white"
          >
            <Link href="/jobs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Opportunities
            </Link>
          </Button>

          {/* Job Header */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* NGO Avatar */}
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white/50 shadow-2xl flex-shrink-0">
              <AvatarImage src={job.ngo.logoUrl} alt={job.ngo.name} />
              <AvatarFallback className="text-2xl font-bold bg-white/90 text-neutral-900">
                {job.ngo.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Title and Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {job.category && (
                  <Badge className="bg-white/20 text-white border-white/40 backdrop-blur-sm">
                    {job.category}
                  </Badge>
                )}
                {job.locationType && (
                  <Badge className="bg-white/20 text-white border-white/40 backdrop-blur-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {job.locationType.charAt(0).toUpperCase() + job.locationType.slice(1)}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 break-words drop-shadow-lg">
                {job.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 text-white/90 mb-4">
                <Link 
                  href={`/ngos/${job.ngo._id}`}
                  className="text-lg font-semibold hover:text-white transition-colors flex items-center gap-2"
                >
                  {job.ngo.name}
                  {job.ngo.verified && (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </Link>
                <span className="text-white/60">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </span>
              </div>

              {job.location && (
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBookmark}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white/80 dark:bg-neutral-900/80 border-b backdrop-blur-xl sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              {job.applicationCount !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold">{job.applicationCount}</span>
                  <span className="text-muted-foreground">applicants</span>
                </div>
              )}
              {job.viewCount !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-pink-600" />
                  <span className="font-semibold">{job.viewCount}</span>
                  <span className="text-muted-foreground">views</span>
                </div>
              )}
              {job.commitment && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold capitalize">{job.commitment.replace('-', ' ')}</span>
                </div>
              )}
            </div>
            
            <ApplyButton jobId={job._id} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                    About This Opportunity
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Zap className="h-6 w-6 text-pink-600" />
                      Responsibilities
                    </h2>
                    <ul className="space-y-3">
                      {job.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1 h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Award className="h-6 w-6 text-orange-600" />
                      Requirements
                    </h2>
                    <ul className="space-y-3">
                      {job.requirements.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1 h-5 w-5 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold mb-4">Skills Required</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-900 dark:text-purple-100 border-purple-200 dark:border-purple-800"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg sticky top-24">
                <CardContent className="p-6">
                  <ApplyButton 
                    jobId={job._id}
                  />
                  
                  <div className="space-y-4 text-sm">
                    {job.applicationDeadline && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Deadline</p>
                          <p className="text-muted-foreground">
                            {new Date(job.applicationDeadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {job.duration && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-muted-foreground">{job.duration}</p>
                        </div>
                      </div>
                    )}
                    
                    {job.numberOfPositions && (
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Positions</p>
                          <p className="text-muted-foreground">{job.numberOfPositions} opening{job.numberOfPositions > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    )}

                    {job.compensationType && (
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Compensation</p>
                          <p className="text-muted-foreground capitalize">
                            {job.compensationType}
                            {job.stipendAmount && ` - ₹${job.stipendAmount}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* NGO Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    About the Organization
                  </h3>
                  
                  <Link href={`/ngos/${job.ngo._id}`} className="block group">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12 border-2 border-neutral-200 dark:border-neutral-700">
                        <AvatarImage src={job.ngo.logoUrl} alt={job.ngo.name} />
                        <AvatarFallback className="text-lg font-bold">
                          {job.ngo.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold group-hover:text-purple-600 transition-colors truncate">
                          {job.ngo.name}
                        </p>
                        {job.ngo.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.ngo.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>

                  {job.ngo.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {job.ngo.description}
                    </p>
                  )}

                  {job.ngo.focusAreas && job.ngo.focusAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.ngo.focusAreas.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link href={`/ngos/${job.ngo._id}`}>
                      View Organization Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-600" />
                      Benefits
                    </h3>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                          <span className="text-neutral-700 dark:text-neutral-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
