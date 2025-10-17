import { SiteNavbar } from "@/components/site-navbar"
import { Hero } from "@/components/hero"
import { FeatureCards } from "@/components/feature-cards"
import { CategoryBento } from "@/components/category-bento"
import { StatsStrip } from "@/components/stats-strip"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { ArrowRight, CheckCircle2, Search } from "lucide-react"


export default function HomePage() {
  return (
    <>
     
      <main>
        {/* <Hero /> */}
        {/* Hero Sections of website*/}
        <section className="relative overflow-hidden border-b">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2 md:py-16 lg:py-20">
        <div className="flex flex-col justify-center gap-6">
          <Badge className="w-fit" variant="secondary">
            NGOs + Volunteers
          </Badge>
          <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
            Connect NGOs with skilled volunteers for real impact
          </h1>
          <p className="text-pretty text-muted-foreground md:text-lg">
            Discover mission-aligned projects, streamline applications, and track outcomes with professional analytics.
          </p>

         {/*  <Tabs defaultValue="volunteer" className="mt-2">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="volunteer">I’m a Volunteer</TabsTrigger>
              <TabsTrigger value="ngo">I’m an NGO</TabsTrigger>
            </TabsList>

            <TabsContent value="volunteer">
              <Card>
                <CardContent className="p-4">
                  <div className="grid gap-3">
                    <InputGroup>
                      <InputGroupAddon aria-hidden>
                        <Search className="text-muted-foreground" />
                        <InputGroupText>Role</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput placeholder="e.g. Designer" aria-label="Search role" />
                      <InputGroupAddon align="inline-end" className="gap-2">
                        <Select>
                          <SelectTrigger aria-label="Select category" className="h-7">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="climate">Climate</SelectItem>
                            <SelectItem value="ops">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                        <InputGroupButton asChild>
                          <Link href="/jobs" className="gap-1">
                            Search <ArrowRight className="h-4 w-4" />
                          </Link>
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-primary" /> Verified NGOs
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-primary" /> Skill badges
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-primary" /> Application tracker
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ngo">
              <Card>
                <CardContent className="p-4">
                  <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                    <Input placeholder="Project title e.g. Social media push" aria-label="Project title" />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="gap-1">
                          Create a Job <ArrowRight className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Post a new volunteer role</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3">
                          <Input placeholder="Role title" />
                          <Input placeholder="Location or Remote" />
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="health">Health</SelectItem>
                              <SelectItem value="climate">Climate</SelectItem>
                              <SelectItem value="ops">Operations</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button asChild>
                            <Link href="/ngos/post">Continue</Link>
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs> */}
        {/* 
          Add an image underneath the text, left-bottom side, with a button named "NGO".
          Also add another image to the right side (right column), showing "volunteers collaborating in workspace", with a button in the left-bottom corner.
        */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side: image under text with button (NGO) in bottom-left */}
          <div className="relative flex items-end">
            <img
              src="https://images.unsplash.com/photo-1557660559-42497f78035b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1246"
              alt="NGO meeting"
              className="rounded-lg border object-cover w-full h-64"
              style={{ minHeight: 200 }}
            />
            <Button
              asChild
              className="absolute bottom-4 left-4"
              variant="secondary"
              size="lg"
            >
              <Link href="/ngos">NGO</Link>
            </Button>
          </div>

          {/* Right side: image with volunteers collaborating, button in left-bottom */}
          <div className="relative flex items-end">
            <img
              src="volunteer1.png"
              alt="Volunteers collaborating in workspace"
              className="rounded-lg border object-cover w-full h-64"
              style={{ minHeight: 200 }}
            />
            <Button
              asChild
              className="absolute bg-green-500 bottom-4 left-4"
              size="lg"
            >
              <Link href="/volunteers">Volunteers</Link>
            </Button>
          </div>
        </div>
        <div className="relative order-first aspect-[4/3] overflow-hidden rounded-xl border md:order-last md:aspect-auto">
          <Image
            src="/hero1.png"
            alt="Volunteers collaborating"
            fill
            className="object-cover"
            priority
          />
        </div>

         
        </div>
       
        <div className="relative order-first aspect-[4/3] overflow-hidden rounded-xl border md:order-last md:aspect-auto">
          <Image 
            src="/hero1.png"
            alt="Volunteers collaborating"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
        <StatsStrip />
        <FeatureCards />
        <CategoryBento />

        <section className="container mx-auto px-4 py-12">
          <div className="grid items-center gap-6 rounded-xl border bg-secondary p-6 md:grid-cols-2">
            <div>
              <h2 className="text-balance text-2xl font-semibold md:text-3xl">Ready to create impact?</h2>
              <p className="text-pretty text-muted-foreground">
                Join thousands of volunteers and NGOs collaborating globally.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/signup">Join as Volunteer</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/ngos/post">Post a Job</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border">
              {/* Decorative image to support CTA */}
              <img
                src="/team-high-five-celebration.jpg"
                alt="Team celebrating successful volunteer project"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <Testimonials />
        <FAQ />
      </main>
     {/* <SiteFooter />*/} 
    </>
  )
}
