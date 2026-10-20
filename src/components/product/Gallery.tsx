"use client";

import { useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { ProductImage } from "./ProductImage";

export function Gallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const current = product.images[index];
  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      <ul className="flex gap-3 lg:w-20 lg:flex-col" aria-label="Product images">
        {product.images.map((img, i) => (
          <li key={i} className="w-20 shrink-0">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1} of ${product.images.length}: ${img.alt}`}
              aria-current={i === index ? "true" : undefined}
              className={`block w-full overflow-hidden rounded-chip border transition-colors ${
                i === index ? "border-acid" : "border-line hover:border-line-strong"
              }`}
            >
              <ProductImage product={product} image={img} className="aspect-[4/5] w-full" sizes="80px" />
            </button>
          </li>
        ))}
      </ul>
      <div className="relative flex-1 overflow-hidden rounded-panel border border-line">
        <ProductImage
          key={index}
          product={product}
          image={current}
          className="aspect-[4/5] w-full animate-[fade-up_.4s_var(--ease-out-expo)_both]"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
        <p className="eyebrow absolute right-4 top-4 rounded-chip bg-ink/70 px-2 py-1 text-[10px] text-muted backdrop-blur">
          {index + 1} / {product.images.length}
        </p>
      </div>
    </div>
  );
}
