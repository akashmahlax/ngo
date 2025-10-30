
import { Users, Target, Heart, Award, Globe, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              About Our Mission
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're building a platform that connects passionate volunteers with NGOs making real impact. 
              Together, we're creating positive change in communities worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-purple-600 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To democratize volunteering by creating seamless connections between skilled individuals 
                  and organizations driving social change. We believe everyone has the power to make a difference.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <Sparkles className="h-12 w-12 text-pink-600 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A world where every person can easily contribute their skills and time to causes they care about, 
                  and every NGO has access to the talent they need to amplify their impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Users, value: "10,000+", label: "Active Volunteers" },
              { icon: Globe, value: "500+", label: "NGO Partners" },
              { icon: Heart, value: "50,000+", label: "Hours Contributed" },
              { icon: Award, value: "95%", label: "Success Rate" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Transparency",
                  description: "Open communication and honest reporting of impact metrics"
                },
                {
                  title: "Inclusivity",
                  description: "Creating opportunities for everyone regardless of background"
                },
                {
                  title: "Impact First",
                  description: "Focusing on measurable outcomes and real-world change"
                },
                {
                  title: "Innovation",
                  description: "Leveraging technology to solve social challenges"
                },
                {
                  title: "Community",
                  description: "Building supportive networks of changemakers"
                },
                {
                  title: "Integrity",
                  description: "Maintaining the highest ethical standards in all we do"
                },
              ].map((value, i) => (
                <Card key={i} className="border">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2024, our platform was born from a simple observation: talented individuals 
                wanted to volunteer their skills, but finding the right opportunities was difficult. 
                Meanwhile, NGOs struggled to find qualified volunteers.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We set out to bridge this gap by creating a modern, user-friendly platform that makes 
                volunteering as easy as finding a job. Today, we're proud to serve thousands of volunteers 
                and hundreds of NGOs across the globe.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every day, we're inspired by the stories of impact created through our platform - from 
                designers helping small nonprofits rebrand, to developers building critical tools for 
                social enterprises. This is just the beginning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
