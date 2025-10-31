import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/lib/admin-auth"
import { getCollections } from "@/lib/models"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Briefcase, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  UserCheck,
  AlertCircle,
  Activity,
  BarChart3
} from "lucide-react"
import Link from "next/link"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart } from "@/components/charts/line-chart"

export default async function AdminDashboard() {
  const authResult = await checkAdminAuth()
  
  if (!authResult.authorized) {
    redirect("/signin")
  }

  const { users, jobs, applications, orders } = await getCollections()

  // Get counts
  const totalUsers = await users.countDocuments()
  const totalVolunteers = await users.countDocuments({ role: "volunteer" })
  const totalNGOs = await users.countDocuments({ role: "ngo" })
  const bannedUsers = await users.countDocuments({ banned: true })
  const verifiedNGOs = await users.countDocuments({ role: "ngo", verified: true })
  
  const totalJobs = await jobs.countDocuments()
  const activeJobs = await jobs.countDocuments({ status: "open" })
  const closedJobs = await jobs.countDocuments({ status: "closed" })
  
  const totalApplications = await applications.countDocuments()
  const pendingApplications = await applications.countDocuments({ status: "applied" })
  const acceptedApplications = await applications.countDocuments({ status: "accepted" })
  
  const totalOrders = await orders.countDocuments()
  const paidOrders = await orders.countDocuments({ status: "paid" })
  const failedOrders = await orders.countDocuments({ status: "failed" })
  
  // Calculate revenue
  const revenueResult = await orders.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]).toArray()
  const totalRevenue = revenueResult[0]?.total || 0
  const revenueInRupees = totalRevenue / 100 // Convert paise to rupees

  // Get recent users
  const recentUsers = await users
    .find()
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray()

  // Get recent jobs
  const recentJobs = await jobs
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "ngoId",
          foreignField: "_id",
          as: "ngo"
        }
      },
      { $unwind: "$ngo" },
      { $sort: { createdAt: -1 } },
      { $limit: 10 }
    ])
    .toArray()

  // Get user growth data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    date.setHours(0, 0, 0, 0)
    return date
  })

  const userGrowthData = await Promise.all(
    last7Days.map(async (date) => {
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      const count = await users.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      })
      return {
        name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count
      }
    })
  )

  // Get job postings data (last 7 days)
  const jobGrowthData = await Promise.all(
    last7Days.map(async (date) => {
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      const count = await jobs.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      })
      return {
        name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count
      }
    })
  )

  // Get revenue data (last 7 days)
  const revenueGrowthData = await Promise.all(
    last7Days.map(async (date) => {
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      const result = await orders.aggregate([
        {
          $match: {
            status: "paid",
            paidAt: { $gte: date, $lt: nextDate }
          }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]).toArray()
      return {
        name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: (result[0]?.total || 0) / 100
      }
    })
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {authResult.admin?.name || authResult.admin?.email}
          </p>
        </div>
        <Badge variant="default" className="text-sm">
          {authResult.admin?.level === "super" ? "Super Admin" : authResult.admin?.level === "moderator" ? "Moderator" : "Support"}
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center justify-between">
              <span>Total Users</span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-3xl">{totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Volunteers:</span>
                <span className="font-medium">{totalVolunteers}</span>
              </div>
              <div className="flex justify-between">
                <span>NGOs:</span>
                <span className="font-medium">{totalNGOs}</span>
              </div>
              <div className="flex justify-between">
                <span>Banned:</span>
                <span className="font-medium text-red-600">{bannedUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center justify-between">
              <span>Jobs Posted</span>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-3xl">{totalJobs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="font-medium text-green-600">{activeJobs}</span>
              </div>
              <div className="flex justify-between">
                <span>Closed:</span>
                <span className="font-medium">{closedJobs}</span>
              </div>
              <div className="flex justify-between">
                <span>Verified NGOs:</span>
                <span className="font-medium">{verifiedNGOs}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center justify-between">
              <span>Applications</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-3xl">{totalApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-medium text-blue-600">{pendingApplications}</span>
              </div>
              <div className="flex justify-between">
                <span>Accepted:</span>
                <span className="font-medium text-green-600">{acceptedApplications}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-medium">
                  {totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center justify-between">
              <span>Revenue</span>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-3xl">₹{revenueInRupees.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Total Orders:</span>
                <span className="font-medium">{totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid:</span>
                <span className="font-medium text-green-600">{paidOrders}</span>
              </div>
              <div className="flex justify-between">
                <span>Failed:</span>
                <span className="font-medium text-red-600">{failedOrders}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>User Growth (Last 7 Days)</CardTitle>
            <CardDescription>New user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={userGrowthData}
              lines={[{ dataKey: "count", stroke: "#0088FE", name: "New Users" }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Postings (Last 7 Days)</CardTitle>
            <CardDescription>New jobs posted</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={jobGrowthData}
              bars={[{ dataKey: "count", fill: "#00C49F", name: "New Jobs" }]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
            <CardDescription>Daily revenue from subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={revenueGrowthData}
              lines={[{ dataKey: "revenue", stroke: "#10b981", name: "Revenue (₹)" }]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Button asChild variant="outline" className="h-auto py-6">
          <Link href="/admin/users">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-6">
          <Link href="/admin/jobs">
            <div className="flex flex-col items-center gap-2">
              <Briefcase className="h-6 w-6" />
              <span>Manage Jobs</span>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-6">
          <Link href="/admin/billing">
            <div className="flex flex-col items-center gap-2">
              <DollarSign className="h-6 w-6" />
              <span>Billing & Payments</span>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-6">
          <Link href="/admin/analytics">
            <div className="flex flex-col items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Analytics</span>
            </div>
          </Link>
        </Button>
      </div>

      {/* Recent Activity Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
          <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
              <CardDescription>Latest users who joined the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user._id.toString()} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{user.name || user.email}</h4>
                        <Badge variant={user.role === "ngo" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                        {user.verified && (
                          <Badge variant="outline" className="text-green-600">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {user.banned && (
                          <Badge variant="destructive">Banned</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {user.email} · Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/users/${user._id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Job Postings</CardTitle>
              <CardDescription>Latest jobs posted by NGOs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.map((job: any) => (
                  <div key={job._id.toString()} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{job.title}</h4>
                        <Badge variant={job.status === "open" ? "default" : "secondary"}>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        By {job.ngo.orgName || job.ngo.name || job.ngo.email} · Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/jobs/${job._id}`}>
                        View Job
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
