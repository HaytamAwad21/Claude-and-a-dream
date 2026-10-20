"use client";

import { useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import {
  gauges,
  needleCode,
  needlePicks,
  needleTypes,
  type GaugeCode,
  type NeedleLayout,
  type NeedlePick,
} from "@/data/needle-guide";
import type { NeedleConfig } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";

/** The catalogue facts the guide needs for one product (passed from the server page). */
export type GuideProduct = {
  slug: string;
  name: string;
  counts: string[];
  priceFrom: number;
  packLabel: string;
};

export type GuideCatalogue = Partial<Record<NeedleConfig, Partial<Record<GaugeCode, GuideProduct>>>>;

type Point = { x: number; y: number };

/** n touching needles evenly spaced on a circle (radius in needle diameters). */
function ring(n: number, minRadius = 0): Point[] {
  if (n === 1) return [{ x: 0, y: 0 }];
  const r = Math.max(0.5 / Math.sin(Math.PI / n), minRadius);
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: r * Math.cos(a), y: r * Math.sin(a) };
  });
}

/**
 * Needle tip positions, in needle diameters, seen from the tip.
 * Round groups are concentric rings (up to 6 in one ring, then a centre needle,
 * then an inner and outer ring); magnums use two offset rows, and curved
 * magnums bend those rows up at the edges.
 */
function needlePoints(layout: NeedleLayout, n: number): Point[] {
  let pts: Point[];
  if (layout === "round-tight" || layout === "round-loose") {
    const spacing = layout === "round-tight" ? 1 : 1.3;
    let groups: Point[];
    if (n <= 6) groups = ring(n);
    else if (n <= 12) groups = [{ x: 0, y: 0 }, ...ring(n - 1, 1)];
    else {
      const inner = ring(Math.round(n / 3));
      const innerR = Math.hypot(inner[0].x, inner[0].y);
      groups = [...inner, ...ring(n - inner.length, innerR + 1)];
    }
    pts = groups.map((p) => ({ x: p.x * spacing, y: p.y * spacing }));
  } else {
    const front = Math.ceil(n / 2);
    pts = Array.from({ length: n }, (_, i) =>
      i < front ? { x: i, y: 0 } : { x: i - front + 0.5, y: 0.866 },
    );
  }

  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  pts = pts.map((p) => ({ x: p.x - cx, y: p.y - cy }));

  if (layout === "curved") {
    const half = Math.max(...pts.map((p) => Math.abs(p.x)), 1);
    pts = pts.map((p) => ({ x: p.x, y: p.y - 1.2 * (p.x / half) ** 2 }));
    const my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    pts = pts.map((p) => ({ x: p.x, y: p.y - my }));
  }
  return pts;
}

/** Fixed viewBox in mm so every group is drawn at the same true relative scale. */
const VIEW = { w: 7, h: 3.6 };

function NeedleDiagram({ layout, count, mm, code }: { layout: NeedleLayout; count: number; mm: number; code: string }) {
  const pts = needlePoints(layout, count);
  const xs = pts.map((p) => p.x);
  const widthMm = (Math.max(...xs) - Math.min(...xs) + 1) * mm;
  return (
    <figure>
      <svg
        viewBox={`${-VIEW.w / 2} ${-VIEW.h / 2} ${VIEW.w} ${VIEW.h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${code}: ${count} needles of ${mm} mm, about ${widthMm.toFixed(1)} mm wide, seen from the tip`}
      >
        <defs>
          <pattern id="ng-grid" width="0.5" height="0.5" patternUnits="userSpaceOnUse">
            <path d="M0.5 0H0V0.5" fill="none" className="stroke-line" strokeWidth="0.01" />
          </pattern>
        </defs>
        <rect x={-VIEW.w / 2} y={-VIEW.h / 2} width={VIEW.w} height={VIEW.h} fill="url(#ng-grid)" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x * mm} cy={p.y * mm} r={(mm / 2) * 0.9} className="fill-acid" />
        ))}
        <g className="fill-muted stroke-muted">
          <line x1={-3.2} x2={-2.2} y1={1.45} y2={1.45} strokeWidth="0.03" />
          <line x1={-3.2} x2={-3.2} y1={1.38} y2={1.52} strokeWidth="0.03" />
          <line x1={-2.2} x2={-2.2} y1={1.38} y2={1.52} strokeWidth="0.03" />
          <text x={-2.05} y={1.53} fontSize="0.22" stroke="none" className="font-mono">
            1 mm
          </text>
        </g>
      </svg>
      <figcaption className="eyebrow mt-3 text-[10px] text-faint">Seen from the tip · true relative scale</figcaption>
    </figure>
  );
}

const chip =
  "flex cursor-pointer items-center justify-center rounded-chip border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-acid";
const chipOn = "border-bone bg-bone text-ink";
const chipOff = "border-line-strong text-bone hover:border-bone";

