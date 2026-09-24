import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/requireUser";
import { db } from "@/lib/db";
import { getProfileStats } from "@/lib/actions/profile";
import { getUserOrders } from "@/lib/actions/orders";
import AccountNav from "@/components/account/AccountNav";
import ProfileHeader from "@/components/account/ProfileHeader";
import StatTiles from "@/components/account/StatTiles";
import OrderCard from "@/components/orders/OrderCard";
import Button from "@/components/ui/Button";

export default async function AccountPage() {
  const user = await requireUser("/account");
  const [dbUser, stats, orders] = await Promise.all([
    db.user.findUnique({ where: { id: user.id } }),
    getProfileStats(),
    getUserOrders(),
  ]);

  if (!dbUser) return null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
      <h1 className="text-display text-2xl text-text md:text-3xl">My Profile</h1>

      <div className="mt-8">
        <AccountNav />
      </div>

      <div className="mt-8">
        <ProfileHeader
          name={dbUser.name ?? "Unnamed"}
          email={dbUser.email ?? ""}
          emailVerified={!!dbUser.emailVerified}
          phone={dbUser.phone}
          image={dbUser.image}
          createdAt={dbUser.createdAt}
        />
      </div>

      {stats && (
        <div className="mt-6">
          <StatTiles stats={stats} />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-sm font-medium text-text">Recent orders</h2>
        <Link
          href="/account/orders"
          className="flex items-center gap-1 text-sm text-text-dim hover:text-text"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {orders.length === 0 ? (
          <p className="py-6 text-sm text-text-faint">No orders yet.</p>
        ) : (
          orders.slice(0, 2).map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-border-strong p-6 text-center">
        <p className="text-sm text-text-dim">Looking for something new?</p>
        <div className="mt-3 flex justify-center">
          <Button as="link" href="/designs" size="sm">
            View the collection
          </Button>
        </div>
      </div>
    </div>
  );
}
