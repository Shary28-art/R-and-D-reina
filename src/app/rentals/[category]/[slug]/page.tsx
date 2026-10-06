import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/product-catalog";
import { getCategoryBySlug } from "@/data/categories";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductDetailActions } from "@/components/products/ProductDetailActions";
import { ProductGrid } from "@/components/products/ProductGrid";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  const cat = getCategoryBySlug(category);
  if (!product || !cat) notFound();

  const related = getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: cat.name, href: `/rentals/${cat.slug}` },
          { label: product.name },
        ]}
      />
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <ProductGallery
          images={product.images}
          alt={`${product.name} — R&D by Reina Luxury Rental`}
          containImage={product.name === "Photo booth"}
        />
        <div className="bg-white p-6 rounded-sm ring-1 ring-black/5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            {product.category} • {product.subcategory}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-[#141312] font-semibold">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-bold text-[#141312]">{formatPrice(product.price)}</p>
          <p className="mt-4 leading-relaxed text-[#3e3935] text-sm">{product.description}</p>
          <ProductDetailActions product={product} />
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-20 border-t border-black/5 pt-16">
          <h2 className="font-serif text-3xl">You may also like</h2>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
