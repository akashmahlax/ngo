# NGO Volunteer Platform - Architecture Audit Report

## Executive Summary

Your web platform has a **solid foundation** with NextAuth, MongoDB, and Razorpay integration. However, there are **critical architectural duplicates and inefficiencies** that need immediate attention. Below is a comprehensive analysis and action plan.

---

## 1. CURRENT STATE ANALYSIS

### Authentication Flow ✅
- **Providers**: Credentials (email/password) + Google OAuth
- **Session Strategy**: JWT-based with next-auth
- **Role Assignment**: Volunteer or NGO (set during signup or complete-profile)
- **Plan Types**:
  - Volunteer: `volunteer_free` (1 app/month), `volunteer_plus` (unlimited, ₹199/mo)
  - NGO: `ngo_base` (3 job posts), `ngo_plus` (unlimited, ₹499/mo)

**Issues**:
- Google OAuth users created without role/plan → forces `/complete-profile` redirect
- Credentials provider doesn't auto-sync with session immediately
- Middleware doesn't enforce profile completion

### Payment & Subscription Flow ✅
- **Payment Gateway**: Razorpay (INR pricing)
- **Webhook Handling**: Signature verification with Web Crypto API
- **Plan Duration**: 30 days after successful payment
- **Quota Enforcement**: Via `lib/quotas.ts` helpers

**Issues**:
- ⚠️ No plan auto-downgrade when `planExpiresAt < now`
- ⚠️ Free plan users can see "upgrade" button but can still use free features
- ⚠️ Subscription expiry not checked in real-time

### Role-Based Features

**Volunteers Can:**
- ✅ View jobs (public listing)
- ✅ Apply for jobs (quota-limited)
- ✅ Track applications
- ✅ Edit profile
- ❌ Search/filter jobs
- ❌ Save jobs
- ❌ View NGO profiles/details

**NGOs Can:**
- ✅ Post jobs (quota-limited)
- ✅ View volunteer applications
- ✅ Track application progress
- ✅ Edit profile
- ❌ Edit/delete posted jobs
- ❌ Bulk reject applications
- ❌ Advanced analytics

---

## 2. ARCHITECTURE ISSUES FOUND 🔴

### Duplicate Files & Routes

| File/Folder | Issue | Action |
|---|---|---|
| `components/navbar.tsx` | Duplicate of `site-navbar.tsx` | ❌ **DELETED** |
| `components/footer.tsx` | Duplicate of `site-footer.tsx` | ❌ **DELETED** |
| `app/dashboard/` | Parallel to `app/(dashboard)/` | ❌ **DELETED** |
| `app/complete-profile/` | Should be under `app/(auth)/` | ❌ **DELETED** |
| `/api/auth/` | Wrapper only, not needed | ✅ Keep (required by NextAuth) |

### Navigation Structure Issues

**Old Paths (Broken)**:
- `/auth/signin` → ❌ Doesn't exist
- `/auth/signup` → ❌ Doesn't exist
- `/dashboard/*` → ❌ Duplicate

**Correct Paths**:
- `/signin` → ✅ Sign in page
- `/signup` → ✅ Sign up page  
- `/(auth)/complete-profile` → ✅ Profile completion
- `/(dashboard)/volunteer/*` → ✅ Volunteer dashboard
- `/(dashboard)/ngo/*` → ✅ NGO dashboard

### Missing Infrastructure

| Feature | Status | Priority |
|---|---|---|
| Centralized API client | ❌ Missing | HIGH |
| Global state (Zustand) | ❌ Missing | HIGH |
| Error handling middleware | ⚠️ Basic | MEDIUM |
| Loading states UI | ⚠️ Basic | MEDIUM |
| Toast notifications | ✅ Sonner | - |

---

## 3. CODE QUALITY ISSUES

### Type Safety
- ✅ Good: Uses Zod for validation
- ⚠️ Some `(session as any)` casts throughout codebase
- ⚠️ API responses not typed

### State Management
- ❌ No global state (Zustand)
- ❌ Manual prop drilling for user info
- ❌ Session checks repeated in many components
- ❌ Plan/role info not easily accessible

### API Consistency
- ⚠️ No API response wrapper
- ⚠️ Inconsistent error handling
- ⚠️ No request deduplication

---

## 4. HOME PAGE ANALYSIS 🔴

**Current Sections:**
- ✅ Hero section
- ✅ Feature cards
- ✅ Category bento
- ✅ Stats strip
- ✅ Testimonials
- ✅ FAQ
- ❌ **Missing: Recent jobs carousel**
- ❌ **Missing: Top volunteers showcase**
- ❌ **Missing: NGO spotlight**
- ❌ **Missing: Clear role selection CTAs**

---

## 5. UI/UX & DESIGN

### Color Scheme ✅
- Primary: Professional green (oklch-based)
- Good contrast and accessibility
- Dark mode support available
- All colors defined in `globals.css`

### Navbar
- ✅ Professional design
- ⚠️ Responsive but could be improved
- ✅ Brand logo visible
- ✅ Theme toggle present
- ⚠️ Command search exists but not fully integrated

---

## 6. RECOMMENDED ARCHITECTURE

