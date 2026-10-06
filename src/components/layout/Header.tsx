"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { categories, getDecorCategories, getRentalCategories } from "@/data/categories";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search/SearchBar";

const navLink =
  "text-[11px] font-medium uppercase tracking-[0.25em] text-champagne/90 transition hover:text-gold";

function MegaMenu({
  label,
  items,
  onClose,
}: {
  label: string;
  items: typeof categories;
  onClose: () => void;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className={cn(navLink, "flex items-center gap-1 py-4")}
        aria-haspopup="true"
      >
        {label}
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 w-[min(90vw,760px)] -translate-x-1/2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="mt-0 rounded-sm border border-gold/20 bg-[#171615] p-6 shadow-2xl backdrop-blur-lg">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 md:grid-cols-3">
            {items.map((cat) => (
              <Link
                key={cat.slug}
                href={`/rentals/${cat.slug}`}
                onClick={onClose}
                className="text-xs text-champagne/80 transition hover:text-gold"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <Link
              href="/shop"
              onClick={onClose}
              className="text-[10px] uppercase tracking-widest text-gold hover:underline"
            >
              Browse complete rental catalog →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  const rentals = getRentalCategories();
  const decor = getDecorCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-[#121110]/95 backdrop-blur-md shadow-md text-ivory">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Mobile menu toggle */}
        <button
          type="button"
          className="lg:hidden p-1 text-champagne hover:text-gold"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Official Brand Logo */}
        <div className="flex items-center">
          <Logo size="md" showText={false} />
        </div>

        {/* Center Desktop Navigation (Mockup structure) */}
        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            href="/"
            className={cn(navLink, pathname === "/" && "text-gold font-semibold")}
          >
            HOME
          </Link>
          <Link
            href="/about"
            className={cn(navLink, pathname === "/about" && "text-gold font-semibold")}
          >
            ABOUT US
          </Link>
          <Link
            href="/shop"
            className={cn(navLink, pathname === "/shop" && "text-gold font-semibold")}
          >
            SERVICES
          </Link>
          <Link
            href="/gallery"
            className={cn(navLink, pathname === "/gallery" && "text-gold font-semibold")}
          >
            GALLERY
          </Link>
          <MegaMenu label="RENTALS" items={[...rentals, ...decor]} onClose={() => {}} />
          <Link
            href="/contact"
            className={cn(navLink, pathname === "/contact" && "text-gold font-semibold")}
          >
            CONTACT
          </Link>
        </nav>

        {/* Right Side Actions: Phone, Quote CTA, Search, Cart */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="tel:972-920-6561"
            className="hidden items-center gap-1.5 text-xs text-champagne/90 hover:text-gold transition xl:flex"
          >
            <Phone className="h-3.5 w-3.5 text-gold" />
            <span>972-920-6561</span>
          </a>

          <Link
            href="/request-a-quote"
            className="hidden sm:inline-flex items-center justify-center rounded-sm bg-gold-gradient px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#141312] shadow-sm transition hover:brightness-110"
          >
            Get a Quote
          </Link>

          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2 text-champagne/90 transition hover:bg-white/10 hover:text-gold"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <Link
            href="/cart"
            className="relative rounded-full p-2 text-champagne/90 transition hover:bg-white/10 hover:text-gold"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-[#141312]">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Expandable Search Input */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-[#181716] px-4 py-4 md:px-6">
          <div className="mx-auto max-w-xl">
            <SearchBar autoFocus onSubmit={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden">
          <div className="flex h-full w-[min(100%,320px)] flex-col bg-[#141312] text-ivory shadow-2xl border-r border-gold/20">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <Logo size="sm" showText={true} light={true} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-champagne hover:text-gold"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="border-b border-white/10 p-4">
              <SearchBar onSubmit={() => setMobileOpen(false)} />
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/shop", label: "Services & Rentals" },
                { href: "/gallery", label: "Gallery" },
                { href: "/request-a-quote", label: "Get a Quote" },
                { href: "/contact", label: "Contact" },
                { href: "/rental-policies", label: "Rental Policies" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block border-b border-white/5 py-3 text-xs uppercase tracking-widest text-champagne/90 transition hover:text-gold",
                    pathname === l.href && "text-gold font-semibold",
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <p className="mb-2 mt-6 text-[10px] uppercase tracking-widest text-gold font-semibold">
                Rental Categories
              </p>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/rentals/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-1.5 text-xs text-champagne/70 hover:text-gold transition"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-white/10">
              <a
                href="tel:972-920-6561"
                className="flex items-center justify-center gap-2 rounded-sm bg-gold/10 border border-gold/30 py-2.5 text-xs text-gold"
              >
                <Phone className="h-3.5 w-3.5" />
                972-920-6561
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
