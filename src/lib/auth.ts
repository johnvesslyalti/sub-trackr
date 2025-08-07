// src/lib/auth.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";

export const {
  handlers, // GET/POST handlers for route.ts
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Update image if not already set
      if (!user.image && session.user.image) {
        await db.user.update({
          where: { id: user.id },
          data: { image: session.user.image },
        });
      }

      session.user.id = user.id;
      session.user.name = user.name ?? null;
      session.user.email = user.email ?? null;
      session.user.image = user.image ?? null;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
