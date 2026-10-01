"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryItems, galleryCategories, type GalleryItem } from "@/data/gallery";
import { X, Sparkles, ArrowRight, Eye } from "lucide-react";

interface GalleryGridProps {
  limit?: number;
  showFilters?: boolean;
}

export function GalleryGrid({ limit, showFilters = true }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const filteredItems = galleryItems.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.categorySlug === selectedCategory;
  });

  const displayedItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  return (
    <div>
      {/* Category Filter Pills */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2 pb-8">
          {galleryCategories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
                  isActive
                    ? "bg-[#141312] text-gold shadow-md ring-1 ring-gold/40"
                    : "bg-black/5 text-[#3e3935] hover:bg-black/10 hover:text-[#141312]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Gallery Masonry / Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setActiveModalItem(item)}
            className="group relative cursor-pointer overflow-hidden rounded-xl bg-[#141312] shadow-md ring-1 ring-black/10 transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:ring-gold/50"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#252321]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-105"
                priority={idx < 3}
              />
              {/* Subtle gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-60 transition duration-300 group-hover:opacity-90" />
            </div>

            {/* Quick-view icon badge */}
            <div className="absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-champagne backdrop-blur-md transition group-hover:scale-110 group-hover:bg-gold group-hover:text-[#141312]">
              <Eye className="h-4 w-4" />
            </div>

            {/* Always visible category badge */}
            <div className="absolute top-3.5 left-3.5">
              <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold backdrop-blur-md ring-1 ring-gold/30">
                {item.category}
              </span>
            </div>

            {/* Bottom Content Card Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-5 text-ivory">
              <h3 className="font-serif text-lg font-semibold leading-snug text-ivory group-hover:text-gold transition">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-champagne/80">
                {item.description}
              </p>

              {/* Tags & Action prompt */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] uppercase tracking-wider text-gold/90 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold opacity-0 transition duration-300 group-hover:opacity-100">
                  Expand <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Detail Modal */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-[#141312] text-ivory shadow-2xl ring-1 ring-gold/40 flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalItem(null)}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-champagne transition hover:bg-gold hover:text-[#141312]"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-square md:aspect-auto md:w-1/2 min-h-[300px] bg-[#252321]">
              <Image
                src={activeModalItem.image}
                alt={activeModalItem.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Modal Content */}
            <div className="flex flex-col justify-between p-6 md:w-1/2 md:p-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                  {activeModalItem.category}
                </span>
                <h2 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-ivory leading-snug">
                  {activeModalItem.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-champagne/80">
                  {activeModalItem.description}
                </p>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {activeModalItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-champagne/90 ring-1 ring-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-2.5 pt-4 border-t border-white/10 sm:flex-row">
                {activeModalItem.relatedRentalLink ? (
                  <Link
                    href={activeModalItem.relatedRentalLink}
                    onClick={() => setActiveModalItem(null)}
                    className="inline-flex items-center justify-center rounded-sm bg-gold-gradient px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#141312] shadow-md transition hover:brightness-110"
                  >
                    View Matching Rentals
                  </Link>
                ) : null}
                <Link
                  href="/request-a-quote"
                  onClick={() => setActiveModalItem(null)}
                  className="inline-flex items-center justify-center rounded-sm border border-gold/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition hover:border-gold hover:text-gold"
                >
                  Book This Look
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
