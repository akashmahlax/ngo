# Dashboard StatsCard Fix - Component Export Error

## Error Summary
**Error Type**: Runtime Error  
**Error Message**: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.  
**Location**: `components/dashboard/stats-card.tsx:48` and `app/(dashboard)/volunteer/page.tsx:204`

---

## Root Cause

The `StatsCard` component expects `iconName` prop (a string like "FileText"), but both dashboard pages were passing `icon` prop (JSX elements like `<FileText className="h-5 w-5" />`).

### Component Definition
```typescript
// components/dashboard/stats-card.tsx
interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  iconName: keyof typeof Icons  // ← Expects string
  trend?: {...}
  className?: string
  onClick?: () => void
}
```

### Incorrect Usage
```tsx
// Before - WRONG ❌
<StatsCard
  title="Total Applications"
  value={totalApplications}
  icon={<FileText className="h-5 w-5" />}  // ← JSX element
  description="All time"
/>
```

This caused `Icon` to be `undefined` when trying to access `Icons[iconName]`.

---

## Solution Applied

### 1. Volunteer Dashboard (`app/(dashboard)/volunteer/page.tsx`)

#### Changed StatsCard Calls
```tsx
// After - CORRECT ✅
<StatsCard
  title="Total Applications"
  value={totalApplications}
  iconName="FileText"  // ← String reference
  description="All time"
/>
```

#### All 5 Stats Fixed
```tsx
<StatsCard iconName="FileText" title="Total Applications" value={totalApplications} />
<StatsCard iconName="Clock" title="Under Review" value={appliedCount} />
<StatsCard iconName="Star" title="Shortlisted" value={shortlistedCount} />
<StatsCard iconName="CheckCircle" title="Accepted" value={acceptedCount} />
<StatsCard iconName="Briefcase" title="Available Jobs" value={totalJobs} />
```

#### Removed Unused Imports
- Removed: `Clock` (no longer used directly)
- Removed: `MapPin` (was never used)

---

### 2. NGO Dashboard (`app/(dashboard)/ngo/page.tsx`)

#### Changed StatsCard Calls
```tsx
// After - CORRECT ✅
<StatsCard
  title="Active Jobs"
  value={activeJobs.length}
  iconName="Briefcase"  // ← String reference
  description={`${closedJobs.length} closed`}
/>
```

#### All 5 Stats Fixed
```tsx
<StatsCard iconName="Briefcase" title="Active Jobs" value={activeJobs.length} />
<StatsCard iconName="FileText" title="Total Applications" value={totalApplications} />
<StatsCard iconName="Clock" title="Pending Review" value={appliedApplications} />
<StatsCard iconName="CheckCircle" title="Accepted" value={acceptedApplications} />
<StatsCard iconName="TrendingUp" title="Acceptance Rate" value={`${acceptanceRate}%`} />
```

#### Removed Unused Imports
- Removed: `Clock` (no longer used directly)
- Removed: `FileText` (no longer used directly)
- Removed: `XCircle` (was never used)

---

## How StatsCard Works

### Internal Implementation
```tsx
export function StatsCard({ iconName, ... }: StatsCardProps) {
  // 1. Get icon from lucide-react by string name
  const Icon = Icons[iconName]
  
  // 2. Cast to React component type
  const IconComponent = Icon as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>>
  
  // 3. Render the icon
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs">{description}</p>}
      </CardContent>
    </Card>
  )
}
```

### Why This Approach?
1. **Centralized Icon Logic**: Component handles icon rendering internally
2. **Type Safety**: `keyof typeof Icons` ensures only valid icon names
3. **Consistency**: All stats cards render icons the same way
4. **Simplicity**: Consumers just pass a string, not JSX

---

## Available Icon Names

The `iconName` prop accepts any valid Lucide React icon name (string):

### Commonly Used in Dashboards
- `"Briefcase"` - Job/work related
- `"FileText"` - Documents/applications
- `"Clock"` - Pending/time
- `"CheckCircle"` - Success/accepted
- `"Star"` - Featured/shortlisted
- `"TrendingUp"` - Growth/trends
- `"Users"` - People/volunteers
- `"AlertCircle"` - Warnings/attention needed
- `"Plus"` - Add new
- `"Eye"` - View/visibility
- `"Send"` - Submit/send

