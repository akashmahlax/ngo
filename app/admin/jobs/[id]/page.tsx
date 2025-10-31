"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Star,
  XCircle,
  Trash2,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  Clock,
  Users,
  ArrowLeft,
  Eye,
  AlertTriangle,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AdminJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [jobId, setJobId] = useState<string>("")
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [closeReason, setCloseReason] = useState("")

  useEffect(() => {
    params.then(p => {
      setJobId(p.id)
    })
  }, [params])

  useEffect(() => {
    if (jobId) {
      loadJobData()
    }
  }, [jobId])

  async function loadJobData() {
    if (!jobId) return
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`)
      if (res.ok) {
        const data = await res.json()
        setJob(data.job)
      } else {
        toast.error("Failed to load job data")
        router.push("/admin/jobs")
      }
    } catch (error) {
      console.error("Error loading job:", error)
      toast.error("Failed to load job data")
    } finally {
      setLoading(false)
    }
  }

  async function toggleFeatured() {
    if (!job || !jobId) return
    
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !job.featured })
      })
      
      if (res.ok) {
        toast.success(job.featured ? "Removed from featured" : "Marked as featured")
        await loadJobData()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update featured status")
      }
    } catch (error) {
      console.error("Error updating featured:", error)
      toast.error("Failed to update featured status")
    } finally {
      setActionLoading(false)
    }
  }

  async function toggleStatus() {
    if (!job || !jobId) return
    
    const newStatus = job.status === "open" ? "closed" : "open"
    
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: newStatus,
          reason: closeReason 
        })
      })
      
      if (res.ok) {
        toast.success(`Job ${newStatus}`)
        await loadJobData()
        setCloseReason("")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    } finally {
      setActionLoading(false)
    }
  }

  async function deleteJob() {
    if (!jobId) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE"
      })
      
      if (res.ok) {
        toast.success("Job deleted successfully")
        router.push("/admin/jobs")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to delete job")
      }
    } catch (error) {
      console.error("Error deleting job:", error)
      toast.error("Failed to delete job")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
        <p className="text-muted-foreground">Job not found</p>
        <Button asChild className="mt-4">
          <Link href="/admin/jobs">Back to Jobs</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Job Details</h1>
          <p className="text-muted-foreground mt-1">
            Manage this job posting
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <Badge variant={job.status === "open" ? "default" : "secondary"}>
                    {job.status}
                  </Badge>
                  {job.featured && (
                    <Badge variant="outline" className="text-amber-600">
                      <Star className="h-3 w-3 mr-1 fill-amber-600" />
                      Featured
                    </Badge>
                  )}
                  {job.reportCount > 0 && (
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {job.reportCount} reports
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex flex-col gap-2 mt-2">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {job.ngo.orgName || job.ngo.name || job.ngo.email}
                    {job.ngo.verified && (
                      <Badge variant="outline" className="text-xs">Verified</Badge>
                    )}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.location || "Remote"}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="mt-2 text-sm whitespace-pre-wrap">{job.description}</p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <Label className="text-muted-foreground">Requirements</Label>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i} className="text-sm">{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div>
                <Label className="text-muted-foreground">Skills Required</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skills.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <Label className="text-muted-foreground">Duration</Label>
                <p className="mt-1 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {job.duration || "Not specified"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="mt-1 text-sm flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {job.commitment || "Flexible"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Positions</Label>
                <p className="mt-1 text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {job.numberOfPositions || 1}
                </p>
              </div>
            </div>

            {job.compensationType && (
              <div className="pt-4 border-t">
                <Label className="text-muted-foreground">Compensation</Label>
                <div className="mt-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium capitalize">{job.compensationType}</span>
                  {job.compensationType === "paid" && job.salaryRange && (
                    <span className="text-sm text-muted-foreground">· {job.salaryRange}</span>
                  )}
                  {job.compensationType === "stipend" && job.stipendAmount && (
                    <span className="text-sm text-muted-foreground">· {job.stipendAmount}</span>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Label className="text-muted-foreground">Posted</Label>
              <p className="mt-1 text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(job.createdAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applications:</span>
                <span className="font-medium">{job.applicationCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Views:</span>
                <span className="font-medium">{job.viewCount || 0}</span>
              </div>
              {job.reportCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reports:</span>
                  <span className="font-medium text-red-600">{job.reportCount}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/jobs/${jobId}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  View Public Page
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant={job.featured ? "outline" : "default"}
                    className="w-full"
                    disabled={actionLoading}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {job.featured ? "Remove Featured" : "Mark as Featured"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {job.featured ? "Remove Featured Status?" : "Mark as Featured?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {job.featured 
                        ? "This job will no longer appear in featured listings."
                        : "This job will appear prominently in featured listings across the platform."
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={toggleFeatured}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant={job.status === "open" ? "outline" : "default"}
                    className="w-full"
                    disabled={actionLoading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {job.status === "open" ? "Close Job" : "Reopen Job"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {job.status === "open" ? "Close Job?" : "Reopen Job?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {job.status === "open" 
                        ? "This job will no longer accept new applications."
                        : "This job will start accepting new applications again."
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  {job.status === "open" && (
                    <div>
                      <Label>Reason (optional)</Label>
                      <Textarea
                        value={closeReason}
                        onChange={(e) => setCloseReason(e.target.value)}
                        placeholder="Why is this job being closed?"
                        className="mt-2"
                      />
                    </div>
                  )}
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={toggleStatus}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="w-full"
                    disabled={actionLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Job
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Job Permanently?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the job posting
                      and all associated applications.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={deleteJob}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
