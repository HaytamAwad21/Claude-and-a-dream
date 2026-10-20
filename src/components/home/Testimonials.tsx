import { Avatar } from "@/components/ui/Placeholders";
import { siteConfig } from "@/config/site";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const stats = [
    { value: siteConfig.stats.artists, label: "artists supplied" },
    { value: String(siteConfig.stats.countries), label: "countries" },
    { value: siteConfig.stats.ordersShipped, label: "orders shipped" },
  ];
  return (
    <section aria-labelledby="testimonials-title" className="section-y">
      <div className="container-site">
        <div className="mb-14 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-4 flex items-center gap-3 text-muted">
              <span className="inline-block h-px w-8 bg-acid" aria-hidden="true" />
              From the chair
            </p>
            <h2 id="testimonials-title" className="display text-[2.75rem] text-bone sm:text-6xl lg:text-7xl">
              {siteConfig.stats.artists} artists.
              <br />
              {siteConfig.stats.countries} countries.
            </h2>
          </div>
          <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6 lg:col-span-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="display block text-4xl text-acid sm:text-5xl">{s.value}</span>
                  <span className="eyebrow mt-2 block text-[10px] text-muted">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Swipeable row on phones, bordered grid from sm up. */}
        <ul
          className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-px sm:overflow-hidden sm:rounded-card sm:border sm:border-line sm:bg-line sm:px-0 sm:pb-0 lg:grid-cols-3"
          aria-label="Artist testimonials"
        >
          {testimonials.map((t) => (
            <li key={t.name} className="flex w-[85%] shrink-0 snap-start sm:w-auto">
              <figure className="flex w-full flex-col rounded-card border border-line bg-ink p-6 transition-colors hover:bg-charcoal sm:rounded-none sm:border-0 sm:p-8">
                <p aria-hidden="true" className="display text-5xl leading-none text-acid">
                  “
                </p>
                <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-bone">
                  <p>{t.quote}</p>
                </blockquote>
                <p className="eyebrow mt-5 text-[10px] text-faint">Uses: {t.product}</p>
                <figcaption className="mt-6 flex items-center gap-4 border-t border-line pt-6">
                  <Avatar
                    name={t.name}
                    label={`Portrait of ${t.name}, ${t.style} artist at ${t.studio}`}
                    className="h-14 w-14 shrink-0 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-bone">{t.name}</p>
                    <p className="text-sm text-muted">
                      {t.studio} · {t.city}, {t.country}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
