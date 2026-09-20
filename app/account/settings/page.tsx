import { requireUser } from "@/lib/requireUser";
import { db } from "@/lib/db";
import AccountNav from "@/components/account/AccountNav";
import AccountVerificationSection from "@/components/account/AccountVerificationSection";
import AppearanceSettings from "@/components/account/AppearanceSettings";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import NotificationSettings from "@/components/account/NotificationSettings";
import DangerZone from "@/components/account/DangerZone";
import { CheckCircle2 } from "lucide-react";

export default async function SettingsPage() {
  const user = await requireUser("/account/settings");
  const [dbUser, googleAccount] = await Promise.all([
    db.user.findUnique({ where: { id: user.id } }),
    db.account.findFirst({ where: { userId: user.id, provider: "google" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 md:py-14">
      <h1 className="text-display text-2xl text-text md:text-3xl">Settings</h1>
      <div className="mt-8">
        <AccountNav />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-text">Account</h2>
        <div className="mt-3">
          <AccountVerificationSection
            email={dbUser?.email ?? ""}
            emailVerified={!!dbUser?.emailVerified}
            phone={dbUser?.phone ?? null}
          />
        </div>
        <p className="mt-2 text-xs text-text-faint">Edit your name and phone from the Profile tab.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-text">Appearance</h2>
        <div className="mt-3">
          <AppearanceSettings />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-text">Notifications</h2>
        <div className="mt-3 rounded-xl border border-border bg-surface px-5">
          <NotificationSettings />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-text">Security</h2>
        <div className="mt-3 flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
          <ChangePasswordForm hasPassword={!!dbUser?.passwordHash} />
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-text">Connected Google account</span>
            {googleAccount ? (
              <span className="flex items-center gap-1.5 text-sm text-success">
                <CheckCircle2 size={14} />
                Connected
              </span>
            ) : (
              <span className="text-sm text-text-faint">Not connected</span>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-text">Danger Zone</h2>
        <div className="mt-3">
          <DangerZone />
        </div>
      </section>
    </div>
  );
}
