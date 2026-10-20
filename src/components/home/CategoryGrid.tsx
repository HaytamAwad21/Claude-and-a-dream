import Link from "next/link";
import { ProductArt } from "@/components/product/ProductArt";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export function CategoryGrid() {
  return (
    <section aria-labelledby="categories-title" className="section-y">
      <div className="container-site">
        <SectionHeading
          id="categories-title"
          eyebrow="Shop by category"
          title={
            <>
              Everything the <br className="hidden sm:block" />
              station needs
            </>
          }
          action={{ href: "/collections/all", label: "Shop all products" }}
        />
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((c, i) => {
            const count = products.filter((p) => p.category === c.slug).length;
            const big = i === 0;
            const banner = i === categories.length - 1;
            return (
              <li key={c.slug} className={big ? "col-span-2 lg:row-span-2" : banner ? "col-span-2 lg:col-span-4" : ""}>
                <Link
                  href={`/collections/${c.slug}`}
                  className={`group relative block overflow-hidden rounded-card border border-line bg-surface ${
                    banner ? "h-52 lg:h-60" : "h-full"
                  }`}
                >
                  <ProductArt
                    kind={c.art}
                    label={c.shortName.slice(0, 4).toUpperCase()}
                    alt=""
                    decorative
                    className={`transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 ${
                      banner
                        ? "absolute inset-y-0 right-0 h-full w-1/2 lg:w-1/3"
                        : big
                          ? "aspect-square w-full lg:aspect-auto lg:h-full"
                          : "aspect-square w-full"
                    }`}
                  />
                  <div
                    className={`absolute flex items-end justify-between gap-3 p-4 sm:p-5 ${
                      banner
                        ? "inset-y-0 left-0 w-full items-center bg-gradient-to-r from-ink via-ink/80 to-transparent sm:p-8"
                        : "inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent pt-16"
                    }`}
                  >
                    <div>
                      <p className="eyebrow text-[10px] text-muted">
                        {String(i + 1).padStart(2, "0")} · {count} products
                      </p>
                      <h3
                        className={`display mt-1 text-bone group-hover:text-acid ${
                          big || banner ? "text-4xl sm:text-5xl" : "text-xl sm:text-3xl"
                        }`}
                      >
                        {c.name}
                      </h3>
                      {(big || banner) && <p className="mt-2 hidden text-sm text-muted sm:block">{c.blurb}</p>}
                    </div>
                    <span
                      aria-hidden="true"
                      className={`h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-ink/60 text-bone transition-all group-hover:border-acid group-hover:bg-acid group-hover:text-on-acid ${
                        banner ? "hidden" : big ? "flex" : "hidden sm:flex"
                      }`}
                    >
                      →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
