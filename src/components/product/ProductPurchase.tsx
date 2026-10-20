"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { QuantityInput } from "@/components/cart/QuantityInput";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import type { Product, ProductVariant } from "@/lib/commerce/types";
import { formatPercent, formatPrice, freeShippingLabel } from "@/lib/format";
import { discountFor, round } from "@/lib/pricing";
import { cartActions } from "@/lib/store/cart";
import { VolumePricingTable } from "./VolumePricingTable";
import { WishlistButton } from "./WishlistButton";

function findVariant(product: Product, selected: Record<string, string>) {
  return product.variants.find((v) => Object.entries(selected).every(([k, val]) => v.options[k] === val));
}

const subscribeToHistory = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

/**
 * Variant requested in the URL, e.g. /products/x?size=03 (used by the needle guide).
 * Keys are option names in lowercase with dashes ("size", "pack-size").
 */
function useUrlVariant(product: Product) {
  const search = useSyncExternalStore(subscribeToHistory, () => window.location.search, () => "");
  return useMemo(() => {
    const params = new URLSearchParams(search);
    const wanted: Record<string, string> = {};
    for (const opt of product.options) {
      const value = params.get(opt.name.toLowerCase().replace(/\s+/g, "-"));
      if (value && opt.values.includes(value)) wanted[opt.name] = value;
    }
    if (Object.keys(wanted).length === 0) return undefined;
    const matches = product.variants.filter((v) => Object.entries(wanted).every(([k, val]) => v.options[k] === val));
    return matches.find((v) => v.stock > 0) ?? matches[0];
  }, [product, search]);
}

/** Variant selector, quantity, live tier price and add to cart. */
export function ProductPurchase({ product }: { product: Product }) {
  const fromUrl = useUrlVariant(product);
  const initial = fromUrl ?? product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  const [picked, setPicked] = useState<Record<string, string> | null>(null);
  const selected = picked ?? initial.options;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant: ProductVariant = findVariant(product, selected) ?? initial;
  const discount = discountFor(product, qty);
  const unit = round(variant.price * (1 - discount));
  const soldOut = variant.stock === 0;
  const lowStock = !soldOut && variant.stock <= 8;
  const maxQty = Math.max(1, Math.min(99, variant.stock));

  /** Is a value available given the other current selections? */
  const availability = useMemo(() => {
    const map: Record<string, Record<string, "ok" | "soldout" | "none">> = {};
    for (const opt of product.options) {
      map[opt.name] = {};
      for (const value of opt.values) {
        const v = findVariant(product, { ...selected, [opt.name]: value });
        map[opt.name][value] = !v ? "none" : v.stock > 0 ? "ok" : "soldout";
      }
    }
    return map;
  }, [product, selected]);

  function choose(name: string, value: string) {
    const next = { ...selected, [name]: value };
    // If the combination doesn't exist, fall back to the first variant with this value.
    const v = findVariant(product, next) ?? product.variants.find((x) => x.options[name] === value);
    setPicked(v ? v.options : next);
    setQty((q) => Math.min(q, Math.max(1, v?.stock ?? 1)));
    setAdded(false);
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono">
        <p className={`text-3xl ${variant.compareAtPrice || discount ? "text-acid" : "text-bone"}`}>
          {formatPrice(unit)}
        </p>
        {(variant.compareAtPrice || discount > 0) && (
          <s className="text-lg text-muted">
            <span className="sr-only">Regular price </span>
            {formatPrice(discount > 0 ? variant.price : variant.compareAtPrice!)}
          </s>
        )}
        {discount > 0 && (
          <span className="eyebrow rounded-chip bg-acid px-2 py-1 text-[10px] text-on-acid">
            Volume −{formatPercent(discount)}
          </span>
        )}
        <span className="text-sm text-muted">
          / {product.packSize > 1 ? `${product.packSize} ${product.packUnit}` : product.packUnit}
        </span>
      </div>

      <div className="mt-8 space-y-6">
        {product.options.map((opt) => (
          <fieldset key={opt.name}>
            <legend className="eyebrow mb-3 flex w-full justify-between text-muted">
              <span>{opt.name}</span>
              <span className="text-bone">{selected[opt.name]}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {opt.values.map((value) => {
                const state = availability[opt.name][value];
                const checked = selected[opt.name] === value;
                const id = `opt-${opt.name}-${value}`.replace(/\W+/g, "-");
                return (
                  <div key={value}>
                    <input
                      type="radio"
                      id={id}
                      name={opt.name}
                      value={value}
                      checked={checked}
                      onChange={() => choose(opt.name, value)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={id}
                      className={`relative flex h-11 min-w-12 cursor-pointer items-center justify-center rounded-chip border px-3 text-sm transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-acid ${
                        checked
                          ? "border-bone bg-bone text-ink"
                          : state === "ok"
                            ? "border-line-strong text-bone hover:border-bone"
                            : "border-line text-faint line-through decoration-faint hover:border-line-strong"
                      } ${opt.name === "Size" ? "font-mono" : ""}`}
                    >
                      {value}
                      {state !== "ok" && <span className="sr-only"> (sold out)</span>}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm" aria-live="polite">
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${soldOut ? "bg-danger" : lowStock ? "bg-warning" : "bg-acid"}`}
        />
        <span className={soldOut ? "text-danger" : "text-muted"}>
          {soldOut ? "Sold out in this option" : lowStock ? `Only ${variant.stock} left, ships today` : "In stock, ships today"}
        </span>
        <span className="eyebrow ml-auto text-[10px] text-faint">SKU {variant.sku}</span>
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <QuantityInput value={qty} onChange={(n) => { setQty(n); setAdded(false); }} max={maxQty} label="Quantity" />
        <Button
          size="md"
          className="order-last w-full sm:order-none sm:w-auto sm:min-w-48 sm:flex-1"
          disabled={soldOut}
          onClick={() => {
            cartActions.add(product.id, variant.id, qty);
            setAdded(true);
          }}
        >
          {soldOut ? "Sold out" : added ? <><Icon name="check" size={16} /> Added to cart</> : `Add to cart · ${formatPrice(unit * qty)}`}
        </Button>
        <WishlistButton
          slug={product.slug}
          name={product.name}
          className="ml-auto h-12 w-12 border border-line-strong hover:border-acid sm:ml-0"
        />
      </div>

      <ul className="mt-6 grid gap-2 text-sm text-muted sm:grid-cols-2">
        <li className="flex items-center gap-2"><Icon name="truck" size={16} className="text-faint" /> {freeShippingLabel}</li>
        <li className="flex items-center gap-2"><Icon name="return" size={16} className="text-faint" /> {siteConfig.returns.days}-day returns, unopened</li>
      </ul>

      {product.volumePricing !== false && (
        <div className="mt-10 rounded-card border border-line bg-charcoal p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="eyebrow text-bone">Volume pricing</h2>
            <span className="eyebrow text-[10px] text-faint">Applied automatically</span>
          </div>
          <VolumePricingTable basePrice={variant.price} unit={product.packSize > 1 ? "box" : product.packUnit} activeQty={qty} />
          <p className="mt-3 text-xs text-faint">All sizes and options of this product count toward the same tier.</p>
        </div>
      )}
    </div>
  );
}
