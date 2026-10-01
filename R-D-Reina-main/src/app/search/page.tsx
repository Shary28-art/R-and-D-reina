import type { Metadata } from "next";
import { CatalogExperience } from "@/components/catalog/CatalogExperience";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = {
  title: "Search",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <CatalogExperience
      initialQuery={query}
      title={query ? `Results for “${query}”` : "Search"}
      description={
        query
          ? "Refine with filters and sorting below."
          : "Enter a term to search rentals by name, category, or keyword."
      }
    />
  );
}
