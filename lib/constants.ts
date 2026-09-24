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
  price: number;
  /** Print material, shown as a spec — not a selectable, price-affecting variant. */
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
 * The complete catalog — exactly eight pieces, each photographed and priced
 * individually. This is a curated collection, not a marketplace: there is no
 * size/material/color configurator, no dynamic pricing engine and no
 * user-submitted models. Add a ninth piece by adding a ninth entry here and
 * its photo at public/media/products/<slug>.jpg — nothing else to touch.
 */
export const PRODUCTS: Product[] = [
  {
    slug: "kunai",
    name: "Kunai",
    category: "Prop",
    price: 1450,
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
    price: 2800,
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
    price: 950,
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
    price: 1950,
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
    price: 2200,
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
    price: 1100,
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
    price: 750,
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
    price: 650,
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
    price: 2400,
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
    price: 2600,
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
    price: 1350,
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
    price: 850,
    material: "PETG",
    finish: "Matte black",
    dimensionsMm: { width: 150, depth: 150, height: 40 },
    description: "A knotwork medallion at the base, ringed by the same coiled tentacles as the rest of the collection.",
    story: "PETG for better heat resistance than the rest of the catalog — the one piece here that's meant to take real warmth.",
    imageId: "ashtray",
    availability: "available",
    creator: "FORMA Studio",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
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
