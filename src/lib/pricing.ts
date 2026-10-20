import { siteConfig } from "@/config/site";
import type { CartLine, Product, ProductVariant } from "@/lib/commerce/types";

export type VolumeTier = (typeof siteConfig.volumeTiers)[number];

export const volumeTiers: readonly VolumeTier[] = siteConfig.volumeTiers;

export function tierFor(quantity: number): VolumeTier {
  return [...volumeTiers].reverse().find((t) => quantity >= t.min) ?? volumeTiers[0];
}

export function discountFor(product: Product, quantity: number) {
  if (product.volumePricing === false) return 0;
  return tierFor(quantity).discount;
}

export function unitPrice(product: Product, variant: ProductVariant, productQuantity: number) {
  const d = discountFor(product, productQuantity);
  return round(variant.price * (1 - d));
}

export function round(n: number) {
  return Math.round(n * 100) / 100;
}

export function priceRange(product: Product) {
  const prices = product.variants.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Lowest compare-at among variants that have one, matched to its variant price. */
export function bestCompare(product: Product) {
  const v = product.variants
    .filter((x) => x.compareAtPrice && x.compareAtPrice > x.price)
    .sort((a, b) => a.price - b.price)[0];
  return v ? { price: v.price, compareAtPrice: v.compareAtPrice! } : undefined;
}

export function isOnSale(product: Product) {
  return Boolean(bestCompare(product));
}

export function totalStock(product: Product) {
  return product.variants.reduce((n, v) => n + v.stock, 0);
}

export type PricedLine = {
  line: CartLine;
  product: Product;
  variant: ProductVariant;
  unitPrice: number;
  basePrice: number;
  lineTotal: number;
  discount: number;
};

/**
 * Prices every cart line. Volume tiers count all variants of the same product
 * together, so 3 × 0703RL + 2 × 0903RL = 5 boxes hits the 5–9 tier.
 */
export function priceCart(lines: CartLine[], lookup: (productId: string) => Product | undefined) {
  const qtyByProduct = new Map<string, number>();
  for (const l of lines) qtyByProduct.set(l.productId, (qtyByProduct.get(l.productId) ?? 0) + l.quantity);

  const priced: PricedLine[] = [];
  for (const line of lines) {
    const product = lookup(line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant) continue;
    const productQty = qtyByProduct.get(product.id) ?? line.quantity;
    const discount = discountFor(product, productQty);
    const u = unitPrice(product, variant, productQty);
    priced.push({
      line,
      product,
      variant,
      unitPrice: u,
      basePrice: variant.price,
      lineTotal: round(u * line.quantity),
      discount,
    });
  }

  const subtotal = round(priced.reduce((n, p) => n + p.lineTotal, 0));
  const undiscounted = round(priced.reduce((n, p) => n + p.basePrice * p.line.quantity, 0));
  const volumeSavings = round(undiscounted - subtotal);
  const itemCount = priced.reduce((n, p) => n + p.line.quantity, 0);
  const threshold = siteConfig.shipping.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, round(threshold - subtotal));
  const qualifiesFreeShipping = subtotal >= threshold;
  const shipping = priced.length === 0 || qualifiesFreeShipping ? 0 : siteConfig.shipping.standardRate;

  return {
    lines: priced,
    subtotal,
    volumeSavings,
    itemCount,
    remainingForFreeShipping,
    qualifiesFreeShipping,
    freeShippingProgress: Math.min(1, subtotal / threshold),
    shipping,
    total: round(subtotal + shipping),
  };
}

export type PricedCart = ReturnType<typeof priceCart>;
