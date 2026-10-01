import type { Metadata } from "next";
import { ZelleCheckoutClient } from "@/components/checkout/ZelleCheckoutClient";

export const metadata: Metadata = {
  title: "Pay with Zelle",
};

export default function ZellePaymentPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-4xl md:text-5xl">Pay with Zelle</h1>
      <div className="mt-10">
        <ZelleCheckoutClient />
      </div>
    </div>
  );
}
