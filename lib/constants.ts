import { calculateProductPrice, type MaterialType } from "./pricing";

export const BRAND = {
  name: "FORMA",
  tagline: "A curated collection of collectible objects.",
  year: 2026,
};

export const NAV_LINKS = [
  { label: "Collection", href: "/designs" },
  { label: "About", href: "/#about" },
];

export type ColorKey = "black" | "white" | "red" | "blue" | "custom";

export const COLORS: { key: ColorKey; name: string; hex: string }[] = [
  { key: "black", name: "Black", hex: "#161616" },
  { key: "white", name: "White", hex: "#f5f5f3" },
  { key: "red", name: "Red", hex: "#d1352b" },
  { key: "blue", name: "Blue", hex: "#2f5fd6" },
  { key: "custom", name: "Custom", hex: "#ff5a1f" },
];

/**
 * Real photos of the pieces we sell, stored at
 * public/media/products/<imageId>.jpg. `imageId` doubles as the filename —
 * everything downstream (product cards, product pages, next/image sizing)
 * reads through this one function, so swapping a photo means replacing the
 * file, not touching any component.
 */
export function productImage(imageId: string) {
  return `/media/products/${imageId}.jpg`;
}

export type Availability = "available" | "limited" | "sold-out";

export type Product = {
  /** URL slug and canonical product id. */
  slug: string;
  name: string;
  /** A single descriptive noun, not a filterable taxonomy — there is no category browsing. */
  category: string;
  /** Print weight — drives the material-cost term of the pricing formula. See lib/pricing.ts. */
  weightInGrams: number;
  /** Pricing tier the material rate is looked up by. See MATERIAL_RATES in lib/pricing.ts. */
  materialType: MaterialType;
  /** Print material, shown as a spec on the product page — display text only. */
  material: string;
  finish: string;
  dimensionsMm: { width: number; depth: number; height: number };
  /** One or two sentences — what the piece is. */
  description: string;
  /** A short editorial line for the product page — why it exists / how it's made. */
  story: string;
  imageId: string;
  availability: Availability;
  creator: string;
};

/**
 * The complete catalog — exactly seventeen pieces, each photographed
 * individually. This is a curated collection, not a marketplace: there is no
 * size/color configurator and no user-submitted models. Selling price is
 * never stored here — it's derived from `weightInGrams` + `materialType` by
 * `getProductPrice` (see lib/pricing.ts) every time it's needed, so editing
 * either field automatically recalculates the price everywhere. Add another
 * piece by adding an entry here and its photo at
 * public/media/products/<slug>.jpg — nothing else to touch.
 */
