import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, 
  Mail,
  Globe,
  Share2,
  CheckCircle,
  Calendar,
  Briefcase,
  Users,
  TrendingUp,
  Award,
  Heart,
  Target,
  Phone,
  Building2,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

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
      .limit(6)
      .toArray()

    // Get total job stats
    const totalJobs = await jobs.countDocuments({ userId: ngo._id })
    const closedJobs = await jobs.countDocuments({ userId: ngo._id, status: "closed" })

    return {
      id: ngo._id.toString(),
      name: ngo.orgName || ngo.name || "Organization",
      avatarUrl: ngo.avatarUrl,
      verified: ngo.verified || false,
      bio: ngo.bio || ngo.description || "",
      website: ngo.website,
      location: ngo.location || "Location not specified",
      focusAreas: ngo.focusAreas || [],
      category: (ngo as any).category,
      teamSize: ngo.teamSize || "Not specified",
      phone: ngo.phone,
      address: ngo.address,
      socialLinks: ngo.socialLinks || {},
      email: ngo.email,
      orgType: ngo.orgType,
      registrationNumber: ngo.registrationNumber,
      createdAt: ngo.createdAt,
      totalJobs,
      closedJobs,
      activeJobs: activeJobs.map((job) => ({
        id: job._id.toString(),
        title: job.title,
        category: job.category,
        locationType: job.locationType,
        location: job.location,
        description: job.description,
        postedDate: job.createdAt,
        skills: job.skills || [],
      })),
    }
  } catch (error) {
    console.error("Error fetching NGO:", error)
    return null
  }
}

// Category colors matching homepage
const categoryColors: Record<string, string> = {
  Education: 'from-blue-500 to-indigo-600',
  Healthcare: 'from-green-500 to-emerald-600',
  Environment: 'from-emerald-500 to-teal-600',
  'Animal Welfare': 'from-pink-500 to-rose-600',
  Community: 'from-purple-500 to-violet-600',
  'Women Empowerment': 'from-orange-500 to-red-600',
  'Child Welfare': 'from-yellow-500 to-orange-600',
  default: 'from-purple-600 to-pink-600'
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

  const memberSince = ngo.createdAt 
    ? formatDistanceToNow(new Date(ngo.createdAt), { addSuffix: true })
    : "Recently"

  const gradientClass = categoryColors[ngo.category || 'default'] || categoryColors.default

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
      {/* Hero Section */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradientClass}`}>
        {/* Decorative elements */}
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute -right-20 top-10 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              {/* Avatar */}
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-white/50 shadow-2xl flex-shrink-0">
                <AvatarImage src={ngo.avatarUrl} alt={ngo.name} />
                <AvatarFallback className="text-4xl font-bold bg-white/90 text-purple-600">
                  {ngo.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {ngo.verified && (
                    <Badge className="bg-white/20 text-white border-white/40 backdrop-blur-sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {ngo.category && (
                    <Badge className="bg-white/20 text-white border-white/40 backdrop-blur-sm">
                      {ngo.category}
                    </Badge>
                  )}
                  {ngo.orgType && (
                    <Badge className="bg-white/20 text-white border-white/40 backdrop-blur-sm capitalize">
                      {ngo.orgType.replace("-", " ")}
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 break-words drop-shadow-lg">
                  {ngo.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-white/90 mb-4">
                  {ngo.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{ngo.location}</span>
                    </div>
                  )}
                  <span className="text-white/60">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Established {memberSince}</span>
                  </div>
                  {ngo.teamSize && ngo.teamSize !== "Not specified" && (
                    <>
                      <span className="text-white/60">•</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{ngo.teamSize} members</span>
                      </div>
                    </>
                  )}
                </div>

                {ngo.bio && (
                  <p className="text-white/90 text-base sm:text-lg mb-4 max-w-3xl leading-relaxed">
                    {ngo.bio}
                  </p>
                )}

                {/* Focus Areas */}
                {ngo.focusAreas && ngo.focusAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {ngo.focusAreas.slice(0, 6).map((area: string, index: number) => (
                      <Badge 
                        key={index} 
                        className="bg-white/20 text-white border-white/40 backdrop-blur-sm"
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {ngo.email && (
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                  >
                    <Link href={`mailto:${ngo.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Link>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-8 sm:-mt-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Jobs */}
            <Card className="shadow-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-2">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold">{ngo.totalJobs}</p>
                  <p className="text-xs text-muted-foreground">Total Opportunities</p>
                </div>
              </CardContent>
            </Card>

            {/* Active Jobs */}
            <Card className="shadow-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-2">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{ngo.activeJobs.length}</p>
                  <p className="text-xs text-muted-foreground">Active Now</p>
                </div>
              </CardContent>
            </Card>

            {/* Completed Jobs */}
            <Card className="shadow-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-2">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-2">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold">{ngo.closedJobs}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>

            {/* Impact */}
            <Card className="shadow-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-2">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold">{ngo.focusAreas.length}</p>
                  <p className="text-xs text-muted-foreground">Focus Areas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Active Opportunities */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-purple-600" />
                Active Opportunities ({ngo.activeJobs.length})
              </h2>
              
              {ngo.activeJobs.length > 0 ? (
                <div className="grid gap-4">
                  {ngo.activeJobs.map((job) => (
                    <Link key={job.id} href={`/jobs/${job.id}`}>
                      <Card className="hover:shadow-xl transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-600 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                                {job.title}
                              </h3>
                              {job.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                  {job.description}
                                </p>
                              )}
                            </div>
                            {job.category && (
                              <Badge variant="secondary" className="whitespace-nowrap">
                                {job.category}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            {job.locationType && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="capitalize">{job.locationType}</span>
                              </div>
                            )}
                            {job.location && (
                              <>
                                <span>•</span>
                                <span>{job.location}</span>
                              </>
                            )}
                            {job.postedDate && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}</span>
                                </div>
                              </>
                            )}
                          </div>

                          {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.skills.slice(0, 4).map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No active opportunities at the moment</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="shadow-lg sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {ngo.email && (
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a 
                          href={`mailto:${ngo.email}`}
                          className="text-sm font-medium hover:text-purple-600 transition-colors break-words"
                        >
                          {ngo.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {ngo.phone && (
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-4 w-4 text-pink-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <a 
                          href={`tel:${ngo.phone}`}
                          className="text-sm font-medium hover:text-pink-600 transition-colors"
                        >
                          {ngo.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {ngo.website && (
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <Globe className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Website</p>
                        <a 
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium hover:text-orange-600 transition-colors flex items-center gap-1 break-all"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </div>
                    </div>
                  )}

                  {ngo.address && (
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="text-sm font-medium">{ngo.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {ngo.email && (
                  <Button 
                    asChild 
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Link href={`mailto:${ngo.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Registration Info */}
            {ngo.registrationNumber && (
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-pink-600" />
                    Registration
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Registration No.</span>
                      <span className="font-semibold text-right break-all ml-2">{ngo.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
