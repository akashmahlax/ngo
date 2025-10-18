# 🌐 Complete Website Flow & Implementation Plan

## 📊 Current Authentication System

### ✅ **Already Implemented**

#### 1. **Sign Up** (`/signup`)
- **Methods**: 
  - ✅ Email/Password (Credentials)
  - ✅ Google OAuth
- **Features**:
  - Name, email, password input
  - Role selection (Volunteer/NGO)
  - Plan selection (Free/Plus)
  - Password hashing with bcrypt
  - Automatic sign-in after signup
  - Redirect to upgrade for Plus plans

#### 2. **Sign In** (`/signin`)
- **Methods**:
  - ✅ Email/Password (Credentials)
  - ✅ Google OAuth
- **Features**:
  - Email and password validation
  - "Forgot password" link (not implemented)
  - Error handling
  - Redirect to complete-profile if role not set
  - Remember callback URL

#### 3. **Complete Profile** (`/complete-profile`)
- **When**: After Google OAuth or if role not set
- **Features**:
  - Role selection (Volunteer/NGO)
  - Organization name for NGOs
  - Profile info message for volunteers
  - Updates user record with role

### 🔐 **Authentication Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                    Landing Page (/)                          │
│  - Hero section with dual CTAs                               │
│  - Volunteer spotlight, NGO spotlight, Recent jobs           │
│  - Sign In / Sign Up buttons in navbar                       │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
         ┌────────────────┴────────────────┐
         │                                  │
         ▼                                  ▼
┌─────────────────┐              ┌─────────────────┐
│  Sign In        │              │  Sign Up        │
│  /signin        │              │  /signup        │
├─────────────────┤              ├─────────────────┤
│ • Email/Pass    │              │ • Name          │
│ • Google OAuth  │              │ • Email/Pass    │
│ • Validation    │              │ • Role          │
│ • Error msgs    │              │ • Plan          │
└─────────────────┘              └─────────────────┘
         │                                  │
         └────────────────┬─────────────────┘
                          ▼
         ┌──────────────────────────────┐
         │  Profile Complete?           │
         │  (Has role and plan)         │
         └──────────────────────────────┘
                 │              │
           NO    │              │   YES
                 ▼              ▼
    ┌─────────────────┐   ┌──────────────┐
    │ Complete Profile│   │  Dashboard   │
    │ /complete-profile│   │ (role-based) │
    ├─────────────────┤   └──────────────┘
    │ • Select role   │
    │ • Org name (NGO)│
    └─────────────────┘
                 │
                 ▼
         ┌──────────────┐
         │  Dashboard   │
         │ (role-based) │
         └──────────────┘
```

---

## 🎯 **User Journey Flows**

### **1. Volunteer Journey**

```
┌─────────────────────────────────────────────────────────────┐
│                    VOLUNTEER JOURNEY                         │
└─────────────────────────────────────────────────────────────┘

1. Sign Up/In → Complete Profile (if needed) → Volunteer Dashboard
                                                      │
   ┌──────────────────────────────────────────────────┤
   │                                                   │
   ▼                                                   ▼
Browse Jobs                                    View Profile
/jobs                                          /volunteer/profile
│                                              │
├─ Search/Filter jobs                          ├─ Edit bio, skills
├─ View job details                            ├─ Add experience
├─ Check NGO profile                           ├─ Upload avatar
├─ Apply for job ──────────────────┐           ├─ Social links
│                                   │           └─ Education
│                                   ▼
│                        Application Created
│                        - Status: "applied"
│                        - Quota checked (Free: 1/month)
│                                   │
├───────────────────────────────────┤
│                                   │
▼                                   ▼
Track Applications            NGO Reviews Application
/volunteer/applications       /ngo/jobs/[id]/applications
│                                   │
├─ View by status                   ├─ Shortlist
├─ Search applications              ├─ Schedule interview
├─ Filter by NGO                    ├─ Send offer
├─ View details                     └─ Reject
│                                   │
│                                   │
│    ◄────────── Status Updates ────┤
│                                   │
│  Statuses:                        │
│  • applied → shortlisted          │
│  • shortlisted → accepted         │
│  • accepted (hired!)              │
│  • rejected                       │
│  • withdrawn (by volunteer)       │
│                                   │
└─ Accept/Reject offers             │
   View application timeline         │
   Add personal notes                │
                                    │
                                    ▼
                        ┌──────────────────────┐
                        │  Public Profile      │
                        │  /volunteers/[id]    │
                        │  - Viewable by NGOs  │
                        │  - Skills, exp, bio  │
                        │  - Avatar, location  │
                        └──────────────────────┘
```

### **2. NGO Journey**

```
┌─────────────────────────────────────────────────────────────┐
│                       NGO JOURNEY                            │
└─────────────────────────────────────────────────────────────┘

