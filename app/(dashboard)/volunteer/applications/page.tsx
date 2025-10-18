"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Search, 
  Calendar, 
  X,
  Loader2,
  Download,
  Eye
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Application {
  _id: string
  status: "applied" | "shortlisted" | "accepted" | "rejected"
  coverLetter: string
  appliedAt: string
  job: {
    _id: string
    title: string
    location: string
    type: string
    category: string
  } | null
  ngo: {
    _id: string
    name: string
    orgName?: string
    avatarUrl?: string
  } | null
}

export default function VolunteerApplications() {
  const { data: session } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/applications")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setApplications(data.applications || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load")
      } finally {
        setLoading(false)
      }
    }
    if (session?.user) fetchApplications()
  }, [session])

  const filteredApplications = applications.filter(app => {
    if (activeTab !== "all" && app.status !== activeTab) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const title = app.job?.title?.toLowerCase() || ""
      const org = (app.ngo?.orgName || app.ngo?.name || "").toLowerCase()
      if (!title.includes(q) && !org.includes(q)) return false
    }
    if (selectedStatus.length > 0 && !selectedStatus.includes(app.status)) return false
    return true
  })

  const getStatusVariant = (s: string): "secondary" | "default" | "destructive" => {
    if (s === "rejected") return "destructive"
    if (s === "applied") return "secondary"
    return "default"
  }

  const getStatusText = (s: string) => {
    const map: Record<string, string> = {
      applied: "Applied",
      shortlisted: "Shortlisted",
      accepted: "Accepted",
      rejected: "Rejected"
    }
    return map[s] || s
  }

  const toggleStatus = (s: string) => {
    setSelectedStatus(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedStatus([])
  }

  const exportCSV = () => {
    const data = filteredApplications.map(a => ({
      Job: a.job?.title || "N/A",
      Org: a.ngo?.orgName || a.ngo?.name || "N/A",
      Status: getStatusText(a.status),
      Date: new Date(a.appliedAt).toLocaleDateString()
    }))
    const csv = [Object.keys(data[0] || {}).join(","), ...data.map(r => Object.values(r).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "applications.csv"
    a.click()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track your volunteer job applications</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by job or organization..."
              className="w-full border rounded-md pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {applications.length > 0 && (
            <Button variant="outline" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {["applied", "shortlisted", "accepted", "rejected"].map((status) => (
            <Button
              key={status}
              variant={selectedStatus.includes(status) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleStatus(status)}
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {applications.length === 0 ? "No applications yet" : "No applications found"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {applications.length === 0 ? "Start applying to volunteer opportunities" : "Try adjusting filters"}
                </p>
                <Button asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <Card key={app._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {app.job ? (
                              <Link href={`/jobs/${app.job._id}`} className="hover:underline">
                                {app.job.title}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">Job Deleted</span>
                            )}
                          </h3>
                          <Badge variant={getStatusVariant(app.status)}>
                            {getStatusText(app.status)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {app.ngo?.orgName || app.ngo?.name || "Unknown"}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                          </span>
                        </div>
                        {app.job && (
                          <div className="mt-2 flex gap-2 text-sm text-muted-foreground">
                            <span> {app.job.location}</span>
                            <span></span>
                            <span className="capitalize">{app.job.type}</span>
                          </div>
                        )}
                      </div>
                      {app.job && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/jobs/${app.job._id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Job
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}