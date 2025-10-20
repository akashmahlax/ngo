import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, 
  Mail,
  Share2,
  MessageSquare,
  Briefcase,
  Calendar,
  Award,
  Star,
  CheckCircle,
  TrendingUp,
  Target,
  Zap,
  Heart,
  Globe
} from "lucide-react"
import Link from "next/link"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"
import { formatDistanceToNow } from "date-fns"

async function getVolunteer(id: string) {
  try {
    if (!ObjectId.isValid(id)) {
      return null
    }

    const { users } = await getCollections()
    const volunteer = await users.findOne({ 
      _id: new ObjectId(id),
      role: "volunteer"
    })
    
    if (!volunteer) {
      return null
    }

    return {
      id: volunteer._id.toString(),
      name: volunteer.name || "Anonymous Volunteer",
      email: volunteer.email,
      avatarUrl: volunteer.avatarUrl,
      bio: volunteer.bio || "",
      title: volunteer.title || "",
      location: volunteer.location || "Location not specified",
      skills: volunteer.skills || [],
      phone: volunteer.phone,
      socialLinks: volunteer.socialLinks || {},
      experience: volunteer.experience || [],
      education: volunteer.education || [],
      availability: (volunteer as any).availability || "Not specified",
      interests: (volunteer as any).interests || [],
      hourlyRate: volunteer.hourlyRate || 0,
      ngoHourlyRate: volunteer.ngoHourlyRate || 0,
      successRate: volunteer.successRate || 0,
      responseTime: volunteer.responseTime || "Not specified",
      currentWorkStatus: volunteer.currentWorkStatus || "Not specified",
      completedProjects: volunteer.completedProjects || 0,
      activeProjects: volunteer.activeProjects || 0,
      rating: volunteer.rating || 0,
      createdAt: volunteer.createdAt,
    }
  } catch (error) {
    console.error("Error fetching volunteer:", error)
    return null
  }
}

export default async function VolunteerPublicProfile({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const volunteer = await getVolunteer(id)

  if (!volunteer) {
    notFound()
  }

  const memberSince = volunteer.createdAt 
    ? formatDistanceToNow(new Date(volunteer.createdAt), { addSuffix: true })
    : "Recently"

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
        {/* Decorative elements */}
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute -right-20 top-10 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-white/50 shadow-2xl">
                  <AvatarImage src={volunteer.avatarUrl} alt={volunteer.name} />
                  <AvatarFallback className="text-4xl font-bold bg-white/90 text-purple-600">
                    {volunteer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 break-words drop-shadow-lg">
                  {volunteer.name}
                </h1>
                
                {volunteer.title && (
                  <p className="text-lg sm:text-xl text-white/95 font-semibold mb-3">
                    {volunteer.title}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-3 text-white/90 mb-4">
                  {volunteer.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{volunteer.location}</span>
                    </div>
                  )}
                  <span className="text-white/60">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {memberSince}</span>
                  </div>
                </div>

                {volunteer.bio && (
                  <p className="text-white/90 text-base sm:text-lg mb-4 max-w-2xl leading-relaxed">
                    {volunteer.bio}
                  </p>
                )}

                {/* Interests/Skills Preview */}
                {volunteer.interests && volunteer.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {volunteer.interests.slice(0, 5).map((interest: string, index: number) => (
                      <Badge 
                        key={index} 
                        className="bg-white/20 text-white border-white/40 backdrop-blur-sm"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {volunteer.email && (
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                  >
                    <Link href={`mailto:${volunteer.email}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
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
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Rating */}
            <Card className="shadow-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-2">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 fill-current" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold">{volunteer.rating.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </CardContent>
            </Card>

            {/* Projects Completed */}
            <Card className="shadow-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-2">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold">{volunteer.completedProjects}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>

            {/* Success Rate */}
            <Card className="shadow-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-2">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{volunteer.successRate}%</p>
                  <p className="text-xs text-muted-foreground">Success</p>
                </div>
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card className="shadow-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-2">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold">{volunteer.activeProjects}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            {volunteer.skills && volunteer.skills.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-purple-600" />
                    Skills & Expertise
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.skills.map((skill, index) => (
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
            )}

            {/* Experience */}
            {volunteer.experience && volunteer.experience.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-pink-600" />
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {volunteer.experience.map((exp: any, index: number) => (
                      <div key={index} className="relative pl-6 border-l-2 border-purple-200 dark:border-purple-800">
                        <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                        <h3 className="font-semibold text-lg">{exp.title || exp.position}</h3>
                        <p className="text-muted-foreground">{exp.organization || exp.company}</p>
                        {exp.duration && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {exp.duration}
                          </p>
                        )}
                        {exp.description && (
                          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {volunteer.education && volunteer.education.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Award className="h-6 w-6 text-orange-600" />
                    Education
                  </h2>
                  <div className="space-y-4">
                    {volunteer.education.map((edu: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{edu.degree || edu.qualification}</h3>
                          <p className="text-muted-foreground">{edu.institution || edu.school}</p>
                          {edu.year && (
                            <p className="text-sm text-muted-foreground">{edu.year}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="shadow-lg sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {volunteer.email && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a 
                          href={`mailto:${volunteer.email}`}
                          className="text-sm font-medium hover:text-purple-600 transition-colors truncate block"
                        >
                          {volunteer.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {volunteer.location && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4 w-4 text-pink-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium truncate">{volunteer.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  asChild 
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Link href={`mailto:${volunteer.email}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Availability
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold capitalize">{volunteer.currentWorkStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-semibold">{volunteer.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability</span>
                    <span className="font-semibold capitalize">{volunteer.availability}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
