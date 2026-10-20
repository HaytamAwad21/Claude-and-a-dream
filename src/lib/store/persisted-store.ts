"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny external store persisted to localStorage.
 * - Server render and the first client render use `initial` (no hydration mismatch).
 * - Syncs across tabs through the `storage` event.
 * - Survives blocked storage (private mode): falls back to memory.
 */
export function createPersistedStore<T>(key: string, initial: T, validate: (v: unknown) => v is T) {
  let state: T = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validate(parsed)) state = parsed;
      }
    } catch {
      /* storage unavailable or corrupt: keep initial */
    }
  }

  function emit() {
    for (const l of listeners) l();
  }

  function set(next: T | ((prev: T) => T)) {
    load();
    state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore quota / privacy errors */
    }
    emit();
  }

  function subscribe(listener: () => void) {
    load();
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      loaded = false;
      load();
      emit();
    };
    window.addEventListener("storage", onStorage);
    // Emit once so subscribers pick up the loaded value after hydration.
    queueMicrotask(listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function getSnapshot() {
    return loaded ? state : initial;
  }

  function useStore() {
    return useSyncExternalStore(subscribe, getSnapshot, () => initial);
  }

  return { useStore, set, get: () => (load(), state) };
}
