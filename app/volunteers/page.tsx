"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter,
  X,
  Grid,
  List,
  MapPin,
  Users
} from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockVolunteers = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "/placeholder.svg",
    bio: "Passionate environmentalist with 3 years of experience in wildlife conservation. Looking to contribute my research skills to meaningful projects.",
    skills: ["Conservation", "Research", "Data Analysis", "Wildlife Photography"],
    location: "San Francisco, CA",
  },
  {
    id: "2",
    name: "Maria Garcia",
    avatar: "/placeholder.svg",
    bio: "Experienced educator with a focus on community development. Fluent in Spanish and passionate about educational equity.",
    skills: ["Education", "Teaching", "Spanish", "Curriculum Development"],
    location: "Austin, TX",
  },
  {
    id: "3",
    name: "James Wilson",
    avatar: "/placeholder.svg",
    bio: "Digital marketing specialist using my skills to support social causes. Experienced in social media strategy and content creation.",
    skills: ["Marketing", "Social Media", "Graphic Design", "Content Creation"],
    location: "New York, NY",
  },
  {
    id: "4",
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    bio: "Project manager with a passion for nonprofit work. Experienced in fundraising and event planning for charitable organizations.",
    skills: ["Project Management", "Fundraising", "Event Planning", "Grant Writing"],
    location: "Seattle, WA",
  },
  {
    id: "5",
    name: "Michael Brown",
    avatar: "/placeholder.svg",
    bio: "Software engineer volunteering technical skills for social impact. Interested in education technology and accessibility.",
    skills: ["Software Development", "JavaScript", "React", "Accessibility"],
    location: "Boston, MA",
  },
  {
    id: "6",
    name: "Emma Davis",
    avatar: "/placeholder.svg",
    bio: "Healthcare professional with experience in community health programs. Passionate about global health initiatives.",
    skills: ["Healthcare", "Public Health", "Community Outreach", "First Aid"],
    location: "Denver, CO",
  },
]

export default function VolunteersDirectory() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Get all unique skills for filtering
  const allSkills = Array.from(
    new Set(mockVolunteers.flatMap(volunteer => volunteer.skills))
  )

  // Filter volunteers based on search and filters
  const filteredVolunteers = mockVolunteers.filter(volunteer => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!volunteer.name.toLowerCase().includes(query) && 
          !volunteer.bio.toLowerCase().includes(query) &&
          !volunteer.skills.some(skill => skill.toLowerCase().includes(query))) {
        return false
      }
    }
    
    // Skills filter
    if (selectedSkills.length > 0 && 
        !selectedSkills.every(skill => volunteer.skills.includes(skill))) {
      return false
    }
    
    // Location filter
    if (locationFilter && 
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Volunteer Directory</h1>
        <p className="text-muted-foreground">
          Connect with skilled volunteers for your organization's needs
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search volunteers by name, skills, or interests..."
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
          {allSkills.map((skill) => (
            <Button
              key={skill}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSkillFilter(skill)}
            >
              {skill}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-muted-foreground">
          Showing {filteredVolunteers.length} of {mockVolunteers.length} volunteers
        </p>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {mockVolunteers.length} total volunteers
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredVolunteers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No volunteers found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find more volunteers
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </CardContent>
        </Card>
      ) : (
        // Volunteers Grid/List
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredVolunteers.map((volunteer) => (
            <Card key={volunteer.id} className={viewMode === "list" ? "flex" : ""}>
              <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className={viewMode === "list" ? "flex flex-col md:flex-row md:items-center" : ""}>
                  <div className={viewMode === "list" ? "md:w-1/3 mb-4 md:mb-0 md:mr-6" : "mb-4"}>
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                        {volunteer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{volunteer.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{volunteer.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={viewMode === "list" ? "md:w-2/3" : ""}>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {volunteer.bio}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {volunteer.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {volunteer.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{volunteer.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                    
                    <Button asChild>
                      <Link href={`/volunteers/${volunteer.id}`}>
                        View Profile
                      </Link>
                    </Button>
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