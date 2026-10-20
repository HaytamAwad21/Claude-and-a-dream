import { Icon, type IconName } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { formatPriceShort } from "@/lib/format";

const items: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "truck",
    title: `Free shipping over ${formatPriceShort(siteConfig.shipping.freeShippingThreshold)}`,
    text: "Tracked, worldwide",
  },
  { icon: "return", title: `${siteConfig.returns.days}-day returns`, text: "On unopened products" },
  { icon: "shield", title: "Sterile, EO-certified", text: "Lot-tracked, sealed blisters" },
  { icon: "globe", title: "Ships worldwide", text: `From ${siteConfig.shipping.origin} to ${siteConfig.stats.countries}+ countries` },
];

export function TrustStrip() {
  return (
    <section aria-label="Why order from us" className="border-b border-line bg-charcoal">
      <ul className="container-site grid grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <li
            key={it.title}
            className={`flex items-start gap-4 py-6 pr-4 sm:items-center lg:py-8 ${
              i % 2 === 1 ? "border-l border-line pl-4 lg:pl-8" : i === 2 ? "lg:border-l lg:border-line lg:pl-8" : ""
            } ${i < 2 ? "border-b border-line lg:border-b-0" : ""}`}
          >
            <Icon name={it.icon} size={26} strokeWidth={1.3} className="mt-0.5 shrink-0 text-acid sm:mt-0" />
            <div>
              <p className="text-sm font-semibold text-bone">{it.title}</p>
              <p className="mt-0.5 text-xs text-muted">{it.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
