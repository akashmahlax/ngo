"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings,
  Save,
  Database,
  Bell,
  Shield,
  Zap
} from "lucide-react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    // Platform Settings
    siteName: "NGO Connect",
    siteUrl: "http://localhost:3000",
    supportEmail: "support@ngoconnect.com",
    
    // Feature Flags
    enableRegistration: true,
    enableJobPosting: true,
    enableApplications: true,
    enablePayments: true,
    enableEmailNotifications: true,
    
    // Quotas - Free Tier
    freeJobsPerMonth: 3,
    freeFeaturedJobs: 0,
    freeApplicationsPerJob: 50,
    
    // Quotas - Premium Tier
    premiumJobsPerMonth: 20,
    premiumFeaturedJobs: 5,
    premiumApplicationsPerJob: 200,
    
    // Quotas - Enterprise Tier
    enterpriseJobsPerMonth: -1, // unlimited
    enterpriseFeaturedJobs: 20,
    enterpriseApplicationsPerJob: -1, // unlimited
    
    // Moderation
    autoModeration: false,
    requireNGOVerification: true,
    requireEmailVerification: true,
    
    // Email Settings
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    
    // Payment Settings
    razorpayKeyId: "",
    razorpayKeySecret: "",
    
    // Other
    maintenanceMode: false
  })

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const res = await fetch("/api/admin/settings")
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          setSettings({ ...settings, ...data.settings })
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      })
      
      if (res.ok) {
        toast.success("Settings saved successfully")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  function handleChange(key: string, value: any) {
    setSettings({ ...settings, [key]: value })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure platform behavior and features
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="features">
            <Zap className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="quotas">
            <Database className="h-4 w-4 mr-2" />
            Quotas
          </TabsTrigger>
          <TabsTrigger value="moderation">
            <Shield className="h-4 w-4 mr-2" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Bell className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic platform configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => handleChange("siteUrl", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between border-t pt-6">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Disable public access to the platform
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Flags */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable platform features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register
                  </p>
                </div>
                <Switch
                  checked={settings.enableRegistration}
                  onCheckedChange={(checked) => handleChange("enableRegistration", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Job Posting</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow NGOs to post jobs
                  </p>
                </div>
                <Switch
                  checked={settings.enableJobPosting}
                  onCheckedChange={(checked) => handleChange("enableJobPosting", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Applications</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow volunteers to apply to jobs
                  </p>
                </div>
                <Switch
                  checked={settings.enableApplications}
                  onCheckedChange={(checked) => handleChange("enableApplications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payments</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable subscription payments
                  </p>
                </div>
                <Switch
                  checked={settings.enablePayments}
                  onCheckedChange={(checked) => handleChange("enablePayments", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications to users
                  </p>
                </div>
                <Switch
                  checked={settings.enableEmailNotifications}
                  onCheckedChange={(checked) => handleChange("enableEmailNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quotas */}
        <TabsContent value="quotas">
          <div className="space-y-6">
            {/* Free Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Free Tier Quotas</CardTitle>
                <CardDescription>
                  Limits for free tier users
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="freeJobs">Jobs Per Month</Label>
                  <Input
                    id="freeJobs"
                    type="number"
                    value={settings.freeJobsPerMonth}
                    onChange={(e) => handleChange("freeJobsPerMonth", parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="freeFeatured">Featured Jobs</Label>
                  <Input
                    id="freeFeatured"
                    type="number"
                    value={settings.freeFeaturedJobs}
                    onChange={(e) => handleChange("freeFeaturedJobs", parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="freeApps">Applications Per Job</Label>
                  <Input
                    id="freeApps"
                    type="number"
                    value={settings.freeApplicationsPerJob}
                    onChange={(e) => handleChange("freeApplicationsPerJob", parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Premium Tier Quotas</CardTitle>
                <CardDescription>
                  Limits for premium tier users
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="premiumJobs">Jobs Per Month</Label>
                  <Input
                    id="premiumJobs"
                    type="number"
                    value={settings.premiumJobsPerMonth}
                    onChange={(e) => handleChange("premiumJobsPerMonth", parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="premiumFeatured">Featured Jobs</Label>
                  <Input
                    id="premiumFeatured"
                    type="number"
                    value={settings.premiumFeaturedJobs}
                    onChange={(e) => handleChange("premiumFeaturedJobs", parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="premiumApps">Applications Per Job</Label>
                  <Input
                    id="premiumApps"
                    type="number"
                    value={settings.premiumApplicationsPerJob}
                    onChange={(e) => handleChange("premiumApplicationsPerJob", parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Enterprise Tier Quotas</CardTitle>
                <CardDescription>
                  Limits for enterprise tier users (-1 for unlimited)
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="enterpriseJobs">Jobs Per Month</Label>
                  <Input
                    id="enterpriseJobs"
                    type="number"
                    value={settings.enterpriseJobsPerMonth}
                    onChange={(e) => handleChange("enterpriseJobsPerMonth", parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="enterpriseFeatured">Featured Jobs</Label>
                  <Input
                    id="enterpriseFeatured"
                    type="number"
                    value={settings.enterpriseFeaturedJobs}
                    onChange={(e) => handleChange("enterpriseFeaturedJobs", parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="enterpriseApps">Applications Per Job</Label>
                  <Input
                    id="enterpriseApps"
                    type="number"
                    value={settings.enterpriseApplicationsPerJob}
                    onChange={(e) => handleChange("enterpriseApplicationsPerJob", parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Moderation */}
        <TabsContent value="moderation">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Settings</CardTitle>
              <CardDescription>
                Configure content moderation rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Moderation</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically flag inappropriate content
                  </p>
                </div>
                <Switch
                  checked={settings.autoModeration}
                  onCheckedChange={(checked) => handleChange("autoModeration", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require NGO Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    NGOs must be verified to post jobs
                  </p>
                </div>
                <Switch
                  checked={settings.requireNGOVerification}
                  onCheckedChange={(checked) => handleChange("requireNGOVerification", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify email before full access
                  </p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => handleChange("requireEmailVerification", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <div className="space-y-6">
            {/* Email Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration (SMTP)</CardTitle>
                <CardDescription>
                  Configure SMTP for sending emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => handleChange("smtpHost", e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) => handleChange("smtpPort", parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={settings.smtpUser}
                    onChange={(e) => handleChange("smtpUser", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleChange("smtpPassword", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Configuration (Razorpay)</CardTitle>
                <CardDescription>
                  Configure Razorpay for payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                  <Input
                    id="razorpayKeyId"
                    value={settings.razorpayKeyId}
                    onChange={(e) => handleChange("razorpayKeyId", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
                  <Input
                    id="razorpayKeySecret"
                    type="password"
                    value={settings.razorpayKeySecret}
                    onChange={(e) => handleChange("razorpayKeySecret", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button at Bottom */}
      <div className="flex justify-end mt-8">
        <Button onClick={saveSettings} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  )
}
