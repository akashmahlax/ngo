import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { StatsCard } from "@/components/dashboard/stats-card"
import { LineChart } from "@/components/charts/line-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Plus,
  ExternalLink,
  Calendar,
  CheckCircle,
  Clock
} from "lucide-react"
import Link from "next/link"
import { ObjectId } from "mongodb"

export default async function NgoDashboard() {
  const session = await auth()
  if (!session?.user) return null

  const { jobs, applications, users } = await getCollections()
  const ngoId = new ObjectId((session as any).userId)
  
  // Get NGO data
  const ngo = await users.findOne({ _id: ngoId } as any)
  const plan = (session as any).plan
  const isPlus = plan?.includes("plus")
  const baseJobLimit = 3

  // Get active jobs with application counts
  const activeJobs = await jobs
    .aggregate([
      { $match: { ngoId, status: "open" } },
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
          shortlistedCount: {
            $size: {
              $filter: {
                input: "$applications",
                cond: { $in: ["$$this.status", ["review", "interview", "offered"]] }
              }
            }
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 }
    ])
    .toArray()

  // Get stats
  const totalJobs = await jobs.countDocuments({ ngoId })
  const activeJobsCount = await jobs.countDocuments({ ngoId, status: "open" })
  const totalApplications = await applications.countDocuments({ ngoId })
  const shortlistedCandidates = await applications.countDocuments({ 
    ngoId, 
    status: { $in: ["review", "interview", "offered"] } 
  })

  // Get applications trend data (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const applicationsTrend = await applications
    .aggregate([
      { 
        $match: { 
          ngoId, 
          createdAt: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
    .toArray()

  // Prepare trend chart data
  const trendData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayData = applicationsTrend.find(item => item._id === dateStr)
    trendData.push({
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      applications: dayData?.count || 0
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {ngo?.orgName || ngo?.name || "NGO"}!
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/ngos/post">
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/volunteers">
              <Users className="h-4 w-4 mr-2" />
              Find Volunteers
            </Link>
          </Button>
        </div>
      </div>

      {/* Plan Status Banner */}
      {!isPlus && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-amber-900">Base Plan</h3>
                <p className="text-sm text-amber-700">
                  {activeJobsCount}/{baseJobLimit} active jobs posted
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-600 h-2 rounded-full" 
                      style={{ width: `${(activeJobsCount / baseJobLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link href="/upgrade">Upgrade</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Jobs"
          value={activeJobsCount}
          description={`${isPlus ? "Unlimited" : `${baseJobLimit} limit`} jobs`}
          iconName="FileText"
        />
        <StatsCard
          title="Total Applications"
          value={totalApplications}
          description="All time applications received"
          iconName="Users"
          trend={totalApplications > 0 ? { value: 15, label: "from last month", isPositive: true } : undefined}
        />
        <StatsCard
          title="Shortlisted"
          value={shortlistedCandidates}
          description="Candidates in review"
          iconName="CheckCircle"
        />
        <StatsCard
          title="Total Jobs"
          value={totalJobs}
          description="Jobs posted all time"
          iconName="TrendingUp"
        />
      </div>

      {/* Charts and Active Jobs */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Applications Trend Chart */}
        <div className="lg:col-span-1">
          <LineChart
            data={trendData}
            lines={[{ dataKey: "applications", stroke: "#3B82F6", name: "Applications" }]}
            title="Applications (7 days)"
          />
        </div>

        {/* Active Jobs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {activeJobs.length > 0 ? (
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div key={job._id.toString()} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{job.title}</h3>
                          <Badge variant="secondary">
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.applicationCount} applications
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {job.shortlistedCount} shortlisted
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/ngo/jobs/${job._id}/applications`}>
                            View Applications
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/ngo/jobs/${job._id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No active jobs</h3>
                  <p className="text-muted-foreground mb-4">
                    Post your first job to start finding volunteers
                  </p>
                  <Button asChild>
                    <Link href="/ngos/post">Post a Job</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/ngos/post">
                <Plus className="h-6 w-6 mb-2" />
                Post a Job
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/volunteers">
                <Users className="h-6 w-6 mb-2" />
                Find Volunteers
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/dashboard/ngo/profile">
                <ExternalLink className="h-6 w-6 mb-2" />
                Edit Profile
              </Link>
            </Button>
            {!isPlus && (
              <Button asChild variant="outline" className="h-auto p-4 flex-col">
                <Link href="/upgrade">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Upgrade Plan
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


