"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { ImageUploader } from "@/components/upload/image-uploader"
import { Save, Plus, X, Globe, Lock, User, MapPin, Briefcase, GraduationCap } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function VolunteerProfile() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    location: "",
    skills: [] as string[],
    socialLinks: {
      linkedin: "",
      github: "",
      website: "",
      twitter: "",
    },
    experience: [] as Array<{
      title: string
      company: string
      duration: string
      description: string
    }>,
    education: [] as Array<{
      degree: string
      institution: string
      year: string
      description: string
    }>,
    profileVisibility: "public" as "public" | "private",
    avatarUrl: ""
  })
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          setProfile(prev => ({
            ...prev,
            name: data.name || session?.user?.name || "",
            bio: data.bio || "",
            location: data.location || "",
            skills: data.skills || [],
            socialLinks: data.socialLinks || {
              linkedin: "",
              github: "",
              website: "",
              twitter: "",
            },
            experience: data.experience || [],
            education: data.education || [],
            profileVisibility: data.profileVisibility || "public",
            avatarUrl: data.avatarUrl || session?.user?.image || session?.user?.avatarUrl || ""
          }))
        }
      } catch (error: unknown) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [session])

  async function handleImageUpload(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to upload image")
      }
      const data = await res.json()
      setProfile(prev => ({ ...prev, avatarUrl: data.avatarUrl }))
      await saveProfile({ ...profile, avatarUrl: data.avatarUrl })
      toast.success("Profile photo updated!")
      await update()
      return data.avatarUrl
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to upload image")
        throw error
      } else {
        toast.error("Failed to upload image")
        throw new Error("Failed to upload image")
      }
    }
  }

  async function handleImageRemove() {
    try {
      const res = await fetch("/api/profile/avatar", { method: "DELETE" })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to remove image")
      }
      setProfile(prev => ({ ...prev, avatarUrl: "" }))
      await saveProfile({ ...profile, avatarUrl: "" })
      toast.success("Profile photo removed!")
      await update()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to remove image")
      } else {
        toast.error("Failed to remove image")
      }
    }
  }

  async function saveProfile(updated?: typeof profile) {
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated || profile),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success("Profile updated successfully")
      await update()
      // Reload profile from backend to reflect changes
      const refreshed = await fetch("/api/profile")
      if (refreshed.ok) {
        const data = await refreshed.json()
        setProfile(prev => ({
          ...prev,
          name: data.name || prev.name,
          bio: data.bio || prev.bio,
          location: data.location || prev.location,
          skills: data.skills || prev.skills,
          socialLinks: data.socialLinks || prev.socialLinks,
          experience: data.experience || prev.experience,
          education: data.education || prev.education,
          profileVisibility: data.profileVisibility || prev.profileVisibility,
          avatarUrl: data.avatarUrl || prev.avatarUrl
        }))
      }
      setEditMode(false)
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message || "Failed to save profile")
      } else {
        toast.error("Failed to save profile")
      }
    } finally {
      setSaving(false)
    }
  }

  function addSkill() {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }))
      setNewSkill("")
    }
  }

  function removeSkill(skill: string) {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  function addExperience() {
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, { title: "", company: "", duration: "", description: "" }]
    }))
  }

  function removeExperience(index: number) {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  function updateExperience(index: number, field: string, value: string) {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  function addEducation() {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "", description: "" }]
    }))
  }

  function removeEducation(index: number) {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  function updateEducation(index: number, field: string, value: string) {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
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

  // VIEW MODE
  if (!editMode) {
    // Get plan info from session
  const plan = session?.plan || "Base"
  const isPlus = plan?.includes("plus")
  const planExpiresAt = session?.planExpiresAt ? new Date(session.planExpiresAt) : null
  const isExpired = planExpiresAt && planExpiresAt < new Date()
  const displayName = session?.user?.name || profile.name
  const displayEmail = session?.user?.email
  const displayAvatar = session?.user?.image || session?.user?.avatarUrl || profile.avatarUrl || ""
  const hasValidAvatar = displayAvatar && displayAvatar.trim() !== ""
  
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Volunteer Profile</h1>
            <p className="text-muted-foreground">Your public profile as seen by NGOs and volunteers</p>
          </div>
          <Button variant="outline" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Avatar & Account Info */}
          <div className="flex flex-col items-center gap-4">
            <div className="h-32 w-32 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
              {hasValidAvatar ? (
                <Image
                  src={displayAvatar}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <User className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
            <h2 className="text-xl font-semibold">{displayName}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="mt-2">
              <Badge variant={profile.profileVisibility === "public" ? "default" : "secondary"} className={profile.profileVisibility === "public" ? "bg-green-500 hover:bg-green-600" : ""}>
                {profile.profileVisibility === "public" ? "Public" : "Private"}
              </Badge>
            </div>
            {/* Account Card */}
            <Card className="w-full mt-4">
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <span className="text-muted-foreground">{displayEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Plan:</span>
                  <Badge variant={isPlus ? "default" : "secondary"}>{plan?.replace("_", " ")}</Badge>
                  {isPlus && !isExpired && (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
                  )}
                  {isExpired && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                </div>
                {planExpiresAt && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Expires:</span>
                    <span className="text-muted-foreground">{planExpiresAt.toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Info Cards */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{profile.bio || "No bio provided."}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {profile.socialLinks.linkedin && (
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener" className="text-blue-700 hover:underline">LinkedIn</a>
                  )}
                  {profile.socialLinks.github && (
                    <a href={profile.socialLinks.github} target="_blank" rel="noopener" className="text-gray-700 hover:underline">GitHub</a>
                  )}
                  {profile.socialLinks.website && (
                    <a href={profile.socialLinks.website} target="_blank" rel="noopener" className="text-green-700 hover:underline">Website</a>
                  )}
                  {profile.socialLinks.twitter && (
                    <a href={profile.socialLinks.twitter} target="_blank" rel="noopener" className="text-blue-500 hover:underline">Twitter</a>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.experience.length === 0 ? (
                  <p className="text-muted-foreground">No experience added.</p>
                ) : (
                  profile.experience.map((exp, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{exp.title}</span>
                        <span className="text-xs text-muted-foreground">{exp.duration}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{exp.company}</div>
                      <div className="mt-2 text-sm">{exp.description}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.education.length === 0 ? (
                  <p className="text-muted-foreground">No education added.</p>
                ) : (
                  profile.education.map((edu, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{edu.degree}</span>
                        <span className="text-xs text-muted-foreground">{edu.year}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{edu.institution}</div>
                      <div className="mt-2 text-sm">{edu.description}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // EDIT MODE (original form)
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">Update your volunteer profile information</p>
        </div>
        <Button variant="outline" onClick={() => setEditMode(false)}>
          Cancel
        </Button>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {/* Avatar Upload */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
          <ImageUploader
            currentImage={profile.avatarUrl || undefined}
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
          />
        </div>
        {/* Basic Information */}
        <div className="md:col-span-2 space-y-6">
          {/* ...existing code for edit form... */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself, your interests, and why you volunteer"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {profile.bio.length}/500 characters
                </p>
              </div>
              <div>
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                />
              </div>
            </CardContent>
          </Card>
          {/* ...existing code for skills, social links, experience, education, privacy... */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g., Marketing, Teaching, Design)"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Links
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
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={profile.socialLinks.github}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, github: e.target.value }
                    }))}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    value={profile.socialLinks.website}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, website: e.target.value }
                    }))}
                    placeholder="https://yourwebsite.com"
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
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(index, "title", e.target.value)}
                        placeholder="e.g., Marketing Manager"
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        placeholder="e.g., Tech Corp"
                      />
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, "duration", e.target.value)}
                        placeholder="e.g., 2020 - 2023"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(index, "description", e.target.value)}
                        placeholder="Describe your role and achievements"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addExperience} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        placeholder="e.g., Bachelor of Science"
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        placeholder="e.g., University Name"
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(index, "year", e.target.value)}
                        placeholder="e.g., 2020"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={edu.description}
                        onChange={(e) => updateEducation(index, "description", e.target.value)}
                        placeholder="Additional details (optional)"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addEducation} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="visibility">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    {profile.profileVisibility === "public" 
                      ? "Your profile is visible to NGOs and other volunteers"
                      : "Your profile is private and only visible to you"
                    }
                  </p>
                </div>
                <Switch
                  id="visibility"
                  checked={profile.profileVisibility === "public"}
                  onCheckedChange={(checked) => setProfile(prev => ({
                    ...prev,
                    profileVisibility: checked ? "public" : "private"
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
  <Button onClick={() => saveProfile()} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}