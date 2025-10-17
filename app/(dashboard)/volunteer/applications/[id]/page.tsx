"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  ChevronLeft, 
  Calendar, 
  MessageSquare, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"

// Mock data for demonstration
const mockApplication = {
  id: "1",
  jobId: "job1",
  jobTitle: "Environmental Conservation Volunteer",
  ngoName: "Green Earth Conservation Society",
  ngoLogo: "/placeholder.svg",
  status: "interview" as "applied" | "review" | "interview" | "offered" | "rejected",
  appliedDate: new Date(Date.now() - 86400000), // 1 day ago
  notes: "Looking forward to contributing to environmental conservation efforts.",
  timeline: [
    {
      status: "applied",
      date: new Date(Date.now() - 86400000),
      note: "Application submitted successfully"
    },
    {
      status: "review",
      date: new Date(Date.now() - 43200000),
      note: "Your application is under review by our team"
    },
    {
      status: "interview",
      date: new Date(Date.now() - 21600000),
      note: "Interview scheduled for next Monday at 10:00 AM"
    }
  ],
  jobDetails: {
    location: "San Francisco, CA",
    locationType: "onsite" as "onsite" | "remote" | "hybrid",
    category: "Environment",
    description: "Join our dedicated team in protecting and preserving local wildlife habitats.",
    requirements: ["Background check", "Physical fitness", "Weekend availability"],
    benefits: ["Training provided", "Certificate of Completion", "Networking Opportunities"],
  }
}

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [newNote, setNewNote] = useState("")

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "applied": return "secondary"
      case "review": return "default"
      case "interview": return "default"
      case "offered": return "default"
      case "rejected": return "destructive"
      default: return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "applied": return "Applied"
      case "review": return "Under Review"
      case "interview": return "Interview Scheduled"
      case "offered": return "Offer Received"
      case "rejected": return "Not Selected"
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied": return <FileText className="h-4 w-4" />
      case "review": return <Clock className="h-4 w-4" />
      case "interview": return <User className="h-4 w-4" />
      case "offered": return <CheckCircle className="h-4 w-4" />
      case "rejected": return <XCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const addNote = () => {
    if (newNote.trim()) {
      // In a real implementation, this would be an API call
      console.log("Adding note:", newNote)
      setNewNote("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard/volunteer/applications">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Link>
      </Button>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold">{mockApplication.jobTitle}</h1>
            <p className="text-muted-foreground">{mockApplication.ngoName}</p>
          </div>
          <Badge variant={getStatusVariant(mockApplication.status)} className="text-lg py-2 px-4">
            {getStatusIcon(mockApplication.status)}
            <span className="ml-2">{getStatusText(mockApplication.status)}</span>
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Applied {formatDistanceToNow(mockApplication.appliedDate, { addSuffix: true })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>
                Track the progress of your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApplication.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.status === mockApplication.status 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {getStatusIcon(event.status)}
                      </div>
                      {index < mockApplication.timeline.length - 1 && (
                        <div className="h-full w-0.5 bg-muted mt-1"></div>
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">
                          {getStatusText(event.status)}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {format(event.date, "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>
                    {mockApplication.jobDetails.locationType === "onsite" && `${mockApplication.jobDetails.location} (On-site)`}
                    {mockApplication.jobDetails.locationType === "remote" && "Remote"}
                    {mockApplication.jobDetails.locationType === "hybrid" && `${mockApplication.jobDetails.location} (Hybrid)`}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Posted 1 day ago</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge>{mockApplication.jobDetails.category}</Badge>
                <Badge variant="outline">
                  {mockApplication.jobDetails.locationType === "onsite" && "On-site"}
                  {mockApplication.jobDetails.locationType === "remote" && "Remote"}
                  {mockApplication.jobDetails.locationType === "hybrid" && "Hybrid"}
                </Badge>
              </div>

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {mockApplication.jobDetails.description}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Requirements</h3>
                <ul className="space-y-1">
                  {mockApplication.jobDetails.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Benefits</h3>
                <ul className="space-y-1">
                  {mockApplication.jobDetails.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Personal Notes
              </CardTitle>
              <CardDescription>
                Keep track of your thoughts about this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApplication.notes && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">{mockApplication.notes}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="note">Add a note</Label>
                  <Textarea
                    id="note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add any personal notes about this application..."
                    rows={3}
                  />
                  <Button onClick={addNote}>Add Note</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockApplication.status === "offered" && (
                <Button className="w-full">
                  Accept Offer
                </Button>
              )}
              <Button variant="outline" className="w-full">
                Withdraw Application
              </Button>
              <Button variant="outline" className="w-full">
                Contact Organization
              </Button>
            </CardContent>
          </Card>

          {/* NGO Information */}
          <Card>
            <CardHeader>
              <CardTitle>About the Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {mockApplication.ngoName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{mockApplication.ngoName}</h3>
                  <p className="text-sm text-muted-foreground">Verified Organization</p>
                </div>
              </div>
              <Separator />
              <Button asChild variant="outline" className="w-full">
                <Link href={`/ngos/${mockApplication.ngoName}`}>
                  View Organization Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}