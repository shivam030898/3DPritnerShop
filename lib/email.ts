const APP_URL = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "http://localhost:3000";

export function verificationEmailUrl(token: string) {
  return `${APP_URL}/verify-email?token=${token}`;
}

/**
 * Delivers the verification link. No email provider is configured in this
 * project yet — plug one in here (Resend, SES, SMTP, …) when one is
 * available. Until then, in non-production environments only, the link is
 * returned to the caller so the UI can surface it directly (never logged —
 * a console log would persist in shell history/log aggregation the same
 * way a leaked secret would).
 */
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<{ devLink?: string }> {
  const url = verificationEmailUrl(token);

  // TODO: wire a real provider, e.g.:
  // await resend.emails.send({ to: email, subject: "Verify your email", html: `<a href="${url}">Verify email</a>` });
  void email;

  if (process.env.NODE_ENV !== "production") {
    return { devLink: url };
  }
  return {};
}
