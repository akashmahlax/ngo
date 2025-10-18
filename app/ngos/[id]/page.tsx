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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-[#050517] dark:via-[#0A0A1E] dark:to-[#111132]">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/95 via-primary to-primary/80 dark:from-primary/70 dark:via-primary/80 dark:to-primary/60">
        {/* Decorative blur circles */}
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/30 dark:bg-white/10 blur-3xl" />
        <div className="absolute right-10 top-10 h-80 w-80 rounded-full bg-white/20 dark:bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-white/25 dark:bg-white/10 blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Avatar */}
            {ngo.avatarUrl ? (
              <img
                src={ngo.avatarUrl}
                alt={ngo.name}
                className="h-40 w-40 rounded-full object-cover flex-shrink-0 ring-4 ring-white/40 dark:ring-white/20 border-2 border-white/50 dark:border-white/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]"
              />
            ) : (
              <div className="h-40 w-40 rounded-full bg-gradient-to-br from-white/40 via-white/30 to-white/20 dark:from-white/20 dark:via-white/15 dark:to-white/10 flex items-center justify-center font-bold text-6xl text-white flex-shrink-0 ring-4 ring-white/30 dark:ring-white/20 border-2 border-white/40 dark:border-white/20 shadow-2xl backdrop-blur-sm">
                {ngo.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="flex-1 text-white">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
                      {ngo.name}
                    </h1>
                    {ngo.verified && (
                      <Badge className="bg-white/30 dark:bg-white/20 backdrop-blur-sm border border-white/40 dark:border-white/30 text-white flex items-center gap-1.5 px-3 py-1 shadow-lg">
                        <CheckCircle className="h-4 w-4" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  {ngo.location && (
                    <div className="flex items-center text-white/90 dark:text-white/80 text-lg mt-2 drop-shadow">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{ngo.location}</span>
                    </div>
                  )}
                  {ngo.orgType && (
                    <div className="mt-2">
                      <Badge className="bg-white/20 dark:bg-white/15 backdrop-blur-sm border border-white/30 dark:border-white/20 text-white capitalize">
                        {ngo.orgType.replace("-", " ")}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="secondary" className="bg-white/20 dark:bg-white/15 backdrop-blur-md border border-white/30 dark:border-white/20 text-white hover:bg-white/30 dark:hover:bg-white/25 shadow-lg">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  {ngo.email && (
                    <Button asChild className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold">
                      <Link href={`mailto:${ngo.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              
              {ngo.bio && (
                <p className="text-white/95 dark:text-white/85 text-lg leading-relaxed mb-6 max-w-3xl drop-shadow">
                  {ngo.bio}
                </p>
              )}
              
              {ngo.focusAreas && ngo.focusAreas.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-white/80 dark:text-white/70 mb-3">Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {ngo.focusAreas.map((area: string, index: number) => (
                      <Badge 
                        key={index} 
                        className="bg-white/25 dark:bg-white/15 backdrop-blur-sm border border-white/30 dark:border-white/20 text-white hover:bg-white/35 dark:hover:bg-white/25 transition-all shadow-md"
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Jobs */}
          <Card className="bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Active Volunteer Opportunities</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Join us in making a difference
                  </CardDescription>
                </div>
                <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10">
                  <Link href={`/jobs?ngo=${ngo.id}`}>
                    View All Jobs
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ngo.activeJobs.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 dark:bg-[#0B0B1C]/50 rounded-lg border border-border/30 dark:border-white/5">
                  <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/60 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active opportunities</h3>
                  <p className="text-muted-foreground">
                    This organization currently has no open volunteer positions
                  </p>
                </div>
              ) : (
                ngo.activeJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="group p-5 bg-background/60 dark:bg-[#0B0B1C]/60 border border-border/50 dark:border-white/10 rounded-lg hover:bg-muted/40 dark:hover:bg-[#161629]/70 hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {job.category}
                          </Badge>
                          <Badge variant="outline" className="border-border/50 dark:border-white/20">
                            {job.locationType === "onsite" && "On-site"}
                            {job.locationType === "remote" && "Remote"}
                            {job.locationType === "hybrid" && "Hybrid"}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          <span>
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        {job.applications > 0 && (
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {job.applications} applied
                          </Badge>
                        )}
                        <Button asChild size="sm" className="shadow-md hover:shadow-lg transition-shadow">
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
          <Card className="bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">About Us</CardTitle>
            </CardHeader>
            <CardContent>
              {ngo.bio && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Our Mission
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {ngo.bio}
                    </p>
                  </div>
                  
                  {ngo.focusAreas && ngo.focusAreas.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Our Focus Areas
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {ngo.focusAreas.map((area: string, index: number) => (
                          <Badge 
                            key={index} 
                            className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors px-4 py-1.5 text-sm"
                          >
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
          <Card className="bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-4">
                {ngo.orgType && (
                  <div className="pb-4 border-b border-border/50 dark:border-white/10">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Organization Type</h4>
                    <p className="font-medium capitalize">{ngo.orgType.replace("-", " ")}</p>
                  </div>
                )}
                {ngo.teamSize && (
                  <div className="pb-4 border-b border-border/50 dark:border-white/10">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Team Size</h4>
                    <p className="font-medium">{ngo.teamSize}</p>
                  </div>
                )}
                {ngo.address && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Location</h4>
                    <p className="font-medium">{ngo.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ngo.email && (
                <Button className="w-full shadow-md hover:shadow-lg transition-shadow" asChild>
                  <Link href={`mailto:${ngo.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Link>
                </Button>
              )}
              
              {ngo.phone && (
                <Button variant="outline" className="w-full border-border/50 dark:border-white/20 hover:bg-primary/10" asChild>
                  <Link href={`tel:${ngo.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Link>
                </Button>
              )}
              
              {ngo.website && (
                <Button variant="outline" className="w-full border-border/50 dark:border-white/20 hover:bg-primary/10" asChild>
                  <Link href={ngo.website} target="_blank">
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </Link>
                </Button>
              )}
              
              {(ngo.socialLinks?.linkedin || ngo.socialLinks?.twitter || ngo.socialLinks?.github || ngo.socialLinks?.website) && (
                <div className="pt-3 border-t border-border/50 dark:border-white/10 mt-4">
                  <h4 className="text-sm font-medium mb-3">Follow Us</h4>
                  <div className="flex gap-2">
                    {ngo.socialLinks.linkedin && (
                      <Button variant="outline" size="icon" className="border-border/50 dark:border-white/20 hover:bg-primary/10 hover:border-primary/30" asChild>
                        <Link href={ngo.socialLinks.linkedin} target="_blank">
                          <Linkedin className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {ngo.socialLinks.twitter && (
                      <Button variant="outline" size="icon" className="border-border/50 dark:border-white/20 hover:bg-primary/10 hover:border-primary/30" asChild>
                        <Link href={ngo.socialLinks.twitter} target="_blank">
                          <Twitter className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {ngo.socialLinks.github && (
                      <Button variant="outline" size="icon" className="border-border/50 dark:border-white/20 hover:bg-primary/10 hover:border-primary/30" asChild>
                        <Link href={ngo.socialLinks.github} target="_blank">
                          <Globe className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {ngo.socialLinks.website && (
                      <Button variant="outline" size="icon" className="border-border/50 dark:border-white/20 hover:bg-primary/10 hover:border-primary/30" asChild>
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
          <Card className="bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <CardContent className="pt-6">
              <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive/50">
                Report Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  )
}