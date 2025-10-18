import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary" aria-hidden />
            <span className="font-semibold">Just Because Asia</span>
          </div>
          <p className="text-sm text-muted-foreground">Connecting NGOs and volunteers to drive measurable impact.</p>
          <Button asChild size="sm" className="w-fit">
            <Link href="/ngos/post">Post a job</Link>
          </Button>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Explore</h3>
          <ul className="grid gap-1 text-sm text-muted-foreground">
            <li>
              <Link href="/jobs">Jobs</Link>
            </li>
            <li>
              <Link href="/ngos">NGOs</Link>
            </li>
            <li>
              <Link href="/volunteers">Volunteers</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Company</h3>
          <ul className="grid gap-1 text-sm text-muted-foreground">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/careers">Careers</Link>
            </li>
            <li>
              <Link href="/press">Press</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Legal</h3>
          <ul className="grid gap-1 text-sm text-muted-foreground">
            <li>
              <Link href="/terms">Terms</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/cookies">Cookies</Link>
            </li>
          </ul>
        </div>
      </div>
      <Separator />
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-6 md:flex-row">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} just because asia. All rights reserved.</p>
        <div className="flex gap-3">
          <Link className="text-xs text-muted-foreground hover:underline" href="/sitemap">
            Sitemap
          </Link>
          <Link className="text-xs text-muted-foreground hover:underline" href="/security">
            Security
          </Link>
        </div>
      </div>
    </footer>
  )
}
