import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-[#121110] flex items-center lg:min-h-[90vh]">
      {/* Background Event Photography */}
      <Image
        src="/images/home-hero-event.png"
        alt="Elegant black and gold event tablescape with floral centerpieces"
        fill
        priority
        quality={95}
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
  );
}
