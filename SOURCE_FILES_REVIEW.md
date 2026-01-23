# 📱 Source Files (/src) - Comprehensive Review

**Date:** January 21, 2026
**Status:** Complete analysis with action items

---

## 📋 Summary

The source directory contains critical application entry points, global styles, and core layout components. Most code is well-structured, but there are issues with:
- Debug logging in production code
- Legacy components marked as unused but still present
- Some inconsistencies in routing and navigation

---

## 📂 Entry Points Analysis

### 1. main.jsx - React Application Entry Point

**Status:** ⚠️ NEEDS FIXES

**Current Code Issues:**

```javascript
// Line 9: Console log in production
console.log('main.jsx loading...');

// Line 47: Another production console log
console.log('App rendered successfully');

// Lines 11-33: Fatal error UI with inline styles
function renderFatalError(title, error) {
  console.error(title, error);
  const rootEl = document.getElementById('root');
  if (!rootEl) return;

  rootEl.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.style.padding = '20px';
  wrap.style.color = 'red';
  wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  // ... creates inline styled error UI
}

// Line 50: Rethrows after rendering (possible double logging)
throw error;
```

**Findings:**

✅ **Strengths:**
- Proper error boundary implementation with fallback UI
- Safe DOM creation (no innerHTML injection with user data)
- Root element validation

⚠️ **Issues:**
1. Console.log statements not gated behind dev flag (line 9, 47)
2. Fatal error UI uses inline styles instead of theme tokens
3. Error is rethrown after rendering (could cause double-logging)
4. No focus management in fatal error UI
5. No accessible messaging (no role attributes, no aria-label)

**Action Plan:**
- [ ] Gate console logs with `import.meta.env.DEV`
- [ ] Create `FatalErrorScreen.jsx` component with themed styling
- [ ] Decide error rethrow behavior (remove or keep for external handlers)
- [ ] Add ARIA roles and labels to fatal error UI

---

### 2. test-main.jsx - Test Environment Entry Point

**Status:** ⚠️ MINIMAL USE - NEEDS REVIEW

**Current Code Issues:**

```javascript
// Multiple console.log statements without dev gating
console.log('Root element found:', rootElement);
console.log('Root created successfully');
console.log('Render called successfully');

// Inline styles in renderFatal function (lines 18-24)
wrap.style.padding = '20px';
wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
// ... etc
```

**Findings:**

⚠️ **Issues:**
1. Appears to be a manual smoke test, not part of default build
2. Verbose console logs (4 log statements)
3. Inline styles that diverge from theme system
4. Similar fatal error UI to main.jsx (duplicated code)
5. No referenced in package.json build config

✅ **Strengths:**
- Safe DOM creation
- Error handling structure is sound

**Action Plan:**
- [ ] Determine if this is actively used
- [ ] If kept: gate logs, extract fatal UI component
- [ ] If not used: consider moving to separate test directory or removing
- [ ] Add to .gitignore or docs if for temporary testing

---

## 🎨 Global Styles Analysis

### 3. index.css - Design Token System

**Status:** ✅ GOOD - Minor improvements needed

**Current Implementation:**

The file defines a comprehensive token system organized into:
- Color system (surfaces, text, accents, eras, borders, overlays)
- Typography (font families, type scale, line heights, weights)
- Spacing system (unit-based scale from 8px to 128px)
- Motion tokens (durations, easing functions)
- Layout tokens (container max, padding, grid, z-index scale)
- Base styles (box-sizing, html, body)
- Reduced motion support
- Custom scrollbar styling

**Findings:**

✅ **Strengths:**
- Well-organized token system
- Comprehensive coverage of design areas
- Fluid typography with clamp()
- Proper reduced motion support
- Custom scrollbar styling with theming

⚠️ **Issues:**
1. **Body padding-bottom: 80px** (line 157) affects all layouts
   - May break layouts without bottom navigation
   - Should be conditional or scoped
2. **Missing token references** in components (e.g., `--glass-dark`, `--glass-border`, `--text-tiny` used in BottomNav.css but not defined in root)
3. **Imports only glassmorphism.css** - other shared style files may not be loaded

