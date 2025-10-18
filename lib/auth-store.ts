/**
 * Global authentication and user state store using Zustand
 * Single source of truth for:
 * - User role (volunteer/ngo)
 * - Subscription plan
 * - Plan expiry
 * - Profile completion status
 * - User metadata
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "volunteer" | "ngo"
export type UserPlan =
  | "volunteer_free"
  | "volunteer_plus"
  | "ngo_base"
  | "ngo_plus"

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: UserRole | null
  plan: UserPlan | null
  planExpiresAt: Date | null
  profileComplete: boolean
  avatarUrl?: string
}

export interface AuthStore {
  // State
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  setUser: (user: AuthUser | null) => void
  updateUser: (updates: Partial<AuthUser>) => void
  setLoading: (loading: boolean) => void
  logout: () => void

  // Computed values
  isPlus: () => boolean
  canApply: () => boolean
  canPostJob: () => boolean
  isPlanExpired: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      updateUser: (updates) =>
        set((state) => {
          if (!state.user) return state
          return {
            user: { ...state.user, ...updates },
          }
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      // Check if user has plus plan
      isPlus: () => {
        const { user } = get()
        return (
          !!user &&
          (user.plan === "volunteer_plus" || user.plan === "ngo_plus")
        )
      },

      // Volunteers: Check if can apply (1 free/month on free plan)
      canApply: () => {
        const { user } = get()
        if (!user || user.role !== "volunteer") return false
        if (user.plan === "volunteer_plus") return true
        // Free plan users need to check quota via API
        return true // Preliminary check; actual limit enforced on server
      },

      // NGOs: Check if can post job (3 free/month on free plan)
      canPostJob: () => {
        const { user } = get()
        if (!user || user.role !== "ngo") return false
        if (user.plan === "ngo_plus") return true
        // Free plan users need to check quota via API
        return true // Preliminary check; actual limit enforced on server
      },

      // Check if subscription has expired
      isPlanExpired: () => {
        const { user } = get()
        if (!user || !user.planExpiresAt) return false
        return new Date() > new Date(user.planExpiresAt)
      },
    }),
    {
      name: "auth-store", // localStorage key
      partialize: (state) => ({
        // Only persist user data, not loading state
        user: state.user,
      }),
    }
  )
)

/**
 * Sync store with NextAuth session
 * Call this in layout or auth wrapper component
 */
export function syncAuthStore(
  session: { user?: Record<string, unknown>; role?: string; plan?: string; userId?: string; planExpiresAt?: string; profileComplete?: boolean } | null
) {
  if (session?.user) {
    const sessionData = session as Record<string, unknown>
    useAuthStore.setState({
      user: {
        id: (sessionData.userId as string) || (session.user.id as string) || "",
        email: (session.user.email as string) || "",
        name: session.user.name as string | undefined,
        role: (sessionData.role as UserRole) || null,
        plan: (sessionData.plan as UserPlan) || null,
        planExpiresAt: sessionData.planExpiresAt
          ? new Date(sessionData.planExpiresAt as string)
          : null,
        profileComplete: (sessionData.profileComplete as boolean) ?? false,
        avatarUrl:
          (session.user.image as string) ||
          (session.user.avatarUrl as string),
      },
      isAuthenticated: true,
    })
  } else {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    })
  }
}
