export interface Subcategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  navGroup: "rentals" | "decor";
  description: string;
  image: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    name: "Tables",
    slug: "tables",
    navGroup: "rentals",
    description: "Farm tables, banquet rounds, cocktail tables, and sweetheart dining.",
    image: "/images/Round-table.jpg",
    subcategories: [
      { name: "Farm Tables", slug: "farm-tables" },
      { name: "Round Tables", slug: "round-tables" },
      { name: "Specialty Tables", slug: "specialty-tables" },
    ],
  },
  {
    name: "Chairs",
    slug: "chairs",
    navGroup: "rentals",
    description: "Ghost, chiavari, throne, and luxury seating for every style.",
    image: "/images/Ghost-chair.jpg",
    subcategories: [
      { name: "Ghost Clear Chair", slug: "ghost-clear-chair" },
      { name: "Black & Gold Luxury Chair", slug: "black-gold-luxury" },
      { name: "Luxury Gold Chair", slug: "luxury-gold-chair" },
      { name: "Garden Chairs", slug: "garden-chairs" },
      { name: "Modular Cream Sofa", slug: "modular-cream-sofa" },

    ],
  },
  {
    name: "Tablecloths & Napkins",
    slug: "tablecloths-napkins",
    navGroup: "rentals",
    description: "Linens, runners, and napkins in refined palettes.",
    image: "/images/Baby-Blue-Napkins.jpeg",
    subcategories: [
      { name: "Tablecloths", slug: "tablecloths" },
      { name: "Napkins", slug: "napkins" },
    ],
  },
  {
    name: "Centerpieces & Candelabras",
    slug: "centerpieces-candelabras",
    navGroup: "decor",
    description: "Floral centerpieces, candelabras, and statement table décor.",
    image: "/images/flower-5-no-customize.jpeg",
    subcategories: [
      { name: "Floral Centerpieces", slug: "floral-centerpieces" },
      { name: "Floral Arrangements", slug: "floral-arrangements" },
    ],
  },
  {
    name: "Glassware & Chargers",
    slug: "glassware-chargers",
    navGroup: "rentals",
    description: "Reef charger plates, beaded chargers, stemware, and flutes.",
    image: "/images/White-Charger-plates.jpg",
    subcategories: [
      { name: "Charger Plates", slug: "charger-plates" },
      { name: "Glassware", slug: "glassware" },
    ],
  },
  {
    name: "Backdrops & Focal Points",
    slug: "backdrops-focal-points",
    navGroup: "decor",
    description: "Arches, panels, walls, and immersive focal displays.",
    image: "/images/Luxury-White-Wedding-Welcome-Display.jpg",
    subcategories: [
      { name: "Backdrops", slug: "backdrops" },
    ],
  },
  {
    name: "Kids",
    slug: "kids",
    navGroup: "rentals",
    description: "Banquet tables, chiavari chairs, and party styling for little guests.",
    image: "/images/Kids-White-Folding-Craft-Table.jpg",
    subcategories: [
      { name: "Kids Tables", slug: "kids-tables" },
      { name: "Kids Chairs", slug: "kids-chairs" },
      { name: "Bounce Houses", slug: "bounce-houses" },
    ],
  },
 
  {
    name: "Cake Stands & Treat Tables",
    slug: "cake-stands-treat-tables",
    navGroup: "rentals",
    description: "Cake stands, dessert tables, and sweet display pieces.",
    image: "/images/Three-Tier-Crystal-Wedding-Cake-Stand.jpg",
    subcategories: [
      { name: "Cake Stands", slug: "cake-stands" },
      { name: "Treat Displays", slug: "treat-displays" },
    ],
  },
  {
    name: "Photo Booth",
    slug: "entertainment",
    navGroup: "rentals",
    description: "Photo booth experiences and bounce house rentals.",
    image: "/images/photo-booth.jpg",
    subcategories: [
      { name: "Photo Booth", slug: "photo-booth" },
    ],
  },
  {
    name: "Wedding & Stage Designs",
    slug: "wedding-stage-designs",
    navGroup: "decor",
    description: "Ceremony stages, luxury installations, and bespoke design.",
    image: "/images/Minimalist-Elegance-Stage-Setup-Gold-Framing.jpeg",
    subcategories: [
      { name: "Luxury Stage Décor", slug: "luxury-stage-decor" },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getRentalCategories(): Category[] {
  return categories.filter((c) => c.navGroup === "rentals");
}

export function getDecorCategories(): Category[] {
  return categories.filter((c) => c.navGroup === "decor");
}
