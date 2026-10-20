import { siteConfig } from "@/config/site";
import { formatPriceShort } from "@/lib/format";

const threshold = formatPriceShort(siteConfig.shipping.freeShippingThreshold);

export type FaqGroup = { title: string; items: { q: string; a: string }[] };

export const faq: FaqGroup[] = [
  {
    title: "Orders & shipping",
    items: [
      {
        q: "Do you ship worldwide?",
        a: `Yes. We ship from ${siteConfig.shipping.origin} to more than ${siteConfig.stats.countries} countries with tracked courier services. Every order includes a tracking number.`,
      },
      {
        q: "How much is shipping?",
        a: `Shipping is free on orders over ${threshold}. Below that, standard tracked shipping is a flat ${formatPriceShort(siteConfig.shipping.standardRate)} and express is ${formatPriceShort(siteConfig.shipping.expressRate)}.`,
      },
      {
        q: "When will my order ship?",
        a: siteConfig.shipping.dispatchTime,
      },
      {
        q: "Will I pay customs or import duties?",
        a: "Orders shipped outside Israel may be subject to local import duties and VAT, which are set by your country and paid on delivery. Studio accounts can request DDP (duties paid) shipping to the EU, UK and USA.",
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        q: "Are your cartridge needles sterile?",
        a: "Every cartridge is sterilized with ethylene oxide (EO), sealed in an individual blister and labelled with a lot number and expiry date. Each lot ships with a sterilization certificate on request.",
      },
      {
        q: "What do RL, RS, M1 and RM mean?",
        a: "RL is Round Liner (tight circle for lines), RS is Round Shader (looser circle for fill and bold lines), M1 is a stacked Magnum (flat, for colour packing) and RM is a Curved or Round Magnum (soft edge for smooth shading).",
      },
      {
        q: "How do I read a code like 1203RL?",
        a: "The first two digits are the needle diameter (10 = 0.30 mm, 12 = 0.35 mm), the next two are the number of needles in the group, and the letters are the configuration. So 1203RL is three 0.35 mm needles in a round liner.",
      },
      {
        q: "Do you sell tattoo ink or aftercare?",
        a: "No. We focus on hardware and disposables. Inks and aftercare are regulated differently in every market, so we leave those to specialist local suppliers.",
      },
    ],
  },
  {
    title: "Pricing & accounts",
    items: [
      {
        q: "How does volume pricing work?",
        a: `Discounts apply automatically in your cart, per product: ${siteConfig.volumeTiers
          .map((t) => `${t.label} ${t.discount ? `save ${Math.round(t.discount * 100)}%` : "at list price"}`)
          .join(", ")}. Mixing sizes or tapers of the same product counts toward the same tier.`,
      },
      {
        q: "Do you offer studio or wholesale accounts?",
        a: "Yes. Studios and distributors can apply for an account with deeper tier pricing, net-30 terms and a dedicated rep. Apply on our Wholesale page.",
      },
      {
        q: "What is your return policy?",
        a: `Unopened products can be returned within ${siteConfig.returns.days} days of delivery for a full refund. For hygiene reasons, opened sterile products cannot be returned unless faulty.`,
      },
    ],
  },
];
