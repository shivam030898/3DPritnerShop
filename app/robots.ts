import type { MetadataRoute } from "next";

const SITE_URL = "https://forma.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/checkout", "/orders", "/login"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
