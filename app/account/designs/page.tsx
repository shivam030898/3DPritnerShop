import { requireUser } from "@/lib/requireUser";
import { getUserDesigns } from "@/lib/actions/designs";
import AccountNav from "@/components/account/AccountNav";
import SavedDesignCard from "@/components/account/SavedDesignCard";
import Button from "@/components/ui/Button";

export default async function AccountDesignsPage() {
  await requireUser("/account/designs");
  const designs = await getUserDesigns();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
      <div className="flex items-center justify-between">
        <h1 className="text-display text-2xl text-text md:text-3xl">My Designs</h1>
        <Button as="link" href="/upload" size="sm" className="hidden sm:inline-flex">
          Upload new
        </Button>
      </div>
      <div className="mt-8">
        <AccountNav />
      </div>

      {designs.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border-strong p-10 text-center">
          <p className="text-sm text-text-dim">
            You haven&apos;t uploaded any designs yet. They&apos;ll show up here after your first order.
          </p>
          <div className="mt-4 flex justify-center">
            <Button as="link" href="/upload" size="sm">
              Upload a design
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <SavedDesignCard key={design.id} design={design} />
          ))}
        </div>
      )}
    </div>
  );
}
