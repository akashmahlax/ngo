import { JobDetailPageClient } from "./JobDetailClient"

export default async function JobDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params
  
  return <JobDetailPageClient jobId={resolvedParams.id} />
}


  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`)
        if (!res.ok) {
          if (res.status === 404) {
            toast.error("Job not found")
            return
          }
          throw new Error("Failed to fetch job")
        }
        const data = await res.json()
        setJob(data.job)
      } catch (error) {
        console.error("Error fetching job:", error)
        toast.error("Failed to load job details")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId])

  const handleShare = () => {
    if (!job) return
    
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this volunteer opportunity: ${job.title}`,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">The job you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button asChild>
            <Link href="/jobs">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/jobs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Job Title & Company */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
                  <AvatarImage src={job.ngo.logoUrl} alt={job.ngo.name} />
                  <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                    {job.ngo.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2 break-words">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link 
                      href={`/ngos/${job.ngo._id}`}
                      className="text-lg text-primary hover:underline font-medium"
                    >
                      {job.ngo.name}
                    </Link>
                    {job.ngo.verified && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                    {job.ngo.plan?.endsWith('plus') && (
                      <Badge className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500">
                        <Star className="h-3 w-3" />
                        Plus
                      </Badge>
                    )}
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
                {job.applicationCount !== undefined && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border shadow-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{job.applicationCount} Applied</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
              <ApplyButton jobId={job._id} />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 sm:flex-none"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={handleShare}
                >
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
            {job.createdAt && (
              <Badge variant="outline" className="px-3 py-1">
                Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
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
                      <TabsTrigger 
                        value="overview" 
                        className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger 
                        value="requirements" 
                        className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
                      >
                        Requirements
                      </TabsTrigger>
                      {(job.benefits && job.benefits.length > 0) && (
                        <TabsTrigger 
                          value="benefits" 
                          className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
                        >
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
                        {job.description.split('\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="mb-3 text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                              {paragraph}
                            </p>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
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
                    {job.requirements && job.requirements.length > 0 ? (
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
                    {job.benefits && job.benefits.length > 0 && (
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
                    {job.additionalPerks && job.additionalPerks.length > 0 && (
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
            {job.responsibilities && job.responsibilities.length > 0 && (
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
            {(job.impactArea && job.impactArea.length > 0) || job.targetBeneficiaries && (
              <Card className="shadow-sm border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Impact & Reach
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.impactArea && job.impactArea.length > 0 && (
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
            {/* Apply Card - Sticky */}
            <Card className="lg:sticky lg:top-24 shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Ready to Apply?
                </CardTitle>
                <CardDescription>
                  Join {job.ngo.name} in making a difference
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <ApplyButton jobId={job._id} />
                {job.applicationCount !== undefined && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{job.applicationCount}</span> {job.applicationCount === 1 ? 'person has' : 'people have'} already applied
                    </p>
                  </div>
                )}

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
                        {format(new Date(job.applicationDeadline), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  {job.numberOfPositions && (
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

            {/* About Organization */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  About the Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href={`/ngos/${job.ngo._id}`} className="block group">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                    <Avatar className="h-12 w-12 border-2">
                      <AvatarImage src={job.ngo.logoUrl} alt={job.ngo.name} />
                      <AvatarFallback className="font-bold bg-primary text-primary-foreground">
                        {job.ngo.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold group-hover:text-primary transition-colors break-words">
                        {job.ngo.name}
                      </h3>
                      {job.ngo.location && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{job.ngo.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {job.ngo.description && (
                  <>
                    <Separator />
                    <p className="text-sm text-muted-foreground line-clamp-4 break-words">
                      {job.ngo.description}
                    </p>
                  </>
                )}

                {job.ngo.focusAreas && job.ngo.focusAreas.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-semibold mb-2">Focus Areas</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.ngo.focusAreas.slice(0, 4).map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs break-words">
                            {area}
                          </Badge>
                        ))}
                        {job.ngo.focusAreas.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.ngo.focusAreas.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Button asChild variant="outline" className="w-full group">
                  <Link href={`/ngos/${job.ngo._id}`}>
                    <Globe className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    View Full Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Additional Info Card */}
            {(job.languagesRequired && job.languagesRequired.length > 0) || 
             job.remoteWorkPolicy || 
             job.diversityStatement ? (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Good to Know</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {job.languagesRequired && job.languagesRequired.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Languages Required</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.languagesRequired.map((lang, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {job.remoteWorkPolicy && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Remote Work</p>
                        <p className="text-sm capitalize break-words">{job.remoteWorkPolicy}</p>
                      </div>
                    </>
                  )}
                  {job.diversityStatement && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Diversity & Inclusion</p>
                        <p className="text-sm text-muted-foreground break-words">{job.diversityStatement}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}