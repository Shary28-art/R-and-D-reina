"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { QuickAddModal } from "@/components/products/QuickAddModal";
import { LuxuryImage } from "@/components/ui/LuxuryImage";

export function ProductCard({ product }: { product: Product }) {
  const [quickOpen, setQuickOpen] = useState(false);
  const href = `/rentals/${product.categorySlug}/${product.slug}`;
  const isPhotoBooth = product.name === "Photo booth";

  return (
    <>
      <article className="group flex h-fit flex-col overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/10 transition duration-300 hover:shadow-lg hover:ring-gold/40">
        <Link href={href} className="relative aspect-[4/5] overflow-hidden bg-champagne/20">
          <LuxuryImage
            src={product.images[0]}
            alt={`${product.name} — R&D by Reina luxury rental`}
            fill
            className={
              isPhotoBooth
                ? "object-contain transition duration-500"
                : "object-cover transition duration-500 group-hover:scale-105"
            }
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
          />
          {product.newProduct && (
            <span className="absolute left-3 top-3 bg-white/95 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-charcoal shadow-sm">
              New
            </span>
          )}
        </Link>
        <div className="flex flex-1 flex-col p-4 bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            {product.category}
          </p>
          <Link href={href}>
            <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-[#141312] transition group-hover:text-gold">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm font-bold text-[#141312]">{formatPrice(product.price)}</p>
          <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 px-3 py-2.5 text-[10px]"
              href={href}
            >
              View product
            </Button>
            <button
              type="button"
              onClick={() => setQuickOpen(true)}
              className="flex-1 rounded-sm border border-charcoal bg-charcoal px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory transition hover:bg-charcoal/90"
            >
              Add to cart
            </button>
          </div>
        </div>
      </article>
      <QuickAddModal
        product={product}
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
      />
    </>
  );
}
