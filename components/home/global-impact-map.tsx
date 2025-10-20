'use client'

import WorldMap from "@/components/ui/world-map"
import { motion } from "motion/react"

export function GlobalImpactMap() {
  const dots = [
    {
      start: { lat: 40.7128, lng: -74.006 }, // New York
      end: { lat: 28.6139, lng: 77.209 }, // Delhi
    },
    {
      start: { lat: 51.5074, lng: -0.1278 }, // London
      end: { lat: -33.8688, lng: 151.2093 }, // Sydney
    },
    {
      start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
      end: { lat: 1.3521, lng: 103.8198 }, // Singapore
    },
    {
      start: { lat: -23.5505, lng: -46.6333 }, // São Paulo
      end: { lat: 19.4326, lng: -99.1332 }, // Mexico City
    },
    {
      start: { lat: 48.8566, lng: 2.3522 }, // Paris
      end: { lat: 55.7558, lng: 37.6173 }, // Moscow
    },
  ]

  return (
    <section className="relative bg-white py-20 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Global Impact Network
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Volunteers and NGOs from 50+ countries collaborating to create positive change worldwide
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          <WorldMap dots={dots} />
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-primary">50+</p>
            <p className="mt-2 text-sm text-muted-foreground">Countries</p>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-primary">200+</p>
            <p className="mt-2 text-sm text-muted-foreground">Cities</p>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-primary">5M+</p>
            <p className="mt-2 text-sm text-muted-foreground">Lives Impacted</p>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-primary">24/7</p>
            <p className="mt-2 text-sm text-muted-foreground">Active Projects</p>
          </div>
        </div>
      </div>
    </section>
  )
}
