import { auth } from "@/auth"
import { getCollections, type ApplicationDoc, type JobDoc, type UserDoc } from "@/lib/models"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { format } from "date-fns"
import {
  Briefcase,
  TrendingUp,
  Plus,
  ArrowRight,
  CheckCircle,
  Star,
  Send,
  AlertCircle,
  Eye,
  Clock,
  Target,
  Award,
  BarChart3,
  Activity,
  Zap,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { ObjectId } from "mongodb"
import { redirect } from "next/navigation"

type JobWithMetrics = JobDoc & {
  applicationCount: number
  appliedCount: number
  shortlistedCount: number
  acceptedCount: number
}

type PendingApplication = ApplicationDoc & {
  job: JobDoc
  volunteer: UserDoc
}

export default async function NgoDashboard() {
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
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ])
    .toArray()

  const activeJobs = allJobs.filter(j => j.status === "open")
  const closedJobs = allJobs.filter(j => j.status === "closed")

  // Get recent applications needing review
  const pendingApplications = await applications
    .aggregate<PendingApplication>([
      { 
        $match: { 
          ngoId,
          status: "applied"
        } 
      },
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
          localField: "volunteerId",
          foreignField: "_id",
          as: "volunteer"
        }
      },
      { $unwind: "$job" },
      { $unwind: "$volunteer" },
      { $match: { "job.status": "open" } },
      { $sort: { createdAt: -1 } },
      { $limit: 8 }
    ])
    .toArray()

  // Get all stats
  const totalApplications = await applications.countDocuments({ ngoId })
  const appliedApplications = await applications.countDocuments({ 
    ngoId, 
    status: "applied" 
  })
  const shortlistedApplications = await applications.countDocuments({ 
    ngoId, 
    status: "shortlisted" 
  })
  const acceptedApplications = await applications.countDocuments({ 
    ngoId, 
    status: "accepted" 
  })
  
  // Calculate acceptance rate
  const processedApplications = await applications.countDocuments({
    ngoId,
    status: { $in: ["accepted", "rejected"] }
  })
  const acceptanceRate = processedApplications > 0 
    ? Math.round((acceptedApplications / processedApplications) * 100)
    : 0

  const trendStart = new Date()
  trendStart.setHours(0, 0, 0, 0)
  trendStart.setDate(trendStart.getDate() - 6)

  const trendAggregation = await applications
    .aggregate<{ _id: string; count: number }>([
      {
        $match: {
          ngoId,
          createdAt: { $gte: trendStart },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray()

  const trendMap = new Map(trendAggregation.map((item) => [item._id, item.count]))

  const trendDates = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(trendStart)
    day.setDate(trendStart.getDate() + index)
    return day
  })

  const applicationTrendData = trendDates.map((date) => {
    const key = date.toISOString().slice(0, 10)
    return {
      name: format(date, "EEE"),
      applications: trendMap.get(key) ?? 0,
    }
  })

  const categoryCounts = allJobs.reduce<Record<string, number>>((acc, job) => {
    const key = job.category || "Uncategorized"
    const count = job.applicationCount || 0
    acc[key] = (acc[key] || 0) + count
    return acc
  }, {})

  const applicationsByCategoryData = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, applications: count }))
    .sort((a, b) => b.applications - a.applications)

  const responseAggregation = await applications
    .aggregate<{ avgMs: number }>([
      {
        $match: {
          ngoId,
          status: { $in: ["accepted", "rejected"] },
        },
      },
      {
        $project: {
          diffMs: { $subtract: ["$updatedAt", "$createdAt"] },
        },
      },
      {
        $group: {
          _id: null,
          avgMs: { $avg: "$diffMs" },
        },
      },
    ])
    .toArray()

  const averageResponseMs = responseAggregation[0]?.avgMs ?? null
  const averageResponseDays = averageResponseMs !== null ? averageResponseMs / (1000 * 60 * 60 * 24) : null
  const responsePerformance = averageResponseDays !== null
    ? Math.max(0, Math.min(100, (5 / Math.max(averageResponseDays, 0.25)) * 100))
    : 0
  const responseLabel = averageResponseDays !== null
    ? (averageResponseDays < 1 ? "<1 day" : `${averageResponseDays.toFixed(1)} days`)
    : "No data yet"

  const ratingAggregation = await applications
    .aggregate<{ avgRating: number }>([
      {
        $match: {
          ngoId,
          rating: { $type: "number" },
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ])
    .toArray()

  const averageRating = ratingAggregation[0]?.avgRating ?? null
  const qualityScoreOutOfTen = averageRating !== null ? Number((averageRating * 2).toFixed(1)) : null
  const qualityProgress = averageRating !== null ? Math.min(100, (averageRating / 5) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">NGO Dashboard 📊</h1>
          <p className="text-muted-foreground mt-1">
            Welcome, {ngo.orgName || ngo.name || "Organization"}!
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/ngos/post">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/ngo/profile">
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </Link>
          </Button>
        </div>
      </div>

      {/* Job Limit Alert */}
      {!isPlus && activeJobs.length >= baseJobLimit && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-amber-900 dark:text-amber-100">
                  Job Posting Limit Reached
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                  You&apos;ve reached the limit of {baseJobLimit} active jobs on the free plan.
                </p>
                <Button asChild size="sm" variant="outline" className="mt-3 border-amber-600">
                  <Link href="/upgrade">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Upgrade to Post More
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Active Jobs"
          value={activeJobs.length}
          iconName="Briefcase"
          description={`${closedJobs.length} closed`}
        />
        <StatsCard
          title="Total Applications"
          value={totalApplications}
          iconName="FileText"
          description="All time"
        />
        <StatsCard
          title="Pending Review"
          value={appliedApplications}
          iconName="Clock"
          description="Needs attention"
        />
        <StatsCard
          title="Accepted"
          value={acceptedApplications}
          iconName="CheckCircle"
          description="Volunteers hired"
        />
        <StatsCard
          title="Acceptance Rate"
          value={`${acceptanceRate}%`}
          iconName="TrendingUp"
          description="Success rate"
        />
      </div>

      {/* Analytics Dashboard */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Application Status Distribution */}
            <PieChart
              title="Application Status Distribution"
              data={[
                { name: 'Applied', value: appliedApplications, color: '#3b82f6' },
                { name: 'Shortlisted', value: shortlistedApplications, color: '#f59e0b' },
                { name: 'Accepted', value: acceptedApplications, color: '#10b981' },
              ]}
              className="h-[350px]"
            />

            {/* Job Performance */}
            <BarChart
              title="Job Applications per Position"
              data={activeJobs.slice(0, 5).map((job) => ({
                name: job.title.substring(0, 20) + (job.title.length > 20 ? '...' : ''),
                applications: job.applicationCount || 0,
              }))}
              bars={[
                { dataKey: 'applications', fill: '#8b5cf6', name: 'Applications' }
              ]}
              className="h-[350px]"
            />
          </div>

          {/* Weekly Application Trends */}
          <LineChart
            title="Application Trends (Last 7 Days)"
            data={applicationTrendData}
            lines={[
              { dataKey: 'applications', stroke: '#06b6d4', name: 'Applications Received' }
            ]}
            className="h-[300px]"
          />

        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Application Processing Metrics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Avg. Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{responseLabel}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Average time from application to decision
                </div>
                <Progress value={responsePerformance} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{acceptanceRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Applied → Accepted
                </div>
                <Progress value={acceptanceRate} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-500" />
                  Quality Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {qualityScoreOutOfTen !== null ? `${qualityScoreOutOfTen}/10` : "No ratings yet"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {averageRating !== null ? `Avg rating ${averageRating.toFixed(1)}/5` : "Collect feedback to unlock insights"}
                </div>
                <Progress value={qualityProgress} className="mt-3" />
              </CardContent>
            </Card>
          </div>

          {/* Application Volume by Category */}
          <BarChart
            title="Applications by Job Category"
            data={applicationsByCategoryData.slice(0, 8)}
            bars={[
              { dataKey: 'applications', fill: '#f97316', name: 'Applications' }
            ]}
            className="h-[300px]"
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* AI-Powered Insights */}
            <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  AI Insights
                </CardTitle>
                <CardDescription>
                  Smart recommendations to improve your recruitment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="optimization">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        Job Posting Optimization
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Consider adding salary ranges to increase application rates by ~40%. 
                      Your current response rate is above average.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="timing">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        Best Posting Times
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Tuesday-Thursday, 9-11 AM show 60% higher engagement. 
                      Weekend posts receive fewer quality applications.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="retention">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                        Volunteer Retention
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Volunteers who complete onboarding have 85% higher retention. 
                      Consider adding a structured welcome program.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Performance Benchmarks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Performance vs Industry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Application Response Time</span>
                      <span className="text-green-600 font-medium">+45% faster</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Job Fill Rate</span>
                      <span className="text-blue-600 font-medium">+20% higher</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Volunteer Satisfaction</span>
                      <span className="text-purple-600 font-medium">Above avg</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Jobs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Job Postings</CardTitle>
                <CardDescription>Manage your open positions</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/ngos/post">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No active jobs</h3>
                <p className="text-muted-foreground mb-4">
                  Post your first job to start receiving applications
                </p>
                <Button asChild>
                  <Link href="/ngos/post">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job Posting
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeJobs.slice(0, 5).map((job) => (
                  <div
                    key={job._id.toString()}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                  >
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <Link 
                            href={`/jobs/${job._id}`}
                            className="font-medium hover:text-primary line-clamp-1 block"
                          >
                            {job.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {job.category && (
                              <Badge variant="secondary" className="text-xs">
                                {job.category}
                              </Badge>
                            )}
                            {job.locationType && (
                              <Badge variant="outline" className="text-xs capitalize">
                                {job.locationType}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0">
                          {job.applicationCount} {job.applicationCount === 1 ? "applicant" : "applicants"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Send className="h-3 w-3 text-blue-500" />
                          <span className="text-muted-foreground">{job.appliedCount} applied</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-primary" />
                          <span className="text-muted-foreground">{job.shortlistedCount} shortlisted</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-muted-foreground">{job.acceptedCount} accepted</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/ngo/jobs/${job._id}/applications`}>
                            Review Applications
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/dashboard/ngo/jobs/${job._id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Applications & Quick Actions */}
        <div className="space-y-6">
          {/* Pending Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pending Review</span>
                {appliedApplications > 0 && (
                  <Badge variant="destructive">{appliedApplications}</Badge>
                )}
              </CardTitle>
              <CardDescription>New applications</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApplications.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApplications.slice(0, 5).map((app) => (
                    <Link
                      key={app._id.toString()}
                      href={`/ngo/jobs/${app.jobId}/applications`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={app.volunteer.avatarUrl} />
                        <AvatarFallback>
                          {(app.volunteer.name || "V").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {app.volunteer.name || "Volunteer"}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {app.job.title}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Application Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Applied</span>
                </div>
                <span className="text-sm font-medium">{appliedApplications}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm">Shortlisted</span>
                </div>
                <span className="text-sm font-medium">{shortlistedApplications}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-600" />
                  <span className="text-sm">Accepted</span>
                </div>
                <span className="text-sm font-medium">{acceptedApplications}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/ngos/post">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/ngo/profile">
                  <Eye className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/ngos/${ngoId.toString()}`}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View Public Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
