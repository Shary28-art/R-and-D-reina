import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ProductGrid } from "@/components/products/ProductGrid";
import { filterProducts } from "@/lib/product-catalog";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const collectionPreview = filterProducts({ sort: "featured" }).slice(0, 12);

  return (
    <div className="bg-[#fbf9f5]">
      {/* Hero with Dark Luxury Aesthetic and 4-Feature Pill Bar */}
      <Hero />

      {/* Our Collection Preview Section */}
      <section className="border-t border-black/5 bg-[#f6f2eb] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                Full Catalog
              </span>
              <h2 className="mt-1 font-serif text-3xl md:text-4xl text-[#141312] font-semibold">
                Our Collection
              </h2>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#141312] transition hover:text-gold"
            >
              Browse all items
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid products={collectionPreview} />
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-sm bg-[#141312] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-ivory shadow-md transition hover:bg-[#252321]"
            >
              View All Rentals
            </Link>
          </div>
        </div>
      </section>

      {/* Planning Something Beautiful CTA Banner */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-[#121110]">
        <Image
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury celebration ambiance"
          fill
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-black/50 to-[#121110]/80" />
        <div className="relative mx-auto max-w-3xl px-4 text-center text-ivory md:px-6">
          <span className="text-xs font-bold uppercase tracking-[0.35em] text-gold">
            Reserve Your Date
          </span>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl text-ivory leading-tight">
            Planning Something{" "}
            <span className="font-serif-italic text-gold-gradient font-normal">
              Beautiful?
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-champagne/90 leading-relaxed max-w-xl mx-auto">
            Tell us about your event and let us help bring your vision to life with bespoke décor, luxury seating, and exquisite details.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-sm bg-gold-gradient px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#141312] shadow-lg transition hover:brightness-110"
            >
              Shop Rentals
            </Link>
            <Link
              href="/request-a-quote"
              className="inline-flex items-center justify-center rounded-sm border border-gold/40 bg-black/40 backdrop-blur-sm px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition hover:border-gold hover:text-gold"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
