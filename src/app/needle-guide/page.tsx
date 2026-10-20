import type { Metadata } from "next";
import { NeedleGuide, type GuideCatalogue } from "@/components/needle-guide/NeedleGuide";
import { PageHero } from "@/components/ui/PageHero";
import { needleTypes } from "@/data/needle-guide";
import { commerce } from "@/lib/commerce";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Tattoo Needle Guide",
  description:
    "Interactive tattoo needle chart: see round liners, shaders, magnums and curved magnums at true scale, learn to read needle codes like 1203RL, and find the right cartridge.",
  path: "/needle-guide",
});

const codeParts = [
  { part: "12", label: "Diameter", text: "#12 = 0.35 mm standard, #10 = 0.30 mm bugpin. Lower is thinner." },
  { part: "03", label: "Needle count", text: "How many needles are in the group. More needles cover more skin per pass." },
  { part: "RL", label: "Configuration", text: "How the needles are arranged: RL, RS, M1 or RM." },
];

export default async function NeedleGuidePage() {
  const products = await commerce.getProducts();
  const catalogue: GuideCatalogue = {};
  for (const t of needleTypes) {
    for (const [gauge, slug] of Object.entries(t.products)) {
      const p = products.find((x) => x.slug === slug);
      if (!p) continue;
      catalogue[t.config] = {
        ...catalogue[t.config],
        [gauge]: {
          slug: p.slug,
          name: p.name,
          counts: p.options.find((o) => o.name === "Size")?.values ?? [],
          priceFrom: Math.min(...p.variants.map((v) => v.price)),
          packLabel: p.packSize > 1 ? `${p.packSize} ${p.packUnit}` : p.packUnit,
        },
      };
    }
  }

  return (
    <>
      <PageHero
        crumb="Needle guide"
        path="/needle-guide"
        eyebrow="Know your needles"
        title="Needle guide"
        intro="Pick a configuration, diameter and count to see the needle group at true scale, what it is for, and the exact cartridge to order."
      />
      <div className="container-site section-y">
        <NeedleGuide catalogue={catalogue} />

        <section aria-labelledby="ng-codes" className="mt-20 border-t border-line pt-16">
          <h2 id="ng-codes" className="display text-4xl text-bone sm:text-5xl">
            How to read a needle code
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Every cartridge box carries a code like <span className="font-mono text-bone">1203RL</span>. It always reads in
            the same order:
          </p>
          <ol className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {codeParts.map((c) => (
              <li key={c.label} className="rounded-card border border-line bg-surface p-6">
                <p className="display text-5xl text-acid">{c.part}</p>
                <p className="eyebrow mt-3 text-bone">{c.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
            <span className="text-bone">Taper</span> is the length of the needle&apos;s sharpened point. A longer taper makes
            a finer, softer mark, which is why fine-line artists choose Long or Extra Long Taper, and a medium taper puts
            down more ink for bold work.
          </p>
        </section>
      </div>
    </>
  );
}
