import Image from "next/image";
import type { Product, ProductImage as Img } from "@/lib/commerce/types";
import { ProductArt } from "./ProductArt";

/** Renders the real photo when `image.src` exists, otherwise the placeholder art. */
export function ProductImage({
  product,
  image = product.images[0],
  className = "",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
}: {
  product: Product;
  image?: Img;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (image.src) {
    return (
      <div className={`relative ${className}`}>
        <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <ProductArt
      kind={product.art}
      label={product.artLabel}
      sku={product.sku}
      view={image.view}
      alt={image.alt}
      className={className}
    />
  );
}
