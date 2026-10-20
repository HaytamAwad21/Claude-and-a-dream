"use client";

import { ButtonLink } from "@/components/ui/Button";
import { products } from "@/data/products";
import { useHydrated } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { ProductGrid } from "./ProductGrid";

export function WishlistView() {
  const slugs = useWishlist();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="h-64 animate-pulse rounded-card bg-surface" aria-label="Loading wishlist" />;
  const saved = slugs.map((s) => products.find((p) => p.slug === s)).filter((p) => p !== undefined);

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 border border-dashed border-line py-24 text-center">
        <p className="display text-5xl text-faint">Nothing saved yet</p>
        <p className="max-w-sm text-muted">Tap the heart on any product to save it here. Your wishlist stays on this device.</p>
        <ButtonLink href="/collections/all" arrow>
          Browse products
        </ButtonLink>
      </div>
    );
  }
  return (
    <>
      <p className="mb-8 text-sm text-muted">
        {saved.length} saved {saved.length === 1 ? "product" : "products"}
      </p>
      <ProductGrid products={saved} />
    </>
  );
}
