import type { CartLine } from "@/lib/commerce/types";

/**
 * Checkout adapter.
 *
 * Mock: returns the local /checkout page.
 *
 * Stripe: POST the lines to a route handler (app/api/checkout/route.ts) that
 * calls `stripe.checkout.sessions.create({ line_items, mode: "payment",
 * shipping_address_collection, success_url, cancel_url })`, re-pricing every
 * line on the server, and return `session.url`.
 *
 * Shopify: return `cart.checkoutUrl` from the Storefront API cart.
 */
export async function createCheckout(lines: CartLine[]): Promise<{ url: string }> {
  if (lines.length === 0) throw new Error("Cart is empty");
  return { url: "/checkout" };
}
