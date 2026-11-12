import Hero from "@/components/home/Hero";
import Collection from "@/components/home/Collection";
import FeaturedPiece from "@/components/home/FeaturedPiece";
import CustomPrintCTA from "@/components/home/CustomPrintCTA";

// Hero → collection → featured piece → Printables request.
//
// Hero and Collection share one wrapper on purpose: the hero is
// `position: sticky` inside it, so the collection "sheet" scrolls up over
// the printer footage, and the hero is released again once the wrapper
// ends (by which point the sheet has fully covered it). The -mt-16 cancels
// the layout's navbar offset so the footage bleeds up behind the navbar.
//
// The full searchable grid still lives at /designs; this page's Collection
// reads the same PRODUCTS list, so the two never drift apart.
export default function Home() {
  return (
    <>
      <div className="relative -mt-16">
        <Hero />
        <Collection />
      </div>
      <FeaturedPiece />
      <CustomPrintCTA />
    </>
  );
}
