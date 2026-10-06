"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";
import { maxAddableQuantity } from "@/lib/inventory";

export interface CartLine {
  productId: string;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  quantity: number;
  eventDate: string;
  image: string;
}

interface CartState {
  items: CartLine[];
  addItem: (
    product: Product,
    quantity: number,
    eventDate: string,
  ) => { ok: boolean; message?: string };
  updateQuantity: (
    productId: string,
    eventDate: string,
    quantity: number,
    product?: Product,
  ) => { ok: boolean; message?: string };
  removeItem: (productId: string, eventDate: string) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, eventDate) => {
        if (!eventDate) {
          return { ok: false, message: "Please select an event date." };
        }
        const existing = get().items.find(
          (i) => i.productId === product.id && i.eventDate === eventDate,
        );
        const inCart = existing?.quantity ?? 0;
        const max = maxAddableQuantity(product, eventDate, inCart);
        if (max <= 0) {
          return {
            ok: false,
            message: "Not enough inventory for this date.",
          };
        }
        const addQty = Math.min(quantity, max);
        set((state) => {
          const idx = state.items.findIndex(
            (i) =>
              i.productId === product.id && i.eventDate === eventDate,
          );
          if (idx >= 0) {
            const next = [...state.items];
            next[idx] = {
              ...next[idx],
              quantity: next[idx].quantity + addQty,
            };
            return { items: next };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                slug: product.slug,
                categorySlug: product.categorySlug,
                price: product.price,
                quantity: addQty,
                eventDate,
                image: product.images[0],
              },
            ],
          };
        });
        return { ok: true };
      },
      updateQuantity: (productId, eventDate, quantity, product) => {
        if (quantity <= 0) {
          get().removeItem(productId, eventDate);
          return { ok: true };
        }
        if (product) {
          const max = maxAddableQuantity(product, eventDate, 0);
          if (quantity > max) {
            return { ok: false, message: "Exceeds available inventory." };
          }
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.eventDate === eventDate
              ? { ...i, quantity }
              : i,
          ),
        }));
        return { ok: true };
      },
      removeItem: (productId, eventDate) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.productId === productId && i.eventDate === eventDate),
          ),
        }));
      },
      clear: () => set({ items: [] }),
      subtotal: () =>
        get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      itemCount: () =>
        get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: "rd-by-reina-cart" },
  ),
);
