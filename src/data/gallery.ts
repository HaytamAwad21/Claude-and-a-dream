/**
 * PLACEHOLDER Instagram / work gallery. Swap `src` for real artwork photos
 * (with the artist's permission) and keep the alt text descriptive.
 */
export type GalleryItem = {
  pattern: "mandala" | "botanical" | "geometric" | "dotwork" | "script" | "serpent";
  seed: number;
  artist: string;
  handle: string;
  alt: string;
  needle: string;
  src?: string;
};

export const gallery: GalleryItem[] = [
  { pattern: "mandala", seed: 12, artist: "Maya Levin", handle: "@maya.lines", needle: "1003RL", alt: "Fine-line mandala on a forearm, single-needle linework" },
  { pattern: "botanical", seed: 3, artist: "Sofia Marchetti", handle: "@linea.studio", needle: "1001RL", alt: "Micro botanical sprig with delicate leaves on an ankle" },
  { pattern: "geometric", seed: 7, artist: "Kwame Mensah", handle: "@northside.ink", needle: "1211M1", alt: "Blackwork geometric sleeve segment with solid fill" },
  { pattern: "serpent", seed: 5, artist: "Marcus Hale", handle: "@ironhand.atx", needle: "1209RS", alt: "Traditional serpent coiled around a dagger, bold outline" },
  { pattern: "dotwork", seed: 9, artist: "Hana Kobayashi", handle: "@ichigo.ink", needle: "1215RM", alt: "Dotwork gradient sphere on a shoulder blade" },
  { pattern: "script", seed: 4, artist: "Diego Ferreira", handle: "@casa.agulha", needle: "1203RL", alt: "Flowing script lettering across a collarbone" },
  { pattern: "geometric", seed: 2, artist: "Maya Levin", handle: "@maya.lines", needle: "1203RL", alt: "Minimal line triangle composition on an inner arm" },
  { pattern: "botanical", seed: 11, artist: "Diego Ferreira", handle: "@casa.agulha", needle: "1205RL", alt: "Fern frond in single-weight linework along a shin" },
  { pattern: "mandala", seed: 20, artist: "Hana Kobayashi", handle: "@ichigo.ink", needle: "1223RM", alt: "Ornamental lotus mandala with soft black-and-grey shading" },
];
