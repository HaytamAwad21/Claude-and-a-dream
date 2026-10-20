import type { Category, CategorySlug, Product } from "./types";

/**
 * Data-access contract. Every method is async so a remote implementation
 * (Shopify Storefront API, a headless CMS, your own API) can drop in.
 */
export interface CommerceProvider {
  getProducts(): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | undefined>;
  getProductsByCategory(slug: CategorySlug): Promise<Product[]>;
  getBestSellers(limit?: number): Promise<Product[]>;
  getOnSale(): Promise<Product[]>;
  getRelated(product: Product, limit?: number): Promise<Product[]>;
  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | undefined>;
  search(query: string): Promise<Product[]>;
}
