export const BRAND = {
  name: "FORMA",
  tagline: "Your design. Made real.",
  year: 2026,
};

export const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Designs", href: "/designs" },
  { label: "Materials", href: "/materials" },
  { label: "Track Order", href: "/track" },
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
  { key: "anime", label: "Anime", imageId: "1612380318869-7925b91da6ba" },
  { key: "superhero", label: "Superhero", imageId: "1634861949375-3fc4bd412f2f" },
  { key: "gaming", label: "Gaming", imageId: "1643489069237-3548135218c8" },
  { key: "collectibles", label: "Collectibles", imageId: "1695747001087-417e0d9abd68" },
  { key: "desk", label: "Desk", imageId: "1751107756601-66fa542b0e3c" },
  { key: "home", label: "Home", imageId: "1618220179428-22790b461013" },
  { key: "cosplay", label: "Cosplay", imageId: "1680657437578-b514959cdb6e" },
  { key: "functional", label: "Functional", imageId: "1698314440014-3badb1e9c938" },
];

/**
 * Placeholder product photography sourced from Unsplash (free license) for
 * prototyping. Swap `imageId` values for your own licensed product photos —
 * everything downstream (product cards, product pages, next/image sizing)
 * reads through this one field, so no other code needs to change.
 */
export function unsplashUrl(imageId: string, width = 800) {
  return `https://images.unsplash.com/photo-${imageId}?w=${width}&q=80&auto=format&fit=crop`;
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
    name: "Cyber Samurai",
    category: "anime",
    material: "pla",
    baseDimensionsMm: { width: 60, depth: 45, height: 120 },
    fillFactor: 0.2,
    rating: 4.8,
    reviewCount: 214,
    colors: ["black", "white", "red"],
    description:
      "An original armored warrior design blending traditional samurai silhouettes with a neo-tech aesthetic. Cast in fine layer resolution for crisp panel lines.",
    creator: "Studio Ronin",
    imageId: "1612380318869-7925b91da6ba",
  },
  {
    slug: "nebula-fox",
    name: "Nebula Fox",
    category: "collectibles",
    material: "resin",
    baseDimensionsMm: { width: 55, depth: 65, height: 90 },
    fillFactor: 0.22,
    rating: 4.9,
    reviewCount: 388,
    colors: ["white", "blue"],
    description:
      "A stylised fox miniature with a constellation-etched coat, printed in resin for painter-ready detail.",
    creator: "Lumen Forge",
    imageId: "1695747001087-417e0d9abd68",
  },
  {
    slug: "aether-guardian-bust",
    name: "Aether Guardian Bust",
    category: "superhero",
    material: "pla",
    baseDimensionsMm: { width: 110, depth: 95, height: 180 },
    fillFactor: 0.18,
    rating: 4.7,
    reviewCount: 156,
    colors: ["black", "white"],
    description:
      "An original caped-guardian bust for display — heroic proportions, sculpted from scratch by an independent creator, not affiliated with any studio or publisher.",
    creator: "Vantage Collective",
    imageId: "1634861949375-3fc4bd412f2f",
  },
  {
    slug: "retro-pixel-blaster",
    name: "Retro Pixel Blaster",
    category: "gaming",
    material: "petg",
    baseDimensionsMm: { width: 220, depth: 45, height: 70 },
    fillFactor: 0.14,
    rating: 4.6,
    reviewCount: 97,
    colors: ["black", "red", "blue"],
    description:
      "A chunky, 16-bit-inspired prop blaster built for shelf display or convention cosplay. Snap-fit, no glue required.",
    creator: "Pixel Foundry",
    imageId: "1643489069237-3548135218c8",
  },
  {
    slug: "modular-desk-organizer",
    name: "Modular Desk Organizer",
    category: "desk",
    material: "petg",
    baseDimensionsMm: { width: 140, depth: 95, height: 40 },
    fillFactor: 0.16,
    rating: 4.9,
    reviewCount: 512,
    colors: ["black", "white"],
    description:
      "A stackable, tool-free desk tray system. Add modules as your setup grows.",
    creator: "FORMA Studio",
    imageId: "1751107756601-66fa542b0e3c",
  },
  {
    slug: "lofi-cat-planter",
    name: "Lo-Fi Cat Planter",
    category: "home",
    material: "pla",
    baseDimensionsMm: { width: 100, depth: 55, height: 70 },
    fillFactor: 0.15,
    rating: 4.8,
    reviewCount: 301,
    colors: ["white", "black"],
    description:
      "A quietly-detailed planter shaped like a cat mid-stretch. Drainage-ready, fits a 4-inch succulent.",
    creator: "Studio Quiet",
    imageId: "1618220179428-22790b461013",
  },
  {
    slug: "circuit-visor",
    name: "Circuit Visor",
    category: "cosplay",
    material: "abs",
    baseDimensionsMm: { width: 200, depth: 55, height: 85 },
    fillFactor: 0.1,
    rating: 4.5,
    reviewCount: 64,
    colors: ["black"],
    description:
      "A wearable convention-ready visor with an etched circuit motif. Adjustable strap mount included.",
    creator: "Pixel Foundry",
    imageId: "1680657437578-b514959cdb6e",
  },
  {
    slug: "gravity-dice-tower",
    name: "Gravity Dice Tower",
    category: "gaming",
    material: "pla",
    baseDimensionsMm: { width: 65, depth: 65, height: 160 },
    fillFactor: 0.12,
    rating: 4.7,
    reviewCount: 178,
    colors: ["black", "white", "blue"],
    description:
      "A tabletop dice tower with an internal spiral ramp for a satisfying, fair roll every time.",
    creator: "Vantage Collective",
    imageId: "1666870747605-cca30ed154c5",
  },
  {
    slug: "wireless-charge-dock",
    name: "Wireless Charge Dock",
    category: "functional",
    material: "petg",
    baseDimensionsMm: { width: 110, depth: 85, height: 35 },
    fillFactor: 0.3,
    rating: 4.6,
    reviewCount: 132,
    colors: ["black", "white"],
    description:
      "A tidy angled dock that hides your wireless charger under a clean, cable-managed shell.",
    creator: "FORMA Studio",
    imageId: "1698314440014-3badb1e9c938",
  },
];

export const FOOTER_LINKS = {
  Product: [
    { label: "Upload a design", href: "/upload" },
    { label: "Browse designs", href: "/designs" },
    { label: "Materials", href: "/materials" },
    { label: "Track an order", href: "/track" },
  ],
  Company: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Help center", href: "/support" },
    { label: "Contact", href: "/support" },
  ],
  Account: [
    { label: "My orders", href: "/account/orders" },
    { label: "My designs", href: "/account/designs" },
    { label: "Saved", href: "/account/saved" },
    { label: "Addresses", href: "/account/addresses" },
  ],
};

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "X", href: "https://x.com" },
];
