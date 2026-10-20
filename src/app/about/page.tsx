import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { PortraitPlaceholder } from "@/components/ui/Placeholders";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description: `The story behind ${siteConfig.name}: a tattoo artist-founded supply house shipping sterile, consistent hardware to studios worldwide from ${siteConfig.shipping.origin}.`,
  path: "/about",
});

const values = [
  { title: "Built by artists", text: "Every product is tested on real sessions by working artists before it reaches the catalogue." },
  { title: "Consistency first", text: "Lot-tracked production and magnified inspection, so box fifty tattoos like box one." },
  { title: "Honest pricing", text: "Published volume tiers instead of secret wholesale lists. Everyone sees the same price." },
  { title: "Fast, everywhere", text: `Same-day dispatch from ${siteConfig.shipping.origin} to ${siteConfig.stats.countries}+ countries with full tracking.` },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About"
        path="/about"
        eyebrow={`Est. ${siteConfig.stats.founded} · ${siteConfig.contact.address.city}`}
        title={
          <>
            Made by an artist. <span className="text-acid">For artists.</span>
          </>
        }
      />

      <section aria-labelledby="founder-title" className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
          <figure className="lg:col-span-5">
            <div className="overflow-hidden rounded-panel border border-line">
              <PortraitPlaceholder
                label="Portrait of Noam Avidan, founder, at the workbench of the Tel Aviv studio (placeholder)"
                className="aspect-[4/5] w-full"
              />
            </div>
            <figcaption className="eyebrow mt-3 text-[10px] text-faint">Noam Avidan, founder · Tel Aviv</figcaption>
          </figure>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 id="founder-title" className="display text-5xl text-bone sm:text-6xl">
              The founder’s story
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
              <p>
                {siteConfig.name} started at a tattoo station, not in a warehouse. After twelve years tattooing in Tel
                Aviv, our founder Noam was tired of cartridges that varied box to box, membranes that leaked mid-session
                and suppliers that took three weeks to ship.
              </p>
              <p>
                In {siteConfig.stats.founded} he began working directly with a single manufacturer to build a needle line
                to his own specification: 316L steel, hand-checked points and a membrane that holds. The first batch went to
                six friends’ studios. Within a year it was in two hundred.
              </p>
              <p>
                Today we supply {siteConfig.stats.artists} artists in {siteConfig.stats.countries} countries. We’re still
                artist-run, we still test everything in the chair, and we still answer WhatsApp ourselves.
              </p>
            </div>
            <blockquote className="mt-10 border-l-2 border-acid pl-6">
              <p className="display text-3xl text-bone sm:text-4xl">
                “If I wouldn’t put it in my own machine, it doesn’t go in the catalogue.”
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      <section aria-labelledby="values-title" className="section-y border-t border-line bg-charcoal">
        <div className="container-site">
          <h2 id="values-title" className="display mb-12 text-5xl text-bone sm:text-6xl">
            What we stand for
          </h2>
          <ul className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v.title} className="bg-charcoal p-8">
                <p className="font-mono text-sm text-acid">0{i + 1}</p>
                <h3 className="display mt-4 text-3xl text-bone">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              [siteConfig.stats.artists, "Artists supplied"],
              [String(siteConfig.stats.countries), "Countries"],
              [siteConfig.stats.ordersShipped, "Orders shipped"],
              [String(siteConfig.stats.founded), "Founded"],
            ].map(([v, l]) => (
              <div key={l} className="border-t border-line-strong pt-4">
                <dt className="eyebrow text-[10px] text-muted">{l}</dt>
                <dd className="display mt-2 text-5xl text-bone">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-14 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/collections/cartridge-needles" arrow>
              Shop needles
            </ButtonLink>
            <ButtonLink href="/wholesale" variant="outline">
              Open a studio account
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
