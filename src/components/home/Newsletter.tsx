import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { siteConfig } from "@/config/site";

export function Newsletter() {
  return (
    <section aria-labelledby="newsletter-title" className="section-y relative overflow-hidden">
      <p
        aria-hidden="true"
        className="display pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none text-[28vw] leading-none text-outline opacity-40 lg:text-[18vw]"
      >
        INK
      </p>
      <div className="container-site relative grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-4 flex items-center gap-3 text-muted">
            <span className="inline-block h-px w-8 bg-acid" aria-hidden="true" />
            The Forge list
          </p>
          <h2 id="newsletter-title" className="display text-[2.75rem] text-bone sm:text-6xl lg:text-7xl">
            Restock alerts.
            <br />
            New drops. <span className="text-acid">{siteConfig.newsletter.incentive}.</span>
          </h2>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="mb-6 text-muted">
            One email a month at most. Get early access to new needle lines, restock alerts and studio-only bundle deals.
          </p>
          <NewsletterForm id="home-newsletter" />
          <p className="mt-3 text-xs text-faint">Unsubscribe any time. We never share your email.</p>
        </div>
      </div>
    </section>
  );
}
