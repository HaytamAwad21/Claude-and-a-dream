import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { commerce } from "@/lib/commerce";

export async function BestSellers() {
  const list = await commerce.getBestSellers(8);
  return (
    <section aria-labelledby="bestsellers-title" className="section-y border-t border-line bg-charcoal">
      <div className="container-site">
        <SectionHeading
          id="bestsellers-title"
          eyebrow="Best sellers"
          title="What pros reorder"
          description="The cartridges, grips and disposables studios restock most, ranked by repeat orders."
          action={{ href: "/collections/all?sort=best-selling", label: "View all best sellers" }}
        />
        <ProductGrid products={list} />
      </div>
    </section>
  );
}
