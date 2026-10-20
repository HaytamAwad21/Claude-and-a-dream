/**
 * Mock catalogue. Edit products here.
 *
 * Each product is built with `defineProduct`, which expands option lists into
 * variants (every combination), generates SKUs and alt text, and fills
 * defaults. To add a product, copy an entry and change the fields.
 *
 * - `options`: variant axes, e.g. { Size: ["03", "05"], Taper: ["Long Taper"] }
 * - `priceFor`: optional function to price a variant from its options
 * - `stockFor`: optional function to set stock per variant (default 40)
 * - `photos`: optional real image paths; placeholders render until set
 */
import type {
  ArtKind,
  CategorySlug,
  NeedleConfig,
  Product,
  ProductOption,
  ProductVariant,
  VariantOptions,
} from "@/lib/commerce/types";

type ProductInput = {
  slug: string;
  name: string;
  sku: string;
  category: CategorySlug;
  brand?: string;
  shortDescription: string;
  description: string[];
  art: ArtKind;
  artLabel: string;
  price: number;
  compareAtPrice?: number;
  options?: Record<string, string[]>;
  priceFor?: (o: VariantOptions) => number;
  compareFor?: (o: VariantOptions) => number | undefined;
  stockFor?: (o: VariantOptions, index: number) => number;
  skuPart?: (o: VariantOptions) => string;
  specs: { label: string; value: string }[];
  needleConfig?: NeedleConfig[];
  packSize: number;
  packUnit: string;
  tags?: Product["tags"];
  volumePricing?: boolean;
  includes?: { name: string; qty: string }[];
  /** Real photo paths (e.g. "/images/products/x-1.jpg") for hero, detail, packaging. */
  photos?: string[];
  createdAt: string;
};

function combinations(options: Record<string, string[]>): VariantOptions[] {
  const entries = Object.entries(options);
  if (entries.length === 0) return [{}];
  return entries.reduce<VariantOptions[]>(
    (acc, [name, values]) => acc.flatMap((combo) => values.map((v) => ({ ...combo, [name]: v }))),
    [{}],
  );
}

function defaultSkuPart(o: VariantOptions) {
  return Object.values(o)
    .map((v) =>
      v
        .replace(/\(.*?\)/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 5),
    )
    .join("-");
}

function defineProduct(input: ProductInput): Product {
  const optionMap = input.options ?? {};
  const options: ProductOption[] = Object.entries(optionMap).map(([name, values]) => ({ name, values }));
  const combos = combinations(optionMap);

  const variants: ProductVariant[] = combos.map((o, i) => {
    const part = (input.skuPart ?? defaultSkuPart)(o);
    const title = Object.values(o).join(" / ") || "Default";
    return {
      id: `${input.slug}--${i}`,
      sku: part ? `${input.sku}-${part}` : input.sku,
      title,
      options: o,
      price: input.priceFor ? input.priceFor(o) : input.price,
      compareAtPrice: input.compareFor ? input.compareFor(o) : input.compareAtPrice,
      stock: input.stockFor ? input.stockFor(o, i) : 40,
    };
  });

  const brand = input.brand ?? "INKFORGE";

  return {
    id: input.sku.toLowerCase(),
    slug: input.slug,
    name: input.name,
    sku: input.sku,
    category: input.category,
    brand,
    shortDescription: input.shortDescription,
    description: input.description,
    art: input.art,
    artLabel: input.artLabel,
    images: (
      [
        { view: 0, alt: `${input.name}, product shot on a dark background` },
        { view: 1, alt: `${input.name}, close-up detail` },
        { view: 2, alt: `${input.name}, retail packaging showing SKU ${input.sku}` },
      ] as const
    ).map((img, i) => ({ ...img, src: input.photos?.[i] })),
    options,
    variants,
    specs: input.specs,
    needleConfig: input.needleConfig,
    packSize: input.packSize,
    packUnit: input.packUnit,
    tags: input.tags ?? [],
    volumePricing: input.volumePricing ?? true,
    includes: input.includes,
    createdAt: input.createdAt,
  };
}

/** Deterministic pseudo-random stock so a few variants show low / no stock. */
const stockPattern = (_o: VariantOptions, i: number) => [48, 36, 7, 52, 0, 61, 24, 3, 40, 18][i % 10];

const needleSpecsBase = [
  { label: "Sterilization", value: "Ethylene oxide (EO), single-use, sealed blister" },
  { label: "Membrane", value: "Elastic safety membrane, anti-backflow" },
  { label: "Needle steel", value: "Surgical stainless steel 316L" },
  { label: "Compatibility", value: "Universal cartridge machines and grips" },
  { label: "Shelf life", value: "5 years from sterilization date" },
];

const packOption = { "Pack Size": ["Box of 20", "Box of 50"] };
const packPrice = (box20: number, box50: number) => (o: VariantOptions) =>
  o["Pack Size"] === "Box of 50" ? box50 : box20;
const packSku = (o: VariantOptions) =>
  [o.Size, o.Taper?.replace(/[^A-Z]/g, ""), o["Pack Size"] === "Box of 50" ? "50" : "20"]
    .filter(Boolean)
    .join("-");

