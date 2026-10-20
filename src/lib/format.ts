import { siteConfig } from "@/config/site";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: siteConfig.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const wholeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: siteConfig.currency,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return currencyFormatter.format(amount);
}

/** "$150" for marketing copy (thresholds, savings). */
export function formatPriceShort(amount: number) {
  return Number.isInteger(amount) ? wholeFormatter.format(amount) : currencyFormatter.format(amount);
}

export function formatPercent(fraction: number) {
  return `${Math.round(fraction * 100)}%`;
}

export const freeShippingLabel = `Free shipping over ${formatPriceShort(siteConfig.shipping.freeShippingThreshold)}`;
