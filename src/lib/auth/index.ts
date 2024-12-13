import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { getUserById, deleteUserById, updateUserRole } from "@/lib/auth/db/user";
import { db } from "@/lib/db";
import { env } from "@/../.env.mjs";

// Define admin and allowed email groups
const ADMIN_EMAILS = ["benny.tenezeu@2027.icam.fr"];
const ALLOWED_EMAILS = ["hye@domain.com", ...ADMIN_EMAILS];

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
    error: "/error",
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const existingUser = await getUserById(user.id || "");

      // If the user is an admin email
      if (ADMIN_EMAILS.includes(user.email)) {
        if (existingUser) {
          // Update role to ADMIN if not already
          if (existingUser.role !== UserRole.ADMIN) {
            await updateUserRole(existingUser.id, UserRole.ADMIN);
          }
        } else {
          // Create a new user with ADMIN role
          await db.user.create({
            data: {
              id: user.id,
              email: user.email,
              name: user.name || null,
              image: user.image || null,
              role: UserRole.ADMIN,
            },
          });
        }
        return true;
      }

      // If the user is in allowed emails but not admin
      if (ALLOWED_EMAILS.includes(user.email)  || user.email?.includes("2027.icam.fr") ) {
        if (existingUser) {
          // Update role to JURY if not already
          if (existingUser.role !== UserRole.JURY) {
            await updateUserRole(existingUser.id, UserRole.JURY);
          }
        } else {
          // Create a new user with JURY role
          await db.user.create({
            data: {
              id: user.id,
              email: user.email,
              name: user.name || null,
              image: user.image || null,
              role: UserRole.JURY,
            },
          });
        }
        return true;
      }

      // If the user exists in DB but has no valid role, delete them
      if (existingUser) {
        await deleteUserById(existingUser.id);
      }

      // Deny access
      return false;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      token.createdAt = existingUser.createdAt;

      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }

        if (token.role && session.user) {
          session.user.role = token.role as UserRole;
        }

        if (token.createdAt && session.user) {
          session.user.createdAt = token.createdAt as Date;
        }
      }

      return session;
    },
  },
});


export async function getSessionOrThrow(message?: string) {
  const session = await auth()

  if (!session) {
    throw new Error(message || "Unauthorized")
  }

  return session
}

export async function getIsAdmin(message?: string) {
  const session = await auth()

  if (!session) {
    throw new Error(message || "Unauthorized")
  }

  return session.user.role === "ADMIN"
}
