"use client";

import Link from "next/link";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

export function CategorySidebar({
  activeCategory,
  activeSubcategory,
  minPrice,
  maxPrice,
  onPriceChange,
  availableOnly,
  onAvailableChange,
  eventDate,
  onEventDateChange,
}: {
  activeCategory?: string;
  activeSubcategory?: string;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  availableOnly: boolean;
  onAvailableChange: (v: boolean) => void;
  eventDate: string;
  onEventDateChange: (d: string) => void;
}) {
  const cat = categories.find((c) => c.slug === activeCategory);

  return (
    <aside className="space-y-8 rounded-sm bg-white p-5 ring-1 ring-black/5">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest">
          Categories
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link
              href="/shop"
              className={cn(
                "hover:text-gold",
                !activeCategory && "font-medium text-gold",
              )}
            >
              All products
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/rentals/${c.slug}`}
                className={cn(
                  "hover:text-gold",
                  activeCategory === c.slug && "font-medium text-gold",
                )}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {cat && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest">
            Subcategories
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href={`/rentals/${cat.slug}`}
                className={cn(
                  "hover:text-gold",
                  !activeSubcategory && "font-medium text-gold",
                )}
              >
                All {cat.name}
              </Link>
            </li>
            {cat.subcategories.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/rentals/${cat.slug}?sub=${s.slug}`}
                  className={cn(
                    "hover:text-gold",
                    activeSubcategory === s.slug && "font-medium text-gold",
                  )}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest">
          Price
        </h2>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            min={0}
            value={minPrice || ""}
            placeholder="Min"
            onChange={(e) =>
              onPriceChange(Number(e.target.value) || 0, maxPrice)
            }
            className="w-full rounded-sm border border-black/10 px-2 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            value={maxPrice || ""}
            placeholder="Max"
            onChange={(e) =>
              onPriceChange(minPrice, Number(e.target.value) || 99999)
            }
            className="w-full rounded-sm border border-black/10 px-2 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest">
          Availability
        </h2>
        <label className="mt-3 block text-sm">
          Event date
          <input
            type="date"
            value={eventDate}
            onChange={(e) => onEventDateChange(e.target.value)}
            className="mt-1 w-full rounded-sm border border-black/10 px-2 py-2 text-sm"
          />
        </label>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => onAvailableChange(e.target.checked)}
            disabled={!eventDate}
          />
          Available on selected date only
        </label>
      </div>
    </aside>
  );
}
