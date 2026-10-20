"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { formatPrice } from "@/lib/format";
import { cartUi, useCart, useCartDrawer } from "@/lib/store/cart";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingMeter } from "./FreeShippingMeter";

export function CartDrawer() {
  const open = useCartDrawer();
  const cart = useCart();
  const pathname = usePathname();

  // Close when navigating to another page.
  useEffect(() => {
    cartUi.close();
  }, [pathname]);

  return (
    <Sheet open={open} onClose={() => cartUi.close()} label="Shopping cart">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
        <h2 className="display text-2xl">
          Cart <span className="font-mono text-sm text-muted">({cart.itemCount})</span>
        </h2>
        <button
          type="button"
          onClick={() => cartUi.close()}
          className="-mr-2 flex h-11 w-11 items-center justify-center"
          aria-label="Close cart"
        >
          <Icon name="close" />
        </button>
      </div>

      {cart.lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
          <p className="display text-4xl text-faint">Your cart is empty</p>
          <p className="text-sm text-muted">Start with our best-selling cartridges or a full studio kit.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/collections/cartridge-needles" size="sm">
              Shop needles
            </ButtonLink>
            <ButtonLink href="/collections/bundles-kits" size="sm" variant="outline">
              Studio kits
            </ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <div className="border-b border-line px-5 py-4">
            <FreeShippingMeter cart={cart} />
          </div>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {cart.lines.map((item) => (
              <CartLineItem key={item.variant.id} item={item} compact />
            ))}
          </ul>
          <div className="space-y-3 border-t border-line bg-ink px-5 py-5">
            {cart.volumeSavings > 0 && (
              <p className="flex justify-between font-mono text-sm text-acid">
                <span>Volume savings</span>
                <span>−{formatPrice(cart.volumeSavings)}</span>
              </p>
            )}
            <p className="flex items-baseline justify-between">
              <span className="eyebrow text-muted">Subtotal</span>
              <span className="font-mono text-xl text-bone">{formatPrice(cart.subtotal)}</span>
            </p>
            <p className="text-xs text-faint">Shipping and taxes calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <ButtonLink href="/cart" variant="outline" className="w-full">
                View cart
              </ButtonLink>
              <ButtonLink href="/checkout" className="w-full">
                Checkout
              </ButtonLink>
            </div>
          </div>
        </>
      )}
    </Sheet>
  );
}
