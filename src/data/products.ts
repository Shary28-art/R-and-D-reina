import type { Product } from "@/types/product";
import { categories } from "@/data/categories";
import { slugify } from "@/lib/utils";

interface SeedItem {
  name: string;
  subcategorySlug: string;
  price: number;
  description: string;
  keywords: string[];
  featured?: boolean;
  newProduct?: boolean;
  bestSeller?: boolean;
  totalStock?: number;
  images: string[];
}

const catalogSeeds: Record<string, SeedItem[]> = {
  tables: [
    {
      name: "Tables Round",
      subcategorySlug: "round-tables",
      price: 45,
      description:
        "Commercial-grade 60-inch round banquet dining tables accommodating 8 to 10 guests. Heavy-duty construction with smooth folding legs.",
      keywords: ["tables round", "round tables", "banquet table", "dining"],
      featured: true,
      bestSeller: true,
      totalStock: 11,
      images: ["/images/Round-table.jpg"],
    },
    {
      name: "Rectangular table 6ft",
      subcategorySlug: "specialty-tables",
      price: 40,
      description:
        "Standard 6-foot rectangular folding banquet tables seating 6 to 8 guests. Perfect for catering lines, beverage stations, and banquet dining rows.",
      keywords: ["rectangular table 6ft", "banquet table", "6ft table", "folding table"],
      totalStock: 15,
      images: ["/images/Rectangular-table-6ft.jpg"],
    },
    {
      name: "Rectangular table 8ft",
      subcategorySlug: "farm-tables",
      price: 75,
      description:
        "Grand 10-foot rectangular dining table seating 10 to 12 guests. Ideal for bridal party head tables, VIP family dining, and statement feast layouts.",
      keywords: ["rectangular table 10ft", "long table", "farm table", "head table"],
      bestSeller: true,
      totalStock: 10,
      images: ["/images/Rectangular-table-10ft.jpg"],
    },
  ],
  chairs: [
    {
      name: "Garden chairs",
      subcategorySlug: "garden-chairs",
      price: 4.5,
      description:
        "White padded resin garden folding chairs. Weather-resistant, sturdy, and comfortable seating for wedding ceremonies, receptions, and outdoor gatherings.",
      keywords: ["garden chairs", "white chairs", "ceremony chairs", "folding chairs"],
      featured: true,
      bestSeller: true,
      totalStock: 140,
      images: ["/images/Garden-chair.jpg"],
    },
    {
      name: "Modular Cream Sofa",
      subcategorySlug: "modular-cream-sofa",
      price: 185,
      description:
        "Curved modular cream sofa sections configurable for VIP lounges, cocktail areas, and modern chic receptions.",
      keywords: ["sofa", "lounge", "cream", "boucle"],
      totalStock: 3,
      images: ["/images/cream.jpg"],
    },
    {
      name: "Black & Gold Luxury Chair",
      subcategorySlug: "black-gold-luxury",
      price: 10,
      description:
        "Elegant black velvet cushion with polished gold structural frame, designed to complement upscale ballroom dinners and VIP head tables.",
      keywords: ["black", "gold", "luxury", "chair"],
      featured: true,
      bestSeller: true,
      totalStock: 80,
      images: ["/images/Black-and-Gold.jpg"],
    },

    {
      name: "Ghost Clear Chair",
      subcategorySlug: "ghost-clear-chair",
      price: 40,
      description:
        "Elegant clear acrylic chair with a ghostly appearance, perfect for adding a touch of modernity to any event.",
      keywords: ["ghost chair", "clear chair", "acrylic chair", "modern seating"],
      totalStock: 10,
      images: ["/images/Ghost-chair.jpg"],
    },
    {
      name: "Luxury Gold Chair",
      subcategorySlug: "luxury-gold-chair",
      price: 195,
      description:
        "A luxurious gold chair designed for elegance and comfort, perfect for upscale events and weddings.",
      keywords: ["chair", "gold", "luxury"],
      totalStock: 5,
      images: ["/images/Luxury-Gold-Chair.jpg"],
    },
  ],
  "tablecloths-napkins": [
    {
      name: "5 Pack Premium Polyester Napkins 17x17 White - Wrinkle Resistant Easy Care Cloth Napkins for Wedding & Events",
      subcategorySlug: "napkins",
      price: 2,
      description:
        "5-pack of premium polyester napkins, 17x17 inches, white color. Wrinkle-resistant and easy care, perfect for wedding and event occasions.",
      keywords: ["napkins", "polyester", "wedding", "events", "white"],
      totalStock: 20,
      images: ["/images/3.png"],
    },
     {
      name: "5 Pack Premium Polyester Napkins 17x17 Burgundy - Wrinkle Resistant & Easy Care Cloth Napkins for Wedding & Events",
      subcategorySlug: "napkins",
      price: 2,
      description:
        "5-pack of premium polyester napkins, 17x17 inches, burgundy color. Wrinkle-resistant and easy care, perfect for wedding and event occasions.",
      keywords: ["napkins", "polyester", "wedding", "events", "burgundy"],
      totalStock: 20,
      images: ["/images/4.png"],
    },
     {
      name: "5 Pack Premium Polyester Napkins 17x17 Dusty Sage Green - Wrinkle Resistant & Easy Care Cloth Napkins for Wedding & Events",
      subcategorySlug: "napkins",
      price: 2,
      description:
        "5-pack of premium polyester napkins, 17x17 inches, dusty sage green color. Wrinkle-resistant and easy care, perfect for wedding and event occasions.",
      keywords: ["napkins", "polyester", "wedding", "events", "dusty sage green"],
      totalStock: 20,
      images: ["/images/5.png"],
    },
     {
      name: "5 Pack Premium Polyester Napkins 17x17 Black - Wrinkle Resistant Easy Care Cloth Napkins for Wedding & Events",
      subcategorySlug: "napkins",
      price: 2,
      description:
        "5-pack of premium polyester napkins, 17x17 inches, black color. Wrinkle-resistant and easy care, perfect for wedding and event occasions.",
      keywords: ["napkins", "polyester", "wedding", "events", "black"],
      totalStock: 20,
      images: ["/images/6.png"],
    },

    {
      name: "Polyester Round Tablecloth 120 Navy Blue - Durable & Seamless Table Cover",
      subcategorySlug: "tablecloths",
      price: 18,
      description:
        "Durable, seamless polyester round tablecloth in classic navy blue. The 120-inch cover creates an elegant floor-length look for wedding receptions, banquets, and special events.",
      keywords: ["navy blue tablecloth", "120 inch round tablecloth", "polyester tablecloth", "round table cover", "banquet linen"],
      totalStock: 12,
      images: ["/images/2.png"],
    },
    {
      name: "Polyester Round Tablecloth 120 Hunter Emerald Green - Durable & Seamless Table Cover",
      subcategorySlug: "tablecloths",
      price: 18,
      description:
        "Durable, seamless polyester round tablecloth in rich hunter emerald green. The 120-inch cover adds an elegant floor-length finish to wedding receptions, banquets, and special events.",
      keywords: ["hunter emerald green tablecloth", "emerald green tablecloth", "120 inch round tablecloth", "polyester tablecloth", "round table cover", "banquet linen"],
      totalStock: 12,
      images: ["/images/1.png"],
    },
    {
      name: "White rectangular tablecloths 8 foot",
      subcategorySlug: "tablecloths",
      price: 18,
      description:
        "Crisp floor-length white rectangular tablecloth tailored for standard 8-foot banquet tables. Smooth, wrinkle-resistant premium polyester.",
      keywords: ["tablecloth", "white", "rectangular", "8 foot", "banquet"],
      totalStock: 12,
      images: ["/images/White-rectangular-tablecloths-8-foo.jpg"],
    },

    {
      name: "Round tablecloths black",
      subcategorySlug: "tablecloths",
      price: 20,
      description:
        "Floor-length jet black round tablecloth for 60-inch to 72-inch rounds. Rich, deep tone delivering modern drama and high contrast.",
      keywords: ["round tablecloths black", "black tablecloth", "black linens"],
      totalStock: 10,
      images: ["/images/Round-tablecloths-blac.jpg"],
    },


  ],
  "centerpieces-candelabras": [
    {
      name: "Burgundy-rose-gold-table-centerpiece",
      subcategorySlug: "floral-centerpieces",
      price: 85,
      description:
        "Elegant burgundy and rose gold floral centerpiece with premium blooms and decorative elements. Perfect for creating a romantic atmosphere at your special day.",
      keywords: ["wedding floral arrangements", "centerpiece", "decor"],
      featured: true,
      bestSeller: true,
      totalStock: 5,
      images: ["/images/80.png"],
    },
    {
      name: "2pcs A9020 50*60cm table flower/set no customize",
      subcategorySlug: "floral-centerpieces",
      price: 85,
      description:
        "Coordinated set of two 50×60 cm floral tabletop arrangements styled with premium white blooms. Perfect for sweetheart dining tables and guest banquets.",
      keywords: ["table flower", "floral set", "centerpiece", "roses"],
      totalStock: 5,
      images: ["/images/2pcs-A9020.png"],
    },
    {
      name: "Golden Elegance Wedding Tablescape",
      subcategorySlug: "floral-centerpieces",
      price: 85,
      description:
        "Elegant wedding tablescape featuring premium floral arrangements and decorative elements. Perfect for creating a romantic atmosphere at your special day.",
      keywords: ["wedding tablescape", "floral arrangements", "centerpiece", "decor"],
      totalStock: 5,
      images: ["/images/golden.jpg"],
    },
    {
      name: "Elegant White Floral Centerpiece",
      subcategorySlug: "floral-centerpieces",
      price: 85,
      description:
        "Elegant white floral centerpiece with delicate blooms and greenery. Perfect for creating a romantic atmosphere at your special day.",
      keywords: ["wedding floral arrangements", "centerpiece", "decor"],
      totalStock: 5,
      images: ["/images/Elegant.jpg"],
    },
    {
      name: "Classic White & Gold Floral Tablescape",
      subcategorySlug: "floral-centerpieces",
      price: 85,
      description:
        "Elegant white and gold floral tablescape with delicate blooms and greenery. Perfect for creating a romantic atmosphere at your special day.",
      keywords: ["wedding floral arrangements", "centerpiece", "decor"],
      totalStock: 5,
      images: ["/images/white.jpg"],
    },
    {
      name: "Flower Centerpieces for Tables: 17.7 inch",
      subcategorySlug: "floral-centerpieces",
      price: 40,
      description:
        "Classic 17.7-inch lush floral centerpiece domes featuring high-density silk roses and hydrangeas for guest table styling.",
      keywords: ["flower centerpiece", "tables", "roses", "floral dome"],
      bestSeller: true,
      totalStock: 10,
      images: ["/images/Flower-Centerpieces-for-Tables-17.7-inch.jpeg"],
    },
  ],
  "glassware-chargers": [
    {
      name: "Black & Gold charger plates",
      subcategorySlug: "charger-plates",
      price: 3.0,
      description:
        "Sophisticated matte black charger plates accented with a polished metallic gold rim. Creates a dramatic contrast on reception tables.",
      keywords: ["charger plates", "black and gold", "plate", "table setting"],
      totalStock: 60,
      images: ["/images/7.png"],
    },
    {
      name: "20-Pack Economy Plastic Charger Plates 13 Round Clear with Gold Embossed Baroque Rim - Stylish Dinner Party Serving Plates",
      subcategorySlug: "charger-plates",
      price: 32.0,
      description:
        "20-Pack Economy Plastic Charger Plates 13 Round Clear with Gold Embossed Baroque Rim - Stylish Dinner Party Serving Plates",
      keywords: ["charger plates", "plastic", "clear", "gold rim", "dinner party"],
      totalStock: 60,
      images: ["/images/57.png"],
    },
    {
      name: "Reef Acrylic Charger Plate - Clear Gold Trim",
      subcategorySlug: "charger-plates",
      price: 5.0,
      description:
        "Elegant acrylic charger plate with a clear body and gold trim. Perfect for adding a touch of sophistication to your table setting.",
      keywords: ["charger plates", "acrylic", "clear", "gold trim", "table setting"],
      totalStock: 60,
      images: ["/images/60.png"],
    },
    {
      name: "Acrylic Beaded Charger Plate – Gold Trim with Plum Table Setting",
      subcategorySlug: "charger-plates",
      price: 5.0,
      description:
        "Decorative acrylic charger plate with a beaded edge and elegant gold trim, shown with a plum table setting. Adds a refined accent to wedding receptions, banquets, and formal dinners.",
      keywords: ["acrylic charger plate", "beaded charger plate", "gold trim charger", "plum table setting", "wedding table decor", "formal dinner tableware"],
      totalStock: 60,
      images: ["/images/59.png"],
    },

    {
      name: "Imported White Wine Glass Set",
      subcategorySlug: "glassware",
      price: 3.0,
      description:
        "Elegant imported white wine glasses for serving wine at weddings, receptions, dinners, and other special events. Available for event table settings and guest service.",
      keywords: ["white wine glass", "wine glass set", "imported glassware", "event glassware", "wedding table setting", "wine serving glass"],
      totalStock: 60,
      images: ["/images/50.png"],
    },

    {
      name: "Pure Gold charger plates",
      subcategorySlug: "charger-plates",
      price: 2.75,
      description:
        "Brilliant metallic pure gold charger plates with reflective luster. The premier foundation for formal dinner service.",
      keywords: ["pure gold", "charger plates", "gold charger", "tableware"],
      featured: true,
      bestSeller: true,
      totalStock: 200,
      images: ["/images/8.jpg"],
    },
    
  ],
  "backdrops-focal-points": [
        {
      name: "Luxury White Wedding Welcome Display",
      subcategorySlug: "backdrops",
      price: 950,
      description:
        "Custom circular ceremony arbor design with structural gold frame and full 360-degree styled white and blush florals.",
      keywords: ["ceremony", "arbor", "custom", "circle"],
      totalStock: 2,
      images: ["/images/12.jpg"],

    },
    {
      name: "Pink-gold-birthday-balloon-backdrop",
      subcategorySlug: "backdrops",
      price: 950,
      description:
        "Pink and gold birthday balloon backdrop with white and blush florals.",
      keywords: ["birthday", "balloon", "backdrop", "pink", "gold"],
      totalStock: 2,
      images: ["/images/55.jpg"],
      
    },
    {
      name: "Elegant Love Story Welcome Setup",
      subcategorySlug: "backdrops",
      price: 65,
      description:
        "Complete welcome setup with custom signage, floral arrangements, and decorative elements as pictured. Ideal for weddings, anniversaries, and special events.",
      keywords: ["welcome setup", "wedding backdrop", "event decoration", "photo backdrop"],
      totalStock: 1,
      images: ["/images/9.jpg"],
    },
    {
      name: "Elegant Ballon Arch Backdrop",
      subcategorySlug: "backdrops",
      price: 90,
      description:
        "Complete balloon arch backdrop setup with custom signage, floral arrangements, and decorative elements as pictured. Ideal for weddings, anniversaries, and special events.",
      keywords: ["balloon arch", "wedding backdrop", "event decoration", "photo backdrop"],
      totalStock: 1,
      images: ["/images/20.jpg"],
    },
    {
      name: "Pastel ballon butterfly Backdrop",
      subcategorySlug: "backdrops",
      price: 91,
      description:
        "Complete pastel balloon butterfly backdrop setup with custom signage, floral arrangements, and decorative elements as pictured. Ideal for weddings, anniversaries, and special events.",
      keywords: ["balloon butterfly", "wedding backdrop", "event decoration", "photo backdrop"],
      totalStock: 1,
      images: ["/images/21.jpg"],
    },
     {
      name: "Golden and black ballon backdrop",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Complete golden and black balloon backdrop setup with custom signage, floral arrangements, and decorative elements as pictured. Ideal for weddings, anniversaries, and special events.",
      keywords: ["balloon backdrop", "wedding backdrop", "event decoration", "photo backdrop"],
      totalStock: 1,
      images: ["/images/22.jpg"],
    },
     {
      name: " Red Rose Proposal Backdrop",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Complete red rose proposal backdrop setup with custom signage, floral arrangements, and decorative elements as pictured. Ideal for weddings, anniversaries, and special events.",
      keywords: ["red rose backdrop", "wedding backdrop", "event decoration", "photo backdrop"],
      totalStock: 1,
      images: ["/images/23.jpg"],
    },
    {
      name: "White floral arch backdrop",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Complete white floral arch backdrop setup with custom signage, floral arrangements, and decorative elements as pictured. Ideal for weddings, anniversaries, and special events.",
      keywords: ["white floral arch", "wedding backdrop", "event decoration", "photo backdrop"],
      totalStock: 1,
      images: ["/images/24.jpg"],
    },
    {
      name: "White floral bridal backdrop",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Complete white floral bridal backdrop setup with custom signage, floral arrangements, and decorative elements as pictured. Ideal for weddings, anniversaries, and special events.",
      keywords: ["white floral bridal", "wedding backdrop", "event decoration", "photo backdrop"],
      totalStock: 1,
      images: ["/images/25.jpg"],
    },
     {
      name: "White  floral wedding arch ",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Complete white floral bridal backdrop setup with custom signage, floral arrangements, and decorative elements as pictured. Ideal for weddings, anniversaries, and special events.",
      keywords: ["white floral bridal", "wedding backdrop", "event decoration", "photo backdrop"],
      totalStock: 1,
      images: ["/images/26.jpg"],
    },
    {
      name: "Pastel Rainbow Balloon Backdrop",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Pastel rainbow balloon backdrop adding a soft, colorful focal point to birthdays, baby showers, and other celebrations. Ideal for photo areas and event displays.",
      keywords: ["pastel rainbow backdrop", "rainbow balloon backdrop", "pastel balloon decor", "birthday backdrop", "baby shower backdrop", "event photo backdrop"],
      totalStock: 1,
      images: ["/images/27.jpg"],
    },
    {
      name: "Pink and Green Graduation Balloon Backdrop",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Pink and green graduation balloon backdrop adding a vibrant focal point to graduation parties, baby showers, and other celebrations. Ideal for photo areas and event displays.",
      keywords: ["pink and green graduation backdrop", "graduation balloon backdrop", "pink and green balloon decor", "graduation party backdrop", "baby shower backdrop", "event photo backdrop"],
      images: ["/images/28.jpg"],
    },
    {
      name: "Elegant 40th Birthday Photo Backdrop",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Elegant 40th birthday photo backdrop adding a sophisticated focal point to milestone celebrations. Ideal for photo areas and event displays.",
      keywords: ["elegant 40th birthday backdrop", "birthday photo backdrop", "milestone celebration backdrop", "event photo backdrop"],
      totalStock: 1,
      images: ["/images/29.jpg"],
    },
    {
      name: "Luxury Wedding Stage Backdrop",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Elegant luxury wedding stage backdrop adding a sophisticated focal point to weddings and special events. Ideal for photo areas and event displays.",
      keywords: ["elegant wedding backdrop", "luxury wedding backdrop", "wedding stage backdrop", "event photo backdrop"],
      totalStock: 1,
      images: ["/images/30.jpg"],
    },
    {
      name: "Luxury Blue Baby Shower Backdrop",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Elegant luxury blue baby shower backdrop adding a sophisticated focal point to baby showers and special events. Ideal for photo areas and event displays.",
      keywords: ["elegant baby shower backdrop", "luxury baby shower backdrop", "blue baby shower backdrop", "event photo backdrop"],
      totalStock: 1,
      images: ["/images/31.jpg"],
    },
    {
      name: "Purple and Gold Graduation Backdrop",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Elegant purple and gold graduation backdrop adding a vibrant focal point to graduation parties and special events. Ideal for photo areas and event displays.",
      keywords: ["purple and gold graduation backdrop", "graduation photo backdrop", "vibrant graduation backdrop", "event photo backdrop"],
      totalStock: 1,
      images: ["/images/32.jpg"],
    },
    {
      name: "Luxury Fuchsia Floral Backdrop",
      subcategorySlug: "backdrops",
      price: 95,
      description:
        "Elegant luxury fuchsia floral backdrop adding a sophisticated focal point to special events and photo shoots. Ideal for photo areas and event displays.",
      keywords: ["elegant floral backdrop", "luxury floral backdrop", "fuchsia floral backdrop", "event photo backdrop"],
      totalStock: 1,
      images: ["/images/33.jpg"],
    },
    
    {
      name: "Backdrop set up as seen",
      subcategorySlug: "backdrops",
      price: 65,
      description:
        "Complete backdrop setup with drapery, floral arrangements, and decorative elements as pictured. Ideal for weddings, photo shoots, and events.",
      keywords: ["backdrop setup", "event backdrop", "decorative backdrop", "photo backdrop"],
      totalStock: 1,
      images: ["/images/10.jpg"],
    },

  ],
  kids: [
    {
      name: "Kids Luxury Chiavari Banquet Party Package",
      subcategorySlug: "kids-tables",
      price: 120,
      description:
        "Complete child-height banquet dining table setup featuring mini white chiavari chairs, custom blush napkins, favor displays, and marquee party styling.",
      keywords: ["kids", "chiavari", "banquet", "party package"],
      featured: true,
      bestSeller: true,
      totalStock: 10,
      images: ["/images/Kids-Luxury-Chiavari-Banquet-Party-Package.jpeg"],
    },
    {
      name: "Bounce House - All Pink Luxury Castle",
      subcategorySlug: "bounce-houses",
      price: 200,
      description:
        "Complete child-height banquet dining table setup featuring mini white chiavari chairs, custom blush napkins, favor displays, and marquee party styling.",
      keywords: ["kids", "chiavari", "banquet", "party package"],
      featured: true,
      bestSeller: true,
      totalStock: 10,
      images: ["/images/40.jpeg"],
    },

    {
      name: "Kids Chiavari Chair — Gloss White",
      subcategorySlug: "kids-chairs",
      price: 5,
      description:
        "Properly scaled chiavari chair in high-gloss white for young guests at formal celebrations and birthday parties.",
      keywords: ["kids", "chair", "chiavari", "white"],
      totalStock: 40,
      images: ["/images/Kids-Chiavari-Chair-Gloss-White.jpeg"],
    },
  ],
  
  "cake-stands-treat-tables": [
    {
      name: "Candy Cart",
      subcategorySlug: "treat-displays",
      price: 250,
      description:
        "Hand-crafted white wooden dessert cart with scalloped canopy roof, vintage spoke wheels, and front presentation counter. Complete focal point for cakes, sweets, or champagne service.",
      keywords: ["treat cart", "candy cart", "dessert cart", "sweets", "vintage"],
      featured: true,
      newProduct: true,
      totalStock: 2,
      images: ["/images/candy-cart.jpg"],
    },
    {
      name: "Candy Cart",
      subcategorySlug: "treat-displays",
      price: 350,
      description:
        "Hand-crafted white wooden dessert cart with scalloped canopy roof, vintage spoke wheels, and front presentation counter. Complete focal point for cakes, sweets, or champagne service.",
      keywords: ["treat cart", "candy cart", "dessert cart", "sweets", "vintage"],
      featured: true,
      newProduct: true,
      totalStock: 2,
      images: ["/images/treat-cart.jpg"],
    },
    {
      name: "Luxury White and Gold Balloon Backdrop with Mirrored Dessert Display",
      subcategorySlug: "cake-stands",
      price: 35,
      description:
        "Luxury white and gold balloon backdrop with mirrored dessert display, perfect for showcasing cakes and treats at weddings and special events.",
      keywords: ["balloon backdrop", "mirrored dessert display", "cake stand", "treat table"],
      featured: true,
      newProduct: true,
      totalStock: 2,
      images: ["/images/70.png"],
    },
    {
      name: "Gold Metal Slatted Pedestal Display Stands – Set of 3",
      subcategorySlug: "cake-stands",
      price: 35,
      description:
        "Gold metal slatted pedestal display stands – Set of 3, perfect for showcasing cakes and treats at weddings and special events.",
      keywords: ["pedestal display", "gold stands", "cake stand", "treat table"],
      featured: true,
      newProduct: true,
      totalStock: 2,
      images: ["/images/71.png"],
    },
     {
      name: "Natural Wood Hourglass Pedestal Stand – Sculptural Ribbed Design",
      subcategorySlug: "cake-stands",
      price: 35,
      description:
        "Natural wood hourglass pedestal stand – sculptural ribbed design, perfect for showcasing cakes and treats at weddings and special events.",
      keywords: ["pedestal display", "wood stands", "cake stand", "treat table"],
      featured: true,
      newProduct: true,
      totalStock: 2,
      images: ["/images/73.png"],
    },
    
  ],
  entertainment: [
    {
      name: "Photo booth",
      subcategorySlug: "photo-booth",
      price: 450,
      description:
        "Interactive modern photo booth setup with studio ring lighting, customizable digital prints, and instant social sharing.",
      keywords: ["photo booth", "entertainment", "camera", "party"],
      featured: true,
      bestSeller: true,
      totalStock: 1,
      images: ["/images/photo-booth.jpg"],
    },
  ],
 
  "wedding-stage-designs": [
    {
      name: "Luxury Gold-Draped Wedding Stage",
      subcategorySlug: "luxury-stage-decor",
      price: 3200,
      description:
        "Royal ballroom transformation featuring mirror-top gold banquet dining tables, grand chandeliers, black & gold designer seating, and tiered floral candelabras.",
      keywords: ["ballroom", "royal", "stage", "reception", "gold tables"],
      featured: true,
      newProduct: true,
      totalStock: 1,
      images: ["/images/51.jpeg"],
    },
    {
      name: "Luxury White Wedding Dance Floor and Stage",
      subcategorySlug: "luxury-stage-decor",
      price: 2800,
      description:
        "Full luxury stage design with structural arches, fluted columns, custom florals, and ambient stage lighting concept.",
      keywords: ["stage", "luxury", "wedding", "design"],
      totalStock: 1,
      images: ["/images/52.jpeg"],
    },
  ],
};

function buildProducts(): Product[] {
  const list: Product[] = [];

  for (const category of categories) {
    const seeds = catalogSeeds[category.slug] ?? [];
    for (const seed of seeds) {
      const sub = category.subcategories.find(
        (s) => s.slug === seed.subcategorySlug,
      );
      const subName = sub?.name ?? seed.subcategorySlug;
      const slug = slugify(seed.name);
      const id = `${category.slug}-${slug}`;

      list.push({
        id,
        name: seed.name.toUpperCase(),
        slug,
        category: category.name,
        categorySlug: category.slug,
        subcategory: subName,
        subcategorySlug: seed.subcategorySlug,
        description: seed.description,
        price: seed.price,
        images: seed.images,
        featured: seed.featured ?? false,
        newProduct: seed.newProduct ?? false,
        bestSeller: seed.bestSeller ?? false,
        inventory: {
          totalStock: seed.totalStock ?? 10,
        },
        keywords: seed.keywords,
      });
    }
  }

  // Set specific date availability demo for black-gold chair
  const bg = list.find((p) => p.slug.includes("black-gold-luxury"));
  if (bg) {
    bg.inventory.byDate = { "2026-10-24": 18 };
  }

  return list;
}

export const products: Product[] = buildProducts();
