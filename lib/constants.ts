export const BRAND = {
  name: "FORMA",
  tagline: "Your design. Made real.",
  year: 2026,
};

export const NAV_LINKS = [
  { label: "Shop", href: "/#shop" },
  { label: "Designs", href: "/designs" },
  { label: "Upload & Print", href: "/upload" },
  { label: "Materials", href: "/materials" },
  { label: "How It Works", href: "/#how-it-works" },
];

export type MaterialKey = "pla" | "petg" | "abs" | "tpu" | "resin";

export type MaterialDef = {
  key: MaterialKey;
  name: string;
  description: string;
  densityGCm3: number; // grams per cm^3, used for weight estimate
  /**
   * ₹ per gram, all-in customer-facing rate (already covers baseline
   * machine time + margin, matching how Indian FDM print services quote in
   * practice). A configurable baseline, not a single hardcoded "market
   * price" — tune per material without touching pricing logic.
   */
  costPerGram: number;
  finish: string;
  bestFor: string;
};

export const MATERIALS: MaterialDef[] = [
  {
    key: "pla",
    name: "PLA",
    description: "Clean, dimensionally stable, and the fastest to produce.",
    densityGCm3: 1.24,
    costPerGram: 6,
    finish: "Matte, fine detail",
    bestFor: "Display pieces, prototypes, figurines",
  },
  {
    key: "petg",
    name: "PETG",
    description: "Tougher than PLA with better heat and impact resistance.",
    densityGCm3: 1.27,
    costPerGram: 7,
    finish: "Semi-gloss",
    bestFor: "Functional parts, everyday-use objects",
  },
  {
    key: "abs",
    name: "ABS",
    description: "Impact-resistant and machinable — built to be handled.",
    densityGCm3: 1.04,
    costPerGram: 6.5,
    finish: "Matte, sandable",
    bestFor: "Enclosures, mechanical parts",
  },
  {
    key: "tpu",
    name: "TPU",
    description: "Rubber-like flexibility that survives repeated bending.",
    densityGCm3: 1.21,
    costPerGram: 9.5,
    finish: "Soft-touch",
    bestFor: "Grips, wearables, gaskets",
  },
  {
    key: "resin",
    name: "Resin",
    description: "The highest resolution finish, for fine detail work.",
    densityGCm3: 1.1,
    costPerGram: 13,
    finish: "Smooth, high detail",
    bestFor: "Miniatures, jewelry, intricate models",
  },
];

export type ColorKey = "black" | "white" | "red" | "blue" | "custom";

export const COLORS: { key: ColorKey; name: string; hex: string }[] = [
  { key: "black", name: "Black", hex: "#161616" },
  { key: "white", name: "White", hex: "#f5f5f3" },
  { key: "red", name: "Red", hex: "#d1352b" },
  { key: "blue", name: "Blue", hex: "#2f5fd6" },
  { key: "custom", name: "Custom", hex: "#ff5a1f" },
];

export type QualityKey = "standard" | "fine" | "ultra";

export type QualityDef = {
  key: QualityKey;
  name: string;
  layerHeight: string;
  timeMultiplier: number;
  costMultiplier: number;
};

export const QUALITIES: QualityDef[] = [
  { key: "standard", name: "Standard", layerHeight: "0.24mm", timeMultiplier: 1, costMultiplier: 1 },
  { key: "fine", name: "Fine", layerHeight: "0.16mm", timeMultiplier: 1.35, costMultiplier: 1.2 },
  { key: "ultra", name: "Ultra Fine", layerHeight: "0.10mm", timeMultiplier: 1.9, costMultiplier: 1.5 },
];

export const MAX_UPLOAD_MB = 50;
export const SUPPORTED_FORMATS = [".stl", ".obj", ".3mf"];

export type ProductCategory =
  | "anime"
  | "superhero"
  | "gaming"
  | "desk"
  | "home"
  | "cosplay"
  | "collectibles"
  | "functional";

export const CATEGORIES: { key: ProductCategory; label: string; imageId: string }[] = [
  { key: "anime", label: "Anime", imageId: "cyber-samurai" },
  { key: "gaming", label: "Gaming", imageId: "retro-pixel-blaster" },
  { key: "collectibles", label: "Collectibles", imageId: "nebula-fox" },
  { key: "desk", label: "Desk", imageId: "modular-desk-organizer" },
  { key: "home", label: "Home", imageId: "lofi-cat-planter" },
  { key: "cosplay", label: "Cosplay", imageId: "circuit-visor" },
  { key: "functional", label: "Functional", imageId: "wireless-charge-dock" },
];

/**
 * Real photos of prints we've actually produced, stored at
 * public/media/products/<imageId>.jpg. `imageId` doubles as the filename —
 * everything downstream (product cards, product pages, next/image sizing)
 * reads through this one function, so swapping a photo means replacing the
 * file, not touching any component.
 */
