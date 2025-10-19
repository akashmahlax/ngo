# Copilot instructions for this repo

## Project snapshot
- Stack: Next.js 15 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui, lucide-react, next-themes; MongoDB + NextAuth present in `lib/` and `app/api/*`.
- Dev: `npm run dev` (turbopack). Build: `npm run build`. Lint: `npm run lint`. Start: `npm start`.
- Git workflow: use VS Code task “Git: Add/Commit/Push” or `npm run sync -- "type(scope): subject"`.

## Architecture and patterns
- App Router with Server/Client split:
  - Prefer Server Components for data fetching; use Client Components only for interactivity (mark with "use client").
  - Dynamic routes use Next 15 signature; some pages unwrap `params: Promise<{ id: string }>` in a server shell and render a client component (see `app/jobs/[id]/page.tsx` + `JobDetailClient.tsx`).
- Layouts: `app/layout.tsx` provides global styles, theme, and the universal navbar/footer. Don’t mount duplicate navbars in pages.
- UI primitives live in `components/ui/*` (shadcn). Higher-level site components live in `components/*` (e.g., `universal-navbar.tsx`, cards, sections).

## UI system
- Prefer shadcn/ui primitives (Card, Badge, Button, Input, Tabs, Drawer, Avatar, Separator, etc.).
- Tailwind v4 utility-first styling; keep classnames localized, avoid global CSS. Use gradients/blur sparingly but consistently.
- Icons via `lucide-react`. Dark mode via `next-themes`.
- Some pages employ glassmorphism (backdrop-blur, subtle borders) and responsive grids; match those patterns when adding UI.

## Data and API
- Use API routes under `app/api/*` and helpers in `lib/` (`api-client.ts`, `db.ts`).
- For client fetches, follow `JobDetailClient.tsx`: fetch JSON, handle non-OK with toast (sonner), show skeletons while loading, and friendly empty states.
- Mongo models/collections accessed via `lib/db.ts` conventions; ObjectId validation is used in API.

## Workflows (do this by default)
- Run locally: `npm run dev` → http://localhost:3000.
- After successful edits: `npm run lint` (optional quick check), then `npm run sync -- "feat(scope): short subject"` (PowerShell-compatible) or run the VS Code task.
- Keep diffs small and surgical; don’t reformat unrelated files.

## Conventions
- Use Conventional Commits. Example: `feat(ngos): add stats to profile header`.
- Prefer composition over inheritance; extract small, typed helpers in `lib/` or `hooks/`.
- Accessibility: label inputs, keyboard focus, color contrast; provide loading/empty/error UI.

## Examples from this repo
- Page pattern: `app/ngos/page.tsx` shows professional directory with search, filters, list/grid toggle, loading/empty states using shadcn components.
- Detail pattern: `app/jobs/[id]/JobDetailClient.tsx` shows skeletons, segmented content via Tabs, and a sticky apply card.
- Nav pattern: `components/universal-navbar.tsx` implements mobile drawer + desktop nav; avoid duplicating nav per-page.

## When adding features
- Default to Server Component for data; hoist interactivity into a colocated Client Component only when needed.
- Use shadcn/ui + Tailwind for UI; reuse existing patterns (badges, cards, avatars, hover/active states) for consistency.
- Show a brief plan, then apply a minimal patch. Afterward, validate quickly and commit using the task or sync script.
