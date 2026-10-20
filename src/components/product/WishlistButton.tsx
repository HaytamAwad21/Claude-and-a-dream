"use client";

import { Icon } from "@/components/ui/Icon";
import { useHydrated } from "@/lib/store/cart";
import { useWishlist, wishlistActions } from "@/lib/store/wishlist";

export function WishlistButton({
  slug,
  name,
  className = "",
  withLabel = false,
}: {
  slug: string;
  name: string;
  className?: string;
  withLabel?: boolean;
}) {
  const list = useWishlist();
  const hydrated = useHydrated();
  const active = hydrated && list.includes(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        wishlistActions.toggle(slug);
      }}
      aria-pressed={active}
      aria-label={withLabel ? undefined : active ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      className={`inline-flex items-center justify-center gap-2 transition-colors ${
        active ? "text-acid" : "text-bone hover:text-acid"
      } ${className}`}
    >
      <Icon name="heart" size={18} fill={active ? "currentColor" : "none"} />
      {withLabel && <span>{active ? "Saved" : "Save to wishlist"}</span>}
    </button>
  );
}