1. Sign Up/In → Complete Profile (if needed) → NGO Dashboard
                                                      │
   ┌──────────────────────────────────────────────────┤
   │                                                   │
   ▼                                                   ▼
Post Jobs                                      View Profile
/ngos/post                                     /ngo/profile
│                                              │
├─ Job title & category                        ├─ Org name, logo
├─ Description                                 ├─ Mission statement
├─ Requirements                                ├─ Focus areas
├─ Skills needed                               ├─ Team size
├─ Location type                               ├─ Contact info
└─ Benefits                                    └─ Verification badge
   │                                              │
   │                                              │
   ▼                                              ▼
Job Posted                               Public NGO Profile
- Status: "open"                         /ngos/[id]
- Visible on /jobs page                  - Viewable by all
- Free: max 3 active jobs                - Active jobs count
- Plus: unlimited jobs                   - About organization
   │                                     - Contact button
   │
   ├────────────────────────────────────┐
   │                                    │
   ▼                                    ▼
Manage Jobs                      Review Applications
/ngo/dashboard                   /ngo/jobs/[id]/applications
│                                │
├─ View active jobs              ├─ View all applicants
├─ Edit job details              ├─ Filter by status
├─ Close/reopen jobs             ├─ Search volunteers
├─ Delete jobs                   ├─ View volunteer profiles
├─ Track application counts      ├─ Rate applicants
│                                ├─ Add notes
│                                │
│                                ├─ Actions:
│                                │  • Shortlist
│                                │  • Schedule interview
│                                │  • Send offer (accept)
│                                │  • Reject
│                                │
│                                └─ Email candidate
│                                   Export to CSV
│                                   Bulk actions
│
│
└─ Stats Dashboard
   • Total applications
   • Pending review
   • Acceptance rate
   • Active jobs
   • Application breakdown
```

---

## 🚀 **Pages & Features Status**

### ✅ **Completed Pages**

| Page | Path | Status | Features |
|------|------|--------|----------|
| Landing | `/` | ✅ Done | Hero, volunteers, NGOs, jobs sections |
| Sign In | `/signin` | ✅ Done | Credentials + Google OAuth |
| Sign Up | `/signup` | ✅ Done | Full registration with role/plan |
| Complete Profile | `/complete-profile` | ✅ Done | Role selection, org name |
| Volunteer Dashboard | `/volunteer` | ✅ Done | Stats, apps, profile completion |
| NGO Dashboard | `/ngo` | ✅ Done | Jobs, pending apps, stats |
| Volunteer Profile Edit | `/volunteer/profile` | ✅ Done | Full profile management |
| NGO Profile Edit | `/ngo/profile` | ✅ Done | Organization details |
| Public Volunteer | `/volunteers/[id]` | ✅ Done | Public profile view |
| Public NGO | `/ngos/[id]` | ✅ Done | Public org profile |
| Job Details | `/jobs/[id]` | ✅ Done | Full job details + apply |
| Post Job | `/ngos/post` | ✅ Done | Multi-step job creation |
| Edit Job | `/ngo/jobs/[id]/edit` | ✅ Done | Update/archive/delete |
| Settings | `/volunteer/settings` | ✅ Done | Notifications, privacy, delete |
| Settings (NGO) | `/ngo/settings` | ✅ Done | Same as volunteer |
| Upgrade | `/upgrade` | ✅ Done | Razorpay integration |

### ⚠️ **Partially Complete / Needs Enhancement**

| Page | Path | Status | Missing |
|------|------|--------|---------|
| Jobs Listing | `/jobs` | ⚠️ Partial | Search, filters, pagination |
| Volunteers Listing | `/volunteers` | ⚠️ Basic | Search, filters, real data |
| NGOs Listing | `/ngos` | ⚠️ Basic | Search, filters, real data |
| Application Review | `/ngo/jobs/[id]/applications` | ⚠️ Mock | Real API integration for accept/reject |
| Application Detail | `/volunteer/applications/[id]` | ⚠️ Mock | Real data, timeline, withdraw |
| Applications List | `/volunteer/applications` | ⚠️ Mock | Real data from DB |

### ❌ **Missing / Needs Implementation**

| Feature | Priority | Description |
|---------|----------|-------------|
| **Forgot Password** | 🔴 High | Email reset link, reset page |
| **Application Status Updates** | 🔴 High | Real-time updates when NGO changes status |
| **Withdraw Application** | 🔴 High | Volunteer can withdraw application |
| **Notifications System** | 🟡 Medium | Email/in-app notifications |
| **Messaging System** | 🟡 Medium | Chat between volunteer & NGO |
| **Reviews/Ratings** | 🟢 Low | Volunteers can review NGOs |
| **Admin Dashboard** | 🟢 Low | Manage users, verify NGOs |
| **Analytics** | 🟢 Low | Detailed charts and insights |

---

## 🔧 **API Endpoints Status**

### ✅ **Implemented**

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/signup` | POST | Create account | No |
| `/api/complete-profile` | POST | Set role/plan | Yes |
| `/api/applications` | POST | Apply for job | Volunteer |
| `/api/applications/[id]` | PATCH | Update status | NGO/Volunteer |
| `/api/jobs` | GET | List jobs | No |
| `/api/jobs` | POST | Create job | NGO |
| `/api/jobs/[id]` | GET | Job details | No |
| `/api/jobs/[id]` | PATCH | Update job | NGO |
| `/api/jobs/[id]` | DELETE | Delete job | NGO |
| `/api/jobs/[id]/applications` | GET | Get job applicants | NGO |
| `/api/volunteers` | GET | List volunteers | No |
| `/api/volunteers/[id]` | GET | Volunteer profile | No |
| `/api/ngos` | GET | List NGOs | No |
| `/api/ngos/[id]` | GET | NGO profile | No |
| `/api/profile` | GET | Current user profile | Yes |
| `/api/profile` | PATCH | Update profile | Yes |
| `/api/settings` | PATCH | Update settings | Yes |
| `/api/settings/delete-account` | DELETE | Delete account | Yes |
| `/api/uploads/avatar` | POST | Upload avatar | Yes |
| `/api/billing/create-order` | POST | Create Razorpay order | Yes |
| `/api/billing/verify` | POST | Verify payment | Yes |

