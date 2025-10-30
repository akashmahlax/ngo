
import { Check, Zap, Crown, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      icon: Zap,
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Apply to unlimited opportunities",
        "Create basic profile",
        "Browse NGO directory",
        "Email notifications",
        "Community access"
      ],
      cta: "Get Started",
      href: "/signup",
      popular: false
    },
    {
      name: "Pro",
      icon: Crown,
      price: "$9",
      period: "/month",
      description: "For serious volunteers",
      features: [
        "Everything in Free",
        "Featured profile listing",
        "Priority application review",
        "Advanced profile customization",
        "Skill badges & certifications",
        "Analytics dashboard",
        "Direct messaging with NGOs"
      ],
      cta: "Upgrade to Pro",
      href: "/upgrade",
      popular: true
    },
    {
      name: "NGO Basic",
      icon: Building2,
      price: "$49",
      period: "/month",
      description: "For small organizations",
      features: [
        "Post up to 5 opportunities/month",
        "Access to volunteer database",
        "Basic applicant tracking",
        "Organization profile page",
        "Email support",
        "Monthly analytics report"
      ],
      cta: "Start Free Trial",
      href: "/signup",
      popular: false
    },
    {
      name: "NGO Premium",
      icon: Building2,
      price: "$149",
      period: "/month",
      description: "For growing organizations",
      features: [
        "Unlimited opportunity postings",
        "Featured organization listing",
        "Advanced applicant tracking",
        "Custom branding",
        "API access",
        "Priority support",
        "Dedicated account manager",
        "White-label reports"
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you. All plans include access to our core platform features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {plans.map((plan, i) => (
            <Card key={i} className={`relative border-2 ${plan.popular ? 'border-purple-500 shadow-xl scale-105' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <plan.icon className="h-10 w-10 mb-2 text-purple-600" />
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I switch plans at any time?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
              },
              {
                q: "Is there a free trial for paid plans?",
                a: "We offer a 14-day free trial for all NGO plans. No credit card required to start your trial."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and PayPal. For enterprise plans, we also accept bank transfers."
              },
              {
                q: "Do you offer discounts for nonprofits?",
                a: "Yes! We offer special pricing for verified nonprofit organizations. Contact our sales team for details."
              },
              {
                q: "What happens if I cancel my subscription?",
                a: "You can cancel anytime. You'll retain access until the end of your billing period, after which your account will revert to the free plan."
              }
            ].map((faq, i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">Our team is here to help you find the right plan for your needs.</p>
          <Button asChild size="lg">
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
