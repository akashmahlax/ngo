'use client'

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"
import { Heart, Users, Target, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const volunteerImages = [
  {
    url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    name: "Community Impact",
    role: "Teaching & Mentoring",
    volunteers: "2,400+"
  },
  {
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    name: "Healthcare Support",
    role: "Medical Volunteering",
    volunteers: "1,800+"
  },
  {
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    name: "Environmental Action",
    role: "Green Initiatives",
    volunteers: "3,200+"
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    name: "Youth Development",
    role: "Skill Training",
    volunteers: "1,500+"
  },
]

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Gradient Orbs */}
      <div className="absolute left-1/4 top-20 h-72 w-72 animate-pulse rounded-full bg-purple-500/20 blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 h-72 w-72 animate-pulse rounded-full bg-blue-500/20 blur-3xl" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-4 w-fit border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
                <Sparkles className="mr-2 h-3 w-3" />
                India&apos;s #1 Volunteer Platform
              </Badge>
              
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Connect With
                <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"> Purpose & Impact</span>
              </h1>
              
              <p className="mb-8 max-w-xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
                Join 50,000+ volunteers making a real difference. Find verified NGOs, 
                track your contributions, and build a better tomorrow together.
              </p>

              {/* Stats */}
              <div className="mb-10 grid grid-cols-3 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">50K+</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">Active Volunteers</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">1.2K+</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">Verified NGOs</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">2M+</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">Hours Impact</p>
                </motion.div>
              </div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="group w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700">
                    Start Volunteering
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/jobs" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
                    Browse Opportunities
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Content - 3D Draggable Volunteer Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {volunteerImages.map((volunteer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className={index === 1 || index === 2 ? "mt-6 sm:mt-8" : ""}
                >
                  <CardContainer className="w-full">
                    <CardBody className="group/card relative h-full w-full rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition-all hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-950 dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] sm:p-4">
                      <CardItem
                        translateZ="100"
                        className="relative aspect-[3/4] w-full overflow-hidden rounded-lg"
                      >
                        <Image
                          src={volunteer.url}
                          alt={volunteer.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-purple-600/0 transition-all duration-300 group-hover/card:bg-purple-600/10">
                          <div className="scale-0 text-white transition-transform duration-300 group-hover/card:scale-100">
                            <Heart className="h-8 w-8" />
                          </div>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <CardItem translateZ="50" className="text-xs font-semibold sm:text-sm">
                            {volunteer.name}
                          </CardItem>
                          <CardItem translateZ="60" className="text-[10px] text-neutral-300 sm:text-xs">
                            {volunteer.role}
                          </CardItem>
                          <CardItem translateZ="70" className="mt-1 text-[10px] text-purple-300 sm:text-xs">
                            {volunteer.volunteers} volunteers
                          </CardItem>
                        </div>
                      </CardItem>
                    </CardBody>
                  </CardContainer>
                </motion.div>
              ))}
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute -right-2 top-1/2 hidden -translate-y-1/2 sm:-right-4 lg:block"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-xl dark:border-purple-800 dark:bg-neutral-900">
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-neutral-600 dark:text-neutral-400">Live</span>
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">100%</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Verified</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
