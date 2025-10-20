'use client'

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Clock, 
  Users, 
  Calendar,
  BookOpen,
  Stethoscope,
  Leaf,
  Heart,
  ArrowRight
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const recentJobs = [
  {
    id: "1",
    title: "English Teacher for Underprivileged Children",
    ngo: "Teach India Foundation",
    ngoLogo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100&h=100&fit=crop",
    location: "Delhi, India",
    type: "Part-time",
    duration: "3 months",
    volunteersNeeded: 5,
    category: "Education",
    icon: BookOpen,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    description: "Teach English to children from low-income families. Help them improve their communication skills and academic performance.",
    skills: ["Teaching", "Communication", "Patience"],
    postedDate: "2 days ago"
  },
  {
    id: "2",
    title: "Medical Camp Volunteer - Rural Healthcare",
    ngo: "Health For All India",
    ngoLogo: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=100&h=100&fit=crop",
    location: "Mumbai, Maharashtra",
    type: "One-time",
    duration: "1 day",
    volunteersNeeded: 10,
    category: "Healthcare",
    icon: Stethoscope,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    description: "Assist in organizing and conducting free health checkup camps in rural areas. Help with registration and basic health screening.",
    skills: ["Healthcare", "Organization", "Compassion"],
    postedDate: "3 days ago"
  },
  {
    id: "3",
    title: "Beach Cleanup Drive Coordinator",
    ngo: "Green Earth Warriors",
    ngoLogo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop",
    location: "Goa, India",
    type: "One-time",
    duration: "Half day",
    volunteersNeeded: 20,
    category: "Environment",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80",
    description: "Lead a beach cleanup initiative to remove plastic waste and promote environmental awareness among locals and tourists.",
    skills: ["Leadership", "Environmental awareness", "Teamwork"],
    postedDate: "5 days ago"
  },
  {
    id: "4",
    title: "Youth Mentorship Program - Life Skills",
    ngo: "Youth Empowerment Network",
    ngoLogo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop",
    location: "Bangalore, Karnataka",
    type: "Part-time",
    duration: "6 months",
    volunteersNeeded: 8,
    category: "Community",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80",
    description: "Mentor teenagers from underserved communities. Guide them in career planning, life skills, and personal development.",
    skills: ["Mentoring", "Communication", "Leadership"],
    postedDate: "1 week ago"
  }
]

export function RecentJobsSection() {
  return (
    <section className="relative bg-white py-20 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <Calendar className="mr-2 h-3 w-3" />
            Latest Opportunities
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
            Recent Volunteer Opportunities
          </h2>
          <p className="mx-auto max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
            Find meaningful ways to contribute. All opportunities are from verified NGOs with real impact.
          </p>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-8">
          {recentJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CardContainer className="w-full">
                <CardBody className="group/card relative h-full w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                  {/* Image */}
                  <CardItem translateZ="100" className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                    <Image
                      src={job.image}
                      alt={job.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute left-3 top-3">
                      <Badge className="bg-white/90 text-neutral-900 dark:bg-neutral-900/90 dark:text-white">
                        <job.icon className="mr-1 h-3 w-3" />
                        {job.category}
                      </Badge>
                    </div>

                    {/* Posted Date */}
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="secondary" className="bg-white/90 text-xs dark:bg-neutral-900/90">
                        {job.postedDate}
                      </Badge>
                    </div>
                  </CardItem>

                  {/* Content */}
                  <div className="space-y-4">
                    {/* NGO Info */}
                    <CardItem translateZ="50" className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-neutral-200 dark:border-neutral-700">
                        <Image
                          src={job.ngoLogo}
                          alt={job.ngo}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{job.ngo}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Verified NGO</p>
                      </div>
                    </CardItem>

                    {/* Title */}
                    <CardItem translateZ="60" as="h3" className="text-xl font-bold text-neutral-900 dark:text-white">
                      {job.title}
                    </CardItem>

                    {/* Description */}
                    <CardItem translateZ="50" className="text-sm text-neutral-600 dark:text-neutral-400">
                      {job.description}
                    </CardItem>

                    {/* Meta Info */}
                    <CardItem translateZ="40" className="flex flex-wrap gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {job.volunteersNeeded} needed
                      </div>
                    </CardItem>

                    {/* Skills */}
                    <CardItem translateZ="30" className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </CardItem>

                    {/* CTA */}
                    <CardItem translateZ="80" className="pt-2">
                      <Link href={`/jobs/${job.id}`} className="w-full">
                        <Button className="group w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/jobs">
            <Button size="lg" variant="outline" className="group">
              View All Opportunities
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
