import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Sale",
  description: `Terms and conditions for purchases from ${siteConfig.name}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero crumb="Terms" path="/terms" eyebrow="Policy" title="Terms of sale" />
      <div className="container-site section-y">
        <div className="prose-ink max-w-3xl">
          <p><strong>Template text. Have it reviewed by a lawyer before launch.</strong></p>
          <h2>Professional use</h2>
          <p>Our products are sold for professional use by trained tattoo artists and studios. By ordering you confirm that you are a tattoo professional and will use the products in line with local health and safety regulations.</p>
          <h2>Prices</h2>
          <p>All prices are in {siteConfig.currency} and exclude import duties and local taxes outside Israel. Volume discounts are calculated automatically at checkout.</p>
          <h2>Shipping & returns</h2>
          <p>See our <Link href="/shipping">shipping policy</Link> and <Link href="/returns">returns policy</Link>.</p>
          <h2>Sterile products</h2>
          <p>Do not use any sterile product if its packaging is opened or damaged, or after its expiry date.</p>
          <h2>Contact</h2>
          <p>{siteConfig.legalName}, {siteConfig.contact.address.street}, {siteConfig.contact.address.city}, {siteConfig.contact.address.country}. {siteConfig.contact.email}</p>
        </div>
      </div>
    </>
  );
}
