import Link from "next/link";
import { formatPercent, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/commerce/types";
import { ProductImage } from "./ProductImage";
import { QuickAdd } from "./QuickAdd";

/** Wide deal card: sale price vs former price, savings and contents. */
export function BundleCard({ product }: { product: Product }) {
  const v = product.variants[0];
  const compare = v.compareAtPrice ?? v.price;
  const saving = compare - v.price;
  return (
    <article className="group relative grid overflow-hidden rounded-card border border-line bg-surface sm:grid-cols-[2fr_3fr]">
      <div className="relative overflow-hidden">
        <ProductImage
          product={product}
          className="aspect-[4/3] h-full w-full transition-transform duration-700 group-hover:scale-105 sm:aspect-auto"
          sizes="(min-width: 1024px) 20vw, 100vw"
        />
        {saving > 0 && (
          <span className="eyebrow absolute left-3 top-3 rounded-chip bg-acid px-2 py-1 text-[10px] text-on-acid">
            Save {formatPercent(saving / compare)}
          </span>
        )}
      </div>
      <div className="flex flex-col p-5 sm:p-6">
        <p className="eyebrow text-[10px] text-faint">{product.sku}</p>
        <h3 className="display mt-2 text-3xl text-bone">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:text-acid">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted">{product.shortDescription}</p>
        {product.includes && (
          <p className="eyebrow mt-4 text-[10px] text-muted">{product.includes.length} items included</p>
        )}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
          <div className="font-mono">
            <p className="text-2xl text-acid">
              <span className="sr-only">Sale price </span>
              {formatPrice(v.price)}
            </p>
            {saving > 0 && (
              <p className="text-sm text-muted">
                <span className="sr-only">Regular price </span>
                <s>{formatPrice(compare)}</s> <span className="text-bone">· You save {formatPrice(saving)}</span>
              </p>
            )}
          </div>
          <div className="relative z-10 w-full sm:w-40">
            <QuickAdd product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}
