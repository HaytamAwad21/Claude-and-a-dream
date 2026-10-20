import Link from "next/link";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  id,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: { href: string; label: string };
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="eyebrow mb-4 flex items-center gap-3 text-muted">
            <span className="inline-block h-px w-8 bg-acid" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <Tag id={id} className="display text-[2.75rem] text-bone sm:text-6xl lg:text-7xl">
          {title}
        </Tag>
        {description && <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="eyebrow group inline-flex shrink-0 items-center gap-2 self-start border-b border-line-strong pb-1 text-bone transition-colors hover:border-acid hover:text-acid md:self-auto"
        >
          {action.label}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
