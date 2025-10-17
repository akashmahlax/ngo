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
  Github,
  Twitter,
  Share2,
  MessageSquare
} from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockVolunteer = {
  id: "1",
  name: "Alex Johnson",
  avatar: "/placeholder.svg",
  bio: "Passionate environmentalist with 3 years of experience in wildlife conservation. I believe in using research and data analysis to drive meaningful change in environmental protection. My goal is to contribute to projects that have a tangible impact on preserving our planet for future generations.",
  location: "San Francisco, CA",
  skills: ["Conservation", "Research", "Data Analysis", "Wildlife Photography", "Environmental Science", "Field Work", "Grant Writing"],
  socialLinks: {
    linkedin: "https://linkedin.com/in/alexjohnson",
    github: "https://github.com/alexjohnson",
    website: "https://alexjohnson.com",
    twitter: "https://twitter.com/alexjohnson",
  },
  experience: [
    {
      title: "Wildlife Research Assistant",
      company: "Marine Conservation Institute",
      duration: "2022 - Present",
      description: "Conducting field research on marine ecosystems and contributing to conservation policy recommendations."
    },
    {
      title: "Environmental Data Analyst",
      company: "GreenTech Solutions",
      duration: "2020 - 2022",
      description: "Analyzing environmental data to identify trends and support sustainability initiatives."
    }
  ],
  education: [
    {
      degree: "M.S. Environmental Science",
      institution: "Stanford University",
      year: "2020",
      description: "Specialized in marine conservation and ecosystem management."
    },
    {
      degree: "B.S. Biology",
      institution: "UC Berkeley",
      year: "2018",
      description: "Focus on ecology and conservation biology."
    }
  ],
  availability: "Weekends and evenings",
  causes: ["Environment", "Wildlife Conservation", "Climate Change"],
}

export default function VolunteerPublicProfile({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [isShared, setIsShared] = useState(false)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${mockVolunteer.name}'s Volunteer Profile`,
        text: `Check out ${mockVolunteer.name}'s volunteer profile`,
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
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
            {mockVolunteer.name.charAt(0)}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold">{mockVolunteer.name}</h1>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{mockVolunteer.location}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  {isShared ? "Copied!" : "Share"}
                </Button>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">
              {mockVolunteer.bio}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {mockVolunteer.causes.map((cause, index) => (
                <Badge key={index} variant="secondary">
                  {cause}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockVolunteer.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="py-2 text-base">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockVolunteer.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary pl-4 py-1">
                  <h3 className="text-lg font-semibold">{exp.title}</h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mb-2">{exp.duration}</p>
                  <p className="text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockVolunteer.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary pl-4 py-1">
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <p className="text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground mb-2">{edu.year}</p>
                  <p className="text-muted-foreground">{edu.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{mockVolunteer.availability}</p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href={`mailto:alex.johnson@example.com`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Link>
              </Button>
              
              {mockVolunteer.socialLinks.linkedin && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={mockVolunteer.socialLinks.linkedin} target="_blank">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Link>
                </Button>
              )}
              
              {mockVolunteer.socialLinks.github && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={mockVolunteer.socialLinks.github} target="_blank">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Link>
                </Button>
              )}
              
              {mockVolunteer.socialLinks.website && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={mockVolunteer.socialLinks.website} target="_blank">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
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