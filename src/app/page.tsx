import type { Metadata } from "next";
import { BestSellers } from "@/components/home/BestSellers";
import { BundleDeals } from "@/components/home/BundleDeals";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustStrip } from "@/components/home/TrustStrip";
import { VolumeExplainer } from "@/components/home/VolumeExplainer";
import { WorkGallery } from "@/components/home/WorkGallery";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Professional Tattoo Supplies",
    description: siteConfig.description,
    path: "/",
  }),
  title: { absolute: `${siteConfig.name} | Professional Tattoo Supplies, Shipped Worldwide` },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <BestSellers />
      <BundleDeals />
      <VolumeExplainer />
      <Testimonials />
      <WorkGallery />
      <Newsletter />
    </>
  );
}
