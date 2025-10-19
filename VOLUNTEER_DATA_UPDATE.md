# Volunteer Data Update Guide

## Why Skills and Job Titles Aren't Showing

The volunteer cards are now **fully redesigned** and ready to display:
- ✅ **Professional Title** (Job Role)
- ✅ **Skills** (with badges)
- ✅ **Hourly Rates** (both volunteer rate and NGO rate)
- ✅ **Current Work Status**
- ✅ **Success Rate**
- ✅ **Response Time**
- ✅ **Completed & Active Projects**
- ✅ **Rating**

However, **existing volunteers in your database don't have these fields populated yet** because they were added recently.

## Solution: Update Volunteer Data

You have **3 options** to populate the new fields:

### Option 1: Use the Settings Page (Recommended)

1. **Sign in as a volunteer**
2. Go to **Settings** (click your avatar → Settings)
3. Click the **"Profile"** tab (first tab)
4. Fill in all the fields:
   - Professional Title (e.g., "Full Stack Developer")
   - Bio
   - Location
   - Skills (add them one by one)
   - Your Hourly Rate
   - NGO Pays (what NGO pays per hour)
   - Availability (full-time, part-time, flexible, weekends)
   - Response Time
   - Current Work Status (e.g., "Available for new projects")
   - Completed Projects (number)
   - Active Projects (number)
   - Success Rate (0-100%)
   - Rating (0-5)
5. Click **"Save Profile"**
6. Go back to the **Volunteers Directory** page
7. Your card will now show all the information! 🎉

### Option 2: Run the Sample Data Script

If you want to quickly test with sample data:

```bash
bun run scripts/update-volunteer-sample-data.ts
```

This will:
- Find the first volunteer in your database
- Update them with realistic sample data
- Show confirmation message

**Sample data includes:**
- Title: "Full Stack Developer"
- Skills: React, Node.js, TypeScript, MongoDB, Next.js, TailwindCSS
- Hourly Rate: ₹500/hr
- NGO Pays: ₹750/hr
- Success Rate: 95%
- Response Time: < 4 hours
- Status: "Available for new projects"
- Projects: 12 completed, 2 active
- Rating: 4.8/5

### Option 3: Direct Database Update

If you have MongoDB Compass or access to your database, you can manually update volunteers:

```javascript
db.users.updateOne(
  { email: "volunteer@example.com" },
  {
    $set: {
      title: "Full Stack Developer",
      skills: ["React", "Node.js", "TypeScript"],
      hourlyRate: 500,
      ngoHourlyRate: 750,
      availability: "flexible",
      successRate: 95,
      responseTime: "< 4 hours",
      currentWorkStatus: "Available for new projects",
      completedProjects: 12,
      activeProjects: 2,
      rating: 4.8,
      bio: "Passionate developer contributing to meaningful causes",
      location: "Mumbai, India"
    }
  }
)
```

## What You'll See After Update

### Grid View Cards Will Show:
- ✅ Name with avatar
- ✅ **Professional Title** below name
- ✅ Location (if set)
- ✅ **Hourly rates** (volunteer rate + NGO rate side-by-side in gradient box)
- ✅ **Success Rate, Response Time, Rating** (in 3-column stats grid)
- ✅ **Current Work Status** (color-coded: green if "Available")
- ✅ **Projects** (completed and active counts)
- ✅ **Skills** (first 3 with +X overflow)
- ✅ View Profile & Mail buttons

### List View Cards Will Show:
- ✅ Larger avatar with name and title
- ✅ **4-stat performance grid** (Success, Response, Rating, Completed)
- ✅ **All skills** (up to 8 visible with +X more)
- ✅ **Current work status** with color indicator
- ✅ **Pricing card** (volunteer rate + NGO rate)
- ✅ Active projects count
- ✅ View Profile & Contact buttons

### Profile Page Will Show:
- ✅ Hero with name and **professional title**
- ✅ **4 performance stat cards** (Success Rate, Rating, Completed Projects, Response Time)
- ✅ **Pricing card** in sidebar (volunteer rate + NGO rate)
- ✅ **Current Work Status** card with pulse animation
- ✅ **Skills section** with all skills as badges
- ✅ Work Experience timeline
- ✅ Education timeline

## Visual Indicators

### Color-Coded Status:
- 🟢 **Green pulse** = "Available" (current work status contains "available")
- 🟠 **Amber** = "Busy" (current work status contains "busy")
- 🔴 **Red** = Not available

### Success Rate Colors:
- 🟢 **Green** = 90%+ (excellent)
- 🔵 **Blue** = 75-89% (good)
- 🟠 **Amber** = 60-74% (fair)
- 🔴 **Red** = <60% (needs improvement)

## Placeholder Messages

If fields are empty, cards now show helpful messages:
- **No title set** (if title is missing)
- **Status not set** (if work status is missing)
- **No skills listed** (if skills array is empty)
- **N/A** (for response time and rating if missing)
- **0** (for numeric fields like success rate, projects)

This way, volunteers know what information they need to add!

## Troubleshooting

### "Cards still look empty"
- Make sure you're signed in as a volunteer (not NGO)
- Go to Settings → Profile tab
- Fill in at least: Title, Skills, Hourly Rate, Current Work Status
- Click Save Profile
- Refresh the Volunteers page

### "Settings page doesn't have Profile tab"
- Make sure you're logged in as a **volunteer** (not NGO)
- The Profile tab only appears for volunteers
- NGOs have different settings

### "Script error when running update-volunteer-sample-data.ts"
- Make sure MongoDB is connected (check .env.local)
- Make sure at least one volunteer account exists
- Check terminal output for specific error messages

## Success! 🎉

Once you update the data, you'll see **beautiful, professional volunteer cards** with:
- Creative gradient designs
- Color-coded performance metrics
- Comprehensive professional information
- Clear pricing for both volunteers and NGOs
- Skills showcased prominently
- Current availability status

Happy volunteering! 💚
