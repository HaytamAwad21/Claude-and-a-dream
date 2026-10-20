/**
 * Commerce domain types.
 * Shaped to map cleanly onto Shopify Storefront API objects
 * (Product / ProductVariant / Collection / Cart) so a remote provider can
 * replace the local JSON data without touching UI components.
 */

export type CategorySlug =
  | "cartridge-needles"
  | "grips-tubes"
  | "stencil-transfer"
  | "machine-accessories"
  | "studio-disposables"
  | "bundles-kits";

export type Category = {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  /** Short line used on category cards. */
  blurb: string;
  art: ArtKind;
};

/** Illustration used while real product photography is not available. */
export type ArtKind =
  | "cartridge"
  | "grip"
  | "tube"
  | "stencil"
  | "bottle"
  | "roll-paper"
  | "marker"
  | "cord"
  | "rubber"
  | "pedal"
  | "adapter"
  | "film"
  | "bag"
  | "cup"
  | "caps"
  | "cover"
  | "bandage"
  | "kit";

export type ProductImage = {
  /** Optional real photo path. When missing, the placeholder illustration renders. */
  src?: string;
  alt: string;
  /** 0 = hero, 1 = detail, 2 = packaging. Only used by the placeholder art. */
  view: 0 | 1 | 2;
};

export type VariantOptions = Record<string, string>;

export type ProductVariant = {
  id: string;
  sku: string;
  title: string;
  options: VariantOptions;
  price: number;
  compareAtPrice?: number;
  stock: number;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type NeedleConfig = "RL" | "RS" | "M1" | "RM";

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Base SKU; each variant carries its own full SKU. */
  sku: string;
  category: CategorySlug;
  brand: string;
  shortDescription: string;
  description: string[];
  art: ArtKind;
  /** Watermark label on the placeholder art, e.g. "RL" or "25MM". */
  artLabel: string;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  specs: { label: string; value: string }[];
  /** Product-level filter facets that are not variant options. */
  needleConfig?: NeedleConfig[];
  /** Units per box/pack, used by the pack-size filter. */
  packSize: number;
  packUnit: string;
  tags: ("bestseller" | "new" | "sterile" | "fine-line" | "reusable" | "eco")[];
  /** Defaults to true. Bundles opt out. */
  volumePricing?: boolean;
  /** For bundles: what is inside. */
  includes?: { name: string; qty: string }[];
  createdAt: string;
};

export type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type SortKey = "featured" | "best-selling" | "price-asc" | "price-desc" | "newest" | "name";
