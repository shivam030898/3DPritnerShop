import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Google's own `email_verified` claim is a real verification signal —
      // carry it straight into our emailVerified column so a Google user is
      // never asked to re-verify an address the provider already confirmed.
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Self-healing backfill: an account created before the Google profile
      // mapping above existed (or any other pre-existing row) still gets
      // credit for Google's verified-email claim on its very next sign-in,
      // without a one-off migration script.
      if (account?.provider === "google" && profile?.email_verified && user?.id) {
        const existing = await db.user.findUnique({ where: { id: user.id }, select: { emailVerified: true } });
        if (existing && !existing.emailVerified) {
          await db.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
