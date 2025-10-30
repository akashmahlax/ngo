
import { Search, HelpCircle, BookOpen, Users, MessageCircle, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HelpPage() {
  const categories = [
    {
      icon: Users,
      title: "Getting Started",
      description: "Learn the basics of using our platform",
      articles: [
        "How to create an account",
        "Setting up your profile",
        "Understanding user roles",
        "Platform navigation guide"
      ]
    },
    {
      icon: BookOpen,
      title: "For Volunteers",
      description: "Find and apply to opportunities",
      articles: [
        "How to search for opportunities",
        "Creating a strong profile",
        "Application best practices",
        "Managing your applications"
      ]
    },
    {
      icon: Building2,
      title: "For NGOs",
      description: "Post opportunities and manage volunteers",
      articles: [
        "Creating effective job postings",
        "Reviewing applications",
        "Managing your organization profile",
        "Understanding analytics"
      ]
    },
    {
      icon: CreditCard,
      title: "Billing & Plans",
      description: "Manage subscriptions and payments",
      articles: [
        "Upgrading your plan",
        "Payment methods",
        "Refund policy",
        "Canceling your subscription"
      ]
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 mx-auto mb-4 text-purple-600" />
            <h1 className="text-4xl font-bold mb-4">How Can We Help You?</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Search our knowledge base or browse categories below to find answers to your questions.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles..."
                className="pl-12 h-14 text-lg border-2"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {categories.map((category, i) => (
              <Card key={i} className="border-2 hover:border-purple-400 transition-colors">
                <CardHeader>
                  <category.icon className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, j) => (
                      <li key={j}>
                        <Link href="#" className="text-sm text-purple-600 hover:underline">
                          → {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Card className="border-2 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardContent className="p-8">
                <MessageCircle className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Live Chat Support</h3>
                <p className="text-muted-foreground mb-4">
                  Chat with our support team for quick answers to your questions.
                </p>
                <Button>Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="border-2 bg-linear-to-br from-pink-50 to-orange-50 dark:from-pink-950/20 dark:to-orange-950/20">
              <CardContent className="p-8">
                <Mail className="h-10 w-10 text-pink-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Popular Articles */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
            <div className="space-y-4">
              {[
                "How do I reset my password?",
                "What are the different subscription plans?",
                "How do I delete my account?",
                "Can I post multiple opportunities at once?",
                "How does the matching algorithm work?",
                "What payment methods are accepted?"
              ].map((article, i) => (
                <Card key={i} className="border hover:border-purple-400 transition-colors">
                  <CardContent className="p-4">
                    <Link href="#" className="flex items-center justify-between group">
                      <span className="font-medium group-hover:text-purple-600">{article}</span>
                      <span className="text-purple-600">→</span>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Building2, CreditCard } from "lucide-react"
