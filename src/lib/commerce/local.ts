import { categories, getCategory } from "@/data/categories";
import { bestSellerSlugs, products } from "@/data/products";
import { isOnSale } from "@/lib/pricing";
import type { CommerceProvider } from "./provider";
import type { Product } from "./types";

const bySlug = new Map(products.map((p) => [p.slug, p]));

/**
 * Industry needle codes: "1209RM" = #12 diameter, 09 needles, curved magnum.
 * Matches products of that config + diameter that sell that needle count.
 */
const NEEDLE_CODE = /^(10|12)(\d{2})(rl|rs|m1|rm)$/i;

function matchesNeedleCode(p: Product, code: RegExpMatchArray) {
  const [, diameter, count, config] = code;
  const diameterSpec = p.specs.find((s) => s.label === "Needle diameter")?.value ?? "";
  const sizes = p.options.find((o) => o.name === "Size")?.values ?? [];
  return (
    (p.needleConfig ?? []).includes(config.toUpperCase() as never) &&
    diameterSpec.includes(`#${diameter}`) &&
    sizes.includes(count)
  );
}

export function searchProducts(list: Product[], query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const code = terms.length === 1 ? terms[0].match(NEEDLE_CODE) : null;
  if (code) return list.filter((p) => matchesNeedleCode(p, code));
  return list
    .map((p) => {
      const haystack = [
        p.name,
        p.sku,
        p.shortDescription,
        p.category.replace(/-/g, " "),
        ...(p.needleConfig ?? []),
        ...p.variants.map((v) => v.sku),
        ...p.options.flatMap((o) => o.values),
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce(
        (s, t) => (haystack.includes(t) ? s + (p.name.toLowerCase().includes(t) ? 3 : 1) : s - 100),
        0,
      );
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

export const localProvider: CommerceProvider = {
  async getProducts() {
    return products;
  },
  async getProduct(slug) {
    return bySlug.get(slug);
  },
  async getProductsByCategory(slug) {
    return products.filter((p) => p.category === slug);
  },
  async getBestSellers(limit = 8) {
    return bestSellerSlugs
      .map((s) => bySlug.get(s))
      .filter((p): p is Product => Boolean(p))
      .slice(0, limit);
  },
  async getOnSale() {
    return products.filter(isOnSale);
  },
  async getRelated(product, limit = 4) {
    const same = products.filter((p) => p.category === product.category && p.id !== product.id);
    const others = products.filter(
      (p) => p.category !== product.category && p.tags.includes("bestseller") && p.id !== product.id,
    );
    return [...same, ...others].slice(0, limit);
  },
  async getCategories() {
    return categories;
  },
  async getCategory(slug) {
    return getCategory(slug);
  },
  async search(query) {
    return searchProducts(products, query);
  },
};
