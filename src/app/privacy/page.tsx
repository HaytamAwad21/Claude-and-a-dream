import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects your personal data.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumb="Privacy" path="/privacy" eyebrow="Policy" title="Privacy policy" />
      <div className="container-site section-y">
        <div className="prose-ink max-w-3xl">
          <p><strong>Template text. Have it reviewed by a lawyer before launch.</strong></p>
          <h2>What we collect</h2>
          <p>We collect the details you give us when you order, apply for an account, contact us or join our email list: name, email, phone, shipping address and order history. Payments are processed by our payment provider; we never see or store full card numbers.</p>
          <h2>How we use it</h2>
          <ul>
            <li>To fulfil and ship your orders and handle returns.</li>
            <li>To reply to your messages and manage studio accounts.</li>
            <li>To send marketing emails, only if you opted in. Unsubscribe any time.</li>
          </ul>
          <h2>Cart & wishlist storage</h2>
          <p>Your cart and wishlist are stored in your browser’s local storage on your device. They are not sent to our servers until you check out.</p>
          <h2>Sharing</h2>
          <p>We share data only with service providers needed to run the store (payments, shipping carriers, email). We never sell your data.</p>
          <h2>Your rights</h2>
          <p>You can request a copy of your data, or ask us to correct or delete it, by emailing {siteConfig.contact.email}.</p>
        </div>
      </div>
    </>
  );
}
