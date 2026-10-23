"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/product";
import { Modal } from "@/components/ui/Modal";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { AvailabilityChecker } from "@/components/products/AvailabilityChecker";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/components/providers/ToastProvider";
import { maxAddableQuantity } from "@/lib/inventory";

export function QuickAddModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const [eventDate, setEventDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  const maxQty = eventDate
    ? maxAddableQuantity(product, eventDate, 0)
    : product.inventory.totalStock;

  function handleAdd() {
    const result = addItem(product, quantity, eventDate);
    if (!result.ok) {
      toast(result.message ?? "Could not add to cart", "error");
      return;
    }
    toast("Added to cart", "success");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add to cart">
      <div className="flex gap-4">
        <div className="relative hidden h-32 w-24 shrink-0 overflow-hidden rounded-sm sm:block">
          <Image
            src={product.images[0]}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="font-serif text-xl">{product.name}</p>
          <p className="mt-1 text-sm font-medium">{formatPrice(product.price)}</p>
          <label className="mt-4 block text-xs uppercase tracking-widest">
            Event date
            <input
              type="date"
              value={eventDate}
              onChange={(e) => {
                setEventDate(e.target.value);
                setQuantity(1);
              }}
              className="mt-1 w-full rounded-sm border border-black/10 px-3 py-2 text-sm"
            />
          </label>
          <AvailabilityChecker
            product={product}
            eventDate={eventDate}
            quantity={quantity}
          />
          <div className="mt-4">
            <QuantitySelector
              value={quantity}
              max={Math.max(1, maxQty)}
              onChange={setQuantity}
              disabled={!eventDate || maxQty === 0}
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!eventDate || maxQty === 0}
            className="mt-4 w-full rounded-sm bg-charcoal py-3 text-xs font-semibold uppercase tracking-widest text-ivory disabled:opacity-40"
          >
            Add to cart
          </button>
        </div>
      </div>
    </Modal>
  );
}
