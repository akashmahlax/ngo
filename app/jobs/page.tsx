"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JobCard } from "@/components/job-card"
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Filter,
  X,
  Grid,
  List,
  Bookmark,
  CheckCircle,
  Crown
} from "lucide-react"
import { JobDoc } from "@/lib/models"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { SiteNavbar } from "@/components/site-navbar"

type EnrichedJob = {
  _id: string
  ngoId: string
  title: string
  description: string
  category?: string
  locationType?: string
  skills?: string[]
  benefits?: string[]
  requirements?: string[]
  applicationCount?: number
  viewCount?: number
  status: string
  createdAt: Date | string
  updatedAt: Date | string
  ngoName?: string
  ngoLogoUrl?: string | null
  ngoVerified?: boolean
  ngoPlan?: string
}

// Mock data for demonstration
const mockJobs: JobDoc[] = [
  {
    _id: "1" as any,
    ngoId: "ngo1" as any,
    title: "Environmental Conservation Volunteer",
    description: "Join our team to help protect local wildlife and natural habitats.",
    category: "Environment",
    locationType: "onsite",
    skills: ["Conservation", "Research", "Teamwork"],
    benefits: ["Training provided", "Certificate"],
    requirements: ["Background check", "Physical fitness"],
    applicationCount: 12,
    viewCount: 156,
    status: "open",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2" as any,
    ngoId: "ngo2" as any,
    title: "Digital Marketing Specialist",
    description: "Help us promote our causes through social media and digital campaigns.",
    category: "Marketing",
    locationType: "remote",
    skills: ["Social Media", "Content Creation", "Analytics"],
    benefits: ["Flexible hours", "Remote work"],
    requirements: ["2+ years experience", "Portfolio"],
    applicationCount: 8,
    viewCount: 92,
    status: "open",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(),
  },
  {
    _id: "3" as any,
    ngoId: "ngo3" as any,
    title: "Tutor for Underprivileged Children",
    description: "Provide educational support to children in need in our community center.",
    category: "Education",
    locationType: "onsite",
    skills: ["Teaching", "Patience", "Communication"],
    benefits: ["Meal provided", "Transportation allowance"],
    requirements: ["Teaching certification", "Background check"],
    applicationCount: 15,
    viewCount: 203,
    status: "open",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(),
  },
]

// Categories for filtering
const CATEGORIES = [
  "Education",
  "Healthcare",
  "Environment",
  "Animal Welfare",
  "Community Development",
  "Arts & Culture",
  "Disaster Relief",
  "Human Rights",
  "Marketing",
  "Technology",
  "Finance",
  "Legal",
]

// Location types
const LOCATION_TYPES = [
  { id: "onsite", label: "On-site" },
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
]

export default function JobsPage() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<JobDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs?limit=100')
        if (res.ok) {
          const data = await res.json()
          setJobs(data.jobs.map((job: EnrichedJob) => ({
            ...job,
            _id: job._id,
            createdAt: new Date(job.createdAt),
            updatedAt: new Date(job.updatedAt),
          })))
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
        // Fall back to mock data if API fails
        setJobs(mockJobs)
      } finally {
        setLoading(false)
      }
    }
    
    fetchJobs()
  }, [])

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.category?.toLowerCase().includes(query) ||
        job.skills?.some(skill => skill.toLowerCase().includes(query))
      )
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(job => 
        job.category && selectedCategories.includes(job.category)
      )
    }
    
    // Apply location type filter
    if (selectedLocationTypes.length > 0) {
      result = result.filter(job => 
        job.locationType && selectedLocationTypes.includes(job.locationType)
      )
    }
    
    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case "applications":
        result.sort((a, b) => (b.applicationCount || 0) - (a.applicationCount || 0))
        break
      case "popular":
        result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        break
    }
    
    return result
  }, [jobs, searchQuery, selectedCategories, selectedLocationTypes, sortBy])

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    )
  }

  const toggleLocationType = (type: string) => {
    setSelectedLocationTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedLocationTypes([])
    setSearchQuery("")
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedLocationTypes.length > 0 || searchQuery

  if (loading) {
    return (
      
      <div className="container mx-auto px-4 py-12">
       
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="md:col-span-3 space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Volunteer Opportunities</h1>
        <p className="text-muted-foreground">
          Discover meaningful roles that match your skills and interests
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, skills, or organization..."
            className="pl-10 pr-4 py-6 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-xs h-8"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <CardDescription>
                Refine your job search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label
                        htmlFor={`category-${category}`}
                        className="ml-2 text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Type */}
              <div>
                <h3 className="font-medium mb-3">Location</h3>
                <div className="space-y-2">
                  {LOCATION_TYPES.map((type) => (
                    <div key={type.id} className="flex items-center">
                      <Checkbox
                        id={`location-${type.id}`}
                        checked={selectedLocationTypes.includes(type.id)}
                        onCheckedChange={() => toggleLocationType(type.id)}
                      />
                      <Label
                        htmlFor={`location-${type.id}`}
                        className="ml-2 text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="md:col-span-3">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="applications">Most Applications</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Empty State */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find more opportunities
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            // Job Listings
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredJobs.map((job) => {
                const enrichedJob = job as unknown as EnrichedJob
                return (
                  <JobCard 
                    key={job._id.toString()}
                    job={{
                      _id: job._id.toString(),
                      title: job.title,
                      description: job.description,
                      category: job.category,
                      location: job.location,
                      locationType: job.locationType,
                      createdAt: new Date(job.createdAt),
                      skills: job.skills,
                      compensationType: job.compensationType,
                      salaryRange: job.salaryRange,
                      stipendAmount: job.stipendAmount,
                      commitment: job.commitment,
                      applicationCount: job.applicationCount
                    }}
                    ngo={{
                      name: enrichedJob.ngoName || "Unknown NGO",
                      logoUrl: enrichedJob.ngoLogoUrl,
                      verified: enrichedJob.ngoVerified,
                      plan: enrichedJob.ngoPlan
                    }}
                    viewMode={viewMode}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}