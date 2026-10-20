import { ProductArt } from "@/components/product/ProductArt";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";

const heroProduct = products.find((p) => p.slug === "forge-pro-round-liner-cartridges") ?? products[0];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      {/* Faint grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_60%_40%,black,transparent_75%)]"
      />
      <div className="container-site relative grid items-center gap-10 pb-14 pt-10 lg:min-h-[min(calc(100dvh-6.25rem),56rem)] lg:grid-cols-12 lg:gap-6 lg:py-16">
        <div className="animate-fade-up lg:col-span-7">
          <p className="eyebrow mb-6 flex items-center gap-3 text-muted">
            <span className="inline-block h-px w-8 bg-acid" aria-hidden="true" />
            Pro supply · Est. {siteConfig.stats.founded} · Ships worldwide
          </p>
          <h1 id="hero-title" className="display text-[clamp(3.5rem,13vw,10.5rem)] text-bone">
            Forged
            <br />
            for the <span className="text-acid">chair.</span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
            EO-sterile cartridge needles, grips and studio disposables built to the tolerances working artists demand.
            Volume pricing on every box. Trusted by {siteConfig.stats.artists} artists in {siteConfig.stats.countries}{" "}
            countries.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/collections/cartridge-needles" size="lg" arrow>
              Shop needles
            </ButtonLink>
            <ButtonLink href="/collections/bundles-kits" size="lg" variant="outline">
              Studio kits
            </ButtonLink>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-panel border border-line lg:max-w-none">
            <ProductArt
              kind="cartridge"
              label="RL"
              sku="IF-CRL12-03-LT-20"
              alt="Three Forge Pro round liner cartridge needles with acid-green safety bands"
              meta={false}
              className="h-full w-full"
            />
          </div>
          <div className="absolute -left-2 bottom-8 animate-fade-up rounded-card border border-line-strong bg-ink/90 p-4 shadow-2xl backdrop-blur [animation-delay:200ms] sm:-left-6">
            <p className="eyebrow text-[10px] text-faint">Best seller</p>
            <p className="mt-1 font-medium text-bone">Forge Pro 1203RL</p>
            <p className="mt-1 font-mono text-sm text-acid">
              From {formatPrice(heroProduct.variants[0].price)} / box of {heroProduct.packSize}
            </p>
          </div>
          <div className="absolute right-3 top-6 animate-fade-up rounded-card border border-line-strong bg-ink/90 px-3 py-2 backdrop-blur [animation-delay:350ms] sm:-right-4">
            <p className="eyebrow text-[10px] text-bone">
              <span className="text-acid">●</span> EO sterile · 316L steel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
