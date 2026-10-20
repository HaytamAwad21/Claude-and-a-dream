/**
 * Needle guide content. Edit configurations, gauges and recommended picks here.
 *
 * - `products` maps a gauge to the catalogue product sold in that gauge. The
 *   needle counts offered in the guide come from that product's "Size" option.
 * - `picks` are quick-start recommendations shown under the guide.
 */
import type { NeedleConfig } from "@/lib/commerce/types";

export type GaugeCode = "10" | "12";

export type NeedleGauge = {
  code: GaugeCode;
  name: string;
  mm: number;
  note: string;
};

export const gauges: NeedleGauge[] = [
  {
    code: "10",
    name: "#10 Bugpin",
    mm: 0.3,
    note: "Thinner needles put less ink down per pass: finer lines and softer, low-impact shading.",
  },
  {
    code: "12",
    name: "#12 Standard",
    mm: 0.35,
    note: "The all-round standard. Holds more ink for bolder lines and faster packing.",
  },
];

/** How the needle points sit in the group, seen from the tip. */
export type NeedleLayout = "round-tight" | "round-loose" | "stacked" | "curved";

export type NeedleType = {
  config: NeedleConfig;
  name: string;
  summary: string;
  bestFor: string[];
  layout: NeedleLayout;
  products: Partial<Record<GaugeCode, string>>;
};

export const needleTypes: NeedleType[] = [
  {
    config: "RL",
    name: "Round Liner",
    summary: "Needles soldered in a tight circle to one sharp point. Built for clean, single-pass lines.",
    bestFor: ["Outlines and linework", "Script and lettering", "Fine detail (low counts)"],
    layout: "round-tight",
    products: { "10": "forge-bugpin-liner-cartridges", "12": "forge-pro-round-liner-cartridges" },
  },
  {
    config: "RS",
    name: "Round Shader",
    summary: "The same circle, grouped looser. Lays down soft tone without chewing the skin.",
    bestFor: ["Small fills and whip shading", "Bold traditional outlines", "Dotwork"],
    layout: "round-loose",
    products: { "12": "forge-pro-round-shader-cartridges" },
  },
  {
    config: "M1",
    name: "Magnum",
    summary: "Two offset rows stacked flat. Covers a wide area per pass for fast, even packing.",
    bestFor: ["Colour packing", "Solid black fill", "Large areas"],
    layout: "stacked",
    products: { "12": "forge-pro-magnum-cartridges" },
  },
  {
    config: "RM",
    name: "Curved Magnum",
    summary: "A magnum with curved edges that follow the skin, so the outer needles land softer.",
    bestFor: ["Smooth black-and-grey", "Gradients and blends", "Portraits and realism"],
    layout: "curved",
    products: { "10": "forge-bugpin-curved-magnum-cartridges", "12": "forge-pro-curved-magnum-cartridges" },
  },
];

export type NeedlePick = { config: NeedleConfig; gauge: GaugeCode; count: string; use: string };

export const needlePicks: NeedlePick[] = [
  { config: "RL", gauge: "10", count: "03", use: "Fine-line and micro detail" },
  { config: "RL", gauge: "12", count: "05", use: "Everyday clean lining" },
  { config: "RL", gauge: "12", count: "09", use: "Bold traditional outlines" },
  { config: "RS", gauge: "12", count: "07", use: "Small fills, whip shading" },
  { config: "M1", gauge: "12", count: "15", use: "Colour packing" },
  { config: "RM", gauge: "10", count: "09", use: "Soft black-and-grey shading" },
  { config: "RM", gauge: "12", count: "15", use: "Smooth gradients" },
  { config: "RM", gauge: "12", count: "31", use: "Large realism blends" },
];

/** Industry needle code, e.g. gauge 12 + 03 needles + RL → "1203RL". */
export function needleCode(gauge: GaugeCode, count: string, config: NeedleConfig) {
  return `${gauge}${count}${config}`;
}
