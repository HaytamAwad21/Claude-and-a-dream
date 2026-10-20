"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import { Sheet } from "@/components/ui/Sheet";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { searchProducts } from "@/lib/commerce/local";
import { priceRange } from "@/lib/pricing";

const suggestions = ["1203RL", "Curved magnum", "Bugpin", "Stencil paper", "Barrier film", "Starter kit"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const router = useRouter();
  const results = deferred.trim().length >= 2 ? searchProducts(products, deferred).slice(0, 6) : [];

  function close() {
    setQuery("");
    onClose();
  }

  return (
    <Sheet open={open} onClose={close} side="top" label="Search products">
      <div className="container-site py-5">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (!query.trim()) return;
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            close();
          }}
          className="flex items-center gap-3 border-b border-line-strong pb-3 focus-within:border-acid"
        >
          <Icon name="search" size={22} className="shrink-0 text-muted" />
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            data-autofocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, config or SKU (e.g. 1209RM)"
            autoComplete="off"
            className="display w-full bg-transparent text-3xl text-bone placeholder:text-faint focus:outline-none sm:text-5xl"
          />
          <button type="button" onClick={close} className="flex h-11 w-11 shrink-0 items-center justify-center" aria-label="Close search">
            <Icon name="close" />
          </button>
        </form>

        <div className="max-h-[65dvh] overflow-y-auto py-6" aria-live="polite">
          {query.trim().length < 2 ? (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="eyebrow mb-3 text-faint">Popular searches</p>
                <ul className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => setQuery(s)}
                        className="rounded-chip border border-line px-3 py-2 text-sm text-muted transition-colors hover:border-bone hover:text-bone"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-3 text-faint">Categories</p>
                <ul className="grid grid-cols-2 gap-2">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/collections/${c.slug}`} onClick={close} className="text-sm text-muted hover:text-acid">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="text-muted">
              No products match “{query}”. Try a configuration like <strong className="text-bone">RL</strong> or a SKU.
            </p>
          ) : (
            <>
              <p className="sr-only">{results.length} results</p>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((p) => {
                  const { min, max } = priceRange(p);
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.slug}`}
                        onClick={close}
                        className="group flex items-center gap-4 rounded-card border border-line p-2 transition-colors hover:border-line-strong hover:bg-surface"
                      >
                        <ProductImage product={p} className="h-20 w-16 shrink-0 rounded-chip" sizes="64px" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-bone group-hover:text-acid">{p.name}</span>
                          <span className="eyebrow block text-[10px] text-faint">{p.sku}</span>
                          <Price price={min} from={min !== max} size="sm" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={close}
                className="eyebrow mt-6 inline-flex text-bone hover:text-acid"
              >
                See all results for “{query.trim()}” →
              </Link>
            </>
          )}
        </div>
      </div>
    </Sheet>
  );
}
