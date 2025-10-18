import { auth } from "@/auth"
import { getCollections } from "@/lib/models"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {  
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Send,
  TrendingUp,
  FileText,
  User,
  ArrowRight,
  AlertCircle,
  Star,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { ObjectId } from "mongodb"
import { redirect } from "next/navigation"

export default async function VolunteerDashboard() {
  const session = await auth()
  if (!session?.user) redirect("/signin")

  const { applications, users, jobs } = await getCollections()
  const userId = new ObjectId((session as any).userId)
  
  // Get user data
  const user = await users.findOne({ _id: userId })
  if (!user) redirect("/signin")

  const isPlus = (session as any).plan?.includes("plus")
  const monthlyQuota = user.monthlyApplicationCount || 0
  const quotaLimit = 1

  // Calculate profile completion
  const profileFields = [
    user.name,
    user.bio,
    user.location,
    user.skills?.length,
    user.experience?.length,
    user.education?.length,
    user.avatarUrl,
  ]
  const completedFields = profileFields.filter(Boolean).length
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100)

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
      { $limit: 5 }
    ])
    .toArray()

  // Get stats
  const totalApplications = await applications.countDocuments({ volunteerId: userId })
  const appliedCount = await applications.countDocuments({ 
    volunteerId: userId, 
    status: "applied" 
  })
  const shortlistedCount = await applications.countDocuments({ 
    volunteerId: userId, 
    status: "shortlisted" 
  })
  const acceptedCount = await applications.countDocuments({ 
    volunteerId: userId, 
    status: "accepted" 
  })
  const rejectedCount = await applications.countDocuments({ 
    volunteerId: userId, 
    status: "rejected" 
  })

  // Get total available jobs
  const totalJobs = await jobs.countDocuments({ status: "open" })

  // Status helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge variant="secondary" className="gap-1"><Send className="h-3 w-3" /> Applied</Badge>
      case "shortlisted":
        return <Badge variant="default" className="gap-1"><Star className="h-3 w-3" /> Shortlisted</Badge>
      case "accepted":
        return <Badge className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Accepted</Badge>
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name || "Volunteer"}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Track your applications and discover new opportunities
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/volunteer/profile">
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {profileCompletion < 80 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-amber-900 dark:text-amber-100">
                  Complete your profile to stand out
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                  Your profile is {profileCompletion}% complete. Add more details to increase your chances of getting selected.
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <Progress value={profileCompletion} className="flex-1 h-2" />
                  <Button asChild size="sm" variant="outline" className="border-amber-600">
                    <Link href="/volunteer/profile">Complete Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Quota */}
      {!isPlus && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Free Plan - Monthly Applications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {monthlyQuota} of {quotaLimit} applications used this month
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <Progress 
                    value={(monthlyQuota / quotaLimit) * 100} 
                    className="h-2" 
                  />
                </div>
                <Button asChild size="sm">
                  <Link href="/upgrade">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Upgrade
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
          title="Total Applications"
          value={totalApplications}
          iconName="FileText"
          description="All time"
        />
        <StatsCard
          title="Under Review"
          value={appliedCount}
          iconName="Clock"
          description="Awaiting response"
        />
        <StatsCard
          title="Shortlisted"
          value={shortlistedCount}
          iconName="Star"
          description="In consideration"
        />
        <StatsCard
          title="Accepted"
          value={acceptedCount}
          iconName="CheckCircle"
          description="Opportunities won"
        />
        <StatsCard
          title="Available Jobs"
          value={totalJobs}
          iconName="Briefcase"
          description="Open positions"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Applications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Track your latest submissions</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/volunteer/applications">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {applicationsList.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start applying to jobs and track your progress here
                </p>
                <Button asChild>
                  <Link href="/jobs">Browse Open Positions</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applicationsList.map((app: any) => (
                  <div
                    key={app._id.toString()}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={app.ngo.avatarUrl} />
                      <AvatarFallback>
                        {(app.ngo.orgName || app.ngo.name || "NGO").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link 
                            href={`/volunteer/applications/${app._id}`}
                            className="font-medium hover:text-primary line-clamp-1"
                          >
                            {app.job.title}
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {app.ngo.orgName || app.ngo.name}
                          </p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                        {app.job.category && (
                          <Badge variant="outline" className="text-xs">
                            {app.job.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Application Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Current breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Applied</span>
                </div>
                <span className="text-sm font-medium">{appliedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm">Shortlisted</span>
                </div>
                <span className="text-sm font-medium">{shortlistedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-600" />
                  <span className="text-sm">Accepted</span>
                </div>
                <span className="text-sm font-medium">{acceptedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-600" />
                  <span className="text-sm">Rejected</span>
                </div>
                <span className="text-sm font-medium">{rejectedCount}</span>
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
                <Link href="/jobs">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse All Jobs
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/volunteer/applications">
                  <FileText className="h-4 w-4 mr-2" />
                  My Applications
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/volunteer/profile">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/volunteers/${userId.toString()}`}>
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
