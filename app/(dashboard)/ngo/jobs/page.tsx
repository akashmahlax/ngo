import { auth } from "@/auth"
import { getCollections, type JobDoc } from "@/lib/models"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Briefcase,
  Plus,
  Eye,
  Edit,
  Clock,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { ObjectId } from "mongodb"
import { redirect } from "next/navigation"

type JobWithMetrics = JobDoc & {
  applicationCount: number
  appliedCount: number
  shortlistedCount: number
  acceptedCount: number
  rejectedCount: number
}

export default async function NgoJobsPage() {
  const session = await auth()
  if (!session?.user) redirect("/signin")

  const sessionData = session as { userId?: string; plan?: string; role?: "volunteer" | "ngo" }
  if (!sessionData.userId) redirect("/signin")

  const ngoId = new ObjectId(sessionData.userId)

  const { jobs, applications, users } = await getCollections()

  // Get NGO data
  const ngo = await users.findOne({ _id: ngoId })
  if (!ngo) redirect("/signin")
  
  const plan = sessionData.plan
  const isPlus = plan?.includes("plus")
  const baseJobLimit = 3

  // Get all jobs with application counts
  const allJobs = await jobs
    .aggregate<JobWithMetrics>([
      { $match: { ngoId } },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications"
        }
      },
      {
        $addFields: {
          applicationCount: { $size: "$applications" },
          appliedCount: {
            $size: {
              $filter: {
                input: "$applications",
                as: "app",
                cond: { $eq: ["$$app.status", "applied"] }
              }
            }
          },
          shortlistedCount: {
            $size: {
              $filter: {
                input: "$applications",
                as: "app",
                cond: { $eq: ["$$app.status", "shortlisted"] }
              }
            }
          },
          acceptedCount: {
            $size: {
              $filter: {
                input: "$applications",
                as: "app",
                cond: { $eq: ["$$app.status", "accepted"] }
              }
            }
          },
          rejectedCount: {
            $size: {
              $filter: {
                input: "$applications",
                as: "app",
                cond: { $eq: ["$$app.status", "rejected"] }
              }
            }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ])
    .toArray()

  const activeJobs = allJobs.filter(j => j.status === "open")
  const closedJobs = allJobs.filter(j => j.status === "closed")

  // Check quota
  const canPostMore = isPlus || activeJobs.length < baseJobLimit

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Manage your job postings and applications
          </p>
        </div>
        <div className="flex items-center gap-4">
          {!isPlus && (
            <div className="text-sm text-muted-foreground">
              {activeJobs.length} / {baseJobLimit} active jobs
            </div>
          )}
          <Button asChild disabled={!canPostMore}>
            <Link href="/ngos/post">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Quota Warning */}
      {!canPostMore && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900">Job Posting Limit Reached</h3>
                <p className="text-sm text-amber-700 mt-1">
                  You've reached your limit of {baseJobLimit} active jobs. Upgrade to Plus for unlimited job postings.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link href="/upgrade">
                    Upgrade to Plus
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Jobs</CardDescription>
            <CardTitle className="text-3xl">{allJobs.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {activeJobs.length} active · {closedJobs.length} closed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-3xl">
              {allJobs.reduce((sum, job) => sum + job.applicationCount, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Across all jobs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-3xl">
              {allJobs.reduce((sum, job) => sum + job.appliedCount, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Awaiting your action
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Accepted</CardDescription>
            <CardTitle className="text-3xl">
              {allJobs.reduce((sum, job) => sum + job.acceptedCount, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Volunteers hired
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Active Jobs ({activeJobs.length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed Jobs ({closedJobs.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Jobs */}
        <TabsContent value="active" className="space-y-4">
          {activeJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active jobs</h3>
                <p className="text-muted-foreground mb-4">
                  Post your first job to start finding volunteers
                </p>
                <Button asChild>
                  <Link href="/ngos/post">
                    <Plus className="h-4 w-4 mr-2" />
                    Post a Job
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            activeJobs.map((job) => (
              <Card key={job._id.toString()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Application Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{job.applicationCount}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{job.appliedCount}</div>
                      <div className="text-xs text-blue-600">New</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">{job.shortlistedCount}</div>
                      <div className="text-xs text-amber-600">Shortlisted</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{job.acceptedCount}</div>
                      <div className="text-xs text-green-600">Accepted</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{job.rejectedCount}</div>
                      <div className="text-xs text-red-600">Rejected</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button asChild variant="default">
                      <Link href={`/ngo/jobs/${job._id}/applications`}>
                        <Users className="h-4 w-4 mr-2" />
                        View Applications
                        {job.appliedCount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {job.appliedCount} new
                          </Badge>
                        )}
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/jobs/${job._id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/ngo/jobs/${job._id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Closed Jobs */}
        <TabsContent value="closed" className="space-y-4">
          {closedJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No closed jobs</h3>
                <p className="text-muted-foreground">
                  Jobs you close will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            closedJobs.map((job) => (
              <Card key={job._id.toString()} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <Badge variant="secondary">Closed</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Application Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{job.applicationCount}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{job.appliedCount}</div>
                      <div className="text-xs text-blue-600">Applied</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">{job.shortlistedCount}</div>
                      <div className="text-xs text-amber-600">Shortlisted</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{job.acceptedCount}</div>
                      <div className="text-xs text-green-600">Accepted</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{job.rejectedCount}</div>
                      <div className="text-xs text-red-600">Rejected</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button asChild variant="outline">
                      <Link href={`/ngo/jobs/${job._id}/applications`}>
                        <Users className="h-4 w-4 mr-2" />
                        View Applications
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/jobs/${job._id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Job
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
