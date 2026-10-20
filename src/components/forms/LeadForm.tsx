"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { type FormKind, submitForm } from "@/lib/forms";

export type LeadField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "textarea" | "select";
  required?: boolean;
  autoComplete?: string;
  options?: string[];
  placeholder?: string;
  full?: boolean;
};

const control =
  "w-full rounded-chip border border-line-strong bg-surface px-4 text-sm text-bone placeholder:text-faint focus:border-acid focus:outline-none aria-[invalid=true]:border-danger";

/** Generic validated form used by Contact and Wholesale pages. */
export function LeadForm({
  kind,
  fields,
  submitLabel,
  successTitle,
  successText,
}: {
  kind: FormKind;
  fields: LeadField[];
  submitLabel: string;
  successTitle: string;
  successText: string;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  if (status === "done") {
    return (
      <div className="rounded-panel border border-acid/40 bg-acid/5 p-8" role="status">
        <p className="display text-4xl text-bone">{successTitle}</p>
        <p className="mt-3 text-muted">{successText}</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(
          [...new FormData(e.currentTarget).entries()].map(([k, v]) => [k, String(v).trim()]),
        );
        const next: Record<string, string> = {};
        for (const f of fields) {
          const v = data[f.name] ?? "";
          if (f.required && !v) next[f.name] = `${f.label} is required.`;
          else if (v && f.type === "email" && !/^\S+@\S+\.\S+$/.test(v)) next[f.name] = "Enter a valid email address.";
        }
        setErrors(next);
        if (Object.keys(next).length) {
          const first = fields.find((f) => next[f.name]);
          if (first) document.getElementById(`${kind}-${first.name}`)?.focus();
          return;
        }
        setStatus("loading");
        await submitForm(kind, data);
        setStatus("done");
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      {fields.map((f) => {
        const id = `${kind}-${f.name}`;
        const err = errors[f.name];
        const common = {
          id,
          name: f.name,
          required: f.required,
          autoComplete: f.autoComplete,
          placeholder: f.placeholder,
          "aria-invalid": Boolean(err),
          "aria-describedby": err ? `${id}-error` : undefined,
        };
        return (
          <div key={f.name} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="eyebrow mb-2 block text-[11px] text-muted">
              {f.label}
              {f.required ? <span className="text-acid"> *</span> : <span className="text-faint"> (optional)</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea {...common} rows={5} className={`${control} py-3`} />
            ) : f.type === "select" ? (
              <select {...common} className={`${control} h-12`} defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                {f.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input {...common} type={f.type ?? "text"} className={`${control} h-12`} />
            )}
            {err && (
              <p id={`${id}-error`} className="mt-2 text-sm text-danger">
                {err}
              </p>
            )}
          </div>
        );
      })}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" arrow disabled={status === "loading"} className="w-full sm:w-auto">
          {status === "loading" ? "Sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
