import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Mail,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Share2,
  MessageSquare,
  Briefcase,
  GraduationCap
} from "lucide-react"
import Link from "next/link"
import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"

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
      location: volunteer.location || "Location not specified",
      skills: volunteer.skills || [],
      phone: volunteer.phone,
      socialLinks: volunteer.socialLinks || {},
      experience: volunteer.experience || [],
      education: volunteer.education || [],
      availability: (volunteer as any).availability || "Not specified",
      interests: (volunteer as any).interests || [],
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {volunteer.avatarUrl ? (
            <img
              src={volunteer.avatarUrl}
              alt={volunteer.name}
              className="h-32 w-32 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
              {volunteer.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold">{volunteer.name}</h1>
                {volunteer.location && (
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{volunteer.location}</span>
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
                {volunteer.email && (
                  <Button asChild>
                    <Link href={`mailto:${volunteer.email}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            
            {volunteer.bio && (
              <p className="text-muted-foreground mb-4">
                {volunteer.bio}
              </p>
            )}
            
            {volunteer.interests && volunteer.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {volunteer.interests.map((interest: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {interest}
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
          {/* Skills */}
          {volunteer.skills && volunteer.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="py-2 text-base">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          {volunteer.experience && volunteer.experience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {volunteer.experience.map((exp: any, index: number) => (
                  <div key={index} className="border-l-2 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold">{exp.title}</h3>
                    {exp.company && <p className="text-muted-foreground">{exp.company}</p>}
                    {exp.duration && <p className="text-sm text-muted-foreground mb-2">{exp.duration}</p>}
                    {exp.description && <p className="text-muted-foreground">{exp.description}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {volunteer.education && volunteer.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {volunteer.education.map((edu: any, index: number) => (
                  <div key={index} className="border-l-2 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    {edu.institution && <p className="text-muted-foreground">{edu.institution}</p>}
                    {edu.year && <p className="text-sm text-muted-foreground mb-2">{edu.year}</p>}
                    {edu.description && <p className="text-muted-foreground">{edu.description}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Availability */}
          {volunteer.availability && (
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{volunteer.availability}</p>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {volunteer.email && (
                <Button className="w-full" asChild>
                  <Link href={`mailto:${volunteer.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Link>
                </Button>
              )}
              
              {volunteer.socialLinks?.linkedin && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={volunteer.socialLinks.linkedin} target="_blank">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Link>
                </Button>
              )}
              
              {volunteer.socialLinks?.github && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={volunteer.socialLinks.github} target="_blank">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Link>
                </Button>
              )}
              
              {volunteer.socialLinks?.website && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={volunteer.socialLinks.website} target="_blank">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </Link>
                </Button>
              )}

              {volunteer.socialLinks?.twitter && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={volunteer.socialLinks.twitter} target="_blank">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Link>
                </Button>
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