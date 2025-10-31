import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/lib/admin-auth"
import { getCollections } from "@/lib/models"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Briefcase,
  Search,
  Star,
  Eye,
  Ban,
  Trash2,
  MapPin,
  Calendar,
  Building2,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string; featured?: string }
}) {
  const authResult = await checkAdminAuth()
  
  if (!authResult.authorized) {
    redirect("/signin")
  }

  const { jobs, users, applications } = await getCollections()

  // Build query
  const query: any = {}
  
  if (searchParams.status && searchParams.status !== "all") {
    query.status = searchParams.status
  }
  
  if (searchParams.featured === "true") {
    query.featured = true
  }
  
  if (searchParams.search) {
    query.$or = [
      { title: { $regex: searchParams.search, $options: "i" } },
      { description: { $regex: searchParams.search, $options: "i" } },
      { category: { $regex: searchParams.search, $options: "i" } }
    ]
  }

  // Get jobs with NGO details
  const allJobs = await jobs
    .aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "ngoId",
          foreignField: "_id",
          as: "ngo"
        }
      },
      { $unwind: "$ngo" },
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
          applicationCount: { $size: "$applications" }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 100 }
    ])
    .toArray()

  // Get counts
  const totalJobs = await jobs.countDocuments()
  const openJobs = await jobs.countDocuments({ status: "open" })
  const closedJobs = await jobs.countDocuments({ status: "closed" })
  const featuredJobs = await jobs.countDocuments({ featured: true })
  const reportedJobs = await jobs.countDocuments({ reportCount: { $gt: 0 } })

  const currentStatus = searchParams.status || "all"
  const currentFeatured = searchParams.featured === "true"

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Job Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all job postings
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Jobs</CardDescription>
            <CardTitle className="text-2xl">{totalJobs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Open Jobs</CardDescription>
            <CardTitle className="text-2xl text-green-600">{openJobs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Closed Jobs</CardDescription>
            <CardTitle className="text-2xl">{closedJobs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Featured</CardDescription>
            <CardTitle className="text-2xl text-amber-600">{featuredJobs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Reported</CardDescription>
            <CardTitle className="text-2xl text-red-600">{reportedJobs}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <form action="/admin/jobs" method="get" className="flex gap-2">
                <Input
                  name="search"
                  placeholder="Search by title, description, or category..."
                  defaultValue={searchParams.search}
                  className="flex-1"
                />
                <input type="hidden" name="status" value={currentStatus} />
                <input type="hidden" name="featured" value={searchParams.featured || ""} />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button asChild variant={currentStatus === "all" ? "default" : "outline"} size="sm">
                <Link href="/admin/jobs?status=all">All</Link>
              </Button>
              <Button asChild variant={currentStatus === "open" ? "default" : "outline"} size="sm">
                <Link href="/admin/jobs?status=open">Open</Link>
              </Button>
              <Button asChild variant={currentStatus === "closed" ? "default" : "outline"} size="sm">
                <Link href="/admin/jobs?status=closed">Closed</Link>
              </Button>
              <Button asChild variant={currentFeatured ? "default" : "outline"} size="sm">
                <Link href={`/admin/jobs?featured=true&status=${currentStatus}`}>Featured</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs ({allJobs.length})</CardTitle>
          <CardDescription>
            {searchParams.search ? `Search results for "${searchParams.search}"` : "All jobs"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allJobs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No jobs found
              </div>
            ) : (
              allJobs.map((job: any) => (
                <div key={job._id.toString()} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h4 className="font-medium truncate">
                        {job.title}
                      </h4>
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
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {job.ngo.orgName || job.ngo.name || job.ngo.email}
                      </span>
                      <span className="hidden sm:inline">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location || "Remote"}
                      </span>
                      <span className="hidden sm:inline">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span className="hidden sm:inline">·</span>
                      <span>
                        {job.applicationCount} applications
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/jobs/${job._id}`}>
                        Manage
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/jobs/${job._id}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
