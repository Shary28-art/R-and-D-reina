"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { SortOption } from "@/types/product";
import { filterProducts } from "@/lib/product-catalog";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategorySidebar } from "@/components/catalog/CategorySidebar";
import { SortDropdown } from "@/components/catalog/SortDropdown";
import { SlidersHorizontal } from "lucide-react";

export function CatalogExperience({
  categorySlug,
  subcategorySlug,
  initialQuery = "",
  title,
  description,
}: {
  categorySlug?: string;
  subcategorySlug?: string;
  initialQuery?: string;
  title: string;
  description?: string;
}) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  const [sort, setSort] = useState<SortOption>("featured");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [eventDate, setEventDate] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  const products = useMemo(
    () =>
      filterProducts({
        categorySlug,
        subcategorySlug,
        query,
        sort,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice < 99999 ? maxPrice : undefined,
        eventDate: eventDate || undefined,
        availableOnly,
      }),
    [
      categorySlug,
      subcategorySlug,
      query,
      sort,
      minPrice,
      maxPrice,
      eventDate,
      availableOnly,
    ],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl text-charcoal md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 text-warm-gray leading-relaxed">{description}</p>
        )}
      </header>

      <div className="mt-8 flex flex-col gap-4 border-y border-black/5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in catalog…"
              className="w-full rounded-sm border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-gold"
              aria-label="Filter products"
            />
          </div>
          <p className="text-sm text-warm-gray">
            {products.length} product{products.length !== 1 && "s"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-sm border border-black/10 px-3 py-2 text-sm lg:hidden"
            onClick={() => setMobileFilters(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className={`${mobileFilters ? "block" : "hidden"} lg:block`}>
          <CategorySidebar
            activeCategory={categorySlug}
            activeSubcategory={subcategorySlug}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            availableOnly={availableOnly}
            onAvailableChange={setAvailableOnly}
            eventDate={eventDate}
            onEventDateChange={setEventDate}
          />
          {mobileFilters && (
            <button
              type="button"
              className="mt-4 w-full rounded-sm bg-charcoal py-2 text-sm text-white lg:hidden"
              onClick={() => setMobileFilters(false)}
            >
              Apply filters
            </button>
          )}
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
