"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { AvailabilityChecker } from "@/components/products/AvailabilityChecker";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/components/providers/ToastProvider";
import { maxAddableQuantity } from "@/lib/inventory";
import { Button } from "@/components/ui/Button";

export function ProductDetailActions({ product }: { product: Product }) {
  const [eventDate, setEventDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  const maxQty = eventDate
    ? maxAddableQuantity(product, eventDate, 0)
    : product.inventory.totalStock;

  function addToCart() {
    const result = addItem(product, quantity, eventDate);
    if (!result.ok) {
      toast(result.message ?? "Could not add", "error");
      return;
    }
    toast("Added to cart", "success");
  }

  return (
    <div className="mt-8 space-y-6 border-t border-black/5 pt-8">
      <label className="block text-xs uppercase tracking-widest">
        Event date
        <input
          type="date"
          value={eventDate}
          onChange={(e) => {
            setEventDate(e.target.value);
            setQuantity(1);
          }}
          className="mt-2 w-full max-w-xs rounded-sm border border-black/10 px-3 py-2.5 text-sm"
        />
      </label>
      <AvailabilityChecker
        product={product}
        eventDate={eventDate}
        quantity={quantity}
      />
      <QuantitySelector
        value={quantity}
        max={Math.max(1, maxQty)}
        onChange={setQuantity}
        disabled={!eventDate || maxQty === 0}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={addToCart}
          disabled={!eventDate || maxQty === 0}
          className="flex-1 rounded-sm bg-[#141312] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition hover:bg-[#252321] disabled:opacity-40"
        >
          Add to cart
        </button>
        <Button href="/request-a-quote" variant="outline" className="flex-1 border-[#141312]/30 text-[#141312] hover:border-[#141312]">
          Request a quote
        </Button>
      </div>
    </div>
  );
}
