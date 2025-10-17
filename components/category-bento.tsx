import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const cats = [
  { title: "Education", query: "education%20workshop", href: "/jobs/categories/education" },
  { title: "Health", query: "healthcare%20volunteers", href: "/jobs/categories/health" },
  { title: "Climate", query: "environment%20volunteers", href: "/jobs/categories/climate" },
  { title: "Operations", query: "operations%20teamwork", href: "/jobs/categories/operations" },
]

export function CategoryBento() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">Explore categories</h2>
        <p className="text-muted-foreground">Find roles that match your mission and skills.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {cats.map((c) => (
          <Link key={c.title} href={c.href}>
            <Card className="group overflow-hidden border transition hover:shadow-sm">
              <CardHeader className="p-0">
                <div className="relative h-40 w-full">
                  <Image
                    src={`/next.svg`}
                    alt={`${c.title} volunteer opportunities`}
                    fill
                    className="object-cover transition group-hover:scale-[1.02]"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
