export interface ProductInventory {
  /** Total units owned (mock until backend) */
  totalStock: number;
  /** Date-specific overrides: ISO date (YYYY-MM-DD) -> available count */
  byDate?: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  description: string;
  price: number;
  images: string[];
  featured: boolean;
  newProduct: boolean;
  bestSeller: boolean;
  inventory: ProductInventory;
  keywords: string[];
}

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "best-selling"
  | "name-asc";

export interface ProductFilters {
  categorySlug?: string;
  subcategorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  eventDate?: string;
  query?: string;
  sort?: SortOption;
}

export type AvailabilityStatus = "available" | "limited" | "unavailable";

export interface AvailabilityResult {
  status: AvailabilityStatus;
  available: number;
  message: string;
}
