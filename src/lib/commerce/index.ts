/**
 * Commerce entry point. UI code imports from here only.
 *
 * Today this re-exports the local provider (mock JSON data). To move to
 * Shopify, implement the same `CommerceProvider` interface in
 * `./shopify.ts` using the Storefront API (products, collections, cart) and
 * swap the export below. Nothing else needs to change.
 */
import { localProvider } from "./local";
import type { CommerceProvider } from "./provider";

export const commerce: CommerceProvider = localProvider;

export type { CommerceProvider } from "./provider";
export * from "./types";
