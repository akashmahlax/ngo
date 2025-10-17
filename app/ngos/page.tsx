"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  Filter,
  X,
  Grid,
  List,
  MapPin,
  Building2,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockNgos = [
  {
    id: "1",
    name: "Green Earth Conservation Society",
    logo: "/placeholder.svg",
    mission: "Dedicated to protecting and preserving local wildlife habitats through community engagement and scientific research.",
    focusAreas: ["Environment", "Wildlife Conservation", "Research"],
    location: "San Francisco, CA",
    verified: true,
    activeJobs: 3,
  },
  {
    id: "2",
    name: "Tech for Good Foundation",
    logo: "/placeholder.svg",
    mission: "Leveraging technology to solve social challenges and empower underserved communities worldwide.",
    focusAreas: ["Technology", "Education", "Digital Inclusion"],
    location: "Austin, TX",
    verified: true,
    activeJobs: 2,
  },
  {
    id: "3",
    name: "Education First Initiative",
    logo: "/placeholder.svg",
    mission: "Providing quality education and mentorship to underprivileged children in urban communities.",
    focusAreas: ["Education", "Youth Development", "Mentorship"],
    location: "New York, NY",
    verified: false,
    activeJobs: 5,
  },
  {
    id: "4",
    name: "Community Arts Collective",
    logo: "/placeholder.svg",
    mission: "Promoting arts and culture as tools for community building and social expression.",
    focusAreas: ["Arts & Culture", "Community Development", "Creative Programs"],
    location: "Portland, OR",
    verified: true,
    activeJobs: 1,
  },
  {
    id: "5",
    name: "Healthcare for All",
    logo: "/placeholder.svg",
    mission: "Ensuring access to quality healthcare for underserved populations through mobile clinics and community programs.",
    focusAreas: ["Healthcare", "Public Health", "Community Outreach"],
    location: "Denver, CO",
    verified: false,
    activeJobs: 4,
  },
  {
    id: "6",
    name: "Global Disaster Relief",
    logo: "/placeholder.svg",
    mission: "Providing emergency response and long-term recovery support for communities affected by natural disasters.",
    focusAreas: ["Disaster Relief", "Emergency Response", "Humanitarian Aid"],
    location: "Miami, FL",
    verified: true,
    activeJobs: 2,
  },
]

export default function NgosDirectory() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState("")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Get all unique focus areas for filtering
  const allFocusAreas = Array.from(
    new Set(mockNgos.flatMap(ngo => ngo.focusAreas))
  )

  // Filter NGOs based on search and filters
  const filteredNgos = mockNgos.filter(ngo => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!ngo.name.toLowerCase().includes(query) && 
          !ngo.mission.toLowerCase().includes(query) &&
          !ngo.focusAreas.some(area => area.toLowerCase().includes(query))) {
        return false
      }
    }
    
    // Focus areas filter
    if (selectedFocusAreas.length > 0 && 
        !selectedFocusAreas.every(area => ngo.focusAreas.includes(area))) {
      return false
    }
    
    // Location filter
    if (locationFilter && 
        !ngo.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false
    }
    
    // Verified only filter
    if (verifiedOnly && !ngo.verified) {
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
    setVerifiedOnly(false)
  }

  const hasActiveFilters = searchQuery || selectedFocusAreas.length > 0 || locationFilter || verifiedOnly

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Organizations Directory</h1>
        <p className="text-muted-foreground">
          Discover nonprofits and NGOs making a difference in your community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search organizations by name, mission, or focus area..."
            className="pl-10 pr-4 py-6 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by location..."
              className="pl-10"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verified"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="verified" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Verified Organizations Only
            </Label>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {allFocusAreas.map((area) => (
            <Button
              key={area}
              variant={selectedFocusAreas.includes(area) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFocusAreaFilter(area)}
            >
              {area}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-muted-foreground">
          Showing {filteredNgos.length} of {mockNgos.length} organizations
        </p>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {mockNgos.length} total organizations
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredNgos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No organizations found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find more organizations
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </CardContent>
        </Card>
      ) : (
        // NGOs Grid/List
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredNgos.map((ngo) => (
            <Card key={ngo.id} className={viewMode === "list" ? "flex" : ""}>
              <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className={viewMode === "list" ? "flex flex-col md:flex-row md:items-center" : ""}>
                  <div className={viewMode === "list" ? "md:w-1/3 mb-4 md:mb-0 md:mr-6" : "mb-4"}>
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                        {ngo.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{ngo.name}</h3>
                          {ngo.verified && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{ngo.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={viewMode === "list" ? "md:w-2/3" : ""}>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {ngo.mission}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ngo.focusAreas.slice(0, 3).map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                      {ngo.focusAreas.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{ngo.focusAreas.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="outline">
                        {ngo.activeJobs} active jobs
                      </Badge>
                      <Button asChild>
                        <Link href={`/ngos/${ngo.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}