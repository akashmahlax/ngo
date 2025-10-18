"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ChevronLeft, 
  Plus, 
  X, 
  Save, 
  Eye,
  Archive,
  Trash2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
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

// Mock data for demonstration
const mockJob = {
  id: "1",
  title: "Environmental Conservation Volunteer",
  description: `Join our dedicated team in protecting and preserving local wildlife habitats. This role involves fieldwork, data collection, and community education to promote environmental awareness.

Key Responsibilities:
- Conduct wildlife surveys and habitat assessments
- Participate in habitat restoration projects
- Assist with environmental education programs
- Collect and analyze ecological data
- Collaborate with local community groups`,
  category: "Environment",
  locationType: "onsite" as "onsite" | "remote" | "hybrid",
  location: "San Francisco, CA",
  requirements: ["Background check", "Physical fitness", "Weekend availability"],
  benefits: ["Training provided", "Certificate of Completion", "Networking Opportunities"],
  skills: ["Conservation", "Research", "Teamwork", "Data Collection", "Environmental Science"],
  status: "open" as "open" | "closed",
}

export default function EditJobPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  
  // Form state
  const [job, setJob] = useState({
    title: mockJob.title,
    category: mockJob.category,
    locationType: mockJob.locationType,
    location: mockJob.location,
    description: mockJob.description,
    requirements: [...mockJob.requirements],
    benefits: [...mockJob.benefits],
    skills: [...mockJob.skills],
    status: mockJob.status,
  })
  
  const [newRequirement, setNewRequirement] = useState("")
  const [newBenefit, setNewBenefit] = useState("")
  const [newSkill, setNewSkill] = useState("")

  // Categories for the job
  const CATEGORIES = [
    "Education",
    "Healthcare",
    "Environment",
    "Animal Welfare",
    "Community Development",
    "Arts & Culture",
    "Disaster Relief",
    "Human Rights",
    "Marketing",
    "Technology",
    "Finance",
    "Legal",
  ]

  useEffect(() => {
    // In a real implementation, fetch job data from API
    // fetch(`/api/jobs/${params.id}`)
  }, [params.id])

  const addRequirement = () => {
    if (newRequirement.trim() && !job.requirements.includes(newRequirement.trim())) {
      setJob(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setJob(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim() && !job.benefits.includes(newBenefit.trim())) {
      setJob(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }))
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    setJob(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !job.skills.includes(newSkill.trim())) {
      setJob(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setJob(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      // In a real implementation, this would be an API call
      // await fetch(`/api/jobs/${params.id}`, { method: 'PATCH', body: JSON.stringify(job) })
      console.log("Updated job data:", job)
      toast.success("Job updated successfully!")
      // Redirect to job detail or dashboard
    } catch (error) {
      toast.error("Failed to update job")
    } finally {
      setSaving(false)
    }
  }

  const archiveJob = async () => {
    try {
      // In a real implementation, this would be an API call
      // await fetch(`/api/jobs/${params.id}/archive`, { method: 'PATCH' })
      toast.success("Job archived successfully!")
      // Redirect to jobs dashboard
    } catch (error) {
      toast.error("Failed to archive job")
    }
  }

  const deleteJob = async () => {
    try {
      // In a real implementation, this would be an API call
      // await fetch(`/api/jobs/${params.id}`, { method: 'DELETE' })
      toast.success("Job deleted successfully!")
      // Redirect to jobs dashboard
    } catch (error) {
      toast.error("Failed to delete job")
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === step 
              ? "bg-primary text-primary-foreground" 
              : step < currentStep 
                ? "bg-secondary text-secondary-foreground" 
                : "bg-muted text-muted-foreground"
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-0.5 ${
              step < currentStep ? "bg-secondary" : "bg-muted"
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard/ngo/jobs">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
      </Button>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Edit Job</h1>
            <p className="text-muted-foreground">
              Update your volunteer opportunity details
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={archiveJob}>
              <Archive className="h-4 w-4 mr-2" />
              {job.status === "open" ? "Close Job" : "Reopen Job"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Job
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the job posting 
                    and remove all associated applications.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteJob} className="bg-destructive hover:bg-destructive/90">
                    Delete Job
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <StepIndicator />

      {isPreview ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Job Preview</CardTitle>
              <Button variant="outline" onClick={() => setIsPreview(false)}>
                <Eye className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            <CardDescription>
              Review your job posting before saving changes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">{job.title || "Job Title"}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>{job.category || "Category"}</Badge>
                <Badge variant="outline">
                  {job.locationType === "onsite" && "On-site"}
                  {job.locationType === "remote" && "Remote"}
                  {job.locationType === "hybrid" && "Hybrid"}
                </Badge>
                <Badge variant={job.status === "open" ? "default" : "secondary"}>
                  {job.status === "open" ? "Open" : "Closed"}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {job.locationType === "onsite" && job.location}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <div className="prose max-w-none">
                {job.description ? (
                  job.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))
                ) : (
                  <p className="text-muted-foreground">Job description will appear here...</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Requirements</h3>
              {job.requirements.length > 0 ? (
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                      {req}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No requirements specified</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Benefits</h3>
              {job.benefits.length > 0 ? (
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No benefits specified</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Skills</h3>
              {job.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills specified</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsPreview(false)}>
                Edit
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Description & Requirements"}
              {currentStep === 3 && "Review & Save"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Update the basic details for your volunteer opportunity"}
              {currentStep === 2 && "Update the role description and requirements"}
              {currentStep === 3 && "Review your changes before saving"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={job.title}
                    onChange={(e) => setJob(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Environmental Conservation Volunteer"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={job.category}
                      onValueChange={(value) => setJob(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="locationType">Location Type *</Label>
                    <Select
                      value={job.locationType}
                      onValueChange={(value) => setJob(prev => ({ 
                        ...prev, 
                        locationType: value as "onsite" | "remote" | "hybrid" 
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {job.locationType === "onsite" && (
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={job.location}
                      onChange={(e) => setJob(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleNext} disabled={!job.title || !job.category}>
                    Next: Description
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={job.description}
                    onChange={(e) => setJob(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role, responsibilities, and what volunteers will be doing..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {job.description.length}/2000 characters
                  </p>
                </div>

                <div>
                  <Label>Requirements</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add a requirement"
                      onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                    />
                    <Button onClick={addRequirement} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.requirements.map((req, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {req}
                        <button 
                          onClick={() => removeRequirement(index)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Benefits</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Add a benefit"
                      onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                    />
                    <Button onClick={addBenefit} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {benefit}
                        <button 
                          onClick={() => removeBenefit(index)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Skills</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button onClick={addSkill} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button 
                          onClick={() => removeSkill(index)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                  <Button onClick={handleNext}>
                    Next: Review
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-blue-900">Review Your Changes</h3>
                      <p className="text-sm text-blue-700">
                        Please review all changes carefully before saving. You can make additional 
                        changes by going back to previous steps.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Basic Information</h3>
                    <div className="ml-4 mt-2 space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Title:</span> {job.title || "Not provided"}</p>
                      <p><span className="text-muted-foreground">Category:</span> {job.category || "Not provided"}</p>
                      <p><span className="text-muted-foreground">Location:</span> {job.locationType} {job.locationType === "onsite" && job.location}</p>
                      <p><span className="text-muted-foreground">Status:</span> {job.status}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Description</h3>
                    <div className="ml-4 mt-2">
                      <p className="text-sm line-clamp-3 text-muted-foreground">
                        {job.description || "No description provided"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Requirements ({job.requirements.length})</h3>
                    <div className="ml-4 mt-2">
                      {job.requirements.length > 0 ? (
                        <ul className="text-sm space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="text-muted-foreground">• {req}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No requirements specified</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Benefits ({job.benefits.length})</h3>
                    <div className="ml-4 mt-2">
                      {job.benefits.length > 0 ? (
                        <ul className="text-sm space-y-1">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="text-muted-foreground">• {benefit}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No benefits specified</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Skills ({job.skills.length})</h3>
                    <div className="ml-4 mt-2">
                      {job.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {job.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No skills specified</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsPreview(true)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button onClick={handleSubmit} disabled={saving}>
                      {saving ? (
                        <>
                          <Save className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}