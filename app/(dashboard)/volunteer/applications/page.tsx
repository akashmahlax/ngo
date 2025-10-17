"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Calendar, 
  Filter,
  X,
  Download,
  Eye
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import Link from "next/link"

// Mock data for demonstration
const mockApplications = [
  {
    id: "1",
    jobId: "job1",
    jobTitle: "Environmental Conservation Volunteer",
    ngoName: "Green Earth Conservation Society",
    status: "applied",
    appliedDate: new Date(Date.now() - 86400000), // 1 day ago
    notes: "Looking forward to contributing to environmental conservation efforts.",
  },
  {
    id: "2",
    jobId: "job2",
    jobTitle: "Digital Marketing Specialist",
    ngoName: "Tech for Good Foundation",
    status: "review",
    appliedDate: new Date(Date.now() - 172800000), // 2 days ago
    notes: "Excited to use my marketing skills for a good cause.",
  },
  {
    id: "3",
    jobId: "job3",
    jobTitle: "Tutor for Underprivileged Children",
    ngoName: "Education First Initiative",
    status: "interview",
    appliedDate: new Date(Date.now() - 259200000), // 3 days ago
    notes: "Passionate about education and helping children reach their potential.",
  },
  {
    id: "4",
    jobId: "job4",
    jobTitle: "Event Coordinator",
    ngoName: "Community Arts Collective",
    status: "offered",
    appliedDate: new Date(Date.now() - 345600000), // 4 days ago
    notes: "Great opportunity to combine event planning with community service.",
  },
  {
    id: "5",
    jobId: "job5",
    jobTitle: "Grant Writer",
    ngoName: "Healthcare for All",
    status: "rejected",
    appliedDate: new Date(Date.now() - 432000000), // 5 days ago
    notes: "Hope to apply for other positions in the future.",
  },
]

export default function VolunteerApplications() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])

  // Filter applications based on active tab, search, and status
  const filteredApplications = mockApplications.filter(app => {
    // Tab filter
    if (activeTab !== "all" && app.status !== activeTab) {
      return false
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!app.jobTitle.toLowerCase().includes(query) && 
          !app.ngoName.toLowerCase().includes(query)) {
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
      case "applied": return "secondary"
      case "review": return "default"
      case "interview": return "default"
      case "offered": return "default"
      case "rejected": return "destructive"
      default: return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "applied": return "Applied"
      case "review": return "Under Review"
      case "interview": return "Interview Scheduled"
      case "offered": return "Offer Received"
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of your volunteer job applications
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by job title or organization..."
              className="w-full border rounded-md pl-10 pr-4 py-2"
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
          {["applied", "review", "interview", "offered", "rejected"].map((status) => (
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

      {/* Applications Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="review">Under Review</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="offered">Offered</TabsTrigger>
          <TabsTrigger value="rejected">Not Selected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            <Link href={`/jobs/${app.jobId}`} className="hover:underline">
                              {app.jobTitle}
                            </Link>
                          </h3>
                          <Badge variant={getStatusVariant(app.status)}>
                            {getStatusText(app.status)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{app.ngoName}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            Applied {formatDistanceToNow(app.appliedDate, { addSuffix: true })}
                          </span>
                        </div>
                        {app.notes && (
                          <p className="mt-2 text-sm italic">
                            "{app.notes}"
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/volunteer/applications/${app.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        {app.status === "offered" && (
                          <Button size="sm">
                            Accept Offer
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {["applied", "review", "interview", "offered", "rejected"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filteredApplications.filter(app => app.status === status).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No {getStatusText(status)} applications</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any applications with this status
                  </p>
                  <Button asChild>
                    <Link href="/jobs">
                      Find Jobs
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredApplications.filter(app => app.status === status).map((app) => (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">
                              <Link href={`/jobs/${app.jobId}`} className="hover:underline">
                                {app.jobTitle}
                              </Link>
                            </h3>
                            <Badge variant={getStatusVariant(app.status)}>
                              {getStatusText(app.status)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{app.ngoName}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Applied {formatDistanceToNow(app.appliedDate, { addSuffix: true })}
                            </span>
                          </div>
                          {app.notes && (
                            <p className="mt-2 text-sm italic">
                              "{app.notes}"
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/volunteer/applications/${app.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                          {app.status === "offered" && (
                            <Button size="sm">
                              Accept Offer
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}