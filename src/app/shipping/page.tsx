import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/config/site";
import { formatPriceShort } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

const { shipping } = siteConfig;
const threshold = formatPriceShort(shipping.freeShippingThreshold);

export const metadata: Metadata = pageMetadata({
  title: "Shipping",
  description: `Worldwide tracked shipping from ${shipping.origin}. Free shipping on orders over ${threshold}. Delivery times, rates and customs information.`,
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <>
      <PageHero
        crumb="Shipping"
        path="/shipping"
        eyebrow="Policy"
        title="Shipping"
        intro={<p>Tracked worldwide delivery from {shipping.origin}. Free on every order over {threshold}.</p>}
      />
      <div className="container-site section-y grid gap-12 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <div className="mb-12 grid gap-4 sm:grid-cols-3">
            {[
              ["Free", `Orders over ${threshold}`],
              [formatPriceShort(shipping.standardRate), "Standard tracked"],
              [formatPriceShort(shipping.expressRate), "Express courier"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-card border border-line bg-charcoal p-6">
                <p className="display text-5xl text-acid">{v}</p>
                <p className="eyebrow mt-2 text-[10px] text-muted">{l}</p>
              </div>
            ))}
          </div>

          <h2 className="display mb-6 text-4xl">Delivery times</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <caption className="sr-only">Estimated delivery times by region</caption>
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="eyebrow py-3 font-normal text-faint">Region</th>
                  <th scope="col" className="eyebrow py-3 font-normal text-faint">Standard</th>
                  <th scope="col" className="eyebrow py-3 font-normal text-faint">Express</th>
                </tr>
              </thead>
              <tbody>
                {shipping.zones.map((z) => (
                  <tr key={z.region} className="border-b border-line">
                    <th scope="row" className="py-4 font-medium text-bone">{z.region}</th>
                    <td className="py-4 text-muted">{z.standard}</td>
                    <td className="py-4 text-muted">{z.express}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-ink mt-4">
            <h2>Dispatch</h2>
            <p>{shipping.dispatchTime} Orders placed on Friday, Saturday or Israeli public holidays ship the next business day.</p>
            <h2>Tracking</h2>
            <p>Every order ships with tracking. You’ll get an email with your tracking link as soon as your parcel leaves our warehouse.</p>
            <h2>Customs, duties & VAT</h2>
            <p>
              Orders shipped outside Israel may be subject to import duties and VAT charged by your country’s customs
              authority. These are not included in our prices and are paid by the recipient on delivery. Studio accounts
              can request DDP (duties paid) shipping to the EU, UK and USA. See <Link href="/wholesale">wholesale accounts</Link>.
            </p>
            <h2>Lost or damaged parcels</h2>
            <p>
              If your parcel arrives damaged or hasn’t moved for 10 business days, <Link href="/contact">contact us</Link>.
              We’ll reship or refund at no cost to you.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
