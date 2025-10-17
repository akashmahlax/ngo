"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Filter,
  X,
  Download,
  Star,
  StarOff,
  Mail,
  User,
  Calendar,
  Check,
  XCircle,
  ChevronLeft
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import Link from "next/link"

// Mock data for demonstration
const mockApplications = [
  {
    id: "1",
    volunteerId: "vol1",
    volunteerName: "Alex Johnson",
    volunteerAvatar: "/placeholder.svg",
    volunteerSkills: ["Conservation", "Research", "Data Analysis"],
    volunteerBio: "Passionate environmentalist with 3 years of experience in wildlife conservation.",
    status: "review",
    appliedDate: new Date(Date.now() - 86400000), // 1 day ago
    rating: 4,
    notes: "",
  },
  {
    id: "2",
    volunteerId: "vol2",
    volunteerName: "Maria Garcia",
    volunteerAvatar: "/placeholder.svg",
    volunteerSkills: ["Education", "Teaching", "Spanish"],
    volunteerBio: "Experienced educator looking to contribute to community development projects.",
    status: "interview",
    appliedDate: new Date(Date.now() - 172800000), // 2 days ago
    rating: 5,
    notes: "Excellent communication skills, perfect for our education program.",
  },
  {
    id: "3",
    volunteerId: "vol3",
    volunteerName: "James Wilson",
    volunteerAvatar: "/placeholder.svg",
    volunteerSkills: ["Marketing", "Social Media", "Graphic Design"],
    volunteerBio: "Digital marketing specialist passionate about using skills for social good.",
    status: "offered",
    appliedDate: new Date(Date.now() - 259200000), // 3 days ago
    rating: 3,
    notes: "Strong creative skills, good fit for our outreach initiatives.",
  },
  {
    id: "4",
    volunteerId: "vol4",
    volunteerName: "Sarah Chen",
    volunteerAvatar: "/placeholder.svg",
    volunteerSkills: ["Project Management", "Fundraising", "Event Planning"],
    volunteerBio: "Experienced project manager looking to make a difference in the nonprofit sector.",
    status: "rejected",
    appliedDate: new Date(Date.now() - 345600000), // 4 days ago
    rating: 2,
    notes: "Overqualified for this position but not the right cultural fit.",
  },
]

export default function JobApplicationsPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [applications, setApplications] = useState(mockApplications)
  const [newNotes, setNewNotes] = useState<Record<string, string>>({})

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!app.volunteerName.toLowerCase().includes(query) && 
          !app.volunteerSkills.some(skill => skill.toLowerCase().includes(query))) {
        return false
      }
    }
    
    // Status filter
    if (selectedStatus.length > 0 && !selectedStatus.includes(app.status)) {
      return false
    }
    
    return true
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "review": return "secondary"
      case "interview": return "default"
      case "offered": return "default"
      case "rejected": return "destructive"
      default: return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "review": return "Under Review"
      case "interview": return "Interview Scheduled"
      case "offered": return "Offer Sent"
      case "rejected": return "Not Selected"
      default: return status
    }
  }

  const toggleStatusFilter = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedStatus([])
  }

  const exportToCSV = () => {
    // In a real implementation, this would export the filtered applications to CSV
    alert("Export to CSV functionality would be implemented here")
  }

  const updateRating = (appId: string, rating: number) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === appId ? { ...app, rating } : app
      )
    )
  }

  const updateNotes = (appId: string, notes: string) => {
    setNewNotes(prev => ({ ...prev, [appId]: notes }))
  }

  const saveNotes = (appId: string) => {
    const notes = newNotes[appId]
    if (notes !== undefined) {
      setApplications(prev => 
        prev.map(app => 
          app.id === appId ? { ...app, notes } : app
        )
      )
      setNewNotes(prev => {
        const newNotes = { ...prev }
        delete newNotes[appId]
        return newNotes
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard/ngo/jobs">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <p className="text-muted-foreground">
          Review and manage applications for "Environmental Conservation Volunteer"
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by volunteer name or skills..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {["review", "interview", "offered", "rejected"].map((status) => (
            <Button
              key={status}
              variant={selectedStatus.includes(status) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleStatusFilter(status)}
              className="capitalize"
            >
              {getStatusText(status)}
            </Button>
          ))}
          {(searchQuery || selectedStatus.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Applications Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-muted-foreground">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Interviews Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">Offers Sent</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No applications found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Volunteer Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          {app.volunteerName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{app.volunteerName}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Applied {formatDistanceToNow(app.appliedDate, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(app.status)}>
                        {getStatusText(app.status)}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-3">
                      {app.volunteerBio}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.volunteerSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-muted-foreground">Rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => updateRating(app.id, star)}
                            className="text-muted-foreground hover:text-yellow-500"
                          >
                            {star <= app.rating ? (
                              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                            ) : (
                              <StarOff className="h-5 w-5" />
                            )}
                          </button>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({app.rating}/5)</span>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2 mb-4">
                      {app.notes && (
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-sm">{app.notes}</p>
                        </div>
                      )}
                      <Label htmlFor={`notes-${app.id}`}>Private Notes</Label>
                      <Textarea
                        id={`notes-${app.id}`}
                        value={newNotes[app.id] || ""}
                        onChange={(e) => updateNotes(app.id, e.target.value)}
                        placeholder="Add private notes about this candidate..."
                        rows={2}
                      />
                      <Button 
                        size="sm" 
                        onClick={() => saveNotes(app.id)}
                        disabled={!newNotes[app.id]}
                      >
                        Save Notes
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:w-48 flex flex-col gap-3">
                    <Button asChild>
                      <Link href={`/volunteers/${app.volunteerId}`}>
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Link>
                    </Button>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Candidate
                    </Button>
                    {app.status === "review" && (
                      <>
                        <Button variant="outline">
                          Schedule Interview
                        </Button>
                        <Button>
                          Send Offer
                        </Button>
                        <Button variant="outline" className="text-destructive hover:text-destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    {app.status === "interview" && (
                      <>
                        <Button>
                          Send Offer
                        </Button>
                        <Button variant="outline" className="text-destructive hover:text-destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    {app.status === "offered" && (
                      <Button variant="outline" className="text-destructive hover:text-destructive">
                        <XCircle className="h-4 w-4 mr-2" />
                        Revoke Offer
                      </Button>
                    )}
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