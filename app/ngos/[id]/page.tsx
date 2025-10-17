"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Mail,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Share2,
  Users,
  CheckCircle,
  Calendar,
  Briefcase,
  Phone
} from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockNgo = {
  id: "1",
  name: "Green Earth Conservation Society",
  logo: "/placeholder.svg",
  verified: true,
  mission: "Dedicated to protecting and preserving local wildlife habitats through community engagement and scientific research. Our organization works tirelessly to create sustainable solutions for environmental challenges while educating the public about conservation practices.",
  website: "https://greenearth.org",
  location: "San Francisco, CA",
  focusAreas: ["Environment", "Wildlife Conservation", "Research", "Education"],
  teamSize: "51-100",
  founded: "2010",
  socialLinks: {
    linkedin: "https://linkedin.com/company/greenearth",
    twitter: "https://twitter.com/greenearth",
    facebook: "https://facebook.com/greenearth",
    instagram: "https://instagram.com/greenearth",
  },
  contactEmail: "info@greenearth.org",
  contactPhone: "+1 (555) 123-4567",
  address: "123 Conservation Way, San Francisco, CA 94102",
  stats: {
    volunteers: 1247,
    projects: 86,
    impact: "5000+ acres protected"
  }
}

// Mock jobs data
const mockJobs = [
  {
    id: "1",
    title: "Environmental Conservation Volunteer",
    category: "Environment",
    locationType: "onsite",
    location: "San Francisco, CA",
    postedDate: new Date(Date.now() - 86400000), // 1 day ago
    applications: 12,
  },
  {
    id: "2",
    title: "Wildlife Research Assistant",
    category: "Research",
    locationType: "onsite",
    location: "San Francisco, CA",
    postedDate: new Date(Date.now() - 172800000), // 2 days ago
    applications: 8,
  },
  {
    id: "3",
    title: "Environmental Education Coordinator",
    category: "Education",
    locationType: "onsite",
    location: "San Francisco, CA",
    postedDate: new Date(Date.now() - 259200000), // 3 days ago
    applications: 5,
  },
]

export default function NgoPublicProfile({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [isShared, setIsShared] = useState(false)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${mockNgo.name} - NGO Profile`,
        text: `Check out ${mockNgo.name}'s profile on our platform`,
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
            {mockNgo.name.charAt(0)}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{mockNgo.name}</h1>
                  {mockNgo.verified && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{mockNgo.location}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  {isShared ? "Copied!" : "Share"}
                </Button>
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">
              {mockNgo.mission}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {mockNgo.focusAreas.map((area, index) => (
                <Badge key={index} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Jobs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Volunteer Opportunities</CardTitle>
                  <CardDescription>
                    Join us in making a difference
                  </CardDescription>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/ngos/${mockNgo.id}/jobs`}>
                    View All Jobs
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No active opportunities</h3>
                  <p className="text-muted-foreground">
                    This organization currently has no open volunteer positions
                  </p>
                </div>
              ) : (
                mockJobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="secondary">{job.category}</Badge>
                          <Badge variant="outline">
                            {job.locationType === "onsite" && "On-site"}
                            {job.locationType === "remote" && "Remote"}
                            {job.locationType === "hybrid" && "Hybrid"}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{job.location}</span>
                          <span className="mx-2">•</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <Badge variant="outline">
                          {job.applications} applied
                        </Badge>
                        <Button asChild size="sm">
                          <Link href={`/jobs/${job.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{mockNgo.stats.volunteers}</div>
                  <div className="text-sm text-muted-foreground">Volunteers</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{mockNgo.stats.projects}</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{mockNgo.stats.impact}</div>
                  <div className="text-sm text-muted-foreground">Impact</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    {mockNgo.mission}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Our Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockNgo.focusAreas.map((area, index) => (
                      <Badge key={index} variant="secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organization Details */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Founded</h4>
                  <p>{mockNgo.founded}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Team Size</h4>
                  <p>{mockNgo.teamSize} people</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                  <p>{mockNgo.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href={`mailto:${mockNgo.contactEmail}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href={`tel:${mockNgo.contactPhone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </Link>
              </Button>
              
              {mockNgo.website && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={mockNgo.website} target="_blank">
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </Link>
                </Button>
              )}
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Follow Us</h4>
                <div className="flex gap-2">
                  {mockNgo.socialLinks.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                      <Link href={mockNgo.socialLinks.linkedin} target="_blank">
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {mockNgo.socialLinks.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <Link href={mockNgo.socialLinks.twitter} target="_blank">
                        <Twitter className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {mockNgo.socialLinks.facebook && (
                    <Button variant="outline" size="icon" asChild>
                      <Link href={mockNgo.socialLinks.facebook} target="_blank">
                        <Facebook className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {mockNgo.socialLinks.instagram && (
                    <Button variant="outline" size="icon" asChild>
                      <Link href={mockNgo.socialLinks.instagram} target="_blank">
                        <Instagram className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Profile */}
          <Card>
            <CardContent className="pt-6">
              <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                Report Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}