**Token Consistency Check:**

✅ Defined tokens that should exist globally:
- `--surface-0`, `--surface-1`, `--surface-2`, `--surface-3`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--accent-neon`, `--accent-primary`, `--accent-secondary`, `--accent-warm`, `--accent-purple`
- `--border-subtle`, `--border-visible`
- `--space-xs` through `--space-section`
- `--duration-micro` through `--duration-cinematic`
- `--ease-out`, `--ease-in-out`, `--ease-snap`
- `--container-max`, `--container-padding`, `--grid-columns`, `--grid-gap`
- `--z-base`, `--z-elevated`, `--z-sticky`, `--z-modal`, `--z-overlay`

⚠️ **Possibly Missing:**
- `--glass-dark`, `--glass-border`, `--glass-light` (referenced in BottomNav.css but not found in index.css)
- `--text-tiny` (referenced in BottomNav.css)
- `--radius-md` (referenced in multiple files but not explicitly in main token list)

**Action Plan:**
- [ ] Review body padding-bottom approach - make conditional via `.has-bottom-nav` class
- [ ] Add/verify `--glass-*` tokens in glassmorphism.css import or index.css
- [ ] Add missing typography tokens (`--text-tiny`)
- [ ] Document all required token definitions
- [ ] Audit all component files for undefined token references

---

### 4. App.css - Application Layout Styles

**Status:** ✅ GOOD - Verify usage

**Current Code:**

```css
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1 1 auto;
  min-width: 0;
}

.app-footer {
  padding: var(--space-xl) var(--container-padding);
  text-align: center;
  border-top: 1px solid var(--border-subtle);
}
```

**Findings:**

✅ **Strengths:**
- Simple, focused layout structure
- Proper flex layout for sticky footer pattern
- Uses design tokens appropriately
- Minimal and maintainable

⚠️ **Issue:**
- Need to verify these classes are actually used in `AppLayout.jsx`
- If unused, can be removed or merged into component-scoped styles

**Action Plan:**
- [ ] Search codebase for `.app`, `.app-main`, `.app-footer` class usage
- [ ] If used in AppLayout.jsx: confirm all classes are applied
- [ ] If unused: consolidate into component CSS or remove

---

## 🔀 Router & Layout Components

### 5. App.jsx - Root Application Component

**Status:** ✅ GOOD - Minor concerns

**Current Implementation:**

Uses `HashRouter` for routing (good for static hosting). Provides 8 context providers and renders 18 lazy-loaded pages. Includes `MobileNavigation` globally.

**Findings:**

✅ **Strengths:**
- Proper lazy loading for code splitting
- Comprehensive context providers for features
- ErrorBoundary at app level
- SEO initialization and accessibility helpers
- Page transitions and visual effects

⚠️ **Concerns:**
1. **HashRouter vs BrowserRouter trade-off**
   - HashRouter: Works with GitHub Pages, hash-based routing (#/path)
   - BrowserRouter: Clean URLs but requires server config
   - **Action:** Confirm hosting requirements

2. **MobileNavigation rendered globally**
   - All pages pay the cost of rendering bottom nav
   - Some full-screen pages (studio, immersive) may not need it
   - Currently rendered despite having `MobileNavigation` component

3. **Provider nesting is 8 levels deep**
   - All pages load all context providers
   - Could lazy-load contexts for features used only on some pages
   - Consider: Could split providers by feature area

4. **Duplicate navigation components**
   - App.jsx renders `MobileNavigation` (from `/src/components/mobile/`)
   - But BottomNav.jsx also exists in `/src/components/`
   - Need to clarify which is active

**Action Plan:**
- [ ] Verify HashRouter is required for deployment
- [ ] Hide MobileNavigation on full-screen routes (studio, immersive mode, graph view)
- [ ] Document the routing strategy
- [ ] Decide between MobileNavigation vs BottomNav and remove unused one
- [ ] Evaluate provider lazy-loading opportunities

---

## 🏗️ Layout Components

### 6. Layout.jsx - Legacy Layout Component

**Status:** ⚠️ LEGACY - MARKED FOR REMOVAL

**Current Status:**

File header clearly states:
```
/**
 * Layout.jsx - LEGACY COMPONENT (NOT CURRENTLY IN USE)
 *
 * This layout was used in an earlier version of the app.
 * The app currently uses AppLayout.jsx instead.
 *
 * Keeping this for reference or potential future use.
 * Routes below have been updated to match actual App.jsx routes.
 */
