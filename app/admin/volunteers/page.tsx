import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/lib/admin-auth"
import { getCollections } from "@/lib/models"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  UserCheck,
  Ban,
  Search,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  Star
} from "lucide-react"
import Link from "next/link"

export default async function AdminVolunteersPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string }
}) {
  const authResult = await checkAdminAuth()
  
  if (!authResult.authorized) {
    redirect("/signin")
  }

  const { users, applications } = await getCollections()

  // Build query
  const query: any = { role: "volunteer" }
  
  if (searchParams.status === "banned") {
    query.banned = true
  } else if (searchParams.status === "active") {
    query.banned = { $ne: true }
  }
  
  if (searchParams.search) {
    query.$or = [
      { email: { $regex: searchParams.search, $options: "i" } },
      { name: { $regex: searchParams.search, $options: "i" } },
      { title: { $regex: searchParams.search, $options: "i" } }
    ]
  }

  // Get volunteers
  const volunteers = await users
    .find(query)
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray()

  // Get stats for each volunteer
  const volunteersWithStats = await Promise.all(
    volunteers.map(async (volunteer) => {
      const totalApplications = await applications.countDocuments({ 
        volunteerId: volunteer._id 
      })
      const acceptedApplications = await applications.countDocuments({ 
        volunteerId: volunteer._id, 
        status: "accepted" 
      })
      
      return {
        ...volunteer,
        stats: {
          totalApplications,
          acceptedApplications,
        }
      }
    })
  )

  // Get overall counts
  const totalVolunteers = await users.countDocuments({ role: "volunteer" })
  const activeVolunteers = await users.countDocuments({ 
    role: "volunteer", 
    banned: { $ne: true } 
  })
  const bannedVolunteers = await users.countDocuments({ 
    role: "volunteer", 
    banned: true 
  })
  const plusVolunteers = await users.countDocuments({ 
    role: "volunteer", 
    plan: "volunteer_plus" 
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Volunteer Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage volunteer accounts and activity
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/users">
            All Users
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Volunteers</CardDescription>
            <CardTitle className="text-2xl">{totalVolunteers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-2xl text-green-600">{activeVolunteers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Plus Members</CardDescription>
            <CardTitle className="text-2xl text-amber-600">{plusVolunteers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Banned</CardDescription>
            <CardTitle className="text-2xl text-red-600">{bannedVolunteers}</CardTitle>
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
              <form action="/admin/volunteers" method="get" className="flex gap-2">
                <Input
                  name="search"
                  placeholder="Search by name, email, or title..."
                  defaultValue={searchParams.search}
                  className="flex-1"
                />
                {searchParams.status && (
                  <input type="hidden" name="status" value={searchParams.status} />
                )}
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>
            <div className="flex gap-2">
              <Button 
                asChild 
                variant={!searchParams.status ? "default" : "outline"} 
                size="sm"
              >
                <Link href="/admin/volunteers">All</Link>
              </Button>
              <Button 
                asChild 
                variant={searchParams.status === "active" ? "default" : "outline"} 
                size="sm"
              >
                <Link href="/admin/volunteers?status=active">Active</Link>
              </Button>
              <Button 
                asChild 
                variant={searchParams.status === "banned" ? "default" : "outline"} 
                size="sm"
              >
                <Link href="/admin/volunteers?status=banned">Banned</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers List */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteers ({volunteersWithStats.length})</CardTitle>
          <CardDescription>
            {searchParams.search 
              ? `Search results for "${searchParams.search}"` 
              : "All registered volunteers"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {volunteersWithStats.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No volunteers found</p>
              </div>
            ) : (
              volunteersWithStats.map((volunteer) => (
                <div 
                  key={volunteer._id.toString()} 
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={volunteer.avatarUrl} />
                      <AvatarFallback>
                        {volunteer.name?.charAt(0)?.toUpperCase() || "V"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium truncate">
                          {volunteer.name || "No name"}
                        </h4>
                        {volunteer.banned && (
                          <Badge variant="destructive">
                            <Ban className="h-3 w-3 mr-1" />
                            Banned
                          </Badge>
                        )}
                        {volunteer.plan === "volunteer_plus" && (
                          <Badge variant="outline" className="text-amber-600">
                            Plus
                          </Badge>
                        )}
                        {volunteer.rating && (
                          <Badge variant="outline" className="text-yellow-600">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {volunteer.rating.toFixed(1)}
                          </Badge>
                        )}
                      </div>

                      {volunteer.title && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-3 w-3" />
                          <span>{volunteer.title}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {volunteer.email}
                        </span>
                        {volunteer.location && (
                          <>
                            <span className="hidden sm:inline">·</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {volunteer.location}
                            </span>
                          </>
                        )}
                        <span className="hidden sm:inline">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {new Date(volunteer.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {volunteer.skills && volunteer.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills.slice(0, 5).map((skill: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {volunteer.skills.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{volunteer.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {volunteer.stats && (
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Applications: <span className="font-medium text-foreground">
                              {volunteer.stats.totalApplications}
                            </span>
                          </span>
                          <span className="text-muted-foreground">
                            Accepted: <span className="font-medium text-green-600">
                              {volunteer.stats.acceptedApplications}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/users/${volunteer._id}`}>
                        View Details
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
