import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { categories } from "@/data/categories";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gold/20 bg-[#121110] text-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-6">
        <div>
          <Logo size="md" showText={true} light={true} />
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-champagne/70">
            Luxury event rentals, floral design, and bespoke event styling for weddings, gala receptions, and memorable celebrations.
          </p>
          <div className="mt-6 space-y-2 text-xs text-champagne/80">
            <span className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Social Media</span>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://www.instagram.com/decorbyreina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition flex items-center gap-1.5"
                >
                  <span className="text-champagne/60">IG:</span>
                  <span className="text-ivory">Reina &amp; Decor by Reina</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@decorbyreina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition flex items-center gap-1.5"
                >
                  <span className="text-champagne/60">TikTok:</span>
                  <span className="text-ivory">decorbyreina</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/search/top?q=Rentals%20%26%20Decor%20by%20Reina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition flex items-center gap-1.5"
                >
                  <span className="text-champagne/60">FB:</span>
                  <span className="text-ivory">Rentals &amp; Decor by Reina</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Navigation
          </h3>
          <ul className="mt-4 space-y-2.5 text-xs text-champagne/80">
            <li>
              <Link href="/" className="hover:text-gold transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-gold transition">
                Services &amp; Rentals
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-gold transition">
                Event Gallery
              </Link>
            </li>
            <li>
              <Link href="/request-a-quote" className="hover:text-gold transition">
                Get a Quote
              </Link>
            </li>
            <li>
              <Link href="/rental-policies" className="hover:text-gold transition">
                Rental Policies
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Rental Categories
          </h3>
          <ul className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-2 text-xs text-champagne/80">
            {categories.slice(0, 10).map((c) => (
              <li key={c.slug}>
                <Link href={`/rentals/${c.slug}`} className="hover:text-gold transition">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Contact &amp; Studio
          </h3>
          <ul className="mt-4 space-y-3 text-xs text-champagne/80">
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
              <a href="tel:972-920-6561" className="hover:text-gold transition">
                972-920-6561
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
              <a href="mailto:rdbyreina@gmail.com" className="hover:text-gold transition">
                rdbyreina@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-gold shrink-0" />
              <span>Monday – Saturday: 9:00 AM – 6:00 PM</span>
            </li>
            <li className="flex items-start gap-2 pt-1">
              <MapPin className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
              <span>502 Periwinkle Dr, Mansfield, TX 76063</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 px-4 text-center text-[11px] text-champagne/60 md:flex-row md:px-6">
        <p>© {new Date().getFullYear()} R&amp;D by Reina. All rights reserved.</p>
        <Link href="/admin" className="text-champagne/70 hover:text-gold transition">
          Admin Operations Portal
        </Link>
      </div>
    </footer>
  );
}
