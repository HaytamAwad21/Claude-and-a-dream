"use client";

import { createPersistedStore } from "./persisted-store";

const isSlugs = (v: unknown): v is string[] => Array.isArray(v) && v.every((s) => typeof s === "string");

const wishlistStore = createPersistedStore<string[]>("inkforge:wishlist:v1", [], isSlugs);

export const wishlistActions = {
  toggle(slug: string) {
    wishlistStore.set((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]));
  },
  remove(slug: string) {
    wishlistStore.set((list) => list.filter((s) => s !== slug));
  },
};

export function useWishlist() {
  return wishlistStore.useStore();
}