```
app/
  (auth)/                    # Authentication-related pages
    signin/page.tsx
    signup/page.tsx
    complete-profile/page.tsx
    
  (dashboard)/               # Protected dashboard routes
    volunteer/
      page.tsx              # Dashboard overview
      profile/page.tsx
      applications/page.tsx
      settings/page.tsx
    ngo/
      page.tsx
      jobs/page.tsx
      applications/page.tsx
      profile/page.tsx
      settings/page.tsx
      
  api/
    auth/                    # NextAuth
    profile/                 # User profile CRUD
    jobs/                    # Job posting/listing
    applications/            # Application management
    billing/                 # Razorpay integration
    
  page.tsx                   # Home page
  layout.tsx
  globals.css
  
lib/
  db.ts                      # MongoDB connection
  models.ts                  # TypeScript types
  quotas.ts                  # Usage quotas
  utils.ts                   # General utilities
  api-client.ts              # NEW: Centralized API wrapper
  auth-store.ts              # NEW: Zustand store

components/
  ui/                        # shadcn components
  site-navbar.tsx            # Public navbar only
  site-footer.tsx            # Public footer only
  dashboard/                 # Dashboard-specific components
  (removed: navbar.tsx, footer.tsx)
```

---

## 7. ACTION PLAN

### Phase 1: Simplify & Fix (IMMEDIATE)
- ✅ **DONE**: Delete duplicate files (`navbar.tsx`, `footer.tsx`, `app/dashboard/`, `app/complete-profile/`)
- ✅ **DONE**: Update middleware to enforce profile completion
- ⏳ **TODO**: Create centralized API client (`lib/api-client.ts`)
- ⏳ **TODO**: Setup Zustand store for auth/plan state
- ⏳ **TODO**: Create `(auth)/complete-profile` page

### Phase 2: Features & Polish
- ⏳ **TODO**: Redesign home page with:
  - Recent jobs carousel (6-8 jobs)
  - Top volunteers section (leaderboard-style)
  - NGO spotlight section
  - Role-specific CTAs
  - Better hero design

- ⏳ **TODO**: Add missing features:
  - Job search/filter UI
  - Save jobs functionality
  - Advanced NGO analytics
  - Job edit/delete for NGOs
  - Bulk application actions

### Phase 3: Payment & Subscription
- ⏳ **TODO**: Implement plan auto-downgrade on expiry
- ⏳ **TODO**: Real-time subscription status check
- ⏳ **TODO**: Payment retry/failed payment handling
- ⏳ **TODO**: Subscription management UI (change plan, cancel)

### Phase 4: State Management
- ⏳ **TODO**: Replace manual `useSession()` calls with Zustand store
- ⏳ **TODO**: Move plan/role/quota info to global store
- ⏳ **TODO**: Reduce prop drilling

---

## 8. STATE MANAGEMENT RECOMMENDATION

**YES, implement Zustand!**

```typescript
// lib/auth-store.ts
import { create } from 'zustand'

interface AuthStore {
  userId: string | null
  role: 'volunteer' | 'ngo' | null
  plan: string | null
  planExpiresAt: Date | null
  profileComplete: boolean
  
  setUser: (data: Partial<AuthStore>) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  role: null,
  plan: null,
  planExpiresAt: null,
  profileComplete: false,
  
  setUser: (data) => set((state) => ({ ...state, ...data })),
  logout: () => set({
    userId: null,
    role: null,
    plan: null,
    profileComplete: false,
  }),
}))
```

**Benefits:**
- ✅ Single source of truth for auth state
- ✅ No prop drilling
- ✅ Easy access from any component
- ✅ Persist to localStorage if needed
- ✅ Smaller bundle than Redux

---

## 9. CENTRALIZED API CLIENT

```typescript
// lib/api-client.ts
export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    
    if (!res.ok) {
      const error = await res.json()
      return { error: error.error || `Error: ${res.status}` }
    }
    
    const data = await res.json()
    return { data }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Usage:
const { data, error } = await apiCall('/api/profile')
```

---

## 10. NEXT STEPS

1. **Install Zustand**:
   ```bash
   bun add zustand
   ```

2. **Create store**:
   ```bash
   touch lib/auth-store.ts lib/api-client.ts
   ```

3. **Migrate components** to use store instead of `useSession()`

4. **Redesign home page** with new sections

5. **Test complete auth flow** (signup → complete-profile → dashboard)

6. **Implement plan downgrade logic**

---

## 11. FILE STRUCTURE AFTER CLEANUP

✅ **Deleted**:
- `components/navbar.tsx`
- `components/footer.tsx`
- `app/dashboard/` (entire folder)
- `app/complete-profile/` (entire folder)

✅ **Updated**:
- `middleware.ts` - Now enforces profile completion
- `components/site-navbar.tsx` - Already correct links

⏳ **To Create**:
- `lib/api-client.ts`
- `lib/auth-store.ts`
- `app/(auth)/complete-profile/page.tsx`
- Enhanced home page sections

---

## 12. SUMMARY TABLE

| Aspect | Status | Action |
|--------|--------|--------|
| Auth Flow | ✅ Solid | Enforce in middleware |
| Payments | ✅ Working | Add auto-downgrade |
| Duplicates | ❌ Many | Delete old files |
| State Management | ❌ Missing | Add Zustand |
| API Client | ❌ Missing | Centralize |
| Home Page | ⚠️ Basic | Enhance sections |
| UI/Design | ✅ Good | Polish existing |
| Type Safety | ⚠️ Decent | Remove `any` casts |

---

**NEXT ACTION**: Should I proceed with Phase 1 implementation (API client + Zustand store)?
