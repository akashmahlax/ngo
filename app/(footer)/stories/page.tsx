
import { Heart, Award, TrendingUp, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function StoriesPage() {
  const stories = [
    {
      name: "Sarah Chen",
      role: "UX Designer",
      avatar: "/placeholder.svg",
      ngo: "Education First",
      impact: "Redesigned donor portal increasing donations by 40%",
      quote: "Volunteering my design skills has been incredibly rewarding. Seeing the real-world impact of my work motivates me every day.",
      hours: 120,
      category: "Design"
    },
    {
      name: "Michael Rodriguez",
      role: "Software Engineer",
      avatar: "/placeholder.svg",
      ngo: "Clean Water Initiative",
      impact: "Built mobile app tracking water distribution to 10,000 families",
      quote: "Using my tech skills to solve real problems in underserved communities has been life-changing.",
      hours: 200,
      category: "Technology"
    },
    {
      name: "Priya Patel",
      role: "Marketing Specialist",
      avatar: "/placeholder.svg",
      ngo: "Youth Empowerment Org",
      impact: "Created social media campaign reaching 500K people",
      quote: "The experience I gained has been invaluable for my career, while helping an amazing cause.",
      hours: 80,
      category: "Marketing"
    },
    {
      name: "James Wilson",
      role: "Accountant",
      avatar: "/placeholder.svg",
      ngo: "Community Food Bank",
      impact: "Streamlined financial processes saving $50K annually",
      quote: "I never thought accounting could be so impactful until I started volunteering with nonprofits.",
      hours: 150,
      category: "Finance"
    }
  ]

  const stats = [
    { icon: Heart, value: "50,000+", label: "Volunteer Hours" },
    { icon: Award, value: "500+", label: "Projects Completed" },
    { icon: TrendingUp, value: "$2M+", label: "Value Created" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Success Stories
            </h1>
            <p className="text-xl text-muted-foreground">
              Real stories from volunteers and NGOs creating meaningful impact together.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-10 w-10 mx-auto mb-3 text-purple-600" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            {stories.map((story, i) => (
              <Card key={i} className="border-2 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={story.avatar} />
                          <AvatarFallback>{story.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg">{story.name}</h3>
                          <p className="text-sm text-muted-foreground">{story.role}</p>
                        </div>
                      </div>
                      <Badge className="mb-2">{story.category}</Badge>
                      <div className="text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground mb-1">Partnered with:</p>
                        <p>{story.ngo}</p>
                        <p className="mt-2">
                          <span className="font-semibold text-foreground">{story.hours}</span> hours contributed
                        </p>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-purple-600 mb-2">IMPACT</h4>
                        <p className="text-lg font-semibold">{story.impact}</p>
                      </div>
                      <div className="relative">
                        <Quote className="h-8 w-8 text-purple-200 absolute -top-2 -left-2" />
                        <blockquote className="pl-6 italic text-muted-foreground border-l-4 border-purple-200">
                          {story.quote}
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Own Success Story?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of volunteers making a difference. Find opportunities that match your skills and passion.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Find Opportunities
            </button>
            <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
              Post an Opportunity
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
