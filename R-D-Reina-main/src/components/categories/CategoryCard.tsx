import Link from "next/link";
import type { Category } from "@/data/categories";
import { LuxuryImage } from "@/components/ui/LuxuryImage";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/rentals/${category.slug}`}
      className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-champagne/30 ring-1 ring-black/10 transition hover:ring-gold/50"
    >
      <LuxuryImage
        src={category.image}
        alt={`${category.name} — R&D by Reina`}
        fill
        className="object-cover transition duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-6">
        <h3 className="font-serif text-xl tracking-wide md:text-2xl">
          {category.name}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-widest opacity-90">
          Shop collection →
        </p>
      </div>
    </Link>
  );
}
