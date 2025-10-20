'use client'

import { Tabs } from "@/components/ui/aceternity-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, Stethoscope, TreePine, Building2 } from "lucide-react"

export function CategoryTabs() {
  const tabs = [
    {
      title: "Education",
      value: "education",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-900 p-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <GraduationCap className="mb-4 size-12 text-purple-300" />
              <h3 className="mb-2 text-2xl font-bold text-white">Education & Teaching</h3>
              <p className="mb-6 text-purple-100">
                Empower communities through education. Teach, mentor, and create learning opportunities for students of all ages.
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                <Badge className="bg-purple-500/20 text-purple-100">Tutoring</Badge>
                <Badge className="bg-purple-500/20 text-purple-100">Adult Education</Badge>
                <Badge className="bg-purple-500/20 text-purple-100">Skill Training</Badge>
                <Badge className="bg-purple-500/20 text-purple-100">Mentorship</Badge>
              </div>
              <Button asChild variant="secondary">
                <Link href="/jobs?category=education">View 150+ Opportunities</Link>
              </Button>
            </div>
            <div className="grid gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Latest Opportunity</CardTitle>
                  <CardDescription className="text-purple-200">English Teacher Needed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-100">Teach English to underprivileged children</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Impact Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">5,000+</p>
                  <p className="text-sm text-purple-200">Students Helped This Year</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Healthcare",
      value: "healthcare",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-red-900 to-pink-900 p-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Stethoscope className="mb-4 size-12 text-red-300" />
              <h3 className="mb-2 text-2xl font-bold text-white">Healthcare & Wellness</h3>
              <p className="mb-6 text-red-100">
                Provide medical support and promote health awareness in underserved communities around the world.
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                <Badge className="bg-red-500/20 text-red-100">Medical Camps</Badge>
                <Badge className="bg-red-500/20 text-red-100">Health Awareness</Badge>
                <Badge className="bg-red-500/20 text-red-100">Mental Health</Badge>
                <Badge className="bg-red-500/20 text-red-100">Nutrition</Badge>
              </div>
              <Button asChild variant="secondary">
                <Link href="/jobs?category=healthcare">View 80+ Opportunities</Link>
              </Button>
            </div>
            <div className="grid gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Latest Opportunity</CardTitle>
                  <CardDescription className="text-red-200">Medical Volunteer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-100">Healthcare support for rural clinics</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Impact Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">10,000+</p>
                  <p className="text-sm text-red-200">Patients Treated This Year</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Environment",
      value: "environment",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-green-900 to-teal-900 p-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <TreePine className="mb-4 size-12 text-green-300" />
              <h3 className="mb-2 text-2xl font-bold text-white">Environment & Conservation</h3>
              <p className="mb-6 text-green-100">
                Protect our planet through conservation projects, sustainability initiatives, and environmental education.
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                <Badge className="bg-green-500/20 text-green-100">Tree Planting</Badge>
                <Badge className="bg-green-500/20 text-green-100">Clean-up Drives</Badge>
                <Badge className="bg-green-500/20 text-green-100">Wildlife</Badge>
                <Badge className="bg-green-500/20 text-green-100">Sustainability</Badge>
              </div>
              <Button asChild variant="secondary">
                <Link href="/jobs?category=environment">View 120+ Opportunities</Link>
              </Button>
            </div>
            <div className="grid gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Latest Opportunity</CardTitle>
                  <CardDescription className="text-green-200">Beach Clean-up</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-100">Coastal conservation project</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Impact Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">50,000+</p>
                  <p className="text-sm text-green-200">Trees Planted This Year</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Community",
      value: "community",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900 to-amber-900 p-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Building2 className="mb-4 size-12 text-orange-300" />
              <h3 className="mb-2 text-2xl font-bold text-white">Community Development</h3>
              <p className="mb-6 text-orange-100">
                Build stronger communities through social programs, infrastructure projects, and empowerment initiatives.
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                <Badge className="bg-orange-500/20 text-orange-100">Social Work</Badge>
                <Badge className="bg-orange-500/20 text-orange-100">Youth Programs</Badge>
                <Badge className="bg-orange-500/20 text-orange-100">Elderly Care</Badge>
                <Badge className="bg-orange-500/20 text-orange-100">Housing</Badge>
              </div>
              <Button asChild variant="secondary">
                <Link href="/jobs?category=community">View 200+ Opportunities</Link>
              </Button>
            </div>
            <div className="grid gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Latest Opportunity</CardTitle>
                  <CardDescription className="text-orange-200">Community Organizer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-100">Help organize local community events</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Impact Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">2,000+</p>
                  <p className="text-sm text-orange-200">Communities Served This Year</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section className="relative bg-white py-20 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Volunteer Categories
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Explore opportunities across different sectors and find your perfect match
          </p>
        </div>

        <div className="h-[40rem]">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </section>
  )
}
