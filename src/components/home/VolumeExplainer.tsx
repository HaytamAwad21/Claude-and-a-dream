import { VolumePricingTable } from "@/components/product/VolumePricingTable";
import { ButtonLink } from "@/components/ui/Button";
import { formatPercent, formatPrice } from "@/lib/format";
import { volumeTiers } from "@/lib/pricing";

const EXAMPLE_PRICE = 24;

export function VolumeExplainer() {
  const top = volumeTiers[volumeTiers.length - 1];
  const exampleQty = 12;
  const saved = EXAMPLE_PRICE * exampleQty * top.discount;
  return (
    <section aria-labelledby="volume-title" className="section-y border-y border-line bg-charcoal">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-4 flex items-center gap-3 text-muted">
            <span className="inline-block h-px w-8 bg-acid" aria-hidden="true" />
            Volume pricing
          </p>
          <h2 id="volume-title" className="display text-[2.75rem] text-bone sm:text-6xl lg:text-7xl">
            Buy more.
            <br />
            Pay <span className="text-acid">less</span> per box.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            Tier discounts apply automatically in your cart. Mix sizes and tapers of the same product and they all count
            toward the same tier. No codes, no account needed.
          </p>
          <ol className="mt-10 space-y-5">
            {[
              "Pick your configurations: any size, any taper.",
              "Add 5+ boxes of one product to unlock the next tier.",
              "Watch the discount apply in your cart instantly.",
            ].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="font-mono text-sm text-acid">0{i + 1}</span>
                <span className="text-sm text-bone">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-panel border border-line bg-ink p-6 sm:p-10">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
              <p className="eyebrow text-muted">Example: Forge Pro cartridges, box of 20</p>
              <p className="font-mono text-sm text-faint">List {formatPrice(EXAMPLE_PRICE)}</p>
            </div>
            <VolumePricingTable basePrice={EXAMPLE_PRICE} />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="border-l-2 border-acid pl-5">
                <p className="display text-6xl text-acid">−{formatPercent(top.discount)}</p>
                <p className="mt-1 text-sm text-muted">at {top.label}</p>
              </div>
              <div className="border-l-2 border-line-strong pl-5">
                <p className="display text-6xl text-bone">{formatPrice(saved).replace(".00", "")}</p>
                <p className="mt-1 text-sm text-muted">saved on a {exampleQty}-box restock</p>
              </div>
            </div>
            <ButtonLink href="/collections/cartridge-needles" variant="outline" className="mt-10 w-full sm:w-auto" arrow>
              Build your restock
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