### Full List
Any icon from `lucide-react` package can be used. See: https://lucide.dev/icons/

---

## Testing Checklist

### ✅ Volunteer Dashboard
- [x] Page loads without errors
- [x] All 5 stat cards display correctly
- [x] Icons render properly (FileText, Clock, Star, CheckCircle, Briefcase)
- [x] Values display correctly
- [x] Descriptions show under values
- [x] No console errors
- [x] Hover effects work

### ✅ NGO Dashboard
- [x] Page loads without errors
- [x] All 5 stat cards display correctly
- [x] Icons render properly (Briefcase, FileText, Clock, CheckCircle, TrendingUp)
- [x] Values display correctly
- [x] Descriptions show under values
- [x] No console errors
- [x] Hover effects work

---

## Files Modified

### 1. `app/(dashboard)/volunteer/page.tsx`
**Lines Changed**: 203-235 (StatsCard props)

**Changes**:
- Changed `icon={<FileText />}` to `iconName="FileText"`
- Changed `icon={<Clock />}` to `iconName="Clock"`
- Changed `icon={<Star />}` to `iconName="Star"`
- Changed `icon={<CheckCircle />}` to `iconName="CheckCircle"`
- Changed `icon={<Briefcase />}` to `iconName="Briefcase"`
- Removed unused `Clock` and `MapPin` imports

### 2. `app/(dashboard)/ngo/page.tsx`
**Lines Changed**: 201-233 (StatsCard props)

**Changes**:
- Changed `icon={<Briefcase />}` to `iconName="Briefcase"`
- Changed `icon={<FileText />}` to `iconName="FileText"`
- Changed `icon={<Clock />}` to `iconName="Clock"`
- Changed `icon={<CheckCircle />}` to `iconName="CheckCircle"`
- Changed `icon={<TrendingUp />}` to `iconName="TrendingUp"`
- Removed unused `Clock`, `FileText`, and `XCircle` imports

### 3. `components/dashboard/stats-card.tsx`
**No changes needed** - Component was correct, dashboards were using it incorrectly

---

## Related Components

### Other Components Using StatsCard
If you find other pages using `StatsCard`, ensure they follow the correct pattern:

```tsx
// ✅ CORRECT
<StatsCard iconName="Users" title="Total Users" value={100} />

// ❌ WRONG
<StatsCard icon={<Users />} title="Total Users" value={100} />
```

### When to Use Each Approach

#### Use `iconName` prop (StatsCard pattern):
- Standardized stat cards in dashboards
- Consistent icon sizing and styling
- Simple icon display without custom styling

#### Use JSX icon directly:
- Custom icon styling needed
- Multiple icons in same component
- Dynamic icon colors or sizes
- Icons in buttons, badges, etc.

---

## Prevention

### TypeScript Type Safety
The component already has TypeScript types that should catch this:

```typescript
interface StatsCardProps {
  iconName: keyof typeof Icons  // Type enforces valid icon names
}
```

If you see this error:
```
Type '{ icon: Element; title: string; ... }' is not assignable to type 'StatsCardProps'.
  Object literal may only specify known properties, and 'icon' does not exist in type 'StatsCardProps'.
```

**Solution**: Change `icon={<Icon />}` to `iconName="Icon"`

---

## Summary

### Problem
Dashboard pages were passing JSX elements (`icon` prop) to StatsCard component that expected icon names (`iconName` prop).

### Solution
- Updated volunteer dashboard: 5 StatsCard components fixed
- Updated NGO dashboard: 5 StatsCard components fixed
- Removed unused icon imports from both files
- Total: 10 components corrected

### Result
✅ Both dashboards now render correctly  
✅ No more "invalid element type" errors  
✅ Icons display properly in all stat cards  
✅ Code follows component's intended API  

---

**Fix Date**: December 2024  
**Status**: ✅ Resolved and Tested
