import { BundleCard } from "@/components/product/BundleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { commerce } from "@/lib/commerce";

export async function BundleDeals() {
  const bundles = (await commerce.getProductsByCategory("bundles-kits")).filter(
    (p) => p.variants[0].compareAtPrice && p.variants[0].compareAtPrice > p.variants[0].price,
  );
  return (
    <section aria-labelledby="deals-title" className="section-y">
      <div className="container-site">
        <SectionHeading
          id="deals-title"
          eyebrow="Bundle deals"
          title={
            <>
              Kits that pay <span className="text-acid">for themselves</span>
            </>
          }
          description="Pre-built bundles priced below the sum of their parts. Restock a full station in one click."
          action={{ href: "/offers", label: "All special offers" }}
        />
        <ul className="grid gap-4 lg:grid-cols-2">
          {bundles.slice(0, 4).map((b) => (
            <li key={b.id}>
              <BundleCard product={b} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
