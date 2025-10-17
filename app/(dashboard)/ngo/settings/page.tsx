"use client"

import React, { useState, useEffect } from "react"
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
  Eye, 
  EyeOff, 
  Trash2, 
  AlertTriangle,
  Download,
  FileText,
  Users,
  FileCheck
} from "lucide-react"
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

export default function NgoSettings() {
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
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
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
    } catch (e: any) {
      toast.error(e.message || "Failed to save settings")
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
    } catch (e: any) {
      toast.error(e.message || "Failed to save settings")
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
    } catch (e: any) {
      toast.error(e.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
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
    } catch (e: any) {
      toast.error(e.message || "Failed to delete account")
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">Manage your organization's account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

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
                Permanently delete your organization account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete Organization Account</h3>
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
                        This action cannot be undone. This will permanently delete your organization account
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
                      New applications for your job postings
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
                      Messages from volunteers and system notifications
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
                Control who can see your organization profile and information
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
                        ? "Your organization profile is visible to volunteers and the public"
                        : "Your organization profile is private"
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
                <h3 className="font-medium">Contact Information</h3>
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
                      {(session as any).plan?.replace("_", " ") || "Base"} Plan
                    </p>
                  </div>
                  <Badge variant={(session as any).plan?.includes("plus") ? "default" : "secondary"}>
                    {(session as any).plan?.includes("plus") ? "Active" : "Base"}
                  </Badge>
                </div>
                
                {!(session as any).plan?.includes("plus") && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Upgrade to Plus</h3>
                        <p className="text-sm text-amber-700">
                          Unlock unlimited job postings and premium features
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Management
              </CardTitle>
              <CardDescription>
                Manage team members and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Team Members</h3>
                    <p className="text-sm text-muted-foreground">
                      Invite team members to manage your organization
                    </p>
                  </div>
                  <Button>
                    <User className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </div>
                
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No team members added yet</p>
                  <Button variant="outline" className="mt-4">
                    Invite Team Member
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Verification Status</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Organization Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify your organization to build trust with volunteers
                    </p>
                  </div>
                  <Badge variant="secondary">
                    Not Verified
                  </Badge>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Submit Verification Documents</h3>
                      <p className="text-sm text-blue-700">
                        Upload your registration documents to get verified
                      </p>
                    </div>
                    <Button variant="outline">
                      <FileCheck className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}