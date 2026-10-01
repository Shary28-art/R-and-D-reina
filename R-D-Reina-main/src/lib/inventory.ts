import type { Product } from "@/types/product";
import type { AvailabilityResult } from "@/types/product";

const LIMITED_THRESHOLD = 5;

/**
 * Mock inventory service — swap implementation for API/database later.
 */
export function getAvailableForDate(
  product: Product,
  eventDate: string,
): number {
  if (!eventDate) return product.inventory.totalStock;

  if (product.inventory.byDate && eventDate in product.inventory.byDate) {
    return product.inventory.byDate[eventDate] ?? 0;
  }

  // Deterministic pseudo-variation by date hash for demo realism
  const hash = [...eventDate, product.id].reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0,
  );
  const ratio = 0.35 + (hash % 66) / 100;
  return Math.max(0, Math.floor(product.inventory.totalStock * ratio));
}

export function checkAvailability(
  product: Product,
  eventDate: string,
  quantity = 1,
): AvailabilityResult {
  if (!eventDate) {
    return {
      status: "available",
      available: product.inventory.totalStock,
      message: "Select an event date to check availability",
    };
  }

  const available = getAvailableForDate(product, eventDate);

  if (available === 0) {
    return {
      status: "unavailable",
      available: 0,
      message: "Not available for this date",
    };
  }

  if (available < quantity || available <= LIMITED_THRESHOLD) {
    return {
      status: "limited",
      available,
      message: `Only ${available} available for this date`,
    };
  }

  return {
    status: "available",
    available,
    message: `${available} available for ${formatShortDate(eventDate)}`,
  };
}

function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function maxAddableQuantity(
  product: Product,
  eventDate: string,
  currentInCart: number,
): number {
  const available = getAvailableForDate(product, eventDate);
  return Math.max(0, available - currentInCart);
}
