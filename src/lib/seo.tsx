import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Product } from "@/lib/commerce/types";
import { categories } from "@/data/categories";
import { priceRange, totalStock } from "@/lib/pricing";

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

/** Per-page metadata with canonical URL and Open Graph / Twitter tags. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationJsonLd() {
  const { contact, social } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    email: contact.email,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.countryCode,
    },
    sameAs: [social.instagram, social.tiktok, social.facebook],
  };
}

export function productJsonLd(product: Product) {
  const { min, max } = priceRange(product);
  const category = categories.find((c) => c.slug === product.category);
  const inStock = totalStock(product) > 0;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    mpn: product.sku,
    description: [product.shortDescription, ...product.description].join(" "),
    category: category?.name,
    brand: { "@type": "Brand", name: product.brand },
    image: [absoluteUrl(`/products/${product.slug}/opengraph-image`)],
    url: absoluteUrl(`/products/${product.slug}`),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: siteConfig.currency,
      lowPrice: min,
      highPrice: max,
      offerCount: product.variants.length,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: siteConfig.name },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingOrigin: { "@type": "DefinedRegion", addressCountry: siteConfig.contact.address.countryCode },
        shippingRate: { "@type": "MonetaryAmount", value: siteConfig.shipping.standardRate, currency: siteConfig.currency },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        merchantReturnDays: siteConfig.returns.days,
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
