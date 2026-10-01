import type { Metadata } from "next";
import { OrderConfirmationClient } from "@/components/checkout/OrderConfirmationClient";

type Props = { params: Promise<{ orderId: string }> };

export const metadata: Metadata = {
  title: "Order Confirmation",
};

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Thank you</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">
        Thank you for your rental request
      </h1>
      <p className="mt-4 text-lg">
        Order <strong>#{orderId}</strong>
      </p>
      <div className="mt-10">
        <OrderConfirmationClient orderId={orderId} />
      </div>
    </div>
  );
}
