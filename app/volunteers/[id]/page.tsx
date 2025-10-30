import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ShareButton } from "@/components/share-button"
import { 
  MapPin, 
  Mail,
  Globe,
  Linkedin,
  Github,
  Twitter,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Calendar,
  Award,
  Clock,
  Star,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  Trophy,
  CircleDot
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
      // New professional fields
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

  const yearsOfExperience = volunteer.experience?.length || 0
  const memberSince = volunteer.createdAt 
    ? formatDistanceToNow(new Date(volunteer.createdAt), { addSuffix: true })
    : "Recently"

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/90 via-primary to-primary/90 dark:from-primary/70 dark:via-primary/80 dark:to-primary/70 text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-primary-foreground/20 dark:border-primary-foreground/30 shadow-2xl">
                  <AvatarImage src={volunteer.avatarUrl} alt={volunteer.name} />
                  <AvatarFallback className="text-4xl font-bold bg-primary-foreground/90 dark:bg-primary-foreground text-primary dark:text-primary">
                    {volunteer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-green-500 dark:bg-green-600 rounded-full p-2 shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{volunteer.name}</h1>
                
                {volunteer.title && (
                  <p className="text-xl text-primary-foreground/95 font-semibold mb-2">
                    {volunteer.title}
                  </p>
                )}
                
                {volunteer.location && (
                  <div className="flex items-center text-primary-foreground/90 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-lg">{volunteer.location}</span>
                  </div>
                )}

                {volunteer.bio && (
                  <p className="text-primary-foreground/90 text-lg mb-4 max-w-2xl">
                    {volunteer.bio}
                  </p>
                )}

                {/* Interests */}
                {volunteer.interests && volunteer.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {volunteer.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-primary-foreground/20 dark:bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 dark:border-primary-foreground/20">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {volunteer.email && (
                  <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 dark:bg-primary-foreground dark:text-primary dark:hover:bg-primary-foreground/90">
                    <Link href={`mailto:${volunteer.email}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact
                    </Link>
                  </Button>
                )}
                <ShareButton 
                  title={`${volunteer.name} - Volunteer Profile`}
                  text={volunteer.bio || `Check out ${volunteer.name}'s volunteer profile`}
                  className="border-primary-foreground/30 dark:border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 dark:hover:bg-primary-foreground/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Success Rate */}
            <Card className="border-2 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{volunteer.successRate}%</p>
                    <p className="text-xs text-muted-foreground">completion rate</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card className="border-2 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rating</p>
                    <p className="text-3xl font-bold">{volunteer.rating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">out of 5.0</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completed Projects */}
            <Card className="border-2 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Completed</p>
                    <p className="text-3xl font-bold">{volunteer.completedProjects}</p>
                    <p className="text-xs text-muted-foreground">project{volunteer.completedProjects !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="border-2 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Response</p>
                    <p className="text-xl font-bold">{volunteer.responseTime}</p>
                    <p className="text-xs text-muted-foreground">avg. time</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Skills */}
              {volunteer.skills && volunteer.skills.length > 0 && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Star className="h-6 w-6 text-yellow-500" />
                      Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="py-2 px-4 text-sm font-medium">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Experience Timeline */}
              {volunteer.experience && volunteer.experience.length > 0 && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                      Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {volunteer.experience.map((exp: { title: string; company?: string; duration?: string; description?: string }, index: number) => (
                        <div key={index} className="relative pl-8 pb-6 border-l-2 border-primary/30 last:pb-0">
                          {/* Timeline dot */}
                          <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                          
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold">{exp.title}</h3>
                            {exp.company && (
                              <p className="text-base text-muted-foreground font-medium">{exp.company}</p>
                            )}
                            {exp.duration && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                <span>{exp.duration}</span>
                              </div>
                            )}
                            {exp.description && (
                              <p className="text-muted-foreground pt-2">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {volunteer.education && volunteer.education.length > 0 && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <GraduationCap className="h-6 w-6 text-purple-600" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {volunteer.education.map((edu: { degree: string; institution?: string; year?: string; description?: string }, index: number) => (
                        <div key={index} className="relative pl-8 pb-6 border-l-2 border-purple-200 dark:border-purple-800 last:pb-0">
                          {/* Timeline dot */}
                          <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-purple-600 border-4 border-background" />
                          
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold">{edu.degree}</h3>
                            {edu.institution && (
                              <p className="text-base text-muted-foreground font-medium">{edu.institution}</p>
                            )}
                            {edu.year && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                <span>{edu.year}</span>
                              </div>
                            )}
                            {edu.description && (
                              <p className="text-muted-foreground pt-2">{edu.description}</p>
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
              {/* Pricing & Rates */}
              <Card className="shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Hourly Rates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Volunteer Rate */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Volunteer Rate</p>
                    <p className="text-3xl font-bold text-primary">
                      ₹{volunteer.hourlyRate}
                      <span className="text-sm text-muted-foreground">/hr</span>
                    </p>
                  </div>

                  {/* NGO Rate */}
                  {volunteer.ngoHourlyRate > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-sm text-muted-foreground mb-1">NGO Pays</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₹{volunteer.ngoHourlyRate}
                        <span className="text-sm">/hr</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Inclusive of platform fee
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Current Work Status */}
              {volunteer.currentWorkStatus && volunteer.currentWorkStatus !== "Not specified" && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CircleDot className="h-5 w-5" />
                      Current Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className={`h-3 w-3 rounded-full mt-1.5 ${
                        volunteer.currentWorkStatus.toLowerCase().includes('available') 
                          ? 'bg-green-500 animate-pulse' 
                          : volunteer.currentWorkStatus.toLowerCase().includes('busy')
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-semibold">{volunteer.currentWorkStatus}</p>
                        {volunteer.activeProjects > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Currently working on {volunteer.activeProjects} project{volunteer.activeProjects > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Availability */}
              {volunteer.availability && volunteer.availability !== "Not specified" && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-muted-foreground pt-2">{volunteer.availability}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact & Social */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {volunteer.email && (
                    <Button className="w-full" size="lg" asChild>
                      <Link href={`mailto:${volunteer.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Link>
                    </Button>
                  )}
                  
                  {(volunteer.socialLinks?.linkedin || 
                    volunteer.socialLinks?.github || 
                    volunteer.socialLinks?.website || 
                    volunteer.socialLinks?.twitter) && (
                    <>
                      <Separator className="my-4" />
                      <p className="text-sm font-medium text-muted-foreground mb-3">Connect on Social</p>
                    </>
                  )}
                  
                  {volunteer.socialLinks?.linkedin && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href={volunteer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                        LinkedIn
                      </Link>
                    </Button>
                  )}
                  
                  {volunteer.socialLinks?.github && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href={volunteer.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Link>
                    </Button>
                  )}
                  
                  {volunteer.socialLinks?.website && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href={volunteer.socialLinks.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </Link>
                    </Button>
                  )}

                  {volunteer.socialLinks?.twitter && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href={volunteer.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                        Twitter
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Profile Strength
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Professional Title</span>
                    <CheckCircle className={`h-4 w-4 ${volunteer.title ? 'text-green-600' : 'text-gray-300'}`} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bio</span>
                    <CheckCircle className={`h-4 w-4 ${volunteer.bio ? 'text-green-600' : 'text-gray-300'}`} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Skills ({volunteer.skills?.length || 0})</span>
                    <CheckCircle className={`h-4 w-4 ${(volunteer.skills?.length || 0) > 0 ? 'text-green-600' : 'text-gray-300'}`} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hourly Rates</span>
                    <CheckCircle className={`h-4 w-4 ${volunteer.hourlyRate > 0 ? 'text-green-600' : 'text-gray-300'}`} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Work Status</span>
                    <CheckCircle className={`h-4 w-4 ${volunteer.currentWorkStatus !== 'Not specified' ? 'text-green-600' : 'text-gray-300'}`} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Social Links</span>
                    <CheckCircle className={`h-4 w-4 ${volunteer.socialLinks?.linkedin || volunteer.socialLinks?.github ? 'text-green-600' : 'text-gray-300'}`} />
                  </div>
                </CardContent>
              </Card>

              {/* Report */}
              <Card>
                <CardContent className="pt-6">
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                    Report Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}