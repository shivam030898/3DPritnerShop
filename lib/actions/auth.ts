"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sendEmailVerificationToken } from "@/lib/actions/verification";

export type SignUpResult = { ok: true; devVerifyLink?: string } | { ok: false; error: string };

export async function signUpWithPassword(
  name: string,
  email: string,
  password: string
): Promise<SignUpResult> {
  if (!name || !email || !password) {
    return { ok: false, error: "All fields are required." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  // emailVerified stays null — credentials signups are only verified by
  // clicking the link, never just by entering an address in a form.
  await db.user.create({ data: { name, email, passwordHash } });

  const sent = await sendEmailVerificationToken(email);
  return { ok: true, devVerifyLink: sent.ok ? sent.devLink : undefined };
}

export type ChangeEmailResult = { ok: true; devVerifyLink?: string } | { ok: false; error: string };

/** Changing the email always drops verification on the new address — it can never inherit the old one's verified status. */
export async function changeEmail(newEmail: string): Promise<ChangeEmailResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in." };

  const trimmed = newEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const existing = await db.user.findUnique({ where: { email: trimmed } });
  if (existing && existing.id !== session.user.id) {
    return { ok: false, error: "That email is already in use by another account." };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { email: trimmed, emailVerified: null },
  });

  const sent = await sendEmailVerificationToken(trimmed);
  return { ok: true, devVerifyLink: sent.ok ? sent.devLink : undefined };
}

export type ChangePasswordResult = { ok: true } | { ok: false; error: string };

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in." };
  if (newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { ok: false, error: "Account not found." };

  if (user.passwordHash) {
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return { ok: false, error: "Current password is incorrect." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { ok: true };
}
