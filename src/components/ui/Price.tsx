import { formatPrice } from "@/lib/format";

export function Price({
  price,
  compareAtPrice,
  from,
  className = "",
  size = "md",
}: {
  price: number;
  compareAtPrice?: number;
  from?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const onSale = compareAtPrice !== undefined && compareAtPrice > price;
  const text = { sm: "text-sm", md: "text-base", lg: "text-2xl" }[size];
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 font-mono ${text} ${className}`}>
      {from && <span className="text-[0.7em] uppercase tracking-widest text-muted">From</span>}
      <span className={onSale ? "text-acid" : "text-bone"}>
        {onSale && <span className="sr-only">Sale price </span>}
        {formatPrice(price)}
      </span>
      {onSale && (
        <s className="text-[0.85em] text-muted decoration-1">
          <span className="sr-only">Regular price </span>
          {formatPrice(compareAtPrice)}
        </s>
      )}
    </p>
  );
}
