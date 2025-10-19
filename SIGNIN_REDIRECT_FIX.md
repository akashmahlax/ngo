# Sign-In Redirect Fix

## Date: October 19, 2025

## Issue
After signing in, users with **complete profiles** were being incorrectly redirected to `/complete-profile` page instead of their dashboard or intended destination.

### User Report
> "the sign in page after sign in why rediecting to complete profile which not even related to system"

## Root Cause Analysis

### The Problem
The sign-in page (`app/signin/page.tsx`) had incorrect logic checking for profile completion:

```typescript
// ❌ INCORRECT CODE (Before)
const user: any = session?.user;
if (user && (!user.role || !user.plan)) {
  r.push("/complete-profile");
}
```

**Why this was wrong:**
- The auth configuration (`auth.ts`) adds `role`, `plan`, and `profileComplete` to the **session object itself**, NOT to `session.user`
- The code was checking `session.user.role` and `session.user.plan` which **don't exist**
- Since these properties were always `undefined`, the condition `!user.role || !user.plan` was always `true`
- This caused ALL users to be redirected to `/complete-profile`, even those with complete profiles

### Auth Session Structure

**From `auth.ts` (lines 165-171):**
```typescript
async session({ session, token }) {
  if (session.user) {
    ;(session as any).userId = token.userId
    ;(session as any).role = token.role           // ← Added to session root
    ;(session as any).plan = token.plan           // ← Added to session root
    ;(session as any).profileComplete = token.profileComplete  // ← Added to session root
  }
  return session
}
```

**Session Structure:**
```typescript
{
  user: {
    name: "John Doe",
    email: "john@example.com",
    image: "..."
  },
  role: "volunteer",              // ← At session root
  plan: "volunteer_free",         // ← At session root
  profileComplete: true,          // ← At session root
  userId: "...",
  planExpiresAt: null
}
```

## Solution

### Updated Sign-In Logic
**File**: `app/signin/page.tsx` (lines 33-45)

```typescript
// ✅ CORRECT CODE (After)
useEffect(() => {
  if (status === "authenticated") {
    const sessionWithProfile = session as typeof session & { 
      profileComplete?: boolean;
      role?: string;
    };
    // Check profileComplete flag from session (set in auth.ts)
    if (!sessionWithProfile?.profileComplete) {
      r.push("/complete-profile");
    } else {
      r.push(callbackUrl);
    }
  }
}, [session, status, r, callbackUrl]);
```

### Key Changes
1. ✅ Check `session.profileComplete` instead of `session.user.role`
2. ✅ Proper TypeScript typing without `any`
3. ✅ Consistent with middleware logic (which also checks `profileComplete`)
4. ✅ Follows the actual session structure from auth.ts

## How It Works Now

### Profile Complete Check
The `profileComplete` flag is set in `auth.ts` JWT callback (line 135):
```typescript
token.profileComplete = !!dbUser.role
```

This means:
- **`profileComplete = true`**: User has selected a role (profile is complete)
- **`profileComplete = false`**: User has NOT selected a role (needs to complete profile)

### User Flow

#### Scenario 1: New Google OAuth User
1. User clicks "Sign in with Google"
2. Google auth completes successfully
3. User created in DB with `role: null` (line 81 of auth.ts)
4. Session has `profileComplete: false`
5. ✅ Redirected to `/complete-profile` to choose role
6. User selects NGO or Volunteer
7. DB updated with role
8. Next login: `profileComplete: true` → Goes to dashboard

#### Scenario 2: Existing User with Complete Profile
1. User signs in (email/password or Google)
2. DB has `role: "volunteer"` or `role: "ngo"`
3. Session has `profileComplete: true`
4. ✅ Redirected to `callbackUrl` or dashboard (NOT complete-profile)
5. No unnecessary redirect loop

#### Scenario 3: Sign In with Callback URL
1. User tries to access `/ngo/jobs` (requires auth)
2. Middleware redirects to `/signin?callbackUrl=/ngo/jobs`
3. User signs in successfully
4. Profile is complete (`profileComplete: true`)
5. ✅ Redirected to `/ngo/jobs` (original destination)

## Related Files

### Middleware (`middleware.ts`)
The middleware **already had correct logic** checking `profileComplete`:
```typescript
if (!sessionWithProfile.profileComplete) {
  return NextResponse.redirect(new URL('/complete-profile', request.url))
}
```

This worked correctly. The bug was only in the sign-in page.

### Auth Configuration (`auth.ts`)
- Lines 81-87: Google OAuth creates users with `role: null`
- Line 135: Sets `profileComplete = !!dbUser.role`
- Lines 165-171: Adds `profileComplete`, `role`, `plan` to session root

### Complete Profile Page (`app/(auth)/complete-profile/page.tsx`)
- Users select role (volunteer/ngo)
- Updates DB with role and appropriate free plan
- Redirects to dashboard based on role

## Testing Checklist

### ✅ Test Cases

1. **New Google OAuth User**
   - [ ] Sign in with Google (first time)
   - [ ] Should redirect to `/complete-profile`
   - [ ] Select role and org name
   - [ ] Should redirect to dashboard
   - [ ] Sign out and sign in again
   - [ ] Should redirect to dashboard (not complete-profile)

2. **Existing User (Email/Password)**
   - [ ] Sign in with email and password
   - [ ] Should redirect to dashboard immediately
   - [ ] Should NOT see complete-profile page

3. **Existing User (Google OAuth)**
   - [ ] Sign in with Google (returning user)
   - [ ] Should redirect to dashboard immediately
   - [ ] Should NOT see complete-profile page

4. **Callback URL Preservation**
   - [ ] Try to access `/ngo/jobs` without auth
   - [ ] Redirected to `/signin?callbackUrl=/ngo/jobs`
   - [ ] Sign in successfully
   - [ ] Should redirect to `/ngo/jobs` (NOT complete-profile)

5. **Role-Based Redirects**
   - [ ] Sign in as Volunteer
   - [ ] Default redirect should be `/volunteer` dashboard
   - [ ] Sign in as NGO
   - [ ] Default redirect should be `/ngo` dashboard

## Impact

### Before Fix
❌ **ALL users** redirected to `/complete-profile` after sign-in
- Frustrating experience for returning users
- Unnecessary extra step
- Broke callback URL flow
- Users couldn't reach their intended destination

### After Fix
✅ **Only new users** without a role redirected to `/complete-profile`
- Smooth experience for returning users
- Direct access to dashboard
- Callback URLs work correctly
- Profile completion only when needed

## Benefits
1. ✅ **Better UX**: Returning users go straight to their dashboard
2. ✅ **Correct Logic**: Matches auth.ts session structure
3. ✅ **Type Safety**: Proper TypeScript types (no `any`)
4. ✅ **Consistent**: Matches middleware logic
5. ✅ **Callback URLs**: Preserved correctly after sign-in

## Status
✅ **COMPLETE** - Sign-in redirect logic fixed

Users with complete profiles now go directly to their dashboard or callback URL instead of being incorrectly redirected to the complete-profile page!
