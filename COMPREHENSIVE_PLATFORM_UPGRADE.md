# Comprehensive Platform Upgrade Plan

## Overview
Major platform enhancements to add payment information, improve UI/UX, fix dark mode, and enhance profile pages.

## Issues to Fix

### 1. ✅ Dark Mode Dropdown Issue (PRIORITY 1)
**Problem**: Select dropdowns showing white background with unreadable text in dark mode
**Root Cause**: Radix Portal rendering with insufficient dark mode styling
**Solution**: The CSS already has proper dark mode support. Issue is likely browser-specific or needs portal container styling

### 2. Job Detail Page Mock Data (PRIORITY 1)
**Problem**: `/jobs/[id]` showing mock data instead of fetching from API
**Current**: Using hardcoded mockJob object
**Solution**: 
- Create `/api/jobs/[id]` GET endpoint
- Fetch real job data with NGO details
- Change "View Details" button to "Apply Now"
- Handle loading and error states

### 3. Job & Volunteer Card Redesign (PRIORITY 2)
**Problem**: Cards are basic, need unique modern design with photos
**Solution**:
- Add image/photo support to job cards
- Unique layout with overlapping elements
- Gradient accents
- Better spacing and typography
- Show compensation prominently

### 4. Job Posting Enhancements (PRIORITY 1)
**New Fields to Add**:
```typescript
compensationType: "paid" | "unpaid" | "stipend"
salaryRange: string // "₹10,000 - ₹15,000/month"
stipendAmount: string // "₹5,000/month"  
hourlyRate: number // 500 (₹500/hour)
paymentFrequency: "hourly" | "daily" | "monthly" | "one-time" | "project-based"
additionalPerks: string[] // ["Food", "Travel allowance"]
```

### 5. Volunteer Profile Enhancements (PRIORITY 2)
**New Fields to Add**:
```typescript
expectedSalary: string // "₹15,000 - ₹20,000/month"
hourlyRate: number // 500 (₹500/hour)
availability: "full-time" | "part-time" | "flexible" | "weekends"
totalEarnings: number // Total earned
hoursWorked: number // Total hours
```

### 6. NGO Profile Page Overhaul (PRIORITY 2)
**Current Problem**: Shows edit mode immediately, edit doesn't work
**Solution**:
- Default to VIEW mode with comprehensive information display
- Add "Edit Profile" button
- Expand fields:
  ```typescript
  yearEstablished: string
  description: string // Long detailed description
  impactStats: {
    volunteersHelped: number
    projectsCompleted: number
    peopleImpacted: number
  }
  coverPhotoUrl: string
  ```
- Large hero section with cover photo
- Stats cards
- Mission/vision sections
- Team information

### 7. Volunteer Profile Page Similar Overhaul (PRIORITY 2)
- View mode by default
- Edit button
- Showcase portfolio
- Display earnings & hours
- Ratings & reviews section
- Availability calendar

## Implementation Plan

### Phase 1: Data Models & API (Day 1)
1. ✅ Update `lib/models.ts` with new fields
2. Create `/api/jobs/[id]` GET endpoint
3. Update `/api/jobs` POST to handle new payment fields
4. Update `/api/profile` to handle new volunteer/NGO fields

### Phase 2: Job System (Day 1-2)
1. Fix job detail page to fetch real data
2. Add payment fields to job posting form
3. Update job cards with new unique design
4. Add "Apply Now" button

### Phase 3: Profile Pages (Day 2-3)
1. Redesign NGO profile page (view + edit modes)
2. Redesign volunteer profile page (view + edit modes)
3. Add image upload for cover photos
4. Add stats displays

### Phase 4: Volunteer Cards (Day 3)
1. Redesign volunteer listing cards
2. Show salary expectations
3. Add unique photo layouts
4. Show availability

### Phase 5: Polish & Testing (Day 4)
1. Dark mode thorough testing
2. Responsive design check
3. Type safety verification
4. End-to-end testing

## File Changes Required

### Models (`lib/models.ts`)
- ✅ Add UserDoc payment fields
- ✅ Add JobDoc payment fields
- ✅ Add NGO comprehensive fields

### API Routes
- `app/api/jobs/[id]/route.ts` (NEW)
- `app/api/jobs/route.ts` (UPDATE)
- `app/api/profile/route.ts` (UPDATE)

### Pages
- `app/jobs/[id]/page.tsx` (MAJOR UPDATE)
- `app/jobs/page.tsx` (CARD REDESIGN)
- `app/volunteers/page.tsx` (CARD REDESIGN)
- `app/volunteers/[id]/page.tsx` (NEW/UPDATE)
- `app/ngos/post/page.tsx` (ADD FIELDS)
- `app/(dashboard)/ngo/profile/page.tsx` (MAJOR REDESIGN)
- `app/(dashboard)/volunteer/profile/page.tsx` (MAJOR REDESIGN)

### Components
- `components/job-card.tsx` (NEW)
- `components/volunteer-card.tsx` (NEW)
- `components/profile/ngo-profile-view.tsx` (NEW)
- `components/profile/volunteer-profile-view.tsx` (NEW)

## Success Criteria

✅ All dropdowns work perfectly in dark mode
✅ Job details page shows real data with "Apply Now" button
✅ Job cards have unique modern design with images
✅ Job posting includes full payment/compensation info
✅ Volunteer cards show salary expectations and availability
✅ NGO profile has view mode with comprehensive information
✅ Volunteer profile has view mode with earnings/stats
✅ All pages are responsive and professional
✅ TypeScript has 0 errors
✅ Dark mode works flawlessly everywhere

## Timeline
- Day 1: Models, APIs, Job detail page fix
- Day 2: Job posting fields, Job cards redesign
- Day 3: Profile pages overhaul
- Day 4: Volunteer cards, Polish, Testing

---
**Status**: Phase 1 Started - Models Updated
**Next**: Fix job detail page API and dark mode issue
