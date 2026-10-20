"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { products } from "@/data/products";
import { searchProducts } from "@/lib/commerce/local";
import { ProductGrid } from "./ProductGrid";

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const results = q ? searchProducts(products, q) : [];

  return (
    <>
      <SearchForm key={q} initial={q} onSearch={(v) => router.replace(`/search?q=${encodeURIComponent(v)}`)} />

      <p className="mb-8 text-sm text-muted" aria-live="polite">
        {q ? (
          <>
            <span className="font-mono text-bone">{results.length}</span> {results.length === 1 ? "result" : "results"} for “
            {q}”
          </>
        ) : (
          "Type a product name, needle configuration (RL, RS, M1, RM) or SKU."
        )}
      </p>

      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : (
        q && (
          <div className="flex flex-col items-start gap-4">
            <p className="text-muted">Nothing matched. Check the spelling or browse a category.</p>
            <ButtonLink href="/collections/all" variant="outline" arrow>
              Shop all products
            </ButtonLink>
          </div>
        )
      )}
    </>
  );
}

function SearchForm({ initial, onSearch }: { initial: string; onSearch: (v: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <form
      role="search"
      className="mb-10 flex max-w-2xl items-center gap-3 border-b border-line-strong pb-3 focus-within:border-acid"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value.trim());
      }}
    >
      <Icon name="search" size={22} className="text-muted" />
      <label htmlFor="search-page-input" className="sr-only">
        Search products
      </label>
      <input
        id="search-page-input"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name, config or SKU"
        className="w-full bg-transparent text-xl text-bone placeholder:text-faint focus:outline-none"
      />
      <button type="submit" className="eyebrow text-bone hover:text-acid">
        Search
      </button>
    </form>
  );
}
