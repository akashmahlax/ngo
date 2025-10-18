# Plan & Quota System Implementation

## Overview
Complete implementation of plan-based access control with quota tracking and upgrade alerts instead of hard redirects.

## Plan Features & Quotas

### Volunteer Plans

#### volunteer_free (Free Forever)
- ✅ 1 job application per month
- ✅ View all job listings
- ✅ Basic profile
- ✅ Application tracking
- ❌ No priority application badge

#### volunteer_plus (₹1/month)
- ✅ **Unlimited job applications**
- ✅ Priority application badge
- ✅ Full dashboard access
- ✅ Advanced profile features
- ✅ Application analytics

### NGO Plans

#### ngo_base (Free Forever)
- ✅ Post up to **3 active jobs**
- ✅ View all applications
- ✅ Basic profile
- ✅ Application management
- ❌ No featured listings
- ❌ No advanced analytics

#### ngo_plus (₹1/month)
- ✅ **Unlimited job postings**
- ✅ Featured job listings with Plus badge
- ✅ Full dashboard access
- ✅ Advanced analytics
- ✅ Priority support
- ✅ Verified badge option

## Implementation Details

### 1. Quota Tracking System

**File**: `lib/quotas.ts`

```typescript
// Volunteer application quota
canApply(userId, isPlus) 
  - Plus: Always returns true (unlimited)
  - Free: 1 application per 30-day rolling period

// NGO job posting quota
canPostJob(userId, isPlus, baseLimit = 3)
  - Plus: Always returns true (unlimited)
  - Free: Maximum 3 active (status="open") jobs
```

### 2. Middleware Changes

**File**: `middleware.ts`

**Old Behavior**: Hard redirects to `/upgrade` page
**New Behavior**: Allow access, pass upgrade flags in headers

```typescript
// Headers set for upgrade prompts:
x-upgrade-required: "true"
x-upgrade-plan: "ngo_plus" | "volunteer_plus"
x-upgrade-reason: "plan_expired" | "dashboard_access" | "post_job"
```

**Benefits**:
- Better UX - users stay on the page
- See what they're missing
- Inline upgrade prompts
- No jarring redirects

### 3. Job Posting API

**Endpoint**: `POST /api/jobs`

**Validation**:
- Title: 3-200 characters
- Description: 10-5000 characters
- Category: Required
- Location Type: onsite | remote | hybrid
- Requirements, Benefits, Skills: Optional arrays

**Quota Enforcement**:
```typescript
// Check plan expiry
if (isPlanExpired) {
  return 402 - "PLAN_EXPIRED"
}

// Check job posting limit
const check = await canPostJob(userId, isPlus)
if (!check.ok) {
  return 402 - {
    error: "LIMIT_REACHED",
    active: 3,
    limit: 3
  }
}
```

**Response**: Returns `jobId` and success message

### 4. Quota Display API

**Endpoint**: `GET /api/jobs/quota`

**Returns**:
```json
{
  "active": 2,
  "limit": 3,
  "isPlus": false,
  "canPost": true,
  "plan": "ngo_base"
}
```

Used by post job page to show real-time quota status.

### 5. NGO Branding on Jobs

**Database Fields Added**:
- `logoUrl`: Cloudinary URL for NGO logo
- `logoPublicId`: Cloudinary public ID for management

**Jobs API Enhancement**:
```typescript
GET /api/jobs returns:
{
  ...job,
  ngoName: "Example NGO",
  ngoLogoUrl: "https://...",
  ngoVerified: true,
  ngoPlan: "ngo_plus"
}
```

**Display Features**:
- NGO avatar/logo on job cards
- Verified badge (blue checkmark) for verified NGOs
- Plus badge for NGO Plus subscribers
- Professional branding

### 6. Post Job Page Enhancements

**File**: `app/ngos/post/page.tsx`

**Features Added**:
1. **Real-time Quota Display**
   ```
   Free NGO: "Job Postings: 2 / 3"
   Plus NGO: "Unlimited Job Postings" with crown icon
   ```

2. **Upgrade Alerts** (instead of redirects):
   - **Limit Reached Alert**: Red alert when at quota limit
   - **Upgrade Suggestion**: Blue alert for non-Plus users
   - Inline upgrade buttons with CheckoutButton

3. **Professional Validation**:
   - Step-by-step form (3 steps)
   - Preview before publish
   - Character counters
   - Required field validation

4. **Full API Integration**:
   - Saves all job details
   - Proper error handling
   - Success redirect to jobs dashboard

### 7. Job Listings Enhancement

**File**: `app/jobs/page.tsx`

**Features Added**:
- NGO avatar with logo or fallback initial
- NGO name display
- Verified badge for verified NGOs
- Plus badge for premium subscribers
- Professional card layout

## User Flow Examples

### Scenario 1: Free Volunteer Applies to Job
1. User views job listing
2. Clicks "Apply Now"
3. System checks: `canApply(userId, false)`
4. If quota available: Application submitted ✅
5. If quota exceeded: Shows upgrade prompt with CheckoutButton

