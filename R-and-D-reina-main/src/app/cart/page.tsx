"use client";

import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-4xl md:text-5xl">Your cart</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-warm-gray">
          Your cart is empty.{" "}
          <a href="/shop" className="text-gold underline">
            Browse rentals
          </a>
        </p>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            {items.map((item) => (
              <CartItemRow key={`${item.productId}-${item.eventDate}`} item={item} />
            ))}
          </div>
          <CartSummary />
        </div>
      )}
    </div>
  );
}
