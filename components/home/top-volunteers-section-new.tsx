'use client'

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { Carousel, Card } from "@/components/ui/apple-cards-carousel"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Award, Heart, Clock, MapPin } from "lucide-react"

const topVolunteersTestimonials = [
  {
    quote: "Volunteering has transformed my life. I've taught over 500 children and watched them achieve their dreams. The platform makes it easy to track impact and connect with amazing NGOs.",
    name: "Priya Sharma",
    title: "Education Volunteer • 2 Years • 800+ Hours",
    image: "https://images.unsplash.com/photo-1579038773867-044c48829161?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
  },
  {
    quote: "Being part of healthcare outreach programs has been incredibly rewarding. Every medical camp we organize brings hope to underserved communities. Proud to be making a difference.",
    name: "Dr. Rajesh Kumar",
    title: "Healthcare Volunteer • 3 Years • 1200+ Hours",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
  },
  {
    quote: "Environmental conservation is my passion. Through this platform, I've led 50+ cleanup drives and planted thousands of trees. Together, we're creating a greener future.",
    name: "Ananya Verma",
    title: "Environment Volunteer • 18 Months • 600+ Hours",
    image: "https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
  },
  {
    quote: "Mentoring youth from disadvantaged backgrounds is the most fulfilling work I've done. Seeing them grow into confident leaders is my biggest achievement. This platform connected me with my purpose.",
    name: "Arjun Patel",
    title: "Youth Mentor • 2.5 Years • 900+ Hours",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
  },
  {
    quote: "As a software engineer, I wanted to use my skills for social good. This platform helped me find NGOs needing digital transformation. Technology can change lives!",
    name: "Meera Iyer",
    title: "Tech Volunteer • 1 Year • 400+ Hours",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=761"
  },
  {
    quote: "From organizing food drives to disaster relief, volunteering has given me purpose beyond my career. The connections I've made and lives I've touched make every moment worth it.",
    name: "Vikram Singh",
    title: "Community Volunteer • 4 Years • 1500+ Hours",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
  },
]

const topVolunteersCards = [
  {
    category: "Top Educator",
    title: "Priya Sharma - Teaching Excellence Award 2024",
    src: "https://images.unsplash.com/photo-1579038773867-044c48829161?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    content: (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Priya Sharma</h3>
            <p className="mt-1 text-sm text-neutral-300">Education Specialist</p>
          </div>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Award className="mr-1 h-3 w-3" />
            Top Volunteer
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-white/5 p-4">
          <div>
            <p className="text-2xl font-bold text-white">800+</p>
            <p className="text-xs text-neutral-400">Hours</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">500+</p>
            <p className="text-xs text-neutral-400">Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-xs text-neutral-400">NGOs</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-neutral-300">
          Priya has dedicated over 2 years to teaching underprivileged children across Delhi NCR. 
          Her innovative teaching methods have improved literacy rates by 40% in partner schools.
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <MapPin className="h-4 w-4" />
            Delhi, India
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Clock className="h-4 w-4" />
            Active since Jan 2022
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Heart className="h-4 w-4 fill-current text-red-400" />
            Impacted 500+ lives
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Healthcare Hero",
    title: "Dr. Rajesh Kumar - Medical Outreach Champion",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    content: (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Dr. Rajesh Kumar</h3>
            <p className="mt-1 text-sm text-neutral-300">Medical Doctor & Volunteer</p>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Award className="mr-1 h-3 w-3" />
            Healthcare Star
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-white/5 p-4">
          <div>
            <p className="text-2xl font-bold text-white">1200+</p>
            <p className="text-xs text-neutral-400">Hours</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">3000+</p>
            <p className="text-xs text-neutral-400">Patients</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">45</p>
            <p className="text-xs text-neutral-400">Camps</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-neutral-300">
          Dr. Kumar organizes free medical camps in rural Maharashtra, providing healthcare access 
          to thousands who can&apos;t afford treatment. His dedication has saved countless lives.
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <MapPin className="h-4 w-4" />
            Mumbai, Maharashtra
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Clock className="h-4 w-4" />
            Active since Mar 2021
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Heart className="h-4 w-4 fill-current text-red-400" />
            Impacted 3000+ lives
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Environmental Warrior",
    title: "Ananya Verma - Green Planet Ambassador",
    src: "https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    content: (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Ananya Verma</h3>
            <p className="mt-1 text-sm text-neutral-300">Environmental Activist</p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Award className="mr-1 h-3 w-3" />
            Eco Warrior
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-white/5 p-4">
          <div>
            <p className="text-2xl font-bold text-white">600+</p>
            <p className="text-xs text-neutral-400">Hours</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">50+</p>
            <p className="text-xs text-neutral-400">Drives</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">5000+</p>
            <p className="text-xs text-neutral-400">Trees</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-neutral-300">
          Ananya leads environmental initiatives across India. From beach cleanups to tree plantation 
          drives, she&apos;s mobilizing youth to combat climate change and protect nature.
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <MapPin className="h-4 w-4" />
            Bangalore, Karnataka
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Clock className="h-4 w-4" />
            Active since Jun 2022
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Heart className="h-4 w-4 fill-current text-red-400" />
            Greened 50+ areas
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Youth Champion",
    title: "Arjun Patel - Mentor of the Year",
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    content: (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Arjun Patel</h3>
            <p className="mt-1 text-sm text-neutral-300">Youth Development Expert</p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Award className="mr-1 h-3 w-3" />
            Best Mentor
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-white/5 p-4">
          <div>
            <p className="text-2xl font-bold text-white">900+</p>
            <p className="text-xs text-neutral-400">Hours</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">150+</p>
            <p className="text-xs text-neutral-400">Mentees</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">8</p>
            <p className="text-xs text-neutral-400">Programs</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-neutral-300">
          Arjun mentors underprivileged youth in career development and life skills. His guidance 
          has helped 150+ teenagers secure education and employment opportunities.
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <MapPin className="h-4 w-4" />
            Pune, Maharashtra
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Clock className="h-4 w-4" />
            Active since Sep 2021
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Heart className="h-4 w-4 fill-current text-red-400" />
            Changed 150+ futures
          </div>
        </div>
      </div>
    ),
  },
]

export function TopVolunteersSection() {
  return (
    <section className="relative bg-neutral-50 py-20 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <Award className="mr-2 h-3 w-3" />
            Hall of Fame
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
            Meet Our Top Volunteers
          </h2>
          <p className="mx-auto max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
            Celebrating the changemakers who inspire us every day with their dedication and impact.
          </p>
        </motion.div>

        {/* Apple Cards Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Carousel items={topVolunteersCards.map((item, index) => (
            <Card key={`card-${index}`} card={item} index={index} />
          ))} />
        </motion.div>

        {/* Infinite Moving Cards - Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="mb-8 text-center">
            <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl">
              In Their Own Words
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 sm:text-base">
              Real stories from real volunteers making real change
            </p>
          </div>
          
          <div className="overflow-hidden">
            <InfiniteMovingCards
              items={topVolunteersTestimonials}
              direction="right"
              speed="slow"
              pauseOnHover
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
