import { requireAdmin } from "@/lib/admin-auth"
import clientPromise from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  FileText,
  Download
} from "lucide-react"
import { LineChart } from "@/components/charts/line-chart"
import { BarChart } from "@/components/charts/bar-chart"

export default async function AdminAnalyticsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  await requireAdmin()
  
  const params = await searchParams
  const period = params.period || "30" // days

  const client = await clientPromise
  const db = client.db()

  const days = parseInt(period)
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // User Growth Over Time
  const userGrowth = await db
    .collection("users")
    .aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: days }
    ])
    .toArray()

  // Job Postings Over Time
  const jobGrowth = await db
    .collection("jobs")
    .aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: days }
    ])
    .toArray()

  // Applications Over Time
  const applicationGrowth = await db
    .collection("applications")
    .aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: days }
    ])
    .toArray()

  // Revenue Over Time
  const revenueGrowth = await db
    .collection("orders")
    .aggregate([
      {
        $match: {
          status: "paid",
          paidAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: days }
    ])
    .toArray()

  // User Distribution by Role
  const usersByRole = await db
    .collection("users")
    .aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ])
    .toArray()

  // Jobs by Category
  const jobsByCategory = await db
    .collection("jobs")
    .aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
    .toArray()

  // Application Status Distribution
  const applicationsByStatus = await db
    .collection("applications")
    .aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ])
    .toArray()

  // Top NGOs by Job Postings
  const topNGOs = await db
    .collection("jobs")
    .aggregate([
      {
        $group: {
          _id: "$ngoId",
          jobCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "ngo"
        }
      },
      {
        $addFields: {
          ngo: { $arrayElemAt: ["$ngo", 0] }
        }
      },
      { $sort: { jobCount: -1 } },
      { $limit: 10 }
    ])
    .toArray()

  // Overall Statistics
  const stats = await db
    .collection("users")
    .aggregate([
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          totalNGOs: [
            { $match: { role: "ngo" } },
            { $count: "count" }
          ],
          totalVolunteers: [
            { $match: { role: "volunteer" } },
            { $count: "count" }
          ],
          verifiedNGOs: [
            { $match: { role: "ngo", verified: true } },
            { $count: "count" }
          ]
        }
      }
    ])
    .toArray()

  const jobStats = await db.collection("jobs").countDocuments()
  const applicationStats = await db.collection("applications").countDocuments()
  const totalRevenue = await db
    .collection("orders")
    .aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    .toArray()

  const statistics = {
    totalUsers: stats[0]?.totalUsers[0]?.count || 0,
    totalNGOs: stats[0]?.totalNGOs[0]?.count || 0,
    totalVolunteers: stats[0]?.totalVolunteers[0]?.count || 0,
    verifiedNGOs: stats[0]?.verifiedNGOs[0]?.count || 0,
    totalJobs: jobStats,
    totalApplications: applicationStats,
    totalRevenue: totalRevenue[0]?.total || 0
  }

  // Format data for charts
  const userGrowthData = userGrowth.map(d => ({ name: d._id, value: d.count }))
  const jobGrowthData = jobGrowth.map(d => ({ name: d._id, value: d.count }))
  const applicationGrowthData = applicationGrowth.map(d => ({ name: d._id, value: d.count }))
  const revenueGrowthData = revenueGrowth.map(d => ({ name: d._id, value: d.total }))
  const roleData = usersByRole.map(d => ({ name: d._id || "Unknown", value: d.count }))
  const categoryData = jobsByCategory.map(d => ({ name: d._id || "Other", value: d.count }))
  const statusData = applicationsByStatus.map(d => ({ name: d._id || "Unknown", value: d.count }))

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Detailed insights and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`/admin/analytics?period=7`}>7 Days</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`/admin/analytics?period=30`}>30 Days</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`/admin/analytics?period=90`}>90 Days</a>
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics.totalNGOs} NGOs · {statistics.totalVolunteers} Volunteers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{statistics.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <Tabs defaultValue="users" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Over Time</CardTitle>
              <CardDescription>
                New user registrations in the last {days} days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <LineChart 
                data={userGrowthData} 
                lines={[{ dataKey: "value", stroke: "hsl(var(--primary))" }]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Job Postings Over Time</CardTitle>
              <CardDescription>
                New jobs posted in the last {days} days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <LineChart 
                data={jobGrowthData} 
                lines={[{ dataKey: "value", stroke: "hsl(var(--primary))" }]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Applications Over Time</CardTitle>
              <CardDescription>
                New applications submitted in the last {days} days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <LineChart 
                data={applicationGrowthData} 
                lines={[{ dataKey: "value", stroke: "hsl(var(--primary))" }]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Revenue generated in the last {days} days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <LineChart 
                data={revenueGrowthData} 
                lines={[{ dataKey: "value", stroke: "hsl(var(--primary))" }]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart 
              data={roleData} 
              bars={[{ dataKey: "value", fill: "hsl(var(--primary))" }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jobs by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart 
              data={categoryData} 
              bars={[{ dataKey: "value", fill: "hsl(var(--primary))" }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart 
              data={statusData} 
              bars={[{ dataKey: "value", fill: "hsl(var(--primary))" }]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Top NGOs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top NGOs by Job Postings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topNGOs.map((ngo: any, index: number) => (
              <div
                key={ngo._id.toString()}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-lg">
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">
                      {ngo.ngo?.orgName || ngo.ngo?.name || ngo.ngo?.email || "Unknown"}
                    </p>
                    {ngo.ngo?.verified && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{ngo.jobCount}</p>
                  <p className="text-xs text-muted-foreground">jobs posted</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
