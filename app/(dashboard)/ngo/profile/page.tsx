"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save } from "lucide-react"

export default function NgoProfile() {
  const { data: session } = useSession()
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    orgName: "",
    website: "",
    bio: "",
  })

  useEffect(() => {
    if (session?.user) {
      setProfile({
        orgName: (session.user as any).orgName || "",
        website: (session.user as any).website || "",
        bio: (session.user as any).bio || "",
      })
    }
  }, [session])

  async function saveProfile() {
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (!res.ok) throw new Error("Failed to save")
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (!session?.user) return null

  return (
    <section className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Edit NGO Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Organization Name</label>
            <Input
              value={profile.orgName}
              onChange={(e) => setProfile(prev => ({ ...prev, orgName: e.target.value }))}
              placeholder="Your organization name"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Website</label>
            <Input
              value={profile.website}
              onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://your-website.com"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">About</label>
            <Textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about your organization"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={saveProfile} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </section>
  )
}