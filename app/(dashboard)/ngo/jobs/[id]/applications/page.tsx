"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, XCircle, User } from "lucide-react"

type Application = {
  _id: string
  volunteerId: string
  status: string
  createdAt: string
  volunteer?: {
    name: string
    email: string
    skills: string[]
    bio: string
  }
}

export default function JobApplications({ params }: { params: { id: string } }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await fetch(`/api/jobs/${params.id}/applications`)
        const data = await res.json()
        if (res.ok) {
          setApplications(data.applications)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadApplications()
  }, [params.id])

  async function updateStatus(applicationId: string, status: string) {
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setApplications(prev => prev.map(app => 
          app._id === applicationId ? { ...app, status } : app
        ))
      }
    } catch (e) {
      console.error(e)
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "applied": return <Clock className="h-4 w-4 text-blue-500" />
      case "review": return <User className="h-4 w-4 text-yellow-500" />
      case "interview": return <User className="h-4 w-4 text-orange-500" />
      case "offered": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-800"
      case "review": return "bg-yellow-100 text-yellow-800"
      case "interview": return "bg-orange-100 text-orange-800"
      case "offered": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-12">Loading...</div>

  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Job Applications</h1>
      
      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No applications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={app.volunteer?.avatarUrl} />
                      <AvatarFallback>
                        {app.volunteer?.name?.slice(0, 2).toUpperCase() || "V"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{app.volunteer?.name || "Volunteer"}</div>
                      <div className="text-sm text-muted-foreground">{app.volunteer?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(app.status)}
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {app.volunteer?.bio && (
                  <p className="text-sm text-muted-foreground mb-4">{app.volunteer.bio}</p>
                )}
                
                {app.volunteer?.skills && app.volunteer.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {app.volunteer.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select value={app.status} onValueChange={(status) => updateStatus(app._id, status)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="offered">Offered</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}