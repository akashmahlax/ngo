"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckoutButton } from "@/components/billing/CheckoutButton"
import { 
  ChevronLeft, 
  Plus, 
  X, 
  Save, 
  Eye,
  AlertCircle,
  Lock,
  Crown,
  Briefcase
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

type QuotaInfo = {
  active: number
  limit: number
  isPlus: boolean
}

export default function PostJobPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null)
  const [loadingQuota, setLoadingQuota] = useState(true)

  // Check if user has NGO Plus plan and fetch quota
  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      toast.error("Please sign in to post jobs")
      router.push("/signin")
      return
    }

    const userSession = session as { role?: string; plan?: string }
    
    if (userSession?.role !== "ngo") {
      toast.error("Only NGOs can post jobs")
      router.push("/")
      return
    }

    // Fetch current quota info
    const fetchQuota = async () => {
      try {
        const res = await fetch("/api/jobs/quota")
        if (res.ok) {
          const data = await res.json()
          setQuotaInfo(data)
        }
      } catch {
        // Silently fail, quota will show as unavailable
      } finally {
        setLoadingQuota(false)
      }
    }
    
    fetchQuota()
  }, [session, status, router])
  
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  
  // Form state
  const [job, setJob] = useState({
    title: "",
    category: "",
    locationType: "onsite" as "onsite" | "remote" | "hybrid",
    location: "",
    description: "",
    requirements: [] as string[],
    benefits: [] as string[],
    skills: [] as string[],
    duration: "",
    commitment: "full-time" as "full-time" | "part-time" | "flexible",
    applicationDeadline: "",
    numberOfPositions: 1,
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
      const res = await fetch('/api/jobs', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job) 
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 402) {
          toast.error(data.message || "Upgrade required to post more jobs")
        } else {
          toast.error(data.error || "Failed to post job")
        }
        return
      }
      
      toast.success("Job posted successfully!")
      router.push("/jobs")
    } catch {
      toast.error("Failed to post job")
    } finally {
      setSaving(false)
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
        <Link href="/ngo">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Post a New Job</h1>
        <p className="text-muted-foreground">
          Create a volunteer opportunity for your organization
        </p>
      </div>

      {/* Quota Info and Upgrade Alert */}
      {!loadingQuota && quotaInfo && (
        <div className="mb-6 space-y-4">
          {/* Quota Display */}
          <Card className={quotaInfo.isPlus ? "border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className={`h-5 w-5 ${quotaInfo.isPlus ? 'text-amber-600' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="text-sm font-medium">
                      {quotaInfo.isPlus ? (
                        <span className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-amber-600" />
                          Unlimited Job Postings
                        </span>
                      ) : (
                        `Job Postings: ${quotaInfo.active} / ${quotaInfo.limit}`
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {quotaInfo.isPlus 
                        ? "You have NGO Plus - post as many jobs as you need" 
                        : `You have ${quotaInfo.limit - quotaInfo.active} job slot${quotaInfo.limit - quotaInfo.active !== 1 ? 's' : ''} remaining`
                      }
                    </p>
                  </div>
                </div>
                {!quotaInfo.isPlus && (
                  <CheckoutButton plan="ngo_plus" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Alert for Limit Reached */}
          {!quotaInfo.isPlus && quotaInfo.active >= quotaInfo.limit && (
            <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
              <Lock className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-900 dark:text-red-100 font-semibold">
                Job Posting Limit Reached
              </AlertTitle>
              <AlertDescription className="text-red-800 dark:text-red-200">
                <p className="mb-3">
                  You have reached your limit of {quotaInfo.limit} active job postings. 
                  Upgrade to NGO Plus for unlimited job postings and more features.
                </p>
                <div className="flex gap-2">
                  <CheckoutButton plan="ngo_plus" />
                  <Button variant="outline" asChild size="sm">
                    <Link href="/ngo/jobs">View My Jobs</Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Upgrade Suggestion for Non-Plus Users */}
          {!quotaInfo.isPlus && quotaInfo.active < quotaInfo.limit && (
            <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <Crown className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-900 dark:text-blue-100 font-semibold">
                Unlock Unlimited Job Postings
              </AlertTitle>
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <p className="mb-3">
                  Upgrade to NGO Plus for unlimited job postings, featured listings, and advanced analytics. 
                  Only ₹1/month during our launch period!
                </p>
                <CheckoutButton plan="ngo_plus" />
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

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
              Review your job posting before publishing
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
                {job.commitment && (
                  <Badge variant="outline">{job.commitment}</Badge>
                )}
                {job.duration && (
                  <Badge variant="secondary">{job.duration}</Badge>
                )}
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                {job.locationType === "onsite" && job.location && (
                  <p>📍 {job.location}</p>
                )}
                {job.numberOfPositions > 1 && (
                  <p>👥 {job.numberOfPositions} positions available</p>
                )}
                {job.applicationDeadline && (
                  <p>📅 Apply by: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                )}
              </div>
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
                {saving ? "Publishing..." : "Publish Job"}
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
              {currentStep === 3 && "Review & Publish"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Provide the basic details for your volunteer opportunity"}
              {currentStep === 2 && "Describe the role and what you're looking for"}
              {currentStep === 3 && "Review your job posting before publishing"}
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
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={job.location}
                      onChange={(e) => setJob(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="commitment">Time Commitment *</Label>
                    <Select
                      value={job.commitment}
                      onValueChange={(value) => setJob(prev => ({ 
                        ...prev, 
                        commitment: value as "full-time" | "part-time" | "flexible" 
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select commitment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={job.duration}
                      onChange={(e) => setJob(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 3 months, Ongoing"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="numberOfPositions">Number of Positions</Label>
                    <Input
                      id="numberOfPositions"
                      type="number"
                      min="1"
                      value={job.numberOfPositions}
                      onChange={(e) => setJob(prev => ({ ...prev, numberOfPositions: parseInt(e.target.value) || 1 }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="applicationDeadline">Application Deadline</Label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      value={job.applicationDeadline}
                      onChange={(e) => setJob(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addRequirement()
                        }
                      }}
                    />
                    <Button onClick={addRequirement} size="icon" type="button">
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addBenefit()
                        }
                      }}
                    />
                    <Button onClick={addBenefit} size="icon" type="button">
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addSkill()
                        }
                      }}
                    />
                    <Button onClick={addSkill} size="icon" type="button">
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
                  <Button onClick={handleNext} disabled={!job.description}>
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
                      <h3 className="font-medium text-blue-900">Review Your Job Posting</h3>
                      <p className="text-sm text-blue-700">
                        Please review all details carefully before publishing. You can make changes 
                        by going back to previous steps.
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
                      <p><span className="text-muted-foreground">Commitment:</span> {job.commitment || "Not specified"}</p>
                      {job.duration && <p><span className="text-muted-foreground">Duration:</span> {job.duration}</p>}
                      {job.numberOfPositions > 1 && <p><span className="text-muted-foreground">Positions:</span> {job.numberOfPositions}</p>}
                      {job.applicationDeadline && <p><span className="text-muted-foreground">Deadline:</span> {new Date(job.applicationDeadline).toLocaleDateString()}</p>}
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
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Publish Job
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