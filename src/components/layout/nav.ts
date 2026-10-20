import { categories } from "@/data/categories";

export const mainNav = [
  { label: "Needles", href: "/collections/cartridge-needles" },
  { label: "Shop all", href: "/collections/all", mega: true },
  { label: "Studio kits", href: "/collections/bundles-kits" },
  { label: "Offers", href: "/offers" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "About", href: "/about" },
];

export const shopLinks = [
  ...categories.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })),
  { label: "Special offers", href: "/offers" },
];

export const helpLinks = [
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Wholesale & studio accounts", href: "/wholesale" },
  { label: "Wishlist", href: "/wishlist" },
];

export const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Shipping policy", href: "/shipping" },
  { label: "Returns policy", href: "/returns" },
];
