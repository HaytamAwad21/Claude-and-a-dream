import type { Metadata } from "next";
import { WishlistView } from "@/components/product/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Products you saved for later.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <div className="container-site py-10 lg:py-16">
      <h1 className="display mb-10 text-6xl text-bone lg:text-8xl">Wishlist</h1>
      <WishlistView />
    </div>
  );
}
