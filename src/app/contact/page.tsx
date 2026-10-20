import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.name} by WhatsApp, email, phone or the contact form. Replies within one business day.`,
  path: "/contact",
});

export default function ContactPage() {
  const { contact } = siteConfig;
  const channels: { icon: IconName; label: string; value: string; href: string; note: string; external?: boolean }[] = [
    {
      icon: "whatsapp",
      label: "WhatsApp",
      value: contact.whatsappDisplay,
      href: `https://wa.me/${contact.whatsapp}`,
      note: "Fastest: usually under an hour",
      external: true,
    },
    { icon: "mail", label: "Email", value: contact.email, href: `mailto:${contact.email}`, note: "Replies within one business day" },
    { icon: "phone", label: "Phone", value: contact.phone, href: `tel:${contact.phoneHref}`, note: contact.hours },
  ];
  return (
    <>
      <PageHero
        crumb="Contact"
        path="/contact"
        eyebrow="Talk to a human"
        title="Get in touch"
        intro={<p>Questions about needle configs, an order or a studio account? Our team are tattoo artists, not a call centre.</p>}
      />
      <div className="container-site section-y grid gap-14 lg:grid-cols-12">
        <aside className="space-y-4 lg:col-span-4">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-start gap-4 rounded-card border border-line bg-charcoal p-5 transition-colors hover:border-acid"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-acid">
                <Icon name={c.icon} size={20} />
              </span>
              <span>
                <span className="eyebrow block text-[10px] text-faint">{c.label}</span>
                <span className="mt-1 block font-medium text-bone group-hover:text-acid">{c.value}</span>
                <span className="mt-1 block text-xs text-muted">{c.note}</span>
              </span>
            </a>
          ))}
          <div className="rounded-card border border-line p-5 text-sm text-muted">
            <p className="eyebrow mb-2 text-[10px] text-faint">Warehouse (no walk-ins)</p>
            <address className="not-italic">
              {siteConfig.legalName}
              <br />
              {contact.address.street}
              <br />
              {contact.address.postalCode} {contact.address.city}, {contact.address.country}
            </address>
          </div>
        </aside>
        <section aria-labelledby="form-title" className="lg:col-span-7 lg:col-start-6">
          <h2 id="form-title" className="display mb-8 text-4xl">
            Send a message
          </h2>
          <LeadForm
            kind="contact"
            submitLabel="Send message"
            successTitle="Message sent"
            successText="Thanks. We’ll reply within one business day. For anything urgent, WhatsApp is fastest."
            fields={[
              { name: "name", label: "Name", required: true, autoComplete: "name" },
              { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
              { name: "order", label: "Order number", placeholder: "IF-123456" },
              {
                name: "topic",
                label: "Topic",
                type: "select",
                required: true,
                options: ["Product question", "Order status", "Returns", "Studio / wholesale account", "Other"],
              },
              { name: "message", label: "Message", type: "textarea", required: true },
            ]}
          />
        </section>
      </div>
    </>
  );
}
