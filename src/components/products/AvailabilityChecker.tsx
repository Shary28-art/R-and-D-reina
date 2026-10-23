"use client";

import { Check, AlertTriangle, X } from "lucide-react";
import type { Product } from "@/types/product";
import { checkAvailability } from "@/lib/inventory";
import { cn } from "@/lib/utils";

export function AvailabilityChecker({
  product,
  eventDate,
  quantity = 1,
}: {
  product: Product;
  eventDate: string;
  quantity?: number;
}) {
  const result = checkAvailability(product, eventDate, quantity);

  if (!eventDate) {
    return (
      <p className="mt-3 text-sm text-warm-gray">
        Select an event date to check availability.
      </p>
    );
  }

  const Icon =
    result.status === "available"
      ? Check
      : result.status === "limited"
        ? AlertTriangle
        : X;

  return (
    <p
      className={cn(
        "mt-3 flex items-start gap-2 text-sm",
        result.status === "available" && "text-emerald-800",
        result.status === "limited" && "text-amber-800",
        result.status === "unavailable" && "text-red-800",
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>
        {result.status === "available" && "✓ "}
        {result.status === "limited" && "⚠ "}
        {result.status === "unavailable" && "✕ "}
        {result.message}
      </span>
    </p>
  );
}
