import { PrismaClient } from "@/lib/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;

  // The singleton above is cached on `globalThis` so Next.js's dev-mode hot
  // reload doesn't exhaust SQLite connections by constructing a new client
  // on every module re-evaluation. That cache has one blind spot: if the
  // schema changes and `prisma generate` reruns while this process is still
  // alive, the cached instance still points at the *old* PrismaClient class
  // and won't expose newly added models — `db.someNewModel` is `undefined`
  // even though the schema/migration/generated code on disk are all correct.
  // This check fails loudly instead of surfacing as a cryptic crash deep in
  // unrelated code the next time a route touches the missing model.
  const expectedDelegates = [
    "user", "account", "session", "design", "cartItem",
    "savedProduct", "address", "order", "orderStatusHistory", "notification",
  ] as const;
  const missing = expectedDelegates.filter((name) => typeof (db as unknown as Record<string, unknown>)[name] !== "object");
  if (missing.length > 0) {
    console.warn(
      `[prisma] Stale client detected — db.${missing.join(", db.")} ${missing.length > 1 ? "are" : "is"} undefined. ` +
        "The schema changed after this dev server started. Restart `next dev` to pick up the regenerated Prisma Client."
    );
  }
}
