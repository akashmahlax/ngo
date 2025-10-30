
import { Lightbulb, Target, MessageSquare, Star, Award, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ApplicationTipsPage() {
  const tips = [
    {
      icon: Target,
      title: "Tailor Your Application",
      description: "Don't send generic applications. Read the opportunity description carefully and highlight how your specific skills match their needs.",
      examples: [
        "Reference specific projects mentioned in the posting",
        "Explain why their mission resonates with you",
        "Connect your experience to their requirements"
      ]
    },
    {
      icon: Star,
      title: "Showcase Relevant Experience",
      description: "Focus on achievements and experiences most relevant to the role. Use specific examples and quantify your impact when possible.",
      examples: [
        "\"Increased website traffic by 40% through SEO optimization\"",
        "\"Managed team of 5 volunteers on community project\"",
        "\"Created fundraising campaign that raised $10,000\""
      ]
    },
    {
      icon: MessageSquare,
      title: "Write a Compelling Message",
      description: "Your application message is your first impression. Make it personal, professional, and passionate.",
      examples: [
        "Start with why you're excited about this opportunity",
        "Keep it concise but meaningful (200-300 words)",
        "End with a clear call to action"
      ]
    },
    {
      icon: Award,
      title: "Highlight Transferable Skills",
      description: "Don't just list job titles. Explain how skills from your professional life can benefit their organization.",
      examples: [
        "Project management → Event coordination",
        "Data analysis → Impact measurement",
        "Customer service → Donor relations"
      ]
    },
    {
      icon: Calendar,
      title: "Be Clear About Availability",
      description: "Set realistic expectations about your time commitment. It's better to under-promise and over-deliver.",
      examples: [
        "Specify exact hours per week you can dedicate",
        "Mention any upcoming availability changes",
        "Be honest about other commitments"
      ]
    },
    {
      icon: Lightbulb,
      title: "Follow Up Professionally",
      description: "If you haven't heard back within the stated timeframe, send a polite follow-up message.",
      examples: [
        "Wait at least the specified response time",
        "Keep follow-ups brief and friendly",
        "Reiterate your interest and availability"
      ]
    }
  ]

  const dos = [
    "Complete your profile 100% before applying",
    "Research the organization thoroughly",
    "Proofread your application for errors",
    "Respond promptly to messages from NGOs",
    "Be genuine and authentic in your communication",
    "Ask thoughtful questions about the role"
  ]

  const donts = [
    "Don't apply to every opportunity without reading",
    "Don't exaggerate your skills or experience",
    "Don't ghost an NGO after they respond",
    "Don't use overly formal or robotic language",
    "Don't forget to mention your motivation",
    "Don't apply if you can't commit to the time requirement"
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Lightbulb className="h-16 w-16 mx-auto mb-4 text-purple-600" />
            <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Application Tips for Volunteers
            </h1>
            <p className="text-lg text-muted-foreground">
              Stand out from other applicants and increase your chances of landing the perfect volunteer opportunity
            </p>
          </div>

          {/* Key Tips */}
          <div className="space-y-6 mb-16">
            {tips.map((tip, i) => (
              <Card key={i} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center shrink-0">
                      <tip.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{tip.description}</p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold mb-2 text-sm">Examples:</p>
                    <ul className="space-y-2">
                      {tip.examples.map((example, j) => (
                        <li key={j} className="text-sm text-muted-foreground pl-4 relative before:content-['→'] before:absolute before:left-0">
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Do's and Don'ts */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">✅ Do's</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dos.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-400">❌ Don'ts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-600 shrink-0">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sample Application */}
          <Card className="border-2 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardHeader>
              <CardTitle>Sample Application Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border-2">
                <p className="mb-3">
                  <strong>Subject:</strong> Application for Social Media Coordinator Role
                </p>
                <div className="space-y-3 text-sm">
                  <p>Dear [Organization Name] Team,</p>
                  <p>
                    I'm excited to apply for the Social Media Coordinator position. As a marketing professional with 5 years of experience 
                    in digital campaigns, I'm passionate about using my skills to amplify the voices of organizations creating positive change.
                  </p>
                  <p>
                    Your mission to provide education access to underserved communities deeply resonates with me. I recently read about your 
                    scholarship program in [specific article/report], and I'd love to help expand your reach through strategic social media.
                  </p>
                  <p>
                    In my current role, I've grown our Instagram following by 200% and increased engagement rates by 45% through data-driven 
                    content strategies. I'm confident I can bring similar results to your organization.
                  </p>
                  <p>
                    I can commit 8-10 hours per week, primarily on weekday evenings and weekend mornings. I'm available to start immediately 
                    and would love to discuss how I can contribute to your team.
                  </p>
                  <p>
                    Thank you for considering my application. I look forward to the opportunity to support your important work.
                  </p>
                  <p>Best regards,<br />[Your Name]</p>
                </div>
              </div>
              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Why this works:</strong> It's personal, specific, shows genuine interest, highlights relevant achievements 
                  with numbers, clearly states availability, and maintains a professional yet warm tone.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
