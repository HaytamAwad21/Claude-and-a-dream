"use client";

import { useLayoutEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { THEME_KEY, type Theme } from "@/lib/theme";

function readTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  // Re-apply after React clears <html> attributes on the dev Strict Mode remount. No-op in production.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", readTheme());
  }, []);

  function toggle() {
    const next = readTheme() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    document.documentElement.setAttribute("data-theme", next);
  }

  // Both icons render; CSS picks one, so server and client markup always match.
  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex h-11 w-11 items-center justify-center text-bone transition-colors hover:text-acid ${className}`}
      aria-label="Toggle dark mode"
    >
      <Icon name="moon" size={19} className="dark:hidden" />
      <Icon name="sun" size={20} className="hidden dark:block" />
    </button>
  );
}
