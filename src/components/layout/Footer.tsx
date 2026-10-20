import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { freeShippingLabel } from "@/lib/format";
import { companyLinks, helpLinks, legalLinks, shopLinks } from "./nav";

async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

const payments = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Google Pay"];

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow mb-5 text-faint">{title}</h2>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="text-sm text-muted transition-colors hover:text-bone">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { contact, social } = siteConfig;
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-line bg-ink">
      <div className="container-site grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <p className="display text-4xl text-bone">{siteConfig.name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{siteConfig.description}</p>
          <address className="mt-8 space-y-3 text-sm not-italic text-muted">
            <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-bone">
              <Icon name="mail" size={16} className="text-faint" /> {contact.email}
            </a>
            <a href={`tel:${contact.phoneHref}`} className="flex items-center gap-3 hover:text-bone">
              <Icon name="phone" size={16} className="text-faint" /> {contact.phone}
            </a>
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-bone"
            >
              <Icon name="whatsapp" size={16} className="text-faint" /> WhatsApp
            </a>
            <p className="pl-7 text-faint">
              {contact.address.street}, {contact.address.city}, {contact.address.country}
            </p>
          </address>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
          <LinkColumn title="Shop" links={shopLinks} />
          <LinkColumn title="Help" links={helpLinks} />
          <div className="col-span-2 sm:col-span-1">
            <LinkColumn title="Company" links={companyLinks} />
            <div className="mt-8 flex gap-2">
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${siteConfig.name} on Instagram`}
                className="flex h-10 w-10 items-center justify-center border border-line text-muted transition-colors hover:border-acid hover:text-acid"
              >
                <Icon name="instagram" size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {payments.map((p) => (
              <li
                key={p}
                className="eyebrow flex h-8 items-center rounded-chip border border-line px-2.5 text-[10px] text-muted"
              >
                {p}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-faint">
            <span className="flex items-center gap-2">
              <Icon name="lock" size={14} /> SSL-encrypted checkout
            </span>
            <span className="flex items-center gap-2">
              <Icon name="shield" size={14} /> EO-sterile needles
            </span>
            <span className="flex items-center gap-2">
              <Icon name="truck" size={14} /> {freeShippingLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-4 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {siteConfig.legalName}. All rights reserved. Sold to professional tattoo artists only.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-bone">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="display pointer-events-none select-none whitespace-nowrap text-center text-[22vw] leading-[0.78] text-outline"
      >
        {siteConfig.name}
      </p>
    </footer>
  );
}
