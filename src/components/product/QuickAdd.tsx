"use client";

import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { cartActions } from "@/lib/store/cart";

/** Adds single-variant products directly; multi-variant products link to options. */
export function QuickAdd({ product }: { product: Product }) {
  const cls =
    "eyebrow flex h-11 w-full items-center justify-center bg-bone text-ink transition-colors hover:bg-acid focus-visible:bg-acid";
  const firstInStock = product.variants.find((v) => v.stock > 0);

  if (!firstInStock) {
    return (
      <span className={`${cls} cursor-not-allowed bg-surface-2 text-muted hover:bg-surface-2`} aria-disabled="true">
        Sold out
      </span>
    );
  }

  if (product.variants.length > 1) {
    return (
      <Link href={`/products/${product.slug}`} className={cls} aria-label={`Choose options for ${product.name}`}>
        Choose options
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cls}
      onClick={() => cartActions.add(product.id, firstInStock.id, 1)}
      aria-label={`Add ${product.name} to cart`}
    >
      Add to cart
    </button>
  );
}
