"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Bell, 
  Lock, 
  CreditCard, 
  Trash2, 
  AlertTriangle,
  Download,
  FileText,
  Briefcase,
  Award,
  X
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
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

export default function VolunteerSettings() {
  const { data: session, update } = useSession()
  const [activeTab, setActiveTab] = useState("account")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Account state
  const [account, setAccount] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  
  // Notification state
  const [notifications, setNotifications] = useState({
    emailApplications: true,
    emailMessages: true,
    emailUpdates: false,
  })
  
  // Privacy state
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public" as "public" | "private",
    showEmail: false,
  })

  // Billing state
  const [payments, setPayments] = useState<any[]>([])
  const [loadingPayments, setLoadingPayments] = useState(true)

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
    location: "",
    skills: [] as string[],
    hourlyRate: 0,
    ngoHourlyRate: 0,
    availability: "flexible" as "full-time" | "part-time" | "flexible" | "weekends",
    responseTime: "< 24 hours",
    currentWorkStatus: "Available",
    completedProjects: 0,
    activeProjects: 0,
    successRate: 0,
    rating: 0,
  })
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const data = await res.json()
          setAccount(prev => ({ ...prev, email: data.email || "" }))
          setNotifications(data.notifications || {
            emailApplications: true,
            emailMessages: true,
            emailUpdates: false,
          })
          setPrivacy(data.privacy || {
            profileVisibility: "public",
            showEmail: false,
          })
          setProfile({
            name: data.name || "",
            title: data.title || "",
            bio: data.bio || "",
            location: data.location || "",
            skills: data.skills || [],
            hourlyRate: data.hourlyRate || 0,
            ngoHourlyRate: data.ngoHourlyRate || 0,
            availability: data.availability || "flexible",
            responseTime: data.responseTime || "< 24 hours",
            currentWorkStatus: data.currentWorkStatus || "Available",
            completedProjects: data.completedProjects || 0,
            activeProjects: data.activeProjects || 0,
            successRate: data.successRate || 0,
            rating: data.rating || 0,
          })
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      } finally {
        setLoading(false)
      }
    }

    async function loadPaymentHistory() {
      try {
        const res = await fetch("/api/billing/history")
        if (res.ok) {
          const data = await res.json()
          setPayments(data.payments || [])
        }
      } catch (error) {
        console.error("Error loading payment history:", error)
      } finally {
        setLoadingPayments(false)
      }
    }

    loadSettings()
    loadPaymentHistory()
  }, [])

  async function saveAccountSettings() {
    setSaving(true)
    try {
      // Validate password change
      if (account.newPassword || account.confirmPassword) {
        if (account.newPassword !== account.confirmPassword) {
          toast.error("Passwords do not match")
          return
        }
        if (account.newPassword.length < 6) {
          toast.error("Password must be at least 6 characters")
          return
        }
      }

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: account.email }),
      })
      
      if (!res.ok) throw new Error("Failed to save account settings")
      
      // If changing password
      if (account.currentPassword && account.newPassword) {
        const passwordRes = await fetch("/api/settings/password", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: account.currentPassword,
            newPassword: account.newPassword,
          }),
        })
        
        if (!passwordRes.ok) throw new Error("Failed to change password")
      }
      
      toast.success("Account settings saved")
      await update() // Update session
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  async function saveNotificationSettings() {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications }),
      })
      if (!res.ok) throw new Error("Failed to save notification settings")
      toast.success("Notification settings saved")
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  async function savePrivacySettings() {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privacy }),
      })
      if (!res.ok) throw new Error("Failed to save privacy settings")
      toast.success("Privacy settings saved")
      await update() // Update session
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  async function saveProfileSettings() {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      })
      if (!res.ok) throw new Error("Failed to save profile settings")
      toast.success("Profile settings saved")
      await update() // Update session
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  function addSkill() {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  function removeSkill(skill: string) {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  async function deleteAccount() {
    try {
      const res = await fetch("/api/settings/delete-account", {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete account")
      toast.success("Account deleted successfully")
      // Sign out user
      window.location.href = "/"
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Failed to delete account")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const sess = session as unknown as { plan?: string }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Professional Profile
              </CardTitle>
              <CardDescription>
                Update your professional information visible to NGOs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell NGOs about yourself and your experience..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Mumbai, India"
                />
              </div>

              <Separator />

              {/* Rates Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Hourly Rates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourlyRate">Your Hourly Rate (₹)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="0"
                      value={profile.hourlyRate}
                      onChange={(e) => setProfile(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) || 0 }))}
                      placeholder="500"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Your expected hourly compensation</p>
                  </div>
                  <div>
                    <Label htmlFor="ngoHourlyRate">NGO Pays (₹)</Label>
                    <Input
                      id="ngoHourlyRate"
                      type="number"
                      min="0"
                      value={profile.ngoHourlyRate}
                      onChange={(e) => setProfile(prev => ({ ...prev, ngoHourlyRate: parseInt(e.target.value) || 0 }))}
                      placeholder="750"
                    />
                    <p className="text-xs text-muted-foreground mt-1">What NGOs should pay (including platform fees)</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Availability & Status */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Availability & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Select
                      value={profile.availability}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, availability: value as any }))}
                    >
                      <SelectTrigger id="availability">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="responseTime">Response Time</Label>
                    <Select
                      value={profile.responseTime}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, responseTime: value }))}
                    >
                      <SelectTrigger id="responseTime">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="< 1 hour">Less than 1 hour</SelectItem>
                        <SelectItem value="< 4 hours">Less than 4 hours</SelectItem>
                        <SelectItem value="< 24 hours">Less than 24 hours</SelectItem>
                        <SelectItem value="1-2 days">1-2 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="currentWorkStatus">Current Work Status</Label>
                  <Input
                    id="currentWorkStatus"
                    value={profile.currentWorkStatus}
                    onChange={(e) => setProfile(prev => ({ ...prev, currentWorkStatus: e.target.value }))}
                    placeholder="e.g., Available, Busy - 2 projects, Not available"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This shows on your card. Use "Available" to show green status indicator.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Performance Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Performance Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="completedProjects">Completed Projects</Label>
                    <Input
                      id="completedProjects"
                      type="number"
                      min="0"
                      value={profile.completedProjects}
                      onChange={(e) => setProfile(prev => ({ ...prev, completedProjects: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="activeProjects">Active Projects</Label>
                    <Input
                      id="activeProjects"
                      type="number"
                      min="0"
                      value={profile.activeProjects}
                      onChange={(e) => setProfile(prev => ({ ...prev, activeProjects: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="successRate">Success Rate (%)</Label>
                    <Input
                      id="successRate"
                      type="number"
                      min="0"
                      max="100"
                      value={profile.successRate}
                      onChange={(e) => setProfile(prev => ({ ...prev, successRate: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={profile.rating}
                      onChange={(e) => setProfile(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.0"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 These stats are self-reported for now. Keep them accurate to build trust with NGOs!
                </p>
              </div>

              <Separator />

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addSkill()
                        }
                      }}
                      placeholder="Add a skill (press Enter)"
                    />
                    <Button type="button" onClick={addSkill}>
                      Add
                    </Button>
                  </div>
                  {profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                          {skill}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 ml-1 hover:bg-destructive/10"
                            onClick={() => removeSkill(skill)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={saveProfileSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Update your account details and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={account.email}
                  onChange={(e) => setAccount(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={account.currentPassword}
                    onChange={(e) => setAccount(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={account.newPassword}
                    onChange={(e) => setAccount(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={account.confirmPassword}
                    onChange={(e) => setAccount(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={saveAccountSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteAccount} className="bg-destructive hover:bg-destructive/90">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailApplications">Application Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Status changes to your job applications
                    </p>
                  </div>
                  <Switch
                    id="emailApplications"
                    checked={notifications.emailApplications}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, emailApplications: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailMessages">Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Messages from NGOs and system notifications
                    </p>
                  </div>
                  <Switch
                    id="emailMessages"
                    checked={notifications.emailMessages}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, emailMessages: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailUpdates">Platform Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      New features, tips, and platform news
                    </p>
                  </div>
                  <Switch
                    id="emailUpdates"
                    checked={notifications.emailUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, emailUpdates: checked }))
                    }
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={saveNotificationSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control who can see your profile and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Profile Visibility</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profileVisibility">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      {privacy.profileVisibility === "public" 
                        ? "Your profile is visible to NGOs and other volunteers"
                        : "Your profile is private and only visible to you"
                      }
                    </p>
                  </div>
                  <Switch
                    id="profileVisibility"
                    checked={privacy.profileVisibility === "public"}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, profileVisibility: checked ? "public" : "private" }))
                    }
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Personal Information</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showEmail">Show Email Address</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your email address on your public profile
                    </p>
                  </div>
                  <Switch
                    id="showEmail"
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, showEmail: checked }))
                    }
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={savePrivacySettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Information
              </CardTitle>
              <CardDescription>
                Manage your subscription and payment history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {sess.plan?.replace("_", " ") || "Free"} Plan
                    </p>
                  </div>
                  <Badge variant={sess.plan?.includes("plus") ? "default" : "secondary"}>
                    {sess.plan?.includes("plus") ? "Active" : "Free"}
                  </Badge>
                </div>
                
                {!(sess.plan?.includes("plus")) && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Upgrade to Plus</h3>
                        <p className="text-sm text-amber-700">
                          Unlock unlimited applications and premium features
                        </p>
                      </div>
                      <Button asChild>
                        <a href="/upgrade">Upgrade Now</a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Payment History</h3>
                {loadingPayments ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Loading payment history...</p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No payment history yet</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <a href="/upgrade">
                        <Download className="h-4 w-4 mr-2" />
                        View Plans
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium capitalize">{payment.plan.replace(/_/g, " ")} Plan</h4>
                            <Badge variant={payment.status === "paid" ? "default" : payment.status === "pending" ? "secondary" : "destructive"}>
                              {payment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          {payment.orderId && (
                            <p className="text-xs text-muted-foreground mt-1">Order ID: {payment.orderId}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{payment.amount.toFixed(2)}</p>
                          {payment.paymentId && (
                            <p className="text-xs text-muted-foreground">ID: {payment.paymentId.slice(0, 12)}...</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}