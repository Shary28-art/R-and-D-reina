"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({
  defaultQuery = "",
  autoFocus,
  onSubmit,
}: {
  defaultQuery?: string;
  autoFocus?: boolean;
  onSubmit?: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQuery);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
    onSubmit?.();
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search rentals…"
        autoFocus={autoFocus}
        className="w-full rounded-sm border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-gold focus:ring-2"
        aria-label="Search products"
      />
    </form>
  );
}
