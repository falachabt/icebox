import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"
import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { getUserById, deleteUserById, updateUserRole } from "@/lib/auth/db/user"
import { db } from "@/lib/db"
import { env } from "@/../.env.mjs"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
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
      if (!user.email) return false

      const existingUser = await getUserById(user.id || "")

      // Check if email is in AllowedEmails
      const allowedEmail = await db.allowedEmails.findFirst({
        where: {
          email: user.email,
        },
        select: {
          email: true,
          role: true,
        },
      })

      console.log("sa sa sa", allowedEmail)

      // Allow ICAM emails as JURY if not in AllowedEmails
      if (!allowedEmail && !user.email?.includes("2027.icam.fr")) {
        if (existingUser) {
          await deleteUserById(existingUser.id)
        }
        return false
      }

      const role = allowedEmail?.role || UserRole.JURY

      if (existingUser) {
        // Update role if it has changed
        if (existingUser.role !== role) {
          await updateUserRole(existingUser.id, role)
        }
      }

      return true
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      token.role = existingUser.role
      token.createdAt = existingUser.createdAt

      return token
    },
    async session({ session, token }) {
      if (token) {
        if (token.sub && session.user) {
          session.user.id = token.sub
        }

        if (token.role && session.user) {
          session.user.role = token.role as UserRole
        }

        if (token.createdAt && session.user) {
          session.user.createdAt = token.createdAt as Date
        }
      }

      return session
    },
  },
})

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