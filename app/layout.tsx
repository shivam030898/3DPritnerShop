import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import CartProvider from "@/components/providers/CartProvider";
import AccountSetupGate from "@/components/account/AccountSetupGate";
import Navbar from "@/components/navigation/Navbar";
import MobileTabBar from "@/components/navigation/MobileTabBar";
import Footer from "@/components/footer/Footer";
import Toaster from "@/components/ui/Toaster";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL = "https://forma.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FORMA — Your design. Made real.",
    template: "%s | FORMA",
  },
  description:
    "Upload a 3D model and FORMA prints, finishes and delivers it to your door. Or browse ready-made designs from independent creators.",
  keywords: [
    "3D printing service",
    "upload 3D model to print",
    "on-demand 3D printing",
    "custom 3D print",
    "3D printed figurines",
    "3D printing marketplace",
  ],
  authors: [{ name: "FORMA" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "FORMA — Your design. Made real.",
    description:
      "Upload a 3D model and FORMA prints, finishes and delivers it to your door.",
    siteName: "FORMA",
    images: [{ url: "/images/og-cover.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FORMA — Your design. Made real.",
    description: "Upload a 3D model and we'll print, finish and deliver it.",
    images: ["/images/og-cover.jpg"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "FORMA",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo-v3.png`,
    },
    {
      "@type": "Service",
      name: "FORMA on-demand 3D printing",
      description:
        "Upload a 3D model for custom printing, or order ready-made designs from a curated marketplace.",
      provider: { "@type": "Organization", name: "FORMA" },
      areaServed: "IN",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <SessionProvider>
            <CartProvider />
            <AccountSetupGate />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileTabBar />
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
