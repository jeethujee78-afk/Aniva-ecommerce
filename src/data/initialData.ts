import { Product, Coupon, Review, CategoryType, ConditionGradeInfo, PreOwnedSubmission, RetailerApplication, VerificationCertificate } from "../types";

export const CONDITION_GRADES: Record<string, ConditionGradeInfo> = {
  S: {
    grade: "S",
    title: "Pristine / Like New",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    description: "Flawless condition with zero perceptible signs of wear. Often includes complete original box, papers, and manufacturer warranty."
  },
  A: {
    grade: "A",
    title: "Excellent Condition",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    description: "Minimal hairline marks only visible under macro inspection. Mechanically pristine; pristine dials and structural integrity."
  },
  B: {
    grade: "B",
    title: "Good / Gentle Wear",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    description: "Light, honest wear consistent with careful ownership. Clean crystal, minor case or sole scuffs. Fully functional and authenticated."
  },
  C: {
    grade: "C",
    title: "Fair / Vintage Character",
    badgeColor: "bg-neutral-500/20 text-neutral-300 border-neutral-500/40",
    description: "Visible patina, moderate wear on case or sole. Priced attractively for daily wear or restoration collectors."
  }
};

export const CATEGORIES: { name: CategoryType; description: string; image: string; count: number }[] = [
  {
    name: "Plain T-Shirts",
    description: "Premium everyday essentials in signature matte shades.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    count: 14
  },
  {
    name: "Printed T-Shirts",
    description: "High-density typographic prints and minimalist South Asian urban graphics.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    count: 18
  },
  {
    name: "Custom Printed T-Shirts",
    description: "Design your custom tee with custom text, fonts, artwork, and 3D preview.",
    image: "/src/assets/images/aniva_custom_studio_1784879774954.jpg",
    count: 10
  },
  {
    name: "Shoes",
    description: "Handcrafted Italian leather loafers, sleek low-tops, and statement footwear.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    count: 12
  },
  {
    name: "Pre-Owned Watches",
    description: "Authenticated luxury horology. Rolex, Omega, Grand Seiko & Cartier verified by master watchmakers.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    count: 8
  },
  {
    name: "Pre-Owned Shoes",
    description: "Verified authenticated grails, Jordans, New Balance & designer low-tops with tamper-proof certificate.",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    count: 9
  },
  {
    name: "Men's Accessories",
    description: "Antique gold cufflinks, genuine full-grain leather belts, and matte black watches.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
    count: 16
  },
  {
    name: "Women's Accessories",
    description: "Sculptural gold-plated jewelry, structured leather totes, and silk scarves.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    count: 15
  }
];

