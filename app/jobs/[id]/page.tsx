"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  MapPin, 
  Calendar, 
  Users, 
  Bookmark, 
  Share2, 
  ArrowLeft,
  Check,
  Clock,
  Briefcase,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import { ApplyButton } from "@/components/apply-button"
import { toast } from "sonner"

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
  duration?: string
  commitment?: "full-time" | "part-time" | "flexible"
  applicationDeadline?: string
  numberOfPositions?: number
  compensationType?: "paid" | "unpaid" | "stipend"
  salaryRange?: string
  stipendAmount?: string
  hourlyRate?: number
  paymentFrequency?: string
  additionalPerks?: string[]
  applicationCount?: number
  viewCount?: number
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [job, setJob] = useState<JobData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${params.id}`)
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
  }, [params.id])

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/jobs">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/jobs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                    <span>{job.ngo.name}</span>
                    {job.ngo.verified && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                    {job.ngo.plan?.endsWith('plus') && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Plus
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                {job.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                      {job.locationType === "onsite" && `${job.location} (On-site)`}
                      {job.locationType === "remote" && "Remote"}
                      {job.locationType === "hybrid" && `${job.location} (Hybrid)`}
                      {!job.locationType && job.location}
                    </span>
                  </div>
                )}
                {job.createdAt && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                )}
                {job.applicationCount !== undefined && (
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{job.applicationCount} applied</span>
                  </div>
                )}
                {job.commitment && (
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="capitalize">{job.commitment}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {job.category && <Badge>{job.category}</Badge>}
                {job.locationType && (
                  <Badge variant="outline">
                    {job.locationType === "onsite" && "On-site"}
                    {job.locationType === "remote" && "Remote"}
                    {job.locationType === "hybrid" && "Hybrid"}
                  </Badge>
                )}
                {job.compensationType && (
                  <Badge variant="secondary" className="capitalize">
                    {job.compensationType}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compensation Info */}
          {(job.salaryRange || job.stipendAmount || job.hourlyRate) && (
            <Card>
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {job.salaryRange && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Salary Range</span>
                    <span className="font-medium">{job.salaryRange}</span>
                  </div>
                )}
                {job.stipendAmount && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Stipend</span>
                    <span className="font-medium">{job.stipendAmount}</span>
                  </div>
                )}
                {job.hourlyRate && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="font-medium">₹{job.hourlyRate}/hour</span>
                  </div>
                )}
                {job.paymentFrequency && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Frequency</span>
                    <span className="font-medium capitalize">{job.paymentFrequency}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none dark:prose-invert">
                {job.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 whitespace-pre-wrap">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Additional Perks */}
          {job.additionalPerks && job.additionalPerks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.additionalPerks.map((perk, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Apply Now</CardTitle>
              <CardDescription>
                Join {job.ngo.name} in making a difference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ApplyButton jobId={job._id} />
              {job.applicationCount !== undefined && (
                <p className="text-sm text-muted-foreground text-center">
                  {job.applicationCount} {job.applicationCount === 1 ? 'person has' : 'people have'} applied
                </p>
              )}
            </CardContent>
          </Card>

          {/* NGO Profile Preview */}
          <Card>
            <CardHeader>
              <CardTitle>About the Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {job.ngo.logoUrl ? (
                  <img 
                    src={job.ngo.logoUrl} 
                    alt={job.ngo.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {job.ngo.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{job.ngo.name}</h3>
                  {job.ngo.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {job.ngo.location}
                    </div>
                  )}
                </div>
              </div>
              {job.ngo.description && (
                <>
                  <Separator />
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.ngo.description}
                  </p>
                </>
              )}
              {job.ngo.focusAreas && job.ngo.focusAreas.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Focus Areas</p>
                    <div className="flex flex-wrap gap-1">
                      {job.ngo.focusAreas.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <Separator />
              <Button asChild variant="outline" className="w-full">
                <Link href={`/ngos/${job.ngo._id}`}>
                  View Organization Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Similar Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Wildlife Photography Volunteer</h4>
                  <p className="text-xs text-muted-foreground mt-1">Nature Conservation Group</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">Environment</Badge>
                    <span className="text-xs text-muted-foreground">2d ago</span>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Community Garden Helper</h4>
                  <p className="text-xs text-muted-foreground mt-1">Urban Green Initiative</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">Community</Badge>
                    <span className="text-xs text-muted-foreground">3d ago</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/jobs">View All Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}