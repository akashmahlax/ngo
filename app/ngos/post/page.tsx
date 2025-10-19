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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
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
  Briefcase,
  MapPin,
  Clock,
  Users,
  Award,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Bookmark,
  Share2,
  Check,
  Heart,
  TrendingUp,
  Target
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
  
  // Enhanced Form state with professional fields
  const [job, setJob] = useState({
    // Basic Information
    title: "",
    category: "",
    locationType: "onsite" as "onsite" | "remote" | "hybrid",
    location: "",
    timezone: "" as "" | "IST" | "EST" | "PST" | "GMT" | "CST" | "JST" | "AEST",
    
    // Description & Requirements
    description: "",
    responsibilities: [] as string[],
    requirements: [] as string[],
    benefits: [] as string[],
    skills: [] as string[],
    
    // Position Details
    duration: "",
    commitment: "full-time" as "full-time" | "part-time" | "flexible",
    applicationDeadline: "",
    numberOfPositions: 1,
    startDate: "",
    
    // Experience & Qualifications
    experienceLevel: "entry" as "entry" | "intermediate" | "advanced" | "any",
    educationRequired: "" as "" | "high-school" | "bachelors" | "masters" | "phd" | "none",
    languagesRequired: [] as string[],
    certificationRequired: "",
    
    // Work Arrangement (for remote/hybrid)
    remoteWorkPolicy: "" as "" | "fully-remote" | "remote-first" | "hybrid-flexible" | "occasional-remote",
    workingHoursFlexible: false,
    timeCommitmentPerWeek: "",
    
    // Screening & Selection
    applicationQuestions: [] as string[],
    backgroundCheckRequired: false,
    interviewRequired: true,
    
    // Compensation
    compensationType: "unpaid" as "paid" | "unpaid" | "stipend",
    salaryRange: "",
    stipendAmount: "",
    hourlyRate: "",
    paymentFrequency: "" as "" | "hourly" | "daily" | "monthly" | "one-time" | "project-based",
    additionalPerks: [] as string[],
    
    // Impact & Organization
    impactArea: [] as string[],
    targetBeneficiaries: "",
    urgencyLevel: "normal" as "normal" | "urgent" | "flexible",
    
    // Accessibility
    accessibilityAccommodations: false,
    diversityStatement: "",
  })
  
  // State for dynamic field inputs
  const [newRequirement, setNewRequirement] = useState("")
  const [newResponsibility, setNewResponsibility] = useState("")
  const [newBenefit, setNewBenefit] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newPerk, setNewPerk] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [newImpactArea, setNewImpactArea] = useState("")
  const [newApplicationQuestion, setNewApplicationQuestion] = useState("")

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
    if (newRequirement.trim()) {
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

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setJob(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()]
      }))
      setNewResponsibility("")
    }
  }

  const removeResponsibility = (index: number) => {
    setJob(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim()) {
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
    if (newSkill.trim()) {
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

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setJob(prev => ({
        ...prev,
        languagesRequired: [...prev.languagesRequired, newLanguage.trim()]
      }))
      setNewLanguage("")
    }
  }

  const removeLanguage = (index: number) => {
    setJob(prev => ({
      ...prev,
      languagesRequired: prev.languagesRequired.filter((_, i) => i !== index)
    }))
  }

  const addImpactArea = () => {
    if (newImpactArea.trim()) {
      setJob(prev => ({
        ...prev,
        impactArea: [...prev.impactArea, newImpactArea.trim()]
      }))
      setNewImpactArea("")
    }
  }

  const removeImpactArea = (index: number) => {
    setJob(prev => ({
      ...prev,
      impactArea: prev.impactArea.filter((_, i) => i !== index)
    }))
  }

  const addApplicationQuestion = () => {
    if (newApplicationQuestion.trim()) {
      setJob(prev => ({
        ...prev,
        applicationQuestions: [...prev.applicationQuestions, newApplicationQuestion.trim()]
      }))
      setNewApplicationQuestion("")
    }
  }

  const removeApplicationQuestion = (index: number) => {
    setJob(prev => ({
      ...prev,
      applicationQuestions: prev.applicationQuestions.filter((_, i) => i !== index)
    }))
  }

  const addPerk = () => {
    if (newPerk.trim()) {
      setJob(prev => ({
        ...prev,
        additionalPerks: [...prev.additionalPerks, newPerk.trim()]
      }))
      setNewPerk("")
    }
  }

  const removePerk = (index: number) => {
    setJob(prev => ({
      ...prev,
      additionalPerks: prev.additionalPerks.filter((_, i) => i !== index)
    }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
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
      // Clean up the job data before submission
      const cleanedJob = {
        ...job,
        // Remove empty optional fields to prevent validation errors
        timezone: job.timezone || undefined,
        paymentFrequency: job.paymentFrequency || undefined,
        hourlyRate: job.hourlyRate || undefined,
        salaryRange: job.salaryRange || undefined,
        stipendAmount: job.stipendAmount || undefined,
        duration: job.duration || undefined,
        applicationDeadline: job.applicationDeadline || undefined,
        location: job.location || undefined,
        startDate: job.startDate || undefined,
        educationRequired: job.educationRequired || undefined,
        certificationRequired: job.certificationRequired || undefined,
        remoteWorkPolicy: job.remoteWorkPolicy || undefined,
        timeCommitmentPerWeek: job.timeCommitmentPerWeek || undefined,
        targetBeneficiaries: job.targetBeneficiaries || undefined,
        diversityStatement: job.diversityStatement || undefined,
      }
      
      const res = await fetch('/api/jobs', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedJob) 
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 402) {
          toast.error(data.message || "Upgrade required to post more jobs")
        } else {
          console.error("Job posting error:", data)
          toast.error(data.error || data.message || "Failed to post job")
        }
        return
      }
      
      toast.success("Job posted successfully!")
      router.push("/jobs")
    } catch (error) {
      console.error("Job posting exception:", error)
      toast.error("Failed to post job")
    } finally {
      setSaving(false)
    }
  }

  const StepIndicator = () => {
    const stepLabels = ["Basic Info", "Job Details", "Qualifications", "Review"]
    
    return (
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                  currentStep === step 
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110" 
                    : step < currentStep 
                      ? "bg-green-500 text-white" 
                      : "bg-muted text-muted-foreground"
                }`}>
                  {step < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                <p className={`text-xs mt-2 font-medium transition-colors ${
                  currentStep === step ? "text-primary" : "text-muted-foreground"
                }`}>
                  {stepLabels[step - 1]}
                </p>
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                  step < currentStep ? "bg-green-500" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
    
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/ngo">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="mb-8 text-center relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent blur-3xl" />
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Briefcase className="h-4 w-4" />
          <span>Job Posting</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Post a New Job
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
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
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <Button variant="ghost" onClick={() => setIsPreview(false)} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Edit
              </Button>

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Job Title & Company */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl border-2 border-background shadow-lg">
                      NGO
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-3xl lg:text-4xl font-bold mb-2 break-words">
                        {job.title || "Your Job Title"}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg text-primary font-medium">Your Organization</span>
                        <Badge variant="default" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Preview Mode
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Key Info Pills */}
                  <div className="flex flex-wrap gap-3">
                    {job.location && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border shadow-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {job.locationType === "remote" ? "Remote" : job.location}
                        </span>
                      </div>
                    )}
                    {job.commitment && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border shadow-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium capitalize">{job.commitment}</span>
                      </div>
                    )}
                    {job.duration && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border shadow-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{job.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                  <Button className="w-full" size="lg">Apply Now (Preview)</Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {job.category && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {job.category}
                  </Badge>
                )}
                {job.locationType && (
                  <Badge variant="outline" className="px-3 py-1">
                    {job.locationType === "onsite" && "On-site"}
                    {job.locationType === "remote" && "Remote"}
                    {job.locationType === "hybrid" && "Hybrid"}
                  </Badge>
                )}
                {job.compensationType && (
                  <Badge className="px-3 py-1 capitalize bg-green-500">
                    {job.compensationType}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tabs for Content Organization */}
                <Card className="border-2 shadow-lg">
                  <CardContent className="p-0">
                    <Tabs defaultValue="overview" className="w-full">
                      <div className="border-b px-6 pt-6">
                        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-0">
                          <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3">
                            Overview
                          </TabsTrigger>
                          <TabsTrigger value="requirements" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3">
                            Requirements
                          </TabsTrigger>
                          {job.benefits.length > 0 && (
                            <TabsTrigger value="benefits" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3">
                              Benefits
                            </TabsTrigger>
                          )}
                        </TabsList>
                      </div>

                      <TabsContent value="overview" className="p-6 space-y-6">
                        {/* Description */}
                        <div>
                          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            About This Opportunity
                          </h2>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            {job.description ? (
                              job.description.split('\n').map((paragraph, index) => (
                                paragraph.trim() && (
                                  <p key={index} className="mb-3 text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                                    {paragraph}
                                  </p>
                                )
                              ))
                            ) : (
                              <p className="text-muted-foreground">Job description will appear here...</p>
                            )}
                          </div>
                        </div>

                        {/* Skills */}
                        {job.skills.length > 0 && (
                          <div>
                            <Separator className="my-6" />
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Award className="h-5 w-5 text-primary" />
                              Required Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="requirements" className="p-6 space-y-4">
                        {job.requirements.length > 0 ? (
                          <div className="space-y-3">
                            {job.requirements.map((req, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 break-words">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm flex-1">{req}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-8">No specific requirements listed</p>
                        )}
                      </TabsContent>

                      <TabsContent value="benefits" className="p-6 space-y-4">
                        {job.benefits.length > 0 && (
                          <div className="space-y-3">
                            {job.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 break-words">
                                <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Heart className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-sm flex-1">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {job.additionalPerks.length > 0 && (
                          <>
                            <Separator className="my-4" />
                            <div>
                              <h4 className="font-semibold mb-3">Additional Perks</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {job.additionalPerks.map((perk, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 break-words">
                                    <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="text-sm flex-1">{perk}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Responsibilities */}
                {job.responsibilities.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Key Responsibilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {job.responsibilities.map((responsibility, index) => (
                          <div key={index} className="flex items-start gap-3 break-words">
                            <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                {index + 1}
                              </span>
                            </div>
                            <span className="text-sm flex-1">{responsibility}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Impact & Target */}
                {(job.impactArea.length > 0 || job.targetBeneficiaries) && (
                  <Card className="shadow-sm border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Impact & Reach
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {job.impactArea.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Impact Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.impactArea.map((area, index) => (
                              <Badge key={index} variant="outline" className="px-3 py-1 break-words">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {job.targetBeneficiaries && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Target Beneficiaries</h4>
                          <p className="text-sm break-words">{job.targetBeneficiaries}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Apply Card */}
                <Card className="lg:sticky lg:top-24 shadow-lg border-2">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Ready to Apply?
                    </CardTitle>
                    <CardDescription>Preview of how volunteers will see this section</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <Button className="w-full" size="lg">Apply Now</Button>

                    {/* Quick Details */}
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      {job.applicationDeadline && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Deadline
                          </span>
                          <span className="font-medium">
                            {new Date(job.applicationDeadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {job.numberOfPositions > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Positions
                          </span>
                          <span className="font-medium">{job.numberOfPositions}</span>
                        </div>
                      )}
                      {job.experienceLevel && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Experience
                          </span>
                          <span className="font-medium capitalize">{job.experienceLevel}</span>
                        </div>
                      )}
                      {(job.salaryRange || job.stipendAmount || job.hourlyRate) && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Compensation
                          </span>
                          <span className="font-medium">
                            {job.salaryRange || job.stipendAmount || `₹${job.hourlyRate}/hr`}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card className="shadow-sm bg-primary/5">
                  <CardContent className="p-6 space-y-3">
                    <Button onClick={() => setIsPreview(false)} variant="outline" className="w-full" size="lg">
                      <Eye className="h-4 w-4 mr-2" />
                      Continue Editing
                    </Button>
                    <Button onClick={handleSubmit} disabled={saving} className="w-full" size="lg">
                      {saving ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Publish Job
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardTitle className="text-2xl flex items-center gap-2">
              {currentStep === 1 && (
                <>
                  <Briefcase className="h-6 w-6 text-primary" />
                  Basic Information
                </>
              )}
              {currentStep === 2 && (
                <>
                  <Plus className="h-6 w-6 text-primary" />
                  Description & Requirements
                </>
              )}
              {currentStep === 3 && (
                <>
                  <Eye className="h-6 w-6 text-primary" />
                  Review & Publish
                </>
              )}
            </CardTitle>
            <CardDescription className="text-base">
              {currentStep === 1 && "Provide the basic details for your volunteer opportunity"}
              {currentStep === 2 && "Describe the role and what you're looking for"}
              {currentStep === 3 && "Review your job posting before publishing"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-semibold">
                    Job Title *
                  </Label>
                  <Input
                    id="title"
                    value={job.title}
                    onChange={(e) => setJob(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Environmental Conservation Volunteer"
                    className="mt-2 text-base h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    A clear, descriptive title helps attract the right volunteers
                  </p>
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

                {/* Compensation Section */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Compensation & Benefits</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="compensationType">Compensation Type *</Label>
                      <Select
                        value={job.compensationType}
                        onValueChange={(value) => setJob(prev => ({ 
                          ...prev, 
                          compensationType: value as "paid" | "unpaid" | "stipend" 
                        }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select compensation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unpaid">Unpaid / Volunteer</SelectItem>
                          <SelectItem value="paid">Paid Position</SelectItem>
                          <SelectItem value="stipend">Stipend Provided</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {job.compensationType === "paid" && (
                      <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                        <div>
                          <Label htmlFor="salaryRange">Salary Range</Label>
                          <Input
                            id="salaryRange"
                            value={job.salaryRange}
                            onChange={(e) => setJob(prev => ({ ...prev, salaryRange: e.target.value }))}
                            placeholder="e.g., ₹15,000 - ₹25,000/month"
                          />
                        </div>

                        <div>
                          <Label htmlFor="hourlyRate">Hourly Rate (Optional)</Label>
                          <Input
                            id="hourlyRate"
                            type="number"
                            value={job.hourlyRate}
                            onChange={(e) => setJob(prev => ({ ...prev, hourlyRate: e.target.value }))}
                            placeholder="e.g., 500"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Amount in ₹ per hour</p>
                        </div>

                        <div>
                          <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                          <Select
                            value={job.paymentFrequency}
                            onValueChange={(value) => setJob(prev => ({ 
                              ...prev, 
                              paymentFrequency: value as "hourly" | "daily" | "monthly" | "one-time" | "project-based"
                            }))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select payment frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="one-time">One-time</SelectItem>
                              <SelectItem value="project-based">Project-based</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {job.compensationType === "stipend" && (
                      <div className="pl-4 border-l-2 border-primary/20">
                        <Label htmlFor="stipendAmount">Stipend Amount</Label>
                        <Input
                          id="stipendAmount"
                          value={job.stipendAmount}
                          onChange={(e) => setJob(prev => ({ ...prev, stipendAmount: e.target.value }))}
                          placeholder="e.g., ₹5,000/month"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Specify amount and frequency</p>
                      </div>
                    )}

                    {/* Additional Perks */}
                    <div>
                      <Label htmlFor="additionalPerks">Additional Perks (Optional)</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          id="additionalPerks"
                          value={newPerk}
                          onChange={(e) => setNewPerk(e.target.value)}
                          placeholder="e.g., Food provided, Travel allowance"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addPerk()
                            }
                          }}
                        />
                        <Button type="button" onClick={addPerk} size="icon" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {job.additionalPerks.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.additionalPerks.map((perk, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {perk}
                              <button
                                type="button"
                                onClick={() => removePerk(index)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    onClick={handleNext} 
                    disabled={!job.title || !job.category}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    Next: Description
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={handlePrevious} size="lg">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={!job.description}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    Next: Review
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={handlePrevious} size="lg">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsPreview(true)} size="lg">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={saving}
                      size="lg"
                      className="min-w-[180px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
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
    </>
  )
}