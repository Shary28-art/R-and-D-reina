"use client";

import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/Button";

export function CartSummary({ checkoutHref = "/checkout" }: { checkoutHref?: string }) {
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <div className="rounded-sm bg-white p-6 ring-1 ring-black/5">
      <h2 className="font-serif text-2xl">Summary</h2>
      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-warm-gray">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between border-t border-black/5 pt-3 text-base font-medium">
          <span>Estimated total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className="text-xs text-warm-gray">
          Delivery, setup, and taxes confirmed after order review.
        </p>
      </div>
      <Button href={checkoutHref} className="mt-6 w-full">
        Checkout
      </Button>
      <Button href="/shop" variant="outline" className="mt-3 w-full">
        Continue shopping
      </Button>
    </div>
  );
}
