"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Star } from "lucide-react"
import { apiGet } from "@/lib/api-client"

interface Volunteer {
  _id: string
  name?: string
  email?: string
  role?: string
  skills?: string[]
  title?: string
  avatarUrl?: string
  location?: string
}

// Fallback data when API fails or returns no data
const FALLBACK_VOLUNTEERS: Volunteer[] = [
  {
    _id: "fallback-v1",
    name: "Sarah Johnson",
    title: "Community Organizer",
    location: "San Francisco, CA",
    skills: ["Leadership", "Event Planning", "Fundraising", "Social Media"],
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    _id: "fallback-v2",
    name: "Michael Chen",
    title: "Software Developer",
    location: "Seattle, WA",
    skills: ["Web Development", "Mobile Apps", "Database Design"],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    _id: "fallback-v3",
    name: "Emily Rodriguez",
    title: "Healthcare Professional",
    location: "Austin, TX",
    skills: ["Public Health", "Medical Training", "Community Outreach"],
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
  {
    _id: "fallback-v4",
    name: "David Thompson",
    title: "Marketing Specialist",
    location: "New York, NY",
    skills: ["Digital Marketing", "Content Creation", "SEO", "Analytics"],
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  },
  {
    _id: "fallback-v5",
    name: "Aisha Patel",
    title: "Education Consultant",
    location: "Boston, MA",
    skills: ["Curriculum Design", "Training", "Mentorship"],
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  },
  {
    _id: "fallback-v6",
    name: "James Wilson",
    title: "Environmental Scientist",
    location: "Portland, OR",
    skills: ["Research", "Data Analysis", "Sustainability", "Conservation"],
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
  },
]

export function TopVolunteersSection() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const data = await apiGet("/api/volunteers?limit=6&sort=recent")
        const fetchedVolunteers = (data as any)?.volunteers || []
        // Use fallback data if no volunteers returned
        setVolunteers(fetchedVolunteers.length > 0 ? fetchedVolunteers : FALLBACK_VOLUNTEERS)
      } catch (error) {
        console.error("Failed to fetch volunteers:", error)
        // Use fallback data on error
        setVolunteers(FALLBACK_VOLUNTEERS)
      } finally {
        setLoading(false)
      }
    }
    fetchVolunteers()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl font-semibold md:text-3xl mb-8">Top Volunteers</h2>
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </section>
    )
  }

  if (!volunteers.length) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 border-t">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold md:text-3xl">Active Volunteers</h2>
          <p className="text-muted-foreground mt-2">
            Discover skilled volunteers ready to contribute
          </p>
        </div>
        <Button asChild variant="outline" className="hidden sm:flex">
          <Link href="/volunteers">
            Browse All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers.map((volunteer) => (
          <Link href={`/volunteers/${volunteer._id}`} key={volunteer._id}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all flex-shrink-0">
                    {volunteer.avatarUrl ? (
                      <Image
                        src={volunteer.avatarUrl}
                        alt={volunteer.name || "Volunteer"}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold text-xl">
                        {(volunteer.name || "V").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {volunteer.name || "Volunteer"}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1 line-clamp-1">
                      {volunteer.title || "Active contributor"}
                    </CardDescription>
                    {volunteer.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{volunteer.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {volunteer.skills && volunteer.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {volunteer.skills.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-xs font-normal">
                        {skill}
                      </Badge>
                    ))}
                    {volunteer.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{volunteer.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span>Top contributor</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Button asChild variant="outline" className="w-full mt-6 sm:hidden">
        <Link href="/volunteers">
          Browse All Volunteers <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </section>
  )
}