### ❌ **Missing**

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/auth/forgot-password` | POST | Send reset email | No |
| `/api/auth/reset-password` | POST | Reset password | No |
| `/api/applications/[id]/withdraw` | POST | Withdraw application | Volunteer |
| `/api/applications/[id]/notes` | POST | Add private notes | Both |
| `/api/notifications` | GET | Get notifications | Yes |
| `/api/notifications/mark-read` | POST | Mark as read | Yes |
| `/api/messages` | GET | Get messages | Yes |
| `/api/messages` | POST | Send message | Yes |

---

## 📋 **Implementation Priorities**

### **Phase 1: Critical Fixes (IMMEDIATE)** 🔴

1. **✅ DONE: Application Status Schema**
   - Updated from `["review", "interview", "offered"]` to `["applied", "shortlisted", "accepted"]`
   - File: `lib/models.ts`
   
2. **Fix Application Review Page** (`/ngo/jobs/[id]/applications`)
   - Connect to real API (`/api/jobs/[id]/applications`)
   - Implement accept/reject/shortlist buttons
   - Add status update with API call
   - Remove mock data
   
3. **Fix Volunteer Applications** (`/volunteer/applications`)
   - Connect to real API (aggregate from DB)
   - Show real application data
   - Implement status filtering
   - Add withdraw functionality

4. **Fix Application Detail** (`/volunteer/applications/[id]`)
   - Load real application data
   - Show actual timeline
   - Add withdraw button
   - Display real NGO info

### **Phase 2: Search & Discovery** 🟡

1. **Enhance Jobs Listing** (`/jobs`)
   - Add search by title/description
   - Filter by category, location type
   - Filter by NGO
   - Pagination or infinite scroll
   - Sort options (date, relevance)

2. **Enhance Volunteers Listing** (`/volunteers`)
   - Add search by name, skills
   - Filter by location, availability
   - Filter by skills
   - Show profile completion
   - Link to public profiles

3. **Enhance NGOs Listing** (`/ngos`)
   - Add search by name, mission
   - Filter by category/focus areas
   - Filter by verified status
   - Show active job counts
   - Link to public profiles

### **Phase 3: User Experience** 🟢

1. **Forgot Password Flow**
   - Create `/forgot-password` page
   - Implement email sending (Resend/SendGrid)
   - Create `/reset-password/[token]` page
   - Add API endpoints

2. **Notifications System**
   - In-app notification bell
   - Email notifications for:
     - Application status changes
     - New applications (NGOs)
     - Job offers
     - Messages
   - Notification preferences page

3. **Messaging System**
   - Chat interface
   - Real-time with Socket.io or Pusher
   - Message history
   - Unread indicators

---

## 🗂️ **Database Collections**

### Current Schema

```typescript
// users collection
{
  _id: ObjectId,
  name: string,
  email: string,
  passwordHash: string | null,
  role: "volunteer" | "ngo",
  plan: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus",
  planExpiresAt: Date | null,
  monthlyApplicationCount: number,
  monthlyApplicationResetAt: Date,
  bio: string,
  skills: string[],
  location: string,
  avatarUrl: string,
  cloudinaryPublicId: string,
  // ... more volunteer/NGO specific fields
  createdAt: Date,
  updatedAt: Date
}

