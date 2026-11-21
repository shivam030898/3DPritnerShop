import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Prisma's generated runtime does dynamic `fs` lookups, so the file tracer
  // gives up and copies the whole project into every server function —
  // including ~220 MB of video in public/ and Media/. That pushed each
  // function past Vercel's 250 MB limit. Nothing server-side reads these
  // folders (public/ is served from the CDN), so keep them out of the bundles.
  outputFileTracingExcludes: {
    "/*": ["./public/**/*", "./Media/**/*"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
