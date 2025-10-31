"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Ban,
  Trash2,
  Shield,
  UserCheck,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Link as LinkIcon,
  ArrowLeft,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [userId, setUserId] = useState<string>("")
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [banReason, setBanReason] = useState("")

  useEffect(() => {
    params.then(p => {
      setUserId(p.id)
    })
  }, [params])

  useEffect(() => {
    if (userId) {
      loadUserData()
    }
  }, [userId])

  async function loadUserData() {
    if (!userId) return
    try {
      const res = await fetch(`/api/admin/users/${userId}`)
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setStats(data.stats)
      } else {
        toast.error("Failed to load user data")
        router.push("/admin/users")
      }
    } catch (error) {
      console.error("Error loading user:", error)
      toast.error("Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  async function toggleBan() {
    if (!user || !userId) return
    
    if (!user.banned && !banReason.trim()) {
      toast.error("Please provide a reason for banning")
      return
    }

    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          banned: !user.banned,
          reason: banReason 
        })
      })
      
      if (res.ok) {
        toast.success(user.banned ? "User unbanned" : "User banned")
        await loadUserData()
        setBanReason("")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update ban status")
      }
    } catch (error) {
      console.error("Error updating ban:", error)
      toast.error("Failed to update ban status")
    } finally {
      setActionLoading(false)
    }
  }

  async function toggleVerify() {
    if (!user || !userId) return
    
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !user.verified })
      })
      
      if (res.ok) {
        toast.success(user.verified ? "Verification removed" : "User verified")
        await loadUserData()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update verification")
      }
    } catch (error) {
      console.error("Error updating verification:", error)
      toast.error("Failed to update verification")
    } finally {
      setActionLoading(false)
    }
  }

  async function deleteUser() {
    if (!userId) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE"
      })
      
      if (res.ok) {
        toast.success("User deleted successfully")
        router.push("/admin/users")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
        <p className="text-muted-foreground">User not found</p>
        <Button asChild className="mt-4">
          <Link href="/admin/users">Back to Users</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="text-muted-foreground mt-1">
            Manage user account and permissions
          </p>
        </div>
      </div>

      {/* User Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatarUrl || user.logoUrl} />
                  <AvatarFallback>
                    {(user.name || user.orgName || user.email).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {user.role === "ngo" ? user.orgName : user.name || "No name"}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
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
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              </div>
              {user.phone && (
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="mt-1">{user.phone}</p>
                </div>
              )}
              {user.location && (
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Joined</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {user.bio && (
              <div>
                <Label className="text-muted-foreground">Bio</Label>
                <p className="mt-1 text-sm">{user.bio}</p>
              </div>
            )}

            {user.skills && user.skills.length > 0 && (
              <div>
                <Label className="text-muted-foreground">Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.skills.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {user.website && (
              <div>
                <Label className="text-muted-foreground">Website</Label>
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-1 text-blue-600 hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  {user.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.role === "volunteer" ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applications:</span>
                    <span className="font-medium">{stats?.totalApplications || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accepted:</span>
                    <span className="font-medium text-green-600">{stats?.acceptedApplications || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="font-medium text-blue-600">{stats?.pendingApplications || 0}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jobs Posted:</span>
                    <span className="font-medium">{stats?.totalJobs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Jobs:</span>
                    <span className="font-medium text-green-600">{stats?.activeJobs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applications:</span>
                    <span className="font-medium">{stats?.totalApplications || 0}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.role === "ngo" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant={user.verified ? "outline" : "default"}
                      className="w-full"
                      disabled={actionLoading}
                    >
                      {user.verified ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Remove Verification
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify NGO
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {user.verified ? "Remove Verification?" : "Verify NGO?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {user.verified 
                          ? "This will remove the verified badge from the NGO profile."
                          : "This will add a verified badge to the NGO profile, indicating they are a legitimate organization."
                        }
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={toggleVerify}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant={user.banned ? "outline" : "destructive"}
                    className="w-full"
                    disabled={actionLoading}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    {user.banned ? "Unban User" : "Ban User"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {user.banned ? "Unban User?" : "Ban User?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {user.banned 
                        ? "This user will regain access to their account."
                        : "This user will lose access to their account and all platform features."
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  {!user.banned && (
                    <div>
                      <Label>Reason for ban</Label>
                      <Textarea
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        placeholder="Enter reason..."
                        className="mt-2"
                      />
                    </div>
                  )}
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={toggleBan}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="w-full"
                    disabled={actionLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete User
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete User Permanently?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the user account
                      and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={deleteUser}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info */}
      {user.bannedReason && (
        <Card className="mb-6 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Ban Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm"><strong>Reason:</strong> {user.bannedReason}</p>
            {user.bannedAt && (
              <p className="text-sm text-muted-foreground mt-2">
                Banned on {new Date(user.bannedAt).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
