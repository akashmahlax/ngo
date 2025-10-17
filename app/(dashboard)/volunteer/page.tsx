import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { StatsCard } from "@/components/dashboard/stats-card"
import { PieChart } from "@/components/charts/pie-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Plus,
  ExternalLink,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { ObjectId } from "mongodb"

export default async function VolunteerDashboard() {
  const session = await auth()
  if (!session?.user) return null

  const { applications, jobs, users } = await getCollections()
  const userId = new ObjectId((session as any).userId)
  
  // Get user data
  const user = await users.findOne({ _id: userId } as any)
  const plan = (session as any).plan
  const isPlus = plan?.includes("plus")
  const monthlyQuota = isPlus ? null : user?.monthlyApplicationCount || 0
  const quotaLimit = 1

  // Get applications with job details
  const applicationsList = await applications
    .aggregate([
      { $match: { volunteerId: userId } },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "ngoId",
          foreignField: "_id",
          as: "ngo"
        }
      },
      { $unwind: "$job" },
      { $unwind: "$ngo" },
      { $sort: { createdAt: -1 } },
      { $limit: 10 }
    ])
    .toArray()

  // Get stats
  const totalApplications = await applications.countDocuments({ volunteerId: userId })
  const pendingApplications = await applications.countDocuments({ 
    volunteerId: userId, 
    status: { $in: ["applied", "review"] } 
  })
  const acceptedApplications = await applications.countDocuments({ 
    volunteerId: userId, 
    status: "offered" 
  })
  const rejectedApplications = await applications.countDocuments({ 
    volunteerId: userId, 
    status: "rejected" 
  })

  // Prepare chart data
  const statusData = [
    { name: "Pending", value: pendingApplications, color: "#3B82F6" },
    { name: "Accepted", value: acceptedApplications, color: "#10B981" },
    { name: "Rejected", value: rejectedApplications, color: "#EF4444" },
  ].filter(item => item.value > 0)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name || "Volunteer"}!
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/jobs">
              <Plus className="h-4 w-4 mr-2" />
              Find Jobs
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/volunteer/applications">
              View All Applications
              <ExternalLink className="h-4 w-4 ml-2" />
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
                <h3 className="font-medium text-amber-900">Free Plan</h3>
                <p className="text-sm text-amber-700">
                  {monthlyQuota}/{quotaLimit} applications used this month
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <Progress value={monthlyQuota ? (monthlyQuota / quotaLimit) * 100 : 0} className="h-2" />
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
          title="Total Applications"
          value={totalApplications}
          description="All time applications"
          icon={FileText}
          trend={totalApplications > 0 ? { value: 12, label: "from last month", isPositive: true } : undefined}
        />
        <StatsCard
          title="Pending Review"
          value={pendingApplications}
          description="Awaiting response"
          icon={Clock}
        />
        <StatsCard
          title="Accepted Offers"
          value={acceptedApplications}
          description="Successful applications"
          icon={CheckCircle}
          trend={acceptedApplications > 0 ? { value: 8, label: "from last month", isPositive: true } : undefined}
        />
        <StatsCard
          title="This Month"
          value={monthlyQuota || 0}
          description={`${isPlus ? "Unlimited" : `${quotaLimit} limit`} applications`}
          icon={TrendingUp}
        />
      </div>

      {/* Charts and Recent Applications */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Application Status Chart */}
        <div className="lg:col-span-1">
          {statusData.length > 0 ? (
            <PieChart
              data={statusData}
              title="Application Status"
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No applications yet</p>
                <Button asChild className="mt-4">
                  <Link href="/jobs">Start Applying</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applicationsList.length > 0 ? (
                <div className="space-y-4">
                  {applicationsList.map((app) => (
                    <div key={app._id.toString()} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{app.job.title}</h3>
                          <Badge 
                            variant={
                              app.status === "offered" ? "default" :
                              app.status === "rejected" ? "destructive" :
                              "secondary"
                            }
                          >
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{app.ngo.orgName || app.ngo.name}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/volunteer/applications`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your volunteering journey by applying to jobs
                  </p>
                  <Button asChild>
                    <Link href="/jobs">Browse Jobs</Link>
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
              <Link href="/jobs">
                <FileText className="h-6 w-6 mb-2" />
                Browse Jobs
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/dashboard/volunteer/applications">
                <Clock className="h-6 w-6 mb-2" />
                My Applications
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/dashboard/volunteer/profile">
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


