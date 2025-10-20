'use client'

import { PinContainer } from "@/components/ui/3d-pin"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Award } from "lucide-react"
import Image from "next/image"

const ngos = [
  {
    title: "Save the Children India",
    href: "/ngos/1",
    location: "New Delhi, India",
    volunteers: "2,500+",
    verified: true,
    category: "Education",
    description: "Working towards ensuring every child has the opportunity to learn and thrive",
  },
  {
    title: "Green Earth Foundation",
    href: "/ngos/2",
    location: "Mumbai, India",
    volunteers: "1,800+",
    verified: true,
    category: "Environment",
    description: "Leading environmental conservation and sustainability initiatives",
  },
  {
    title: "Health For All",
    href: "/ngos/3",
    location: "Bangalore, India",
    volunteers: "3,200+",
    verified: true,
    category: "Healthcare",
    description: "Providing accessible healthcare services to underserved communities",
  },
  {
    title: "Community Connect",
    href: "/ngos/4",
    location: "Chennai, India",
    volunteers: "1,500+",
    verified: true,
    category: "Community",
    description: "Building stronger communities through social development programs",
  },
]

export function NGOShowcase() {
  return (
    <section className="relative bg-neutral-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            Featured NGO Partners
          </h2>
          <p className="mx-auto max-w-2xl text-base text-neutral-400 md:text-lg">
            Verified organizations making real impact in their communities
          </p>
        </div>

        <div className="grid gap-20 sm:grid-cols-2 lg:grid-cols-4">
          {ngos.map((ngo, index) => (
            <PinContainer
              key={index}
              title={ngo.title}
              href={ngo.href}
            >
              <div className="flex h-[250px] w-[280px] flex-col p-4">
                <div className="relative mb-4 h-32 w-full overflow-hidden rounded-lg">
                  <Image
                    src="/hero1.png"
                    alt={ngo.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-base font-bold text-slate-100">
                      {ngo.title}
                    </h3>
                    {ngo.verified && (
                      <Award className="size-4 shrink-0 text-blue-400" />
                    )}
                  </div>
                  
                  <p className="mb-3 line-clamp-2 text-xs text-slate-400">
                    {ngo.description}
                  </p>
                  
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      <span>{ngo.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="size-3" />
                      <span>{ngo.volunteers} Volunteers</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Badge className="text-xs">{ngo.category}</Badge>
                  </div>
                </div>
              </div>
            </PinContainer>
          ))}
        </div>
      </div>
    </section>
  )
}
