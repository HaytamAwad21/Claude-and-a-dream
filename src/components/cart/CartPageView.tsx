"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { createCheckout } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { cartActions, useCart, useHydrated } from "@/lib/store/cart";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingMeter } from "./FreeShippingMeter";

export function CartPageView() {
  const cart = useCart();
  const hydrated = useHydrated();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-card bg-surface" aria-label="Loading cart" />;
  }

  if (cart.lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 border border-dashed border-line py-24 text-center">
        <p className="display text-5xl text-faint">Your cart is empty</p>
        <p className="max-w-sm text-muted">Restock your station with sterile needles, grips and disposables.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/collections/cartridge-needles" arrow>
            Shop needles
          </ButtonLink>
          <ButtonLink href="/collections/bundles-kits" variant="outline">
            Studio kits
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <section aria-labelledby="cart-items-title" className="lg:col-span-8">
        <h2 id="cart-items-title" className="sr-only">
          Items in your cart
        </h2>
        <div className="mb-2 hidden grid-cols-[1fr_auto] border-b border-line pb-3 sm:grid">
          <span className="eyebrow text-faint">Product</span>
          <span className="eyebrow text-faint">Total</span>
        </div>
        <ul className="divide-y divide-line border-b border-line">
          {cart.lines.map((item) => (
            <CartLineItem key={item.variant.id} item={item} />
          ))}
        </ul>
        <button
          type="button"
          onClick={() => cartActions.clear()}
          className="eyebrow mt-4 text-[10px] text-faint transition-colors hover:text-danger"
        >
          Clear cart
        </button>
      </section>

      <aside aria-labelledby="summary-title" className="lg:col-span-4">
        <div className="space-y-5 rounded-panel border border-line bg-charcoal p-6 lg:sticky lg:top-[calc(var(--spacing-header)+1.5rem)]">
          <h2 id="summary-title" className="display text-3xl">
            Order summary
          </h2>
          <FreeShippingMeter cart={cart} />
          <dl className="space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal ({cart.itemCount} items)</dt>
              <dd className="font-mono text-bone">{formatPrice(cart.subtotal + cart.volumeSavings)}</dd>
            </div>
            {cart.volumeSavings > 0 && (
              <div className="flex justify-between text-acid">
                <dt>Volume savings</dt>
                <dd className="font-mono">−{formatPrice(cart.volumeSavings)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Standard shipping</dt>
              <dd className="font-mono text-bone">{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-4 text-base">
              <dt className="font-semibold text-bone">Estimated total</dt>
              <dd className="font-mono text-xl text-bone">{formatPrice(cart.total)}</dd>
            </div>
          </dl>
          <p className="text-xs text-faint">
            Import duties and VAT may apply outside {siteConfig.shipping.origin}. Prices in {siteConfig.currency}.
          </p>
          <Button
            size="lg"
            className="w-full"
            arrow
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const { url } = await createCheckout(cart.lines.map((l) => l.line));
              router.push(url);
            }}
          >
            {loading ? "Preparing checkout…" : "Secure checkout"}
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-faint">
            <Icon name="lock" size={14} /> SSL-encrypted · Visa, Mastercard, Amex, PayPal
          </p>
        </div>
      </aside>
    </div>
  );
}
