@AGENTS.md

# INKFORGE storefront

B2B tattoo supply store (placeholder brand INKFORGE). Two people commit to this repo from several PCs. Every push to `main` auto-deploys on Vercel.

## Hard rules

- **Never add Claude attribution.** No `Co-Authored-By: Claude` trailers, no "Generated with Claude Code" lines in commits or PRs, never add Claude as a collaborator. Commits are authored by the human only.
- **Never force-push `main`.** Two people push to it.
- Run `git pull` before changing anything, and `npm run build` before every push (a broken build fails the Vercel deploy).
- **Keep this file current.** In the same commit as any code change that affects what is documented here (new pages, routes, folders, data files, config keys, conventions, workflow), update CLAUDE.md to match. Remove anything that is no longer true.
- Next.js 16 with Cache Components: read the bundled docs in `node_modules/next/dist/docs/` before using framework APIs (see AGENTS.md).

## Stack and layout

Next.js 16 (App Router, `cacheComponents` + `partialPrefetching`), TypeScript, Tailwind CSS v4, no backend.

- `src/config/site.ts`: brand name, contact, free-shipping threshold, returns, volume tiers, stats. Single source for all of these.
- `src/app/globals.css` `@theme` block: all design tokens (colors, radius, spacing). One accent color (`--color-acid`), used sparingly. Light theme is the default; the `[data-theme="dark"]` block overrides the same color tokens with the dark palette. Add any new color to both.
- Theme switching: `src/lib/theme.ts` (storage key + inline `<head>` script in `layout.tsx` that applies a saved dark theme before paint) and `src/components/layout/ThemeToggle.tsx` (header button, saves to localStorage). `dark:` utilities follow `data-theme`, not the OS setting.
- `src/data/products.ts`: mock catalogue via `defineProduct()` (variants generated from `options`). Categories, FAQ, testimonials, gallery, needle guide also in `src/data/`.
- `src/lib/commerce/`: provider interface + local mock. UI imports only from here, so Shopify can replace it later.
- `src/lib/store/`: cart and wishlist in localStorage (`useSyncExternalStore`).
- `src/lib/checkout.ts`: mock checkout adapter (swap for Stripe/Shopify).
- `src/components/product/ProductArt.tsx`: SVG placeholder product art until real photos (`photos` field on products). Uses fixed dark studio colors in both themes.

## Conventions

- Product and collection pages use `generateStaticParams` and `export const instant = false` so HTML ships fully prerendered (SEO).
- `useSearchParams` only inside a `<Suspense>` boundary.
- Mobile first, no horizontal overflow at 375px, never disable zoom. Every image gets descriptive alt text.
- Site is `noindex` unless `NEXT_PUBLIC_ALLOW_INDEXING=true`. Keep it off while demo testimonials/stats are live.
- Testimonials, gallery, founder story, stats and contact details are placeholders.
