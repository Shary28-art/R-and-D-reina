import Link from "next/link";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Event Gallery | R&D by Reina — Luxury Rentals & Event Décor",
  description:
    "Explore our authentic luxury event portfolio featuring real weddings, grand galas, custom milestone backdrops, and bespoke party setups in Dallas-Fort Worth.",
};

export default function GalleryPage() {
  return (
    <div className="bg-[#fbf9f5] min-h-screen">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#141312] py-20 text-ivory md:py-28">
        <div className="absolute inset-0 bg-radial-gold opacity-15 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 text-center md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-champagne/70 transition hover:text-gold mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-gold uppercase mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Real Event Showcase
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-ivory leading-tight">
            Event Gallery &amp;{" "}
            <span className="font-serif-italic text-gold-gradient font-normal">
              Portfolio
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-champagne/80 leading-relaxed">
            Every celebration tells a unique story. Browse our curated collection of real luxury weddings, ballroom galas, milestone celebrations, and bespoke rentals designed by R&amp;D by Reina.
          </p>
        </div>
      </section>

      {/* Main Gallery Showcase Section */}
      <main className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <GalleryGrid />

        {/* Bottom CTA Card */}
        <div className="mt-20 overflow-hidden rounded-2xl bg-[#141312] p-8 md:p-12 text-center text-ivory shadow-xl ring-1 ring-gold/30">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            Bring Your Vision to Life
          </span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-ivory">
            Inspired by What You See?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-champagne/80">
            Whether you are envisioning a lavish ballroom reception, an intimate garden party, or a custom milestone backdrop, our design team is ready to curate every detail.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request-a-quote"
              className="inline-flex items-center justify-center rounded-sm bg-gold-gradient px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#141312] shadow-lg transition hover:brightness-110"
            >
              Request a Custom Quote
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-sm border border-gold/40 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition hover:border-gold hover:text-gold"
            >
              Explore Full Rental Catalog
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
