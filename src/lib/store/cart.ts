"use client";

import { useMemo, useSyncExternalStore } from "react";
import { products } from "@/data/products";
import type { CartLine } from "@/lib/commerce/types";
import { priceCart } from "@/lib/pricing";
import { createPersistedStore } from "./persisted-store";

/**
 * Cart state lives in localStorage as a list of { productId, variantId, quantity }.
 * When moving to Shopify, replace these actions with Storefront API cart
 * mutations (cartCreate / cartLinesAdd / cartLinesUpdate) and keep the cart id
 * in this store instead of the lines.
 */

const MAX_QTY = 99;

const isLines = (v: unknown): v is CartLine[] =>
  Array.isArray(v) &&
  v.every(
    (l) =>
      l &&
      typeof l === "object" &&
      typeof (l as CartLine).productId === "string" &&
      typeof (l as CartLine).variantId === "string" &&
      typeof (l as CartLine).quantity === "number",
  );

const cartStore = createPersistedStore<CartLine[]>("inkforge:cart:v1", [], isLines);

const productById = new Map(products.map((p) => [p.id, p]));
export const lookupProduct = (id: string) => productById.get(id);

function clampQty(q: number) {
  return Math.max(0, Math.min(MAX_QTY, Math.floor(q)));
}

function stockFor(productId: string, variantId: string) {
  return lookupProduct(productId)?.variants.find((v) => v.id === variantId)?.stock ?? 0;
}

export const cartActions = {
  add(productId: string, variantId: string, quantity = 1) {
    cartStore.set((lines) => {
      const max = Math.min(MAX_QTY, stockFor(productId, variantId));
      const existing = lines.find((l) => l.variantId === variantId);
      if (existing) {
        return lines.map((l) =>
          l.variantId === variantId ? { ...l, quantity: Math.min(max, clampQty(l.quantity + quantity)) } : l,
        );
      }
      return [...lines, { productId, variantId, quantity: Math.min(max, clampQty(quantity)) }];
    });
    cartUi.open();
  },
  setQuantity(variantId: string, quantity: number) {
    cartStore.set((lines) =>
      lines
        .map((l) =>
          l.variantId === variantId
            ? { ...l, quantity: Math.min(stockFor(l.productId, l.variantId), clampQty(quantity)) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  },
  remove(variantId: string) {
    cartStore.set((lines) => lines.filter((l) => l.variantId !== variantId));
  },
  clear() {
    cartStore.set([]);
  },
};

export function useCart() {
  const lines = cartStore.useStore();
  return useMemo(() => priceCart(lines, lookupProduct), [lines]);
}

/* ───────── Drawer open/close (memory only) ───────── */

let drawerOpen = false;
const uiListeners = new Set<() => void>();
const emitUi = () => uiListeners.forEach((l) => l());

export const cartUi = {
  open() {
    drawerOpen = true;
    emitUi();
  },
  close() {
    drawerOpen = false;
    emitUi();
  },
};

export function useCartDrawer() {
  return useSyncExternalStore(
    (l) => {
      uiListeners.add(l);
      return () => uiListeners.delete(l);
    },
    () => drawerOpen,
    () => false,
  );
}

/** True only after hydration; use to avoid flashing an empty cart. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
