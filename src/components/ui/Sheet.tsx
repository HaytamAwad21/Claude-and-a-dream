"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Accessible overlay panel (drawer / dialog).
 * Traps focus, closes on Escape and backdrop click, locks body scroll and
 * restores focus to the element that opened it.
 */
export function Sheet({
  open,
  onClose,
  side = "right",
  label,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left" | "top";
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    const autofocus = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0];
    autofocus?.focus();

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const position = {
    right: "right-0 top-0 h-dvh w-full max-w-md animate-slide-in border-l",
    left: "left-0 top-0 h-dvh w-full max-w-sm animate-[slide-in-left_.35s_var(--ease-out-expo)_both] border-r",
    top: "inset-x-0 top-0 max-h-dvh w-full animate-fade-up border-b",
  }[side];

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`absolute flex flex-col border-line bg-charcoal ${position} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
