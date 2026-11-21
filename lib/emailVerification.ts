/**
 * A Google sign-in counts as a verified email: Google already confirmed the
 * address. auth.ts stamps `emailVerified` on every Google sign-in, but users
 * created before that fix can still be on a live JWT session (30 days) with
 * the column empty — the linked Google account covers them until they next
 * sign in.
 *
 * Spread `emailVerificationSelect` into a `db.user` select, then pass the row
 * to `hasVerifiedEmail`.
 */
export const emailVerificationSelect = {
  emailVerified: true,
  accounts: { where: { provider: "google" }, select: { id: true }, take: 1 },
} as const;

export function hasVerifiedEmail(user: {
  emailVerified: Date | null;
  accounts: { id: string }[];
}): boolean {
  return !!user.emailVerified || user.accounts.length > 0;
}
