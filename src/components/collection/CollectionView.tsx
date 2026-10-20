"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import type { Product, SortKey } from "@/lib/commerce/types";
import {
  type ActiveFilters,
  type FacetKey,
  applyFilters,
  buildFacets,
  facetValueLabel,
  sortOptions,
  sortProducts,
} from "@/lib/filters";
import { FilterPanel } from "./FilterPanel";

const FACET_KEYS: FacetKey[] = ["config", "size", "taper", "pack", "price"];

/**
 * Client-side filtering and sorting. State lives in the URL
 * (?config=RL,RM&size=07&sort=price-asc) so filtered views are shareable
 * and survive reloads.
 */
export function CollectionView({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);

  const active: ActiveFilters = useMemo(() => {
    const a: ActiveFilters = {};
    for (const k of FACET_KEYS) {
      const v = searchParams.get(k);
      if (v) a[k] = v.split(",").filter(Boolean);
    }
    return a;
  }, [searchParams]);

  const sortParam = searchParams.get("sort") as SortKey | null;
  const sort: SortKey = sortOptions.some((o) => o.value === sortParam) ? sortParam! : "featured";

  const facets = useMemo(() => buildFacets(products), [products]);
  const visible = useMemo(() => sortProducts(applyFilters(products, active), sort), [products, active, sort]);
  const activeCount = Object.values(active).reduce((n, v) => n + (v?.length ?? 0), 0);

  function update(next: URLSearchParams) {
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  function toggle(key: FacetKey, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    const current = new Set(active[key] ?? []);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    if (current.size) next.set(key, [...current].join(","));
    else next.delete(key);
    update(next);
  }

  function clearAll() {
    const next = new URLSearchParams();
    if (sort !== "featured") next.set("sort", sort);
    update(next);
  }

  function setSort(value: SortKey) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "featured") next.delete("sort");
    else next.set("sort", value);
    update(next);
  }

  const chips = (Object.entries(active) as [FacetKey, string[]][]).flatMap(([k, vals]) =>
    vals.map((v) => ({ key: k, value: v })),
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-12">
      <aside aria-label="Product filters" className="hidden lg:block">
        <div className="sticky top-[calc(var(--spacing-header)+1.5rem)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="eyebrow text-muted">Filter</h2>
            {activeCount > 0 && (
              <button type="button" onClick={clearAll} className="eyebrow text-[10px] text-acid hover:text-bone">
                Clear all
              </button>
            )}
          </div>
          <FilterPanel facets={facets} active={active} onToggle={toggle} idPrefix="desktop" />
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm text-muted" aria-live="polite">
            <span className="font-mono text-bone">{visible.length}</span> {visible.length === 1 ? "product" : "products"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="eyebrow flex h-10 items-center gap-2 border border-line-strong px-3 text-bone lg:hidden"
              aria-haspopup="dialog"
            >
              <Icon name="filter" size={16} /> Filter{activeCount > 0 && <span className="text-acid">({activeCount})</span>}
            </button>
            <label htmlFor="sort" className="sr-only">
              Sort products
            </label>
            <div className="relative">
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="eyebrow h-10 appearance-none border border-line-strong bg-ink pl-3 pr-9 text-bone focus:border-acid focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Icon
                name="chevronDown"
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="mb-8 flex flex-wrap gap-2" aria-label="Active filters">
            {chips.map((c) => (
              <li key={`${c.key}-${c.value}`}>
                <button
                  type="button"
                  onClick={() => toggle(c.key, c.value)}
                  className="flex h-8 items-center gap-2 rounded-chip border border-acid/50 bg-acid/10 pl-3 pr-2 text-xs text-bone transition-colors hover:border-acid"
                  aria-label={`Remove filter ${facetValueLabel(c.key, c.value)}`}
                >
                  {facetValueLabel(c.key, c.value)}
                  <Icon name="close" size={12} />
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={clearAll} className="eyebrow h-8 px-2 text-[10px] text-muted hover:text-bone">
                Clear all
              </button>
            </li>
          </ul>
        )}

        {visible.length > 0 ? (
          <ProductGrid products={visible} priorityCount={4} />
        ) : (
          <div className="flex flex-col items-center gap-5 border border-dashed border-line py-20 text-center">
            <p className="display text-4xl text-faint">No matches</p>
            <p className="max-w-sm text-sm text-muted">No products match every filter you picked. Remove a filter or clear them all.</p>
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        )}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} label="Filter products" side="left">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <h2 className="display text-2xl">Filter</h2>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Close filters"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <FilterPanel facets={facets} active={active} onToggle={toggle} idPrefix="mobile" />
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-line p-4">
          <Button variant="outline" onClick={clearAll} disabled={activeCount === 0}>
            Clear
          </Button>
          <Button onClick={() => setSheetOpen(false)}>Show {visible.length}</Button>
        </div>
      </Sheet>
    </div>
  );
}