export const products: Product[] = [
  /* ───────────────────────── Cartridge needles ───────────────────────── */
  defineProduct({
    slug: "forge-pro-round-liner-cartridges",
    name: "Forge Pro Round Liner Cartridges",
    sku: "IF-CRL12",
    category: "cartridge-needles",
    shortDescription: "Tight, sharp-pointed round liners for clean single-pass lines. #12 / 0.35 mm.",
    description: [
      "Our best-selling liner. Each needle group is hand-soldered and polished, then checked under magnification so points stay perfectly centered for crisp, consistent lines.",
      "The elastic safety membrane stops ink and fluids from travelling back into the grip, and the low-friction housing keeps the stroke quiet on every machine we have tested.",
    ],
    art: "cartridge",
    artLabel: "RL",
    price: 24,
    options: {
      Size: ["01", "03", "05", "07", "09", "11", "14"],
      Taper: ["Long Taper", "Extra Long Taper"],
      ...packOption,
    },
    priceFor: packPrice(24, 54),
    compareFor: (o) => (o["Pack Size"] === "Box of 50" ? 60 : undefined),
    stockFor: stockPattern,
    skuPart: packSku,
    specs: [
      { label: "Configuration", value: "Round Liner (RL)" },
      { label: "Needle diameter", value: "#12 / 0.35 mm" },
      ...needleSpecsBase,
    ],
    needleConfig: ["RL"],
    packSize: 20,
    packUnit: "cartridges",
    tags: ["bestseller", "sterile"],
    createdAt: "2024-02-10",
  }),
  defineProduct({
    slug: "forge-pro-round-shader-cartridges",
    name: "Forge Pro Round Shader Cartridges",
    sku: "IF-CRS12",
    category: "cartridge-needles",
    shortDescription: "Loose-grouped round shaders for soft fills, whip shading and bold lines.",
    description: [
      "A looser circular grouping that lays down smooth tone without chewing skin. Ideal for small fills, whip shading and thick traditional outlines.",
      "Same EO-sterile build and safety membrane as the rest of the Forge Pro line.",
    ],
    art: "cartridge",
    artLabel: "RS",
    price: 24,
    options: {
      Size: ["05", "07", "09", "11", "14", "18"],
      Taper: ["Medium Taper", "Long Taper"],
      ...packOption,
    },
    priceFor: packPrice(24, 54),
    stockFor: stockPattern,
    skuPart: packSku,
    specs: [
      { label: "Configuration", value: "Round Shader (RS)" },
      { label: "Needle diameter", value: "#12 / 0.35 mm" },
      ...needleSpecsBase,
    ],
    needleConfig: ["RS"],
    packSize: 20,
    packUnit: "cartridges",
    tags: ["sterile"],
    createdAt: "2024-02-10",
  }),
  defineProduct({
    slug: "forge-pro-magnum-cartridges",
    name: "Forge Pro Magnum Cartridges",
    sku: "IF-CM112",
    category: "cartridge-needles",
    shortDescription: "Stacked magnums (M1) for fast, even colour packing and solid black fill.",
    description: [
      "Two offset rows of needles in a flat, stacked formation pack colour quickly with fewer passes. The workhorse for large fills and colour realism.",
      "Tight tolerances mean every needle in the group hits at the same depth.",
    ],
    art: "cartridge",
    artLabel: "M1",
    price: 26,
    options: {
      Size: ["07", "09", "11", "13", "15", "17", "23"],
      Taper: ["Medium Taper", "Long Taper"],
      ...packOption,
    },
    priceFor: packPrice(26, 59),
    stockFor: stockPattern,
    skuPart: packSku,
    specs: [
      { label: "Configuration", value: "Magnum (M1), stacked" },
      { label: "Needle diameter", value: "#12 / 0.35 mm" },
      ...needleSpecsBase,
    ],
    needleConfig: ["M1"],
    packSize: 20,
    packUnit: "cartridges",
    tags: ["bestseller", "sterile"],
    createdAt: "2024-03-02",
  }),
  defineProduct({
    slug: "forge-pro-curved-magnum-cartridges",
    name: "Forge Pro Curved Magnum Cartridges",
    sku: "IF-CRM12",
    category: "cartridge-needles",
    shortDescription: "Soft-edge curved magnums (RM) for buttery blends and smooth black-and-grey.",
    description: [
      "The curved edge follows the natural contour of the skin, so the outer needles land softer. That gives seamless gradients and reduces trauma on long sessions.",
      "Our most-requested needle for black-and-grey realism and portrait work.",
    ],
    art: "cartridge",
    artLabel: "RM",
    price: 27,
    compareAtPrice: 30,
    options: {
      Size: ["07", "09", "11", "13", "15", "17", "23", "27", "31"],
      Taper: ["Medium Taper", "Long Taper"],
      ...packOption,
    },
    priceFor: packPrice(27, 61),
    compareFor: (o) => (o["Pack Size"] === "Box of 50" ? 68 : 30),
    stockFor: stockPattern,
    skuPart: packSku,
    specs: [
      { label: "Configuration", value: "Curved / Round Magnum (RM), soft edge" },
      { label: "Needle diameter", value: "#12 / 0.35 mm" },
      ...needleSpecsBase,
    ],
    needleConfig: ["RM"],
    packSize: 20,
    packUnit: "cartridges",
    tags: ["bestseller", "sterile"],
    createdAt: "2024-03-02",
  }),
  defineProduct({
    slug: "forge-bugpin-liner-cartridges",
    name: "Forge Bugpin Liner Cartridges",
    sku: "IF-CRL10",
    category: "cartridge-needles",
    shortDescription: "#10 / 0.30 mm bugpin liners for fine-line, script and micro detail.",
    description: [
      "Thinner needle diameter and an extra-long taper put less ink down per pass. That gives razor-thin lines for fine-line, micro-realism and lettering.",
      "Each group is inspected for point alignment before it is sealed.",
    ],
    art: "cartridge",
    artLabel: "RL",
    price: 26,
    options: {
      Size: ["01", "03", "05", "07"],
      Taper: ["Long Taper", "Extra Long Taper"],
      ...packOption,
    },
    priceFor: packPrice(26, 59),
    stockFor: stockPattern,
    skuPart: packSku,
    specs: [
      { label: "Configuration", value: "Round Liner (RL), bugpin" },
      { label: "Needle diameter", value: "#10 / 0.30 mm" },
      ...needleSpecsBase,
    ],
    needleConfig: ["RL"],
    packSize: 20,
    packUnit: "cartridges",
    tags: ["fine-line", "sterile", "new"],
    createdAt: "2025-06-18",
  }),
  defineProduct({
    slug: "forge-bugpin-curved-magnum-cartridges",
    name: "Forge Bugpin Curved Magnum Cartridges",
    sku: "IF-CRM10",
    category: "cartridge-needles",
    shortDescription: "#10 / 0.30 mm curved magnums for ultra-smooth soft shading.",
    description: [
      "Bugpin needles packed into a curved magnum. More needles per group in the same footprint gives silky, low-impact shading for black-and-grey and portraits.",
    ],
    art: "cartridge",
    artLabel: "RM",
    price: 28,
    options: {
      Size: ["07", "09", "11", "13", "15"],
      Taper: ["Long Taper", "Extra Long Taper"],
    },
    stockFor: stockPattern,
    skuPart: packSku,
    specs: [
      { label: "Configuration", value: "Curved Magnum (RM), bugpin" },
      { label: "Needle diameter", value: "#10 / 0.30 mm" },
      ...needleSpecsBase,
    ],
    needleConfig: ["RM"],
    packSize: 20,
    packUnit: "cartridges",
    tags: ["fine-line", "sterile"],
    createdAt: "2025-01-12",
  }),
  defineProduct({
    slug: "forge-textured-round-shader-cartridges",
    name: "Forge Textured Round Shader Cartridges",
    sku: "IF-CTRS12",
    category: "cartridge-needles",
    shortDescription: "Textured needles hold more ink for solid traditional lining and packing.",
    description: [
      "A micro-textured needle surface holds and releases more ink per stroke, so traditional bold lines and solid colour go in faster.",
    ],
    art: "cartridge",
    artLabel: "RS",
    price: 25,
    options: {
      Size: ["07", "09", "11", "14"],
      Taper: ["Medium Taper"],
      ...packOption,
    },
    priceFor: packPrice(25, 56),
    stockFor: stockPattern,
    skuPart: packSku,
    specs: [
      { label: "Configuration", value: "Textured Round Shader (RS)" },
      { label: "Needle diameter", value: "#12 / 0.35 mm" },
      ...needleSpecsBase,
    ],
    needleConfig: ["RS"],
    packSize: 20,
    packUnit: "cartridges",
    tags: ["sterile"],
    createdAt: "2024-09-05",
  }),
  defineProduct({
    slug: "cartridge-sampler-box",
    name: "Cartridge Sampler Box: 40 Mixed",
    sku: "IF-CSAMP40",
    category: "cartridge-needles",
    shortDescription: "40 cartridges across RL, RS, M1 and RM. Find your favourite groupings.",
    description: [
      "Ten each of our four core configurations in the most popular sizes. A low-risk way to test the Forge Pro line before buying full boxes.",
    ],
    art: "cartridge",
    artLabel: "MIX",
    price: 39,
    compareAtPrice: 48,
    specs: [
      { label: "Contents", value: "10 × 0703RL, 10 × 0909RS, 10 × 1211M1, 10 × 1215RM" },
      { label: "Needle diameter", value: "#12 / 0.35 mm" },
      ...needleSpecsBase,
    ],
    needleConfig: ["RL", "RS", "M1", "RM"],
    packSize: 40,
    packUnit: "cartridges",
    tags: ["sterile", "new"],
    createdAt: "2025-08-01",
  }),

  /* ───────────────────────── Grips & tubes ───────────────────────── */
  defineProduct({
    slug: "soft-touch-disposable-cartridge-grips",
    name: "Soft-Touch Disposable Cartridge Grips",
    sku: "IF-GDC",
    category: "grips-tubes",
    shortDescription: "Pre-sterilized memory-foam grips for universal cartridge machines.",
    description: [
      "A memory-foam sleeve over a rigid core gives a soft, non-slip hold that reduces hand fatigue on long sessions. One-piece, single-use and individually sealed.",
    ],
    art: "grip",
    artLabel: "25MM",
    price: 32,
    options: { Diameter: ["25 mm", "30 mm", "35 mm"] },
    priceFor: (o) => (o.Diameter === "35 mm" ? 36 : 32),
    specs: [
      { label: "Material", value: "Memory foam over ABS core" },
      { label: "Sterilization", value: "EO, individually sealed" },
      { label: "Compatibility", value: "Universal rotary / pen machines with cartridge thread" },
    ],
    packSize: 20,
    packUnit: "grips",
    tags: ["bestseller", "sterile"],
    createdAt: "2024-01-20",
  }),
  defineProduct({
    slug: "disposable-tube-grips-with-tips",
    name: "Disposable Tube Grips with Tips",
    sku: "IF-GDT",
    category: "grips-tubes",
    shortDescription: "1\" grips with transparent tips for traditional bar needles.",
    description: [
      "Lightweight one-piece tubes with a clear tip so you can see the needle. Choose round, diamond or flat tip to match your needle grouping.",
    ],
    art: "tube",
    artLabel: "TUBE",
    price: 22,
    options: { Tip: ["Round Tip 5RT", "Round Tip 9RT", "Diamond Tip 7DT", "Flat Tip 9FT"] },
    specs: [
      { label: "Grip diameter", value: '1" (25 mm)' },
      { label: "Material", value: "Medical-grade PP, clear tip" },
      { label: "Sterilization", value: "EO, individually sealed" },
    ],
    packSize: 20,
    packUnit: "tubes",
    tags: ["sterile"],
    createdAt: "2023-11-04",
  }),
  defineProduct({
    slug: "machined-aluminium-cartridge-grip",
    name: "Machined Aluminium Cartridge Grip",
    sku: "IF-GAL",
    category: "grips-tubes",
    shortDescription: "CNC-machined, anodized and fully autoclavable. A grip for life.",
    description: [
      "Machined from a single billet of 6061 aluminium with a knurled pattern for a positive, non-slip hold even with gloves. Anodized finish survives hundreds of autoclave cycles.",
      "Includes an adjustable needle-depth collar and two spare O-rings.",
    ],
    art: "grip",
    artLabel: "ALU",
    price: 39,
    compareAtPrice: 49,
    options: { Diameter: ["25 mm", "30 mm"], Finish: ["Matte Black", "Raw Silver", "Gunmetal"] },
    stockFor: (_o, i) => [14, 9, 4, 11, 0, 6][i % 6],
    specs: [
      { label: "Material", value: "6061 aluminium, anodized" },
      { label: "Weight", value: "38 g (25 mm) / 46 g (30 mm)" },
      { label: "Sterilization", value: "Autoclavable to 134 °C" },
      { label: "In the box", value: "Grip, depth collar, 2 spare O-rings" },
    ],
    packSize: 1,
    packUnit: "grip",
    tags: ["reusable", "new"],
    createdAt: "2025-05-14",
  }),
  defineProduct({
    slug: "stainless-steel-grip-and-tube-set",
    name: "Stainless Steel Grip & Tube Set",
    sku: "IF-GSS",
    category: "grips-tubes",
    shortDescription: "316 stainless grip, back-stem and tip for coil and rotary bar-needle setups.",
    description: [
      "Heavy, balanced and built to last. The classic three-piece steel setup for artists still running bar needles on coil machines.",
    ],
    art: "tube",
    artLabel: "316",
    price: 34,
    options: { "Grip Diameter": ['7/8"', '1"', '1-1/8"'] },
    specs: [
      { label: "Material", value: "316 stainless steel" },
      { label: "Sterilization", value: "Autoclavable" },
      { label: "In the box", value: "Grip, back-stem, round tip" },
    ],
    packSize: 1,
    packUnit: "set",
    tags: ["reusable"],
    createdAt: "2023-09-28",
  }),

  /* ───────────────────────── Stencil & transfer ───────────────────────── */
  defineProduct({
    slug: "thermal-stencil-paper",
    name: "Thermal Stencil Paper",
    sku: "IF-STH",
    category: "stencil-transfer",
    shortDescription: "4-ply thermal transfer paper for sharp, dark stencils from any thermal copier.",
    description: [
      "High-carbon transfer layer gives deep purple lines that survive a full session of wiping. Works with all standard thermal copiers and stencil machines.",
    ],
    art: "stencil",
    artLabel: "4PLY",
    price: 34,
    options: { Format: ["A4", "US Letter"], "Pack Size": ["100 sheets", "250 sheets"] },
    priceFor: (o) => (o["Pack Size"] === "250 sheets" ? 76 : 34),
    specs: [
      { label: "Ply", value: "4-ply (white, tissue, carbon, yellow backing)" },
      { label: "Compatibility", value: "All thermal copiers and stencil printers" },
      { label: "Storage", value: "Cool, dry, away from direct sunlight" },
    ],
    packSize: 100,
    packUnit: "sheets",
    tags: ["bestseller"],
    createdAt: "2023-08-15",
  }),
  defineProduct({
    slug: "freehand-transfer-paper",
    name: "Freehand Transfer Paper",
    sku: "IF-SFH",
    category: "stencil-transfer",
    shortDescription: "Hand-trace stencil sheets for custom freehand linework.",
    description: [
      "Draw or trace directly onto the top sheet with a ballpoint pen to create a transfer. Perfect for quick custom pieces and adjustments without a copier.",
    ],
    art: "stencil",
    artLabel: "FREE",
    price: 19,
    options: { "Pack Size": ["50 sheets", "100 sheets"] },
    priceFor: (o) => (o["Pack Size"] === "100 sheets" ? 34 : 19),
    specs: [
      { label: "Format", value: "A4" },
      { label: "Ply", value: "4-ply hectograph" },
    ],
    packSize: 50,
    packUnit: "sheets",
    tags: [],
    createdAt: "2023-08-15",
  }),
  defineProduct({
    slug: "stencil-printer-thermal-roll",
    name: "Stencil Printer Thermal Roll",
    sku: "IF-SRL",
    category: "stencil-transfer",
    shortDescription: "Continuous thermal stencil roll for wireless and Bluetooth stencil printers.",
    description: [
      "Cut stencils to any length, which is ideal for sleeves and back pieces. Fits all 216 mm (A4-width) roll-fed stencil printers.",
    ],
    art: "roll-paper",
    artLabel: "ROLL",
    price: 29,
    options: { Length: ["20 m", "50 m"] },
    priceFor: (o) => (o.Length === "50 m" ? 62 : 29),
    specs: [
      { label: "Width", value: "216 mm" },
      { label: "Core", value: "25 mm" },
      { label: "Compatibility", value: "Roll-fed thermal stencil printers" },
    ],
    packSize: 1,
    packUnit: "roll",
    tags: ["new"],
    createdAt: "2025-03-20",
  }),
  defineProduct({
    slug: "stencil-transfer-gel",
    name: "Stencil Transfer Gel",
    sku: "IF-SGEL",
    category: "stencil-transfer",
    shortDescription: "Fast-setting, alcohol-free transfer gel for stencils that last all session.",
    description: [
      "Apply a thin layer, press the stencil, let it set for a few minutes. The result is a dark, crisp transfer that will not smear when you wipe. Vegan formula, cosmetic-grade ingredients.",
    ],
    art: "bottle",
    artLabel: "GEL",
    price: 18,
    options: { Size: ["4 oz / 120 ml", "8 oz / 240 ml"] },
    priceFor: (o) => (o.Size.startsWith("8") ? 29 : 18),
    specs: [
      { label: "Formula", value: "Alcohol-free, vegan" },
      { label: "Set time", value: "3–5 minutes" },
      { label: "Applicator", value: "Pump top" },
    ],
    packSize: 1,
    packUnit: "bottle",
    tags: ["bestseller"],
    createdAt: "2024-04-04",
  }),
  defineProduct({
    slug: "surgical-skin-marker-pens",
    name: "Surgical Skin Marker Pens",
    sku: "IF-SMK",
    category: "stencil-transfer",
    shortDescription: "Dual-tip sterile skin markers for freehand layout and stencil touch-ups.",
    description: [
      "A fine 0.5 mm tip for detail and a broad tip for placement. Gentian violet ink, individually wrapped with a paper ruler.",
    ],
    art: "marker",
    artLabel: "MARK",
    price: 16,
    options: { "Pack Size": ["10 pens", "50 pens"] },
    priceFor: (o) => (o["Pack Size"] === "50 pens" ? 65 : 16),
    specs: [
      { label: "Tips", value: "0.5 mm fine / 1.0 mm broad" },
      { label: "Sterilization", value: "Individually wrapped, sterile" },
    ],
    packSize: 10,
    packUnit: "pens",
    tags: ["sterile"],
    createdAt: "2024-07-11",
  }),

  /* ───────────────────────── Machine accessories ───────────────────────── */
  defineProduct({
    slug: "silicone-rca-cord",
    name: "Silicone RCA Cord",
    sku: "IF-ARCA",
    category: "machine-accessories",
    shortDescription: "Ultra-flexible silicone RCA cord with gold-plated connectors.",
    description: [
      "Soft, tangle-free silicone jacket, pure copper conductors and gold-plated plugs for a stable signal. Lightweight so it never drags your machine.",
    ],
    art: "cord",
    artLabel: "RCA",
    price: 19,
    options: { Plug: ["Straight", "90° Angled"], Length: ["1.8 m", "2.4 m"] },
    priceFor: (o) => (o.Length === "2.4 m" ? 22 : 19),
    specs: [
      { label: "Jacket", value: "Medical-grade silicone" },
      { label: "Conductor", value: "Oxygen-free copper" },
      { label: "Connectors", value: "Gold-plated RCA / 3.5 mm DC jack" },
    ],
    packSize: 1,
    packUnit: "cord",
    tags: ["bestseller"],
    createdAt: "2023-10-01",
  }),
  defineProduct({
    slug: "silicone-clip-cord",
    name: "Silicone Clip Cord",
    sku: "IF-ACLP",
    category: "machine-accessories",
    shortDescription: "Classic clip cord with silicone jacket for coil and rotary machines.",
    description: [
      "Spring-loaded steel clips with silicone boots grip securely without scratching your frame.",
    ],
    art: "cord",
    artLabel: "CLIP",
    price: 17,
    options: { Length: ["1.8 m", "2.4 m"] },
    priceFor: (o) => (o.Length === "2.4 m" ? 20 : 17),
    specs: [
      { label: "Jacket", value: "Silicone" },
      { label: "Connectors", value: "Stainless clips / 6.35 mm jack" },
    ],
    packSize: 1,
    packUnit: "cord",
    tags: [],
    createdAt: "2023-10-01",
  }),
  defineProduct({
    slug: "cartridge-machine-rubbers",
    name: "Cartridge Machine Rubbers",
    sku: "IF-ARUB",
    category: "machine-accessories",
    shortDescription: "Replacement O-rings and stabilizer rubbers for cartridge machines.",
    description: [
      "High-rebound silicone O-rings that stop cartridge wobble and noise. Mixed sizes fit most rotary and pen machines.",
    ],
    art: "rubber",
    artLabel: "O-RING",
    price: 9,
    options: { "Pack Size": ["50 pcs", "100 pcs"] },
    priceFor: (o) => (o["Pack Size"] === "100 pcs" ? 15 : 9),
    specs: [
      { label: "Material", value: "High-rebound silicone" },
      { label: "Sizes", value: "Mixed: 6, 8, 10 mm" },
    ],
    packSize: 50,
    packUnit: "pieces",
    tags: [],
    createdAt: "2024-05-30",
  }),
  defineProduct({
    slug: "precision-footswitch",
    name: "Precision Footswitch",
    sku: "IF-AFSW",
    category: "machine-accessories",
    shortDescription: "Low-profile aluminium footswitch with a silent, responsive trigger.",
    description: [
      "A non-slip base, wide pedal and silent micro-switch. The sealed housing wipes clean and fits under barrier film.",
    ],
    art: "pedal",
    artLabel: "PEDAL",
    price: 45,
    compareAtPrice: 55,
    options: { Connector: ["6.35 mm jack", "RCA"] },
    stockFor: (_o, i) => [12, 2][i],
    specs: [
      { label: "Housing", value: "Aluminium, non-slip rubber base" },
      { label: "Cable", value: "1.8 m" },
      { label: "Switch", value: "Silent micro-switch, rated 1M cycles" },
    ],
    packSize: 1,
    packUnit: "footswitch",
    tags: [],
    createdAt: "2024-11-19",
  }),
  defineProduct({
    slug: "wireless-battery-rca-adapter",
    name: "Wireless Battery RCA Adapter",
    sku: "IF-AADP",
    category: "machine-accessories",
    shortDescription: "Short RCA adapter cable to run wireless battery packs on corded machines.",
    description: [
      "Turns any RCA-port wireless battery pack into a power source for RCA machines. A 15 cm silicone lead keeps the setup compact.",
    ],
    art: "adapter",
    artLabel: "RCA",
    price: 12,
    specs: [
      { label: "Length", value: "15 cm" },
      { label: "Connectors", value: "RCA male / RCA female" },
    ],
    packSize: 1,
    packUnit: "adapter",
    tags: ["new"],
    createdAt: "2025-07-07",
  }),

  /* ───────────────────────── Studio disposables ───────────────────────── */
  defineProduct({
    slug: "perforated-barrier-film",
    name: "Perforated Barrier Film",
    sku: "IF-DBF",
    category: "studio-disposables",
    shortDescription: "Clear, perforated barrier film for machines, power supplies and surfaces.",
    description: [
      "Low-tack adhesive sticks firmly and peels off clean with no residue. Perforated every 6\" so you tear exactly what you need.",
    ],
    art: "film",
    artLabel: "FILM",
    price: 21,
    options: { "Pack Size": ["1 roll (1,200 sheets)", "4 rolls"] },
    priceFor: (o) => (o["Pack Size"] === "4 rolls" ? 72 : 21),
    specs: [
      { label: "Sheet size", value: '4" × 6" (10 × 15 cm)' },
      { label: "Sheets per roll", value: "1,200" },
      { label: "Adhesive", value: "Low-tack, residue-free" },
    ],
    packSize: 1200,
    packUnit: "sheets",
    tags: ["bestseller"],
    createdAt: "2023-07-01",
  }),
  defineProduct({
    slug: "cartridge-machine-bags",
    name: "Cartridge Machine Bags",
    sku: "IF-DMB",
    category: "studio-disposables",
    shortDescription: "Clear protective sleeves for pen and wireless cartridge machines.",
    description: [
      "Pre-cut sleeves that slide over pen-style machines. They are thin enough to keep full feel, with a sealing strip for a snug fit.",
    ],
    art: "bag",
    artLabel: "BAG",
    price: 14,
    options: { "Pack Size": ["200 bags", "500 bags"] },
    priceFor: (o) => (o["Pack Size"] === "500 bags" ? 30 : 14),
    specs: [
      { label: "Size", value: "5 × 15 cm" },
      { label: "Material", value: "LDPE, 25 µm" },
    ],
    packSize: 200,
    packUnit: "bags",
    tags: ["bestseller"],
    createdAt: "2023-07-01",
  }),
  defineProduct({
    slug: "clip-cord-sleeves",
    name: "Clip Cord Sleeves",
    sku: "IF-DCS",
    category: "studio-disposables",
    shortDescription: "Long disposable sleeves that cover clip and RCA cords end to end.",
    description: ["Extra-long sleeves keep cords fully covered from the machine to the power supply."],
    art: "bag",
    artLabel: "SLEEVE",
    price: 12,
    options: { "Pack Size": ["500 sleeves"] },
    specs: [
      { label: "Size", value: "5 × 80 cm" },
      { label: "Material", value: "LDPE" },
    ],
    packSize: 500,
    packUnit: "sleeves",
    tags: [],
    createdAt: "2023-07-01",
  }),
  defineProduct({
    slug: "rinse-cups-with-base",
    name: "Rinse Cups with Stable Base",
    sku: "IF-DRC",
    category: "studio-disposables",
    shortDescription: "Wide-base rinse cups that will not tip, even on a crowded tray.",
    description: [
      "An integrated weighted base keeps the cup upright. Graduated markings help you mix rinse solution consistently.",
    ],
    art: "cup",
    artLabel: "RINSE",
    price: 16,
    options: { "Pack Size": ["50 cups", "200 cups"] },
    priceFor: (o) => (o["Pack Size"] === "200 cups" ? 52 : 16),
    specs: [
      { label: "Capacity", value: "60 ml / 2 oz" },
      { label: "Material", value: "Recyclable PP" },
    ],
    packSize: 50,
    packUnit: "cups",
    tags: ["eco"],
    createdAt: "2024-02-27",
  }),
  defineProduct({
    slug: "ink-caps",
    name: "Ink Caps",
    sku: "IF-DIC",
    category: "studio-disposables",
    shortDescription: "Flat-base ink caps in four sizes. Bags of 1,000.",
    description: ["Flat-bottom caps that stand on their own or press into a holder. Clear PP so you can see the colour."],
    art: "caps",
    artLabel: "CAPS",
    price: 9,
    options: { "Cap Size": ["9 mm", "11 mm", "15 mm", "18 mm"] },
    priceFor: (o) => ({ "9 mm": 9, "11 mm": 10, "15 mm": 12, "18 mm": 14 })[o["Cap Size"]] ?? 9,
    specs: [
      { label: "Quantity", value: "1,000 caps per bag" },
      { label: "Material", value: "Clear PP" },
    ],
    packSize: 1000,
    packUnit: "caps",
    tags: [],
    createdAt: "2023-06-10",
  }),
  defineProduct({
    slug: "fitted-bed-covers",
    name: "Fitted Tattoo Bed Covers",
    sku: "IF-DBC",
    category: "studio-disposables",
    shortDescription: "Waterproof fitted covers with elastic edges for tattoo beds and chairs.",
    description: [
      "A fluid-resistant PE layer bonded to a soft non-woven top. Elastic edges stay put while the client shifts position.",
    ],
    art: "cover",
    artLabel: "COVER",
    price: 28,
    compareAtPrice: 34,
    options: { Size: ["Bed (190 × 80 cm)", "Armrest (60 × 25 cm)"] },
    priceFor: (o) => (o.Size.startsWith("Armrest") ? 18 : 28),
    compareFor: (o) => (o.Size.startsWith("Armrest") ? undefined : 34),
    specs: [
      { label: "Quantity", value: "25 covers" },
      { label: "Material", value: "Non-woven + PE laminate" },
    ],
    packSize: 25,
    packUnit: "covers",
    tags: [],
    createdAt: "2024-08-08",
  }),
  defineProduct({
    slug: "cohesive-grip-wrap",
    name: "Cohesive Grip Wrap",
    sku: "IF-DCW",
    category: "studio-disposables",
    shortDescription: "Self-adhesive cohesive bandage for padding grips and wrapping cords.",
    description: ["Sticks to itself, not to gloves or skin. Breathable, latex-free and easy to tear by hand."],
    art: "bandage",
    artLabel: "WRAP",
    price: 26,
    options: { Width: ['1" (2.5 cm)', '2" (5 cm)'], Color: ["Black", "Acid"] },
    specs: [
      { label: "Quantity", value: "24 rolls" },
      { label: "Length", value: "4.5 m per roll (stretched)" },
      { label: "Latex", value: "Latex-free" },
    ],
    packSize: 24,
    packUnit: "rolls",
    tags: [],
    createdAt: "2024-10-15",
  }),

  /* ───────────────────────── Bundles & kits ───────────────────────── */
  defineProduct({
    slug: "studio-starter-kit",
    name: "Studio Starter Kit",
    sku: "IF-KSTART",
    category: "bundles-kits",
    shortDescription: "Everything a new station needs for roughly 40 sessions.",
    description: [
      "Our most complete kit: needles in the four core configurations, grips, stencil essentials and a full month of disposables. Priced 22% below buying each item separately.",
    ],
    art: "kit",
    artLabel: "KIT",
    price: 289,
    compareAtPrice: 371,
    specs: [
      { label: "Sessions", value: "Approx. 40" },
      { label: "Ships in", value: "One branded box" },
    ],
    includes: [
      { name: "Forge Pro Round Liner Cartridges, 0703RL", qty: "2 boxes" },
      { name: "Forge Pro Round Shader Cartridges, 0909RS", qty: "1 box" },
      { name: "Forge Pro Curved Magnum Cartridges, 1215RM", qty: "2 boxes" },
      { name: "Soft-Touch Disposable Cartridge Grips, 25 mm", qty: "2 boxes" },
      { name: "Thermal Stencil Paper, A4", qty: "100 sheets" },
      { name: "Stencil Transfer Gel", qty: "4 oz" },
      { name: "Perforated Barrier Film", qty: "1 roll" },
      { name: "Cartridge Machine Bags", qty: "200 bags" },
      { name: "Rinse Cups with Stable Base", qty: "50 cups" },
      { name: "Ink Caps, 11 mm", qty: "1,000 caps" },
    ],
    packSize: 1,
    packUnit: "kit",
    tags: ["bestseller"],
    volumePricing: false,
    createdAt: "2024-06-01",
  }),
  defineProduct({
    slug: "linework-essentials-bundle",
    name: "Linework Essentials Bundle",
    sku: "IF-KLINE",
    category: "bundles-kits",
    shortDescription: "Liners, bugpins, stencil paper and gel: the full linework toolkit.",
    description: [
      "Built for line-heavy and fine-line artists. Four boxes of liners across sizes, plus stencil paper and gel to match.",
    ],
    art: "kit",
    artLabel: "LINE",
    price: 109,
    compareAtPrice: 132,
    specs: [{ label: "Saving", value: "17% vs. separate items" }],
    includes: [
      { name: "Forge Pro Round Liner Cartridges, 0303RL", qty: "1 box" },
      { name: "Forge Pro Round Liner Cartridges, 0703RL", qty: "1 box" },
      { name: "Forge Bugpin Liner Cartridges, 1001RL", qty: "1 box" },
      { name: "Forge Bugpin Liner Cartridges, 1003RL", qty: "1 box" },
      { name: "Thermal Stencil Paper, A4", qty: "100 sheets" },
    ],
    packSize: 1,
    packUnit: "bundle",
    tags: ["fine-line"],
    volumePricing: false,
    createdAt: "2025-04-22",
  }),
  defineProduct({
    slug: "black-and-grey-shading-bundle",
    name: "Black & Grey Shading Bundle",
    sku: "IF-KBNG",
    category: "bundles-kits",
    shortDescription: "Curved magnums and round shaders for smooth realism and blends.",
    description: [
      "The needles our black-and-grey artists reach for most: soft-edge curved magnums in three sizes plus a round shader box for tight areas.",
    ],
    art: "kit",
    artLabel: "B&G",
    price: 94,
    compareAtPrice: 111,
    specs: [{ label: "Saving", value: "15% vs. separate items" }],
    includes: [
      { name: "Forge Pro Curved Magnum Cartridges, 1209RM", qty: "1 box" },
      { name: "Forge Pro Curved Magnum Cartridges, 1215RM", qty: "1 box" },
      { name: "Forge Pro Curved Magnum Cartridges, 1223RM", qty: "1 box" },
      { name: "Forge Pro Round Shader Cartridges, 0907RS", qty: "1 box" },
    ],
    packSize: 1,
    packUnit: "bundle",
    tags: [],
    volumePricing: false,
    createdAt: "2025-02-14",
  }),
  defineProduct({
    slug: "monthly-station-restock-box",
    name: "Monthly Station Restock Box",
    sku: "IF-KRESTOCK",
    category: "bundles-kits",
    shortDescription: "A month of disposables for one busy station, in one box.",
    description: [
      "Barrier film, bags, sleeves, cups, caps, bed covers and wrap: every disposable a station goes through in a month of full bookings.",
    ],
    art: "kit",
    artLabel: "BOX",
    price: 129,
    compareAtPrice: 158,
    specs: [{ label: "Saving", value: "18% vs. separate items" }],
    includes: [
      { name: "Perforated Barrier Film", qty: "1 roll" },
      { name: "Cartridge Machine Bags", qty: "500 bags" },
      { name: "Clip Cord Sleeves", qty: "500 sleeves" },
      { name: "Rinse Cups with Stable Base", qty: "200 cups" },
      { name: "Ink Caps, 11 mm + 15 mm", qty: "2 × 1,000" },
      { name: "Fitted Tattoo Bed Covers", qty: "25 covers" },
      { name: "Cohesive Grip Wrap, 2\"", qty: "24 rolls" },
    ],
    packSize: 1,
    packUnit: "box",
    tags: ["eco"],
    volumePricing: false,
    createdAt: "2025-09-01",
  }),
];

/** Manual merchandising order for "Featured" and the best-sellers row. */
export const bestSellerSlugs = [
  "forge-pro-round-liner-cartridges",
  "forge-pro-curved-magnum-cartridges",
  "forge-pro-magnum-cartridges",
  "soft-touch-disposable-cartridge-grips",
  "thermal-stencil-paper",
  "stencil-transfer-gel",
  "perforated-barrier-film",
  "silicone-rca-cord",
  "cartridge-machine-bags",
  "studio-starter-kit",
];
