import { bestSellerSlugs } from "@/data/products";
import type { Product, SortKey } from "@/lib/commerce/types";
import { priceRange } from "@/lib/pricing";

/** Filter groups shown on collection pages. Only groups with 2+ values render. */
export type FacetKey = "config" | "size" | "taper" | "pack" | "price";

export const facetLabels: Record<FacetKey, string> = {
  config: "Needle config",
  size: "Size",
  taper: "Taper",
  pack: "Pack size",
  price: "Price",
};

export const priceBuckets = [
  { id: "0-20", label: "Under $20", min: 0, max: 20 },
  { id: "20-40", label: "$20 – $40", min: 20, max: 40 },
  { id: "40-100", label: "$40 – $100", min: 40, max: 100 },
  { id: "100-", label: "$100+", min: 100, max: Infinity },
] as const;

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A–Z" },
];

const configNames: Record<string, string> = {
  RL: "RL · Round Liner",
  RS: "RS · Round Shader",
  M1: "M1 · Magnum",
  RM: "RM · Curved Magnum",
};

export function configLabel(c: string) {
  return configNames[c] ?? c;
}

function optionValues(p: Product, name: string) {
  return p.options.find((o) => o.name === name)?.values ?? [];
}

/** Pack labels a product can be bought in, e.g. "Box of 20", "100 sheets". */
function packValues(p: Product) {
  const fromOption = optionValues(p, "Pack Size");
  return fromOption.length ? fromOption : [`${p.packSize} ${p.packUnit}`];
}

export function facetValuesFor(p: Product, key: FacetKey): string[] {
  switch (key) {
    case "config":
      return p.needleConfig ?? [];
    case "size":
      return p.category === "cartridge-needles" ? optionValues(p, "Size") : [];
    case "taper":
      return optionValues(p, "Taper");
    case "pack":
      return packValues(p);
    case "price": {
      const { min, max } = priceRange(p);
      return priceBuckets.filter((b) => max >= b.min && min < b.max).map((b) => b.id);
    }
  }
}

export type ActiveFilters = Partial<Record<FacetKey, string[]>>;

export function buildFacets(list: Product[]) {
  const keys: FacetKey[] = ["config", "size", "taper", "pack", "price"];
  return keys
    .map((key) => {
      const counts = new Map<string, number>();
      for (const p of list) for (const v of new Set(facetValuesFor(p, key))) counts.set(v, (counts.get(v) ?? 0) + 1);
      let values = [...counts.entries()].map(([value, count]) => ({ value, count }));
      if (key === "price") {
        values = priceBuckets.filter((b) => counts.has(b.id)).map((b) => ({ value: b.id, count: counts.get(b.id)! }));
      } else if (key === "size") {
        values.sort((a, b) => Number(a.value) - Number(b.value));
      } else if (key === "pack") {
        values.sort((a, b) => parseInt(a.value.replace(/\D/g, "") || "0") - parseInt(b.value.replace(/\D/g, "") || "0"));
      } else {
        values.sort((a, b) => a.value.localeCompare(b.value));
      }
      return { key, label: facetLabels[key], values };
    })
    .filter((f) => f.values.length > 1);
}

export function facetValueLabel(key: FacetKey, value: string) {
  if (key === "price") return priceBuckets.find((b) => b.id === value)?.label ?? value;
  if (key === "config") return configLabel(value);
  return value;
}

export function applyFilters(list: Product[], active: ActiveFilters) {
  return list.filter((p) =>
    (Object.entries(active) as [FacetKey, string[]][]).every(([key, selected]) => {
      if (!selected?.length) return true;
      const values = facetValuesFor(p, key);
      return selected.some((s) => values.includes(s));
    }),
  );
}

export function sortProducts(list: Product[], sort: SortKey) {
  const copy = [...list];
  const rank = (p: Product) => {
    const i = bestSellerSlugs.indexOf(p.slug);
    return i === -1 ? 999 : i;
  };
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => priceRange(a).min - priceRange(b).min);
    case "price-desc":
      return copy.sort((a, b) => priceRange(b).min - priceRange(a).min);
    case "newest":
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "best-selling":
      return copy.sort((a, b) => rank(a) - rank(b));
    case "featured":
    default:
      return copy;
  }
}
