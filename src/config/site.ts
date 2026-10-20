/**
 * Central store configuration.
 * Change the brand name, contact details, shipping rules and volume tiers here —
 * every page, meta tag and policy reads from this file.
 * Colors, fonts, spacing and radius live in `src/app/globals.css` (@theme block).
 */

export const siteConfig = {
  name: "INKFORGE",
  legalName: "INKFORGE Supply Ltd.",
  tagline: "Pro tattoo supplies. Forged for the chair.",
  description:
    "Professional tattoo supplies for artists and studios: sterile cartridge needles, grips, stencil and transfer, machine accessories and studio disposables. Shipped worldwide from Israel.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Demo content (reviews, stats) must not end up in search results. Set
  // NEXT_PUBLIC_ALLOW_INDEXING=true only when launching with real content.
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  locale: "en_US",

  currency: "USD",

  contact: {
    email: "studio@inkforge.example",
    phone: "+972 3 555 0142",
    phoneHref: "+97235550142",
    // Digits only, international format, used for https://wa.me/<number>
    whatsapp: "972525550142",
    whatsappDisplay: "+972 52 555 0142",
    hours: "Sun–Thu, 9:00–18:00 (Israel time)",
    address: {
      street: "12 HaMasger St.",
      city: "Tel Aviv-Yafo",
      postalCode: "6721111",
      country: "Israel",
      countryCode: "IL",
    },
  },

  social: {
    instagram: "https://instagram.com/inkforge.supply",
    instagramHandle: "@inkforge.supply",
    tiktok: "https://tiktok.com/@inkforge.supply",
    facebook: "https://facebook.com/inkforge.supply",
  },

  shipping: {
    /** Orders at or above this subtotal (USD) ship free. Used everywhere. */
    freeShippingThreshold: 150,
    /** Flat rate below the threshold. */
    standardRate: 14,
    expressRate: 32,
    origin: "Israel",
    dispatchTime: "Orders placed before 14:00 (Israel time) ship the same business day.",
    zones: [
      { region: "Israel", standard: "1–3 business days", express: "Next business day" },
      { region: "Europe & UK", standard: "5–9 business days", express: "2–4 business days" },
      { region: "USA & Canada", standard: "6–10 business days", express: "3–5 business days" },
      { region: "Australia & NZ", standard: "8–14 business days", express: "4–6 business days" },
      { region: "Rest of world", standard: "8–18 business days", express: "4–8 business days" },
    ],
  },

  returns: {
    days: 60,
  },

  /**
   * Default tiered volume pricing, applied per product line (all variants of a
   * product count toward the same tier). Products can opt out with
   * `volumePricing: false`.
   */
  volumeTiers: [
    { min: 1, max: 4, discount: 0, label: "1–4 boxes" },
    { min: 5, max: 9, discount: 0.1, label: "5–9 boxes" },
    { min: 10, max: null, discount: 0.15, label: "10+ boxes" },
  ],

  /** Social proof numbers shown on the homepage and about page. */
  stats: {
    artists: "2,400+",
    countries: 38,
    ordersShipped: "61,000+",
    founded: 2019,
  },

  newsletter: {
    incentive: "10% off your first order",
  },
} as const;

export type SiteConfig = typeof siteConfig;
