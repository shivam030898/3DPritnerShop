import { requireUser } from "@/lib/requireUser";
import { getSavedSlugs } from "@/lib/actions/savedProducts";
import { PRODUCTS } from "@/lib/constants";
import AccountNav from "@/components/account/AccountNav";
import ProductCard from "@/components/designs/ProductCard";
import Button from "@/components/ui/Button";

export default async function SavedProductsPage() {
  await requireUser("/account/saved");
  const savedSlugs = await getSavedSlugs();
  const products = PRODUCTS.filter((p) => savedSlugs.includes(p.slug));

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
      <h1 className="text-display text-2xl text-text md:text-3xl">Saved Designs</h1>
      <div className="mt-8">
        <AccountNav />
      </div>

      {products.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border-strong p-10 text-center">
          <p className="text-sm text-text-dim">
            You haven&apos;t saved any designs yet. Tap the heart on any product to bookmark it.
          </p>
          <div className="mt-4 flex justify-center">
            <Button as="link" href="/designs" size="sm">
              Browse designs
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} saved />
          ))}
        </div>
      )}
    </div>
  );
}
