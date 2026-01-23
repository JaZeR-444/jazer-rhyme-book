# 📋 COMPLETE JaZeR Rhyme Book - File Review & Enhancement Checklist

**Last Updated:** January 21, 2026  
**Total Files:** 4,048 (ACTUAL COUNT - previously underestimated at 256)  
**Purpose:** Comprehensive review of every file in the /web directory for manual enhancement and optimization

---

## 📊 Progress Overview (CORRECTED COUNTS)

### **Actual File Counts:**
- **Root Files:** 26 files (previously claimed 8)
- **Public Assets:** 3,732 files (previously claimed 5) ⚠️
- **Source Files (JSX/JS/CSS):** 322 files (previously claimed 243)
  - **Components (JSX):** 120 files (previously claimed 162) ⚠️
  - **Pages (JSX):** 18 files (previously claimed 23) ⚠️
  - **Lib/Utils:** 34 files ✅ CORRECT
  - **Contexts:** 9 files (not tracked before)
  - **Styles (CSS):** 139 files (previously claimed 5) ⚠️

### **PropTypes/Documentation Coverage:**
- **Components with PropTypes:** 10/120 (8%)
- **Components with JSDoc:** 8/120 (7%)
- **Pages with PropTypes:** 0/18 (0%)
- **Total Type Coverage:** ~12% (needs significant improvement)

### **Public Assets Breakdown:**
- Markdown files: 1,912 (documentation/data)
- JSON files: 1,658 (dictionaries/metadata)
- MP3 files: 127 (audio assets)
- Other: 35 (SVG, HTML, JS, etc.)

**Overall Progress:** Work in progress - checklist being updated to reflect actual codebase

---

## ⚠️ CHECKLIST STATUS NOTICE

**IMPORTANT:** This checklist was originally created with significantly underestimated file counts.
The actual codebase is **16x larger** than originally tracked (4,048 files vs 256).

**What This Means:**
- Task completion percentages are being recalculated
- Many files were not tracked in the original checklist
- Priority has shifted to high-impact files (components, pages, core utils)
- Public assets (3,732 files) are mostly data/content files requiring different review process

**Review Strategy:**
1. ✅ Focus on critical source files (JSX/JS/CSS) - ~322 files
2. ✅ Ensure core functionality (components, pages, hooks)
3. ✅ Add PropTypes/JSDoc to all interactive components
4. ⏭️ Defer bulk data file review (JSON/MD) unless issues found

---

## 🎯 CRITICAL ACTION ITEMS (Priority Order)

### 🔴 **BLOCKING ISSUES** (Fix Before Shipping)

1. **Export Mismatches** - Components can't be imported properly
   - [x] Create `gamification/index.js` - (Verified: Already exists and is correct)
   - [x] Create `domains/index.js` - (Verified: Already exists and is correct)
   - [x] Create `motion/index.js` - (Verified: Already exists and is correct)
   - [x] Fix `mobile/index.js` - (Verified: Already contains BottomSheet, MobileNavigation, SwipeHandler exports)
   - [x] Fix `ui/index.js` - (Verified: Already contains all 20 exports including Autocomplete, etc.)
   - [x] Fix `studio/index.js` - (Verified: Already contains BeatLibraryManager, BeatUploader exports)
   - [x] Fix `workspace/index.js` - Fixed export names to match files (DraggableCard, DropZone)
   - **Impact:** Developers can't import components from barrel; must use full paths
   - **Effort:** DONE

2. **Import Path Errors** - Components won't load
   - [x] Fix `ExportDialog.jsx` (line 3) - (Verified: Path is already `../../lib/exportFormats`)
   - **Impact:** Export functionality completely broken
   - **Effort:** DONE

3. **Backwards Media Query** - Accessibility broken
   - [x] Fix `PageTransition.css` (line 15-19) - `prefers-reduced-motion: no-preference` should be `prefers-reduced-motion: reduce`
   - **Impact:** Disables animations for users WITHOUT motion sensitivity; opposite of intended
   - **Effort:** DONE

4. **Unimplemented Features** - False functionality
   - [x] Implement audio preview in `BeatLibraryManager.jsx` (line 67)
   - [x] Implement IndexedDB persistence in `BeatLibraryManager.jsx` (line 75)
   - **Impact:** Features appear to work but don't actually function
   - **Effort:** DONE

### 🟡 **HIGH PRIORITY** (Accessibility & Quality)

5. **Missing Reduced Motion Handling** - Accessibility violations
   - [x] Add `@media (prefers-reduced-motion: reduce)` to:
     - [x] Gamification CSS (AchievementUnlock, ProgressBar)
     - [x] Studio CSS (FlowAnalyzer, BeatLibraryManager - verified)
     - [x] Motion CSS (BootSequence, ScanningLines - verified)
     - [x] Mobile CSS (CompactCard, ResponsiveCard, TouchFriendlyButton, SwipeableCard - verified)
     - [x] UI CSS (Button, SearchBar, LoadingState - verified)
   - **Impact:** Users with motion sensitivity experience jarring animations
   - **Effort:** 2-3 hours

6. **Missing ARIA Attributes** - Screen reader incompatibility
   - [x] Add `aria-label` and `role` to:
     - [x] All dialog/modal components (BottomSheet, ExportDialog, ShareDialog)
     - [x] Gamification components (AchievementUnlock, ProgressBar - verified)
     - [x] Motion components (PageTransition, BootSequence, TextScramble)
     - [x] Mobile interactive components (CompactCard, SwipeableCard, TouchFriendlyButton)
   - [x] Add ARIA and Keyboard support to UI components: FIXED: MultiSelect, RadioGroup, RangeSlider, SkeletonCard.
   - [x] Add focus trap to modal components (BottomSheet, MobileHeader menu)
   - [x] Add `aria-current="page"` to active nav items
   - **Impact:** Screen readers can't announce interactive elements
   - **Effort:** 3-4 hours

7. **Security Issues** - Data exposure risk
   - [x] Fix `ShareDialog.jsx` (line 17) - Replace `btoa()` with proper encoding
   - [x] Review `MarkdownRenderer.jsx` - Verify HTML sanitization (use DOMPurify if user-generated)
   - **Impact:** Unencrypted share links; potential XSS vulnerability
   - **Effort:** 1-2 hours

### 🟢 **MEDIUM PRIORITY** (Code Quality)

8. **Missing PropTypes** - Type safety
   - [x] Add PropTypes to 20+ UI components (Button, Card, Badge, SearchBar, etc.)
   - [x] Or add JSDoc prop documentation to all components
   - **Impact:** IDE autocompletion poor; harder to catch bugs
   - **Effort:** 3-4 hours

9. **Incomplete Components** - Stubs waiting for implementation
   - [x] Implement `DraggableCard.jsx` - Add drag event handlers
   - [x] Implement `DropZone.jsx` - Add drop handlers and CSS file
   - [x] Wire up `@dnd-kit` or `react-dnd` drag-drop library
   - **Impact:** Drag-drop functionality doesn't work
   - **Effort:** 4-6 hours

10. **Performance Issues** - Optimization opportunities
    - [x] Add body scroll lock context provider - FIXED: Created ScrollLockProvider and integrated into BottomSheet/MobileHeader.
    - [x] Optimize `WorkspaceGraphD3.jsx` - FIXED: Deterministic rendering, responsive sizing, ARIA labels.
    - [x] Memoize expensive calculations - FIXED: Implemented syllable/phonetic caching and useMemo in FlowAnalyzer/RhymeDensityHeatmap.
    - **Impact:** Better performance and less code duplication
    - **Effort:** DONE

---

## 📋 Component Directory Summary

| Directory | Files | Status | Critical Issues | Fix Time |
|-----------|-------|--------|-----------------|----------|
| **Studio** | 12 | ⚠️ Partial | Missing exports, import path error, TODOs | 2-3 hrs |
| **UI** | 22 | ⚠️ Partial | 7 missing exports, no PropTypes | 3-4 hrs |
| **Workspace** | 4 | 🔴 Broken | Export mismatch, incomplete stubs | 4-5 hrs |
| **Gamification** | 2 | 🟡 Good | Missing barrel export, reduced-motion | 1-2 hrs |
| **Domains** | 2 | 🟡 Good | Export pattern, ARIA attrs | 1 hr |
| **Interactions** | 6 | ✅ Good | Only minor JSDoc additions | 30 min |
| **Mobile** | 18 | 🔴 Broken | 3 missing exports, reduced-motion | 3-4 hrs |
| **Motion** | 9 | 🔴 Broken | Backwards media query, missing barrel | 2-3 hrs |

---

---

## 🗂️ Root Configuration Files

### Build & Config
- [x] `vite.config.js` - Vite build configuration, plugins, and optimizations
  - Findings:
    - Root config now re-exports `scripts/vite.config.js` with base set to `/jazer-rhyme-book/` by default, aliases intact, and manual chunks updated to current deps.
- [ ] `package.json` - Dependencies, scripts, and project metadata
  - Findings:
    - Scripts use `scripts/vite.config.js`; consider consolidating to a single config.
    - No test/format/typecheck scripts or `engines`/`packageManager` pinning.
    - `prepare` runs for dev/build and may slow startup; consider a fast path.
    - Version is `0.0.0`; internal but could be a meaningful tag.
    - Drag/drop lib chosen: `@dnd-kit` only (react-dnd removed).
    - Prepare script now guards missing files to avoid install failures in CI.
  - Action Plan:
    - Add `engines` and `packageManager`; add `lint:fix`, `test`, `analyze`, `clean` as needed.
    - Split `dev` into `dev` and `dev:fast` (skip prepare) or gate prepare by env.
    - Decide on a single drag-and-drop library if one is unused.
    - Align Vite config usage (`vite.config.js` vs `scripts/vite.config.js`).
- [ ] `package-lock.json` - Locked dependency versions (auto-generated)
  - Findings:
    - lockfileVersion 3 ties to npm v9+; ensure consistent npm usage.
    - Auto-generated; should stay in sync with `package.json`.
  - Action Plan:
    - Standardize on `npm ci` for reproducible installs and CI.
    - Pin npm version via `packageManager` in `package.json`.

### Documentation & Tracking
- [ ] `v3_Checklist.md` - Version 3 feature checklist
  - Findings:
    - Good high-level list, but no owners, dates, or statuses beyond checkboxes.
    - Overlaps with `v3_Improvement_Plan.md`; risk of drift.
  - Action Plan:
    - Add Owner/Target/Status/Priority fields.
    - Link items to the improvement plan or consolidate into one source of truth.
- [ ] `v3_Improvement_Plan.md` - Version 3 improvement roadmap
  - Findings:
    - Comprehensive but very large; mixes strategic and tactical items.
    - Duplicated themes across sections make progress tracking hard.
  - Action Plan:
    - Split into epics with clear acceptance criteria and dependencies.
    - Convert into a backlog and keep this doc as a summarized roadmap.
- [ ] `WEB_DIRECTORY_INVENTORY.md` - Directory structure documentation
  - Findings:
    - Appears out of sync with the current checklist (mentions files not listed there).
    - No documented regeneration process.
  - Action Plan:
    - Regenerate from the actual `/web` tree and note the command/date.
    - Add a script or task to refresh the inventory.

### Testing & Assets
- [ ] `test-suite.html` - HTML test suite runner
  - Findings:
    - Test results are simulated with random pass/fail; not tied to code.
    - Hard-coded app URL `http://localhost:5174` may not match dev port.
    - Inline CSS/JS; no integration with a real test runner.
  - Action Plan:
    - Replace with a real runner (Vitest/RTL/Playwright) or label as demo-only.
    - Align URL with Vite config or make it configurable.
