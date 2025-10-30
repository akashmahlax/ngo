
import { UserPlus, FileText, Users, TrendingUp, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Organization Profile",
      description: "Sign up and complete your NGO profile with your mission, impact areas, and organizational details. Our verification process ensures credibility.",
      tips: ["Add your logo and cover image", "Clearly state your mission", "Include impact metrics"]
    },
    {
      icon: FileText,
      title: "Post Volunteer Opportunities",
      description: "Create detailed opportunity listings with required skills, time commitments, and expectations. Be specific about the impact volunteers will make.",
      tips: ["Use clear job titles", "List specific skills needed", "Set realistic time expectations"]
    },
    {
      icon: Users,
      title: "Review Applications",
      description: "Browse qualified volunteers who apply to your opportunities. Review their profiles, skills, and experience to find the perfect match.",
      tips: ["Respond promptly to applications", "Ask clarifying questions", "Set up interviews"]
    },
    {
      icon: TrendingUp,
      title: "Track & Manage",
      description: "Use our platform to communicate with volunteers, track their contributions, and measure the impact they're making on your organization.",
      tips: ["Regular check-ins", "Provide feedback", "Recognize contributions"]
    }
  ]

  const benefits = [
    "Access to a pool of skilled professionals",
    "Streamlined application and communication process",
    "Advanced applicant tracking and management",
    "Analytics and impact reporting",
    "Verified volunteer profiles",
    "Support team to help you succeed"
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              How It Works for NGOs
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find skilled volunteers to amplify your impact in four simple steps
            </p>
            <Button asChild size="lg">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {steps.map((step, i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="shrink-0">
                      <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                        <step.icon className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl font-bold text-purple-600">0{i + 1}</span>
                        <h3 className="text-2xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-4 text-lg">{step.description}</p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="font-semibold mb-2 text-sm">💡 Pro Tips:</p>
                        <ul className="space-y-1">
                          {step.tips.map((tip, j) => (
                            <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why NGOs Choose Our Platform</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, i) => (
                <Card key={i} className="border-2">
                  <CardContent className="p-6 flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                    <span className="font-medium">{benefit}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Volunteer?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join hundreds of NGOs already using our platform to connect with talented volunteers.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/signup">Create Free Account</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
