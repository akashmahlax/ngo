import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/lib/admin-auth"
import { getCollections } from "@/lib/models"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  UserCheck,
  Ban,
  Trash2,
  Search,
  Shield,
  Mail,
  Calendar
} from "lucide-react"
import Link from "next/link"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { role?: string; search?: string; status?: string }
}) {
  const authResult = await checkAdminAuth()
  
  if (!authResult.authorized) {
    redirect("/signin")
  }

  const { users } = await getCollections()

  // Build query
  const query: any = {}
  
  if (searchParams.role && searchParams.role !== "all") {
    query.role = searchParams.role
  }
  
  if (searchParams.status === "banned") {
    query.banned = true
  } else if (searchParams.status === "verified") {
    query.verified = true
  }
  
  if (searchParams.search) {
    query.$or = [
      { email: { $regex: searchParams.search, $options: "i" } },
      { name: { $regex: searchParams.search, $options: "i" } },
      { orgName: { $regex: searchParams.search, $options: "i" } }
    ]
  }

  // Get users
  const allUsers = await users
    .find(query)
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray()

  // Get counts
  const totalUsers = await users.countDocuments()
  const totalVolunteers = await users.countDocuments({ role: "volunteer" })
  const totalNGOs = await users.countDocuments({ role: "ngo" })
  const bannedUsers = await users.countDocuments({ banned: true })
  const verifiedNGOs = await users.countDocuments({ role: "ngo", verified: true })

  const currentRole = searchParams.role || "all"

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage all platform users
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
          <Link href="/admin">
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl">{totalUsers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Volunteers</CardDescription>
            <CardTitle className="text-2xl">{totalVolunteers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>NGOs</CardDescription>
            <CardTitle className="text-2xl">{totalNGOs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Verified NGOs</CardDescription>
            <CardTitle className="text-2xl">{verifiedNGOs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Banned</CardDescription>
            <CardTitle className="text-2xl text-red-600">{bannedUsers}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1">
              <form action="/admin/users" method="get" className="flex flex-col sm:flex-row gap-2">
                <Input
                  name="search"
                  placeholder="Search users..."
                  defaultValue={searchParams.search}
                  className="flex-1"
                />
                <input type="hidden" name="role" value={currentRole} />
                <Button type="submit" className="w-full sm:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant={currentRole === "all" ? "default" : "outline"} size="sm" className="flex-1 sm:flex-initial">
                <Link href="/admin/users?role=all">All</Link>
              </Button>
              <Button asChild variant={currentRole === "volunteer" ? "default" : "outline"} size="sm" className="flex-1 sm:flex-initial">
                <Link href="/admin/users?role=volunteer">Volunteers</Link>
              </Button>
              <Button asChild variant={currentRole === "ngo" ? "default" : "outline"} size="sm" className="flex-1 sm:flex-initial">
                <Link href="/admin/users?role=ngo">NGOs</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Users ({allUsers.length})</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {searchParams.search ? `Search results for "${searchParams.search}"` : "All users"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {allUsers.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-sm sm:text-base text-muted-foreground">
                No users found
              </div>
            ) : (
              allUsers.map((user) => (
                <div key={user._id.toString()} className="flex flex-col sm:flex-row items-start justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h4 className="font-medium text-sm sm:text-base truncate">
                        {user.role === "ngo" ? user.orgName : user.name || "No name"}
                      </h4>
                      <Badge variant={user.role === "ngo" ? "default" : "secondary"} className="text-xs">
                        {user.role}
                      </Badge>
                      {user.verified && (
                        <Badge variant="outline" className="text-green-600 text-xs">
                          <UserCheck className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Verified</span>
                          <span className="sm:hidden">✓</span>
                        </Badge>
                      )}
                      {user.banned && (
                        <Badge variant="destructive" className="text-xs">
                          <Ban className="h-3 w-3 mr-1" />
                          Banned
                        </Badge>
                      )}
                      {user.plan?.includes("plus") && (
                        <Badge variant="outline" className="text-amber-600 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Plus
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 sm:gap-0 sm:flex-row sm:items-center text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </span>
                      <span className="hidden sm:inline mx-2">·</span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="hidden sm:inline">Joined </span>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      {user.lastLoginAt && (
                        <>
                          <span className="hidden sm:inline mx-2">·</span>
                          <span className="whitespace-nowrap">
                            <span className="hidden sm:inline">Last login </span>
                            <span className="sm:hidden">Last: </span>
                            {new Date(user.lastLoginAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    {user.bio && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-4">
                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                      <Link href={`/admin/users/${user._id}`}>
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
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
