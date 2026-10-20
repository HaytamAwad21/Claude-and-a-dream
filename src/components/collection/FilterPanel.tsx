"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { type ActiveFilters, type FacetKey, facetValueLabel } from "@/lib/filters";

type Facet = { key: FacetKey; label: string; values: { value: string; count: number }[] };

export function FilterPanel({
  facets,
  active,
  onToggle,
  idPrefix,
}: {
  facets: Facet[];
  active: ActiveFilters;
  onToggle: (key: FacetKey, value: string) => void;
  idPrefix: string;
}) {
  if (facets.length === 0) {
    return <p className="text-sm text-muted">No filters for this collection.</p>;
  }
  return (
    <div className="divide-y divide-line border-y border-line">
      {facets.map((f) => (
        <FacetGroup key={f.key} facet={f} active={active[f.key] ?? []} onToggle={onToggle} idPrefix={idPrefix} />
      ))}
    </div>
  );
}

function FacetGroup({
  facet,
  active,
  onToggle,
  idPrefix,
}: {
  facet: Facet;
  active: string[];
  onToggle: (key: FacetKey, value: string) => void;
  idPrefix: string;
}) {
  const [open, setOpen] = useState(true);
  const panelId = `${idPrefix}-${facet.key}`;
  const chips = facet.key === "size";
  return (
    <fieldset className="py-4">
      <legend className="w-full">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="eyebrow flex w-full items-center justify-between py-1 text-bone"
        >
          <span>
            {facet.label}
            {active.length > 0 && <span className="ml-2 text-acid">({active.length})</span>}
          </span>
          <Icon name="chevronDown" size={16} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </legend>
      <div id={panelId} hidden={!open} className="pt-3">
        <ul className={chips ? "flex flex-wrap gap-2" : "space-y-1"}>
          {facet.values.map(({ value, count }) => {
            const checked = active.includes(value);
            const id = `${panelId}-${value.replace(/\W+/g, "-")}`;
            return (
              <li key={value}>
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(facet.key, value)}
                  className="peer sr-only"
                />
                {chips ? (
                  <label
                    htmlFor={id}
                    className={`flex h-10 min-w-11 cursor-pointer items-center justify-center rounded-chip border px-2 font-mono text-sm transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-acid ${
                      checked ? "border-acid bg-acid text-on-acid" : "border-line-strong text-muted hover:border-bone hover:text-bone"
                    }`}
                  >
                    {value}
                    <span className="sr-only"> ({count} products)</span>
                  </label>
                ) : (
                  <label
                    htmlFor={id}
                    className="group flex cursor-pointer items-center gap-3 rounded-chip py-1.5 text-sm text-muted transition-colors hover:text-bone peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-acid"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-chip border transition-colors ${
                        checked ? "border-acid bg-acid text-on-acid" : "border-line-strong group-hover:border-bone"
                      }`}
                    >
                      {checked && <Icon name="check" size={12} strokeWidth={3} />}
                    </span>
                    <span className={checked ? "text-bone" : ""}>{facetValueLabel(facet.key, value)}</span>
                    <span className="ml-auto font-mono text-xs text-faint">{count}</span>
                  </label>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </fieldset>
  );
}
