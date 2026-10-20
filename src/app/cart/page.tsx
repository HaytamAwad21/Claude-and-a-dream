import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart, volume savings and shipping before checkout.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <div className="container-site py-10 lg:py-16">
      <h1 className="display mb-10 text-6xl text-bone lg:text-8xl">Your cart</h1>
      <CartPageView />
    </div>
  );
}