export const PRODUCTS: Product[] = [
  {
    slug: "kunai",
    name: "Kunai",
    category: "Prop",
    weightInGrams: 60,
    materialType: "PLA",
    material: "PLA",
    finish: "Matte black",
    dimensionsMm: { width: 220, depth: 35, height: 10 },
    description:
      "A ninja throwing-knife prop, cast with a crisp edge profile and a balanced grip taper.",
    story:
      "Modeled from a traditional kunai silhouette and printed flat for a true edge line — the kind of prop that reads as forged, not printed.",
    imageId: "cyber-samurai",
    availability: "available",
    creator: "Studio Ronin",
  },
  {
    slug: "tentacle",
    name: "Tentacle",
    category: "Sculpture",
    weightInGrams: 180,
    materialType: "Exotic",
    material: "Resin",
    finish: "Smooth, pearl white",
    dimensionsMm: { width: 70, depth: 70, height: 150 },
    description:
      "A sculptural tentacle study with fine suction-cup detail, cast in resin for a painter-ready surface.",
    story:
      "The most labor-intensive piece in the collection — resin-printed at a slow layer height to keep every suction cup crisp. Produced in small batches.",
    imageId: "nebula-fox",
    availability: "limited",
    creator: "Lumen Forge",
  },
  {
    slug: "shuriken-four-point",
    name: "Shuriken — Four Point",
    category: "Prop",
    weightInGrams: 45,
    materialType: "PETG",
    material: "PETG",
    finish: "Matte black",
    dimensionsMm: { width: 90, depth: 90, height: 6 },
    description: "A four-point throwing star with sharpened-look edges, cast flat and true.",
    story: "PETG for a slightly flexible edge that survives being handled, dropped and re-shelved.",
    imageId: "retro-pixel-blaster",
    availability: "available",
    creator: "Pixel Foundry",
  },
  {
    slug: "pen-holder-figure",
    name: "Pen Holder Figure",
    category: "Object",
    weightInGrams: 160,
    materialType: "PETG",
    material: "PETG",
    finish: "Matte black",
    dimensionsMm: { width: 85, depth: 85, height: 140 },
    description: "A sculpted desk figure that doubles as a pen holder.",
    story: "One part display piece, one part daily tool — designed to earn its place on a desk.",
    imageId: "modular-desk-organizer",
    availability: "available",
    creator: "FORMA Studio",
  },
  {
    slug: "corset-vase",
    name: "Corset Vase",
    category: "Vessel",
    weightInGrams: 220,
    materialType: "PLA",
    material: "PLA",
    finish: "Matte white",
    dimensionsMm: { width: 95, depth: 95, height: 180 },
    description: "A vase with a laced, corset-inspired silhouette. Watertight, fits standard cut stems.",
    story: "Printed as a single continuous shell — no seams, no glue joints, no visible layer lines on the laced panels.",
    imageId: "lofi-cat-planter",
    availability: "available",
    creator: "Studio Quiet",
  },
  {
    slug: "shuriken-eight-point",
    name: "Shuriken — Eight Point",
    category: "Prop",
    weightInGrams: 55,
    materialType: "Exotic",
    material: "ABS",
    finish: "Matte black",
    dimensionsMm: { width: 100, depth: 100, height: 6 },
    description: "An eight-point throwing star with an intricate layered profile.",
    story: "The most detailed of the three shuriken forms — ABS holds the fine points without chipping.",
    imageId: "circuit-visor",
    availability: "available",
    creator: "Pixel Foundry",
  },
  {
    slug: "shuriken-three-point",
    name: "Shuriken — Three Point",
    category: "Prop",
    weightInGrams: 35,
    materialType: "PLA",
    material: "PLA",
    finish: "Matte black",
    dimensionsMm: { width: 85, depth: 85, height: 6 },
    description: "A minimal three-point throwing star, finished with a clean beveled edge.",
    story: "The simplest form in the shuriken set — a study in restraint next to its four- and eight-point siblings.",
    imageId: "gravity-dice-tower",
    availability: "available",
    creator: "Vantage Collective",
  },
  {
    slug: "celtic-coaster",
    name: "Celtic Coaster",
    category: "Object",
    weightInGrams: 50,
    materialType: "PETG",
    material: "PETG",
    finish: "Matte black",
    dimensionsMm: { width: 100, depth: 100, height: 8 },
    description: "A knotwork coaster with a raised Celtic border, cast flat for a stable, coffee-ring-proof surface.",
    story: "Sold individually — pair two or more to complete a set.",
    imageId: "wireless-charge-dock",
    availability: "available",
    creator: "FORMA Studio",
  },
  {
    slug: "jewellery-stand",
    name: "Jewellery Stand",
    category: "Object",
    weightInGrams: 210,
    materialType: "PLA",
    material: "PLA",
    finish: "Matte black",
    dimensionsMm: { width: 90, depth: 90, height: 200 },
    description: "A clawed hand rising from a bed of tentacles, cast to hold rings and hang necklaces from its fingertips.",
    story: "The tentacle base carries over from the same sculpting language as Tentacle — printed tall and slow to keep every claw and sucker crisp.",
    imageId: "jewellery-stand",
    availability: "available",
    creator: "Lumen Forge",
  },
  {
    slug: "makeup-organizer",
    name: "Makeup Organizer",
    category: "Object",
    weightInGrams: 420,
    materialType: "PETG",
    material: "PETG",
    finish: "Matte black",
    dimensionsMm: { width: 180, depth: 120, height: 130 },
    description: "A brush cup and tiered tray in one piece, wrapped in the same carved tentacle relief as the rest of the set.",
    story: "The largest piece in the collection — PETG for a surface that holds up to daily wiping down.",
    imageId: "makeup-organizer",
    availability: "available",
    creator: "Lumen Forge",
  },
  {
    slug: "crystal-phone-stand",
    name: "Crystal Phone Stand",
    category: "Object",
    weightInGrams: 140,
    materialType: "PLA",
    material: "PLA",
    finish: "Matte charcoal",
    dimensionsMm: { width: 110, depth: 80, height: 100 },
    description: "A faceted crystal cluster that doubles as a phone dock, angled for an easy read at a glance.",
    story: "Each facet is printed at a distinct angle — no two crystal spikes catch the light quite the same way.",
    imageId: "crystal-phone-stand",
    availability: "available",
    creator: "Vantage Collective",
  },
  {
    slug: "ashtray",
    name: "Ashtray",
    category: "Vessel",
    weightInGrams: 180,
    materialType: "PETG",
    material: "PETG",
    finish: "Matte black",
    dimensionsMm: { width: 150, depth: 150, height: 40 },
    description: "A knotwork medallion at the base, ringed by the same coiled tentacles as the rest of the collection.",
    story: "PETG for better heat resistance than the rest of the catalog — the one piece here that's meant to take real warmth.",
    imageId: "ashtray",
    availability: "available",
    creator: "FORMA Studio",
  },
  {
    slug: "block-buddy",
    name: "Block Buddy",
    category: "Figure",
    weightInGrams: 80,
    materialType: "PLA",
    material: "PLA",
    finish: "Matte orange",
    dimensionsMm: { width: 70, depth: 45, height: 65 },
    description: "A blocky, pixel-art desk companion with a wide grin of button eyes.",
    story: "Modeled straight off a voxel sprite — every edge kept sharp and squared, no smoothing, so it reads as pixel art in three dimensions.",
    imageId: "block-buddy",
    availability: "available",
    creator: "Pixel Foundry",
  },
  {
    slug: "spider-emblem-coaster",
    name: "Spider Emblem Coaster",
    category: "Object",
    weightInGrams: 90,
    materialType: "PETG",
    material: "PETG",
    finish: "Matte black",
    dimensionsMm: { width: 90, depth: 45, height: 10 },
    description: "A pair of square coasters, each stamped with a raised eight-legged emblem.",
    story: "Sold as a matched pair — the same emblem mould run twice, so the two tiles sit flush side by side or split across two drinks.",
    imageId: "spider-emblem-coaster",
    availability: "available",
    creator: "Studio Ronin",
  },
  {
    slug: "rayquaza-figurine",
    name: "Rayquaza Figurine",
    category: "Figure",
    weightInGrams: 25,
    materialType: "Exotic",
    material: "Resin",
    finish: "Smooth, gunmetal black",
    dimensionsMm: { width: 90, depth: 90, height: 140 },
    description: "A coiled Rayquaza figurine, cast mid-strike on a display base.",
    story: "The most detailed sculpt in the collection — resin-printed at a slow layer height, thin-walled and hollow, to keep every scale and claw crisp. Produced in small batches.",
    imageId: "rayquaza-figurine",
    availability: "limited",
    creator: "Lumen Forge",
  },
  {
    slug: "hexapod-mug-stand",
    name: "Hexapod Mug Stand",
    category: "Object",
    weightInGrams: 150,
    materialType: "PETG",
    material: "PETG",
    finish: "Matte black",
    dimensionsMm: { width: 150, depth: 150, height: 70 },
    description: "A six-legged mechanical stand lifting a branded landing-pad platform sized to hold a mug.",
    story: "Each leg is printed as a single interlocking joint — no pins, no glue — so the stand flexes slightly under load instead of cracking.",
    imageId: "hexapod-mug-stand",
    availability: "available",
    creator: "Vantage Collective",
  },
  {
    slug: "scraper",
    name: "Scraper",
    category: "Tool",
    weightInGrams: 35,
    materialType: "PLA",
    material: "PLA",
    finish: "Matte black",
    dimensionsMm: { width: 60, depth: 6, height: 140 },
    description: "A flat-bladed scraper with an angled edge and a cutout handle — for labels, ice, or dried paint.",
    story: "One continuous silhouette, no assembly — the cutout handle is sized for a firm grip without sliding.",
    imageId: "scraper",
    availability: "available",
    creator: "Studio Quiet",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

/**
 * The selling price for a catalog product, computed fresh from its weight
 * and material every call — see lib/pricing.ts. Never read/store a price
 * anywhere else in the catalog layer.
 */
export function getProductPrice(product: Pick<Product, "weightInGrams" | "materialType">) {
  return calculateProductPrice(product.weightInGrams, product.materialType);
}

export const FOOTER_LINKS = {
  Collection: [
    { label: "All pieces", href: "/designs" },
    { label: "Track order", href: "/track" },
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
