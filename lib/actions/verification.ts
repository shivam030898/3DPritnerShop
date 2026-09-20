"use server";

import crypto from "crypto";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

const EMAIL_TOKEN_TTL_MS = 30 * 60 * 1000;
const EMAIL_RESEND_COOLDOWN_S = 60;

export type SendEmailVerificationResult =
  | { ok: true; devLink?: string }
  | { ok: false; error: string; retryAfterSeconds?: number };

/**
 * Issues a fresh email-verification token and "sends" it, invalidating any
 * outstanding token for that address first. Used both right after
 * email/password signup and for the Settings/Checkout "Resend" action.
 */
export async function sendEmailVerificationToken(email: string): Promise<SendEmailVerificationResult> {
  const recent = await db.verificationToken.findFirst({
    where: { identifier: email },
    orderBy: { createdAt: "desc" },
  });
  if (recent) {
    const elapsedS = (Date.now() - recent.createdAt.getTime()) / 1000;
    if (elapsedS < EMAIL_RESEND_COOLDOWN_S) {
      return {
        ok: false,
        error: "Please wait before requesting another email.",
        retryAfterSeconds: Math.ceil(EMAIL_RESEND_COOLDOWN_S - elapsedS),
      };
    }
  }

  // A new token invalidates any previous one for this address.
  await db.verificationToken.deleteMany({ where: { identifier: email } });

  const token = crypto.randomBytes(32).toString("hex");
  await db.verificationToken.create({
    data: { identifier: email, token, expires: new Date(Date.now() + EMAIL_TOKEN_TTL_MS) },
  });

  const { devLink } = await sendVerificationEmail(email, token);
  return { ok: true, devLink };
}

/** For the currently signed-in user — the "Resend verification email" button. */
export async function resendEmailVerification(): Promise<SendEmailVerificationResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in." };

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user?.email) return { ok: false, error: "No email on file." };
  if (user.emailVerified) return { ok: false, error: "Your email is already verified." };

  return sendEmailVerificationToken(user.email);
}

export type VerifyEmailResult = { ok: true } | { ok: false; error: string };

/** Called from /verify-email?token=... — deliberately requires no session, since the link may be opened in a different browser. */
export async function verifyEmailToken(token: string): Promise<VerifyEmailResult> {
  if (!token) return { ok: false, error: "Missing verification token." };

  const record = await db.verificationToken.findUnique({ where: { token } });
  if (!record) {
    return { ok: false, error: "This verification link is invalid or has already been used." };
  }

  if (record.expires < new Date()) {
    await db.verificationToken.delete({ where: { token } }).catch(() => {});
    return { ok: false, error: "This verification link has expired. Request a new one." };
  }

  try {
    await db.$transaction([
      db.user.updateMany({ where: { email: record.identifier }, data: { emailVerified: new Date() } }),
      db.verificationToken.delete({ where: { token } }),
    ]);
    return { ok: true };
  } catch (err) {
    console.error("[verify-email] failed to verify token:", err);
    return { ok: false, error: "Something went wrong verifying your email. Please try again." };
  }
}
