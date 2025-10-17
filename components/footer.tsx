import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="font-semibold mb-3">Platform</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/jobs">Jobs</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/ngos">NGOs</Link></li>
              <li><Link href="/volunteers">Volunteers</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Resources</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/guides">Guides</Link></li>
              <li><Link href="/api">API</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Company</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Legal</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} VolunteerNGO. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/status">Status</Link>
            <Link href="/security">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


