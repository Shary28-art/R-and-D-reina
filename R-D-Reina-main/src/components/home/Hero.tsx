import Image from "next/image";
import Link from "next/link";
import { Flower2, Armchair, Sparkles, Gift } from "lucide-react";

export function Hero() {
  return (
    <div className="relative bg-[#121110]">
      {/* Main Hero Visual Area */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] overflow-hidden flex items-center">
        {/* Background Event Photography */}
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury wedding tablescape and floral setting"
          fill
          priority
          className="object-cover object-right lg:object-center"
          sizes="100vw"
        />

        {/* Sophisticated Dark Charcoal / Amber Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121110] via-[#121110]/85 to-transparent lg:w-[65%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-black/30" />

        {/* Hero Content aligned left */}
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <div className="max-w-2xl">
            {/* Tagline */}
            <div className="animate-fade-up">
              <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em] text-gold">
                Luxury Wedding Designer &amp;
              </p>
              <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em] text-gold/90 mt-0.5">
                Floral Event Party Rentals
              </p>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up mt-4 font-serif text-4xl leading-[1.1] text-ivory sm:text-6xl lg:text-7xl">
              We Design{" "}
              <span className="font-serif-italic text-gold-gradient font-normal">
                Moments,
              </span>
              <br />
              <span className="font-serif-italic text-gold-gradient font-normal">
                You Cherish Forever.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="animate-fade-up mt-6 text-sm leading-relaxed text-champagne/80 sm:text-base md:max-w-xl">
              From intimate gatherings to grand celebrations, we provide luxury
              décor and rentals that bring your dream events to life.
            </p>

            {/* Dual CTA Buttons from Mockup */}
            <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-sm bg-gold-gradient px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#141312] shadow-lg transition hover:brightness-110"
              >
                Explore Services
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-gold/40 bg-black/40 backdrop-blur-sm px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition hover:border-gold hover:text-gold"
              >
                View Collection <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating 4-Feature Banner directly beneath Hero (From Mockup) */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 -mt-10 md:-mt-14 mb-10 md:px-6">
        <div className="grid grid-cols-1 divide-y divide-black/5 rounded-md bg-[#fdfbf7] p-4 shadow-xl ring-1 ring-gold/20 sm:grid-cols-2 sm:divide-y-0 sm:divide-x sm:divide-black/5 lg:grid-cols-4 lg:p-6">
          {/* Feature 1: Floral Design */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/40 text-gold mb-3">
              <Flower2 className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-base font-semibold tracking-wider uppercase text-charcoal">
              Floral Design
            </h3>
            <p className="mt-1.5 text-xs text-warm-gray leading-relaxed max-w-[210px]">
              Exquisite floral arrangements tailored to your vision.
            </p>
          </div>

          {/* Feature 2: Luxury Rentals */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/40 text-gold mb-3">
              <Armchair className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-base font-semibold tracking-wider uppercase text-charcoal">
              Luxury Rentals
            </h3>
            <p className="mt-1.5 text-xs text-warm-gray leading-relaxed max-w-[210px]">
              Premium furniture &amp; décor for every occasion.
            </p>
          </div>

          {/* Feature 3: Event Styling */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/40 text-gold mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-base font-semibold tracking-wider uppercase text-charcoal">
              Event Styling
            </h3>
            <p className="mt-1.5 text-xs text-warm-gray leading-relaxed max-w-[210px]">
              Bespoke themes and styling that leave a lasting impression.
            </p>
          </div>

          {/* Feature 4: Custom Packages */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/40 text-gold mb-3">
              <Gift className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-base font-semibold tracking-wider uppercase text-charcoal">
              Custom Packages
            </h3>
            <p className="mt-1.5 text-xs text-warm-gray leading-relaxed max-w-[210px]">
              Personalized packages designed just for you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
