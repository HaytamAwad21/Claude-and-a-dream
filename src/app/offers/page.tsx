import type { Metadata } from "next";
import { BundleCard } from "@/components/product/BundleCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { commerce } from "@/lib/commerce";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Bundles & Special Offers",
  description:
    "Current tattoo supply deals: studio kits and bundles priced below the sum of their parts, plus marked-down cartridges, grips and disposables.",
  path: "/offers",
});

export default async function OffersPage() {
  const onSale = await commerce.getOnSale();
  const bundles = onSale.filter((p) => p.category === "bundles-kits");
  const singles = onSale.filter((p) => p.category !== "bundles-kits");

  return (
    <>
      <header className="border-b border-line">
        <div className="container-site py-10 lg:py-14">
          <Breadcrumbs items={[{ name: "Special offers", path: "/offers" }]} />
          <h1 className="display mt-8 text-[clamp(3rem,11vw,8rem)] text-bone">
            Bundles <span className="text-acid">&</span> offers
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Every deal on this page is live now. Sale prices are shown next to the regular price so you see exactly what
            you save. Volume tiers still stack on single products.
          </p>
        </div>
      </header>

      <section aria-labelledby="bundles-title" className="section-y">
        <div className="container-site">
          <SectionHeading id="bundles-title" eyebrow={`${bundles.length} bundles`} title="Studio kits & bundles" />
          <ul className="grid gap-4 lg:grid-cols-2">
            {bundles.map((b) => (
              <li key={b.id}>
                <BundleCard product={b} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {singles.length > 0 && (
        <section aria-labelledby="markdowns-title" className="section-y border-t border-line bg-charcoal">
          <div className="container-site">
            <SectionHeading id="markdowns-title" eyebrow={`${singles.length} products`} title="Marked down" />
            <ProductGrid products={singles} />
          </div>
        </section>
      )}
    </>
  );
}
