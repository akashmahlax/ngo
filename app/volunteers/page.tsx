"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { VolunteerCard } from "@/components/volunteer-card"
import { 
  Search, 
  X,
  Grid,
  List,
  MapPin,
  Users,
  Loader2,
  Award,
  Filter
} from "lucide-react"
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
  // Professional/Performance fields
  hourlyRate?: number
  ngoHourlyRate?: number
  availability?: "full-time" | "part-time" | "flexible" | "weekends"
  successRate?: number
  responseTime?: string
  currentWorkStatus?: string
  completedProjects?: number
  activeProjects?: number
  rating?: number
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
    
    if (locationFilter) {
      if (!volunteer.location || !volunteer.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false
      }
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

  const verifiedCount = volunteers.filter((volunteer) => volunteer.verified).length
  const uniqueLocations = new Set(
    volunteers
      .map((volunteer) => volunteer.location?.trim())
      .filter((value): value is string => Boolean(value))
  )
  const skillFrequency = volunteers.reduce<Record<string, number>>((acc, volunteer) => {
    ;(volunteer.skills || []).forEach((skill) => {
      const key = skill.trim()
      if (!key) return
      acc[key] = (acc[key] || 0) + 1
    })
    return acc
  }, {})
  const topSkillEntries = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
  const totalSkills = Object.keys(skillFrequency).length
  const totalVolunteers = totalCount || volunteers.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 dark:from-[#050517] dark:to-[#111132]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary to-primary/80 dark:from-primary/70 dark:via-primary/80 dark:to-primary/60" />
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/30 blur-3xl opacity-40 dark:bg-white/10" />
        <div className="absolute right-[-80px] top-10 h-96 w-96 rounded-full bg-primary-foreground/30 blur-3xl opacity-40 dark:bg-primary-foreground/10" />
        <div className="absolute bottom-[-120px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-[120px] opacity-70 dark:bg-white/5" />
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 dark:border-primary-foreground/20">
              Professional Volunteer Network
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Discover Talented Volunteers
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 dark:text-primary-foreground/80 max-w-2xl mx-auto">
              Connect with skilled, mission-driven professionals ready to contribute expertise and energy to impactful causes.
            </p>

            {/* Main Search */}
            <div className="relative max-w-2xl mx-auto mt-10">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground/70" />
              <Input
                placeholder="Search by name, skills, or expertise..."
                className="pl-12 pr-4 py-6 text-lg bg-white/95 dark:bg-[#161629]/90 text-foreground border border-white/40 dark:border-white/10 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.8)] backdrop-blur"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {topSkillEntries.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {topSkillEntries.map(([skill, count]) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="bg-white/20 dark:bg-white/10 border-white/50 dark:border-white/20 text-primary-foreground backdrop-blur"
                  >
                    {skill}
                    <span className="ml-2 text-xs opacity-90">· {count}</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="container relative z-20 -mt-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/80 dark:bg-[#11112B]/90 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Volunteers</p>
                  <p className="text-3xl font-bold mt-1">{totalVolunteers}</p>
                  <p className="text-xs text-muted-foreground mt-1">Across the entire platform</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 dark:bg-[#11112B]/90 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Verified Talent</p>
                  <p className="text-3xl font-bold mt-1">{verifiedCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Professionally vetted volunteers</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-emerald-500 dark:text-emerald-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 dark:bg-[#11112B]/90 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Global Reach</p>
                  <p className="text-3xl font-bold mt-1">{uniqueLocations.size}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active volunteer locations</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-sky-500/20 dark:bg-sky-400/20 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-sky-500 dark:text-sky-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters & Controls */}
        <div className="bg-card/80 dark:bg-[#0B0B1C]/80 backdrop-blur-xl border border-border/60 dark:border-white/10 rounded-2xl shadow-xl p-6 mb-10 transition-all">
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
            {filteredVolunteers.map((volunteer) => (
              <VolunteerCard
                key={volunteer._id}
                volunteer={volunteer}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
