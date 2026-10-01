"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartLine } from "@/store/cart-store";
import { formatPrice, formatDisplayDate } from "@/lib/utils";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { useCartStore } from "@/store/cart-store";
import { getProductById } from "@/lib/product-catalog";
import { maxAddableQuantity } from "@/lib/inventory";
import { useToast } from "@/components/providers/ToastProvider";

export function CartItemRow({ item }: { item: CartLine }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { toast } = useToast();
  const product = getProductById(item.productId);

  const max = product
    ? maxAddableQuantity(product, item.eventDate, 0)
    : item.quantity;

  return (
    <div className="flex gap-4 border-b border-black/5 py-6">
      <Link
        href={`/rentals/${item.categorySlug}/${item.slug}`}
        className="relative h-28 w-24 shrink-0 overflow-hidden rounded-sm"
      >
        <Image src={item.image} alt="" fill className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:justify-between">
        <div>
          <Link
            href={`/rentals/${item.categorySlug}/${item.slug}`}
            className="font-serif text-lg hover:text-gold"
          >
            {item.name}
          </Link>
          <p className="text-sm text-warm-gray">
            Event: {formatDisplayDate(item.eventDate)}
          </p>
          <p className="mt-1 text-sm font-medium">{formatPrice(item.price)}</p>
          <button
            type="button"
            onClick={() => removeItem(item.productId, item.eventDate)}
            className="mt-2 text-xs uppercase tracking-widest text-warm-gray hover:text-red-800"
          >
            Remove
          </button>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <QuantitySelector
            value={item.quantity}
            max={max}
            onChange={(q) => {
              const res = updateQuantity(
                item.productId,
                item.eventDate,
                q,
                product,
              );
              if (!res.ok) toast(res.message ?? "Invalid quantity", "error");
            }}
          />
          <p className="text-sm font-medium">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
