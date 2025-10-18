"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  X,
  Grid,
  List,
  MapPin,
  Users,
  Loader2,
  Award,
  Briefcase,
  Filter
} from "lucide-react"
import Link from "next/link"
import { apiGet } from "@/lib/api-client"

interface Volunteer {
  _id: string
  name: string
  email: string
  role: string
  skills?: string[]
  title?: string
  avatar?: string
  avatarUrl?: string
  bio?: string
  location?: string
  experience?: any[]
  verified?: boolean
}

export default function VolunteersDirectory() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true)
        const response = await apiGet<{ volunteers: Volunteer[]; totalCount: number }>(
          "/api/volunteers?limit=100&sort=recent"
        )
        
        if (response.data) {
          setVolunteers(response.data.volunteers || [])
          setTotalCount(response.data.totalCount || 0)
        } else {
          setVolunteers([])
        }
      } catch (error) {
        setVolunteers([])
      } finally {
        setLoading(false)
      }
    }

    fetchVolunteers()
  }, [])

  const allSkills = Array.from(
    new Set(volunteers.flatMap(volunteer => volunteer.skills || []))
  ).slice(0, 20)

  const filteredVolunteers = volunteers.filter(volunteer => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!volunteer.name.toLowerCase().includes(query) && 
          !volunteer.bio?.toLowerCase().includes(query) &&
          !(volunteer.skills || []).some(skill => skill.toLowerCase().includes(query)) &&
          !volunteer.title?.toLowerCase().includes(query)) {
        return false
      }
    }
    
    if (selectedSkills.length > 0) {
      const volunteerSkills = (volunteer.skills || []).map(s => s.toLowerCase())
      if (!selectedSkills.some(skill => volunteerSkills.includes(skill.toLowerCase()))) {
        return false
      }
    }
    
    if (locationFilter && volunteer.location &&
        !volunteer.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false
    }
    
    return true
  })

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSkills([])
    setLocationFilter("")
  }

  const hasActiveFilters = searchQuery || selectedSkills.length > 0 || locationFilter

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/90 via-primary to-primary/90 text-primary-foreground dark:from-primary/80 dark:via-primary/90 dark:to-primary/80">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Talented Volunteers
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Connect with skilled individuals passionate about making a difference
            </p>
            
            {/* Main Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-70" />
              <Input
                placeholder="Search by name, skills, or expertise..."
                className="pl-12 pr-4 py-6 text-lg bg-background dark:bg-card text-foreground border-0 shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters & Controls */}
        <div className="bg-card rounded-lg shadow-sm border p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                    {(selectedSkills.length + (locationFilter ? 1 : 0))}
                  </Badge>
                )}
              </Button>
              
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="font-medium">{filteredVolunteers.length}</span>
                <span>of {totalCount} volunteers</span>
              </div>
              
              <div className="flex gap-1 border rounded-md p-1">
                <Button 
                  variant={viewMode === "grid" ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <div className="relative max-w-md">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filter by location..."
                    className="pl-10"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
              </div>

              {allSkills.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map((skill) => (
                      <Button
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSkillFilter(skill)}
                        className="rounded-full"
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading volunteers...</p>
            </CardContent>
          </Card>
        ) : filteredVolunteers.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No volunteers found</h3>
                <p className="text-muted-foreground mb-6">
                  {hasActiveFilters 
                    ? "Try adjusting your search or filters"
                    : "No volunteers are currently registered"}
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters}>Clear Filters</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }>
            {filteredVolunteers.map((volunteer) => {
              const avatarSrc = volunteer.avatarUrl || volunteer.avatar
              const yearsExp = volunteer.experience?.length || 0
              
              return (
                <Card key={volunteer._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    {viewMode === "grid" ? (
                      /* Grid View */
                      <div className="text-center">
                        <div className="relative inline-block mb-4">
                          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                            <AvatarImage src={avatarSrc} alt={volunteer.name} />
                            <AvatarFallback className="text-2xl font-bold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary">
                              {volunteer.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {volunteer.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 dark:bg-blue-600 rounded-full p-1">
                              <Award className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>

                        <h3 className="text-lg font-bold mb-1">{volunteer.name}</h3>
                        
                        {volunteer.title && (
                          <p className="text-sm text-muted-foreground mb-3 font-medium">
                            {volunteer.title}
                          </p>
                        )}

                        {volunteer.location && (
                          <div className="flex items-center justify-center text-sm text-muted-foreground mb-3">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{volunteer.location}</span>
                          </div>
                        )}

                        {volunteer.bio && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {volunteer.bio}
                          </p>
                        )}

                        {volunteer.skills && volunteer.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                            {volunteer.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {volunteer.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{volunteer.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {yearsExp > 0 && (
                          <div className="flex items-center justify-center text-xs text-muted-foreground mb-4">
                            <Briefcase className="h-3.5 w-3.5 mr-1" />
                            <span>{yearsExp} experience{yearsExp > 1 ? 's' : ''}</span>
                          </div>
                        )}

                        <Button asChild className="w-full">
                          <Link href={`/volunteers/${volunteer._id}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      /* List View */
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <Avatar className="h-16 w-16 border-2 border-background shadow">
                              <AvatarImage src={avatarSrc} alt={volunteer.name} />
                              <AvatarFallback className="text-xl font-bold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary">
                                {volunteer.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {volunteer.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 dark:bg-blue-600 rounded-full p-0.5">
                                <Award className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="text-lg font-bold">{volunteer.name}</h3>
                              {volunteer.title && (
                                <p className="text-sm text-muted-foreground font-medium">
                                  {volunteer.title}
                                </p>
                              )}
                            </div>
                            <Button asChild size="sm">
                              <Link href={`/volunteers/${volunteer._id}`}>
                                View Profile
                              </Link>
                            </Button>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mb-2 text-sm text-muted-foreground">
                            {volunteer.location && (
                              <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span>{volunteer.location}</span>
                              </div>
                            )}
                            {yearsExp > 0 && (
                              <div className="flex items-center">
                                <Briefcase className="h-3.5 w-3.5 mr-1" />
                                <span>{yearsExp} experience{yearsExp > 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>

                          {volunteer.bio && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {volunteer.bio}
                            </p>
                          )}

                          {volunteer.skills && volunteer.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {volunteer.skills.slice(0, 6).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {volunteer.skills.length > 6 && (
                                <Badge variant="outline" className="text-xs">
                                  +{volunteer.skills.length - 6} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