```

**Findings:**

- ✅ Routes have been updated to match current App.jsx
- Component renders a full mainframe UI with sidebar and header
- No longer used but preserved for reference

**Action Plan:**
- [ ] **REMOVE** Layout.jsx if not being actively developed
- [ ] **REMOVE** Layout.css (legacy styles)
- [ ] If keeping for reference: move to `/docs/reference/` or archive
- [ ] Document the transition to AppLayout.jsx in code comments

---

### 7. Layout.css - Legacy Layout Styles

**Status:** ⚠️ LEGACY - ASSOCIATED WITH UNUSED Layout.jsx

**Current Issues:**

```css
/* Scoped tokens - only for this layout */
.mainframe-container {
  --bg-dark: #0a0a0f;
  --bg-panel: #14141a;
  /* ... 30+ custom properties duplicating main tokens */
}

/* Would have forced full-screen layout */
.mainframe-container {
  height: 100vh; /* or 100dvh */
  width: 100vw;
}
```

**Findings:**

- Duplicates token definitions from index.css (maintenance burden)
- Uses legacy naming conventions different from current system
- Scoped tokens prevent conflicts but aren't needed if component is removed

**Action Plan:**
- [ ] **DELETE** Layout.css (paired with Layout.jsx removal)
- [ ] No migration needed - Layout.jsx is not being used

---

## 🎮 Interactive Components

### 8. CommandPalette.jsx - Keyboard Command Interface

**Status:** ⚠️ NEEDS FIXES

**Current Implementation:**

A comprehensive search/command palette with:
- Static nav items and system commands
- Fuse-based fuzzy search for entities and words
- Keyboard navigation support
- Debounced search
- Rich accessibility attributes

**Code Issues Identified:**

1. **Arrow Key Handling - Modulo by Zero Bug** (Line 113-120)

```javascript
const handleKeyDown = (e) => {
  if (results.length === 0) return; // ✅ Guard exists

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setSelectedIndex(prev => (prev + 1) % results.length); // Safe
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setSelectedIndex(prev => (prev - 1 + results.length) % results.length); // Safe
  }
};
```

**Verdict:** ✅ Actually has guard! This is safe.

2. **Navigation Item Issues** (Lines 21-28)

```javascript
const navItems = useMemo(() => [
  { type: 'nav', name: 'Home', path: '/', icon: <Database /> },
  { type: 'nav', name: 'Domains', path: '/domains', icon: <Database /> },
  { type: 'nav', name: 'Dictionary', path: '/dictionary', icon: <BookOpen /> },
  { type: 'nav', name: 'Search', path: '/search', icon: <Search /> },
  { type: 'nav', name: 'Studio', path: '/studio', icon: <Activity /> },
  { type: 'nav', name: 'Settings', path: '/settings', icon: <Code /> },
  { type: 'nav', name: 'About', path: '/about', icon: <Info /> }
], []);
```

**Verdict:** ✅ All paths exist and are current (verified against App.jsx)

**Note:** Original checklist mentioned routing to `/architecture` and `/docs` but CommandPalette doesn't include these. They ARE now routed (added in Phase 1), but CommandPalette doesn't expose them.

3. **System Commands** (Lines 32-36)

```javascript
const systemCommands = useMemo(() => [
  { type: 'cmd', name: 'Toggle Studio Mode', action: 'toggle_audio', icon: <Activity /> },
  { type: 'cmd', name: 'Clear Workspace', action: 'clear_workspace', icon: <X /> },
  { type: 'cmd', name: 'System Reboot (Reload)', action: 'reload', icon: <Command /> }
], []);
```

**Issue:** `Toggle Studio Mode` action is `'toggle_audio'` but handler dispatch doesn't match actual command names.

4. **Command Execution** (Lines 133-143)

```javascript
const handleSelect = (item) => {
  // ...
  } else if (item.type === 'cmd') {
    if (item.action === 'reload') window.location.reload();
    if (item.action === 'toggle_audio') {
      window.dispatchEvent(new CustomEvent('studio-toggle'));
    }
    if (item.action === 'clear_workspace') {
      window.dispatchEvent(new CustomEvent('workspace-clear'));
    }
  }
};
```

**Verdict:** ✅ Handlers exist but need verification they're being listened for.

**Findings Summary:**

✅ **Strengths:**
- Good Fuse search implementation with multiple indices
- Proper debouncing (150ms)
- Comprehensive accessibility: role, aria-* attributes
- Guard for empty results
- Keyboard navigation works correctly

⚠️ **Issues:**
1. Missing Architecture and Docs from nav items
2. Theme command mentioned but no handler (if ever added)
3. No focus trap (non-standard but helpful for modal)
4. Command event listeners need verification elsewhere

✅ **Accessibility is good:**
- ARIA modal, searchbox, listbox, options
- aria-activedescendant for keyboard nav
- aria-autocomplete for screen readers
- sr-only label for input
- Keyboard shortcuts documented (Ctrl+K)

**Action Plan:**
- [ ] Add Architecture and Docs to navItems
- [ ] Verify 'toggle_audio' event is being listened to
- [ ] Add focus trap if UX testing shows it's helpful
- [ ] Consider adding more commands (Settings, About, etc.)

---

### 9. CommandPalette.css - Command Palette Styling

**Status:** ✅ GOOD

**Current Implementation:**

Comprehensive styling including:
- Modal overlay and content box
- Search input styling
- Result item styling with selection state
- Animations (fadeIn, slideDown)
- Footer with keyboard shortcuts
- Reduced motion support

**Findings:**

✅ **Strengths:**
- Has proper reduced motion media query (line 169-187)
- Responsive animations
- Uses design tokens appropriately
- Clear visual hierarchy

✅ **Reduced Motion Implementation:**

```css
@media (prefers-reduced-motion: reduce) {
  .cmd-overlay,
  .cmd-modal,
  .cmd-item,
  .cmd-item-arrow {
    animation: none;
    transition: none;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideDown {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
```

**Issue identified in original checklist is INCORRECT** - CommandPalette.css DOES have reduced motion support!

**Action Plan:**
- [ ] No changes needed - CSS is well-implemented
- ✅ Remove false "animations ignore reduced-motion" claim from checklist

---

### 10. BottomNav.jsx - Mobile Bottom Navigation

**Status:** ✅ GOOD - Navigation duplication needs resolving

**Current Implementation:**

```javascript
const HIDE_ON_ROUTES = [
  '/dictionary/compare',
  '/studio',
  '/dictionary/galaxy'
];

export function BottomNav() {
  const location = useLocation();

  if (HIDE_ON_ROUTES.some((route) => location.pathname.startsWith(route))) {
    return null;
  }
  // ... renders nav items
}
```

**Findings:**

⚠️ **Key Issue: BottomNav vs MobileNavigation**

App.jsx renders `<MobileNavigation />` but BottomNav.jsx exists separately. Need to clarify:
- Are these the same component?
- Is one unused?
- Should they be consolidated?

✅ **Strengths:**
- Proper route-based hiding logic
- Includes studio and full-screen pages
- Good keyboard accessibility (aria-label on container and items)
- Proper icon hidden with aria-hidden
- 44px minimum touch target (line 44)
- Safe area inset for notch/home indicator support

⚠️ **Concerns:**
1. Hiding only on `/dictionary/compare`, `/studio`, `/dictionary/galaxy`
2. Should also hide on: `/studio/*` (immersive mode, etc.)
3. Should hide on architecture/docs full-screen views if they're full-screen
4. Uses token `--text-muted` that exists, but references `--text-tiny` which may not exist

**Action Plan:**
- [ ] **CLARIFY:** Is BottomNav used or is MobileNavigation used?
- [ ] If BottomNav is used: verify it's rendering instead of MobileNavigation
- [ ] Expand HIDE_ON_ROUTES to include all full-screen experiences
- [ ] Verify `--text-tiny` and `--radius-md` tokens exist

---

### 11. BottomNav.css - Bottom Navigation Styling

**Status:** ⚠️ NEEDS TOKEN VERIFICATION

**Current Issues:**

```css
.bottom-nav {
  /* Uses proper tokens */
  background: hsla(240, 18%, 10%, 0.9);
  border-top: 1px solid var(--border-subtle);
  padding: var(--space-sm);
  /* ... */
}

.bottom-nav__item {
  color: var(--text-muted);
  /* References token that should exist */
  transition: color var(--duration-micro);
  /* etc */
}
```

**Findings:**

✅ **Strengths:**
- Responsive design
- Smooth animations
- Reduced motion support
- Safe area inset for notch awareness
- Accessibility-focused (44px touch target)

⚠️ **Token References to Verify:**
- `--duration-micro` ✅ (defined in index.css line 102)
- `--ease-out` ✅ (defined in index.css line 108)
- `--radius-md` ⚠️ (referenced but need to verify in index.css)
- `--text-muted` ✅ (defined in index.css line 26)

**Action Plan:**
- [ ] Verify `--radius-md` is defined globally
- [ ] Verify all transitions use defined animation tokens
- [ ] Confirm mobile-specific styling is complete

---

## 📊 Summary Table

| File | Status | Priority | Action Required |
|------|--------|----------|-----------------|
| main.jsx | ⚠️ Needs fixes | HIGH | Gate logs, extract fatal UI |
| test-main.jsx | ⚠️ Review | MEDIUM | Remove or relocate |
| index.css | ✅ Good | LOW | Document body padding approach |
| App.css | ✅ Good | LOW | Verify usage in AppLayout |
| App.jsx | ✅ Good | MEDIUM | Hide nav on full-screen routes |
| Layout.jsx | ⚠️ Legacy | HIGH | Remove unused component |
| Layout.css | ⚠️ Legacy | HIGH | Remove paired with Layout.jsx |
| CommandPalette.jsx | ✅ Good | LOW | Add missing nav items |
| CommandPalette.css | ✅ Good | NONE | ✅ No changes needed |
| BottomNav.jsx | ✅ Good | MEDIUM | Clarify vs MobileNavigation |
| BottomNav.css | ✅ Good | LOW | Verify token definitions |

---

## 🎯 Implementation Plan

### Phase 1: Critical Fixes (Priority: HIGH)
1. **main.jsx**
   - Gate console logs behind `import.meta.env.DEV`
   - Create `FatalErrorScreen.jsx` component with themed UI
   - Remove or reframe error rethrow

2. **Remove Legacy Layout**
   - Delete Layout.jsx
   - Delete Layout.css
   - Update any imports

### Phase 2: Important Fixes (Priority: MEDIUM)
3. **App.jsx**
   - Hide MobileNavigation on full-screen routes
   - Document HashRouter requirement

4. **BottomNav.jsx / MobileNavigation Clarification**
   - Determine which is active
   - Consolidate duplicates
   - Expand hide list

5. **test-main.jsx**
   - Gate console logs or relocate file
   - Extract fatal error UI component

### Phase 3: Polish (Priority: LOW)
6. **Token Verification**
   - Verify all CSS token references exist
   - Document missing tokens
   - Add missing definitions

7. **CommandPalette.jsx**
   - Add Architecture and Docs nav items
   - Verify event listener setup

---

## ✅ Verification Checklist

- [ ] All console.log statements gated or removed
- [ ] Fatal error UI uses themed styling
- [ ] Layout.jsx and Layout.css removed
- [ ] MobileNavigation properly hidden on full-screen routes
- [ ] Token definitions are complete and consistent
- [ ] No duplicate nav components (BottomNav vs MobileNavigation resolved)
- [ ] CommandPalette includes all new routes
- [ ] All CSS animations respect prefers-reduced-motion

---

**Generated:** January 21, 2026
**Review Status:** Complete
**Next Step:** Begin Phase 1 implementation