export function productImage(imageId: string) {
  return `/media/products/${imageId}.jpg`;
}

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  material: MaterialKey;
  /** Bounding box of the design at its native (Medium) scale, before size scaling. */
  baseDimensionsMm: { width: number; depth: number; height: number };
  /**
   * Approximate solid fraction of the bounding box (0-1) — a hollow
   * decorative shell and a solid mechanical block of identical bounding-box
   * size do not use the same amount of filament, so pricing derives
   * estimated volume from this rather than the raw box volume. Stand-in for
   * a real slicer estimate (see lib/productSize.ts).
   */
  fillFactor: number;
  rating: number;
  reviewCount: number;
  colors: ColorKey[];
  description: string;
  creator: string;
  imageId: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "cyber-samurai",
    name: "Kunai",
    category: "anime",
    material: "pla",
    baseDimensionsMm: { width: 220, depth: 35, height: 10 },
    fillFactor: 0.4,
    rating: 4.8,
    reviewCount: 214,
    colors: ["black", "white", "red"],
    description:
      "A classic ninja throwing-knife prop, cast with a crisp edge profile and balanced grip taper. Convention-ready straight off the bed.",
    creator: "Studio Ronin",
    imageId: "cyber-samurai",
  },
  {
    slug: "nebula-fox",
    name: "Tentacle",
    category: "collectibles",
    material: "resin",
    baseDimensionsMm: { width: 70, depth: 70, height: 150 },
    fillFactor: 0.22,
    rating: 4.9,
    reviewCount: 388,
    colors: ["white", "blue"],
    description:
      "A sculptural tentacle piece with fine suction-cup detail, printed in resin for a smooth, painter-ready surface.",
    creator: "Lumen Forge",
    imageId: "nebula-fox",
  },
  {
    slug: "retro-pixel-blaster",
    name: "Shuriken (4-Point)",
    category: "gaming",
    material: "petg",
    baseDimensionsMm: { width: 90, depth: 90, height: 6 },
    fillFactor: 0.55,
    rating: 4.6,
    reviewCount: 97,
    colors: ["black", "red", "blue"],
    description:
      "A four-point throwing star with sharpened-look edges, cast flat and true for display or prop use.",
    creator: "Pixel Foundry",
    imageId: "retro-pixel-blaster",
  },
  {
    slug: "modular-desk-organizer",
    name: "Pen Holder Figure",
    category: "desk",
    material: "petg",
    baseDimensionsMm: { width: 85, depth: 85, height: 140 },
    fillFactor: 0.18,
    rating: 4.9,
    reviewCount: 512,
    colors: ["black", "white"],
    description:
      "A sculpted desk figure that doubles as a pen holder — one part display piece, one part daily tool.",
    creator: "FORMA Studio",
    imageId: "modular-desk-organizer",
  },
  {
    slug: "lofi-cat-planter",
    name: "Corset Vase",
    category: "home",
    material: "pla",
    baseDimensionsMm: { width: 95, depth: 95, height: 180 },
    fillFactor: 0.12,
    rating: 4.8,
    reviewCount: 301,
    colors: ["white", "black"],
    description:
      "A vase with a laced, corset-inspired silhouette. Watertight print, fits standard cut stems.",
    creator: "Studio Quiet",
    imageId: "lofi-cat-planter",
  },
  {
    slug: "circuit-visor",
    name: "Shuriken (8-Point)",
    category: "cosplay",
    material: "abs",
    baseDimensionsMm: { width: 100, depth: 100, height: 6 },
    fillFactor: 0.5,
    rating: 4.5,
    reviewCount: 64,
    colors: ["black"],
    description:
      "An eight-point throwing star with an intricate layered profile, built for convention props and shelf display alike.",
    creator: "Pixel Foundry",
    imageId: "circuit-visor",
  },
  {
    slug: "gravity-dice-tower",
    name: "Shuriken (3-Point)",
    category: "cosplay",
    material: "pla",
    baseDimensionsMm: { width: 85, depth: 85, height: 6 },
    fillFactor: 0.55,
    rating: 4.7,
    reviewCount: 178,
    colors: ["black", "white", "blue"],
    description:
      "A minimal three-point throwing star, quick to print and finished with a clean beveled edge.",
    creator: "Vantage Collective",
    imageId: "gravity-dice-tower",
  },
  {
    slug: "wireless-charge-dock",
    name: "Celtic Coaster",
    category: "functional",
    material: "petg",
    baseDimensionsMm: { width: 100, depth: 100, height: 8 },
    fillFactor: 0.6,
    rating: 4.6,
    reviewCount: 132,
    colors: ["black", "white"],
    description:
      "A knotwork coaster with a raised Celtic border, cast flat for a stable, coffee-ring-proof surface.",
    creator: "FORMA Studio",
    imageId: "wireless-charge-dock",
  },
];

export const FOOTER_LINKS = {
  Shop: [
    { label: "Designs", href: "/designs" },
    { label: "Upload & Print", href: "/upload" },
    { label: "Materials", href: "/materials" },
    { label: "Track Order", href: "/track" },
  ],
  Help: [
    { label: "FAQ", href: "/support#faq" },
    { label: "Shipping", href: "/support" },
    { label: "Returns", href: "/support" },
    { label: "Contact", href: "/support" },
  ],
  Account: [
    { label: "Orders", href: "/account/orders" },
    { label: "Profile", href: "/account/settings" },
  ],
};

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "X", href: "https://x.com" },
];
