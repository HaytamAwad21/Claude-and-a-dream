import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageHero({
  title,
  eyebrow,
  intro,
  path,
  crumb,
}: {
  title: ReactNode;
  eyebrow?: string;
  intro?: ReactNode;
  path: string;
  crumb: string;
}) {
  return (
    <header className="border-b border-line">
      <div className="container-site py-10 lg:py-16">
        <Breadcrumbs items={[{ name: crumb, path }]} />
        {eyebrow && (
          <p className="eyebrow mt-10 flex items-center gap-3 text-muted">
            <span className="inline-block h-px w-8 bg-acid" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <h1 className={`display text-[clamp(3rem,10vw,7.5rem)] text-bone ${eyebrow ? "mt-4" : "mt-8"}`}>{title}</h1>
        {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</div>}
      </div>
    </header>
  );
}
