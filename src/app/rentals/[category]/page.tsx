import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogExperience } from "@/components/catalog/CatalogExperience";
import { getCategoryBySlug } from "@/data/categories";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: "Category" };
  return {
    title: cat.name,
    description: cat.description,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { sub } = await searchParams;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  return (
    <CatalogExperience
      categorySlug={cat.slug}
      subcategorySlug={sub}
      title={cat.name}
      description={cat.description}
    />
  );
}
