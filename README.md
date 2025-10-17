## Volunteer-NGO Job Platform

Professional homepage implemented with Tailwind v4 and shadcn/ui components, plus dark mode via `next-themes`.

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Tech
- Next.js 15 (App Router)
- Tailwind CSS v4
- shadcn/ui (Radix primitives)
- next-themes (dark mode)
- lucide-react (icons)

### Structure
- `app/layout.tsx` includes global styles, Navbar, Footer, ThemeProvider
- `app/page.tsx` contains the professional homepage sections
- `components/ui/*` shadcn/ui primitives
- `components/navbar.tsx` responsive top nav with theme toggle
- `components/footer.tsx` site footer
