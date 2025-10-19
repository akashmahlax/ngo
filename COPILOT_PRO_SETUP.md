# GitHub Copilot — Pro Level Setup

This guide gives you copy-paste custom instructions, power prompts, and automation patterns (git sync, tasks, MCP) tailored to this repo.

## Repo context Copilot should know
- Stack: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Lucide icons
- Patterns:
  - Prefer Server Components for data fetching; use Client Components only for interactivity ("use client").
  - Follow shadcn/ui patterns; keep Tailwind classes localized; avoid broad refactors.
  - API utilities exist (e.g., `lib/api-client.ts`), toast errors with `sonner`.
  - Use Conventional Commits and minimal diffs. Respect existing file structure and imports.
- OS/Shell: Windows PowerShell (use `;` to chain commands)

---

## Custom Instructions (copy/paste)
Paste into Copilot Chat → Custom instructions.

1) How should the assistant respond?
- Be concise, actionable, and code-first. Show a short plan, then the changes. Use minimal diffs and keep the public API stable unless asked.
- Use TypeScript types, shadcn/ui components, and Tailwind classnames consistent with the repo.
- On Windows, format commands for PowerShell. Keep one command per line unless chaining with `;` is necessary.
- After edits: validate (lint/typecheck if relevant), summarize changes, and propose 1-2 safe follow-ups.

2) What should the assistant know about the project and workflow?
- Next.js 15 App Router with Server/Client split; keep data fetching in Server Components, interactivity in Client.
- Use existing utilities and conventions (e.g., `apiGet`, `toast` from sonner, `@/components/ui/*`).
- Follow Conventional Commits. After successful edits, stage/commit/push with a clear message. Use Windows PowerShell syntax.
- Prefer small, focused PR-sized changes. Ask one clarifying question only when truly blocked; otherwise make a reasonable assumption and proceed.
- Quality gates: avoid introducing lint/type errors; if unavoidable, note why and suggest a follow-up.

3) Guardrails and preferences
- Don’t mass-reformat unrelated files. Keep changes smallest-possible.
- Write or update minimal tests when changing public behavior; add tiny docs when needed.
- Provide a quick “Try it” section with optional commands.
- Use shadcn/ui patterns; avoid raw CSS unless absolutely necessary.

---

## Power prompts (copy/paste)

- Implement feature safely
> Implement <feature>. Constraints: minimal diff, preserve public API, TypeScript strict, shadcn/ui. Show a 3-bullet plan, edge cases, then edits. Afterward, run lint/typecheck (explain results) and commit with a Conventional Commit.

- Fix a bug with a test
> Reproduce and fix: <bug>. Add a focused test (happy + edge). Keep changes scoped. Summarize root cause, then apply patch. Report build/lint/test status and commit.

- Refactor without breaking behavior
> Refactor <area> to be cleaner and typed, no behavior change. Keep changes surgical. Include a quick diff summary and commit.

- Create a shadcn component
> Create <ComponentName> using shadcn/ui and Tailwind. Props with types, accessible, responsive. Include a minimal usage example and commit.

- Debug an error
> Diagnose error: <paste error>. Trace likely source files, propose fix options, pick the smallest, apply, then verify and commit.

- API route or data layer
> Add API <route/handler> using Next.js App Router conventions. Validate inputs with zod if applicable. Handle errors with proper status codes. Include a minimal client call example and commit.

---

## Git automation (Windows)
Already added:
- NPM script: `npm run sync -- "feat: message"` → runs `git add . ; git commit -m "<msg>" ; git push`
- VS Code task: “Git: Add/Commit/Push” prompts for a message and runs the script.

Optional PowerShell alias (in your profile):
```powershell
function gsync { param([string]$m='chore: sync') git add .; git commit -m "$m"; git push }
```

---

## MCP server (advanced optional)
Use Model Context Protocol (MCP) to expose safe tools to Copilot (e.g., git, fs, HTTP, CI). Benefits: reproducible actions, guardrails, logs.

Conceptual tool: `gitSync`
- Input: `{ message: string }`
- Action: run `git add . ; git commit -m "<message>" ; git push`
- Policy: reject empty messages; enforce Conventional Commits via a regex.

Workflow: After edits, Copilot calls `gitSync({ message })`. You get one auditable place to manage commit policy.

Security tips:
- Whitelist commands; validate inputs; redact secrets; log executions.
- Keep tools idempotent and scoped to workspace.

---

## Quality gates checklist
- Build: PASS
- Lint/Typecheck: PASS (or summarize issues, why they’re deferred)
- Tests: PASS minimal coverage for public behavior changes

---

## Response rubric Copilot should follow
- Contract: inputs/outputs, error modes in 2-4 bullets when relevant.
- Edge cases: list 3-5 and cover them.
- Diffs: smallest-possible, no drive-by reformatting.
- Validation: run and report quick checks.
- Git: Conventional Commit, one concise subject line.

---

## Short conventional commit guide
- feat(scope): user-facing change
- fix(scope): bug fix
- docs(scope): docs only
- refactor(scope): no behavior change
- style(scope): formatting only
- test(scope): tests only
- chore(scope): tooling/infra
- perf(scope): performance
- build/ci(scope): build or CI changes

---

## Example custom instruction snippet (ready to paste)
“Project uses Next.js 15 App Router, TypeScript, Tailwind 4, shadcn/ui. Prefer Server Components; keep client-only logic in "use client" modules. Use existing utilities and toasts. After edits, keep diffs minimal, avoid reformatting, run lint/typecheck if relevant, then stage/commit/push with a Conventional Commit (Windows PowerShell syntax). Ask one clarifying question only if strictly necessary; otherwise make a reasonable assumption and move forward. Provide quick try-it commands, add tiny tests for public behavior changes, and small docs as needed.”
