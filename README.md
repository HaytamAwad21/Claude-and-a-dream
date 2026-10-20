# INKFORGE — tattoo supply storefront

B2B storefront for professional tattoo artists and studios. Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind CSS v4. Mock catalogue, working cart / wishlist / search / filters, mock checkout.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (prerenders ~95 pages)
npm start          # serve the production build
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://inkforge.com`) in production so canonical URLs, Open Graph tags, the sitemap and JSON-LD use the real domain.

The site is hidden from search engines by default (`noindex` + `robots.txt` disallow) because the reviews and stats are demo content. Set `NEXT_PUBLIC_ALLOW_INDEXING=true` only when launching with real content.

## Change the brand name, contact details, shipping rules

Everything lives in **`src/config/site.ts`**:

- `name`, `legalName`, `tagline`, `description`: brand name used in the header, footer, titles and meta tags
- `contact`: email, phone, WhatsApp number, address
- `shipping.freeShippingThreshold`: the one free-shipping threshold used everywhere (top bar, trust strip, cart meter, FAQ, policies)
- `returns.days`, `volumeTiers` (1–4 / 5–9 / 10+ discounts), `stats` (social proof numbers), `social`

## Change colors, fonts, spacing

Design tokens are in the `@theme` block at the top of **`src/app/globals.css`**:

- Colors: `--color-ink` (background), `--color-bone` (text), `--color-acid` (the single accent), and others. Each token becomes a Tailwind class (`bg-ink`, `text-acid`, …).
- Radius (`--radius-chip/card/panel`), container width, section spacing, easing.
- Fonts are loaded with `next/font` in `src/app/layout.tsx` (Anton for display, Inter for body, JetBrains Mono for labels). Swap the imports there; the CSS variables stay the same.

## Edit products

Products are in **`src/data/products.ts`**. Each entry is a `defineProduct({...})` call:

- `options`: variant axes, e.g. `{ Size: ["03", "05"], Taper: ["Long Taper"] }`. Every combination becomes a variant with its own SKU.
- `price` / `compareAtPrice`, or `priceFor(options)` to price variants differently (e.g. box of 50).
- `stockFor(options, index)`: per-variant stock (default 40). Set 0 to show "sold out".
- `needleConfig`, `packSize`, `packUnit`, `specs`, `tags` (`bestseller`, `new`, …), `includes` for bundles.
- `volumePricing: false` opts a product out of tier discounts (used for bundles).

Best-seller order is `bestSellerSlugs` at the bottom of the file. Categories are in `src/data/categories.ts`, FAQ in `src/data/faq.ts`.

**Images:** products currently render illustrated placeholders (`src/components/product/ProductArt.tsx`). To use real photos, put files in `public/images/products/` and add `photos: ["/images/products/x-1.jpg", "/images/products/x-2.jpg", "/images/products/x-3.jpg"]` (hero, detail, packaging) to the product. Missing entries keep the placeholder. Alt text is generated from the product name; adjust it in `defineProduct` if a photo shows something else.

**Placeholders to replace before launch:** testimonials (`src/data/testimonials.ts`), gallery (`src/data/gallery.ts`), founder story and photo (`src/app/about/page.tsx`), stats in `site.ts`, and the template privacy/terms text.

## Connect Shopify or Stripe later

- **Data:** UI code only imports from `src/lib/commerce` (interface in `provider.ts`, mock data in `local.ts`). Implement the same interface with the Shopify Storefront API and swap the export in `src/lib/commerce/index.ts`.
- **Cart:** `src/lib/store/cart.ts` keeps lines in localStorage. Replace its actions with Storefront API cart mutations (or keep it and re-price on the server).
- **Checkout:** `src/lib/checkout.ts`, `createCheckout()`. Return a Stripe Checkout Session URL (from a route handler that re-prices lines server-side) or Shopify's `cart.checkoutUrl`. `/checkout` is a demo page that takes no payment.
- **Forms:** newsletter, contact and wholesale forms call `submitForm()` in `src/lib/forms.ts`, a stub to point at your email/CRM provider.

## Structure

```
src/
  app/            routes (home, collections/[slug], products/[slug], offers, cart, checkout,
                  wishlist, search, about, shipping, returns, faq, contact, wholesale,
                  privacy, terms), sitemap.ts, robots.ts, opengraph-image.tsx
  components/     layout/ (header, footer, search), cart/, product/, collection/, home/, forms/, ui/
  config/site.ts  brand + business settings
  data/           products, categories, testimonials, gallery, faq
  lib/            commerce/ (provider), store/ (cart, wishlist), pricing, filters, seo, format
```

## SEO

Per-page titles/descriptions and canonical URLs, Open Graph + Twitter tags, generated OG images (site-wide and per product), `sitemap.xml`, `robots.txt`, and JSON-LD for Organization, Product (with offers, shipping, return policy), BreadcrumbList and FAQPage.
