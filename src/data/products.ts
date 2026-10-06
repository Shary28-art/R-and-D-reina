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
      images: ["/images/Round table.jpg"],
    },
    {
      name: "Rectangular table 6ft",
      subcategorySlug: "specialty-tables",
      price: 40,
      description:
        "Standard 6-foot rectangular folding banquet tables seating 6 to 8 guests. Perfect for catering lines, beverage stations, and banquet dining rows.",
      keywords: ["rectangular table 6ft", "banquet table", "6ft table", "folding table"],
      totalStock: 15,
      images: ["/images/Rectangular table 6ft.jpg"],
    },
    {
      name: "Rectangular table 10ft",
      subcategorySlug: "farm-tables",
      price: 75,
      description:
        "Grand 10-foot rectangular dining table seating 10 to 12 guests. Ideal for bridal party head tables, VIP family dining, and statement feast layouts.",
      keywords: ["rectangular table 10ft", "long table", "farm table", "head table"],
      bestSeller: true,
      totalStock: 10,
      images: ["/images/Rectangular table 10ft.jpg"],
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
      images: ["/images/garden.jpg"],
    },
    {
      name: "Velvet Barrel Accent Chair : off white",
      subcategorySlug: "garden-chairs",
      price: 50,
      description:
        "Velvet barrel accent chair in off-white color, perfect for adding a touch of elegance to any room.",
      keywords: ["velvet chair", "barrel chair", "accent chair", "off white"],
      featured: true,
      bestSeller: true,
      totalStock: 140,
      images: ["/images/Velvet Barrel.jpg"],
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
      images: ["/images/Black and Gold.jpg"],
    },

    {
      name: "Ghost Clear Chair",
      subcategorySlug: "ghost-clear-chair",
      price: 40,
      description:
        "Elegant clear acrylic chair with a ghostly appearance, perfect for adding a touch of modernity to any event.",
      keywords: ["ghost chair", "clear chair", "acrylic chair", "modern seating"],
      totalStock: 10,
      images: ["/images/Ghost chair.jpg"],
    },
    {
      name: "Luxury Gold Chair",
      subcategorySlug: "luxury-gold-chair",
      price: 195,
      description:
        "A luxurious gold chair designed for elegance and comfort, perfect for upscale events and weddings.",
      keywords: ["chair", "gold", "luxury"],
      totalStock: 5,
      images: ["/images/Luxury Gold Chair.jpg"],
    },
  ],
  "tablecloths-napkins": [
    {
      name: "Pack Baby Blue Cheesecloth Table Runner 10Ft",
      subcategorySlug: "runners",
      price: 14,
      description:
        "10-foot gauzy baby blue cheesecloth table runner with soft crinkled texture, creating an airy rustic-elegant drape over dining tables.",
      keywords: ["cheesecloth", "runner", "baby blue", "table runner"],
      totalStock: 6,
      images: ["/images/Baby Blue Cheesecloth Table Runner 10Ft.jpg"],
    },
    {
      name: "White rectangular tablecloths 8 foot",
      subcategorySlug: "tablecloths",
      price: 18,
      description:
        "Crisp floor-length white rectangular tablecloth tailored for standard 8-foot banquet tables. Smooth, wrinkle-resistant premium polyester.",
      keywords: ["tablecloth", "white", "rectangular", "8 foot", "banquet"],
      totalStock: 12,
      images: ["/images/White rectangular tablecloths 8 foot.jpg"],
    },
    {
      name: "White tablecloths Round",
      subcategorySlug: "tablecloths",
      price: 20,
      description:
        "Classic floor-length white round tablecloth for 60-inch to 72-inch banquet rounds. Provides a timeless, elegant foundation for any reception palette.",
      keywords: ["tablecloth", "white", "round", "banquet"],
      featured: true,
      bestSeller: true,
      totalStock: 20,
      images: ["/images/White tablecloths Round.jpg"],
    },
    {
      name: "Round tablecloths black",
      subcategorySlug: "tablecloths",
      price: 20,
      description:
        "Floor-length jet black round tablecloth for 60-inch to 72-inch rounds. Rich, deep tone delivering modern drama and high contrast.",
      keywords: ["round tablecloths black", "black tablecloth", "black linens"],
      totalStock: 10,
      images: ["/images/Round tablecloths black.jpg"],
    },
    {
      name: "Rectangular tablecloths",
      subcategorySlug: "tablecloths",
      price: 18,
      description:
        "Durable rectangular banquet tablecloth providing crisp, professional coverage for standard buffet and dining setups.",
      keywords: ["rectangular tablecloths", "table linen", "banquet cover"],
      totalStock: 10,
      images: ["/images/Rectangular table cloths.jpg"],
    },
    {
      name: "Baby Blue Napkins",
      subcategorySlug: "napkins",
      price: 1.75,
      description:
        "Luxe baby blue cloth napkins with clean hemmed edges. Soft texture that folds crisply into pocket or fan designs.",
      keywords: ["baby blue napkins", "napkins", "blue linen", "table setting"],
      totalStock: 50,
      images: ["/images/Baby Blue Napkins.jpeg"],
    },
    {
      name: "Black Napkins",
      subcategorySlug: "napkins",
      price: 1.75,
      description:
        "Midnight black pressed cloth dinner napkins. Premium fabric designed to contrast dramatically with gold and white charger plates.",
      keywords: ["black napkins", "cloth napkins", "linens", "dinner napkins"],
      bestSeller: true,
      totalStock: 150,
      images: ["/images/Black Napkins.jpeg"],
    },
    {
      name: "Pearl napkin decor",
      subcategorySlug: "napkins",
      price: 1.5,
      description:
        "Delicate pearl-beaded napkin rings adding an iridescent jewelry accent to styled place settings.",
      keywords: ["pearl napkin decor", "napkin rings", "pearls", "place setting"],
      totalStock: 50,
      images: ["/images/Pearl napkin decor.jpg"],
    },
    {
      name: "Gold Napkin decor",
      subcategorySlug: "napkins",
      price: 1.5,
      description:
        "Polished metallic gold napkin rings with sleek modern finish to secure napkin rolls and folds.",
      keywords: ["gold napkin decor", "napkin rings", "gold rings", "place setting"],
      totalStock: 50,
      images: ["/images/Gold Napkin decor.jpg"],
    },
  ],
  "centerpieces-candelabras": [
    {
      name: "2pcs A8236 200*75*50cm flower + 2pcs 180cm stand no customize",
      subcategorySlug: "floral-arrangements",
      price: 350,
      description:
        "Grand two-piece luxury floral installation (200×75×50 cm) accompanied by two 180 cm matching gold structural display stands. Dramatic ceremony altar or stage entrance framing.",
      keywords: ["flower", "stand", "floral arrangement", "ceremony", "altar"],
      featured: true,
      newProduct: true,
      totalStock: 1,
      images: ["/images/2pcs A8236.jpg"],
    },
    {
      name: "60cm wreath",
      subcategorySlug: "floral-centerpieces",
      price: 45,
      description:
        "Circular 60 cm lush floral wreath of white garden roses and botanical foliage. Versatile as a tabletop centerpiece encircling hurricane candles or suspended overhead.",
      keywords: ["wreath", "floral", "centerpiece", "circle", "flowers"],
      totalStock: 10,
      images: ["/images/60cm wreath.jpg"],
    },
    {
      name: "2pcs A9020 50*60cm table flower/set no customize",
      subcategorySlug: "floral-centerpieces",
      price: 85,
      description:
        "Coordinated set of two 50×60 cm floral tabletop arrangements styled with premium white blooms. Perfect for sweetheart dining tables and guest banquets.",
      keywords: ["table flower", "floral set", "centerpiece", "roses"],
      totalStock: 5,
      images: ["/images/2pcs A9020.png"],
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
      name: "60cm flower ball no stand",
      subcategorySlug: "floral-centerpieces",
      price: 55,
      description:
        "Full 60 cm spherical flower pomander ball crafted with dense white roses and accent greenery. Ready to rest atop floral risers, urns, or table mirrors.",
      keywords: ["flower ball", "floral sphere", "kissing ball", "centerpiece"],
      totalStock: 10,
      images: ["/images/60cm flower ball no stand.jpg"],
    },
    {
      name: "200*45cm flower 5 no customize",
      subcategorySlug: "floral-arrangements",
      price: 120,
      description:
        "Extravagant 200×45 cm floral runner featuring abundant white roses and greenery, designed for long head table cascades and mantle displays.",
      keywords: ["flower runner", "floral runner", "head table", "roses"],
      totalStock: 1,
      images: ["/images/flower 5 no customize.jpeg"],
    },
    {
      name: "120*45cm flower no customize",
      subcategorySlug: "floral-arrangements",
      price: 80,
      description:
        "Curated 120×45 cm floral display piece with soft ivory blooms and trailing greens for sweetheart tables or bar backsplashes.",
      keywords: ["floral arrangement", "flowers", "sweetheart", "decor"],
      totalStock: 1,
      images: ["/images/flower no customize.jpeg"],
    },
    {
      name: "100*45cm flower no customize",
      subcategorySlug: "floral-arrangements",
      price: 70,
      description:
        "Refined 100×45 cm floral arrangement suitable for welcome easels, guest book tables, or ceremony aisle accents.",
      keywords: ["floral arrangement", "accent flower", "centerpiece"],
      totalStock: 1,
      images: ["/images/10045cm flower no customize.jpg"],
    },
    {
      name: "45*60cm flower 8 no customize",
      subcategorySlug: "floral-centerpieces",
      price: 50,
      description:
        "Lush 45×60 cm floral arrangement offering upright elegance and fresh botanical fragrance for guest dining tables.",
      keywords: ["flower arrangement", "floral", "table centerpiece"],
      totalStock: 1,
      images: ["/images/4560cm flower 8 no customize.jpeg"],
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
      images: ["/images/Flower Centerpieces for Tables 17.7 inch.jpeg"],
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
      images: ["public/images/Black & Gold charger plates.jpg.jpg"],
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
      images: ["/images/Pure Gold charger plates.jpg"],
    },
    {
      name: "White Charger plates",
      subcategorySlug: "charger-plates",
      price: 2.5,
      description:
        "Clean porcelain-style white charger plates with detailed rim. Offers a crisp, fresh look for traditional and modern weddings.",
      keywords: ["white charger plates", "chargers", "dining", "tableware"],
      totalStock: 100,
      images: ["/images/White Charger plates.jpg"],
    },
    {
      name: "Acrylic Charger plates",
      subcategorySlug: "charger-plates",
      price: 3.25,
      description:
        "Clear acrylic charger plates with beaded border. Modern, transparent elegance that complements any tablecloth pattern.",
      keywords: ["acrylic charger", "clear charger", "plates", "modern"],
      totalStock: 50,
      images: ["/images/Acrylic Charger plates.jpg"],
    },
    {
      name: "Clear pop shell Glasses",
      subcategorySlug: "specialty-glassware",
      price: 2.5,
      description:
        "Textured clear pop shell goblets with embossed ridges. Stunning tactile vintage-modern glassware for water, wine, or cocktails.",
      keywords: ["clear glasses", "pop shell", "goblet", "specialty glassware"],
      bestSeller: true,
      totalStock: 100,
      images: ["/images/Clear pop shell Glasses.jpeg"],
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
      images: ["/images/Luxury White Wedding Welcome Display.jpg"],
    },
    {
      name: "Shimmer wall –24pcs",
      subcategorySlug: "walls",
      price: 280,
      description:
        "Dazzling 24-piece modular shimmer sequin backdrop wall. Creates a dynamic, reflecting glitter effect for photo booths, red carpets, and VIP stages.",
      keywords: ["shimmer wall", "sequin wall", "backdrop", "glitter", "photo"],
      featured: true,
      newProduct: true,
      totalStock: 1,
      images: ["/images/Shimmer wall –24pcs.jpeg"],
    },
    {
      name: "Backdrop Stand, 6.5x10 ft",
      subcategorySlug: "backdrops",
      price: 65,
      description:
        "Heavy-duty 6.5×10 foot adjustable metal backdrop support stand for drapery, balloon garlands, and floral installations.",
      keywords: ["backdrop stand", "pipe and drape", "frame", "photo stand"],
      totalStock: 1,
      images: ["/images/Backdrop Stand, 6.5x10 ft.jpeg"],
    },
        {
      name: "Elegant Love Story Welcome Setup",
      subcategorySlug: "backdrops",
      price: 65,
      description:
        "Complete welcome setup with custom signage, floral arrangements, and decorative elements as pictured. Ideal for weddings, anniversaries, and special events.",
      keywords: ["welcome setup", "wedding backdrop", "event decoration", "photo backdrop"],
      totalStock: 1,
      images: ["/images/love story.jpg"],
    },
 
    {
      name: "Backdrop set up as seen",
      subcategorySlug: "backdrops",
      price: 65,
      description:
        "Complete backdrop setup with drapery, floral arrangements, and decorative elements as pictured. Ideal for weddings, photo shoots, and events.",
      keywords: ["backdrop setup", "event backdrop", "decorative backdrop", "photo backdrop"],
      totalStock: 1,
      images: ["/images/backdrop blue.jpg"],
    },

    {
      name: "Wood arch",
      subcategorySlug: "arches",
      price: 180,
      description:
        "Rustic-modern stained wooden ceremony arch with solid freestanding base, ready for custom draping and floral cascading.",
      keywords: ["wood arch", "ceremony arch", "wooden arbor", "wedding arch"],
      featured: true,
      bestSeller: true,
      totalStock: 3,
      images: ["/images/Wood arch.jpg"],
    },
  ],
  "lounge-throne-seating": [
    {
      name: "Emerald Velvet Curved Loveseat",
      subcategorySlug: "loveseats",
      price: 135,
      description:
        "Curved emerald velvet loveseat with brass legs for upscale cocktail lounge vignettes and sweetheart seating alternatives.",
      keywords: ["loveseat", "velvet", "emerald", "lounge"],
      totalStock: 4,
      images: ["/images/Emerald.jpeg"],
    },
    {
      name: "Modular Cream Bouclé Lounge Sofa",
      subcategorySlug: "sofas",
      price: 185,
      description:
        "Curved modular cream sofa sections configurable for VIP lounges, cocktail areas, and modern chic receptions.",
      keywords: ["sofa", "lounge", "cream", "boucle"],
      totalStock: 3,
      images: ["/images/modular lounge.jpg"],
    },
    {
      name: "Modular Cream Sofa",
      subcategorySlug: "sofas",
      price: 185,
      description:
        "Curved modular cream sofa sections configurable for VIP lounges, cocktail areas, and modern chic receptions.",
      keywords: ["sofa", "lounge", "cream", "boucle"],
      totalStock: 3,
      images: ["/images/cream.jpg"],
    },
    {
      name: "Modern Sculptural Armchair — Gold & Ivory",
      subcategorySlug: "lounge-chairs",
      price: 70,
      description:
        "Sculptural designer lounge chair with brushed gold frame and textured ivory upholstery.",
      keywords: ["lounge", "chair", "gold", "armchair"],
      totalStock: 8,
      images: ["/images/Modern Sculptural Armchair — Gold & Ivory.jpeg"],
    },
    {
      name: "King Throne Chair — Black Velvet & Gold",
      subcategorySlug: "throne-chairs-lounge",
      price: 95,
      description:
        "Regal black velvet and hand-carved gold trim throne chair for milestone birthdays, quinces, and statement photo moments.",
      keywords: ["throne", "black", "gold", "chair", "king"],
      totalStock: 2,
      images: ["/images/King Throne Chair — Black Velvet & Gold.jpg"],
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
      images: ["/images/Kids Luxury Chiavari Banquet Party Package.jpeg"],
    },
    {
      name: "Kids White Folding Craft Table",
      subcategorySlug: "kids-tables",
      price: 14,
      description:
        "Child-height folding table in clean white for dining, crafts, and children dessert tables.",
      keywords: ["kids", "table", "children", "craft"],
      totalStock: 20,
      images: ["/images/Kids White Folding Craft Table.jpg"],
    },
    {
      name: "Kids Chiavari Chair — Gloss White",
      subcategorySlug: "kids-chairs",
      price: 5,
      description:
        "Properly scaled chiavari chair in high-gloss white for young guests at formal celebrations and birthday parties.",
      keywords: ["kids", "chair", "chiavari", "white"],
      totalStock: 40,
      images: ["/images/Kids Chiavari Chair — Gloss White.jpeg"],
    },
    {
      name: "Kids Pastel Balloon Centerpiece Cluster",
      subcategorySlug: "kids-decor",
      price: 25,
      description:
        "Playful pastel balloon cluster arrangement designed for kids tables, activity stations, and dessert bars.",
      keywords: ["kids", "balloon", "decor", "centerpiece"],
      totalStock: 10,
      images: ["/images/Kids Pastel Balloon Centerpiece Cluster.jpg"],
    },
  ],
  "candles-decor": [
    {
      name: "Gold Hurricane Candle Holders Metal",
      subcategorySlug: "candle-holders",
      price: 18,
      description:
        "Lustrous metallic gold hurricane candle holders with protective glass cylinders. Provides warm, romantic illumination across reception banquet tables.",
      keywords: ["candle holder", "hurricane", "gold metal", "lantern", "candles"],
      featured: true,
      bestSeller: true,
      totalStock: 18,
      images: ["/images/candle decor.jpg"],
    },
    {
      name: "Chandelier decor",
      subcategorySlug: "decorative-accessories",
      price: 95,
      description:
        "Ornate hanging crystal chandelier decor piece adding regal brilliance to canopies, arches, and stage ceilings.",
      keywords: ["chandelier", "crystal", "lighting", "decor", "hanging"],
      totalStock: 2,
      images: ["/images/Chandelier decor.jpg"],
    },
  ],
  "cake-stands-treat-tables": [
    {
      name: "Vintage White Sweet & Treat Cart",
      subcategorySlug: "treat-displays",
      price: 250,
      description:
        "Hand-crafted white wooden dessert cart with scalloped canopy roof, vintage spoke wheels, and front presentation counter. Complete focal point for cakes, sweets, or champagne service.",
      keywords: ["treat cart", "candy cart", "dessert cart", "sweets", "vintage"],
      featured: true,
      newProduct: true,
      totalStock: 2,
      images: ["/images/candy cart.jpg"],
    },
    {
      name: "Decorative Treat Cart",
      subcategorySlug: "treat-displays",
      price: 350,
      description:
        "Hand-crafted white wooden dessert cart with scalloped canopy roof, vintage spoke wheels, and front presentation counter. Complete focal point for cakes, sweets, or champagne service.",
      keywords: ["treat cart", "candy cart", "dessert cart", "sweets", "vintage"],
      featured: true,
      newProduct: true,
      totalStock: 2,
      images: ["/images/treat cart.jpg"],
    },
    {
      name: "Three-Tier Crystal Wedding Cake Stand",
      subcategorySlug: "cake-stands",
      price: 40,
      description:
        "Crystal-embellished three-tier pedestal stand for multi-layer wedding cakes, cupcakes, and dessert service.",
      keywords: ["cake stand", "crystal", "tier"],
      totalStock: 10,
      images: ["/images/Three-Tier Crystal Wedding Cake Stand.jpg"],
    },
    {
      name: "Rustic White Wood Dessert Table — 6 ft",
      subcategorySlug: "dessert-tables",
      price: 80,
      description:
        "Distressed vintage white wood dessert table with lower shelving for rustic-chic dessert and treat presentations.",
      keywords: ["dessert", "table", "vintage", "rustic"],
      totalStock: 5,
      images: ["/images/Rustic White Wood Dessert Table — 6 ft.jpeg"],
    },
    {
      name: "Clear Acrylic Treat Display Risers — Set of 3",
      subcategorySlug: "treat-displays",
      price: 28,
      description:
        "Set of 3 seamless acrylic risers for displaying cupcakes, macarons, and artisanal petit fours at varied heights.",
      keywords: ["treat", "display", "acrylic", "riser"],
      totalStock: 12,
      images: ["/images/Clear Acrylic Treat Display Risers — Set of 3.jpeg"],
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
      images: ["/images/photo booth.jpg"],
    },
    {
      name: "All-White Luxury Castle Bounce House",
      subcategorySlug: "bounce-house",
      price: 295,
      description:
        "Aesthetic all-white luxury castle bounce house for birthdays, family festivals, and high-end celebrations.",
      keywords: ["bounce house", "white castle", "entertainment"],
      totalStock: 1,
      images: ["/images/All-White Luxury Castle Bounce House.jpeg"],
    },
  ],
  production: [
    {
      name: "Outdoor Marquee Tent & Banquet Pavilion",
      subcategorySlug: "event-production",
      price: 550,
      description:
        "Spacious all-weather white marquee canopy tent complete with long banquet dining tables and white folding ceremony chairs for outdoor celebrations.",
      keywords: ["tent", "canopy", "marquee", "outdoor", "banquet"],
      featured: true,
      totalStock: 3,
      images: ["/images/Outdoor Marquee Tent & Banquet Pavilion.jpeg"],
    },
    {
      name: "Wireless Warm Amber LED Uplighting Fixture",
      subcategorySlug: "lighting",
      price: 35,
      description:
        "Battery-powered wireless warm-white and amber LED fixture to wash walls, draping, and perimeter features.",
      keywords: ["uplight", "lighting", "production", "led"],
      totalStock: 24,
      images: ["/images/Wireless Warm Amber LED Uplighting Fixture.jpeg"],
    },
    {
      name: "Heavyweight Velvet Pipe & Drape — 10 ft Section",
      subcategorySlug: "event-production",
      price: 85,
      description:
        "Black or ivory flame-retardant heavyweight velvet drape section with telescopic support uprights to divide spaces or create backdrops.",
      keywords: ["drape", "pipe", "production", "velvet"],
      totalStock: 20,
      images: ["/images/Heavyweight Velvet Pipe & Drape — 10 ft Section.jpeg"],
    },
    {
      name: "High-Gloss White Dance Floor — 12×12 ft",
      subcategorySlug: "specialty-equipment",
      price: 650,
      description:
        "Interlocking high-gloss white dance floor system with beveled perimeter edge. Seamless luxury floor covering 144 sq ft.",
      keywords: ["dance floor", "production", "white", "gloss"],
      totalStock: 2,
      images: ["/images/High-Gloss White Dance Floor — 12×12 ft.jpeg"],
    },
  ],
  balloons: [
  
    {
      name: "Organic Pastel & Chrome Balloon Garland — 10 ft",
      subcategorySlug: "balloon-garlands",
      price: 195,
      description:
        "Custom multi-size organic garland in your chosen palette with chrome and double-stuffed accents — installed on-site.",
      keywords: ["balloon", "garland", "organic"],
      totalStock: 5,
      images: ["/images/Organic Pastel & Chrome Balloon Garland — 10 ft.jpeg"],
    },
    {
      name: "Luxe Tabletop Balloon Bouquet",
      subcategorySlug: "balloon-decor",
      price: 45,
      description:
        "Weighted luxury tabletop bouquet coordinating with event color themes, featuring foil spheres and delicate ribbon.",
      keywords: ["balloon", "bouquet", "table"],
      totalStock: 15,
      images: ["/images/Luxe Tabletop Balloon Bouquet.jpeg"],
    },
  ],
  "wedding-stage-designs": [
    {
      name: "Grand Gala Ballroom Reception Setup",
      subcategorySlug: "luxury-stage-decor",
      price: 3200,
      description:
        "Complete royal ballroom transformation featuring mirror-top gold banquet dining tables, grand chandeliers, black & gold designer seating, and tiered floral candelabras.",
      keywords: ["ballroom", "royal", "stage", "reception", "gold tables"],
      featured: true,
      newProduct: true,
      totalStock: 1,
      images: ["/images/Grand Gala Ballroom Reception Setup.jpeg"],
    },
    {
      name: "Grand Royalty Wedding Stage with Floral Pillars",
      subcategorySlug: "luxury-stage-decor",
      price: 2800,
      description:
        "Full luxury stage design with structural arches, fluted columns, custom florals, and ambient stage lighting concept.",
      keywords: ["stage", "luxury", "wedding", "design"],
      totalStock: 1,
      images: ["/images/Grand Royalty Wedding Stage with Floral Pillars.jpeg"],
    },
    {
      name: "Grand White & Gold Wedding Reception",
      subcategorySlug: "luxury-stage-decor",
      price: 2800,
      description:
        "Full luxury stage design with structural arches, fluted columns, custom florals, and ambient stage lighting concept.",
      keywords: ["stage", "luxury", "wedding", "design"],
      totalStock: 1,
      images: ["/images/floral.jpg"],
    },

    {
      name: "Bespoke Circular Ceremony Floral Arbor",
      subcategorySlug: "ceremony-designs",
      price: 950,
      description:
        "Custom circular ceremony arbor design with structural gold frame and full 360-degree styled white and blush florals.",
      keywords: ["ceremony", "arbor", "custom", "circle"],
      totalStock: 2,
      images: ["/images/Bespoke Circular Ceremony Floral Arbor.jpeg"],
    },
    {
      name: "Elegant White & Sage Wedding Tablescape",
      subcategorySlug: "ceremony-designs",
      price: 950,
      description:
        "",
      keywords: ["ceremony", "tablescape", "white", "sage"],
      totalStock: 2,
      images: ["/images/Wedding Tablescape.jpg"],
    },

    {
      name: "Pink Pearl Wedding Setup",
      subcategorySlug: "ceremony-designs",
      price: 950,
      description:
        "Custom circular ceremony arbor design with structural gold frame and full 360-degree styled white and blush florals.",
      keywords: ["ceremony", "arbor", "custom", "circle"],
      totalStock: 2,
      images: ["/images/pink pearl.jpg"],
    },

    {
      name: "Minimalist Elegance Stage Setup — Gold Framing",
      subcategorySlug: "wedding-stages",
      price: 2100,
      description:
        "Geometric gold framing, modern floating pedestals, and cascading floral runner design tailored to venue dimensions.",
      keywords: ["stage", "wedding", "gold", "modern"],
      totalStock: 1,
      images: ["/images/Minimalist Elegance Stage Setup — Gold Framing.jpeg"],
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