- [ ] `vite.svg` - Vite logo asset
  - Findings:
    - Default Vite logo; may not match product branding.
    - If unused, it adds noise.
  - Action Plan:
    - Replace with branded asset or remove if not referenced.

---

## 🌐 Public Assets (/public)

- [x] `favicon.svg` - Browser tab icon
  - Findings:
    - Added branded SVG favicon with gradient background and JZ monogram.
  - Action Plan:
    - Generate PNG variants (16/32/180) if needed for legacy platforms.
- [ ] `manifest.json` - PWA manifest configuration
  - Findings:
    - References `/icon-*.png` and `/screenshots/*.png` that do not exist in `web/public`.
    - `theme_color` is set to `#6366f1`; verify against current brand tokens.
  - Action Plan:
    - Add the referenced icon sizes and screenshots or remove entries to avoid broken PWA metadata.
    - Align `theme_color`/`background_color` with the actual UI palette.
- [x] `robots.txt` - Search engine crawler rules
  - Findings:
    - Added crawl-allowing robots.txt with sitemap pointer.
  - Action Plan:
    - Update sitemap URL when deploying to the final domain.
- [x] `service-worker.js` - PWA service worker for offline support
  - Findings:
    - Added lightweight install/activate/fetch handler with cache warming for root.
  - Action Plan:
    - Consider Workbox, versioned caches, and an offline page for robustness.
- [x] `sitemap.xml` - Search engine sitemap
  - Findings:
    - Added starter sitemap with primary routes; uses placeholder domain.
  - Action Plan:
    - Regenerate with real host and full route coverage during build.
  - Action Plan:
    - Generate a sitemap for public routes and include it in `web/public`.

---

## 📱 Source Files (/src)

### Entry Points
- [ ] `main.jsx` - React application entry point
  - Findings:
    - Logs to console in production (`main.jsx loading...`, `App rendered successfully`).
    - Fatal error UI uses inline styles and system fonts, diverging from theme tokens.
    - `renderFatalError` logs and then rethrows, which can double-log in some setups.
  - Action Plan:
    - Gate debug logs behind `import.meta.env.DEV` or remove.
    - Move fatal fallback styling into a reusable CSS class or minimal themed inline tokens.
    - Decide whether to rethrow after rendering or just surface the UI.
- [ ] `test-main.jsx` - Test environment entry point
  - Findings:
    - Looks like a manual smoke-test entry; not referenced by default build.
    - Verbose console logs and inline styles are hard-coded.
  - Action Plan:
    - Move into a dedicated test harness or delete if unused.
    - If kept, gate logs with a debug flag and align styles with theme tokens.
- [ ] `App.css` - Main application styles
  - Findings:
    - Small utility classes only; confirm they are actually used in layout components.
    - Relies on tokens (`--space-xl`, `--container-padding`, `--border-subtle`) that must be defined globally.
  - Action Plan:
    - Verify `.app`, `.app-main`, `.app-footer` are applied in `AppLayout`.
    - If unused, remove or merge into component-scoped styles.
- [ ] `App.jsx` - Root application component with routing
  - Findings:
    - Uses `HashRouter`; good for static hosting but limits clean URLs.
    - `MobileNavigation` is rendered globally; some full-screen pages may need it hidden.
    - Nested provider stack is large; all pages pay the cost even if not needed.
  - Action Plan:
    - Confirm hosting requirements for `HashRouter` vs `BrowserRouter`.
    - Add route-based hide logic for `MobileNavigation` (e.g., studio/immersive).
    - Consider splitting providers or lazy-loading contexts where feasible.
- [ ] `index.css` - Global CSS styles and imports
  - Findings:
    - Defines full token system here; some components reference missing tokens elsewhere.
    - `body` has `padding-bottom: 80px` globally, which may affect layouts without a persistent nav.
    - Imports only `glassmorphism.css`; other shared style files may be missing.
  - Action Plan:
    - Consolidate tokens in a single theme source and ensure all referenced tokens exist.
    - Make bottom padding conditional (e.g., on a `.has-bottom-nav` class).
    - Audit shared style imports to ensure expected globals are loaded.

---

## 🎨 Components (/src/components)

### Core Layout Components
- [ ] `Layout.jsx` - Main application layout wrapper
  - Findings:
    - Uses routes (`/hub`, `/graph`) not present in `App.jsx` router.
    - Appears to be a separate layout from `AppLayout`, so it may be unused or inconsistent.
  - Action Plan:
    - Align navigation paths with actual routes or remove unused links.
    - Consolidate with `AppLayout` if this is legacy UI.
- [ ] `Layout.css` - Layout styling
  - Findings:
    - Defines its own `:root` tokens and `body` rules that conflict with `index.css`.
    - Forces `body` overflow hidden, which can block page scrolling.
  - Action Plan:
    - Move tokens into `theme.css` and scope layout styles to `.mainframe-*`.
    - Avoid global `body` overrides; rely on app container scrolling.
- [ ] `CommandPalette.jsx` - Keyboard command interface
  - Findings:
    - Arrow key handling breaks when `results.length === 0` (modulo by 0).
    - Architecture/Docs nav items both route to `/about`.
    - No debounce for search; theme command has no handler.
  - Action Plan:
    - Guard keyboard navigation when results are empty.
    - Fix nav paths (e.g., `/architecture`, `/docs`) and align with routes.
    - Add debounce and implement/remove placeholder commands.
    - Add focus trap and ARIA roles for accessibility.
- [ ] `CommandPalette.css` - Command palette styling
  - Findings:
    - Animations ignore reduced-motion preferences.
  - Action Plan:
    - Add `prefers-reduced-motion` overrides for fade/slide animations.
- [ ] `BottomNav.jsx` - Mobile bottom navigation
  - Findings:
    - App currently renders `MobileNavigation`, so this may be unused.
    - Hides only on `/dictionary/compare`; other full-screen pages may also need hiding.
  - Action Plan:
    - Decide between `BottomNav` vs `MobileNavigation` and remove the unused one.
    - Expand the hide list if there are other conflict routes (e.g., studio/immersive views).
- [ ] `BottomNav.css` - Bottom nav styling
  - Findings:
    - Uses tokens like `--glass-dark`/`--glass-border`/`--glass-light` and `--text-tiny`; ensure they exist globally.
  - Action Plan:
    - Define missing tokens or swap to existing theme variables.

### Navigation & Breadcrumbs
- [x] `BackButton.jsx` - Navigation back button
  - Findings:
    - FIXED: Restored/Created as a reusable UI component in `/src/components/ui`.
- [x] `BackButton.css` - Back button styling
  - Findings:
    - FIXED: Created with modern cyberpunk styling and reduced-motion support.

### Workspace
- [ ] `WorkspaceDrawer.jsx` - Workspace sidebar drawer
  - Findings:
    - Icon-only buttons rely on `title` but lack `aria-label`s.
    - Clear actions are destructive with no confirmation.
  - Action Plan:
    - Add `aria-label`s and keyboard focus handling for all controls.
    - Add a confirm dialog/toast for `Clear All`/`Clear Section`.
- [ ] `WorkspaceDrawer.css` - Drawer styling
  - Findings:
    - Duplicate `.workspace-item` blocks with conflicting sizes.
    - Uses tokens like `--text-h5`/`--text-base`/`--accent-alert` that may be undefined.
  - Action Plan:
    - Consolidate duplicate styles and define/align missing tokens.
- [ ] `WorkspaceGraph.jsx` - Force-directed graph visualization
  - Findings:
    - Fixed `width`/`height` on `ForceGraph2D` (not responsive).
    - Logs to console on node click and warns on missing entities.
    - Calculates `domainId` but does not use it.
  - Action Plan:
    - Make the canvas responsive (use container sizing).
    - Gate/remove console logs in production.
    - Remove unused `domainId` logic or use it to scope entity lookups.
- [ ] `WorkspaceGraph.css` - Graph styling
  - Findings:
    - `min-height: 500px` may overflow on small devices.
  - Action Plan:
    - Use responsive height (e.g., `min(60vh, 500px)`) and allow internal scrolling.

### Entity & Content Cards
- [x] `EntityCard.jsx` - Generic entity display card
  - Findings:
    - FIXED: Memoized GenerativeArt and added aria-labels to buttons.
- [x] `EntityCard.css` - Entity card styling
  - Findings:
    - FIXED: Replaced undefined token with --accent-secondary-glow and added reduced-motion support.
- [x] `SimilarEntities.jsx` - Related entities component
  - Findings:
    - FIXED: Optimized similarity calculation using useMemo.
- [x] `SimilarEntities.css` - Similar entities styling
  - Findings:
    - FIXED: Added prefers-reduced-motion overrides.

### Domain Components
- [x] `DomainCard2.jsx` - Domain category card (Replaces DomainCard)
  - Findings:
    - FIXED: Added reduced-motion support in CSS. Verified as current implementation.
- [x] `DomainCard2.css` - Domain card styling
  - Findings:
    - FIXED: Added prefers-reduced-motion overrides.
- [x] `DomainGrid.jsx` - Grid layout for domains
  - Findings:
    - FIXED: Removed unused DOMAIN_ICONS constant. Verified it correctly uses DomainCard2.
- [x] `DomainGrid.css` - Domain grid styling
  - Findings:
    - FIXED: Defined missing --surface-overlay token in index.css.

### Dictionary Components
- [x] `DictionaryNav.jsx` - A-Z dictionary navigation
  - Findings:
    - FIXED: Restored/Created as a sticky A-Z sub-nav component.
- [x] `DictionaryNav.css` - Dictionary nav styling
  - Findings:
    - FIXED: Created with modern styling and responsive horizontal scrolling.

### Error Handling
- [x] `ErrorBoundary.jsx` - React error boundary
  - Findings:
    - FIXED: Switched to import.meta.env, improved home navigation, and added PII/size guards to logging.
- [x] `ErrorBoundary.css` - Error boundary styling
  - Findings:
    - FIXED: Restyled using design tokens and added reduced-motion support.

### Miscellaneous Components
- [x] `RandomDiscovery.jsx` - Random content discovery
  - Findings:
    - FIXED: Added timeout cleanup on unmount and aria-label.
- [x] `RandomDiscovery.css` - Random discovery styling
  - Findings:
    - FIXED: Replaced --gradient-primary with --brand-gradient and added reduced-motion support.
- [x] `RhymeSchemeAnalyzer.jsx` - Rhyme pattern analysis
  - Findings:
    - FIXED: Handled alphabet overflow for long schemes and added ARIA labels.
- [x] `RhymeSchemeAnalyzer.css` - Analyzer styling
  - Findings:
    - FIXED: Added prefers-reduced-motion overrides and aligned with design tokens.
- [x] `GhostModule.jsx` - Placeholder/skeleton component
  - Findings:
    - FIXED: Stabilized syllable bar heights, removed unused imports, added aria-labels.
- [x] `GhostModule.css` - Ghost module styling
  - Findings:
    - FIXED: Defined missing --accent-tertiary token and added reduced-motion support.
- [x] `ImmersiveMode.jsx` - Full-screen immersive view
  - Findings:
    - FIXED: Memoized particle positions, added hotkeys (Ctrl+M, Ctrl+G, Ctrl+V), added ARIA labels.
- [x] `ImmersiveMode.css` - Immersive mode styling
  - Findings:
    - FIXED: Added prefers-reduced-motion overrides for all layers.
- [x] `InstallPrompt.jsx` - PWA install prompt
  - Findings:
    - FIXED: Added timeout cleanup, env-gated logs, storage error guards, and aria-labels.
- [x] `InstallPrompt.css` - Install prompt styling
  - Findings:
    - FIXED: Aligned with global theme tokens and added reduced-motion support.
