# Invoila Design System

Warm, Claude-inspired palette: **ivory/cream surfaces, a coral-terracotta orange
accent, and warm near-black text.** Tokens are defined in
[app/globals.css](app/globals.css) and consumed through Tailwind v4 semantic
utilities — **use the tokens, not raw `neutral-*`/`blue-*`/hex values.**

## Color tokens

| Token | Utility examples | Light | Dark | Use for |
|-------|------------------|-------|------|---------|
| `background` | `bg-background` | `#FAF9F5` | `#1F1E1D` | App canvas |
| `surface` | `bg-surface` | `#FFFFFF` | `#262625` | Cards, panels, modals |
| `surface-muted` | `bg-surface-muted` | `#F0EEE6` | `#2E2C29` | Subtle fills, hovers, code blocks |
| `foreground` | `text-foreground` | `#262625` | `#F5F4EE` | Primary text |
| `muted` | `text-muted` | `#6E6B66` | `#A6A199` | Secondary/label text |
| `border` | `border-border` | `#E6E2D8` | `#3A3733` | Dividers, input/card borders |
| `primary` | `bg-primary` / `text-primary` | `#D97757` | `#E08A6B` | Brand accent, primary actions, links |
| `primary-hover` | `hover:bg-primary-hover` | `#C2613F` | `#D97757` | Primary hover state |
| `primary-foreground` | `text-primary-foreground` | `#FFFFFF` | `#211A16` | Text/icons on `primary` |
| `accent` | `bg-accent` | `#F6ECE5` | `#38302B` | Subtle orange tint (selected/hover chips) |
| `accent-foreground` | `text-accent-foreground` | `#8A4B32` | `#F0C9B6` | Text on `accent` |
| `ring` | `ring-ring` / `focus:ring-ring` | `#D97757` | `#E08A6B` | Focus rings |

Text opacity helpers still work: `text-foreground/60`, `text-foreground/40`, etc.

## Typography

- **Body:** Inter — `font-sans` (default).
- **Headings:** Google Sans — applied to `h1`–`h6` automatically; use `font-heading` for non-heading display text (e.g. big numbers).

## Patterns

```tsx
// Primary button
<button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover">
  Save
</button>

// Secondary / ghost button
<button className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted">
  Cancel
</button>

// Card / panel
<div className="rounded-xl border border-border bg-surface p-6">…</div>

// Link
<a className="text-primary hover:underline">Learn more</a>

// Input
<input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30" />
```

## Conventions

- **Default to semantic tokens.** Reach for `bg-surface`, `text-muted`,
  `border-border`, `bg-primary` rather than `bg-white`, `text-neutral-500`,
  `border-neutral-200`, `bg-neutral-900`.
- **One accent.** Orange (`primary`) is the only brand accent — no indigo/blue.
- **Radius:** cards `rounded-xl`/`rounded-2xl`, controls `rounded-lg`/`rounded-md`.
- **Dark mode** flips automatically via `prefers-color-scheme` (tokens already defined).

## Migration status

Tokens + base canvas (cream bg / warm text) are live, and the **auth forms** use
the new `primary`/`link` styles as the reference implementation. Other surfaces
(create-invoice panel, dashboard, tables) still use literal `neutral-*`/white and
can be migrated to tokens incrementally.
