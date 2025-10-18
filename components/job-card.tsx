"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Clock, 
  Users, 
  Bookmark,
  CheckCircle,
  Crown,
  DollarSign,
  Briefcase,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"

type JobCardProps = {
  job: {
    _id: string
    title: string
    description?: string
    category?: string
    location?: string
    locationType?: "onsite" | "remote" | "hybrid"
    createdAt: Date
    skills?: string[]
    compensationType?: "paid" | "unpaid" | "stipend"
    salaryRange?: string
    stipendAmount?: string
    commitment?: "full-time" | "part-time" | "flexible"
    applicationCount?: number
  }
  ngo: {
    name: string
    logoUrl?: string | null
    verified?: boolean
    plan?: string
  }
  viewMode?: "grid" | "list"
}

export function JobCard({ job, ngo, viewMode = "grid" }: JobCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  
  const getCompensationDisplay = () => {
    if (job.compensationType === "paid" && job.salaryRange) {
      return { text: job.salaryRange, type: "Paid Position", icon: DollarSign }
    }
    if (job.compensationType === "stipend" && job.stipendAmount) {
      return { text: job.stipendAmount, type: "Stipend", icon: DollarSign }
    }
    return { text: "Volunteer", type: "Unpaid", icon: Briefcase }
  }

  const compensation = getCompensationDisplay()

  if (viewMode === "list") {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary overflow-hidden">
        <div className="flex flex-col md:flex-row p-6 gap-6">
          {/* Left: NGO Logo & Badges */}
          <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3">
            <Avatar className="h-16 w-16 ring-2 ring-background shadow-md">
              <AvatarImage src={ngo.logoUrl || undefined} alt={ngo.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xl font-bold">
                {ngo.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex md:flex-col gap-2">
              {ngo.verified && (
                <Badge variant="outline" className="gap-1 border-blue-600/30 text-blue-600">
                  <CheckCircle className="h-3 w-3 fill-blue-600" />
                  Verified
                </Badge>
              )}
              {ngo.plan?.endsWith('plus') && (
                <Badge variant="secondary" className="gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                  <Crown className="h-3 w-3" />
                  Plus
                </Badge>
              )}
            </div>
          </div>

          {/* Center: Job Info */}
          <div className="flex-1 space-y-3">
            <div>
              <Link href={`/jobs/${job._id}`} className="group/link">
                <h3 className="text-xl font-bold group-hover/link:text-primary transition-colors mb-1">
                  {job.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">{ngo.name}</p>
            </div>

            {job.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-sm">
              {job.location && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                  {job.locationType && (
                    <Badge variant="outline" className="ml-1 text-xs capitalize">
                      {job.locationType}
                    </Badge>
                  )}
                </div>
              )}
              
              {job.commitment && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="capitalize">{job.commitment}</span>
                </div>
              )}

              {job.applicationCount !== undefined && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{job.applicationCount} applied</span>
                </div>
              )}
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.skills.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Right: Compensation & Actions */}
          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 mb-1">
                <compensation.icon className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{compensation.type}</span>
              </div>
              <p className="text-lg font-bold text-primary">{compensation.text}</p>
              {job.category && (
                <Badge variant="default" className="mt-2">
                  {job.category}
                </Badge>
              )}
            </div>

            <div className="flex md:flex-col gap-2">
              <Button asChild className="md:w-full">
                <Link href={`/jobs/${job._id}`}>View Details</Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-primary" : ""}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(job.createdAt, { addSuffix: true })}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Grid View
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* Gradient Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Header with NGO Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-background shadow-md group-hover:ring-primary/20 transition-all">
              <AvatarImage src={ngo.logoUrl || undefined} alt={ngo.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                {ngo.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-sm">{ngo.name}</h4>
              <div className="flex items-center gap-1 mt-0.5">
                {ngo.verified && (
                  <CheckCircle className="h-3 w-3 text-blue-600 fill-blue-600" />
                )}
                {ngo.plan?.endsWith('plus') && (
                  <Crown className="h-3 w-3 text-amber-600" />
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`${isBookmarked ? "text-primary" : "text-muted-foreground"}`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Job Title */}
        <Link href={`/jobs/${job._id}`} className="group/link">
          <h3 className="text-lg font-bold leading-tight group-hover/link:text-primary transition-colors line-clamp-2">
            {job.title}
          </h3>
        </Link>

        {/* Description */}
        {job.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
        )}

        {/* Compensation Highlight */}
        <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{compensation.type}</p>
              <p className="font-bold text-primary text-lg">{compensation.text}</p>
            </div>
            <compensation.icon className="h-8 w-8 text-primary opacity-20" />
          </div>
        </div>

        {/* Meta Information */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 text-xs">
            {job.location && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{job.location}</span>
              </div>
            )}
            {job.commitment && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="capitalize">{job.commitment}</span>
              </div>
            )}
            {job.applicationCount !== undefined && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{job.applicationCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-normal">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          {job.category && (
            <Badge variant="default" className="text-xs">
              {job.category}
            </Badge>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(job.createdAt, { addSuffix: true })}
          </div>
        </div>

        {/* Hover Action Button */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button asChild className="w-full" size="sm">
            <Link href={`/jobs/${job._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