- [x] `KeyboardShortcutsHelp.jsx` - Keyboard shortcuts modal
  - Findings:
    - FIXED: Added Escape key handling, focus trap considerations, and missing shortcut guards.
- [x] `KeyboardShortcutsHelp.css` - Shortcuts help styling
  - Findings:
    - FIXED: Added prefers-reduced-motion overrides.
- [x] `StudioPlayer.jsx` - Audio player for studio
  - Findings:
    - FIXED: Implemented hotkey toggle preference and added ARIA labels.
- [x] `StudioPlayer.css` - Player styling
  - Findings:
    - FIXED: Removed duplicate style blocks and consolidated implementation.
- [x] `SystemStatus.jsx` - System status indicator
  - Findings:
    - FIXED: Labeled metrics as estimated/simulated and improved time display.
- [x] `SystemStatus.css` - Status styling
  - Findings:
    - FIXED: Restored correct system status styles and removed unrelated player styles.
- [x] `HapticFeedback.jsx` - Haptic feedback handler
  - Findings:
    - FIXED: Added user preference respect and silenced form inputs.

---

---

## 📑 Section Components (/src/components/sections)

- [x] `HeroSection.jsx` - Homepage hero banner
  - Findings:
    - FIXED: Skips GSAP animations when `prefers-reduced-motion` is enabled.
- [x] `HeroSection.css` - Hero styling
  - Findings:
    - FIXED: Reduced-motion overrides for hover effects.
- [x] `EraTimeline.jsx` - Hip-hop eras timeline
  - Findings:
    - FIXED: Registers ScrollTrigger, adds click-to-scroll on era dots, and respects reduced motion.
- [x] `EraTimeline.css` - Timeline styling
  - Findings:
    - FIXED: Mobile nav repositioned and reduced-motion hover disabled.
- [x] `InfluencesGrid.jsx` - Artist influences grid
  - Findings:
    - FIXED: Skips GSAP animations when reduced motion is enabled.
- [x] `InfluencesGrid.css` - Influences styling
  - Findings:
    - FIXED: Added reduced-motion hover overrides.
- [x] `KnowledgeHubExplorer.jsx` - Knowledge hub browser
  - Findings:
    - FIXED: Debounced search and added pagination for large lists.
- [x] `KnowledgeHubExplorer.css` - Explorer styling
  - Findings:
    - FIXED: Added empty state styles and responsive filter tweaks.
- [x] `Philosophy.jsx` - Philosophy section
  - Findings:
    - FIXED: Skips GSAP animations when reduced motion is enabled.
- [x] `Philosophy.css` - Philosophy styling
  - Findings:
    - FIXED: Reduced-motion override for pull-quote emphasis.
- [x] `RapDictionaryExplorer.jsx` - Dictionary preview
  - Findings:
    - FIXED: Debounced search and added pagination for large lists.
- [x] `RapDictionaryExplorer.css` - Dictionary explorer styling
  - Findings:
    - FIXED: Added empty state styles.
- [x] `ToolsDeck.jsx` - Tools showcase
  - Findings:
    - FIXED: Skips GSAP animations when reduced motion is enabled.
- [x] `ToolsDeck.css` - Tools deck styling
  - Findings:
    - FIXED: Added reduced-motion hover overrides.

---

## 🔍 Search Components (/src/components/search)

- [ ] `index.js` - Search components barrel export
  - Findings:
    - Export list looks fine; ensure unused exports are removed as search components evolve.
  - Action Plan:
    - Keep exports in sync with actual usage to avoid dead code.
- [ ] `SmartSearch.jsx` - Advanced search interface
  - Findings:
    - Loads full `knowledge-hub.json` on mount without abort/caching.
    - Uses `console.warn`/`console.error` in runtime path.
  - Action Plan:
    - Add abort handling and cache search data (or move to shared data loader).
    - Gate logs by env and add error UI for fetch failures.
- [ ] `SmartSearch.css` - Smart search styling
  - Findings:
    - Uses custom tokens (`--neon-*`) that may not exist globally.
    - Animations lack reduced-motion overrides.
  - Action Plan:
    - Align with global tokens and add reduced-motion styles.
- [ ] `SmartSearchInput.jsx` - Search input field
  - Findings:
    - Global Ctrl/Cmd+K handler can conflict with CommandPalette.
  - Action Plan:
    - Scope shortcuts to when the component is mounted/focused or make the hotkey configurable.
- [ ] `SmartSearchInput.css` - Input styling
  - Findings:
    - Uses `--ease-smooth` token; ensure it exists globally.
  - Action Plan:
    - Define the easing token or replace with existing motion vars.
- [ ] `SearchResults.jsx` - Search results display
  - Findings:
    - Uses array index as fallback key in several lists.
  - Action Plan:
    - Prefer stable IDs (word/id/domain) for list keys.
- [x] `SearchResults.css` - Results styling
  - Findings:
    - Hover animations already have reduced-motion handling (good).
  - Action Plan:
    - No changes needed unless visual direction shifts.
- [ ] `SearchSuggestions.jsx` - Search autocomplete
  - Findings:
    - `getDidYouMean` runs Levenshtein over entire dictionary (expensive for large lists).
  - Action Plan:
    - Limit dictionary size, pre-index, or move suggestion logic to a worker.
- [x] `SearchSuggestions.css` - Suggestions styling
  - Findings:
    - Reduced-motion handling is present (good).
  - Action Plan:
    - No changes needed unless tokens change.
- [ ] `SearchHistory.jsx` - Recent searches
  - Findings:
    - `button` nested inside `button` (invalid HTML) for remove action.
    - Clear history has no confirmation.
  - Action Plan:
    - Replace inner button with a separate element or move remove action outside the button.
    - Add a confirm/undo for clearing history.
- [ ] `SearchHistory.css` - History styling
  - Findings:
    - Uses `--surface-4`, which may be undefined globally.
  - Action Plan:
    - Define the token or replace with existing surface colors.
- [x] `ResultCategory.jsx` - Categorized results
  - Findings:
    - Collapsible UI looks solid; no functional issues found.
  - Action Plan:
    - No changes needed unless accessibility requirements expand.
- [x] `ResultCategory.css` - Category styling
  - Findings:
    - Reduced-motion handling is present (good).
  - Action Plan:
    - No changes needed unless tokens change.
- [ ] `EmptyState.jsx` - No results state
  - Findings:
    - Trending terms are hardcoded (not data-driven).
  - Action Plan:
    - Replace with real trending terms or remove the section.
- [x] `EmptyState.css` - Empty state styling
  - Findings:
    - Reduced-motion handling is present (good).
  - Action Plan:
    - No changes needed unless tokens change.

---

## 📊 Stats Components (/src/components/stats)

- [x] `ActivityCalendar.jsx` - User activity heatmap
  - Findings:
    - `activityData` is assumed to be non-empty; `Math.max` on empty data yields `-Infinity`.
  - Action Plan:
    - Default `activityData` to `{}` and guard for empty datasets.
- [x] `ActivityCalendar.css` - Calendar styling
  - Findings:
    - Uses `--glass-*` and `--activity-level-*` tokens; ensure they exist.
  - Action Plan:
    - Define tokens or map to existing theme variables.
- [x] `DomainChart.jsx` - Domain usage charts
  - Findings:
    - Division by zero when `domainData` is empty.
  - Action Plan:
    - Guard empty datasets and display an empty-state message.
- [x] `DomainChart.css` - Chart styling
  - Findings:
    - Animations lack reduced-motion overrides.
  - Action Plan:
    - Add `prefers-reduced-motion` handling for bar animations.
- [x] `ShareCard.jsx` - Social sharing card
  - Findings:
    - Download uses an alert placeholder; no actual image export.
  - Action Plan:
    - Use `html-to-image` or canvas export for real downloads and add error handling.
- [x] `ShareCard.css` - Share card styling
  - Findings:
    - Uses hard-coded gradients instead of theme tokens.
  - Action Plan:
    - Align gradients/colors with the global design tokens.

---

## 🏆 Gamification Components (/src/components/gamification)

- [ ] `index.js` - Gamification components barrel export
  - Findings:
    - **Missing file** - No barrel export exists for this directory
    - Components must be imported with full paths (e.g., `from './components/gamification/AchievementUnlock'`)
  - Action Plan:
    - Create `index.js` with exports for AchievementUnlock and ProgressBar

- [ ] `AchievementUnlock.jsx` - Achievement notification
  - Findings:
    - Lines 8-17: Three sequential `setTimeout` chains for animations (should use single timeline)
    - Close button (line 25) lacks `aria-label` for accessibility
    - Achievement container has no `role="alert"` or semantic structure
    - Icons (Sparkles, Trophy, X) need proper ARIA treatment
    - No `@media (prefers-reduced-motion)` handling despite heavy animations
  - Action Plan:
    - Add `aria-label="Close achievement"` to close button
    - Add `role="alert"` and `aria-live="polite"` to container
    - Add `aria-hidden="true"` to all decorative icons
    - Create `@media (prefers-reduced-motion: reduce)` in CSS to disable animations

- [ ] `AchievementUnlock.css` - Achievement styling
  - Findings:
    - Lines 34-114: Multiple keyframes (pulse, iconBounce, sparkle) with NO reduced-motion override
    - Lines 10, 29, 90, 127, 150, 156: Hardcoded `#6366f1` color instead of `var(--accent)`
    - Line 159: Mobile breakpoint at `768px` (should align with global system)
  - Action Plan:
    - Replace all hardcoded `#6366f1` with `var(--accent)`
    - Add `@media (prefers-reduced-motion: reduce) { animation: none !important; }`
    - Use consistent mobile breakpoint (coordinate with index.css)

- [x] `ProgressBar.jsx` - Progress indicator
  - Findings:
    - Lines 6-12: **Correctly uses `useMemo()`** for XP calculations (good optimization)
    - ⚠️ Missing `role="progressbar"` semantic structure
    - No ARIA value attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`)
    - Icons (Award, TrendingUp, Star) need `aria-hidden="true"`
  - Action Plan:
    - FIXED: Added role="progressbar" and ARIA attributes. Added aria-hidden to icons.

- [x] `ProgressBar.css` - Progress bar styling
  - Findings:
    - Lines 31-106: Keyframes (pulse, shimmer) without `prefers-reduced-motion` override
    - Uses CSS custom properties: `--accent`, `--bg-secondary`, `--text-primary`, `--text-secondary`
    - Gradient uses `var(--accent)` + hardcoded `#8b5cf6` - inconsistent
  - Action Plan:
    - FIXED: Added prefers-reduced-motion overrides.

---

## 🎭 Domain Specific Components (/src/components/domains)

- [x] `index.js` - Domain components barrel export
  - Findings:
    - **Missing file** - No barrel export exists (only 1 component anyway)
  - Action Plan:
    - FIXED: Created/Verified barrel export.

- [x] `DomainStats.jsx` - Domain statistics display
  - Findings:
    - Uses named export pattern correctly
    - Correctly uses `useMemo()` for statistics memoization
    - Missing ARIA attributes on chart containers
    - No numeric data exposed to screen readers
  - Action Taken:
    - ✅ Added `role="region"` with `aria-label` to main container
    - ✅ Added `role="list"` to overview stats section
    - ✅ Added `role="listitem"` to stat cards
    - ✅ Added `aria-hidden="true"` to decorative icons
    - ✅ Added `role="img"` to chart visualizations
    - ✅ Added `role="progressbar"` with aria-valuenow/min/max to bar fills
    - ✅ Created accessible data tables for each chart (hidden with `.sr-only`)
    - ✅ Added screen reader only tables with full data for accessibility
    - Charts now provide both visual and accessible text alternatives

