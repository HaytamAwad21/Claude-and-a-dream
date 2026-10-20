import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { faq } from "@/data/faq";
import { JsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description: "Answers about shipping, sterile cartridge needles, needle codes, volume pricing, studio accounts and returns.",
  path: "/faq",
});

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.flatMap((g) =>
      g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
  };
  return (
    <>
      <PageHero crumb="FAQ" path="/faq" eyebrow="Help" title="Questions, answered" />
      <div className="container-site section-y grid gap-12 lg:grid-cols-12">
        <nav aria-label="FAQ sections" className="lg:col-span-3">
          <ul className="space-y-3 lg:sticky lg:top-[calc(var(--spacing-header)+1.5rem)]">
            {faq.map((g) => (
              <li key={g.title}>
                <a href={`#${g.title.replace(/\W+/g, "-").toLowerCase()}`} className="eyebrow text-muted hover:text-acid">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-16 lg:col-span-8">
          {faq.map((g) => (
            <section key={g.title} id={g.title.replace(/\W+/g, "-").toLowerCase()} aria-label={g.title}>
              <h2 className="display mb-6 text-4xl">{g.title}</h2>
              <div className="divide-y divide-line border-y border-line">
                {g.items.map((item) => (
                  <details key={item.q} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-bone transition-colors hover:text-acid [&::-webkit-details-marker]:hidden">
                      <span className="font-medium">{item.q}</span>
                      <Icon name="plus" size={18} className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-45" />
                    </summary>
                    <p className="pb-6 pr-10 leading-relaxed text-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
          <p className="text-muted">
            Still stuck?{" "}
            <Link href="/contact" className="text-bone underline decoration-acid underline-offset-4">
              Contact us
            </Link>
            . A real person replies within one business day.
          </p>
        </div>
      </div>
      <JsonLd data={jsonLd} />
    </>
  );
}
