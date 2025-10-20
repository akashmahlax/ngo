'use client'

import { MacbookScroll } from "@/components/ui/macbook-scroll"
import { Badge } from "@/components/ui/badge"

export function MacbookDemo() {
  return (
    <section className="relative overflow-hidden bg-neutral-950">
      <MacbookScroll
        title={
          <div>
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-400">Platform Preview</Badge>
            <div className="text-white">
              Professional Dashboard <br /> 
              <span className="text-neutral-400">For Volunteers & NGOs</span>
            </div>
          </div>
        }
        src="/hero1.png"
        showGradient={false}
      />
    </section>
  )
}
