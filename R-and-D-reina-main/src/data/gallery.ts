export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  description: string;
  image: string;
  featured: boolean;
  tags: string[];
  relatedRentalLink?: string;
}

export const galleryCategories = [
  { name: "All Works", slug: "all" },
  { name: "Weddings & Galas", slug: "weddings-galas" },
  { name: "Centerpieces & Florals", slug: "centerpieces-florals" },
  { name: "Backdrops & Balloons", slug: "backdrops-balloons" },
  { name: "Table Settings", slug: "table-settings" },
  { name: "Specialty Rentals", slug: "specialty-rentals" },
  { name: "Kids & Celebrations", slug: "kids-celebrations" },
] as const;

export const galleryItems: GalleryItem[] = [
  {
    id: "gallery-grand-ballroom",
    title: "Royal Ballroom Reception Setup",
    category: "Weddings & Galas",
    categorySlug: "weddings-galas",
    description:
      "A breathtaking ballroom transformation featuring mirror-finish gold dining tables, crystal chandeliers, black & gold luxury chairs, and elevated floral arrangements.",
    image: "/images/grand-ballroom-reception-setup.jpg",
    featured: true,
    tags: ["Ballroom", "Luxury", "Gold Tables", "Chandeliers", "VIP Seating"],
    relatedRentalLink: "/rentals/wedding-stage-designs",
  },
  {
    id: "gallery-treat-cart",
    title: "Vintage White Sweet & Treat Cart",
    category: "Specialty Rentals",
    categorySlug: "specialty-rentals",
    description:
      "Charming hand-crafted white candy and dessert cart with scalloped canopy roof, vintage wheel accent, and styled floral centerpiece. Perfect for sweets, champagne, or favors.",
    image: "/images/luxury-white-treat-cart.png",
    featured: true,
    tags: ["Treat Cart", "Candy Cart", "Desserts", "Custom Styling"],
    relatedRentalLink: "/rentals/cake-stands-treat-tables",
  },
  {
    id: "gallery-milestone-backdrop",
    title: "Custom Milestone Birthday Backdrop & 3D Numbers",
    category: "Backdrops & Balloons",
    categorySlug: "backdrops-balloons",
    description:
      "Show-stopping custom photo backdrop featuring ornate gold baroque portrait frames, high-gloss 3D gold marquee number '40', dramatic black velvet drape, and crystal chandelier.",
    image: "/images/milestone-birthday-backdrop-display.jpg",
    featured: true,
    tags: ["Backdrop", "Milestone Birthday", "Gold Frames", "Photo Moment"],
    relatedRentalLink: "/rentals/backdrops-focal-points",
  },
  {
    id: "gallery-crystal-candelabra-floral",
    title: "Luxe Crystal Candelabra & White Floral Centerpiece",
    category: "Centerpieces & Florals",
    categorySlug: "centerpieces-florals",
    description:
      "Stately multi-tiered glass stem candelabras nestled within an abundant dome of fresh-touch white roses, delphiniums, and hydrangeas.",
    image: "/images/crystal-candelabra-floral-centerpiece.jpg",
    featured: true,
    tags: ["Centerpiece", "White Roses", "Crystal Candelabra", "Luxury Florals"],
    relatedRentalLink: "/rentals/centerpieces-candelabras",
  },
  {
    id: "gallery-outdoor-tent-banquet",
    title: "Outdoor Marquee Tent & Banquet Pavilion",
    category: "Specialty Rentals",
    categorySlug: "specialty-rentals",
    description:
      "Spacious all-weather white marquee canopy tent complete with floor-length draped banquet dining tables and pristine white folding ceremony chairs.",
    image: "/images/outdoor-canopy-tent-banquet.jpg",
    featured: true,
    tags: ["Canopy Tent", "Outdoor Event", "Banquet Tables", "Garden Party"],
    relatedRentalLink: "/rentals/production",
  },
  {
    id: "gallery-balloon-arch-backdrop",
    title: "Bespoke Blush Arch & Organic Balloon Installation",
    category: "Backdrops & Balloons",
    categorySlug: "backdrops-balloons",
    description:
      "Custom curved blush backdrop panel adorned with an organic garland of soft pastel balloons, accompanied by an elegant white fluted floral pedestal urn.",
    image: "/images/real-event-setup.jpg",
    featured: true,
    tags: ["Balloon Arch", "Pastel Garland", "Arch Backdrop", "Photo Op"],
    relatedRentalLink: "/rentals/balloons",
  },
  {
    id: "gallery-round-banquet-table",
    title: "Classic 60-Inch Round Banquet Gala Tablescape",
    category: "Table Settings",
    categorySlug: "table-settings",
    description:
      "60-inch round dining table styled with floor-length neutral linen, artisan sage napkins, gold elevated floral centerpiece stand, and mahogany chiavari chairs.",
    image: "/images/round-banquet-table-setup.png",
    featured: true,
    tags: ["Round Table", "Banquet", "Chiavari", "Linens", "Centerpiece"],
    relatedRentalLink: "/rentals/tables",
  },
  {
    id: "gallery-kids-party-package",
    title: "Kids Luxury Marquee Celebration Package",
    category: "Kids & Celebrations",
    categorySlug: "kids-celebrations",
    description:
      "Child-height dining banquet tables surrounded by scaled gloss-white chiavari chairs, blush pink napkins, and customized party favors in an airy marquee setting.",
    image: "/images/kids-white-chiavari-party-setup.png",
    featured: true,
    tags: ["Kids Party", "Mini Chiavari", "Kids Banquet", "Children Decor"],
    relatedRentalLink: "/rentals/kids",
  },
  {
    id: "gallery-white-floral-pedestal",
    title: "Fluted Pedestal White Rose & Lily Centerpiece",
    category: "Centerpieces & Florals",
    categorySlug: "centerpieces-florals",
    description:
      "Opulent floral arrangement featuring garden roses, lilies, and lush greenery presented in a neoclassical fluted white pedestal urn.",
    image: "/images/white-floral-pedestal-centerpiece.png",
    featured: true,
    tags: ["Floral Urn", "White Pedestal", "Roses & Lilies", "Centerpiece"],
    relatedRentalLink: "/rentals/centerpieces-candelabras",
  },
  {
    id: "gallery-gold-rim-reef-charger",
    title: "Clear Reef Charger Plates with Metallic Gold Rim",
    category: "Table Settings",
    categorySlug: "table-settings",
    description:
      "Textured clear glass reef-patterned chargers rimmed in brilliant metallic gold, establishing an unmistakable standard of luxury dining.",
    image: "/images/gold-rim-reef-charger-plates.png",
    featured: true,
    tags: ["Reef Charger", "Gold Rim", "Glassware", "Fine Dining"],
    relatedRentalLink: "/rentals/glassware-chargers",
  },
  {
    id: "gallery-gold-beaded-charger",
    title: "Clear Beaded Glass Charger & Gold Flatware",
    category: "Table Settings",
    categorySlug: "table-settings",
    description:
      "Delicately beaded crystal-clear glass charger plate paired with polished gold flatware and fine glassware for an editorial banquet table.",
    image: "/images/gold-beaded-glass-charger.png",
    featured: true,
    tags: ["Beaded Charger", "Gold Flatware", "Place Setting", "Table Decor"],
    relatedRentalLink: "/rentals/glassware-chargers",
  },
];
