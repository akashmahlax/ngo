import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Mail,
  Globe,
  Linkedin,
  Twitter,
  Share2,
  CheckCircle,
  Calendar,
  Briefcase,
  Phone
} from "lucide-react"
import Link from "next/link"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"

async function getNgo(id: string) {
  try {
    if (!ObjectId.isValid(id)) {
      return null
    }

    const { users, jobs } = await getCollections()
    const ngo = await users.findOne({ 
      _id: new ObjectId(id),
      role: "ngo"
    })
    
    if (!ngo) {
      return null
    }

    // Get active jobs for this NGO
    const activeJobs = await jobs
      .find({ 
        userId: ngo._id,
        status: "open"
      })
      .limit(5)
      .toArray()

    return {
      id: ngo._id.toString(),
      name: ngo.orgName || ngo.name || "Organization",
      avatarUrl: ngo.avatarUrl,
      verified: ngo.verified || false,
      bio: ngo.bio || "",
      website: ngo.website,
      location: ngo.location || "Location not specified",
      focusAreas: ngo.focusAreas || [],
      teamSize: ngo.teamSize || "Not specified",
      phone: ngo.phone,
      address: ngo.address,
      socialLinks: ngo.socialLinks || {},
      email: ngo.email,
      orgType: ngo.orgType,
      registrationNumber: ngo.registrationNumber,
      createdAt: ngo.createdAt,
      activeJobs: activeJobs.map((job) => ({
        id: job._id.toString(),
        title: job.title,
        category: job.category,
        locationType: job.locationType,
        postedDate: job.createdAt,
        applications: 0, // We'll need to count these separately if needed
      })),
    }
  } catch (error) {
    console.error("Error fetching NGO:", error)
    return null
  }
}

export default async function NgoPublicProfile({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const ngo = await getNgo(id)

  if (!ngo) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {ngo.avatarUrl ? (
            <img
              src={ngo.avatarUrl}
              alt={ngo.name}
              className="h-32 w-32 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
              {ngo.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{ngo.name}</h1>
                  {ngo.verified && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Verified
                    </Badge>
                  )}
                </div>
                {ngo.location && (
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{ngo.location}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <form action="/api/share">
                  <Button type="submit" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </form>
                {ngo.email && (
                  <Button asChild>
                    <Link href={`mailto:${ngo.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            
            {ngo.bio && (
              <p className="text-muted-foreground mb-4">
                {ngo.bio}
              </p>
            )}
            
            {ngo.focusAreas && ngo.focusAreas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ngo.focusAreas.map((area: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            )}
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
                  <Link href={`/jobs?ngo=${ngo.id}`}>
                    View All Jobs
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ngo.activeJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No active opportunities</h3>
                  <p className="text-muted-foreground">
                    This organization currently has no open volunteer positions
                  </p>
                </div>
              ) : (
                ngo.activeJobs.map((job) => (
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
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        {job.applications > 0 && (
                          <Badge variant="outline">
                            {job.applications} applied
                          </Badge>
                        )}
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
              {ngo.bio && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Our Mission</h3>
                    <p className="text-muted-foreground">
                      {ngo.bio}
                    </p>
                  </div>
                  
                  {ngo.focusAreas && ngo.focusAreas.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Our Focus Areas</h3>
                      <div className="flex flex-wrap gap-2">
                        {ngo.focusAreas.map((area: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                {ngo.orgType && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Organization Type</h4>
                    <p className="capitalize">{ngo.orgType.replace("-", " ")}</p>
                  </div>
                )}
                {ngo.teamSize && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Team Size</h4>
                    <p>{ngo.teamSize}</p>
                  </div>
                )}
                {ngo.address && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                    <p>{ngo.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ngo.email && (
                <Button className="w-full" asChild>
                  <Link href={`mailto:${ngo.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Link>
                </Button>
              )}
              
              {ngo.phone && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`tel:${ngo.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Link>
                </Button>
              )}
              
              {ngo.website && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={ngo.website} target="_blank">
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </Link>
                </Button>
              )}
              
              {(ngo.socialLinks?.linkedin || ngo.socialLinks?.twitter || ngo.socialLinks?.github || ngo.socialLinks?.website) && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Follow Us</h4>
                  <div className="flex gap-2">
                    {ngo.socialLinks.linkedin && (
                      <Button variant="outline" size="icon" asChild>
                        <Link href={ngo.socialLinks.linkedin} target="_blank">
                          <Linkedin className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {ngo.socialLinks.twitter && (
                      <Button variant="outline" size="icon" asChild>
                        <Link href={ngo.socialLinks.twitter} target="_blank">
                          <Twitter className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {ngo.socialLinks.github && (
                      <Button variant="outline" size="icon" asChild>
                        <Link href={ngo.socialLinks.github} target="_blank">
                          <Globe className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {ngo.socialLinks.website && (
                      <Button variant="outline" size="icon" asChild>
                        <Link href={ngo.socialLinks.website} target="_blank">
                          <Globe className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
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