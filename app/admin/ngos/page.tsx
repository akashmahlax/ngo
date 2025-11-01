import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/lib/admin-auth"
import { getCollections } from "@/lib/models"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Building2, 
  UserCheck,
  Ban,
  Search,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  Globe,
  Shield
} from "lucide-react"
import Link from "next/link"

export default async function AdminNGOsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string }
}) {
  const authResult = await checkAdminAuth()
  
  if (!authResult.authorized) {
    redirect("/signin")
  }

  const { users, jobs } = await getCollections()

  // Build query
  const query: any = { role: "ngo" }
  
  if (searchParams.status === "verified") {
    query.verified = true
  } else if (searchParams.status === "unverified") {
    query.verified = { $ne: true }
  } else if (searchParams.status === "banned") {
    query.banned = true
  }
  
  if (searchParams.search) {
    query.$or = [
      { email: { $regex: searchParams.search, $options: "i" } },
      { orgName: { $regex: searchParams.search, $options: "i" } },
      { description: { $regex: searchParams.search, $options: "i" } }
    ]
  }

  // Get NGOs
  const ngos = await users
    .find(query)
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray()

  // Get stats for each NGO
  const ngosWithStats = await Promise.all(
    ngos.map(async (ngo) => {
      const totalJobs = await jobs.countDocuments({ ngoId: ngo._id })
      const activeJobs = await jobs.countDocuments({ 
        ngoId: ngo._id, 
        status: "open" 
      })
      
      return {
        ...ngo,
        stats: {
          totalJobs,
          activeJobs,
        }
      }
    })
  )

  // Get overall counts
  const totalNGOs = await users.countDocuments({ role: "ngo" })
  const verifiedNGOs = await users.countDocuments({ 
    role: "ngo", 
    verified: true 
  })
  const bannedNGOs = await users.countDocuments({ 
    role: "ngo", 
    banned: true 
  })
  const plusNGOs = await users.countDocuments({ 
    role: "ngo", 
    plan: "ngo_plus" 
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            NGO Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage NGO organizations and verification
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
            <CardDescription>Total NGOs</CardDescription>
            <CardTitle className="text-2xl">{totalNGOs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Verified</CardDescription>
            <CardTitle className="text-2xl text-green-600">{verifiedNGOs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Plus Members</CardDescription>
            <CardTitle className="text-2xl text-amber-600">{plusNGOs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Banned</CardDescription>
            <CardTitle className="text-2xl text-red-600">{bannedNGOs}</CardTitle>
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
              <form action="/admin/ngos" method="get" className="flex gap-2">
                <Input
                  name="search"
                  placeholder="Search by name, email, or description..."
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
                <Link href="/admin/ngos">All</Link>
              </Button>
              <Button 
                asChild 
                variant={searchParams.status === "verified" ? "default" : "outline"} 
                size="sm"
              >
                <Link href="/admin/ngos?status=verified">Verified</Link>
              </Button>
              <Button 
                asChild 
                variant={searchParams.status === "unverified" ? "default" : "outline"} 
                size="sm"
              >
                <Link href="/admin/ngos?status=unverified">Unverified</Link>
              </Button>
              <Button 
                asChild 
                variant={searchParams.status === "banned" ? "default" : "outline"} 
                size="sm"
              >
                <Link href="/admin/ngos?status=banned">Banned</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NGOs List */}
      <Card>
        <CardHeader>
          <CardTitle>Organizations ({ngosWithStats.length})</CardTitle>
          <CardDescription>
            {searchParams.search 
              ? `Search results for "${searchParams.search}"` 
              : "All registered NGOs"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ngosWithStats.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No NGOs found</p>
              </div>
            ) : (
              ngosWithStats.map((ngo) => (
                <div 
                  key={ngo._id.toString()} 
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={ngo.logoUrl} />
                      <AvatarFallback>
                        {ngo.orgName?.charAt(0)?.toUpperCase() || "N"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium truncate">
                          {ngo.orgName || "No name"}
                        </h4>
                        {ngo.verified && (
                          <Badge variant="outline" className="text-green-600">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {ngo.banned && (
                          <Badge variant="destructive">
                            <Ban className="h-3 w-3 mr-1" />
                            Banned
                          </Badge>
                        )}
                        {ngo.plan === "ngo_plus" && (
                          <Badge variant="outline" className="text-amber-600">
                            <Shield className="h-3 w-3 mr-1" />
                            Plus
                          </Badge>
                        )}
                      </div>

                      {ngo.orgType && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span>{ngo.orgType}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {ngo.email}
                        </span>
                        {ngo.location && (
                          <>
                            <span className="hidden sm:inline">·</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {ngo.location}
                            </span>
                          </>
                        )}
                        <span className="hidden sm:inline">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {new Date(ngo.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {ngo.website && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Globe className="h-3 w-3" />
                          <a 
                            href={ngo.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline truncate"
                          >
                            {ngo.website}
                          </a>
                        </div>
                      )}

                      {ngo.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {ngo.description}
                        </p>
                      )}

                      {ngo.focusAreas && ngo.focusAreas.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ngo.focusAreas.slice(0, 5).map((area: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {ngo.focusAreas.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{ngo.focusAreas.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {ngo.stats && (
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Jobs Posted: <span className="font-medium text-foreground">
                              {ngo.stats.totalJobs}
                            </span>
                          </span>
                          <span className="text-muted-foreground">
                            Active: <span className="font-medium text-green-600">
                              {ngo.stats.activeJobs}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/users/${ngo._id}`}>
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
