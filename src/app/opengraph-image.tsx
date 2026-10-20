import { siteConfig } from "@/config/site";
import { freeShippingLabel } from "@/lib/format";
import { ogCard, ogSize } from "@/lib/og";

export const alt = `${siteConfig.name}: professional tattoo supplies`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Pro tattoo supply",
    title: "Forged for the chair.",
    sub: `Sterile cartridge needles, grips & studio disposables · ${freeShippingLabel}`,
  });
}
