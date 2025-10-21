# Placeholders to Replace for Production

This document lists all placeholder content that needs to be replaced with real content before deploying to production.

## 🖼️ Placeholder Images

### Component Images
**File: `components/numbers-that-speak.tsx`**
- `/placeholder.svg?height=271&width=431` - Schedule dashboard image
- `/placeholder.svg?height=17&width=295` - Y-axis line chart
- `/placeholder.svg?height=13&width=295` - Y-axis line chart (2 instances)

**File: `components/effortless-integration.tsx`**
- `/placeholder.svg?height=300&width=482` - Main integration frame
- `/placeholder.svg?height=358&width=500` - Integration group
- `/placeholder.svg?height=600&width=600` - Integration group 2
- `/placeholder.svg?height=714&width=677` - Ellipse background
- `/placeholder.svg?height=28&width=28` - Small icon group
- `/placeholder.svg?height=42&width=42` - Frame icon (2 instances)
- `/placeholder.svg?height=23&width=27` - Frame icon
- `/placeholder.svg?height=30&width=25` - Frame icon (2 instances)
- `/placeholder.svg?height=18&width=18` - Small group icon
- `/placeholder.svg?height=31&width=29` - Frame icon
- `/placeholder.svg?height=24&width=24` - Frame icon

**File: `components/project-card.tsx`**
- `/placeholder.svg` - Fallback for project banner images

**File: `components/testimonials-section.tsx`**
- `/placeholder.svg` - Fallback for testimonial images

**File: `components/your-work-in-sync.tsx`**
- `/placeholder.svg` - Fallback for arrow up image

**File: `components/smart-simple-brilliant.tsx`**
- `/placeholder.svg` - Fallback for multiple feature images (4 instances)

**File: `app/profile-creation/page.tsx`**
- `/placeholder.svg` - Fallback for avatar images

### Mock Data Images
**File: `lib/init-mock-data.ts`**
- `/placeholder.svg?height=160&width=400&query=project${i}` - Project banner images for mock users

## 🔗 Placeholder URLs

### Example URLs
**File: `lib/init-mock-data.ts`**
- `https://example.com/project-${index}-${i}` - Mock project links
- `https://example.com` - Mock portfolio links

**File: `scripts/generate-mock-data.ts`**
- `https://example.com` - Mock portfolio links

### Form Placeholders
**File: `components/project-form.tsx`**
- `https://example.com/banner.jpg` - Banner URL placeholder
- `https://example.com` - Project URL placeholder

## 📝 Placeholder Text

### Form Placeholders
**File: `components/project-form.tsx`**
- "My Awesome Project" - Project title placeholder
- "Describe your project..." - Project description placeholder

**File: `components/auth-modal.tsx`**
- "Enter username" - Username input placeholder
- "Enter password" - Password input placeholder

**File: `app/profile-creation/page.tsx`**
- "Enter display name" - Display name placeholder
- "Your quote here..." - Quote placeholder
- "Tell us about yourself..." - Bio placeholder
- "Twitter handle (without @)" - Twitter input placeholder
- "GitHub username" - GitHub input placeholder
- "Website URL" - Website input placeholder
- "LinkedIn username" - LinkedIn input placeholder
- "Goal title" - Goal title placeholder
- "Goal description" - Goal description placeholder
- "Link title" - Custom link title placeholder
- "URL" - Custom link URL placeholder

## 🎭 Mock Data

### Mock User Names
**File: `lib/init-mock-data.ts`**
- 15 mock user profiles with generated names, bios, and projects
- Mock project titles and descriptions
- Mock social media handles
- Mock goal titles and descriptions

### Mock Testimonials
**File: `components/testimonials-section.tsx`**
- 3 mock testimonial entries with names, companies, and quotes

## 🛠️ Development Tools

### Mock Data Generation
**File: `scripts/generate-mock-data.ts`**
- Script for generating additional mock data
- Mock user profile generation

**File: `app/dev-tools/page.tsx`**
- "Seed Mock Data" button for development testing
- Mock data seeding functionality

## 📋 Replacement Priority

### High Priority (Must Replace)
1. **Mock User Data** - Replace with real user authentication
2. **Example URLs** - Replace with actual project URLs
3. **Placeholder Images** - Replace with real product screenshots
4. **Mock Testimonials** - Replace with real customer testimonials

### Medium Priority (Should Replace)
1. **Form Placeholders** - Update with more specific guidance
2. **Mock Project Data** - Replace with real project examples

### Low Priority (Nice to Have)
1. **Development Tools** - Keep for testing but hide in production
2. **Fallback Images** - Keep as fallbacks but add real images

## 🚀 Production Checklist

- [ ] Replace all `/placeholder.svg` images with real product images
- [ ] Update all `https://example.com` URLs with real project URLs
- [ ] Replace mock user data with real authentication system
- [ ] Update testimonials with real customer feedback
- [ ] Replace mock project data with real project examples
- [ ] Update form placeholders with more specific guidance
- [ ] Hide or remove development tools in production build
- [ ] Test all replaced content for proper display and functionality

## 📁 Files to Update

1. `components/numbers-that-speak.tsx`
2. `components/effortless-integration.tsx`
3. `components/project-card.tsx`
4. `components/testimonials-section.tsx`
5. `components/your-work-in-sync.tsx`
6. `components/smart-simple-brilliant.tsx`
7. `components/project-form.tsx`
8. `components/auth-modal.tsx`
9. `app/profile-creation/page.tsx`
10. `lib/init-mock-data.ts`
11. `scripts/generate-mock-data.ts`
12. `app/dev-tools/page.tsx`

## 💡 Notes

- All placeholder images are currently using the `/placeholder.svg` fallback
- Mock data is generated automatically on first load
- Development tools should be hidden in production builds
- Consider adding environment variables to control mock data generation
- Test all replacements thoroughly before deploying to production
