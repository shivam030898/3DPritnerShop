import { CheckCircle2 } from "lucide-react";

export default function AccountVerificationSection({
  email,
  phone,
}: {
  email: string;
  phone: string | null;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-sm font-medium text-text">Account verification</p>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div>
          <p className="text-text-faint">Email</p>
          <p className="text-text">{email}</p>
        </div>
        <span className="flex items-center gap-1.5 text-success">
          <CheckCircle2 size={14} />
          Verified
        </span>
      </div>

      {phone && (
        <div className="mt-4 border-t border-border pt-4 text-sm">
          <p className="text-text-faint">Mobile</p>
          <p className="text-text">{phone}</p>
        </div>
      )}
    </div>
  );
}
