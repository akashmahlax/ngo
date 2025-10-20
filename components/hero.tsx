'use client'

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, Shield, TrendingUp, Users, Globe, Award, Target } from "lucide-react"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import { Spotlight } from "@/components/ui/spotlight"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { FlipWords } from "@/components/ui/flip-words"
import { ButtonBorder } from "@/components/ui/moving-border"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { SparklesCore } from "@/components/ui/sparkles"
import { motion } from "motion/react"

const impactWords = [
  "meaningful change",
  "verified missions",
  "global impact",
  "skilled volunteers",
]

const stats = [
  { icon: Users, label: "Active Volunteers", value: "12k+" },
  { icon: Globe, label: "Countries", value: "40+" },
  { icon: Target, label: "Projects", value: "1.8k+" },
  { icon: Award, label: "Success Rate", value: "96%" },
]

const capabilitySections = [
  {
    title: "Backgrounds & Effects",
    items: ["Beams", "Spotlight", "Sparkles"],
  },
  {
    title: "Scroll & Motion",
    items: ["Flip Words", "Text Generate", "Moving Border"],
  },
  {
    title: "Cards & Grids",
    items: ["Impact Stats", "Live Stories", "Hero Mosaic"],
  },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0">
        <BackgroundBeamsWithCollision className="absolute inset-0 !h-full opacity-40">
          <div className="hidden" />
        </BackgroundBeamsWithCollision>
        <Spotlight className="-top-32 left-10 h-[60vh] w-[40vw]" fill="rgba(59,130,246,0.35)" />
        <Spotlight className="top-24 left-1/2 h-[70vh] w-[45vw]" fill="rgba(168,85,247,0.25)" />
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={55}
          className="absolute inset-0"
          particleColor="#9ca3af"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          {/* Left Column: Text Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HoverBorderGradient
                as="div"
                containerClassName="w-fit rounded-full !bg-primary/15"
                className="flex items-center gap-2 rounded-full bg-primary/20 px-5 py-2 text-sm font-semibold text-primary"
              >
                <Heart className="size-4" />
                Trusted by 12,000+ Volunteers Worldwide
              </HoverBorderGradient>
            </motion.div>

            {/* Animated Headline */}
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Transform Lives Through
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-3xl font-semibold md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  <FlipWords words={impactWords} className="text-transparent" />
                </span>
              </div>
            </div>

            {/* Subtitle with Text Generate */}
            <TextGenerateEffect
              words="Connect with verified NGOs, discover opportunities aligned with your skills, and track measurable impact across global communities."
              className="max-w-2xl text-base text-muted-foreground md:text-lg"
            />

            {/* CTA Buttons with Moving Border */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <ButtonBorder
                as={Link}
                href="/jobs"
                duration={2800}
                borderRadius="0.75rem"
                className="flex items-center justify-center gap-2 bg-background text-base font-semibold text-foreground"
                containerClassName="h-auto w-full sm:w-auto"
              >
                <Heart className="size-5" />
                Find Opportunities
                <ArrowRight className="size-5" />
              </ButtonBorder>

              <ButtonBorder
                as={Link}
                href="/signup"
                duration={2800}
                borderRadius="0.75rem"
                borderClassName="bg-[radial-gradient(theme(colors.primary.DEFAULT)_40%,transparent_70%)]"
                className="flex items-center justify-center gap-2 bg-primary text-base font-semibold text-primary-foreground"
                containerClassName="h-auto w-full sm:w-auto"
              >
                <Users className="size-5" />
                Join as NGO
              </ButtonBorder>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                <span className="font-medium">100% Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                <span className="font-medium">Real-Time Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="size-5 text-primary" />
                <span className="font-medium">Global Network</span>
              </div>
            </motion.div>

            {/* Capability quick list */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid gap-4 rounded-2xl border border-primary/10 bg-background/60 p-4 backdrop-blur"
            >
              {capabilitySections.map(({ title, items }) => (
                <div key={title} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-foreground/80">{title}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Visual Elements */}
          <div className="relative flex items-center justify-center">
            {/* 3D Card Stack */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md"
            >
              {/* Main Impact Card */}
              <div className="group relative overflow-hidden rounded-3xl border border-primary/15 bg-background/80 p-8 shadow-2xl backdrop-blur xl:p-9">
                {/* Stats Grid */}
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Live Impact</h3>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-500">
                      <span className="size-2 animate-pulse rounded-full bg-emerald-400"></span>
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {stats.map(({ icon: Icon, label, value }, idx) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                        className="space-y-2 rounded-2xl border border-primary/10 bg-background/70 p-4 backdrop-blur transition-colors hover:border-primary/30"
                      >
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-primary/15 p-2">
                            <Icon className="size-4 text-primary" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-foreground">{value}</div>
                        <div className="text-xs text-muted-foreground">{label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Featured Images */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Recent Success Stories</p>
                    <div className="flex -space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        className="relative size-12 overflow-hidden rounded-full border-2 border-background ring-2 ring-primary/40"
                      >
                        <Image src="/hero1.png" alt="Success 1" fill className="object-cover" />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        className="relative size-12 overflow-hidden rounded-full border-2 border-background ring-2 ring-purple-400/50"
                      >
                        <Image src="/ngo1.png" alt="Success 2" fill className="object-cover" />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        className="relative size-12 overflow-hidden rounded-full border-2 border-background ring-2 ring-pink-400/50"
                      >
                        <Image src="/volunteer1.png" alt="Success 3" fill className="object-cover" />
                      </motion.div>
                      <div className="flex size-12 items-center justify-center rounded-full border-2 border-background bg-primary/15 text-xs font-semibold text-primary">
                        +428
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.5) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.5) 0%, transparent 50%)",
                      "radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.5) 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.5) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
