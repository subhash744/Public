# Placeholder Reference Guide

Quick reference list of all placeholders in the codebase for future cleanup.

---

## 📋 Complete Placeholder List

### 1. Fallback Images (Safe to Keep)

These are fallback images that only appear when users don't provide their own:

| File | Line | Placeholder | Purpose | Action Needed |
|------|------|-------------|---------|---------------|
| `components/project-card.tsx` | 54 | `/placeholder.jpg` | Project banner fallback | Optional: Replace with branded default |
| `app/profile-creation/page.tsx` | 160 | `/placeholder.jpg` | Avatar preview fallback | Optional: Replace with initials generator |
| `components/testimonials-section.tsx` | 87 | `/placeholder.jpg` | Testimonial image fallback | Keep (real images exist) |

---

### 2. Marketing Component Placeholders (Optional Removal)

These SVG placeholders are in marketing components not used in core leaderboard:

#### `components/effortless-integration.tsx`
- Line 38: `/placeholder.svg?height=300&width=482` - Integration frame
- Line 39: `/placeholder.svg?height=358&width=500` - Integration group
- Line 40: `/placeholder.svg?height=600&width=600` - Integration group 2
- Line 41: `/placeholder.svg?height=714&width=677` - Ellipse background
- Line 42: `/placeholder.svg?height=28&width=28` - Icon group
- Line 43: `/placeholder.svg?height=42&width=42` - Frame icon
- Line 44: `/placeholder.svg?height=23&width=27` - Frame icon
- Line 45: `/placeholder.svg?height=30&width=25` - Frame icon
- Line 46: `/placeholder.svg?height=18&width=18` - Group icon
- Line 47: `/placeholder.svg?height=30&width=20` - Group icon
- Line 48: `/placeholder.svg?height=30&width=20` - Group icon
- Line 49: `/placeholder.svg?height=31&width=29` - Frame icon
- Line 50: `/placeholder.svg?height=42&width=42` - Frame icon
- Line 51: `/placeholder.svg?height=24&width=24` - Frame icon

**Total: 14 placeholders**

#### `components/numbers-that-speak.tsx`
- Line 45: `/placeholder.svg?height=271&width=431` - Schedule dashboard
- Line 46: `/placeholder.svg?height=17&width=295` - Y-axis line
- Line 47: `/placeholder.svg?height=13&width=295` - Y-axis line
- Line 48: `/placeholder.svg?height=13&width=295` - Y-axis line

**Total: 4 placeholders**

#### `components/smart-simple-brilliant.tsx`
- Line 113: `/placeholder.svg` - Feature image 1
- Line 154: `/placeholder.svg` - Feature image 2
- Line 242: `/placeholder.svg` - Feature image 3
- Line 283: `/placeholder.svg` - Feature image 4

**Total: 4 placeholders**

---

### 3. Mock Data Generation (Development Only)

#### `lib/init-mock-data.ts` - Entire File
**Status:** ✅ DISABLED - No longer auto-runs

Contains mock data for 15 fake users:
- Mock names, bios, quotes
- Fake GitHub/Twitter/LinkedIn handles
- Fake project data
- Fake goal data
- Mock statistics

**Usage:** Only accessible via `/dev-tools` page for testing

#### `scripts/generate-mock-data.ts` - Entire File
**Status:** Development utility only

Contains additional mock data generation utilities.

---

### 4. Development Tools

#### `app/dev-tools/page.tsx` - Entire Route
**Status:** ⚠️ Publicly accessible at `/dev-tools`

Features:
- Seed Mock Data button
- Simulate Traffic button
- Reset All Data button
- Schema Inspector

**Recommended Action:** Hide in production or add authentication

---

## 📊 Summary Statistics

| Category | Count | Status |
|----------|-------|--------|
| Fallback Images | 3 | ✅ Safe to keep |
| Marketing Placeholders | 22 | ⚠️ Optional cleanup |
| Mock Data Files | 2 | ✅ Disabled in production flow |
| Dev Tools | 1 route | ⚠️ Should hide in production |

---

## 🎯 Recommended Actions

### Priority 1: Security (Before Public Launch)
- [ ] Hide or password-protect `/dev-tools` route
- [ ] Add environment check to disable mock data in production

### Priority 2: Marketing (Optional)
- [ ] Replace or remove `effortless-integration.tsx` (14 placeholders)
- [ ] Replace or remove `numbers-that-speak.tsx` (4 placeholders)
- [ ] Replace or remove `smart-simple-brilliant.tsx` (4 placeholders)

### Priority 3: Polish (Nice to Have)
- [ ] Create branded fallback images for projects/avatars
- [ ] Add more engaging empty states
- [ ] Consider removing unused marketing components entirely

---

## ✅ What's Already Clean

- ✅ No auto-login behavior
- ✅ No fake profiles on first visit
- ✅ No mock data initialization
- ✅ Clean leaderboard experience
- ✅ Proper empty states
- ✅ Featured builders only show with real users

---

## 🔍 How to Find Placeholders in Future

Use these commands:

```bash
# Find all placeholder image references
grep -r "placeholder" --include="*.tsx" --include="*.ts"

# Find specific placeholder patterns
grep -r "placeholder\.svg" --include="*.tsx"
grep -r "placeholder\.jpg" --include="*.tsx"
grep -r "placeholder\.png" --include="*.tsx"

# Find mock data references
grep -r "initializeMockData" --include="*.tsx" --include="*.ts"
grep -r "mockNames" --include="*.tsx" --include="*.ts"
```

---

**Last Updated:** 2025-10-21  
**Status:** Production Ready (Core Features Clean)

For detailed explanations, see `CLEANUP_CHECKLIST.md`
