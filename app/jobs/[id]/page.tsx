"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Calendar, 
  Users, 
  Bookmark, 
  Share2, 
  ArrowLeft,
  Check,
  Clock
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import { ApplyButton } from "@/components/apply-button"

// Mock data for demonstration
const mockJob = {
  id: "1",
  title: "Environmental Conservation Volunteer",
  description: `Join our dedicated team in protecting and preserving local wildlife habitats. This role involves fieldwork, data collection, and community education to promote environmental awareness.

Key Responsibilities:
- Conduct wildlife surveys and habitat assessments
- Participate in habitat restoration projects
- Assist with environmental education programs
- Collect and analyze ecological data
- Collaborate with local community groups

This is a fantastic opportunity for individuals passionate about environmental conservation and looking to make a tangible impact in their community.`,
  ngo: {
    id: "ngo1",
    name: "Green Earth Conservation Society",
    logo: "/placeholder.svg",
    verified: true,
  },
  category: "Environment",
  locationType: "onsite",
  location: "San Francisco, CA",
  postedDate: new Date(Date.now() - 86400000), // 1 day ago
  skills: ["Conservation", "Research", "Teamwork", "Data Collection", "Environmental Science"],
  benefits: ["Training provided", "Certificate of Completion", "Networking Opportunities"],
  requirements: ["Background check", "Physical fitness", "Weekend availability"],
  applicationCount: 12,
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isShared, setIsShared] = useState(false)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockJob.title,
        text: `Check out this volunteer opportunity: ${mockJob.title}`,
        url: window.location.href,
      }).catch(console.error)
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      setIsShared(true)
      setTimeout(() => setIsShared(false), 2000)
    }
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
                  <h1 className="text-2xl font-bold mb-2">{mockJob.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                    <span>{mockJob.ngo.name}</span>
                    {mockJob.ngo.verified && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Verified
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
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>
                    {mockJob.locationType === "onsite" && `${mockJob.location} (On-site)`}
                    {mockJob.locationType === "remote" && "Remote"}
                    {mockJob.locationType === "hybrid" && `${mockJob.location} (Hybrid)`}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Posted {formatDistanceToNow(mockJob.postedDate, { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{mockJob.applicationCount} applied</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge>{mockJob.category}</Badge>
                <Badge variant="outline">
                  {mockJob.locationType === "onsite" && "On-site"}
                  {mockJob.locationType === "remote" && "Remote"}
                  {mockJob.locationType === "hybrid" && "Hybrid"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {mockJob.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockJob.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockJob.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockJob.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Apply for this Role</CardTitle>
              <CardDescription>
                Join {mockJob.ngo.name} in making a difference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ApplyButton jobId={mockJob.id} />
              <p className="text-sm text-muted-foreground text-center">
                {mockJob.applicationCount} people have applied for this role
              </p>
            </CardContent>
          </Card>

          {/* NGO Profile Preview */}
          <Card>
            <CardHeader>
              <CardTitle>About the Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {mockJob.ngo.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{mockJob.ngo.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Posted 1 day ago
                  </div>
                </div>
              </div>
              <Separator />
              <Button asChild variant="outline" className="w-full">
                <Link href={`/ngos/${mockJob.ngo.id}`}>
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