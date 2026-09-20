import { requireUser } from "@/lib/requireUser";
import { getUserOrders } from "@/lib/actions/orders";
import AccountNav from "@/components/account/AccountNav";
import OrderCard from "@/components/orders/OrderCard";

export default async function AccountOrdersPage() {
  await requireUser("/account/orders");
  const orders = await getUserOrders();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
      <h1 className="text-display text-2xl text-text md:text-3xl">Orders</h1>
      <div className="mt-8">
        <AccountNav />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {orders.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-faint">No orders yet.</p>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
