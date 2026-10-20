import type { MetadataRoute } from "next";
import { commerce } from "@/lib/commerce";
import { absoluteUrl } from "@/lib/seo";

const staticPaths = ["/", "/collections/all", "/offers", "/needle-guide", "/about", "/wholesale", "/shipping", "/returns", "/faq", "/contact", "/privacy", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([commerce.getProducts(), commerce.getCategories()]);
  return [
    ...staticPaths.map((p) => ({
      url: absoluteUrl(p),
      changeFrequency: "weekly" as const,
      priority: p === "/" ? 1 : 0.6,
    })),
    ...categories.map((c) => ({
      url: absoluteUrl(`/collections/${c.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
