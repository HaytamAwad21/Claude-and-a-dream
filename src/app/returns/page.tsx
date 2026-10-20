import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

const days = siteConfig.returns.days;

export const metadata: Metadata = pageMetadata({
  title: "Returns",
  description: `${days}-day returns on unopened tattoo supplies. How to start a return, refunds and faulty product claims.`,
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <>
      <PageHero
        crumb="Returns"
        path="/returns"
        eyebrow="Policy"
        title={`${days}-day returns`}
        intro={<p>Changed your mind? Return any unopened product within {days} days of delivery for a full refund.</p>}
      />
      <div className="container-site section-y">
        <ol className="mb-16 grid gap-4 md:grid-cols-3">
          {[
            ["Request", `Email ${siteConfig.contact.email} or message us on WhatsApp with your order number.`],
            ["Ship it back", "We send you a return label and address. Pack items in their original, sealed packaging."],
            ["Get refunded", "Refunds go to your original payment method within 5 business days of arrival."],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-card border border-line bg-charcoal p-6">
              <p className="font-mono text-sm text-acid">0{i + 1}</p>
              <h2 className="display mt-3 text-3xl">{t}</h2>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
        <div className="prose-ink max-w-3xl">
          <h2>What can be returned</h2>
          <ul>
            <li>Unopened products in their original sealed packaging, within {days} days of delivery.</li>
            <li>Reusable grips and machine accessories that are unused and include all parts.</li>
          </ul>
          <h2>What can’t be returned</h2>
          <p>
            For hygiene and safety reasons, we can’t accept returns of opened sterile products (cartridges, disposable grips
            and tubes) or opened disposables unless they are faulty.
          </p>
          <h2>Faulty products</h2>
          <p>
            If a product is defective, keep the packaging (it carries the lot number) and <Link href="/contact">contact us</Link>{" "}
            with a photo. We replace or refund faulty items at any time within the product’s shelf life, including shipping.
          </p>
          <h2>Return shipping costs</h2>
          <p>
            Returns for change of mind are refunded minus the return label cost. Faulty or incorrect items are returned free.
          </p>
        </div>
      </div>
    </>
  );
}