export const BRANDS = [
  "ANIVA Atelier",
  "ANIVA Urban",
  "ANIVA Craft",
  "ANIVA Heritage",
  "Rolex",
  "Omega",
  "Grand Seiko",
  "Cartier",
  "Jordan",
  "Nike",
  "New Balance",
  "Balenciaga"
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "ANV-TS-01",
    name: "Monolith Classic Plain Tee",
    slug: "monolith-classic-plain-tee",
    category: "Plain T-Shirts",
    brand: "ANIVA Atelier",
    price: 1299,
    originalPrice: 1799,
    description: "Designed for everyday style, the Monolith Plain Tee defines relaxed comfort. Features drop-shoulder styling and a clean collar finish.",
    details: [
      "Premium everyday essential",
      "Designed for everyday style",
      "Contemporary relaxed silhouette",
      "Reinforced double-stitched hem and sleeves",
      "Designed for versatility and comfort"
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "Matte Black", hex: "#0D0D0D" },
      { name: "Ivory White", hex: "#F8F6F2" },
      { name: "Olive Drab", hex: "#4A5240" },
      { name: "Sand Beige", hex: "#C8B9A6" }
    ],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.9,
    reviewCount: 84,
    inStock: true,
    stockCount: 45,
    isNewArrival: true,
    isTrending: true,
    isFeatured: true,
    tags: ["plain", "classic", "oversized", "bestseller"],
    fabric: "Premium Cotton Blend",
    careInstructions: "Machine wash cold with like colors. Line dry inside out."
  },
  {
    id: "ANV-TS-02",
    name: "Ivory Essential Crewneck Tee",
    slug: "ivory-essential-crewneck-tee",
    category: "Plain T-Shirts",
    brand: "ANIVA Atelier",
    price: 1099,
    originalPrice: 1499,
    description: "An ultra-soft everyday basic crafted in timeless Ivory White. Designed for everyday style and versatility across seasons.",
    details: [
      "Premium everyday essentials",
      "Soft and breathable feel",
      "Designed for everyday comfort",
      "Minimalist tonal embroidery logo on hem"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Ivory White", hex: "#F8F6F2" },
      { name: "Charcoal Grey", hex: "#2C2C2C" },
      { name: "Warm Gold", hex: "#C9A86A" }
    ],
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.8,
    reviewCount: 62,
    inStock: true,
    stockCount: 30,
    isNewArrival: false,
    isTrending: true,
    isFeatured: false,
    tags: ["plain", "crewneck", "ivory", "essential"],
    fabric: "Soft Stretch Blend",
    careInstructions: "Gentle cycle wash, low tumble dry."
  },
  {
    id: "ANV-PR-01",
    name: "Aethelgard High-Density Graphic Tee",
    slug: "aethelgard-graphic-tee",
    category: "Printed T-Shirts",
    brand: "ANIVA Urban",
    price: 1499,
    originalPrice: 1999,
    description: "Featuring high-density print with subtle gold accents inspired by contemporary South Asian architecture and botanical motifs.",
    details: [
      "High-density graphic detail",
      "Relaxed Boxy Fit",
      "Premium everyday quality",
      "Limited batch run"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Matte Black", hex: "#0D0D0D" },
      { name: "Deep Navy", hex: "#1A2530" }
    ],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.95,
    reviewCount: 112,
    inStock: true,
    stockCount: 18,
    isNewArrival: true,
    isTrending: true,
    isFeatured: true,
    tags: ["printed", "graphic", "gold", "urban"],
    fabric: "Premium Cotton Blend",
    careInstructions: "Wash inside out. Do not iron directly on print."
  },
  {
    id: "ANV-PR-02",
    name: "Dravidian Geometric Typography Oversized Tee",
    slug: "dravidian-geometric-typography-tee",
    category: "Printed T-Shirts",
    brand: "ANIVA Craft",
    price: 1599,
    originalPrice: 2199,
    description: "Bold back graphic celebrating heritage typography and modern street culture. Screen-printed with durable water-based inks.",
    details: [
      "High-definition back print",
      "Small chest typographic emblem",
      "Oversized drop-shoulder silhouette",
      "Designed for everyday comfort"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Off-White", hex: "#F3EFE6" },
      { name: "Matte Black", hex: "#0D0D0D" }
    ],
    images: [
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.87,
    reviewCount: 49,
    inStock: true,
    stockCount: 22,
    isNewArrival: true,
    isTrending: false,
    isFeatured: true,
    tags: ["printed", "back-print", "heritage", "oversized"],
    fabric: "Premium Cotton Blend",
    careInstructions: "Cool machine wash. Do not bleach."
  },
  {
    id: "ANV-CUST-01",
    name: "Custom Print Studio - Bespoke Tee",
    slug: "custom-print-studio-bespoke-tee",
    category: "Custom Printed T-Shirts",
    brand: "ANIVA Atelier",
    price: 1399,
    originalPrice: 1899,
    description: "Upload your custom artwork, add text, select fonts, choose placement, and preview in real-time. Printed using high-resolution Direct-to-Garment technology.",
    details: [
      "Direct-To-Garment (DTG) high-resolution print",
      "Choose Front Print, Back Print or Dual Print",
      "Select custom fonts, metallic accents, and text layout",
      "Contemporary everyday wear base"
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "Matte Black", hex: "#0D0D0D" },
      { name: "Ivory White", hex: "#F8F6F2" },
      { name: "Sand Beige", hex: "#C8B9A6" },
      { name: "Deep Navy", hex: "#1A2530" }
    ],
    images: [
      "/src/assets/images/aniva_custom_studio_1784879774954.jpg",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 5.0,
    reviewCount: 140,
    inStock: true,
    stockCount: 100,
    isNewArrival: true,
    isTrending: true,
    isFeatured: true,
    tags: ["custom", "print-studio", "dtg", "bespoke"],
    fabric: "Premium Cotton Blend",
    careInstructions: "Wash inside out at 30°C. Do not tumble dry."
  },
  {
    id: "ANV-SH-01",
    name: "Verona Italian Leather Penny Loafer",
    slug: "verona-italian-leather-penny-loafer",
    category: "Shoes",
    brand: "ANIVA Atelier",
    price: 4999,
    originalPrice: 6999,
    description: "Hand-burnished full-grain Italian calfskin leather loafers with Goodyear welted construction. Cushioned memory foam insoles for non-stop comfort.",
    details: [
      "100% Genuine Full-Grain Leather Outer",
      "Hand-burnished antique finish",
      "Breathable leather lining",
      "Non-slip leather outsole with rubber grip pad"
    ],
    sizes: ["7 UK", "8 UK", "9 UK", "10 UK", "11 UK"],
    colors: [
      { name: "Antique Cognac", hex: "#7A3E1D" },
      { name: "Midnight Black", hex: "#0D0D0D" }
    ],
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1614252369475-531eda835eb1?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.92,
    reviewCount: 38,
    inStock: true,
    stockCount: 12,
    isNewArrival: true,
    isTrending: true,
    isFeatured: true,
    tags: ["shoes", "loafer", "leather", "formal"],
    fabric: "Genuine Italian Calfskin Leather",
    careInstructions: "Clean with leather balm. Store with wooden shoe trees."
  },
  {
    id: "ANV-SH-02",
    name: "Kuro Matte Low-Top Minimalist Sneakers",
    slug: "kuro-matte-low-top-sneakers",
    category: "Shoes",
    brand: "ANIVA Urban",
    price: 3499,
    originalPrice: 4599,
    description: "Clean aesthetic low-top court sneakers featuring supple nappa leather, hand-stitched cupsole, and subtle gold foil ANIVA insignia.",
    details: [
      "Soft Nappa Leather Upper",
      "Lightweight Ortholite Cushioning",
      "Vulcanized Natural Rubber Outsole",
      "Gold foil serial embossing on lateral quarter"
    ],
    sizes: ["7 UK", "8 UK", "9 UK", "10 UK", "11 UK"],
    colors: [
      { name: "Ivory & Gold", hex: "#F8F6F2" },
      { name: "All Black Matte", hex: "#0D0D0D" }
    ],
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.88,
    reviewCount: 71,
    inStock: true,
    stockCount: 25,
    isNewArrival: false,
    isTrending: true,
    isFeatured: false,
    tags: ["shoes", "sneaker", "minimalist", "nappa"],
    fabric: "Premium Nappa Leather",
    careInstructions: "Wipe clean with moist micro-fiber cloth."
  },
  {
    id: "ANV-MA-01",
    name: "Aura 24k Gold-Plated Crest Cufflinks",
    slug: "aura-24k-gold-crest-cufflinks",
    category: "Men's Accessories",
    brand: "ANIVA Heritage",
    price: 1999,
    originalPrice: 2799,
    description: "Intricately engraved cufflinks with antique 24k gold plating and onyx enamel center. Comes packaged in ANIVA signature velvet box.",
    details: [
      "24k Antique Gold Plated Brass",
      "Onyx enamel inlay",
      "Bullet back closure",
      "Includes microfiber polishing cloth and velvet luxury box"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Antique Gold", hex: "#C9A86A" },
      { name: "Silver Chrome", hex: "#D1D5DB" }
    ],
    images: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.96,
    reviewCount: 54,
    inStock: true,
    stockCount: 15,
    isNewArrival: true,
    isTrending: false,
    isFeatured: true,
    tags: ["accessories", "cufflinks", "gold", "gift"],
    fabric: "Gold Plated Solid Brass",
    careInstructions: "Keep away from perfumes and chemicals. Store in dry pouch."
  },
  {
    id: "ANV-MA-02",
    name: "Sovereign Reversible Grain Leather Belt",
    slug: "sovereign-reversible-grain-leather-belt",
    category: "Men's Accessories",
    brand: "ANIVA Atelier",
    price: 2199,
    originalPrice: 2999,
    description: "Two looks in one. Crafted from top-grain Tuscan leather with a brushed gold twist buckle. Seamlessly flips between Onyx Black and Deep Mahogany.",
    details: [
      "Reversible dual-sided top grain leather",
      "Rotational brushed antique gold buckle",
      "35mm width - standard formal fit"
    ],
    sizes: ["30-32", "34-36", "38-40"],
    colors: [
      { name: "Onyx / Mahogany", hex: "#0D0D0D" }
    ],
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.85,
    reviewCount: 42,
    inStock: true,
    stockCount: 20,
    isNewArrival: false,
    isTrending: true,
    isFeatured: false,
    tags: ["accessories", "belt", "leather", "reversible"],
    fabric: "Top Grain Tuscan Leather",
    careInstructions: "Condition leather twice yearly with clear balm."
  },
  {
    id: "ANV-WA-01",
    name: "Celeste Sculptural Gold Choker & Drop Earrings Set",
    slug: "celeste-sculptural-gold-choker-set",
    category: "Women's Accessories",
    brand: "ANIVA Heritage",
    price: 2899,
    originalPrice: 3999,
    description: "Modern architectural jewelry set featuring hammered 18k gold vermeil and freshwater pearl accents. Designed for celebratory eveningwear and contemporary sarees.",
    details: [
      "18k Gold Vermeil over Sterling Silver",
      "Natural AAA Freshwater Pearls",
      "Hypoallergenic & nickel-free",
      "Adjustable chain length"
    ],
    sizes: ["Free Size"],
    colors: [
      { name: "Antique Gold", hex: "#C9A86A" },
      { name: "Rose Gold", hex: "#B76E79" }
    ],
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.98,
    reviewCount: 96,
    inStock: true,
    stockCount: 10,
    isNewArrival: true,
    isTrending: true,
    isFeatured: true,
    tags: ["jewelry", "women", "gold", "pearl"],
    fabric: "18k Gold Vermeil & Pearls",
    careInstructions: "Store individually in air-tight pouch."
  },
  {
    id: "ANV-WA-02",
    name: "Atelier Structured Calfskin Tote Bag",
    slug: "atelier-structured-calfskin-tote-bag",
    category: "Women's Accessories",
    brand: "ANIVA Atelier",
    price: 5499,
    originalPrice: 7499,
    description: "Spacious architectural tote bag crafted from pebble grain leather with gold hardware, laptop sleeve compartment, and detachable shoulder strap.",
    details: [
      "100% Genuine Italian Pebble Grain Leather",
      "Fits 15-inch MacBook Pro easily",
      "Interior zip pocket and key leash",
      "Reinforced protective base metal feet"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Ivory Cream", hex: "#F8F6F2" },
      { name: "Matte Black", hex: "#0D0D0D" },
      { name: "Warm Tan", hex: "#C88A58" }
    ],
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.91,
    reviewCount: 31,
    inStock: true,
    stockCount: 8,
    isNewArrival: true,
    isTrending: false,
    isFeatured: true,
    tags: ["bag", "tote", "leather", "luxury"],
    fabric: "Italian Pebble Grain Leather",
    careInstructions: "Avoid water contact. Use leather cleaner."
  },
  // --- PRE-OWNED AUTHENTICATED LUXURY WATCHES & SHOES ---
  {
    id: "ANV-PO-W01",
    name: "Omega Speedmaster Moonwatch Professional 42mm",
    slug: "omega-speedmaster-moonwatch-professional-42mm",
    category: "Pre-Owned Watches",
    brand: "Omega",
    price: 465000,
    originalPrice: 620000,
    description: "Iconic manual-winding chronograph with Hesalite crystal and Calibre 1861. Complete set with original presentation box, pictogram card, international warranty card, and mission patches booklet.",
    details: [
      "Movement: Omega Calibre 1861 Manual Chronograph",
      "Power Reserve: 48 hours",
      "Case: 42mm Stainless Steel",
      "Condition: Grade S (Pristine / Unpolished)",
      "Timing Deviation: +1.8 sec/day (Passed COSC standard)",
      "Accompaniments: Double Box, Warranty Card (2023), Manual, ANIVA Tamper-Proof Tag"
    ],
    sizes: ["42mm Case"],
    colors: [
      { name: "Matte Black Dial", hex: "#0D0D0D" }
    ],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1547996160-71dfa470d475?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 5.0,
    reviewCount: 14,
    inStock: true,
    stockCount: 1,
    isNewArrival: true,
    isTrending: true,
    isFeatured: true,
    tags: ["omega", "speedmaster", "pre-owned", "verified", "luxury-watch"],
    fabric: "316L Stainless Steel & Hesalite",
    careInstructions: "Water resistant to 50 meters. Annual gasket pressure check recommended.",
    isPreOwned: true,
    conditionGrade: "S",
    conditionNotes: "Pristine collector-grade piece. Zero perceptible scratches on case or bezel. Complete original set.",
    verificationId: "ANV-VER-2026-000842",
    verificationDate: "2026-07-28",
    serialNumber: "77892410",
    hasBox: true,
    hasPapers: true,
    hasInvoice: true,
    isVerified: true,
    sellerType: "Verified Retailer",
    sellerName: "Southern Time Vault (Bengaluru)",
    estimatedMarketRange: { min: 450000, max: 485000 },
    inspectionReport: [
      "100% Genuine Omega Calibre 1861 movement verified",
      "Dial, hands, and tritium markers 100% authentic factory configuration",
      "Amplitude: 295° @ 0 delta",
      "Zero counterfeit risk detected in ultrasonic cleaning and laser engraving analysis"
    ]
  },
  {
    id: "ANV-PO-W02",
    name: "Grand Seiko Heritage 'Snowflake' Spring Drive SBGA211",
    slug: "grand-seiko-heritage-snowflake-sbga211",
    category: "Pre-Owned Watches",
    brand: "Grand Seiko",
    price: 385000,
    originalPrice: 510000,
    description: "Renowned high-intensity titanium timepiece with hand-sculpted textured snowflake dial and mesmerizing glide-motion blued steel seconds hand powered by Caliber 9R65 Spring Drive.",
    details: [
      "Movement: Spring Drive Caliber 9R65 (72-hour power reserve)",
      "Case: Zaratsu-polished High-Intensity Titanium (41mm)",
      "Accuracy: ±1 second per day",
      "Condition: Grade A (Excellent / Hairline bracelet marks only)",
      "Accompaniments: Inner/Outer Boxes, Certificate of Inspection (2024)"
    ],
    sizes: ["41mm Case"],
    colors: [
      { name: "Snowflake White", hex: "#F8F6F2" }
    ],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.95,
    reviewCount: 9,
    inStock: true,
    stockCount: 1,
    isNewArrival: false,
    isTrending: true,
    isFeatured: true,
    tags: ["grand-seiko", "snowflake", "spring-drive", "titanium", "pre-owned"],
    fabric: "High-Intensity Titanium & Dual-Curved Sapphire",
    careInstructions: "Wipe with microfiber cloth. Keep away from magnetic fields > 4,800 A/m.",
    isPreOwned: true,
    conditionGrade: "A",
    conditionNotes: "Crisp Zaratsu bevels. Minor hairline marks on clasp underside. Dial is immaculate.",
    verificationId: "ANV-VER-2026-000918",
    verificationDate: "2026-08-02",
    serialNumber: "GS-9R65-88301",
    hasBox: true,
    hasPapers: true,
    hasInvoice: true,
    isVerified: true,
    sellerType: "Private Collector",
    sellerName: "Arun K. (Chennai)",
    estimatedMarketRange: { min: 370000, max: 400000 },
    inspectionReport: [
      "Spring drive tri-synchro regulator timing tested flawless",
      "Zaratsu distortion-free mirror polish verified intact",
      "Water resistance 10 bar pressure chamber tested passed"
    ]
  },
  {
    id: "ANV-PO-S01",
    name: "Air Jordan 1 High OG 'Chicago Lost & Found' (2022)",
    slug: "air-jordan-1-high-og-chicago-lost-and-found",
    category: "Pre-Owned Shoes",
    brand: "Jordan",
    price: 36999,
    originalPrice: 48000,
    description: "The Holy Grail of sneaker culture in cracked vintage leather treatment with aged sail midsole, classic black swoosh, and vintage receipt replica inside mismatch box lid.",
    details: [
      "Colorway: Varsity Red/Black/Sail/Muslin",
      "Style Code: DZ5485-612",
      "Condition: Grade S (Deadstock / Never Worn)",
      "Accessories: Complete with extra white & black laces, vintage receipt, tissue wrap",
      "Authentication: UV light blacklight checked; stitch density verified on heel counters"
    ],
    sizes: ["UK 8", "UK 9", "UK 10"],
    colors: [
      { name: "Chicago Red/Sail", hex: "#A81E2B" }
    ],
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 5.0,
    reviewCount: 22,
    inStock: true,
    stockCount: 2,
    isNewArrival: true,
    isTrending: true,
    isFeatured: true,
    tags: ["jordan", "chicago", "sneakers", "pre-owned", "verified", "grail"],
    fabric: "Premium Aged Calf Leather & Rubber",
    careInstructions: "Store with silica gel packets. Clean with shoe care foam.",
    isPreOwned: true,
    conditionGrade: "S",
    conditionNotes: "Pristine Deadstock condition. Zero star loss on toe sole; collar cracked leather 100% factory original.",
    verificationId: "ANV-VER-2026-001044",
    verificationDate: "2026-08-05",
    serialNumber: "SNK-DZ5485-9921",
    hasBox: true,
    hasPapers: true,
    hasInvoice: true,
    isVerified: true,
    sellerType: "Verified Retailer",
    sellerName: "Kicks South Atelier (Hyderabad)",
    estimatedMarketRange: { min: 35000, max: 39000 },
    inspectionReport: [
      "Nike factory size tag font spacing & barcode scanned authentic",
      "UV blacklight inspection reveals correct invisible glue signatures",
      "Toe box perforation pattern meets official Nike tooling specifications"
    ]
  },
  {
    id: "ANV-PO-S02",
    name: "New Balance 990v6 Made in USA 'Grey Heritage'",
    slug: "new-balance-990v6-made-in-usa-grey",
    category: "Pre-Owned Shoes",
    brand: "New Balance",
    price: 18999,
    originalPrice: 24999,
    description: "The pinnacle of dad-shoe luxury engineered with FuelCell foam cushioning, pigskin suede overlays, and reflective 3M accents. Handcrafted in USA.",
    details: [
      "Made in USA under Teddy Santis creative direction",
      "FuelCell midsole with ENCAP rim support",
      "Condition: Grade A (Worn 2 times indoors only)",
      "Accessories: Original grey box and hangtags included"
    ],
    sizes: ["UK 8.5", "UK 9.5", "UK 10.5"],
    colors: [
      { name: "Heritage Grey", hex: "#7A7C80" }
    ],
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.88,
    reviewCount: 11,
    inStock: true,
    stockCount: 1,
    isNewArrival: false,
    isTrending: true,
    isFeatured: false,
    tags: ["newbalance", "990v6", "madeinusa", "grey", "pre-owned"],
    fabric: "Pigskin Suede & Breathable Mesh",
    careInstructions: "Suede brush only. Do not machine wash.",
    isPreOwned: true,
    conditionGrade: "A",
    conditionNotes: "Virtually indistinguishable from brand new. Minimal friction dust on outer sole tread.",
    verificationId: "ANV-VER-2026-001099",
    verificationDate: "2026-08-08",
    serialNumber: "NB-M990GL6-2024",
    hasBox: true,
    hasPapers: false,
    hasInvoice: true,
    isVerified: true,
    sellerType: "Private Collector",
    sellerName: "Gautam M. (Bengaluru)",
    estimatedMarketRange: { min: 18000, max: 20000 },
    inspectionReport: [
      "Authentic FuelCell rebound elasticity confirmed",
      "Suede nap texture & Made in USA tongue flag stitching verified",
      "Insole logo typography and shape verified"
    ]
  }
];

