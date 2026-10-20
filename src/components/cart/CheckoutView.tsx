"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { cartActions, useCart, useHydrated } from "@/lib/store/cart";

const input =
  "h-12 w-full rounded-chip border border-line-strong bg-surface px-4 text-sm text-bone placeholder:text-faint focus:border-acid focus:outline-none";

function Field({ id, label, className = "", ...props }: { id: string; label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow mb-2 block text-[11px] text-muted">
        {label}
      </label>
      <input id={id} name={id} className={input} {...props} />
    </div>
  );
}

/**
 * MOCK checkout. No payment is taken and no card fields are collected.
 * Replace the submit handler with a redirect to Stripe Checkout or the
 * Shopify checkout URL (see src/lib/checkout.ts).
 */
export function CheckoutView() {
  const cart = useCart();
  const hydrated = useHydrated();
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [placed, setPlaced] = useState<string | null>(null);

  const shippingCost =
    shipping === "express" ? siteConfig.shipping.expressRate : cart.qualifiesFreeShipping ? 0 : siteConfig.shipping.standardRate;
  const total = cart.subtotal + shippingCost;

  if (placed) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center" role="status">
        <p className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-acid text-on-acid">
          <Icon name="check" size={28} strokeWidth={2.5} />
        </p>
        <h2 className="display text-5xl">Order placed (demo)</h2>
        <p className="mt-4 text-muted">
          Order <span className="font-mono text-bone">{placed}</span> was created in demo mode. No payment was taken.
        </p>
        <ButtonLink href="/" className="mt-8" arrow>
          Back to the shop
        </ButtonLink>
      </div>
    );
  }

  if (!hydrated) return <div className="h-96 animate-pulse rounded-card bg-surface" aria-label="Loading checkout" />;

  if (cart.lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="display text-5xl text-faint">Nothing to check out</p>
        <ButtonLink href="/collections/all" className="mt-8" arrow>
          Browse products
        </ButtonLink>
      </div>
    );
  }

  return (
    <form
      className="grid gap-10 lg:grid-cols-12 lg:gap-14"
      onSubmit={(e) => {
        e.preventDefault();
        if (!e.currentTarget.reportValidity()) return;
        setPlaced(`IF-${Math.floor(100000 + Math.random() * 900000)}`);
        cartActions.clear();
      }}
    >
      <div className="space-y-10 lg:col-span-7">
        <p className="flex items-start gap-3 rounded-card border border-warning/40 bg-warning/5 p-4 text-sm text-bone">
          <Icon name="lock" size={18} className="mt-0.5 shrink-0 text-warning" />
          Demo checkout: no payment is taken. In production this step redirects to Stripe or Shopify’s hosted checkout.
        </p>

        <fieldset className="space-y-4">
          <legend className="display mb-4 text-3xl">Contact</legend>
          <Field id="email" label="Email" type="email" autoComplete="email" required placeholder="you@studio.com" />
          <Field id="studio" label="Studio name (optional)" autoComplete="organization" />
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="display mb-4 text-3xl">Shipping address</legend>
          <Field id="firstName" label="First name" autoComplete="given-name" required />
          <Field id="lastName" label="Last name" autoComplete="family-name" required />
          <Field id="address" label="Address" autoComplete="street-address" required className="sm:col-span-2" />
          <Field id="city" label="City" autoComplete="address-level2" required />
          <Field id="postal" label="Postal code" autoComplete="postal-code" required />
          <Field id="country" label="Country" autoComplete="country-name" required className="sm:col-span-2" />
        </fieldset>

        <fieldset>
          <legend className="display mb-4 text-3xl">Delivery</legend>
          <div className="space-y-2">
            {(
              [
                { id: "standard", label: "Standard tracked", price: cart.qualifiesFreeShipping ? 0 : siteConfig.shipping.standardRate, note: "5–18 business days" },
                { id: "express", label: "Express courier", price: siteConfig.shipping.expressRate, note: "2–8 business days" },
              ] as const
            ).map((o) => (
              <label
                key={o.id}
                className={`flex cursor-pointer items-center gap-4 rounded-card border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-acid ${
                  shipping === o.id ? "border-acid bg-acid/5" : "border-line-strong hover:border-bone"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value={o.id}
                  checked={shipping === o.id}
                  onChange={() => setShipping(o.id)}
                  className="h-4 w-4 accent-[var(--color-acid)]"
                />
                <span className="flex-1">
                  <span className="block text-sm text-bone">{o.label}</span>
                  <span className="block text-xs text-muted">{o.note}</span>
                </span>
                <span className="font-mono text-sm text-bone">{o.price === 0 ? "Free" : formatPrice(o.price)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Button type="submit" size="lg" className="w-full" arrow>
          Place demo order · {formatPrice(total)}
        </Button>
        <p className="text-center text-xs text-faint">
          By placing an order you agree to our <Link href="/terms" className="underline">terms</Link> and confirm you are a
          professional tattoo artist or studio.
        </p>
      </div>

      <aside aria-labelledby="checkout-summary" className="lg:col-span-5">
        <div className="rounded-panel border border-line bg-charcoal p-6 lg:sticky lg:top-[calc(var(--spacing-header)+1.5rem)]">
          <h2 id="checkout-summary" className="display mb-4 text-3xl">
            Summary
          </h2>
          <ul className="divide-y divide-line">
            {cart.lines.map((l) => (
              <li key={l.variant.id} className="flex items-center gap-4 py-3">
                <div className="relative w-14 shrink-0 overflow-hidden rounded-chip">
                  <ProductImage product={l.product} className="aspect-[4/5] w-full" sizes="56px" />
                  <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center bg-bone px-1 font-mono text-[10px] text-ink">
                    {l.line.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-bone">{l.product.name}</p>
                  {l.variant.title !== "Default" && <p className="truncate text-xs text-muted">{l.variant.title}</p>}
                </div>
                <p className="font-mono text-sm text-bone">{formatPrice(l.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-mono">{formatPrice(cart.subtotal)}</dd>
            </div>
            {cart.volumeSavings > 0 && (
              <div className="flex justify-between text-acid">
                <dt>Volume savings included</dt>
                <dd className="font-mono">−{formatPrice(cart.volumeSavings)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="font-mono">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-mono text-xl">{formatPrice(total)}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </form>
  );
}
