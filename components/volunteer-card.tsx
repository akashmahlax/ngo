"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Clock, 
  Award,
  Briefcase,
  DollarSign,
  Mail,
  CheckCircle,
  Star,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type VolunteerCardProps = {
  volunteer: {
    _id: string
    name: string
    email?: string
    title?: string
    bio?: string
    location?: string
    skills?: string[]
    avatarUrl?: string
    verified?: boolean
    experience?: any[]
    // New salary/earnings fields
    expectedSalary?: string
    hourlyRate?: number
    availability?: "full-time" | "part-time" | "flexible" | "weekends"
    totalEarnings?: number
    hoursWorked?: number
  }
  viewMode?: "grid" | "list"
}

export function VolunteerCard({ volunteer, viewMode = "grid" }: VolunteerCardProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  
  const getAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case "full-time": return "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
      case "part-time": return "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
      case "flexible": return "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
      case "weekends": return "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
      default: return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary overflow-hidden">
        <div className="flex flex-col md:flex-row p-6 gap-6">
          {/* Left: Avatar & Status */}
          <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3">
            <Avatar className="h-20 w-20 ring-2 ring-background shadow-lg">
              <AvatarImage src={volunteer.avatarUrl} alt={volunteer.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary text-2xl font-bold">
                {volunteer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex md:flex-col gap-2">
              {volunteer.verified && (
                <Badge variant="outline" className="gap-1 border-blue-600/30 text-blue-600">
                  <CheckCircle className="h-3 w-3 fill-blue-600" />
                  Verified
                </Badge>
              )}
              {volunteer.availability && (
                <Badge variant="outline" className={`gap-1 capitalize ${getAvailabilityColor(volunteer.availability)}`}>
                  <Clock className="h-3 w-3" />
                  {volunteer.availability}
                </Badge>
              )}
            </div>
          </div>

          {/* Center: Info */}
          <div className="flex-1 space-y-3">
            <div>
              <Link href={`/volunteers/${volunteer._id}`} className="group/link">
                <h3 className="text-xl font-bold group-hover/link:text-primary transition-colors">
                  {volunteer.name}
                </h3>
              </Link>
              {volunteer.title && (
                <p className="text-sm text-muted-foreground font-medium">{volunteer.title}</p>
              )}
            </div>

            {volunteer.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {volunteer.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-sm">
              {volunteer.location && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{volunteer.location}</span>
                </div>
              )}
              
              {volunteer.experience && volunteer.experience.length > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{volunteer.experience.length} {volunteer.experience.length === 1 ? 'role' : 'roles'}</span>
                </div>
              )}

              {volunteer.hoursWorked !== undefined && volunteer.hoursWorked > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>{volunteer.hoursWorked}h worked</span>
                </div>
              )}
            </div>

            {volunteer.skills && volunteer.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {volunteer.skills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {volunteer.skills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{volunteer.skills.length - 5} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Right: Salary & Actions */}
          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
            <div className="text-right">
              {volunteer.expectedSalary || volunteer.hourlyRate ? (
                <>
                  <div className="flex items-center justify-end gap-1 mb-1">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      {volunteer.hourlyRate ? 'Hourly Rate' : 'Expected'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {volunteer.hourlyRate ? `₹${volunteer.hourlyRate}/hr` : volunteer.expectedSalary}
                  </p>
                </>
              ) : (
                <Badge variant="outline">Open to opportunities</Badge>
              )}
              
              {volunteer.totalEarnings !== undefined && volunteer.totalEarnings > 0 && (
                <div className="mt-2 text-xs text-muted-foreground flex items-center justify-end gap-1">
                  <TrendingUp className="h-3 w-3" />
                  ₹{volunteer.totalEarnings.toLocaleString()} earned
                </div>
              )}
            </div>

            <div className="flex md:flex-col gap-2">
              <Button asChild className="md:w-full">
                <Link href={`/volunteers/${volunteer._id}`}>View Profile</Link>
              </Button>
              <Button variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
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
        {/* Header with Avatar */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg group-hover:ring-primary/20 transition-all mb-3">
            <AvatarImage src={volunteer.avatarUrl} alt={volunteer.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary text-2xl font-bold">
              {volunteer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <Link href={`/volunteers/${volunteer._id}`} className="group/link">
            <h3 className="text-lg font-bold group-hover/link:text-primary transition-colors">
              {volunteer.name}
            </h3>
          </Link>
          
          {volunteer.title && (
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {volunteer.title}
            </p>
          )}
          
          <div className="flex items-center justify-center gap-2 mt-2">
            {volunteer.verified && (
              <CheckCircle className="h-4 w-4 text-blue-600 fill-blue-600" />
            )}
            {volunteer.availability && (
              <Badge variant="outline" className={`text-xs capitalize ${getAvailabilityColor(volunteer.availability)}`}>
                {volunteer.availability}
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        {volunteer.bio && (
          <p className="text-sm text-muted-foreground text-center line-clamp-3">
            {volunteer.bio}
          </p>
        )}

        {/* Salary Highlight */}
        {(volunteer.expectedSalary || volunteer.hourlyRate) && (
          <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 border border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {volunteer.hourlyRate ? 'Hourly Rate' : 'Expected Salary'}
                </p>
                <p className="font-bold text-primary">
                  {volunteer.hourlyRate ? `₹${volunteer.hourlyRate}/hr` : volunteer.expectedSalary}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary opacity-20" />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center gap-4 text-xs">
          {volunteer.location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{volunteer.location}</span>
            </div>
          )}
          {volunteer.experience && volunteer.experience.length > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Briefcase className="h-3 w-3" />
              <span>{volunteer.experience.length}</span>
            </div>
          )}
        </div>

        {/* Earnings Badge */}
        {volunteer.totalEarnings !== undefined && volunteer.totalEarnings > 0 && (
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground bg-accent/50 rounded-md py-1.5">
            <TrendingUp className="h-3 w-3" />
            <span>₹{volunteer.totalEarnings.toLocaleString()} total earned</span>
          </div>
        )}

        {/* Skills Tags */}
        {volunteer.skills && volunteer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {volunteer.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-normal">
                {skill}
              </Badge>
            ))}
            {volunteer.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{volunteer.skills.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Hover Action Buttons */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
          <Button asChild className="w-full" size="sm">
            <Link href={`/volunteers/${volunteer._id}`}>View Full Profile</Link>
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      </div>
    </Card>
  )
}
