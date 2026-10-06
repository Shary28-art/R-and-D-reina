import type { Metadata } from "next";
import { CatalogExperience } from "@/components/catalog/CatalogExperience";

export const metadata: Metadata = {
  title: "Shop All Rentals",
  description: "Browse the full R&D by Reina rental catalog.",
};

export default function ShopPage() {
  return (
    <CatalogExperience
      title="All rentals"
      description="Filter by category, price, and availability for your event date."
    />
  );
}
