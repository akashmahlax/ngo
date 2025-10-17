import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/db"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { compare } from "bcryptjs"

type AppUser = {
  _id: string
  name?: string | null
  email?: string | null
  passwordHash?: string | null
  role?: "volunteer" | "ngo"
  plan?: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus"
  planExpiresAt?: Date | null
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        try {
          const schema = z.object({ email: z.string().email(), password: z.string().min(6) })
          const parsed = schema.safeParse(raw)
          if (!parsed.success) return null

          await client.connect()
          const db = client.db()
          const users = db.collection<AppUser>("users")
          const user = await users.findOne({ email: parsed.data.email })
          if (!user || !user.passwordHash) return null
          
          const ok = await compare(parsed.data.password, user.passwordHash)
          if (!ok) return null

          return {
            id: user._id.toString(),
            name: user.name ?? null,
            email: user.email ?? null,
            role: user.role ?? "volunteer",
            plan: user.plan ?? "volunteer_free",
            planExpiresAt: user.planExpiresAt?.toISOString() ?? null,
          } as any
        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth users
      if (account?.provider === "google" && user.email) {
        try {
          await client.connect()
          const db = client.db()
          const users = db.collection("users")
          
          // Check if user exists (could be from credentials signup)
          const existingUser = await users.findOne({ email: user.email })
          
          if (!existingUser) {
            // Create new user for Google OAuth without role/plan
            const now = new Date()
            await users.insertOne({
              name: user.name,
              email: user.email,
              role: null, // Will be set in complete-profile page
              plan: null,
              createdAt: now,
              updatedAt: now,
            })
          } else {
            // Update existing user with Google OAuth info if needed
            await users.updateOne(
              { email: user.email },
              { 
                $set: { 
                  name: user.name,
                  updatedAt: new Date() 
                } 
              }
            )
          }
          
          return true
        } catch (error) {
          console.error("Error handling Google OAuth:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Merge custom fields when logging in
        const u = user as any
        token.userId = u.id
        if (u.role) token.role = u.role
        if (u.plan) token.plan = u.plan
        if (u.planExpiresAt) token.planExpiresAt = u.planExpiresAt
      }

      // Ensure token has latest DB values
      if (!token.email) return token
      try {
        await client.connect()
        const db = client.db()
        const users = db.collection<AppUser>("users")
        const dbUser = await users.findOne({ email: token.email as string })
        if (dbUser) {
          token.userId = dbUser._id.toString()
          token.role = dbUser.role ?? token.role
          token.plan = dbUser.plan ?? token.plan
          token.planExpiresAt = dbUser.planExpiresAt?.toISOString() ?? token.planExpiresAt
          // If user doesn't have a role, mark them as incomplete
          token.profileComplete = !!dbUser.role
        }
      } catch {}

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session as any).userId = token.userId
        ;(session as any).role = token.role
        ;(session as any).plan = token.plan
        ;(session as any).planExpiresAt = token.planExpiresAt
        ;(session as any).profileComplete = token.profileComplete
      }
      return session
    },
  },
})