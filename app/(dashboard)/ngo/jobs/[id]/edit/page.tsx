"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Trash2 } from "lucide-react"

export default function EditJob({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [job, setJob] = useState({
    title: "",
    description: "",
    category: "",
    locationType: "remote" as "onsite" | "remote" | "hybrid",
    skills: [] as string[],
  })
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    async function loadJob() {
      try {
        const res = await fetch(`/api/jobs/${params.id}`)
        const data = await res.json()
        if (res.ok) {
          setJob({
            title: data.job.title,
            description: data.job.description,
            category: data.job.category || "",
            locationType: data.job.locationType || "remote",
            skills: data.job.skills || [],
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadJob()
  }, [params.id])

  async function saveJob() {
    setSaving(true)
    try {
      const res = await fetch(`/api/jobs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      })
      if (res.ok) {
        router.push("/(dashboard)/ngo")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  async function deleteJob() {
    if (!confirm("Are you sure you want to delete this job?")) return
    
    setDeleting(true)
    try {
      const res = await fetch(`/api/jobs/${params.id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/(dashboard)/ngo")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(false)
    }
  }

  function addSkill() {
    if (newSkill.trim() && !job.skills.includes(newSkill.trim())) {
      setJob(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }))
      setNewSkill("")
    }
  }

  function removeSkill(skill: string) {
    setJob(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  if (loading) return <div className="container mx-auto px-4 py-12">Loading...</div>

  return (
    <section className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Job</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Job Title</label>
            <Input
              value={job.title}
              onChange={(e) => setJob(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Social Media Manager"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={job.description}
              onChange={(e) => setJob(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role and responsibilities"
              rows={6}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Category</label>
            <Input
              value={job.category}
              onChange={(e) => setJob(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g. Marketing, Education, Healthcare"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Location Type</label>
            <Select value={job.locationType} onValueChange={(value: any) => setJob(prev => ({ ...prev, locationType: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Required Skills</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
              />
              <Button onClick={addSkill} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-secondary rounded text-sm flex items-center gap-1">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="text-muted-foreground hover:text-foreground">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-between">
        <Button onClick={deleteJob} disabled={deleting} variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          {deleting ? "Deleting..." : "Delete Job"}
        </Button>
        
        <Button onClick={saveJob} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </section>
  )
}
