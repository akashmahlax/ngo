import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    userId: string
    role: "volunteer" | "ngo"
    plan: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus"
    planExpiresAt: string | null
    profileComplete: boolean
    user: {
      name: string | null
      email: string | null
      image: string | null
      avatarUrl?: string | null
    }
  }
}