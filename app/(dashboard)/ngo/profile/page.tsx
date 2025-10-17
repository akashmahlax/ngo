"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/upload/image-uploader"
import { Save, Plus, X, Building2, Globe, MapPin, Phone, Users, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function NgoProfile() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    orgName: "",
    bio: "",
    website: "",
    orgType: "",
    registrationNumber: "",
    phone: "",
    address: "",
    focusAreas: [] as string[],
    teamSize: "",
    verified: false,
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
    },
  })
  const [newFocusArea, setNewFocusArea] = useState("")

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          setProfile({
            orgName: data.orgName || "",
            bio: data.bio || "",
            website: data.website || "",
            orgType: data.orgType || "",
            registrationNumber: data.registrationNumber || "",
            phone: data.phone || "",
            address: data.address || "",
            focusAreas: data.focusAreas || [],
            teamSize: data.teamSize || "",
            verified: data.verified || false,
            socialLinks: data.socialLinks || {
              linkedin: "",
              twitter: "",
              facebook: "",
              instagram: "",
            },
          })
        }
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  async function handleImageUpload(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)
    
    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
    })
    
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || "Failed to upload image")
    }
    
    const data = await res.json()
    await update() // Update session
    return data.avatarUrl
  }

  async function handleImageRemove() {
    try {
      await fetch("/api/profile/avatar", { method: "DELETE" })
      await update() // Update session
    } catch (error) {
      console.error("Error removing image:", error)
    }
  }

  async function saveProfile() {
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success("Profile updated successfully")
      await update() // Update session
    } catch (e: any) {
      toast.error(e.message || "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  function addFocusArea() {
    if (newFocusArea.trim() && !profile.focusAreas.includes(newFocusArea.trim())) {
      setProfile(prev => ({ ...prev, focusAreas: [...prev.focusAreas, newFocusArea.trim()] }))
      setNewFocusArea("")
    }
  }

  function removeFocusArea(area: string) {
    setProfile(prev => ({ ...prev, focusAreas: prev.focusAreas.filter(a => a !== area) }))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="md:col-span-2 space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Organization Profile</h1>
          <p className="text-muted-foreground">Update your NGO profile information</p>
        </div>
        {profile.verified && (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified Organization
          </Badge>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Logo Upload */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Organization Logo</h2>
          <ImageUploader
            currentImage={(session.user as any).avatarUrl}
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
          />
        </div>

        {/* Organization Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={profile.orgName}
                  onChange={(e) => setProfile(prev => ({ ...prev, orgName: e.target.value }))}
                  placeholder="Your organization name"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Mission Statement</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Describe your organization's mission and impact"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {profile.bio.length}/1000 characters
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Select value={profile.orgType} onValueChange={(value) => setProfile(prev => ({ ...prev, orgType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="non-profit">Non-Profit</SelectItem>
                      <SelectItem value="charity">Charity</SelectItem>
                      <SelectItem value="foundation">Foundation</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                      <SelectItem value="social-enterprise">Social Enterprise</SelectItem>
                      <SelectItem value="community-group">Community Group</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={profile.registrationNumber}
                    onChange={(e) => setProfile(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    placeholder="Official registration number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourorganization.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address, city, state, country"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Focus Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Focus Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFocusArea}
                  onChange={(e) => setNewFocusArea(e.target.value)}
                  placeholder="Add a focus area (e.g., Education, Healthcare, Environment)"
                  onKeyPress={(e) => e.key === "Enter" && addFocusArea()}
                />
                <Button onClick={addFocusArea} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile.focusAreas.map((area, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {area}
                    <button onClick={() => removeFocusArea(area)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Organization Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Select value={profile.teamSize} onValueChange={(value) => setProfile(prev => ({ ...prev, teamSize: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 people</SelectItem>
                    <SelectItem value="6-20">6-20 people</SelectItem>
                    <SelectItem value="21-50">21-50 people</SelectItem>
                    <SelectItem value="51-100">51-100 people</SelectItem>
                    <SelectItem value="100+">100+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profile.socialLinks.linkedin}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                    }))}
                    placeholder="https://linkedin.com/company/organization"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={profile.socialLinks.twitter}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    placeholder="https://twitter.com/organization"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={profile.socialLinks.facebook}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                    }))}
                    placeholder="https://facebook.com/organization"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={profile.socialLinks.instagram}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                    }))}
                    placeholder="https://instagram.com/organization"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={saveProfile} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}