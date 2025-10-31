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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all platform users
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
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <form action="/admin/users" method="get" className="flex gap-2">
                <Input
                  name="search"
                  placeholder="Search by email, name, or organization..."
                  defaultValue={searchParams.search}
                  className="flex-1"
                />
                <input type="hidden" name="role" value={currentRole} />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>
            <div className="flex gap-2">
              <Button asChild variant={currentRole === "all" ? "default" : "outline"} size="sm">
                <Link href="/admin/users?role=all">All</Link>
              </Button>
              <Button asChild variant={currentRole === "volunteer" ? "default" : "outline"} size="sm">
                <Link href="/admin/users?role=volunteer">Volunteers</Link>
              </Button>
              <Button asChild variant={currentRole === "ngo" ? "default" : "outline"} size="sm">
                <Link href="/admin/users?role=ngo">NGOs</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({allUsers.length})</CardTitle>
          <CardDescription>
            {searchParams.search ? `Search results for "${searchParams.search}"` : "All users"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No users found
              </div>
            ) : (
              allUsers.map((user) => (
                <div key={user._id.toString()} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h4 className="font-medium truncate">
                        {user.role === "ngo" ? user.orgName : user.name || "No name"}
                      </h4>
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
                        <Badge variant="destructive">
                          <Ban className="h-3 w-3 mr-1" />
                          Banned
                        </Badge>
                      )}
                      {user.plan?.includes("plus") && (
                        <Badge variant="outline" className="text-amber-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Plus
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      <span className="hidden sm:inline">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      {user.lastLoginAt && (
                        <>
                          <span className="hidden sm:inline">·</span>
                          <span>
                            Last login {new Date(user.lastLoginAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    {user.bio && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/users/${user._id}`}>
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