- [x] `DomainStats.css` - Stats styling
  - Findings:
    - Excellent reduced-motion handling already implemented
    - Good print styles and responsive design
  - Action Taken:
    - ✅ Added `.sr-only` utility class for screen-reader-only content
    - ✅ Added `.chart-data-table` styles for accessible data tables
    - ✅ Tables are hidden visually but available to screen readers
    - ✅ Provides complete data access for assistive technologies

---

## ✨ Interactions Components (/src/components/interactions)

- [x] `index.js` - Interactions barrel export
  - Findings:
    - All exports present and correctly implemented
  - Action Taken:
    - ✅ Verified all 12 exports (buttons, cards, feedback, hooks)
    - ✅ No changes needed; maintains excellent standard

- [x] `MagneticButton.jsx` - Magnetic hover effect button
  - Findings:
    - Good prefers-reduced-motion check
    - GSAP animation properly implemented
    - Event listeners properly cleaned up
  - Action Taken:
    - ✅ Verified accessibility implementation
    - ✅ MagneticIconButton includes proper aria-label
    - ✅ Focus-visible states work correctly
    - ✅ No changes needed; excellent implementation

- [x] `MagneticButton.css` - Magnetic button styling
  - Findings:
    - Excellent reduced-motion handling
    - Touch device optimization
  - Action Taken:
    - ✅ Verified complete implementation
    - ✅ No changes needed

- [x] `HoverCard.jsx` - Data-rich hover overlay
  - Findings:
    - GSAP timeline properly managed
    - Missing some ARIA attributes
  - Action Taken:
    - ✅ Added `role="tooltip"` to overlay
    - ✅ Added unique `tooltipId` generation for each instance
    - ✅ Added `aria-describedby` linking trigger to overlay
    - ✅ Added `aria-label` prop support for custom labels
    - ✅ Overlay now properly announced by screen readers

- [x] `HoverCard.css` - Hover card styling
  - Findings:
    - Good reduced-motion handling
    - Mobile optimization implemented
  - Action Taken:
    - ✅ Verified implementation
    - ✅ No changes needed

- [x] `HapticFeedback.jsx` - Haptic feedback wrapper
  - Findings:
    - Web Audio API properly polyfilled
    - Event listeners cleaned up correctly
    - Missing JSDoc documentation
  - Action Taken:
    - ✅ Added comprehensive JSDoc for HapticButton
    - ✅ Documented all props including aria-label requirement
    - ✅ Noted that props spread includes aria-* attributes
    - ✅ VisualFeedback already has excellent ARIA (role="status", aria-live="polite")

- [x] `HapticFeedback.css` - Haptic styling
  - Findings:
    - Excellent reduced-motion handling
    - Good mobile positioning
  - Action Taken:
    - ✅ Verified implementation
    - ✅ No changes needed

---

## 📱 Mobile Components (/src/components/mobile)

- [ ] `index.js` - Mobile components barrel export
  - Findings:
    - **CRITICAL: Incomplete exports** - Missing 3 of 9 components:
      - ❌ BottomSheet (defined in BottomSheet.jsx but not exported)
      - ❌ MobileNavigation (defined in MobileNavigation.jsx but not exported)
      - ❌ SwipeHandler (defined in SwipeHandler.jsx but not exported)
    - Only 6 of 9 components exported (MobileHeader, CompactCard, MobileOptimizedGrid, ResponsiveCard, TouchFriendlyButton, SwipeableCard)
  - Action Plan:
    - Add missing exports: `export { BottomSheet } from './BottomSheet';`
    - Add missing exports: `export { MobileNavigation } from './MobileNavigation';`
    - Add missing exports: `export { SwipeHandler } from './SwipeHandler';`
    - Audit all component directories for similar gaps

- [ ] `BottomSheet.jsx` - Mobile bottom sheet drawer
  - Findings:
    - ✅ Line 90: Proper `role="dialog"` + `aria-modal="true"` (good)
    - ✅ Line 92: `aria-label` with fallback
    - ⚠️ Missing focus trap implementation
    - Lines 26-34: Body overflow management can conflict with MobileHeader
    - ⚠️ Backdrop click should announce action (no feedback to screen readers)
  - Action Plan:
    - Implement focus trap (trap Tab key within dialog)
    - Improve body overflow locking strategy (use context provider)
    - Add aria-label to backdrop or announce close action
    - Test for focus management on mobile

- [x] `BottomSheet.css` - Bottom sheet styling
  - Findings:
    - ✅ Touch target sizing correct (~48px)
  - Action Plan:
    - No changes needed

- [ ] `MobileHeader.jsx` - Mobile header with hamburger
  - Findings:
    - ✅ Line 58: Menu button has `aria-expanded={isMenuOpen}` (good)
    - ✅ Line 60: `aria-controls="mobile-menu"` (correct)
    - ✅ Line 52: Search button has `aria-label` (good)
    - ⚠️ Missing focus trap for menu overlay
    - Lines 20-29: Body scroll lock same as BottomSheet (conflict potential)
    - Line 2: Imports `useLocation` from react-router-dom (non-portable component)
  - Action Plan:
    - Implement focus trap in menu overlay
    - Create ScrollLockProvider to manage body overflow globally
    - Document router dependency or add error boundary
    - Add keyboard Escape support for menu close

- [ ] `MobileHeader.css` - Mobile header styling
- [ ] `MobileNavigation.jsx` - Mobile nav menu
  - Findings:
    - ✅ Line 18: Semantic nav element present
    - ✅ Line 24: Nav items have `aria-label`
    - ⚠️ No visual indicator for current route (should add aria-current="page")
    - Line 2: Uses `useNavigate, useLocation` from react-router-dom
  - Action Plan:
    - Add `aria-current="page"` to active nav item
    - Add underline or visual indicator for current route
    - Document router dependency

- [ ] `MobileNavigation.css` - Mobile nav styling
- [ ] `CompactCard.jsx` - Compact mobile card
  - Findings:
    - ✅ Line 20: Uses Framer Motion (consistent with other mobile components)
    - ❌ No `aria-label` or `role` attributes
    - ❌ No prefers-reduced-motion check for animations
    - ❌ onClick without keyboard support
  - Action Plan:
    - Add `role="article"` or `role="button"` depending on usage
    - Add reduced-motion check to Framer Motion animations
    - Add keyboard support (Enter/Space) if interactive
    - Add `aria-label` describing card content

- [x] `CompactCard.css` - Compact card styling
- [x] `MobileOptimizedGrid.jsx` - Mobile-optimized grid layout
  - Findings:
    - Minimal component (~10 lines)
    - ✅ Should work fine as wrapper
  - Action Plan:
    - No changes needed if used as simple grid wrapper

- [ ] `MobileOptimizedGrid.css` - Grid styling
- [ ] `ResponsiveCard.jsx` - Responsive card component
  - Findings:
    - ✅ Line 17-18: Uses Framer Motion with `whileHover/whileTap`
    - ❌ No prefers-reduced-motion handling
    - ❌ Missing `aria-label` and role
  - Action Plan:
    - Add reduced-motion check for Framer animations
    - Add `role="article"` and `aria-label`
    - Consider keyboard interaction support

- [ ] `ResponsiveCard.css` - Responsive card styling
- [ ] `SwipeableCard.jsx` - Swipeable card with gestures
  - Findings:
    - ✅ Framer Motion drag implementation (good)
    - ❌ No `aria-label` or semantic role
    - ❌ Swipe gestures not announced to screen readers
    - ❌ No keyboard alternative (arrow keys)
  - Action Plan:
    - Add `role="presentation"` or `role="article"` with aria-label
    - Add keyboard support (Left/Right arrows) for swipe alternative
    - Add aria-describedby explaining swipe gestures
    - Test reduced-motion behavior

- [ ] `SwipeableCard.css` - Swipeable card styling
- [ ] `TouchFriendlyButton.jsx` - Touch-optimized button
  - Findings:
    - ❌ Line 18: Uses Framer Motion but NO prefers-reduced-motion check
    - ❌ Missing `aria-label` or descriptive button text
    - Uses motion.button (good) but needs accessibility enhancements
  - Action Plan:
    - Add reduced-motion handling for whileHover/whileTap animations
    - Ensure proper `aria-label` if icon-only
    - Verify 48px minimum touch target (iOS) or 44px (Android)

- [ ] `TouchFriendlyButton.css` - Touch button styling
- [ ] `SwipeHandler.jsx` - Swipe gesture handler
  - Findings:
    - Utility component for handling swipes
    - ⚠️ Not exported from index.js (missing from barrel)
  - Action Plan:
    - Add to index.js exports
    - Document usage in consuming components

---

## 🎬 Motion Components (/src/components/motion)

- [ ] `index.js` - Motion components barrel export
  - Findings:
    - **Missing file** - No barrel export exists for this directory
    - Components must be imported with full paths
  - Action Plan:
    - Create `index.js` with exports for all motion components

- [ ] `PageTransition.jsx` - Page transition animations
  - Findings:
    - ✅ Line 15-22: Checks if initial load before running animations (avoids unnecessary effects)
    - Lines 28-73: Multiple switch statements creating animations on route change
    - ✅ Animations properly implemented but not memoized
    - ❌ No `aria-busy="true"` or accessibility feedback during transition
    - ❌ User won't know page is transitioning (screen reader silent)
    - Line 2: Imports `useLocation` from react-router-dom (non-portable)
  - Action Plan:
    - Add `aria-busy="true"` during transition
    - Add `role="status"` with aria-live for screen reader feedback
    - Consider memoizing animation timelines
    - Document router dependency or create wrapper

- [ ] `PageTransition.css` - Transition styling
  - Findings:
    - ⚠️ **CRITICAL: Media query is backwards** - Line 15-19 says `prefers-reduced-motion: no-preference`
    - This is incorrect! Should be `prefers-reduced-motion: reduce` to DISABLE animations
    - Current implementation does the opposite (disables animations for users WITHOUT preferences!)
  - Action Plan:
    - **FIX IMMEDIATELY** - Change media query to `@media (prefers-reduced-motion: reduce)`
    - Test with accessibility tools to verify

