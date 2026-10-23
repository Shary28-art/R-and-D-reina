import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-4xl">Checkout</h1>
      <p className="mt-2 text-warm-gray">
        Complete your details to continue with Zelle payment.
      </p>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}
