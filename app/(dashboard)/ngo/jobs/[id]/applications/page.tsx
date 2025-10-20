"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Download,
  X,
  ChevronLeft,
  Calendar,
  MapPin,
  Star,
  StarOff,
  User,
  Mail,
  Check,
  XCircle,
  Undo2,
} from "lucide-react"

type ApplicationStatus = "applied" | "shortlisted" | "accepted" | "rejected" | "withdrawn"

type VolunteerInfo = {
  _id: string
  name?: string
  email?: string
  avatarUrl?: string
  location?: string
  skills: string[]
  bio?: string
}

type JobInfo = {
  _id: string
  title: string
}

type Application = {
  _id: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string
  coverLetter: string
  ngoNotes: string
  rating: number | null
  volunteer: VolunteerInfo | null
  job: JobInfo | null
}

type Summary = {
  total: number
  byStatus: Record<ApplicationStatus, number>
}

type JobDetails = {
  _id: string
  title: string
}

type ApplicationApiPayload = {
  _id: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string
  coverLetter?: string
  ngoNotes?: string
  rating?: number | null
  volunteer?: {
    _id: string
    name?: string
    email?: string
    avatarUrl?: string
    location?: string
    skills?: string[]
    bio?: string
  } | null
  job?: {
    _id: string
    title: string
  } | null
}

type ApplicationsApiResponse = {
  applications?: ApplicationApiPayload[]
  summary?: {
    total?: number
    byStatus?: Partial<Record<ApplicationStatus, number>>
  }
}

const STATUS_META: Record<ApplicationStatus, { label: string; badge: "default" | "secondary" | "destructive" | "outline" }> = {
  applied: { label: "Pending Review", badge: "secondary" },
  shortlisted: { label: "Shortlisted", badge: "default" },
  accepted: { label: "Accepted", badge: "default" },
  rejected: { label: "Rejected", badge: "destructive" },
  withdrawn: { label: "Withdrawn", badge: "outline" },
}

const STATUS_FILTERS: ApplicationStatus[] = ["applied", "shortlisted", "accepted", "rejected", "withdrawn"]

const EMPTY_SUMMARY: Summary = {
  total: 0,
  byStatus: {
    applied: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
  },
}

function buildSummaryFromApps(apps: Application[]): Summary {
  return apps.reduce<Summary>(
    (acc, app) => {
      acc.total += 1
      acc.byStatus[app.status] += 1
      return acc
    },
    {
      total: 0,
      byStatus: {
        applied: 0,
        shortlisted: 0,
        accepted: 0,
        rejected: 0,
        withdrawn: 0,
      },
    }
  )
}

function updateSummaryForStatusChange(summary: Summary, from: ApplicationStatus, to: ApplicationStatus): Summary {
  if (from === to) return summary
  return {
    total: summary.total,
    byStatus: {
      ...summary.byStatus,
      [from]: Math.max(0, summary.byStatus[from] - 1),
      [to]: summary.byStatus[to] + 1,
    },
  }
}

function escapeCsvValue(value: string) {
  const needsQuotes = value.includes(",") || value.includes("\n") || value.includes("\"")
  const sanitized = value.replace(/"/g, '""')
  return needsQuotes ? `"${sanitized}"` : sanitized
}

function buildCsv(applications: Application[]) {
  const header = ["Volunteer", "Email", "Status", "Applied", "Job"]
  const rows = applications.map((app) => [
    app.volunteer?.name ?? "Unknown",
    app.volunteer?.email ?? "N/A",
    STATUS_META[app.status].label,
    new Date(app.appliedAt).toLocaleDateString(),
    app.job?.title ?? "N/A",
  ])
  return [header, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(String(value))).join(","))
    .join("\n")
}

