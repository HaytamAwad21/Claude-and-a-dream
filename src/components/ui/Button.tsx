import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.12em] transition-[background-color,color,border-color,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-40 rounded-chip whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-acid text-on-acid hover:bg-bone",
  light: "bg-bone text-ink hover:bg-acid",
  outline: "border border-line-strong text-bone hover:border-bone hover:bg-bone hover:text-ink",
  ghost: "text-bone hover:text-acid",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[11px]",
  md: "h-12 px-6 text-xs",
  lg: "h-14 px-8 text-[13px]",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode; arrow?: boolean };

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="transition-transform duration-200 group-hover/btn:translate-x-1"
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  arrow,
  ...props
}: Common & Omit<ComponentProps<"button">, "children">) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...props}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  arrow,
  ...props
}: Common & Omit<ComponentProps<typeof Link>, "children">) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}
