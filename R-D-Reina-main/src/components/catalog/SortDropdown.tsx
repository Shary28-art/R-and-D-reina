"use client";

import type { SortOption } from "@/types/product";

const labels: Record<SortOption, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "best-selling": "Best Selling",
  "name-asc": "Name A–Z",
};

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-warm-gray sm:inline">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="rounded-sm border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold"
        aria-label="Sort products"
      >
        {(Object.keys(labels) as SortOption[]).map((k) => (
          <option key={k} value={k}>
            {labels[k]}
          </option>
        ))}
      </select>
    </label>
  );
}
