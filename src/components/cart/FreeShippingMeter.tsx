"use client";

import { formatPrice } from "@/lib/format";
import type { PricedCart } from "@/lib/pricing";

export function FreeShippingMeter({ cart }: { cart: PricedCart }) {
  return (
    <div>
      <p className="mb-2 text-sm text-muted" aria-live="polite">
        {cart.qualifiesFreeShipping ? (
          <>
            <span className="text-acid">✓</span> You’ve unlocked <strong className="text-bone">free shipping</strong>.
          </>
        ) : (
          <>
            Add <strong className="text-bone">{formatPrice(cart.remainingForFreeShipping)}</strong> for free worldwide shipping.
          </>
        )}
      </p>
      <div
        className="h-1 w-full overflow-hidden bg-line"
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(cart.freeShippingProgress * 100)}
      >
        <div
          className="h-full bg-acid transition-[width] duration-500 ease-out"
          style={{ width: `${cart.freeShippingProgress * 100}%` }}
        />
      </div>
    </div>
  );
}
