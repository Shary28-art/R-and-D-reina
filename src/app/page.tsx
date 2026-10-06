import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { categories } from "@/data/categories";
import { getFeaturedProducts, filterProducts } from "@/lib/product-catalog";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const collectionPreview = filterProducts({ sort: "featured" }).slice(0, 12);

  return (
    <div className="bg-[#fbf9f5]">
      {/* Hero with Dark Luxury Aesthetic and 4-Feature Pill Bar */}
      <Hero />

      {/* Featured Rentals Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
              Curated Highlights
            </span>
            <h2 className="mt-1 font-serif text-3xl md:text-4xl text-[#141312] font-semibold">
              Featured Rentals
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#141312] transition hover:text-gold"
          >
            View all rentals
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-10">
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* Shop by Category Tiles */}
      <section className="border-t border-black/5 bg-[#f6f2eb] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
              Explore Our Collection
            </span>
            <h2 className="mt-1 font-serif text-3xl md:text-5xl text-[#141312] font-semibold">
              Shop by Category
            </h2>
            <p className="mt-3 text-sm text-[#4a4540] leading-relaxed">
              Browse seating, tables, linens, centerpieces, backdrops, and full-scale stage designs — organized for effortless planning.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section (Matching uploaded mockup media_1789615696351.jpg) */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Story & Narrative */}
          <div className="lg:col-span-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-gold">
              About Us
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141312] leading-tight">
              Designing Dreams{" "}
              <span className="font-serif-italic text-gold block sm:inline font-normal">
                with Elegance
              </span>
            </h2>
            <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#3e3935]">
              At <strong>R&amp;D by Reina</strong>, we believe every event is unique and deserves to be unforgettable. With a passion for detail and a love for beauty, we curate stunning setups and provide luxury rentals that transform your special moments into timeless memories.
            </p>
            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-sm bg-gold-gradient px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#141312] shadow-sm transition hover:brightness-110"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Composite Card + Official R&D Logo Card (from mockup) */}
          <div className="grid gap-5 sm:grid-cols-5 lg:col-span-7">
            {/* Event Photography Card */}
            <div className="relative aspect-[4/3] sm:aspect-auto sm:col-span-3 min-h-[260px] overflow-hidden rounded-xl bg-champagne/30 shadow-md ring-1 ring-black/10">
              <Image
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
                alt="R&D by Reina luxury event setup"
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            {/* Official Logo Display Card (Matching bottom right of user mockup) */}
            <div className="relative aspect-[4/3] sm:aspect-auto sm:col-span-2 min-h-[260px] overflow-hidden rounded-xl bg-[#141312] p-6 shadow-xl ring-1 ring-gold/30 flex flex-col items-center justify-center text-center">
              <div className="relative h-28 w-28 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="R&D by Reina Emblem"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="mt-4 font-serif text-sm font-semibold tracking-wider text-ivory">
                R&amp;D by Reina
              </p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-gold">
                Luxury Event Rentals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Gallery Showcase Section (Real client setups) */}
      <section className="border-t border-black/5 bg-[#fbf9f5] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                Real Client Events
              </span>
              <h2 className="mt-1 font-serif text-3xl sm:text-4xl md:text-5xl text-[#141312] font-semibold">
                Event Gallery
              </h2>
              <p className="mt-2 text-sm text-[#4a4540] max-w-xl leading-relaxed">
                Authentic weddings, gala dinners, milestone celebrations, and bespoke setups styled by R&amp;D by Reina.
              </p>
            </div>
            <Link
              href="/gallery"
              className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#141312] transition hover:text-gold"
            >
              Explore full gallery
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <GalleryGrid limit={6} />
        </div>
      </section>

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