export const INITIAL_PREOWNED_SUBMISSIONS: PreOwnedSubmission[] = [
  {
    id: "SUB-2026-001",
    category: "Watches",
    brand: "Rolex",
    model: "Submariner Date 41mm Ref. 126610LN",
    referenceNumber: "126610LN",
    condition: "S",
    originalPrice: 945000,
    askingPrice: 1120000,
    aiSuggestedPrice: 1090000,
    aiMarketRange: { min: 1050000, max: 1140000 },
    aiConfidence: "High",
    hasBox: true,
    hasPapers: true,
    hasInvoice: true,
    photos: [
      { angle: "Dial Direct", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" },
      { angle: "Caseback & Crown", url: "https://images.unsplash.com/photo-1547996160-71dfa470d475?auto=format&fit=crop&w=800&q=80" }
    ],
    sellerName: "Vikramaditya V.",
    sellerEmail: "vikram.v@example.com",
    sellerPhone: "+91 98400 11223",
    sellerCity: "Chennai",
    status: "PHYSICAL_INTAKE",
    submittedAt: "2026-08-10T14:20:00Z"
  },
  {
    id: "SUB-2026-002",
    category: "Shoes",
    brand: "Jordan",
    model: "Travis Scott x Air Jordan 1 Low 'Reverse Mocha'",
    referenceNumber: "DM7866-162",
    condition: "A",
    originalPrice: 85000,
    askingPrice: 92000,
    aiSuggestedPrice: 89000,
    aiMarketRange: { min: 86000, max: 94000 },
    aiConfidence: "High",
    hasBox: true,
    hasPapers: true,
    hasInvoice: true,
    photos: [
      { angle: "Lateral Profile", url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80" },
      { angle: "Outsole & Insole", url: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80" }
    ],
    sellerName: "Sanjay Nambiar",
    sellerEmail: "sanjay.n@example.com",
    sellerPhone: "+91 97410 44556",
    sellerCity: "Kochi",
    status: "DOCUMENT_REVIEW",
    submittedAt: "2026-08-12T09:45:00Z"
  }
];

export const INITIAL_RETAILER_APPLICATIONS: RetailerApplication[] = [
  {
    id: "RET-APP-101",
    businessName: "Deccan Fine Horology LLP",
    contactPerson: "Maheshwar Rao",
    email: "mahesh@deccanhorology.in",
    phone: "+91 99887 66554",
    gstin: "36AAACD1234F1Z5",
    state: "Telangana",
    city: "Hyderabad",
    brandCategories: ["Pre-Owned Luxury Watches", "Fine Watch Straps"],
    bankAccountNumber: "50200034891102",
    bankIfsc: "HDFC0000128",
    status: "APPROVED",
    appliedAt: "2026-07-20T11:00:00Z",
    commissionRate: 18
  },
  {
    id: "RET-APP-102",
    businessName: "Chola Bespoke Leathercraft",
    contactPerson: "Divya Sundaram",
    email: "divya@cholaleather.com",
    phone: "+91 94440 88776",
    gstin: "33AABCC5678H1Z8",
    state: "Tamil Nadu",
    city: "Chennai",
    brandCategories: ["Handmade Leather Shoes", "Men's Wallets"],
    bankAccountNumber: "001201509923",
    bankIfsc: "ICIC0000012",
    status: "KYC_VERIFIED",
    appliedAt: "2026-08-01T15:30:00Z",
    commissionRate: 15
  },
  {
    id: "RET-APP-103",
    businessName: "Malabar Soles & Grails",
    contactPerson: "Faisal Rahman",
    email: "faisal@malabarsoles.in",
    phone: "+91 98460 22334",
    gstin: "32AAMFR9012K1Z3",
    state: "Kerala",
    city: "Kozhikode",
    brandCategories: ["Pre-Owned Branded Sneakers", "Limited Edition Footwear"],
    bankAccountNumber: "1029384756",
    bankIfsc: "SBIN0004501",
    status: "PENDING_REVIEW",
    appliedAt: "2026-08-11T16:15:00Z",
    commissionRate: 20
  }
];

export const INITIAL_CERTIFICATES: Record<string, VerificationCertificate> = {
  "ANV-VER-2026-000842": {
    verificationId: "ANV-VER-2026-000842",
    productId: "ANV-PO-W01",
    productName: "Omega Speedmaster Moonwatch Professional 42mm",
    brand: "Omega",
    model: "Speedmaster Professional 1861",
    serialNumber: "77892410",
    conditionGrade: "S",
    verifiedDate: "2026-07-28",
    authenticatorName: "T. R. Sreenivasan (WOSTEP Certified)",
    authenticatorRole: "Senior Horologist & Lead Authenticator",
    inspectionPassed: [
      "Movement: Genuine Omega Calibre 1861 verified under 40x stereomicroscopy",
      "Case & Bezel: 100% factory original dimensions & tachymetre font alignment",
      "Dial & Hands: Tritium/Luminova patina verified with UV spectrometry",
      "Rate Deviation: +1.8 sec/day, beat error 0.1ms at full wind",
      "Water Resistance: Vacuum and pressure chamber pass at 5 bar"
    ],
    qrCodeUrl: "https://aniva.in/verify/ANV-VER-2026-000842",
    status: "VERIFIED"
  },
  "ANV-VER-2026-000918": {
    verificationId: "ANV-VER-2026-000918",
    productId: "ANV-PO-W02",
    productName: "Grand Seiko Heritage 'Snowflake' Spring Drive SBGA211",
    brand: "Grand Seiko",
    model: "SBGA211 Snowflake",
    serialNumber: "GS-9R65-88301",
    conditionGrade: "A",
    verifiedDate: "2026-08-02",
    authenticatorName: "Deepak Somayaji",
    authenticatorRole: "Horology Verification Specialist",
    inspectionPassed: [
      "Movement: Caliber 9R65 Spring Drive quartz crystal-mechanical sync confirmed",
      "Case: Zaratsu high-intensity titanium polish authenticated without over-polishing",
      "Dial: Textured snowflake washi paper motif verified factory original",
      "Bracelet: Solid titanium link screws and dual-pusher clasp tested"
    ],
    qrCodeUrl: "https://aniva.in/verify/ANV-VER-2026-000918",
    status: "VERIFIED"
  },
  "ANV-VER-2026-001044": {
    verificationId: "ANV-VER-2026-001044",
    productId: "ANV-PO-S01",
    productName: "Air Jordan 1 High OG 'Chicago Lost & Found' (2022)",
    brand: "Jordan",
    model: "Chicago Lost & Found (DZ5485-612)",
    serialNumber: "SNK-DZ5485-9921",
    conditionGrade: "S",
    verifiedDate: "2026-08-05",
    authenticatorName: "Kishore Varman",
    authenticatorRole: "Sneaker & Footwear Authenticator",
    inspectionPassed: [
      "Material: Cracked collar leather aging and sail midsole oxidation verified",
      "Stitching: Heel hourglass shape and double-needle density confirmed",
      "Blacklight: Invisible factory glue stamping matches Nike Taiwan factory archive",
      "Accessories: Complete with aged invoice replica, mismatched lid box, extra laces"
    ],
    qrCodeUrl: "https://aniva.in/verify/ANV-VER-2026-001044",
    status: "VERIFIED"
  }
};

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: "ANIVA10",
    discountPercentage: 10,
    minOrderAmount: 999,
    description: "10% Instant Discount on your first order",
    expiresAt: "2026-12-31"
  },
  {
    code: "SOUTHGOLD",
    discountPercentage: 15,
    minOrderAmount: 2499,
    description: "15% Discount on orders above ₹2,499 across South India",
    expiresAt: "2026-12-31"
  },
  {
    code: "FESTIVE20",
    discountPercentage: 20,
    minOrderAmount: 4999,
    description: "20% Festive Luxury Discount on orders above ₹4,999",
    expiresAt: "2026-12-31"
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "REV-101",
    productId: "ANV-TS-01",
    userName: "Karthik Subramanian",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    comment: "The fabric quality and finish is unbelievable! Perfect relaxed drop-shoulder fit. Delivered in 24 hours to Chennai.",
    date: "2026-07-15",
    verifiedPurchase: true
  },
  {
    id: "REV-102",
    productId: "ANV-CUST-01",
    userName: "Ananya Ramesh",
    location: "Bengaluru, Karnataka",
    rating: 5,
    comment: "Used the Custom Print Studio to print our team logo in gold typography. The live preview was 100% accurate and print quality is superb!",
    date: "2026-07-18",
    verifiedPurchase: true
  },
  {
    id: "REV-103",
    productId: "ANV-SH-01",
    userName: "Dr. Vishnu Prasad",
    location: "Kochi, Kerala",
    rating: 5,
    comment: "Pure luxury Italian leather loafers. Hand-burnished finish looks like ₹15,000 designer footwear. Extremely comfortable for long hospital days.",
    date: "2026-07-20",
    verifiedPurchase: true
  },
  {
    id: "REV-104",
    productId: "ANV-WA-01",
    userName: "Priya Reddy",
    location: "Hyderabad, Telangana",
    rating: 5,
    comment: "The Celeste Gold Choker set is drop dead gorgeous! Wore it to my cousin's wedding reception in Jubilee Hills and got non-stop compliments.",
    date: "2026-07-22",
    verifiedPurchase: true
  }
];
