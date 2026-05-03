---
name: shadcn-ui
description: Conventions for adding/using shadcn components in this monorepo. Use when adding a new shadcn component, importing one in an app, customizing the theme, or adjusting the registry. Keywords - shadcn, ui, component library, packages/ui, "@lots-go/ui".
---

# shadcn-ui in this monorepo

Apps consume shared shadcn components from `@lots-go/ui`. The shadcn CLI is configured in **monorepo mode** (see `apps/web-tanstack/components.json` and `packages/ui/components.json`); base components land in `packages/ui` automatically when added from any app directory.

## Where things live

- **Component source**: `packages/ui/src/components/*.tsx` (shadcn-generated; treat as source you own)
- **Theme tokens**: `packages/ui/src/styles/globals.css` (Tailwind v4 `@theme` block — single source of truth, both apps pick up changes)
- **`cn()` helper**: `@lots-go/ui/lib/utils`
- **App-local components** (non-shadcn, app-specific): under each app's `src/components/`
- **Shared `<Link>` primitive**: `@lots-go/ui/link` — always use this for navigation in any shared component (see "Navigation" below)

## Adding a new shadcn component

Run from any app directory (CLI lands base components in `packages/ui` due to the monorepo config):

```bash
cd apps/web-tanstack
pnpm dlx shadcn@latest add <component-name>
```

Examples: `pnpm dlx shadcn@latest add dialog`, `pnpm dlx shadcn@latest add table form`.

**Never copy registry source by hand.** The CLI's bookkeeping (component registry tracking, dependency resolution) is what makes future `shadcn diff`/`update` work.

## Importing in app code

```tsx
import { Button } from "@lots-go/ui/components/button"
import { Card, CardContent } from "@lots-go/ui/components/card"
import { cn } from "@lots-go/ui/lib/utils"
```

App-local (non-shadcn) components stay under the app's `@/components` alias.

## Navigation in shared components

```tsx
// In any component under packages/ui/, ALWAYS:
import { Link } from "@lots-go/ui/link"
// NEVER: import Link from "next/link"
// NEVER: import { Link } from "@tanstack/react-router"
```

Each app provides its own framework adapter (`<TanStackLinkAdapter>`, future `<NextLinkAdapter>`) via `<LinkProvider>` mounted at the app root. This is the canonical fix for sharing components across two routers. Same pattern would apply to a future `<Image>` primitive — don't pre-build it; add it the first time a shared component needs it.

## Customizing components

- **Prefer composition.** Wrap shadcn components in app-local components, or use the `cn()` helper to override classNames at the call site.
- **`class-variance-authority`** is already in use — if you need new variants, add them in the existing `cva(...)` block of the relevant component.
- **Editing shadcn source directly** is rare. If you must, document the divergence in a comment at the top of the file noting the change and reason — this matters for future `pnpm dlx shadcn@latest diff <component>` checks.

## Theme tokens

Edit `packages/ui/src/styles/globals.css`. The Tailwind v4 `@theme` block defines `--color-*`, `--radius-*`, etc. Both apps consume this via `import "@lots-go/ui/globals.css"` and re-render with the new tokens automatically. Don't duplicate tokens per-app.

## When in doubt

- The shadcn CLI evolves quickly. For unfamiliar commands or new flags, fetch https://ui.shadcn.com/docs rather than relying on memory.
- Monorepo-specific docs: https://ui.shadcn.com/docs/monorepo
- This repo's setup was bootstrapped with `pnpm dlx shadcn@latest init --monorepo --template start --base radix --preset nova`.
