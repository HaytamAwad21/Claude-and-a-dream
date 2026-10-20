import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/product/Gallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { commerce } from "@/lib/commerce";
import { configLabel } from "@/lib/filters";
import { JsonLd, pageMetadata, productJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const products = await commerce.getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.name,
    description: `${product.shortDescription} ${product.packSize > 1 ? `${product.packSize} ${product.packUnit} per pack.` : ""}`.trim(),
    path: `/products/${product.slug}`,
  });
}

/**
 * Every product page is fully prerendered from static data, so the HTML ships
 * complete (best for SEO). Navigations may wait for that cached prerender
 * instead of showing a skeleton first.
 */
export const instant = false;

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  if (!product) notFound();
  const [category, related] = await Promise.all([
    commerce.getCategory(product.category),
    commerce.getRelated(product, 4),
  ]);

  return (
    <>
      <div className="container-site pt-8">
        <Breadcrumbs
          items={[
            ...(category ? [{ name: category.name, path: `/collections/${category.slug}` }] : []),
            { name: product.name, path: `/products/${product.slug}` },
          ]}
        />
      </div>

      <section className="container-site grid gap-10 py-8 lg:grid-cols-12 lg:gap-14 lg:py-12">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-[calc(var(--spacing-header)+1.5rem)]">
            <Gallery product={product} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="eyebrow text-faint">
            {product.brand} · {product.sku}
          </p>
          <h1 className="display mt-3 text-5xl text-bone sm:text-6xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{product.shortDescription}</p>
          {product.needleConfig && product.needleConfig.length < 4 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {product.needleConfig.map((c) => (
                <li key={c} className="eyebrow rounded-chip border border-line-strong px-2 py-1 text-[10px] text-muted">
                  {configLabel(c)}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 border-t border-line pt-8">
            <ProductPurchase product={product} />
          </div>

          <div className="mt-12 space-y-10">
            <section aria-labelledby="desc-title">
              <h2 id="desc-title" className="eyebrow mb-4 text-bone">
                Description
              </h2>
              <div className="space-y-4 leading-relaxed text-muted">
                {product.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            {product.includes && (
              <section aria-labelledby="includes-title">
                <h2 id="includes-title" className="eyebrow mb-4 text-bone">
                  What’s inside
                </h2>
                <ul className="divide-y divide-line border-y border-line">
                  {product.includes.map((it) => (
                    <li key={it.name} className="flex justify-between gap-4 py-3 text-sm">
                      <span className="text-bone">{it.name}</span>
                      <span className="shrink-0 font-mono text-muted">{it.qty}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="specs-title">
              <h2 id="specs-title" className="eyebrow mb-4 text-bone">
                Specifications
              </h2>
              <dl className="divide-y divide-line border-y border-line text-sm">
                {[
                  ...product.specs,
                  { label: "Pack size", value: `${product.packSize} ${product.packUnit}` },
                ].map((s) => (
                  <div key={s.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-3">
                    <dt className="eyebrow text-[11px] text-faint">{s.label}</dt>
                    <dd className="text-bone">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section-y border-t border-line bg-charcoal">
          <div className="container-site">
            <SectionHeading
              id="related-title"
              eyebrow="Pairs well with"
              title="Related products"
              action={category ? { href: `/collections/${category.slug}`, label: `More ${category.shortName.toLowerCase()}` } : undefined}
            />
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      <JsonLd data={productJsonLd(product)} />
    </>
  );
}
