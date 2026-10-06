import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  light?: boolean;
}

export function Logo({
  className = "",
  size = "md",
  showText = false,
  light = false,
}: LogoProps) {
  const dimensions = {
    sm: { width: 44, height: 44, logoClass: "h-11 w-11" },
    md: { width: 56, height: 56, logoClass: "h-14 w-14" },
    lg: { width: 80, height: 80, logoClass: "h-20 w-20" },
  }[size];

  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 transition ${className}`}
      aria-label="R&D by Reina home"
    >
      <div
        className={`relative ${dimensions.logoClass} shrink-0 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105`}
      >
        <Image
          src="/images/logo.png"
          alt="R&D by Reina Logo"
          fill
          sizes="80px"
          className="object-contain"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-serif tracking-[0.2em] text-lg font-medium transition ${
              light ? "text-ivory group-hover:text-gold" : "text-charcoal group-hover:text-gold"
            }`}
          >
            R&amp;D
          </span>
          <span
            className={`text-[0.65rem] uppercase tracking-[0.3em] ${
              light ? "text-champagne/80" : "text-warm-gray"
            }`}
          >
            by Reina
          </span>
        </div>
      )}
    </Link>
  );
}
