/**
 * PLACEHOLDER testimonials for design purposes.
 * Replace with real, permissioned quotes from your customers before launch.
 */
export type Testimonial = {
  name: string;
  studio: string;
  city: string;
  country: string;
  style: string;
  quote: string;
  /** Path to a real headshot; initials avatar renders when missing. */
  photo?: string;
  product: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Maya Levin",
    studio: "Black Lotus Tattoo",
    city: "Tel Aviv",
    country: "Israel",
    style: "Fine-line botanical",
    quote:
      "The bugpin liners are the most consistent cartridges I’ve used. No wobble, no blowouts, and the points stay sharp through a full-day session.",
    product: "Forge Bugpin Liner 1003RL",
  },
  {
    name: "Diego Ferreira",
    studio: "Casa Agulha",
    city: "Lisbon",
    country: "Portugal",
    style: "Neo-traditional",
    quote:
      "Ordered on Sunday, unpacked on Thursday. The volume tiers mean our three stations restock for less than our old local supplier.",
    product: "Forge Pro Magnum 1215M1",
  },
  {
    name: "Hana Kobayashi",
    studio: "Ichigo Ink",
    city: "Berlin",
    country: "Germany",
    style: "Black & grey realism",
    quote:
      "Curved mags blend like butter. I switched my whole shading setup over after one sampler box.",
    product: "Forge Pro Curved Magnum 1223RM",
  },
  {
    name: "Marcus Hale",
    studio: "Iron Hand Collective",
    city: "Austin, TX",
    country: "USA",
    style: "American traditional",
    quote:
      "The textured shaders pack solid colour fast. Customs, tracking, everything was clean, even shipping to Texas.",
    product: "Forge Textured Round Shader 1209RS",
  },
  {
    name: "Sofia Marchetti",
    studio: "Linea Studio",
    city: "Milan",
    country: "Italy",
    style: "Micro-realism",
    quote:
      "The stencil paper holds through hours of wiping. That alone saves me a re-stencil on every large piece.",
    product: "Thermal Stencil Paper A4",
  },
  {
    name: "Kwame Mensah",
    studio: "Northside Tattoo Co.",
    city: "London",
    country: "UK",
    style: "Blackwork",
    quote:
      "We run a studio account. Net terms, a dedicated rep on WhatsApp, and the restock box arrives like clockwork every month.",
    product: "Monthly Station Restock Box",
  },
];
