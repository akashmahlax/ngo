import { getCollections } from "@/lib/models"
import { ObjectId } from "mongodb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Users, Building } from "lucide-react"
import { ApplyButton } from "@/components/apply-button"

export default async function JobDetail({ params }: { params: { id: string } }) {
  const { jobs, users } = await getCollections()
  const job = await jobs.findOne({ _id: new ObjectId(params.id) } as any)
  if (!job) return <div className="container mx-auto px-4 py-12">Job not found</div>
  
  const ngo = await users.findOne({ _id: job.ngoId })
  
  return (
    <section className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4">{job.category || "General"}</Badge>
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {ngo?.orgName || ngo?.name || "NGO"}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.locationType === "remote" ? "Remote" : job.locationType === "hybrid" ? "Hybrid" : "On-site"}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">{job.description}</div>
            </CardContent>
          </Card>

          {job.skills && job.skills.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Apply for this role</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplyButton jobId={params.id} />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>About the NGO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">{ngo?.orgName || ngo?.name}</div>
                {ngo?.website && (
                  <div className="text-sm text-muted-foreground">
                    <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {ngo.website}
                    </a>
                  </div>
                )}
                {ngo?.bio && (
                  <div className="text-sm text-muted-foreground">{ngo.bio}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}