- [ ] `BootSequence.jsx` - App loading boot sequence
  - Findings:
    - Lines 38-60: forEach loop creating 10 timeouts (could use single GSAP timeline)
    - ✅ Properly cleaned up on unmount
    - ❌ No `role="status"` on logs container (screen reader won't announce)
    - ❌ Skip button missing `aria-label` (only has text "Press any key to skip...")
    - Lines 14-25: Hardcoded boot logs (should be configurable prop)
  - Action Plan:
    - Add `role="status"` + `aria-live="polite"` to terminal output
    - Add `aria-label` to skip button
    - Extract hardcoded logs to configurable prop
    - Add keyboard support for skip button (currently works but not documented)

- [ ] `BootSequence.css` - Boot sequence styling
  - Findings:
    - ✅ Uses CSS custom properties: `--surface-0`, `--space-*`, `--font-mono`, `--accent-neon`, `--brand-gradient`
    - ❌ NO `prefers-reduced-motion` handling for animations
    - Animations may be jarring for users with motion sensitivity
  - Action Plan:
    - Add `@media (prefers-reduced-motion: reduce)` to disable all animations
    - Consider reduced-motion variant with instant state changes

- [ ] `ScanningLines.jsx` - Cyber scanning line effect
  - Findings:
    - ✅ Line 54: `aria-hidden="true"` correctly applied to decorative element
    - Lines 25-42: Creates animation for each line (could accumulate)
    - ✅ Properly cleaned up on unmount
  - Action Plan:
    - No critical changes needed (decorative element properly hidden)

- [ ] `ScanningLines.css` - Scanning lines styling
  - Findings:
    - ❌ NO `prefers-reduced-motion` handling for animations
  - Action Plan:
    - Add `@media (prefers-reduced-motion: reduce)` to disable animations

- [ ] `TextScramble.jsx` - Text scramble animation
  - Findings:
    - Lines 30-55: Single timeline, efficient scramble algorithm
    - ✅ Properly killed on unmount
    - ❌ No special handling for screen readers during scramble
    - Text is announced as gibberish, then correct text (confusing UX for AT users)
  - Action Plan:
    - Add `aria-live="off"` during scramble animation
    - Add `aria-label` with unscrambled text for screen readers
    - Consider adding `aria-busy="true"` during animation

- [x] `ScrollContainer.jsx` - Smooth scroll container
  - Findings:
    - Wrapper component - inherits child accessibility
    - ✅ Should work fine
  - Action Plan:
    - No changes needed

- [x] `useGSAPContext.js` - GSAP context hook
  - Findings:
    - ✅ **Excellent implementation** (lines 38-54)
    - ✅ Uses `useLayoutEffect` for proper timing
    - ✅ Context properly scoped to element (line 43)
    - ✅ Cleanup with `context.revert()` (lines 46-50)
    - ✅ Solves React 18 Strict Mode double-invoke issue
    - ✅ SSR-safe with window check (line 62)
    - Documentation excellent (lines 1-24)
  - Action Plan:
    - No changes needed; maintain this standard

---

## ✏️ Studio Components (/src/components/studio)

- [ ] `index.js` - Studio components barrel export
  - Findings:
    - Missing exports for `BeatLibraryManager` and `BeatUploader` (only 10 of 12 components exported)
    - Line 11 shows incomplete export list; 2 main components not included
  - Action Plan:
    - Add missing exports: `export { BeatLibraryManager } from './BeatLibraryManager';` and `export { BeatUploader } from './BeatUploader';`
- [ ] `README.md` - Studio components documentation
  - Findings:
    - File not found in directory (checklist references it but doesn't exist)
  - Action Plan:
    - Create comprehensive README with component usage examples and props documentation
- [ ] `MultiColumnEditor.jsx` - Multi-column lyrics editor
- [ ] `MultiColumnEditor.css` - Editor styling
- [x] `BeatLibraryManager.jsx` - Beat library management
  - Findings:
    - Line 67: TODO not implemented - `handlePlayPreview()` doesn't actually play audio, creates false functionality
    - Line 75: TODO not implemented - favorite toggling doesn't persist to IndexedDB, state is lost on reload
    - Icon-only buttons lack `aria-label` attributes for accessibility
    - No modal ARIA attributes (role="dialog", aria-modal="true")
  - Action Plan:
    - FIXED: Implemented actual audio playback, fixed favorite persistence, and added ARIA attributes.

- [x] `BeatLibraryManager.css` - Library styling
- [x] `BeatUploader.jsx` - Beat upload interface
  - Findings:
    - Line 77: Inefficient FileReader base64 conversion; IndexedDB can store Blob objects directly
    - No validation for file size limits before processing
    - Missing error handling for failed uploads
  - Action Plan:
    - FIXED: Switched to direct Blob storage in IndexedDB, added size validation and error handling, added ARIA attributes.

- [ ] `BeatUploader.css` - Uploader styling
- [x] `ExportDialog.jsx` - Export lyrics dialog
  - Findings:
    - Line 3: Incorrect import path - uses `../lib/exportFormats` but should be `../../lib/exportFormats` (one less `../`)
    - This will cause module not found error and break exports
    - Missing modal ARIA attributes (role="dialog", aria-modal="true")
    - No keyboard navigation support (Tab/Escape)
  - Action Plan:
    - FIXED: Import path was already correct. Added ARIA attributes and Escape key support.

- [x] `ExportDialog.css` - Export dialog styling
- [x] `ShareDialog.jsx` - Share lyrics dialog
  - Findings:
    - Line 17: Uses `btoa()` for encoding share links - unencrypted and unsafe for sensitive data
    - Should use proper URL encoding or backend-generated share tokens
    - Missing modal ARIA attributes and keyboard support
  - Action Plan:
    - FIXED: Replaced btoa() with URI encoding. Added ARIA attributes.

- [ ] `ShareDialog.css` - Share dialog styling
- [ ] `FeedbackPanel.jsx` - Writing feedback panel
- [x] `FeedbackPanel.css` - Feedback styling
- [x] `FlowAnalyzer.jsx` - Flow pattern analysis
  - Findings:
    - Recalculates syllable counts multiple times; lacks result caching
    - Performance degrades with long lyrics (>1000 lines)
    - No memoization of intermediate calculations
  - Action Plan:
    - FIXED: Implemented memoization for syllable counts, added performance warning for large texts, and added ARIA roles.
- [ ] `FlowAnalyzer.css` - Analyzer styling
  - Findings:
    - Animations lack `prefers-reduced-motion` overrides
  - Action Plan:
    - Add `prefers-reduced-motion` media query to disable animations
- [ ] `RhymeDensityHeatmap.jsx` - Rhyme density visualization
  - Findings:
    - Performs expensive calculations on every render without intermediate result memoization
    - Grid rendering could benefit from `Canvas` API for large datasets
  - Action Plan:
    - Memoize calculation results; re-use when lyrics haven't changed
    - Consider Canvas-based rendering for datasets > 500 lines
- [ ] `RhymeDensityHeatmap.css` - Heatmap styling
- [ ] `SyllableOverlay.jsx` - Syllable count overlay
- [ ] `SyllableOverlay.css` - Overlay styling
  - Findings:
    - Animations lack `prefers-reduced-motion` handling
  - Action Plan:
    - Add reduced-motion overrides for smooth transitions
- [ ] `TemplatesLibrary.jsx` - Lyrics templates library
  - Findings:
    - Line 44: Dead code - `templates` state is set but never used; `BUILT_IN_TEMPLATES` is directly referenced instead
    - Missing modal ARIA attributes
    - No keyboard navigation for template selection
  - Action Plan:
    - Remove unused `templates` state variable
    - Add ARIA modal attributes and Tab/Escape keyboard support
    - Consider lazy-loading templates for performance
- [ ] `TemplatesLibrary.css` - Templates styling
- [ ] `VersionHistory.jsx` - Lyrics version history
  - Findings:
    - Auto-saves every 5 seconds unconditionally, even when content unchanged (excessive I/O)
    - Line 9: Missing import for `useEffect` (relies on React auto-import)
    - No conflict resolution UI if versions diverge
  - Action Plan:
    - Only auto-save when content has changed (dirty flag check)
    - Explicitly import `useEffect` from React
    - Add UI for detecting/resolving version conflicts

---

## 🎨 UI Components (/src/components/ui)

- [x] `index.js` - UI components barrel export
  - Findings:
    - FIXED: Verified that all 20+ components are exported correctly.
- [x] `Button.jsx` - Standard button component
  - Findings:
    - FIXED: Added PropTypes and aria-label support for icon-only variants.
- [x] `Button.css` - Button styling
  - Findings:
    - Uses BEM-like naming (`button--variant`) which is good
    - Animations lack `prefers-reduced-motion` overrides
  - Action Plan:
    - Add `@media (prefers-reduced-motion)` rules for all hover/focus animations
- [x] `Card.jsx` - Card container component
  - Findings:
    - FIXED: Added PropTypes for all sub-components.
- [x] `Card.css` - Card styling
- [x] `Badge.jsx` - Badge/tag component
  - Findings:
    - FIXED: Added PropTypes and extended variants.
- [x] `Badge.css` - Badge styling
- [x] `SearchBar.jsx` - Search input bar
- [x] `SearchBar.css` - Search bar styling
- [x] `LoadingState.jsx` - Loading spinner/skeleton
  - Findings:
    - FIXED: Added aria-roles, labels, and documentation.
- [x] `LoadingState.css` - Loading styling
- [x] `EmptyState.jsx` - Empty state placeholder
- [x] `EmptyState.css` - Empty state styling
- [x] `SkeletonCard.jsx` - Skeleton loading card
- [x] `SkeletonCard.css` - Skeleton styling
- [x] `FavoriteButton.jsx` - Favorite toggle button
  - Findings:
    - VERIFIED: Already follows high quality standards.
- [x] `FavoriteButton.css` - Favorite button styling
- [x] `CopyButton.jsx` - Copy to clipboard button
  - Findings:
    - FIXED: Added clipboard API fallback, visual feedback states, and ARIA labels.
- [ ] `CopyButton.css` - Copy button styling
 - [x] `Breadcrumbs.jsx` - Breadcrumb navigation
  - Findings:
    - Proper ARIA attributes present (good)
    - Imports `BrowsingHistoryContext` but stores complex state
    - Could benefit from memoization in large navigation hierarchies
  - Action Plan:
    - Consider memoizing if used in deep hierarchies
    - Document the BrowsingHistory integration
- [x] `Breadcrumbs.css` - Breadcrumbs styling
  - Findings:
    - Animations have reduced-motion handling (good)
  - Action Plan:
    - No changes needed
- [ ] `MultiSelect.jsx` - Multi-select dropdown
  - Findings:
    - Not exported from index.js (missing from barrel)
    - No keyboard navigation (arrow keys to navigate options)
    - Missing ARIA attributes for dropdown/listbox pattern
  - Action Plan:
    - Add to index.js exports
    - Implement arrow key navigation and Escape to close
    - Add `role="listbox"`, `role="option"` ARIA attributes
- [ ] `MultiSelect.css` - Multi-select styling
- [ ] `RadioGroup.jsx` - Radio button group
  - Findings:
    - Not exported from index.js (missing from barrel)
    - May not support arrow key navigation (common for radio groups)
    - Missing `role="radiogroup"` and `role="radio"` attributes
  - Action Plan:
    - Add to index.js exports
    - Implement arrow key navigation between radio buttons
    - Add proper ARIA roles and attributes
- [ ] `RadioGroup.css` - Radio group styling
- [ ] `RangeSlider.jsx` - Range slider input
  - Findings:
    - Not exported from index.js (missing from barrel)
    - Should support arrow keys for precise adjustment
    - Missing `aria-valuemin`, `aria-valuemax`, `aria-valuenow` attributes
  - Action Plan:
    - Add to index.js exports
    - Implement keyboard support (arrow keys, Page Up/Down)
    - Add ARIA value attributes for accessibility
- [ ] `RangeSlider.css` - Slider styling
- [ ] `Autocomplete.jsx` - Autocomplete input
  - Findings:
    - Good debouncing and keyboard support (arrow navigation, Enter to select)
    - Can highlight match text on very long strings (line 155-167); may cause performance issues
    - No PropTypes but internal usage seems stable
  - Action Plan:
    - Add PropTypes for consistency
    - Optimize highlight rendering for long matches
    - Consider memoizing filtered results
- [ ] `Autocomplete.css` - Autocomplete styling
  - Findings:
    - Defines `--ease-smooth` token; ensure it exists globally in theme.css
  - Action Plan:
    - Verify token exists in global theme or define locally
- [ ] `CompareSelect.jsx` - Comparison selector
  - Findings:
    - References undocumented `word.d` property (line 25) which is fragile
    - No keyboard navigation for selection
    - Missing ARIA attributes for custom dropdown
  - Action Plan:
    - Document the `word.d` property or refactor to use standard properties
    - Add keyboard navigation support
    - Add proper ARIA dropdown/listbox attributes
- [ ] `CompareSelect.css` - Compare select styling
- [ ] `MatchScoreBars.jsx` - Match score visualization
  - Findings:
    - Not exported from index.js (missing from barrel)
    - Likely lacks ARIA labels for visualization (important for accessibility)
  - Action Plan:
    - Add to index.js exports
    - Add `aria-label` describing match scores
    - Consider adding text fallback for screen readers
- [ ] `MatchScoreBars.css` - Score bars styling
- [ ] `VirtualWordGrid.jsx` - Virtualized word grid
  - Findings:
    - Not exported from index.js (missing from barrel)
    - Name suggests virtualization but actual implementation should be verified
    - May need `role="grid"` and proper ARIA attributes
  - Action Plan:
    - Add to index.js exports
    - Verify virtualization is actually implemented
    - Add ARIA grid attributes if not present
- [ ] `VirtualWordGrid.css` - Virtual grid styling
- [ ] `MarkdownRenderer.jsx` - Markdown content renderer
  - Findings:
    - Potential XSS vulnerability if not sanitizing HTML properly
    - Should use a library like `DOMPurify` to sanitize markdown HTML output
    - No support for custom markdown extensions
  - Action Plan:
    - Review HTML sanitization approach (ensure using safe library)
    - Add `DOMPurify` or similar if rendering user-generated content
    - Document supported markdown syntax
- [ ] `MarkdownRenderer.css` - Markdown styling
  - Findings:
    - Might have contrast issues if using custom color tokens; verify token definitions
  - Action Plan:
    - Ensure all color tokens meet WCAG AA contrast standards
- [ ] `GenerativeArt.jsx` - Generative background art
  - Findings:
    - No dedicated CSS file (uses inline styles); inconsistent with other components
    - Line 29: Hash function is not cryptographically secure (acceptable for seeding but not ideal)
    - May render in every card, causing performance issues in large lists
    - Should have optional disable flag or lazy-render
  - Action Plan:
    - Consider creating GenerativeArt.css for consistency or document why inline styles are used
    - Add lazy-rendering or conditional rendering for performance in large lists
    - Add `aria-label` or alt text for screen readers
    - Consider making patterns cache-able by seed
- [ ] `OptimizedImage.jsx` - Lazy-loaded optimized images
  - Findings:
    - Uses Tailwind classes instead of dedicated CSS (inconsistent styling approach)
    - Other components use CSS modules; creates maintenance burden
    - Missing `alt` text for accessibility
    - No fallback for broken images
  - Action Plan:
    - Convert to CSS module for consistency with other components
    - Ensure required `alt` prop is enforced (add PropTypes)
    - Add error fallback/placeholder for failed loads
    - Consider srcset for responsive image serving

---

## 🗃️ Workspace Components (/src/components/workspace)

- [x] `index.js` - Workspace components barrel export
  - Findings:
    - **Critical: Export mismatch** - exports components that don't exist in directory:
      - `DraggableItem` - NOT FOUND (should be `DraggableCard`)
      - `WorkspaceDropZone` - NOT FOUND (should be `DropZone`)
      - `WorkspaceDndProvider` - NOT FOUND (no file with this name)
    - Only 2 components actually exported; 4 files exist (DraggableCard, DropZone, WorkspaceGraphD3, WorkspaceItemCard)
  - Action Plan:
    - FIXED: Corrected export names to match actual files.

- [ ] `DraggableCard.jsx` - Drag-and-drop card
- [ ] `DraggableCard.css` - Draggable card styling
- [ ] `DropZone.jsx` - Drop zone for draggables
- [ ] `WorkspaceItemCard.jsx` - Workspace item card
- [ ] `WorkspaceItemCard.css` - Item card styling
- [x] `WorkspaceGraphD3.jsx` - D3-based graph visualization
  - Findings:
    - **Non-deterministic visualization** - Line 79-80 uses `Math.random() > 0.7` for connection logic
    - Graph layout changes on every re-render, making it unstable/unpredictable
    - Line 106: Complex link source/target handling - `link.source` can be string or object (fragile)
    - **Hard-coded dimensions** - Canvas fixed at 800x500 (line 116-118); not responsive
    - Will overflow on mobile or smaller screens
    - Recreates entire D3 simulation on every `items` or `isOpen` change (performance issue)
    - No optimization for large datasets (100+ nodes)
    - **No accessibility** - Canvas visualization has no alt text or ARIA description
    - Icon-only buttons lack `aria-label` attributes
  - Action Plan:
    - FIXED: Replaced random connection logic with deterministic logic, implemented responsive resizing with ResizeObserver, added ARIA attributes and labels.


- [ ] `WorkspaceGraphD3.css` - D3 graph styling
  - Findings:
    - No responsive sizing rules
    - Canvas container may not resize with viewport
  - Action Plan:
    - Add responsive sizing rules (container queries or aspect ratio)
    - Ensure canvas scales on mobile devices

---

## 📄 Pages (/src/pages)

### Home & Navigation
- [ ] `Home.jsx` - Homepage
- Findings:
  - GSAP animations run without reduced-motion checks.
  - Hero search uses `searchIndex.words` only; domain/entity search not included.
- Action Plan:
  - Add `prefers-reduced-motion` guard for GSAP sequences.
  - Expand autocomplete data to include domains/entities or provide a scope toggle.
- [ ] `Home.css` - Homepage styling
- Findings:
  - Multiple animations/transforms lack reduced-motion overrides (hero glow, logo float, card hover).
- Action Plan:
  - Add `prefers-reduced-motion` overrides to disable animations/transforms.
- [ ] `NotFound.jsx` - 404 error page
- Findings:
  - No quick return to search or dictionary; single CTA only.
- Action Plan:
  - Add secondary links (Search, Home) for faster recovery.
- [ ] `NotFound.css` - 404 styling
- Findings:
  - Glitch and scanline animations lack reduced-motion handling.
- Action Plan:
  - Add `prefers-reduced-motion` overrides to disable glitch/scanline effects.

### Dictionary Pages
- [ ] `Dictionary.jsx` - Dictionary home page
- Findings:
  - Quick filter buttons lack `aria-pressed` and `type="button"`.
  - Surprise Me uses `Math.random()` and can feel repetitive.
- Action Plan:
  - Add `aria-pressed` states and `type="button"` on filter buttons.
  - Use a seeded or recently-used-aware random selection.
- [ ] `Dictionary.css` - Dictionary styling
- Findings:
  - Uses `--gradient-primary`/`--gradient-secondary` tokens which may be undefined.
  - Hover transforms lack reduced-motion overrides.
- Action Plan:
  - Replace missing tokens with `--brand-gradient` or defined theme tokens.
  - Add `prefers-reduced-motion` overrides for hover/animations.
- [ ] `DictionaryLetter.jsx` - Dictionary letter view
- Findings:
  - Some filter/search controls lack `type="button"` on clickables.
  - Grouped view header is sticky on all sizes; can obscure content on short screens.
- Action Plan:
  - Ensure all non-submit buttons use `type="button"`.
  - Disable sticky headers below a viewport height threshold or on mobile.
- [ ] `DictionaryLetter.css` - Letter view styling
- Findings:
  - Hover/transition effects lack reduced-motion handling.
- Action Plan:
  - Add `prefers-reduced-motion` overrides for transforms and transitions.
- [ ] `DictionaryWord.jsx` - Single word detail page
- Findings:
  - `handleCopyRhymes` silently fails; no user feedback on error.
  - Navigating to compare does not prefill current word.
- Action Plan:
  - Add error feedback on clipboard failures.
  - Pass current word in query params when navigating to compare.
- [ ] `DictionaryWord.css` - Word page styling
- Findings:
  - Animations/transforms lack reduced-motion overrides.
- Action Plan:
  - Add reduced-motion overrides for hover/animation effects.
- [ ] `DictionaryFavorites.jsx` - Favorited words
- Findings:
  - No sorting options or filters (recent vs A–Z).
- Action Plan:
  - Add basic sort toggle (recent vs A–Z) and persist preference.
- [ ] `DictionaryFavorites.css` - Favorites styling
- Findings:
  - Hover transforms lack reduced-motion handling.
- Action Plan:
  - Add reduced-motion overrides.

### Domain Pages
- [ ] `Domains.jsx` - Domains listing page
- Findings:
  - Category filter buttons lack `aria-pressed` and `type="button"`.
  - Search and filters run on every keystroke; no debounce.
- Action Plan:
  - Add `aria-pressed` and `type="button"` to filter buttons.
  - Debounce search input before filtering.
- [ ] `Domains.css` - Domains styling
- Findings:
  - Hover transforms lack reduced-motion handling.
- Action Plan:
  - Add reduced-motion overrides for hover transitions.
- [ ] `DomainDetail.jsx` - Single domain detail
- Findings:
  - FilterGroup toggle buttons missing `type="button"` and `aria-expanded`.
  - Active filter remove buttons lack `aria-label`.
- Action Plan:
  - Add `type="button"`, `aria-expanded`, and descriptive `aria-label`s.
- [ ] `DomainDetail.css` - Domain detail styling
- Findings:
  - Sticky sidebar and animated pulse indicator lack reduced-motion handling.
  - Mobile grid forces 3 columns; can be cramped.
- Action Plan:
  - Add reduced-motion overrides and disable sticky on small screens.
  - Use responsive `repeat(auto-fit, minmax(...))` for mobile grid.
- [ ] `DomainView.jsx` - Domain content view
- Findings:
  - Placeholder page; fetch logs to console and uses hardcoded `/hub` back link.
  - No error UI on failed fetch; no styling file referenced.
- Action Plan:
  - Replace with real entity list or remove route if deprecated.
  - Add proper error/loading state and consistent navigation.
- [ ] `EntityDetail.jsx` - Entity detail page
- Findings:
  - Pin button lacks `type="button"` and `aria-pressed` state.
  - Keyboard shortcut uses `p` but no user-visible hint.
- Action Plan:
  - Add `type="button"` and `aria-pressed`/`aria-label` to pin button.
  - Add a hint or tooltip for keyboard shortcuts.
- [ ] `EntityDetail.css` - Entity detail styling
- Findings:
  - Hover transforms and animations lack reduced-motion overrides.
  - Sticky meta panel may be awkward on short viewports.
- Action Plan:
  - Add reduced-motion overrides.
  - Disable sticky at small viewport heights.

### Utility Pages
- [ ] `Search.jsx` - Search results page
- Findings:
  - Adds queries to history on every keystroke; no debounce or submit trigger.
  - Fuse results ignore scores and mixed types are concatenated without ordering.
  - Filter chips are `Badge` components without button semantics/ARIA states.
- Action Plan:
  - Debounce query updates and write to history on submit or settled input.
  - Sort merged results by relevance score; consider separate sections per type.
  - Convert filter chips to buttons with `aria-pressed` or add `role="button"`/`tabIndex`.
- [ ] `Search.css` - Search page styling
- Findings:
  - Hover transforms and `fadeIn/slideDown` animations lack reduced-motion overrides.
- Action Plan:
  - Add `prefers-reduced-motion` rules to disable animations/transforms.
- [ ] `WordCompare.jsx` - Word comparison page
- Findings:
  - Share action only writes to clipboard; no user feedback or error handling.
  - URL comparison params are generated but not read on load.
  - Compare layout uses divs instead of table semantics (a11y).
- Action Plan:
  - Add toast/alert on share + handle clipboard errors.
  - Parse query params to preselect words when arriving via shared URL.
  - Consider semantic table markup or ARIA roles for the comparison grid.
- [ ] `WordCompare.css` - Compare styling
- Findings:
  - Hover transforms lack reduced-motion handling.
- Action Plan:
  - Add reduced-motion overrides for hover transitions.
- [ ] `RhymeGalaxy.jsx` - Visual rhyme exploration
- Findings:
  - Stats (patterns/complex words) recompute on every render.
  - Galaxy interactions rely on `GalaxyView`; no explicit keyboard/accessibility affordances.
- Action Plan:
  - Memoize derived stats with `useMemo`.
  - Audit `GalaxyView` for keyboard/ARIA support and document shortcuts.
- [ ] `RhymeGalaxy.css` - Galaxy styling
- Findings:
  - Hard-coded colors and shimmer animation ignore theme tokens and reduced-motion.
- Action Plan:
  - Map colors to theme variables and add reduced-motion overrides.
- [ ] `WritingStudio.jsx` - Writing studio page
- Findings:
  - Autosave interval is hardcoded (500ms) and ignores user preference settings.
  - Icon-only buttons rely on `title` and lack `aria-label`; some buttons omit `type="button"`.
  - Clipboard copy lacks user-facing error feedback.
- Action Plan:
  - Read autosave frequency from preferences and debounce writes.
  - Add `aria-label`s and `type="button"` on all non-submit buttons.
  - Add toast or inline feedback for clipboard errors.
- [ ] `WritingStudio.css` - Studio page styling
- Findings:
  - Animations/transforms lack reduced-motion handling.
  - Fixed `100vh` layout can be unstable on mobile browsers.
  - Multiple hard-coded colors bypass theme tokens.
- Action Plan:
  - Add `prefers-reduced-motion` overrides.
  - Switch to `100dvh` or `min-height` strategy on mobile.
  - Replace hard-coded colors with theme variables.
- [ ] `Stats.jsx` - User statistics page
- Findings:
  - No error handling if analytics fail to load; loading state is plain text.
- Action Plan:
  - Add error handling and a more informative empty state.
  - Add `aria-live="polite"` to loading/empty text.
- [ ] `Stats.css` - Stats page styling
- Findings:
  - Hover transforms lack reduced-motion handling.
- Action Plan:
  - Add reduced-motion overrides for hover transitions.
- [ ] `Settings.jsx` - Settings page
- Findings:
  - Tabs are not accessible (`role="tablist"`/`aria-selected`/`aria-controls` missing).
  - Import/export alerts lack `aria-live`.
  - Some tab buttons omit `type="button"`.
- Action Plan:
  - Implement accessible tabs with ARIA roles and keyboard navigation.
  - Add `aria-live` to alerts and success messages.
  - Add `type="button"` to all settings buttons.
- [ ] `Settings.css` - Settings styling
- Findings:
  - `slideDown`/`fadeIn` animations and hover transforms lack reduced-motion handling.
- Action Plan:
  - Add `prefers-reduced-motion` overrides.

### Info Pages
- [ ] `About.jsx` - About page
- Findings:
  - Duplicates `docsContent` with `Docs.jsx`, which can drift over time.
  - Tabs lack `role="tablist"`/`aria-selected`/`aria-controls`, and buttons omit `type="button"`.
  - Architecture blueprint interactions are hover-only; no keyboard focus/activation.
- Action Plan:
  - Extract documentation content into a shared module or markdown file.
  - Implement accessible tabs with proper roles/ARIA and `type="button"`.
  - Add keyboard focus/activation for blueprint layers (tabIndex/onFocus or move to buttons).
- [ ] `About.css` - About styling
- Findings:
  - Hover transforms and transitions lack `prefers-reduced-motion` overrides.
- Action Plan:
  - Add reduced-motion rules to disable hover lifts/transitions.
- [ ] `Architecture.jsx` - Architecture documentation
- Findings:
  - Duplicates architecture diagram logic from `About.jsx` (maintainability risk).
  - SVG layer interactivity is hover-only; no keyboard access.
- Action Plan:
  - Extract the diagram into a shared component used by both pages.
  - Add keyboard focus/activation and descriptive labels for the SVG layers.
- [ ] `Architecture.css` - Architecture styling
- Findings:
  - Animated connector lines and scanline lack reduced-motion handling.
  - Sticky info panel can be awkward when the layout stacks on small screens.
- Action Plan:
  - Add `prefers-reduced-motion` overrides for animations.
  - Disable `position: sticky` on mobile breakpoints.
- [ ] `Docs.jsx` - Documentation page
- Findings:
  - Duplicates `docsContent` with `About.jsx`; content lives inline in the component.
- Action Plan:
  - Move documentation content to a shared markdown/source module and import it.
  - Add a visible “last updated” field to build trust and context.
- [x] `Docs.css` - Docs styling
- Findings:
  - No issues found; typography is consistent with MarkdownRenderer styles.
- Action Plan:
  - No changes needed.
- [x] `ContentPage.css` - Generic content page styling
- Findings:
  - Generic content area lacks typography defaults for headings/lists, relying on per-page styles.
- Action Plan:
  - Add baseline typography rules or a reusable “content” class aligned with MarkdownRenderer.

---

## 🛠️ Utilities & Libraries (/src/lib)

### Context Providers
- [x] `WorkspaceContext.jsx` - Workspace state management
  - Findings:
    - VERIFIED: Already in `web/src/contexts`.
    - Does NOT contain `recentSearches` logic - that is handled by `SearchHistoryContext`.
    - Export logic is robust and appropriate for workspace management.
  - Action Taken:
    - Verified correct location and implementation.
    - No overlap with SearchHistoryContext found.
- [x] `FavoritesContext.jsx` - Favorites state
  - Findings:
    - VERIFIED: Already in `web/src/contexts`.
    - Uses storage key `jazer-rhyme-book-favorites`.
  - Action Taken:
    - Verified correct location.
- [x] `EntityLikesContext.jsx` - Likes/reactions state
  - Findings:
    - VERIFIED: Already in `web/src/contexts`.
    - Uses storage key `jazer-rhyme-book-entity-likes`.
  - Action Taken:
    - Verified correct location.
- [x] `FilterContext.jsx` - Filter state management
  - Findings:
    - VERIFIED: Already in `web/src/contexts`.
    - Uses `jazer_dictionary_filters` key (with underscore, consistent with other contexts).
  - Action Taken:
    - Verified correct location and storage key consistency.
- [x] `UserPreferencesContext.jsx` - User preferences
  - Findings:
    - VERIFIED: Already in `web/src/contexts`.
    - DOM variables match CSS tokens in `index.css` (--accent-primary, --accent-secondary, --accent-neon, etc.).
  - Action Taken:
    - Verified correct location.
    - Fixed import path for SoundManager (changed from './SoundManager' to '../lib/SoundManager').
    - Verified CSS variable mappings are correct.
- [x] `BrowsingHistoryContext.jsx` - Browsing history
  - Findings:
    - VERIFIED: Already in `web/src/contexts`.
    - Tracks both word and page history with separate arrays (reasonable architecture).
  - Action Taken:
    - Verified correct location and implementation.
- [x] `SearchHistoryContext.jsx` - Search history
  - Findings:
    - VERIFIED: Already in `web/src/contexts`.
    - Is the single source of truth for search history - no overlap with WorkspaceContext.
  - Action Taken:
    - Verified correct location and single-responsibility design.

### Core Utilities
- [ ] `hooks.js` - Custom React hooks
  - Findings:
    - Located in `web/src/lib` but contains primarily data-fetching hooks.
    - Lacks request cancellation (AbortController) and caching.
  - Action Plan:
    - Move to `web/src/hooks` or rename to `useData.js`.
    - Implement caching for fetched results.
- [ ] `dataLoader.js` - Data loading utilities
  - Findings:
    - Performs raw `fetch` without a caching layer.
    - Relies on manifests that may be missing, with complex fallback logic.
  - Action Plan:
    - Add a global fetch cache.
    - Standardize manifest generation to remove brittle fallback code.
- [ ] `rhymeFinder.js` - Rhyme matching algorithm
  - Findings:
    - Duplicates `countSyllables` logic found in `flowAnalysis.js`.
    - `getEndingSound` is a simple slice; might miss phonetic nuances.
  - Action Plan:
    - Centralize `countSyllables` into a core utility.
    - Improve phonetic ending detection.
- [ ] `flowAnalysis.js` - Flow pattern analysis
  - Findings:
    - Duplicates `countSyllables` logic.
    - Stress pattern detection is very basic (`●○` fallback).
  - Action Plan:
    - Use centralized syllable counter.
    - Enhance stress pattern logic using phonetic markers if available.
- [ ] `searchParser.js` - Search query parser
  - Findings:
    - Uses basic regex for filtering; no support for complex boolean logic (AND/OR/NOT is tokenized but not fully processed in `applyFilters`).
  - Action Plan:
    - Fully implement boolean operator logic in filtering functions.
- [ ] `recommendationEngine.js` - Content recommendations
  - Findings:
    - Jaccard similarity is good for tags but could be heavy for large datasets without memoization.
  - Action Plan:
    - Memoize similarity scores for active sessions.
- [ ] `collections.js` - Collection management
- [ ] `exportFormats.js` - Export formatting
- [ ] `voiceInput.js` - Voice input handler

### PWA & Performance
- [ ] `pwaHelpers.js` - PWA utilities
  - Findings:
    - Service worker path hardcoded to `/sw.js` (must match actual file and registration).
    - Uses `window.confirm` for update flow; intrusive for a production app.
    - `canInstallApp` uses `BeforeInstallPromptEvent` feature detection but no stored event handling.
    - Several functions log to console unconditionally.
    - Notification icons reference `/icon-*.png`, which are missing in `web/public`.
  - Action Plan:
    - Align SW filename/registration and gate logs behind `import.meta.env.DEV`.
    - Replace `confirm` flow with an in-app update banner/toast.
    - Capture and store `beforeinstallprompt` event for controlled prompts.
    - Add required icon assets or update paths.
- [ ] `offlineManager.js` - Offline data management
  - Findings:
    - Queue persists in `localStorage` with no size limit or retry/backoff strategy.
    - `executeAction` methods are stubs (console logs) and never resolve real sync.
    - Uses `Math.random` for IDs; possible collisions.
  - Action Plan:
    - Add max queue size and exponential backoff/attempt counts.
    - Implement real sync handlers or clearly mark as stub/demo.
    - Use a more robust ID strategy (timestamp + counter or crypto).
- [ ] `prefetchManager.js` - Resource prefetching
  - Findings:
    - Uses `rel="prefetch"` for hash URLs, which doesn’t prefetch app chunks.
    - No cleanup of IntersectionObserver on SPA route changes.
    - `predictNext` uses hard-coded routes and may be stale.
  - Action Plan:
    - Switch to `modulepreload` for dynamic imports or prefetch JSON/data only.
    - Add dedupe + cleanup for observers and links.
    - Make route predictions data-driven or configurable.
- [ ] `imageOptimizer.js` - Image optimization
  - Findings:
    - `createImageLoader` scans `img.lazy` once; misses images added later.
    - Adds query params for optimization regardless of backend support.
  - Action Plan:
    - Support dynamic images (MutationObserver or manual register).
    - Make optimization URL strategy configurable or no-op by default.
- [ ] `performanceMonitor.js` - Performance tracking
  - Findings:
    - Uses `process.env.NODE_ENV` (Vite should use `import.meta.env.MODE`).
    - Relies on deprecated `performance.timing`; no `PerformanceNavigationTiming`.
    - `beforeunload` logging can be noisy and inconsistent on modern browsers.
  - Action Plan:
    - Switch env checks to `import.meta.env.DEV`.
    - Use `performance.getEntriesByType('navigation')`.
    - Add sampling and disable logging in production by default.

### SEO & Analytics
- [ ] `seoHelpers.js` - SEO utilities
  - Findings:
    - Uses `window.location.origin` and builds clean URLs, which may conflict with `HashRouter`.
    - `generateWordPageMeta` uses `/dictionary/word/` path, but actual route is `/dictionary/:letter/:word`.
    - `DEFAULT_META.url` uses `window.location.origin` at module load (breaks in SSR).
  - Action Plan:
    - Align route formats with actual router paths.
    - Accept a base URL and build URLs via router utilities.
    - Lazily compute `DEFAULT_META` at runtime.
- [ ] `analytics.js` - Analytics tracking
  - Findings:
    - Stores all events in `localStorage` with no cap; can grow unbounded.
    - No anonymization/export versioning; schema could drift.
  - Action Plan:
    - Add rolling window limits (e.g., 5k events) and versioned schema.
    - Provide a clear export/import path for backups.

### Media & Audio
- [ ] `SoundManager.js` - Sound effects manager
  - Findings:
    - No user preference integration; `enabled` toggles only in memory.
    - AudioContext resumes on every play; no user gesture check.
  - Action Plan:
    - Persist sound enable/disable in preferences.
    - Add a `resume()` on first user interaction and reuse.
- [ ] `audioProcessing.js` - Audio analysis
  - Findings:
    - IndexedDB errors not handled robustly (no version migration strategy).
    - BPM detection uses fixed threshold and can be inaccurate across genres.
    - `BeatLooper` uses setInterval polling; could drift or be battery-heavy.
  - Action Plan:
    - Add error handling and migration hooks for DB version changes.
    - Make BPM detection configurable or use a stronger algorithm.
    - Use `timeupdate` events or `requestAnimationFrame` for looping.

### GSAP Animation
- [x] `gsap.js` - GSAP setup and configuration
  - Findings:
    - Duplicated plugin registration with `gsap/registerPlugins.js`
  - Action Taken:
    - ✅ Consolidated all plugin registration into main gsap.js
    - ✅ Registered ScrollTrigger, ScrollToPlugin, and Draggable
    - ✅ Added ScrollTrigger default configuration
    - ✅ Added reduced motion preference handling
    - ✅ Comprehensive JSDoc documentation
- [x] `gsap/registerPlugins.js` - GSAP plugin registration
  - Findings:
    - Split registrations caused confusion
  - Action Taken:
    - ✅ Converted to legacy re-export from main gsap.js
    - ✅ Added deprecation notice
    - ✅ All imports work from either location
- [x] `gsap/easing.js` - Custom easing functions
  - Findings:
    - Only defined presets without usage guidelines
  - Action Taken:
    - ✅ Added `motionPreset()` helper function
    - ✅ Added `withMotionPreference()` for reduced motion
    - ✅ Comprehensive usage examples in JSDoc
    - ✅ Standardized timing/stagger presets

### Accessibility
- [x] `accessibility.js` - A11y utilities
  - Findings:
    - `createFocusTrap` didn't handle empty focusable lists
    - `addSkipLink` used inline styles and could duplicate
    - `getContrastRatio` only handled rgb/rgba values
  - Action Taken:
    - ✅ Added empty focusable elements check with warning
    - ✅ Focus first element on trap creation
    - ✅ Added duplicate skip link guard
    - ✅ Moved skip link styles to CSS (index.css)
    - ✅ Enhanced `getContrastRatio` to support hex/hsl/rgba
    - ✅ Added HSL to RGB conversion
    - ✅ Added error handling with fallback
- [x] `useKeyboardShortcuts.js` - Keyboard shortcuts hook
  - Findings:
    - `showShortcutFeedback` injected styles on every call
    - `handleSequence` recreated per keydown
    - `formatShortcut` used non-ASCII symbols
  - Action Taken:
    - ✅ Ensured styles injected only once
    - ✅ Moved `handleSequence` outside event handler
    - ✅ Added ARIA attributes (role="status", aria-live)
    - ✅ Added `useUnicode` parameter to `formatShortcut`
    - ✅ Provided ASCII-safe fallbacks
    - ✅ Added reduced motion support to feedback

### Gamification
- [x] `achievements.js` - Achievements system
  - Findings:
    - Uses localStorage only; no versioning or migration.
    - `domainsVisited` stored as Set in memory; serialized as array without validation.
    - Achievements list is static; no localization or dynamic config.
  - Action Plan:
    - Add schema version and migrate on load.
    - Validate saved data and handle corrupted values.
    - Consider moving achievements to data/config for easier updates.

---

## 📊 Data Files (/src/lib/data)

- [x] `eras.js` - Hip-hop eras data
  - Findings:
    - FIXED: Added JSDoc types, centralized color maps, and dev-time validation.
- [x] `knowledgeHub.js` - Knowledge hub content
  - Findings:
    - FIXED: Avoids mutating module data, adds a simple search index, and gates logs in dev.
- [x] `philosophy.js` - Philosophy content
  - Findings:
    - FIXED: Normalized content whitespace and added basic metadata fields (order/tags).
- [x] `rapDictionary.js` - Dictionary data
  - Findings:
    - FIXED: Gated logs, improved section parsing, and added optional seeded randomness.
- [x] `tools.js` - Tools data
  - Findings:
    - FIXED: Normalized tool fields and added icon/links placeholders for consistency.
- [x] `tracks.js` - Track/beat data
  - Findings:
    - FIXED: Generator now normalizes titles and includes metadata placeholders (duration/bpm/mood/tags).

---

## 🎣 Custom Hooks (/src/hooks)

- [x] `useMobileGestures.js` - Mobile gesture handlers
  - Findings:
    - FIXED: Added touchcancel cleanup, guarded swipe-back in inputs/scroll areas, and made thresholds configurable.
    - FIXED: Documented pull-to-refresh usage note.
- [x] `useNetworkStatus.js` - Network connectivity detection
  - Findings:
    - FIXED: Uses `isOnline` correctly, adds `aria-live`, and falls back to window online/offline events.
- [x] `usePrefetch.js` - Resource prefetching hook
  - Findings:
    - FIXED: Defaults `enabled` to true, dedupes URLs, and guards for missing `IntersectionObserver`.
- [x] `useSEO.js` - SEO metadata hook
  - Findings:
    - FIXED: Tracks/removes managed meta tags, supports explicit canonical URL, and namespaces structured data scripts.
    - NOTE: Hook migration from `lib/` to `/hooks` still pending (separate refactor).

---

## 🎨 Global Styles (/src/styles)

- [x] `theme.css` - Theme variables and tokens
  - Findings:
    - Imported `../components/Layout.css`, creating reverse dependency.
    - Used legacy tokens like `--text-main`, `--border`, `--accent`, `--bg-panel`, `--glow`.
    - Contains legacy utility classes rather than token-only definitions.
  - Action Taken:
    - ✅ Removed Layout.css import to eliminate circular dependency.
    - ✅ Replaced legacy tokens with modern equivalents from index.css:
      - `--text-main` → `--text-primary`
      - `--border` → `--border-visible`
      - `--accent` → `--accent-primary`
      - `--bg-panel` → `--surface-1`
      - `--glow` → calculated from `--accent-primary-glow`
    - ✅ Added reduced-motion support to domain-card hover.
    - ✅ Added comment noting this contains legacy utility classes.
- [x] `glassmorphism.css` - Glassmorphism effects
  - Findings:
    - Duplicated `.glass` styles defined in `index.css`.
    - Uses data URI for noise texture (acceptable size tradeoff for quality).
  - Action Taken:
    - ✅ Removed duplicate `.glass` definition from index.css.
    - ✅ Added comment in index.css pointing to glassmorphism.css for comprehensive effects.
    - ✅ Kept noise texture as-is (provides better visual quality than smaller alternatives).
- [x] `mobile.css` - Mobile-specific styles
  - Findings:
    - Heavy `!important` usage could conflict with component styles.
    - Global `body` padding forces layout on all pages.
    - Duplicated reduced-motion/high-contrast rules from other files.
  - Action Taken:
    - ✅ Removed 15 instances of `!important` usage.
    - ✅ Scoped body padding to `.app` class instead of global `body`.
    - ✅ Removed duplicate reduced-motion block (defers to reduced-motion.css).
    - ✅ Removed duplicate high-contrast block (defers to high-contrast.css).
    - ✅ Maintained mobile-specific responsive utilities and touch targets.
- [x] `high-contrast.css` - High contrast mode
  - Findings:
    - Depended on `[data-theme="high-contrast"]` but no toggle wiring existed.
    - Token names align with base theme variables.
  - Action Taken:
    - ✅ Verified token alignment with index.css variables.
    - ✅ **IMPLEMENTED** High contrast toggle in UserPreferencesContext.
    - ✅ **CREATED** AccessibilitySettings component with toggle UI.
    - ✅ **INTEGRATED** into Settings page as new Accessibility tab.
    - ✅ Sets `[data-theme="high-contrast"]` attribute on `<html>` element.
    - ✅ Persists preference to localStorage.
- [x] `reduced-motion.css` - Reduced motion preferences
  - Findings:
    - Well-implemented with both media query and manual override support.
    - No duplication found (mobile.css duplicates were removed).
  - Action Taken:
    - ✅ Verified no duplication exists in index.css.
    - ✅ Confirmed components should use this as single source of truth.
    - ✅ File is production-ready and follows best practices.
    - ✅ **IMPLEMENTED** Motion preference control (Auto/Reduced/Full).
    - ✅ Sets `[data-motion]` attribute to enable manual overrides.

---

## ✨ Accessibility Enhancements (NEW)

### High Contrast Mode
- [x] **UserPreferencesContext Integration**
  - Added `highContrast` boolean to theme preferences
  - Created `toggleHighContrast()` helper function
  - Automatically sets `[data-theme="high-contrast"]` on document root
  - Persists setting to localStorage

### Reduced Motion Control
- [x] **Motion Preference Override**
  - Added `reducedMotion` to theme preferences (null/true/false)
  - Created `toggleReducedMotion()` helper (cycles: Auto → Reduced → Full → Auto)
  - Sets `[data-motion="reduced"]` or `[data-motion="normal"]` when overriding
  - `null` = respect system preference
  - `true` = force reduced motion
  - `false` = force full animations

### Accessibility Settings UI
- [x] **Component Created** (`AccessibilitySettings.jsx`)
  - Clean, modern toggle switches
  - Clear labels and descriptions
  - Mobile responsive layout
  - Keyboard accessible (focus-visible support)
  - Screen reader friendly (ARIA labels)
  - Integrated into Settings page as new tab

### User Experience
- **Settings Page Updates:**
  - Added Accessibility tab with Eye icon
  - Instant visual feedback on toggle
  - Auto-save to localStorage
  - Changes apply globally and immediately

---

## 📝 Notes for Review

### High Priority Areas
1. **Mobile Components** - Ensure all touch targets are 44x44px minimum
2. **Performance** - Review lazy loading and code splitting
3. **Accessibility** - Verify ARIA labels and keyboard navigation
4. **PWA** - Test offline functionality
5. **Animation** - Check reduced-motion preferences

### Common Issues to Look For
- [ ] Missing PropTypes/TypeScript definitions
- [ ] Unused imports
- [ ] Console.log statements
- [ ] Hardcoded values that should be constants
- [ ] Missing error boundaries
- [ ] Accessibility issues (missing alt text, ARIA labels)
- [ ] Performance bottlenecks (unnecessary re-renders)
- [ ] Mobile responsiveness issues
- [ ] SEO opportunities (meta tags, structured data)

### Enhancement Opportunities
- [ ] Component composition improvements
- [ ] State management optimization
- [ ] CSS consolidation
- [ ] Animation refinements
- [ ] Loading state improvements
- [ ] Error handling enhancements

---

## 🎯 How to Use This Checklist

1. **Review each file** individually in your code editor
2. **Check the box** `- [ ]` → `- [x]` when complete
3. **Document issues** in comments or separate tracking
4. **Mark priority** with 🔴 (critical), 🟡 (important), 🟢 (nice-to-have)
5. **Track time** spent on each section for future estimates

---

**Happy Reviewing! 🚀**
