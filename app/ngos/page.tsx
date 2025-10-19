
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  X,
  Grid,
  List,
  MapPin,
  Building2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Award,
  Briefcase
} from "lucide-react"
import Link from "next/link"
import { apiGet } from "@/lib/api-client"

interface NGO {
  _id: string
  name: string
  email: string
  description?: string
  category?: string
  activeJobs: number
  avatar?: string
  mission?: string
  focusAreas?: string[]
  location?: string
  verified?: boolean
  orgName?: string
}

export default function NgosDirectory() {
  const [ngos, setNgos] = useState<NGO[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(true)

  // Fetch NGOs from API
  useEffect(() => {
    const fetchNgos = async () => {
      try {
        setLoading(true)
        const response = await apiGet<{ ngos: NGO[]; totalCount: number }>(
          "/api/ngos?limit=100&sort=active"
        )
        
        if (response.data) {
          setNgos(response.data.ngos || [])
          setTotalCount(response.data.totalCount || 0)
        } else {
          console.error("Failed to fetch NGOs:", response.error)
          setNgos([])
        }
      } catch (error) {
        console.error("Error fetching NGOs:", error)
        setNgos([])
      } finally {
        setLoading(false)
      }
    }

    fetchNgos()
  }, [])

  // Get top 20 focus areas
  const allFocusAreas = Array.from(
    new Set(
      ngos
        .map(ngo => ngo.category)
        .filter((cat): cat is string => Boolean(cat))
    )
  ).slice(0, 20)

  // Filter NGOs based on search and filters
  const filteredNgos = ngos.filter(ngo => {
    const ngoName = ngo.orgName || ngo.name
    const ngoDescription = ngo.description || ngo.mission || ""
    const ngoCategory = ngo.category || ""
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!ngoName.toLowerCase().includes(query) && 
          !ngoDescription.toLowerCase().includes(query) &&
          !ngoCategory.toLowerCase().includes(query)) {
        return false
      }
    }
    
    // Focus areas filter
    if (selectedFocusAreas.length > 0 && ngo.category &&
        !selectedFocusAreas.includes(ngo.category)) {
      return false
    }
    
    // Location filter
    if (locationFilter && ngo.location &&
        !ngo.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false
    }
    
    return true
  })

  const toggleFocusAreaFilter = (area: string) => {
    setSelectedFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area) 
        : [...prev, area]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedFocusAreas([])
    setLocationFilter("")
  }

  const activeFilterCount = (searchQuery ? 1 : 0) + selectedFocusAreas.length + (locationFilter ? 1 : 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 dark:from-[#050517] dark:via-[#0A0A1E] dark:to-[#111132]">
     
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/90 via-primary to-primary/90 dark:from-primary/70 dark:via-primary/80 dark:to-primary/70">
        {/* Decorative blur circles */}
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/30 dark:bg-white/10 blur-3xl" />
        <div className="absolute right-10 top-10 h-80 w-80 rounded-full bg-white/20 dark:bg-white/5 blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">Organizations Directory</h1>
            <p className="text-lg md:text-xl text-white/90 dark:text-white/80 drop-shadow">
              Discover nonprofits and NGOs making a difference in your community
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search organizations by name, mission, or focus area..."
                className="pl-12 pr-4 py-6 text-base bg-background/95 dark:bg-[#0F0F23]/90 text-foreground shadow-2xl border-white/20 dark:border-white/10 backdrop-blur-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Panel */}
        <Card className="mb-6 bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Filters</CardTitle>
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="rounded-full">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hover:bg-primary/10"
              >
                {showFilters ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          {showFilters && (
            <CardContent className="space-y-4">
              {/* Location Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filter by location..."
                    className="pl-10"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
              </div>

              {/* Focus Areas */}
              {allFocusAreas.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Focus Areas</label>
                  <div className="flex flex-wrap gap-2">
                    {allFocusAreas.map((area) => (
                      <Button
                        key={area}
                        variant={selectedFocusAreas.includes(area) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFocusAreaFilter(area)}
                        className="transition-all"
                      >
                        {area}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          )}
        </Card>

        {/* Loading State */}
        {loading ? (
          <Card className="bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <CardContent className="py-16 text-center">
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
              <p className="text-lg font-medium">Loading organizations...</p>
              <p className="text-muted-foreground mt-2">Discovering amazing nonprofits for you</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* View Controls & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <p className="text-lg font-medium">
                  {filteredNgos.length} Organization{filteredNgos.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">{totalCount} total</span>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode !== "grid" ? "border-border/50 dark:border-white/20 hover:bg-primary/10" : ""}
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode !== "list" ? "border-border/50 dark:border-white/20 hover:bg-primary/10" : ""}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
              </div>
            </div>

            {/* Empty State */}
            {filteredNgos.length === 0 ? (
              <Card className="bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl shadow-2xl">
                <CardContent className="py-16 text-center">
                  <Search className="h-16 w-16 mx-auto text-muted-foreground/60 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No organizations found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {searchQuery || activeFilterCount > 0
                      ? "Try adjusting your search or filters to discover more organizations"
                      : "There are no organizations available at the moment"}
                  </p>
                  {activeFilterCount > 0 && (
                    <Button onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              // NGOs Grid/List
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredNgos.map((ngo) => {
                  const displayName = ngo.orgName || ngo.name
                  const displayDescription = ngo.description || ngo.mission || "No description available"

                  if (viewMode === "grid") {
                    return (
                      <Card
                        key={ngo._id}
                        className="group bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl hover:-translate-y-1 hover:shadow-2xl hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-200"
                      >
                        <CardContent className="p-6">
                          {/* Organization Header */}
                          <div className="flex flex-col items-center text-center mb-4">
                            <Avatar className="h-20 w-20 mb-3 ring-4 ring-primary/25 dark:ring-primary/40 border border-white/20 dark:border-white/10 shadow-[0_10px_30px_-10px_rgba(14,116,144,0.7)]">
                              <AvatarImage src={ngo.avatar} alt={displayName} />
                              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/30 via-primary/40 to-primary/20 text-primary-foreground">
                                {displayName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="w-full">
                              <div className="flex items-center justify-center gap-2 mb-1">
                                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{displayName}</h3>
                                {ngo.verified && (
                                  <Award className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                )}
                              </div>
                              
                              {ngo.location && (
                                <div className="flex items-center justify-center text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="line-clamp-1">{ngo.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[60px]">
                            {displayDescription}
                          </p>

                          {/* Category & Jobs */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {ngo.category && (
                              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                {ngo.category}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs border-border/50 dark:border-white/20">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {ngo.activeJobs} {ngo.activeJobs === 1 ? 'job' : 'jobs'}
                            </Badge>
                          </div>

                          {/* View Button */}
                          <Button asChild className="w-full shadow-md hover:shadow-lg transition-shadow">
                            <Link href={`/ngos/${ngo._id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  } else {
                    // List View
                    return (
                      <Card
                        key={ngo._id}
                        className="bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl hover:shadow-2xl hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-200"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {/* Avatar & Basic Info */}
                            <div className="flex items-center gap-4 md:w-1/3">
                              <Avatar className="h-16 w-16 flex-shrink-0 ring-4 ring-primary/25 dark:ring-primary/40 border border-white/20 dark:border-white/10 shadow-[0_10px_30px_-10px_rgba(14,116,144,0.7)]">
                                <AvatarImage src={ngo.avatar} alt={displayName} />
                                <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary/30 via-primary/40 to-primary/20 text-primary-foreground">
                                  {displayName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-lg line-clamp-1">{displayName}</h3>
                                  {ngo.verified && (
                                    <Award className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                  )}
                                </div>
                                {ngo.location && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                    <span className="line-clamp-1">{ngo.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Description & Actions */}
                            <div className="md:w-2/3 flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                  {displayDescription}
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-2">
                                  {ngo.category && (
                                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                      {ngo.category}
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs border-border/50 dark:border-white/20">
                                    <Briefcase className="h-3 w-3 mr-1" />
                                    {ngo.activeJobs} {ngo.activeJobs === 1 ? 'job' : 'jobs'}
                                  </Badge>
                                </div>
                              </div>

                              <Button asChild className="md:flex-shrink-0 shadow-md hover:shadow-lg transition-shadow">
                                <Link href={`/ngos/${ngo._id}`}>
                                  View Profile
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  }
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}