import { requireUser } from "@/lib/requireUser";
import { getUserAddresses } from "@/lib/actions/addresses";
import AccountNav from "@/components/account/AccountNav";
import AddressManager from "@/components/account/AddressManager";

export default async function AccountAddressesPage() {
  await requireUser("/account/addresses");
  const addresses = await getUserAddresses();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
      <h1 className="text-display text-2xl text-text md:text-3xl">Addresses</h1>
      <div className="mt-8">
        <AccountNav />
      </div>
      <AddressManager addresses={addresses} />
    </div>
  );
}
