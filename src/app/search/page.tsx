import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/product/SearchResults";

export const metadata: Metadata = {
  title: "Search",
  description: "Search tattoo supplies by name, needle configuration or SKU.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="container-site py-10 lg:py-16">
      <h1 className="display mb-8 text-6xl text-bone lg:text-8xl">Search</h1>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-card bg-surface" />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
