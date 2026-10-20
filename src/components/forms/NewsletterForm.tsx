"use client";

import { useState } from "react";
import { submitForm } from "@/lib/forms";

export function NewsletterForm({ id = "newsletter", compact = false }: { id?: string; compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = new FormData(form).get("email")?.toString() ?? "";
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          setStatus("error");
          setError("Enter a valid email address.");
          return;
        }
        setStatus("loading");
        await submitForm("newsletter", { email });
        setStatus("done");
        form.reset();
      }}
      className="w-full"
    >
      {status === "done" ? (
        <p className="border border-acid/40 bg-acid/5 px-4 py-4 text-sm text-bone" role="status">
          <span className="text-acid">✓</span> You’re in. Check your inbox for your welcome code.
        </p>
      ) : (
        <>
          <div className={`flex ${compact ? "flex-row" : "flex-col sm:flex-row"} gap-2`}>
            <label htmlFor={`${id}-email`} className="sr-only">
              Email address
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@studio.com"
              aria-invalid={status === "error"}
              aria-describedby={status === "error" ? `${id}-error` : undefined}
              className="h-12 min-w-0 flex-1 rounded-chip border border-line-strong bg-surface px-4 text-sm text-bone placeholder:text-faint focus:border-acid focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="eyebrow h-12 shrink-0 rounded-chip bg-acid px-6 text-on-acid transition-colors hover:bg-bone disabled:opacity-60"
            >
              {status === "loading" ? "Joining…" : "Subscribe"}
            </button>
          </div>
          {status === "error" && (
            <p id={`${id}-error`} className="mt-2 text-sm text-danger" role="alert">
              {error}
            </p>
          )}
        </>
      )}
    </form>
  );
}
