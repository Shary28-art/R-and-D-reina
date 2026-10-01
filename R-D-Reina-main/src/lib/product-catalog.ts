import type { Product, ProductFilters, SortOption } from "@/types/product";
import { products } from "@/data/products";
import { getAvailableForDate } from "@/lib/inventory";

export function getProductBySlug(
  categorySlug: string,
  slug: string,
): Product | undefined {
  return products.find(
    (p) => p.categorySlug === categorySlug && p.slug === slug,
  );
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function filterProducts(filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.query?.trim()) {
    const q = filters.query.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.toLowerCase().includes(q)),
    );
  }

  if (filters.categorySlug) {
    result = result.filter((p) => p.categorySlug === filters.categorySlug);
  }

  if (filters.subcategorySlug) {
    result = result.filter(
      (p) => p.subcategorySlug === filters.subcategorySlug,
    );
  }

  if (filters.minPrice != null) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice != null) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.availableOnly && filters.eventDate) {
    result = result.filter(
      (p) => getAvailableForDate(p, filters.eventDate!) > 0,
    );
  }

  result = sortProducts(result, filters.sort ?? "featured");

  return result;
}

export function sortProducts(items: Product[], sort: SortOption): Product[] {
  const copy = [...items];
  switch (sort) {
    case "newest":
      return copy.sort(
        (a, b) => Number(b.newProduct) - Number(a.newProduct) || a.name.localeCompare(b.name),
      );
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "best-selling":
      return copy.sort(
        (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || a.name.localeCompare(b.name),
      );
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return copy.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          Number(b.bestSeller) - Number(a.bestSeller) ||
          a.name.localeCompare(b.name),
      );
  }
}

export function getFeaturedProducts(limit = 8): Product[] {
  return sortProducts(
    products.filter((p) => p.featured),
    "featured",
  ).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug ||
          p.subcategorySlug === product.subcategorySlug),
    )
    .slice(0, limit);
}
