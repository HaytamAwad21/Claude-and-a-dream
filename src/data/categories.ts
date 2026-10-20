import type { Category } from "@/lib/commerce/types";

export const categories: Category[] = [
  {
    slug: "cartridge-needles",
    name: "Cartridge Needles",
    shortName: "Needles",
    description:
      "EO-sterilized cartridge needles with a safety membrane in every configuration: round liners, round shaders, magnums and curved magnums. Filter by grouping, taper and box size.",
    blurb: "RL · RS · M1 · RM, every taper",
    art: "cartridge",
  },
  {
    slug: "grips-tubes",
    name: "Grips & Tubes",
    shortName: "Grips",
    description:
      "Disposable cartridge grips and tubes for one-session hygiene, plus machined aluminium and stainless grips you can autoclave for years.",
    blurb: "Disposable and autoclavable",
    art: "grip",
  },
  {
    slug: "stencil-transfer",
    name: "Stencil & Transfer",
    shortName: "Stencil",
    description:
      "Thermal stencil paper, freehand transfer sheets, printer rolls, transfer gel and skin markers for crisp, long-lasting lines.",
    blurb: "Paper, gel, markers",
    art: "stencil",
  },
  {
    slug: "machine-accessories",
    name: "Machine Accessories",
    shortName: "Accessories",
    description:
      "RCA and clip cords, cartridge machine rubbers, footswitches and power accessories that keep your setup running clean.",
    blurb: "Cords, rubbers, power",
    art: "cord",
  },
  {
    slug: "studio-disposables",
    name: "Studio Disposables",
    shortName: "Disposables",
    description:
      "Barrier film, machine bags, cord sleeves, rinse cups, ink caps, bed covers and wrap: everything that keeps the station clean between clients.",
    blurb: "Barrier, bags, caps, covers",
    art: "film",
  },
  {
    slug: "bundles-kits",
    name: "Bundles & Studio Kits",
    shortName: "Kits",
    description:
      "Pre-built kits and bundles priced below the sum of their parts. Restock a station in one click.",
    blurb: "Save up to 22%",
    art: "kit",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
