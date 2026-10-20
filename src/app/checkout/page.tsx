import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-site py-10 lg:py-16">
      <h1 className="display mb-10 text-6xl text-bone lg:text-8xl">Checkout</h1>
      <CheckoutView />
    </div>
  );
}