export function NeedleGuide({ catalogue }: { catalogue: GuideCatalogue }) {
  const [config, setConfig] = useState<NeedleConfig>("RL");
  const [gauge, setGauge] = useState<GaugeCode>("12");
  const [count, setCount] = useState("05");
  const resultRef = useRef<HTMLDivElement>(null);

  const type = needleTypes.find((t) => t.config === config)!;
  const product = catalogue[config]?.[gauge];
  const gaugeInfo = gauges.find((g) => g.code === gauge)!;
  const code = needleCode(gauge, count, config);

  /** Move to a selection, falling back to a stocked gauge and count when needed. */
  function select(next: { config?: NeedleConfig; gauge?: GaugeCode; count?: string }) {
    const c = next.config ?? config;
    const available = gauges.filter((g) => catalogue[c]?.[g.code]).map((g) => g.code);
    const wantedGauge = next.gauge ?? gauge;
    const g = available.includes(wantedGauge) ? wantedGauge : available[available.length - 1];
    const counts = catalogue[c]?.[g]?.counts ?? [];
    const wantedCount = next.count ?? count;
    setConfig(c);
    setGauge(g);
    setCount(counts.includes(wantedCount) ? wantedCount : counts[0]);
  }

  function choosePick(p: NeedlePick) {
    select(p);
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-10 lg:col-span-5">
          <fieldset>
            <legend className="eyebrow mb-4 flex items-center gap-3 text-muted">
              <span className="text-acid">01</span> Configuration
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {needleTypes.map((t) => {
                const checked = t.config === config;
                return (
                  <div key={t.config}>
                    <input
                      type="radio"
                      id={`ng-config-${t.config}`}
                      name="ng-config"
                      checked={checked}
                      onChange={() => select({ config: t.config })}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`ng-config-${t.config}`}
                      className={`${chip} h-full flex-col items-start gap-1 p-4 text-left ${checked ? chipOn : chipOff}`}
                    >
                      <span className="display text-3xl">{t.config}</span>
                      <span className={`text-sm ${checked ? "text-ink" : "text-muted"}`}>{t.name}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-4 flex items-center gap-3 text-muted">
              <span className="text-acid">02</span> Needle diameter
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {gauges.map((g) => {
                const stocked = Boolean(catalogue[config]?.[g.code]);
                const checked = g.code === gauge;
                return (
                  <div key={g.code}>
                    <input
                      type="radio"
                      id={`ng-gauge-${g.code}`}
                      name="ng-gauge"
                      checked={checked}
                      disabled={!stocked}
                      onChange={() => select({ gauge: g.code })}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`ng-gauge-${g.code}`}
                      className={`${chip} h-full flex-col items-start gap-1 p-4 text-left ${
                        checked ? chipOn : stocked ? chipOff : "cursor-not-allowed border-line text-faint"
                      }`}
                    >
                      <span className="font-mono text-sm">{g.name}</span>
                      <span className={`font-mono text-xs ${checked ? "text-ink" : "text-muted"}`}>
                        {stocked ? `${g.mm.toFixed(2)} mm` : `Not stocked in ${config}`}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{gaugeInfo.note}</p>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-4 flex items-center gap-3 text-muted">
              <span className="text-acid">03</span> Needle count
            </legend>
            <div className="flex flex-wrap gap-2">
              {(product?.counts ?? []).map((c) => {
                const checked = c === count;
                return (
                  <div key={c}>
                    <input
                      type="radio"
                      id={`ng-count-${c}`}
                      name="ng-count"
                      checked={checked}
                      onChange={() => select({ count: c })}
                      className="peer sr-only"
                    />
                    <label htmlFor={`ng-count-${c}`} className={`${chip} h-11 min-w-12 px-3 font-mono text-sm ${checked ? chipOn : chipOff}`}>
                      {c}
                    </label>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">More needles cover a wider area per pass.</p>
          </fieldset>
        </div>

        <div ref={resultRef} className="scroll-mt-[calc(var(--spacing-header)+1rem)] lg:col-span-7">
          <div className="rounded-panel border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-[calc(var(--spacing-header)+1.5rem)]">
            <p className="eyebrow text-[10px] text-faint">Your needle</p>
            <p className="display mt-2 text-6xl text-acid sm:text-7xl" aria-live="polite">
              {code}
            </p>
            <p className="eyebrow mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted">
              <span>
                <span className="text-bone">{gauge}</span> diameter
              </span>
              <span>
                <span className="text-bone">{count}</span> needles
              </span>
              <span>
                <span className="text-bone">{config}</span> {type.name}
              </span>
            </p>

            <div className="mt-6 rounded-card border border-line bg-ink p-4">
              <NeedleDiagram layout={type.layout} count={Number(count)} mm={gaugeInfo.mm} code={code} />
            </div>

            <p className="mt-6 leading-relaxed text-bone">{type.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {type.bestFor.map((b) => (
                <li key={b} className="eyebrow rounded-chip border border-line-strong px-2 py-1 text-[10px] text-muted">
                  {b}
                </li>
              ))}
            </ul>

            {product && (
              <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted">{product.name}</p>
                  <p className="mt-1 font-mono text-bone">
                    From {formatPrice(product.priceFrom)} <span className="text-muted">/ {product.packLabel}</span>
                  </p>
                </div>
                {/* Full page load so the product page reads ?size= and preselects it. */}
                <a href={`/products/${product.slug}?size=${count}`} className={buttonClasses({ className: "w-full sm:w-auto" })}>
                  Shop {code} →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <section aria-labelledby="ng-picks" className="mt-20">
        <h2 id="ng-picks" className="display text-4xl text-bone sm:text-5xl">
          Popular starting points
        </h2>
        <p className="mt-3 max-w-xl text-muted">Not sure where to start? These are the codes artists reorder most.</p>
        <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {needlePicks.map((p) => {
            const pickCode = needleCode(p.gauge, p.count, p.config);
            return (
              <li key={pickCode}>
                <button
                  type="button"
                  onClick={() => choosePick(p)}
                  className="group h-full w-full rounded-card border border-line bg-surface p-4 text-left transition-colors hover:border-acid"
                >
                  <span className="display block text-2xl text-bone transition-colors group-hover:text-acid">{pickCode}</span>
                  <span className="mt-1 block text-sm text-muted">{p.use}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
