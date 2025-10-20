'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Users, 
  CheckCircle2, 
  Heart,
  BookOpen,
  Stethoscope,
  Leaf,
  Building2,
  ArrowRight,
  Star
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const featuredNGOs = [
  {
    id: "1",
    name: "Teach India Foundation",
    tagline: "Empowering children through quality education",
    description: "Working across 15 states to provide free education to underprivileged children. Over 50,000 students have benefited from our programs.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100&h=100&fit=crop",
    location: "Delhi, India",
    volunteers: 2400,
    category: "Education",
    icon: BookOpen,
    verified: true,
    rating: 4.9,
    opportunities: 24,
    founded: "2015",
    impact: "50,000+ Students Educated"
  },
  {
    id: "2",
    name: "Health For All India",
    tagline: "Bringing healthcare to every doorstep",
    description: "Organizing free medical camps and health awareness programs in rural areas. Providing essential healthcare services to those who need it most.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=100&h=100&fit=crop",
    location: "Mumbai, Maharashtra",
    volunteers: 1800,
    category: "Healthcare",
    icon: Stethoscope,
    verified: true,
    rating: 4.8,
    opportunities: 18,
    founded: "2017",
    impact: "100,000+ Patients Treated"
  },
  {
    id: "3",
    name: "Green Earth Warriors",
    tagline: "Protecting our planet, one action at a time",
    description: "Leading environmental conservation efforts including beach cleanups, tree plantation, and wildlife protection across coastal India.",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop",
    location: "Goa, India",
    volunteers: 3200,
    category: "Environment",
    icon: Leaf,
    verified: true,
    rating: 4.9,
    opportunities: 32,
    founded: "2016",
    impact: "50,000+ Trees Planted"
  },
  {
    id: "4",
    name: "Youth Empowerment Network",
    tagline: "Building tomorrow's leaders today",
    description: "Mentoring underprivileged youth with career guidance, skill training, and personal development programs to help them achieve their dreams.",
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop",
    location: "Bangalore, Karnataka",
    volunteers: 1500,
    category: "Community",
    icon: Heart,
    verified: true,
    rating: 4.7,
    opportunities: 15,
    founded: "2018",
    impact: "5,000+ Youth Mentored"
  }
]

export function FeaturedNGOSection() {
  return (
    <section className="relative bg-white py-20 dark:bg-neutral-950">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <Building2 className="mr-2 h-3 w-3" />
            Verified Partners
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
            Featured NGO Partners
          </h2>
          <p className="mx-auto max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
            Discover verified NGOs making real impact. All organizations are thoroughly vetted for transparency and effectiveness.
          </p>
        </motion.div>

        {/* NGO Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12">
          {featuredNGOs.map((ngo, index) => (
            <motion.div
              key={ngo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
              className="w-full"
            >
              <Link href={`/ngos/${ngo.id}`} className="block">
                <Card className="group relative h-full overflow-hidden border-2 border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-6 shadow-lg transition-all hover:shadow-2xl hover:border-purple-400 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950 dark:hover:border-purple-600 dark:hover:shadow-purple-500/20">
                  {/* Image */}
                  <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                    <Image
                      src={ngo.image}
                      alt={ngo.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Verified Badge */}
                    {ngo.verified && (
                      <div className="absolute right-3 top-3">
                        <Badge className="bg-green-500/90 text-white">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-white/90 text-neutral-900 dark:bg-neutral-900/90 dark:text-white">
                        <ngo.icon className="mr-1 h-3 w-3" />
                        {ngo.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    {/* Logo and Name */}
                    <div className="flex items-start gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-neutral-200 dark:border-neutral-700">
                        <Image
                          src={ngo.logo}
                          alt={`${ngo.name} logo`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-base font-bold text-neutral-900 dark:text-white sm:text-lg">
                          {ngo.name}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {ngo.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
                      {ngo.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800/50">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                          <Users className="h-3 w-3" />
                          Volunteers
                        </div>
                        <p className="mt-1 text-sm font-bold text-neutral-900 dark:text-white">
                          {ngo.volunteers.toLocaleString()}+
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                          <Star className="h-3 w-3 fill-current text-yellow-400" />
                          Rating
                        </div>
                        <p className="mt-1 text-sm font-bold text-neutral-900 dark:text-white">
                          {ngo.rating}/5.0
                        </p>
                      </div>
                    </div>

                    {/* Impact */}
                    <div className="flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-2 dark:bg-purple-500/10">
                      <Heart className="h-4 w-4 fill-current text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-medium text-purple-900 dark:text-purple-300">
                        {ngo.impact}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <MapPin className="h-3 w-3" />
                      {ngo.location} • Founded {ngo.founded}
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/ngos">
            <Button size="lg" variant="outline" className="group">
              Explore All NGOs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
