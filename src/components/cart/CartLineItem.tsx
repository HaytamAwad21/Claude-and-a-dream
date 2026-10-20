"use client";

import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { Icon } from "@/components/ui/Icon";
import { formatPercent, formatPrice } from "@/lib/format";
import type { PricedLine } from "@/lib/pricing";
import { cartActions, cartUi } from "@/lib/store/cart";
import { QuantityInput } from "./QuantityInput";

export function CartLineItem({ item, compact = false }: { item: PricedLine; compact?: boolean }) {
  const { product, variant, line } = item;
  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/products/${product.slug}`}
        onClick={() => cartUi.close()}
        className={`shrink-0 overflow-hidden rounded-chip ${compact ? "w-20" : "w-24 sm:w-28"}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage product={product} className="aspect-[4/5] w-full" sizes="112px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${product.slug}`}
              onClick={() => cartUi.close()}
              className="text-sm font-medium leading-snug text-bone hover:text-acid"
            >
              {product.name}
            </Link>
            {variant.title !== "Default" && <p className="mt-1 text-xs text-muted">{variant.title}</p>}
            <p className="eyebrow mt-1 text-[10px] text-faint">{variant.sku}</p>
          </div>
          <button
            type="button"
            onClick={() => cartActions.remove(variant.id)}
            className="-mr-2 -mt-2 flex h-9 w-9 shrink-0 items-center justify-center text-faint transition-colors hover:text-danger"
            aria-label={`Remove ${product.name} ${variant.title} from cart`}
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <QuantityInput
            size="sm"
            value={line.quantity}
            max={Math.min(99, variant.stock)}
            onChange={(n) => cartActions.setQuantity(variant.id, n)}
            label={`Quantity for ${product.name}`}
          />
          <div className="text-right font-mono">
            {item.discount > 0 && (
              <p className="text-[11px] text-acid">
                Volume −{formatPercent(item.discount)} · <s className="text-faint">{formatPrice(item.basePrice * line.quantity)}</s>
              </p>
            )}
            <p className="text-sm text-bone">{formatPrice(item.lineTotal)}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
