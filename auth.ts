import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/db"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Apple from "next-auth/providers/apple"
import Twitter from "next-auth/providers/twitter"
import GitHub from "next-auth/providers/github"
import LinkedIn from "next-auth/providers/linkedin"
import Instagram from "next-auth/providers/instagram"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { compare } from "bcryptjs"
import type { Adapter } from "next-auth/adapters"

type AppUser = {
  _id: string
  name?: string | null
  email?: string | null
  passwordHash?: string | null
  role?: "volunteer" | "ngo"
  plan?: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus"
  planExpiresAt?: Date | null
  emailVerified?: Date | null
  image?: string | null
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client) as Adapter,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
    verifyRequest: "/signin",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true, // Link accounts with same email
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID!,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Instagram({
      clientId: process.env.AUTH_INSTAGRAM_ID!,
      clientSecret: process.env.AUTH_INSTAGRAM_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID!,
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID!,
      clientSecret: process.env.AUTH_APPLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
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
          }
        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle OAuth providers (Google, GitHub, Facebook, LinkedIn, Twitter, Apple)
      if (account?.provider !== "credentials" && user.email) {
        try {
          await client.connect()
          const db = client.db()
          const users = db.collection("users")
          
          // Check if user exists
          const existingUser = await users.findOne({ email: user.email })
          
          if (!existingUser) {
            // Create new user for OAuth - NO role/plan yet, must complete profile
            const now = new Date()
            await users.insertOne({
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: now, // OAuth users are email verified
              role: null, // Will be set in complete-profile page
              plan: null,
              passwordHash: null, // OAuth users don't have passwords initially
              createdAt: now,
              updatedAt: now,
            })
          } else {
            // Update existing user with latest OAuth info
            await users.updateOne(
              { email: user.email },
              { 
                $set: { 
                  name: user.name || existingUser.name,
                  image: user.image || existingUser.image,
                  emailVerified: existingUser.emailVerified || new Date(),
                  updatedAt: new Date() 
                } 
              }
            )
          }
          
          return true
        } catch (error) {
          console.error(`Error handling ${account?.provider || 'OAuth'} sign in:`, error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      // On sign in, merge user data
      if (user) {
        const u = user as AppUser
        token.userId = u._id
        if (u.role) token.role = u.role
        if (u.plan) token.plan = u.plan
        if (u.planExpiresAt) token.planExpiresAt = u.planExpiresAt.toISOString()
      }

      // Refresh token data from DB to ensure consistency
      if (!token.email) return token
      
      try {
        await client.connect()
        const db = client.db()
        const users = db.collection<AppUser>("users")
        const dbUser = await users.findOne({ email: token.email as string })
        
        // If user no longer exists, invalidate session
        if (!dbUser) {
          console.log("User not found in database, invalidating session:", token.email)
          return {} as typeof token
        }
        
        // Update token with latest DB values
        token.userId = dbUser._id.toString()
        token.role = dbUser.role ?? token.role
        token.profileComplete = !!dbUser.role // Profile is complete if role is set
        
        const extendedUser = dbUser as AppUser & { avatarUrl?: string; coverPhotoUrl?: string }
        token.avatarUrl = extendedUser.avatarUrl ?? token.avatarUrl
        token.coverPhotoUrl = extendedUser.coverPhotoUrl ?? token.coverPhotoUrl
        token.emailVerified = dbUser.emailVerified ? dbUser.emailVerified.toISOString() : null
        
        // Handle plan expiration
        let currentPlan = dbUser.plan ?? token.plan
        if (dbUser.planExpiresAt && new Date() > new Date(dbUser.planExpiresAt)) {
          // Plan expired - downgrade to free tier
          const freePlan = dbUser.role === "volunteer" ? "volunteer_free" : "ngo_base"
          await users.updateOne(
            { _id: dbUser._id },
            { 
              $set: { 
                plan: freePlan,
                planExpiresAt: null,
                updatedAt: new Date()
              } 
            }
          )
          currentPlan = freePlan
        }
        
        token.plan = currentPlan
        token.planExpiresAt = dbUser.planExpiresAt?.toISOString() ?? token.planExpiresAt
      } catch (error) {
        console.error("Error refreshing token:", error)
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const extendedSession = session as typeof session & {
          userId: string
          role?: "volunteer" | "ngo"
          plan?: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus"
          planExpiresAt?: string | null
          profileComplete: boolean
        }
        
        extendedSession.userId = token.userId as string
        extendedSession.role = token.role as "volunteer" | "ngo"
        extendedSession.plan = token.plan as "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus"
        extendedSession.planExpiresAt = token.planExpiresAt as string | null
        extendedSession.profileComplete = token.profileComplete as boolean
        
        // Add avatarUrl and coverPhotoUrl to session
        if (token.avatarUrl) {
          session.user.image = token.avatarUrl as string
          const extendedUser = session.user as typeof session.user & { avatarUrl?: string }
          extendedUser.avatarUrl = token.avatarUrl as string
        }
        if (token.coverPhotoUrl) {
          const extendedUser = session.user as typeof session.user & { coverPhotoUrl?: string }
          extendedUser.coverPhotoUrl = token.coverPhotoUrl as string
        }
      }
      return session
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`)
    },
  },
  debug: process.env.NODE_ENV === "development",
})