import Link from "next/link";
import { Price } from "@/components/ui/Price";
import { categories } from "@/data/categories";
import type { Product } from "@/lib/commerce/types";
import { formatPercent } from "@/lib/format";
import { bestCompare, priceRange, totalStock } from "@/lib/pricing";
import { ProductImage } from "./ProductImage";
import { QuickAdd } from "./QuickAdd";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { min, max } = priceRange(product);
  const sale = bestCompare(product);
  // Lead with the cheapest variant; show its compare-at only if that variant itself is discounted.
  const cheapest = product.variants.reduce((a, b) => (b.price < a.price ? b : a));
  const cheapestCompare =
    cheapest.compareAtPrice && cheapest.compareAtPrice > cheapest.price ? cheapest.compareAtPrice : undefined;
  const stock = totalStock(product);
  const category = categories.find((c) => c.slug === product.category);
  const badge =
    stock === 0
      ? { text: "Sold out", cls: "bg-surface-2 text-muted" }
      : sale
        ? {
            text: cheapestCompare ? `−${formatPercent(1 - cheapest.price / cheapestCompare)}` : "Sale",
            cls: "bg-acid text-on-acid",
          }
        : product.tags.includes("new")
          ? { text: "New", cls: "bg-bone text-ink" }
          : product.tags.includes("bestseller")
            ? { text: "Best seller", cls: "border border-line-strong bg-ink/70 text-bone backdrop-blur" }
            : null;

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-card bg-surface">
        <Link href={`/products/${product.slug}`} tabIndex={-1} aria-hidden="true" className="block">
          <ProductImage
            product={product}
            className="aspect-[4/5] w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
            priority={priority}
          />
        </Link>
        {badge && (
          <span className={`eyebrow absolute left-3 top-3 rounded-chip px-2 py-1 text-[10px] ${badge.cls}`}>
            {badge.text}
          </span>
        )}
        <WishlistButton
          slug={product.slug}
          name={product.name}
          className="absolute right-2 top-2 z-10 h-10 w-10 rounded-full bg-ink/60 backdrop-blur"
        />
        <div className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full transition-transform duration-300 ease-out group-focus-within:translate-y-0 group-hover:translate-y-0 md:block">
          <QuickAdd product={product} />
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow mb-1.5 text-[10px] text-faint">
          {category?.shortName} · {product.sku}
        </p>
        <h3 className="text-[15px] font-medium leading-snug text-bone">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Price
            price={min}
            compareAtPrice={cheapestCompare}
            from={min !== max}
            size="sm"
          />
          {product.volumePricing !== false && (
            <span className="eyebrow hidden text-[10px] text-muted sm:inline" title="Volume pricing available">
              Vol. pricing
            </span>
          )}
        </div>
      </div>
      <div className="relative z-10 mt-3 md:hidden">
        <QuickAdd product={product} />
      </div>
    </article>
  );
}
