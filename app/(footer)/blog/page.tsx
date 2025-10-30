
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BlogPage() {
  const posts = [
    {
      title: "10 Tips for Creating an Effective Volunteer Profile",
      excerpt: "Learn how to showcase your skills and experience to stand out to NGOs looking for talented volunteers.",
      author: "Sarah Johnson",
      date: "Oct 25, 2025",
      readTime: "5 min read",
      category: "Volunteers",
      image: "🎯"
    },
    {
      title: "How to Measure Volunteer Impact in Your Organization",
      excerpt: "A comprehensive guide for NGOs on tracking and reporting the value volunteers bring to your mission.",
      author: "Michael Chen",
      date: "Oct 22, 2025",
      readTime: "8 min read",
      category: "NGOs",
      image: "📊"
    },
    {
      title: "The Rise of Skills-Based Volunteering in 2025",
      excerpt: "Explore how professional volunteering is transforming the nonprofit sector and creating mutual value.",
      author: "Emily Rodriguez",
      date: "Oct 18, 2025",
      readTime: "6 min read",
      category: "Trends",
      image: "🚀"
    },
    {
      title: "Building a Successful Remote Volunteer Program",
      excerpt: "Best practices for NGOs managing distributed volunteer teams in an increasingly digital world.",
      author: "David Park",
      date: "Oct 15, 2025",
      readTime: "7 min read",
      category: "NGOs",
      image: "💻"
    },
    {
      title: "5 Ways Volunteering Can Boost Your Career",
      excerpt: "Discover how strategic volunteering can help you develop new skills and expand your professional network.",
      author: "Lisa Thompson",
      date: "Oct 12, 2025",
      readTime: "5 min read",
      category: "Volunteers",
      image: "⭐"
    },
    {
      title: "Creating Inclusive Volunteer Opportunities",
      excerpt: "How to design volunteer programs that welcome people of all backgrounds, abilities, and experiences.",
      author: "James Wilson",
      date: "Oct 8, 2025",
      readTime: "6 min read",
      category: "Best Practices",
      image: "🤝"
    }
  ]

  const categories = ["All", "Volunteers", "NGOs", "Trends", "Best Practices"]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Blog & Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, tips, and stories to help you make the most of volunteering
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((cat, i) => (
              <Button key={i} variant={i === 0 ? "default" : "outline"} className="rounded-full">
                {cat}
              </Button>
            ))}
          </div>

          {/* Featured Post */}
          <Card className="mb-12 border-2 overflow-hidden bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <div className="md:flex">
              <div className="md:w-1/2 p-12 flex items-center justify-center text-8xl">
                🎉
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4">Featured</Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Announcing: New Matching Algorithm for Better Connections
                </h2>
                <p className="text-muted-foreground mb-6">
                  We're excited to introduce our enhanced matching system that uses AI to connect volunteers 
                  with the most relevant opportunities based on skills, interests, and availability.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Oct 28, 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    10 min read
                  </span>
                </div>
                <Button>
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Card key={i} className="border-2 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="text-6xl mb-4">{post.image}</div>
                  <Badge variant="secondary" className="w-fit mb-2">
                    <Tag className="h-3 w-3 mr-1" />
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-bold line-clamp-2">{post.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground w-full">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="#">
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>

          {/* Newsletter */}
          <Card className="mt-16 border-2 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest insights on volunteering, nonprofit management, and social impact.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-2 bg-white dark:bg-neutral-900"
                />
                <Button size="lg">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
