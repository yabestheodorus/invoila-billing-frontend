# Invoila — Frontend

Web client for **Invoila**, a real-time invoice & payment platform for Indonesian SMEs.
Built on the Next.js App Router; renders server-side from the NestJS API and handles
auth, invoicing, the public payment page, and the owner dashboard.

> Pairs with the Invoila backend (NestJS API). The frontend is a thin view layer — it
> fetches ready-to-render view models and does not mimic the database.

## Tech stack

| Layer       | Choice                                       |
| ----------- | -------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)           |
| UI runtime  | React 19                                     |
| Styling     | Tailwind CSS v4 (CSS-first, no config file)  |
| Language    | TypeScript (strict)                          |
| Forms       | TanStack React Form + Zod (Standard Schema)  |
| Auth        | Supabase (`@supabase/ssr`)                   |
| Icons       | react-icons (Feather set)                    |
| Toasts      | sonner                                       |
| Package mgr | npm                                          |

## Getting started

```bash
npm install
# create .env.local with the variables below
npm run dev      # http://localhost:3000
```

The backend must be running (default `http://localhost:3001`) for data to load.

### Environment variables (`.env.local`)

| Variable                               | Purpose                         |
| -------------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL (auth)     |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `NEXT_PUBLIC_API_URL`                  | Base URL of the NestJS API      |

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm start`     | Serve the production build |
| `npm run lint`  | ESLint                     |

## Project structure

```
app/
  (auth)/        login, signup, forgot/reset password
  (app)/         authenticated shell — dashboard, invoices, payments,
                 reminders, settings, onboarding
  pay/[token]/   public payment page (no auth chrome)
  proxy.ts       route protection (Next 16 renamed middleware -> proxy)
components/      UI, per-page folders + shared/ for cross-page pieces
lib/             utilities & API clients (api/, supabase/, format, …) — values only
types/           all TypeScript types & Zod schemas, per domain
```

## Conventions

- **Types & Zod live in `types/`** (per-domain files); `lib/` holds utilities/values
  only — import explicitly, no barrel.
- **Server Components by default.** Add `'use client'` only when interactivity needs it.
- **Route groups** `(auth)` / `(app)` separate chrome without affecting URLs.
- **Not a database.** Types are view models — embed related objects; don't replicate
  FK-style fields the UI never renders.
- **Icons via react-icons** — never hand-roll SVGs. Use the design tokens in
  `app/globals.css` (see `DESIGN_SYSTEM.md`), not raw color literals.

## Notes

- This Next.js version has **breaking changes vs. older docs** (async `params`/
  `searchParams`, the `proxy` file convention, no `next lint`). See `AGENTS.md` and the
  bundled docs under `node_modules/next/dist/docs/` before writing Next.js code.
- Route protection is **UX only** (checks for the Supabase session cookie); the backend
  validates the JWT on every API call — that is where security lives.
