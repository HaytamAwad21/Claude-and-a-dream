import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/config/site";
import { formatPercent } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Wholesale & Studio Accounts",
  description:
    "Open a studio or wholesale account: deeper tier pricing, net-30 terms, a dedicated rep and scheduled restock deliveries.",
  path: "/wholesale",
});

const topRetail = siteConfig.volumeTiers[siteConfig.volumeTiers.length - 1].discount;

const tiers = [
  { name: "Studio", who: "1–3 stations", discount: 0.18, perks: ["Studio pricing on every order", "Dedicated WhatsApp rep", "Monthly restock reminders"] },
  { name: "Studio Pro", who: "4+ stations or multi-location", discount: 0.22, perks: ["Everything in Studio", "Net-30 invoicing", "Scheduled auto-restock", "DDP shipping (EU, UK, US)"] },
  { name: "Distributor", who: "Retailers & distributors", discount: null, perks: ["Custom price list", "Pallet & bulk freight", "Private label options", "Marketing assets"] },
];

const perks: { icon: IconName; title: string; text: string }[] = [
  { icon: "percent", title: "Deeper pricing", text: `Account pricing beats our best public tier (−${formatPercent(topRetail)}).` },
  { icon: "box", title: "Scheduled restocks", text: "Set a monthly box and stop counting cartridges at closing time." },
  { icon: "user", title: "A real rep", text: "One person who knows your studio, on WhatsApp and email." },
  { icon: "truck", title: "Duties paid", text: "DDP shipping to the EU, UK and USA, so no surprise customs bills." },
];

export default function WholesalePage() {
  return (
    <>
      <PageHero
        crumb="Wholesale"
        path="/wholesale"
        eyebrow="Studios & distributors"
        title={
          <>
            Studio <span className="text-acid">accounts</span>
          </>
        }
        intro={<p>Running more than one station? Get account pricing, terms and a rep who knows your setup.</p>}
      />

      <section aria-label="Account benefits" className="border-b border-line bg-charcoal">
        <ul className="container-site grid sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p, i) => (
            <li
              key={p.title}
              className={`border-line py-8 sm:px-6 lg:py-10 ${i > 0 ? "border-t sm:border-t-0" : ""} ${
                i % 2 === 1 ? "sm:border-l" : ""
              } ${i === 2 ? "lg:border-l" : ""} ${i >= 2 ? "sm:border-t lg:border-t-0" : ""}`}
            >
              <Icon name={p.icon} size={26} strokeWidth={1.3} className="text-acid" />
              <h2 className="mt-4 font-semibold text-bone">{p.title}</h2>
              <p className="mt-1 text-sm text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tiers-title" className="section-y">
        <div className="container-site">
          <h2 id="tiers-title" className="display mb-10 text-5xl sm:text-6xl">
            Account tiers
          </h2>
          <ul className="grid gap-4 lg:grid-cols-3">
            {tiers.map((t, i) => (
              <li
                key={t.name}
                className={`flex flex-col rounded-panel border p-8 ${i === 1 ? "border-acid bg-acid/5" : "border-line bg-charcoal"}`}
              >
                <p className="eyebrow text-[10px] text-faint">{t.who}</p>
                <h3 className="display mt-2 text-4xl text-bone">{t.name}</h3>
                <p className="display mt-6 text-6xl text-acid">{t.discount ? `−${formatPercent(t.discount)}` : "Custom"}</p>
                <p className="mt-1 text-xs text-muted">{t.discount ? "off list price, every order" : "pricing by volume"}</p>
                <ul className="mt-8 space-y-3 text-sm">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-bone">
                      <Icon name="check" size={16} className="mt-0.5 shrink-0 text-acid" /> {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="apply-title" className="section-y border-t border-line bg-charcoal">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="apply-title" className="display text-5xl sm:text-6xl">
              Apply in two minutes
            </h2>
            <p className="mt-4 text-muted">
              We review every application within one business day. You’ll need a valid studio or business registration.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <LeadForm
              kind="wholesale"
              submitLabel="Apply for an account"
              successTitle="Application received"
              successText="Thanks. A member of our studio team will contact you within one business day."
              fields={[
                { name: "studio", label: "Studio / business name", required: true, autoComplete: "organization" },
                { name: "name", label: "Contact name", required: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
                { name: "phone", label: "Phone / WhatsApp", type: "tel", autoComplete: "tel" },
                { name: "country", label: "Country", required: true, autoComplete: "country-name" },
                { name: "stations", label: "Number of stations", type: "select", required: true, options: ["1", "2–3", "4–6", "7+", "Distributor / retailer"] },
                { name: "website", label: "Website or Instagram", type: "url", full: true, placeholder: "https://" },
                { name: "notes", label: "What do you use most?", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
