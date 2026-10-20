"use client";

import { Icon } from "@/components/ui/Icon";

export function QuantityInput({
  value,
  onChange,
  max = 99,
  min = 1,
  label,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
  min?: number;
  label: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-9" : "h-12";
  const w = size === "sm" ? "w-9" : "w-12";
  return (
    <div className={`inline-flex items-center border border-line-strong ${h}`} role="group" aria-label={label}>
      <button
        type="button"
        className={`flex ${h} ${w} items-center justify-center text-muted transition-colors hover:text-bone disabled:opacity-30`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={14} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
        }}
        className={`${h} w-10 bg-transparent text-center font-mono text-sm text-bone focus:outline-none`}
        aria-label="Quantity"
      />
      <button
        type="button"
        className={`flex ${h} ${w} items-center justify-center text-muted transition-colors hover:text-bone disabled:opacity-30`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
