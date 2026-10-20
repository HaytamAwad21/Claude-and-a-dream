import { commerce } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import { ogCard, ogSize } from "@/lib/og";
import { priceRange } from "@/lib/pricing";

export const alt = "Product image";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const products = await commerce.getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  if (!product) return ogCard({ eyebrow: "Product", title: "Not found", sub: "" });
  const { min } = priceRange(product);
  return ogCard({
    eyebrow: product.sku,
    title: product.name,
    sub: `From ${formatPrice(min)} · ${product.packSize} ${product.packUnit} · Volume pricing available`,
  });
}