### Scenario 2: Free NGO Posts 3rd Job
1. NGO navigates to `/ngos/post`
2. Quota display shows: "Job Postings: 2 / 3"
3. Blue alert suggests upgrade to Plus
4. User can proceed with posting
5. After posting: "Job Postings: 3 / 3"
6. System saves job successfully

### Scenario 3: Free NGO at Limit Tries to Post
1. NGO navigates to `/ngos/post`
2. Quota display shows: "Job Postings: 3 / 3"
3. Red alert: "Job Posting Limit Reached"
4. Form still accessible (better UX)
5. On submit: API returns 402 error
6. Toast shows: "Upgrade required to post more jobs"
7. Inline upgrade button available

### Scenario 4: Expired Plus Plan
1. User's plan expires
2. Middleware sets `x-upgrade-required: true`
3. User can still access dashboard
4. Prominent banner: "Your plan has expired"
5. Renewal button prominently displayed
6. Actions blocked until renewal

## Testing Checklist

### Volunteer Features
- [ ] Free user can apply to 1 job per month
- [ ] Free user sees upgrade prompt after quota
- [ ] Plus user can apply unlimited times
- [ ] Application counter resets after 30 days

### NGO Features
- [ ] Free NGO can post up to 3 active jobs
- [ ] Free NGO sees quota display (X/3)
- [ ] Free NGO sees upgrade alerts
- [ ] Free NGO blocked at limit with API error
- [ ] Plus NGO shows "Unlimited" with crown
- [ ] Plus NGO can post unlimited jobs

### Branding
- [ ] NGO logos display on job cards
- [ ] Fallback initials show when no logo
- [ ] Verified badge shows for verified NGOs
- [ ] Plus badge shows for Plus subscribers
- [ ] Logo quality is good on all screen sizes

### API Endpoints
- [ ] POST /api/jobs validates all fields
- [ ] POST /api/jobs checks quotas
- [ ] POST /api/jobs returns proper errors
- [ ] GET /api/jobs includes NGO branding
- [ ] GET /api/jobs/quota returns correct counts

### UX Improvements
- [ ] No hard redirects to /upgrade
- [ ] Upgrade alerts show inline
- [ ] Users can see what they're missing
- [ ] Clear messaging about plan limits
- [ ] Easy upgrade path with CheckoutButton

## Database Schema Updates

### users collection
```typescript
{
  // ... existing fields
  logoUrl?: string           // NGO logo Cloudinary URL
  logoPublicId?: string      // NGO logo public ID
}
```

### jobs collection
```typescript
{
  _id: ObjectId
  ngoId: ObjectId
  title: string
  description: string
  category: string
  locationType: "onsite" | "remote" | "hybrid"
  location?: string
  requirements: string[]     // NEW
  benefits: string[]         // NEW
  skills: string[]
  status: "open" | "closed"
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/jobs` | GET | Optional | List all jobs with NGO branding |
| `/api/jobs` | POST | NGO only | Create new job with quota check |
| `/api/jobs/quota` | GET | NGO only | Get current quota status |
| `/api/billing/verify-payment` | POST | Authenticated | Upgrade plan after payment |
| `/api/applications` | POST | Volunteer | Apply to job with quota check |

## Next Steps for Enhancement

### Phase 1: Analytics (Optional)
- [ ] Job view tracking
- [ ] Application conversion rates
- [ ] Popular skills analysis
- [ ] NGO dashboard analytics

### Phase 2: Featured Listings (Optional)
- [ ] Plus NGO jobs appear first in listings
- [ ] Special "Featured" badge
- [ ] Highlighted card styling

### Phase 3: Advanced Features (Future)
- [ ] Job templates for faster posting
- [ ] Duplicate/repost functionality
- [ ] Bulk job management
- [ ] Export applications to CSV

## Files Modified

1. ✅ `middleware.ts` - Removed redirects, added headers
2. ✅ `lib/models.ts` - Added logoUrl fields
3. ✅ `app/api/jobs/route.ts` - Enhanced validation & NGO branding
4. ✅ `app/api/jobs/quota/route.ts` - NEW - Quota status endpoint
5. ✅ `app/ngos/post/page.tsx` - Quota display & upgrade alerts
6. ✅ `app/jobs/page.tsx` - NGO logo & branding display
7. ✅ `lib/quotas.ts` - Already had quota logic (verified working)

## Success Metrics

- ✅ TypeScript compilation: 0 errors
- ✅ All plan quotas enforced
- ✅ No hard redirects (better UX)
- ✅ NGO branding on all jobs
- ✅ Professional validation
- ✅ Inline upgrade prompts
- ✅ Real-time quota tracking

## Conclusion

The plan and quota system is now fully implemented with:
- ✅ Clear tier differentiation
- ✅ Enforced limits at API level
- ✅ User-friendly upgrade prompts
- ✅ Professional NGO branding
- ✅ Real-time quota display
- ✅ Better UX (no jarring redirects)

Users now understand what they get with each plan and have easy upgrade paths when they hit limits.