// jobs collection
{
  _id: ObjectId,
  ngoId: ObjectId,
  title: string,
  description: string,
  category: string,
  locationType: "onsite" | "remote" | "hybrid",
  skills: string[],
  benefits: string[],
  requirements: string[],
  applicationCount: number,
  viewCount: number,
  status: "open" | "closed",
  createdAt: Date,
  updatedAt: Date
}

// applications collection
{
  _id: ObjectId,
  jobId: ObjectId,
  ngoId: ObjectId,
  volunteerId: ObjectId,
  status: "applied" | "shortlisted" | "accepted" | "rejected" | "withdrawn",
  notes: string,  // volunteer's application notes
  ngoNotes: string,  // NGO's internal notes
  rating: number,  // NGO's rating of volunteer (1-5)
  timeline: [{
    status: string,
    date: Date,
    note: string
  }],
  createdAt: Date,
  updatedAt: Date
}

// orders collection
{
  _id: ObjectId,
  userId: ObjectId,
  role: "volunteer" | "ngo",
  planTarget: "volunteer_plus" | "ngo_plus",
  orderId: string,
  amount: number,
  currency: string,
  status: "created" | "paid" | "failed",
  createdAt: Date,
  paidAt: Date,
  razorpayPaymentId: string,
  razorpaySignature: string
}
```

---

## 🎯 **Next Steps Recommendation**

### **Week 1: Critical Application Flow**

1. ✅ Update application status schema (DONE)
2. Fix `/ngo/jobs/[id]/applications` with real API
3. Fix `/volunteer/applications` with real data
4. Implement application status update API
5. Add withdraw application feature
6. Test complete application lifecycle

### **Week 2: Search & Filters**

1. Enhance Jobs page with search/filters
2. Add pagination to all listing pages
3. Implement sort options
4. Add Volunteers listing page enhancements
5. Add NGOs listing page enhancements

### **Week 3: User Features**

1. Forgot password flow
2. Basic notification system
3. Email notifications for status changes
4. Profile completion reminders
5. Application deadline reminders

### **Week 4: Polish & Testing**

1. Cross-browser testing
2. Mobile responsiveness check
3. Performance optimization
4. SEO improvements
5. Analytics setup
6. Error tracking (Sentry)

---

## 💡 **Key Features Summary**

### **Authentication** ✅
- Email/Password signup
- Google OAuth
- Role-based access (Volunteer/NGO)
- Profile completion flow
- Session management with NextAuth

### **Volunteer Features** ✅/⚠️
- ✅ Dashboard with stats
- ✅ Profile editing
- ✅ Browse jobs
- ✅ Apply for jobs (with quota)
- ⚠️ Track applications (needs real data)
- ⚠️ Withdraw applications (needs implementation)
- ✅ Public profile
- ✅ Upgrade to Plus plan

### **NGO Features** ✅/⚠️
- ✅ Dashboard with analytics
- ✅ Profile editing
- ✅ Post jobs (with quota)
- ✅ Edit/delete jobs
- ⚠️ Review applications (needs real API)
- ⚠️ Accept/reject applicants (needs implementation)
- ✅ Public organization profile
- ✅ Upgrade to Plus plan

### **Billing** ✅
- Razorpay integration
- Plan upgrades
- Payment verification
- Plan expiration handling

---

## 🔍 **Testing Checklist**

### Authentication Flow
- [ ] Sign up with email/password
- [ ] Sign up with Google OAuth
- [ ] Sign in with email/password
- [ ] Sign in with Google OAuth
- [ ] Complete profile after OAuth
- [ ] Redirect to appropriate dashboard
- [ ] Session persistence
- [ ] Logout functionality

### Volunteer Flow
- [ ] View dashboard with real stats
- [ ] Edit profile (all fields)
- [ ] Browse jobs with filters
- [ ] Apply for job (free tier - 1/month limit)
- [ ] View applications list
- [ ] View application detail
- [ ] Track status changes
- [ ] Withdraw application
- [ ] View public profile as others see it

### NGO Flow
- [ ] View dashboard with real stats
- [ ] Edit organization profile
- [ ] Post new job (free tier - 3 active limit)
- [ ] Edit existing job
- [ ] View job applications
- [ ] Shortlist candidate
- [ ] Accept candidate
- [ ] Reject candidate
- [ ] View volunteer profiles
- [ ] Close/reopen job
- [ ] Delete job

### Billing Flow
- [ ] View upgrade page
- [ ] Create Razorpay order
- [ ] Complete payment
- [ ] Verify payment callback
- [ ] Plan activation
- [ ] Access upgraded features
- [ ] Plan expiration handling

---

This is your complete website flow and implementation roadmap. The core authentication and user flows are solid, but the application review and status update features need real API integration to be fully functional.
