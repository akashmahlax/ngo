"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Building2, CheckCircle, MapPin } from "lucide-react"
import { apiGet } from "@/lib/api-client"

interface NGO {
  _id: string
  name?: string
  email?: string
  description?: string
  category?: string
  activeJobs?: number
  avatarUrl?: string
  location?: string
  verified?: boolean
}

// Fallback data when API fails or returns no data
const FALLBACK_NGOS: NGO[] = [
  {
    _id: "fallback-n1",
    name: "Global Health Initiative",
    description: "Providing healthcare access and education to underserved communities worldwide.",
    category: "Health",
    location: "New York, NY",
    verified: true,
    activeJobs: 5,
    avatarUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&h=150&fit=crop",
  },
  {
    _id: "fallback-n2",
    name: "Green Earth Foundation",
    description: "Leading environmental conservation and climate action projects globally.",
    category: "Climate",
    location: "San Francisco, CA",
    verified: true,
    activeJobs: 3,
    avatarUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=150&fit=crop",
  },
  {
    _id: "fallback-n3",
    name: "Bright Futures Academy",
    description: "Empowering youth through quality education and mentorship programs.",
    category: "Education",
    location: "Chicago, IL",
    verified: true,
    activeJobs: 4,
    avatarUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=150&h=150&fit=crop",
  },
  {
    _id: "fallback-n4",
    name: "Community Support Services",
    description: "Building stronger communities through social services and support programs.",
    category: "Community",
    location: "Atlanta, GA",
    verified: false,
    activeJobs: 2,
    avatarUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150&h=150&fit=crop",
  },
  {
    _id: "fallback-n5",
    name: "Impact Network",
    description: "Connecting volunteers with meaningful opportunities to create lasting change.",
    category: "Operations",
    location: "Seattle, WA",
    verified: true,
    activeJobs: 6,
    avatarUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=150&h=150&fit=crop",
  },
  {
    _id: "fallback-n6",
    name: "Youth Empowerment Project",
    description: "Helping young people develop skills and confidence for successful futures.",
    category: "Education",
    location: "Austin, TX",
    verified: false,
    activeJobs: 3,
    avatarUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&h=150&fit=crop",
  },
]

export function NGOSpotlightSection() {
  const [ngos, setNgos] = useState<NGO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const data = await apiGet("/api/ngos?limit=6&sort=active")
        const fetchedNGOs = (data as any)?.ngos || []
        // Use fallback data if no NGOs returned
        setNgos(fetchedNGOs.length > 0 ? fetchedNGOs : FALLBACK_NGOS)
      } catch (error) {
        console.error("Failed to fetch NGOs:", error)
        // Use fallback data on error
        setNgos(FALLBACK_NGOS)
      } finally {
        setLoading(false)
      }
    }
    fetchNGOs()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl font-semibold md:text-3xl mb-8">Featured NGOs</h2>
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </section>
    )
  }

  if (!ngos.length) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 border-t">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold md:text-3xl">Featured NGOs</h2>
          <p className="text-muted-foreground mt-2">
            Meet verified organizations making real impact
          </p>
        </div>
        <Button asChild variant="outline" className="hidden sm:flex">
          <Link href="/ngos">
            Explore More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ngos.map((ngo) => (
          <Link href={`/ngos/${ngo._id}`} key={ngo._id}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all flex-shrink-0">
                    {ngo.avatarUrl ? (
                      <Image
                        src={ngo.avatarUrl}
                        alt={ngo.name || "NGO"}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary">
                        <Building2 className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors flex-1">
                        {ngo.name || "NGO"}
                      </CardTitle>
                      {ngo.verified && (
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <CardDescription className="text-sm mt-1">
                      {ngo.activeJobs ? (
                        <span className="text-primary font-medium">
                          {ngo.activeJobs} active role{ngo.activeJobs !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span>No active roles</span>
                      )}
                    </CardDescription>
                    {ngo.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{ngo.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {ngo.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {ngo.description}
                  </p>
                )}
                {ngo.category && (
                  <Badge variant="secondary" className="font-normal">
                    {ngo.category}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Button asChild variant="outline" className="w-full mt-6 sm:hidden">
        <Link href="/ngos">
          Explore All NGOs <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </section>
  )
}
