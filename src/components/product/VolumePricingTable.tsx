import { formatPercent, formatPrice } from "@/lib/format";
import { volumeTiers } from "@/lib/pricing";

/** Tier table. `activeQty` highlights the tier a quantity falls into. */
export function VolumePricingTable({
  basePrice,
  unit = "box",
  activeQty,
  caption,
}: {
  basePrice: number;
  unit?: string;
  activeQty?: number;
  caption?: string;
}) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      {caption && <caption className="eyebrow mb-3 text-left text-faint">{caption}</caption>}
      <thead>
        <tr className="border-b border-line-strong">
          <th scope="col" className="eyebrow py-3 pr-4 font-normal text-faint">
            Quantity
          </th>
          <th scope="col" className="eyebrow py-3 pr-4 font-normal text-faint">
            Discount
          </th>
          <th scope="col" className="eyebrow py-3 text-right font-normal text-faint">
            Price / {unit}
          </th>
        </tr>
      </thead>
      <tbody>
        {volumeTiers.map((t) => {
          const active = activeQty !== undefined && activeQty >= t.min && (t.max === null || activeQty <= t.max);
          return (
            <tr
              key={t.min}
              className={`border-b border-line transition-colors ${active ? "bg-acid/10" : ""}`}
              aria-current={active ? "true" : undefined}
            >
              <th scope="row" className={`py-3 pr-4 font-medium ${active ? "text-acid" : "text-bone"}`}>
                {t.label}
              </th>
              <td className="py-3 pr-4 font-mono text-muted">{t.discount ? `−${formatPercent(t.discount)}` : "List"}</td>
              <td className={`py-3 text-right font-mono ${active ? "text-acid" : "text-bone"}`}>
                {formatPrice(basePrice * (1 - t.discount))}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
