import DesignsPage from "@/app/designs/page";
import FeaturedPiece from "@/components/home/FeaturedPiece";
import CustomPrintCTA from "@/components/home/CustomPrintCTA";

// The homepage IS the collection now — no hero/marketing sections in front
// of it. Reusing the /designs page component (rather than duplicating its
// grid/search logic) keeps this in sync with the "real" collection route
// for free; DesignsPage reads the URL's own search params via
// useSearchParams, so it works identically whether it's rendered here or
// at /designs. FeaturedPiece (the spinning-shuriken spotlight) and
// CustomPrintCTA (Printables link-out, for anyone who doesn't want any of
// the catalog pieces) are kept below the grid. The Collection-preview/
// About/FinalCta components this used to render are left in
// components/home/ (unused, not deleted) in case any of that content
// comes back later.
export default function Home() {
  return (
    <>
      <DesignsPage />
      <FeaturedPiece />
      <CustomPrintCTA />
    </>
  );
}
