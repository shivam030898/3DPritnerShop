import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/constants";

const SITE_URL = "https://forma.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/upload", "/designs", "/materials", "/support", "/track"];

  const productRoutes = PRODUCTS.map((p) => `/designs/${p.slug}`);

  return [...staticRoutes, ...productRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.6,
  }));
}
