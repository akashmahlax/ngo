---
applyTo: '**'
---
Be concise, code-first, and actionable. Start with a short 3–5 bullet plan and 3–5 edge cases. Include a tiny “contract” when helpful (inputs/outputs, error modes, success criteria).
Use TypeScript with strict types. Keep diffs minimal—no drive-by reformatting or broad refactors unless I ask.
Use shadcn/ui for primitives, HeroUI for sections (hero/feature/CTA), and Aceternity UI for premium/interactive components. Prefer installed components; if something is missing, propose the smallest addition.
Always show the final file paths you touched in plain text (not as code blocks). Provide a short diff summary and notes on why the change is safe.
On Windows, format commands for PowerShell (join with ; only when needed). Use bun for all package and script operations.
What should the assistant know about the project and workflow?

Architecture: Favor a layered structure (components/ui, features, pages/routes, lib, hooks, types). Next.js App Router: do data fetching in Server Components; keep interactivity in Client Components ("use client").
UI system: Use shadcn/ui tokens, Tailwind utility classes, and keep a consistent design language (spacing scale, radii, shadows). Define and reuse semantic color tokens for a professional, unified palette across the app.
Libraries:
shadcn/ui for base components
HeroUI for page sections (hero, features, testimonials, CTAs)
Aceternity UI for advanced interactions/effects
Lucide icons
Quality gates: After edits, run fast checks and report PASS/FAIL succinctly:
Build
Lint/Typecheck
Tests (add or update minimal tests when public behavior changes)
Workflow automation: After successful edits and checks, run:
git add . ; git commit -m "conventional message" ; git push
Use Conventional Commits (feat/fix/docs/refactor/chore/style/test/perf/build/ci).
Research policy: Prefer the best current patterns from the official docs. If multiple valid options exist, pick the smallest, most composable solution and explain tradeoffs in one sentence.
Guardrails and preferences

Make at most one reasonable assumption if details are missing; otherwise ask a single clarifying question.
Keep code clean, manageable, consistent, and scalable. Avoid over-abstraction; prefer tiny, composable utilities and components.
Accessibility and UX: Label inputs, support keyboard focus, provide loading/empty/error states, and ensure color contrast.
Performance: Use SSR/SSG appropriately, lazy-load heavy components, next/image, and defer non-critical JS.
Output formatting

Use skimmable headings, short paragraphs, and bullet lists. Include a “Try it” block with optional commands. Summarize changes and verification at the end.
Environment and tools

Package manager: bun (bun add <pkg>, bun run <script>, bunx <cli>).
Shell: Windows PowerShell. Chain with ; only when necessary.
If a new component is needed, propose shadcn first; use HeroUI for full sections; use Aceternity UI for premium interactions.
Post-change routine

Validate: build, lint, typecheck, tests (fast minimal).
Git: git add . ; git commit -m "type(scope): short subject" ; git push
Provide 1–2 safe follow-up suggestions only if they clearly add value.
“What to build” preferences (design + consistency)
Create a professional, beautiful, and cohesive visual language:
Palette: set semantic tokens (bg, card, muted, primary, success, warning, danger). Use gradients tastefully for hero/cta.
Components: compose shadcn primitives; ensure hover/focus/disabled states are consistent.
Layouts: mobile-first, responsive, with consistent spacing and readable line lengths.
Sections: Use HeroUI for hero/feature/testimonials/cta; optionally Aceternity UI for interactive elements.
Power prompts you can reuse
Implement feature with design system
Implement <feature>. Constraints: TypeScript strict, shadcn/ui + HeroUI/Aceternity UI as appropriate, minimal diff, preserve public API. Show plan + edge cases + contract, then apply changes. Validate (build/lint/typecheck/tests) and commit with a Conventional Commit. Provide follow-ups.
Create a new shadcn component
Create <ComponentName> using shadcn/ui. Typed props, accessibility, responsive. Include a minimal usage example in <file>. Validate and commit.
High-quality page section
Build a modern hero/CTA/testimonials section using HeroUI + shadcn primitives. Professional palette, responsive, and accessible. Validate and commit.
Debug/fix with tiny test
Diagnose and fix: <error bug="">. Show root cause, apply smallest fix, add 1–2 focused tests (happy + edge), validate, commit.</error>
Conventional Commit quick guide
feat(scope): user-facing feature
fix(scope): bug fix
docs(scope): docs only
refactor(scope): restructure without behavior change
style(scope): formatting only
test(scope): tests only
chore(scope): tooling/infra
perf(scope): performance improvement
build/ci(scope): build or CI changes
Optional MCP tooling (advanced)
If you’re using an MCP-enabled assistant, define the following tools to make behavior consistent and auditable:

repoRead: read files/folders and return contents (enforce size limits)
repoSearch: semantic or glob search within workspace
bunInstall: bun add/remove packages safely
gitSync: { message: string } → git add . ; git commit -m "<message>" ; git push (validate message against Conventional Commits)
checkQuality: run build/lint/typecheck/tests, return structured PASS/FAIL results
Security/guardrails: whitelist commands, validate inputs, redact secrets, log executions, and scope file operations to the workspace.

Bun and Git commands (PowerShell)
Use bun for everything: