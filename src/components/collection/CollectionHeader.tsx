import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { categories } from "@/data/categories";

export function CollectionHeader({
  title,
  description,
  path,
  activeSlug,
  count,
}: {
  title: string;
  description: string;
  path: string;
  activeSlug?: string;
  count: number;
}) {
  return (
    <header className="border-b border-line">
      <div className="container-site pb-8 pt-8 lg:pb-12 lg:pt-12">
        <Breadcrumbs
          items={[
            ...(activeSlug !== "all" ? [{ name: "Shop", path: "/collections/all" }] : []),
            { name: title, path },
          ]}
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-4 text-acid">
              {String(count).padStart(2, "0")} {count === 1 ? "product" : "products"}
            </p>
            <h1 className="display text-[clamp(3rem,10vw,7.5rem)] text-bone">{title}</h1>
          </div>
          <p className="max-w-md leading-relaxed text-muted lg:col-span-4">{description}</p>
        </div>
        <nav aria-label="Collections" className="-mx-4 mt-10 overflow-x-auto px-4 scrollbar-none">
          <ul className="flex gap-2">
            {[{ slug: "all", shortName: "All" }, ...categories].map((c) => {
              const active = c.slug === activeSlug;
              return (
                <li key={c.slug} className="shrink-0">
                  <Link
                    href={`/collections/${c.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`eyebrow flex h-9 items-center rounded-full border px-4 transition-colors ${
                      active ? "border-bone bg-bone text-ink" : "border-line-strong text-muted hover:border-bone hover:text-bone"
                    }`}
                  >
                    {c.shortName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