export default function JobApplicationsPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [summary, setSummary] = useState<Summary>(EMPTY_SUMMARY)
  const [job, setJob] = useState<JobDetails | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<ApplicationStatus[]>([])
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [notesLoading, setNotesLoading] = useState<string | null>(null)
  const [ratingLoading, setRatingLoading] = useState<string | null>(null)

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    try {
      const [jobRes, appsRes] = await Promise.all([
        fetch(`/api/jobs/${params.id}`),
        fetch(`/api/applications?jobId=${params.id}`),
      ])

      if (jobRes.ok) {
        const jobData = await jobRes.json()
        setJob(jobData?.job ? { _id: jobData.job._id, title: jobData.job.title } : null)
      } else if (jobRes.status === 404) {
        setJob(null)
      }

      if (!appsRes.ok) {
        throw new Error("Failed to load applications")
      }

      const appsData: ApplicationsApiResponse = await appsRes.json()
      const normalizedApps: Application[] = (appsData.applications ?? []).map((app) => ({
        _id: app._id,
        status: app.status,
        appliedAt: app.appliedAt,
        updatedAt: app.updatedAt,
        coverLetter: app.coverLetter ?? "",
        ngoNotes: app.ngoNotes ?? "",
        rating: typeof app.rating === "number" ? app.rating : null,
        volunteer: app.volunteer
          ? {
              _id: app.volunteer._id,
              name: app.volunteer.name,
              email: app.volunteer.email,
              avatarUrl: app.volunteer.avatarUrl,
              location: app.volunteer.location,
              skills: Array.isArray(app.volunteer.skills) ? app.volunteer.skills : [],
              bio: app.volunteer.bio,
            }
          : null,
        job: app.job ? { _id: app.job._id, title: app.job.title } : null,
      }))

      const summaryData: Summary = appsData.summary
        ? {
            total: appsData.summary.total ?? normalizedApps.length,
            byStatus: {
              applied: appsData.summary.byStatus?.applied ?? 0,
              shortlisted: appsData.summary.byStatus?.shortlisted ?? 0,
              accepted: appsData.summary.byStatus?.accepted ?? 0,
              rejected: appsData.summary.byStatus?.rejected ?? 0,
              withdrawn: appsData.summary.byStatus?.withdrawn ?? 0,
            },
          }
        : buildSummaryFromApps(normalizedApps)

      const drafts = normalizedApps.reduce<Record<string, string>>((acc, app) => {
        acc[app._id] = app.ngoNotes
        return acc
      }, {})

      setApplications(normalizedApps)
      setSummary(summaryData)
      setNotesDraft(drafts)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to load applications. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (session?.user) {
      void fetchApplications()
    }
  }, [session?.user, fetchApplications])

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return applications.filter((app) => {
      if (statusFilters.length > 0 && !statusFilters.includes(app.status)) {
        return false
      }

      if (query) {
        const volunteerName = app.volunteer?.name?.toLowerCase() ?? ""
        const volunteerSkills = (app.volunteer?.skills || []).join(" ").toLowerCase()
        if (!volunteerName.includes(query) && !volunteerSkills.includes(query)) {
          return false
        }
      }

      return true
    })
  }, [applications, searchQuery, statusFilters])

  const handleStatusFilterToggle = (status: ApplicationStatus) => {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((item) => item !== status) : [...prev, status]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilters([])
  }

  const handleExport = () => {
    if (filteredApplications.length === 0) {
      toast.info("No applications to export.")
      return
    }

    const csv = buildCsv(filteredApplications)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `applications-${params.id}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleNotesChange = (applicationId: string, value: string) => {
    setNotesDraft((prev) => ({ ...prev, [applicationId]: value }))
  }

  const handleNotesSave = async (applicationId: string) => {
    const application = applications.find((app) => app._id === applicationId)
    if (!application) return

    const note = notesDraft[applicationId] ?? ""
    if (note === application.ngoNotes) return

    setNotesLoading(applicationId)
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ngoNotes: note }),
      })
      if (!res.ok) {
        throw new Error("Failed to update notes")
      }
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, ngoNotes: note, updatedAt: new Date().toISOString() }
            : app
        )
      )
      toast.success("Notes updated")
    } catch (err) {
      console.error(err)
      toast.error("Unable to update notes.")
    } finally {
      setNotesLoading(null)
    }
  }

  const handleRatingChange = async (applicationId: string, rating: number) => {
    const application = applications.find((app) => app._id === applicationId)
    if (!application || application.rating === rating) return

    setRatingLoading(applicationId)
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      })
      if (!res.ok) {
        throw new Error("Failed to update rating")
      }
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, rating, updatedAt: new Date().toISOString() }
            : app
        )
      )
      toast.success("Rating saved")
    } catch (err) {
      console.error(err)
      toast.error("Unable to update rating.")
    } finally {
      setRatingLoading(null)
    }
  }

  const handleStatusUpdate = async (applicationId: string, nextStatus: ApplicationStatus) => {
    const application = applications.find((app) => app._id === applicationId)
    if (!application || application.status === nextStatus) return

    setActionLoading(applicationId)
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) {
        throw new Error("Failed to update status")
      }

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, status: nextStatus, updatedAt: new Date().toISOString() }
            : app
        )
      )
      setSummary((prev) => updateSummaryForStatusChange(prev, application.status, nextStatus))
      toast.success(`Application marked as ${STATUS_META[nextStatus].label.toLowerCase()}`)
    } catch (err) {
      console.error(err)
      toast.error("Unable to update status.")
    } finally {
      setActionLoading(null)
    }
  }

  const actionButtonsForStatus = (application: Application) => {
    const disabled = actionLoading === application._id
    switch (application.status) {
      case "applied":
        return [
          <Button
            key="shortlist"
            variant="outline"
            disabled={disabled}
            onClick={() => handleStatusUpdate(application._id, "shortlisted")}
          >
            <Check className="h-4 w-4 mr-2" />
            Shortlist
          </Button>,
          <Button
            key="accept"
            disabled={disabled}
            onClick={() => handleStatusUpdate(application._id, "accepted")}
          >
            <Check className="h-4 w-4 mr-2" />
            Accept
          </Button>,
          <Button
            key="reject"
            variant="outline"
            disabled={disabled}
            onClick={() => handleStatusUpdate(application._id, "rejected")}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>,
        ]
      case "shortlisted":
        return [
          <Button
            key="accept"
            disabled={disabled}
            onClick={() => handleStatusUpdate(application._id, "accepted")}
          >
            <Check className="h-4 w-4 mr-2" />
            Accept
          </Button>,
          <Button
            key="reject"
            variant="outline"
            disabled={disabled}
            onClick={() => handleStatusUpdate(application._id, "rejected")}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>,
          <Button
            key="reopen"
            variant="outline"
            disabled={disabled}
            onClick={() => handleStatusUpdate(application._id, "applied")}
          >
            <Undo2 className="h-4 w-4 mr-2" />
            Move to Pending
          </Button>,
        ]
      case "accepted":
        return [
          <Button
            key="reopen"
            variant="outline"
            disabled={disabled}
            onClick={() => handleStatusUpdate(application._id, "shortlisted")}
          >
            <Undo2 className="h-4 w-4 mr-2" />
            Reopen
          </Button>,
          <Button
            key="reject"
            variant="outline"
            disabled={disabled}
            onClick={() => handleStatusUpdate(application._id, "rejected")}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Mark Rejected
          </Button>,
        ]
      case "rejected":
        return [
          <Button
            key="reopen"
            variant="outline"
            disabled={disabled}
            onClick={() => handleStatusUpdate(application._id, "applied")}
          >
            <Undo2 className="h-4 w-4 mr-2" />
            Reopen
          </Button>,
        ]
      default:
        return [
          <p key="no-actions" className="text-xs text-muted-foreground">
            No additional actions available.
          </p>,
        ]
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-full max-w-sm" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => fetchApplications()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <Button variant="ghost" asChild className="w-fit">
        <Link href="/dashboard/ngo">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold">
          {job?.title ?? "Job Applications"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage volunteer applications, record internal notes, and move candidates through each stage.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by volunteer or skills..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleExport} disabled={!filteredApplications.length}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <Button
              key={status}
              variant={statusFilters.includes(status) ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilterToggle(status)}
              className="capitalize"
            >
              {STATUS_META[status].label}
            </Button>
          ))}
          {(searchQuery || statusFilters.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{summary.total}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <CardDescription>Awaiting action</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{summary.byStatus.applied}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <CardDescription>Next up</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{summary.byStatus.shortlisted}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CardDescription>Hired volunteers</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{summary.byStatus.accepted}</CardContent>
        </Card>
      </div>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Search className="h-10 w-10 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No applications found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting filters or encourage volunteers to apply to this role.
              </p>
            </div>
            {(searchQuery || statusFilters.length > 0) && (
              <Button onClick={clearFilters}>Reset Filters</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const volunteer = application.volunteer
            const notesDraftValue = notesDraft[application._id] ?? application.ngoNotes
            const noteChanged = notesDraftValue !== application.ngoNotes
            return (
              <Card key={application._id} className="border-2">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                    <div className="flex-1 space-y-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            {volunteer?.avatarUrl && <AvatarImage src={volunteer.avatarUrl} alt={volunteer.name ?? "Volunteer"} />}
                            <AvatarFallback>{volunteer?.name?.charAt(0)?.toUpperCase() ?? "V"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {volunteer?.name ?? "Volunteer"}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                              </span>
                              {volunteer?.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {volunteer.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant={STATUS_META[application.status].badge} className="self-start">
                          {STATUS_META[application.status].label}
                        </Badge>
                      </div>

                      {volunteer?.bio && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {volunteer.bio}
                        </p>
                      )}

                      {volunteer?.skills?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {volunteer.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="capitalize">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      {application.coverLetter && (
                        <div className="space-y-3">
                          <Separator />
                          <div>
                            <h4 className="text-sm font-semibold">Cover Letter</h4>
                            <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                              {application.coverLetter}
                            </p>
                          </div>
                        </div>
                      )}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Applications</p>
                              <p className="mt-2 text-2xl font-semibold">{summary.total}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">Pending Review</p>
                              <p className="mt-2 text-2xl font-semibold">{summary.byStatus.applied}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">Shortlisted</p>
                              <p className="mt-2 text-2xl font-semibold">{summary.byStatus.shortlisted}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">Accepted</p>
                              <p className="mt-2 text-2xl font-semibold">{summary.byStatus.accepted}</p>
                            </CardContent>
                          </Card>
                        </div>


                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Internal Notes</h4>
                          <span className="text-xs text-muted-foreground">
                            Updated {formatDistanceToNow(new Date(application.updatedAt), { addSuffix: true })}
                          </span>
                        </div>
                        {application.ngoNotes && !noteChanged && (
                          <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                            {application.ngoNotes}
                          </div>
                        )}
                        <Textarea
                          value={notesDraftValue}
                          onChange={(event) => handleNotesChange(application._id, event.target.value)}
                          rows={3}
                          placeholder="Add private notes visible only to your team"
                        />
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            onClick={() => handleNotesSave(application._id)}
                            disabled={notesLoading === application._id || !noteChanged}
                          >
                            Save Notes
                          </Button>
                          {notesLoading === application._id && (
                            <span className="text-xs text-muted-foreground">Saving…</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Rating</h4>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingChange(application._id, star)}
                              disabled={ratingLoading === application._id}
                              className="text-muted-foreground transition-colors hover:text-yellow-500 disabled:cursor-not-allowed"
                              aria-label={`Set rating to ${star}`}
                            >
                              {star <= (application.rating ?? 0) ? (
                                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                              ) : (
                                <StarOff className="h-5 w-5" />
                              )}
                            </button>
                          ))}
                          <span className="text-xs text-muted-foreground">
                            {application.rating ? `${application.rating}/5` : "Not rated"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full max-w-xs space-y-3">
                      {volunteer && (
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/volunteers/${volunteer._id}`}>
                            <User className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </Button>
                      )}
                      {volunteer?.email && (
                        <Button asChild variant="outline" className="w-full">
                          <a href={`mailto:${volunteer.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Email Candidate
                          </a>
                        </Button>
                      )}
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        {actionButtonsForStatus(application).map((button, index) => (
                          <div key={index}>{button}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}