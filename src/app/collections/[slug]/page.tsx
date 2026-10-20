import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { CollectionView } from "@/components/collection/CollectionView";
import { ProductGrid } from "@/components/product/ProductGrid";import { commerce } from "@/lib/commerce";
import { pageMetadata } from "@/lib/seo";

const ALL = {
  name: "Shop All",
  description:
    "Every product in the catalogue: cartridge needles, grips, stencil supplies, machine accessories, studio disposables and kits.",
};

async function loadCollection(slug: string) {
  if (slug === "all") {
    return { title: ALL.name, description: ALL.description, products: await commerce.getProducts() };
  }
  const category = await commerce.getCategory(slug);
  if (!category) return null;
  return {
    title: category.name,
    description: category.description,
    products: await commerce.getProductsByCategory(category.slug),
  };
}

export async function generateStaticParams() {
  const cats = await commerce.getCategories();
  return [{ slug: "all" }, ...cats.map((c) => ({ slug: c.slug }))];
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadCollection(slug);
  if (!data) return {};
  return pageMetadata({
    title: slug === "all" ? "Shop All Tattoo Supplies" : `${data.title} for Tattoo Artists`,
    description: data.description,
    path: `/collections/${slug}`,
  });
}

/** Fully prerendered from static data: ship complete HTML rather than a skeleton. */
export const instant = false;

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const data = await loadCollection(slug);
  if (!data) notFound();

  return (
    <>
      <CollectionHeader
        title={data.title}
        description={data.description}
        path={`/collections/${slug}`}
        activeSlug={slug}
        count={data.products.length}
      />
      <div className="container-site py-10 lg:py-14">
        {/* Fallback renders the full, unfiltered grid in the static HTML for crawlers and no-JS. */}
        <Suspense fallback={<ProductGrid products={data.products} />}>
          <CollectionView products={data.products} />
        </Suspense>
      </div>
    </>
  );
}
