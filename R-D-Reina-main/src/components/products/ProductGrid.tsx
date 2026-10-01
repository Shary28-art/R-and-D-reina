import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

export function ProductGrid({
  products,
  emptyMessage = "No products match your filters.",
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-black/10 bg-white/50 py-16 text-center text-warm-gray">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid self-start content-start grid-cols-2 items-start gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
