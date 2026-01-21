# 📋 COMPLETE JaZeR Rhyme Book - File Review & Enhancement Checklist

**Last Updated:** January 20, 2026  
**Total Files:** 256  
**Purpose:** Comprehensive review of every file in the /web directory for manual enhancement and optimization

---

## 📊 Progress Overview

- **Root Files:** 0/8 ☐
- **Public Assets:** 0/5 ☐
- **Source Files:** 0/243 ☐
  - Components: 0/162 ☐
  - Pages: 0/23 ☐
  - Lib/Utils: 0/34 ☐
  - Hooks: 0/4 ☐
  - Styles: 0/5 ☐
  - Data: 0/6 ☐

**Overall Progress:** 0/256 (0%)

---

## 🗂️ Root Configuration Files

### Build & Config
- [ ] `vite.config.js` - Vite build configuration, plugins, and optimizations
  - Findings:
    - Consider gating `rollup-plugin-visualizer` and `viteCompression` to build/analyze modes to reduce dev overhead.
    - Use a modern `build.target` (e.g., `es2018` or `modules`) since this is for internal use.
    - Make `server.open` optional via env to avoid auto-opening during CLI workflows.
    - Consider not dropping all console logs in production; keep error/warn or gate by mode.
    - Revisit `manualChunks` to avoid over-splitting if some deps are unused.
    - Add `build.sourcemap` for staging/debug builds and `preview` port/strictPort for consistency.
- [ ] `package.json` - Dependencies, scripts, and project metadata
  - Findings:
    - Scripts use `scripts/vite.config.js`; consider consolidating to a single config.
    - No test/format/typecheck scripts or `engines`/`packageManager` pinning.
    - `prepare` runs for dev/build and may slow startup; consider a fast path.
    - Version is `0.0.0`; internal but could be a meaningful tag.
    - Both `@dnd-kit` and `react-dnd` are present; verify both are needed.
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

- [ ] `favicon.svg` - Browser tab icon
  - Findings:
    - Missing in `web/public`; only `icon.svg`, `logo.svg`, and `vite.svg` are present.
  - Action Plan:
    - Add `favicon.svg` (or update HTML to point at `icon.svg`) and generate PNG variants (16/32/180).
- [ ] `manifest.json` - PWA manifest configuration
  - Findings:
    - References `/icon-*.png` and `/screenshots/*.png` that do not exist in `web/public`.
    - `theme_color` is set to `#6366f1`; verify against current brand tokens.
  - Action Plan:
    - Add the referenced icon sizes and screenshots or remove entries to avoid broken PWA metadata.
    - Align `theme_color`/`background_color` with the actual UI palette.
- [ ] `robots.txt` - Search engine crawler rules
  - Findings:
    - Missing in `web/public`.
  - Action Plan:
    - Add a minimal `robots.txt` that allows crawling and references `sitemap.xml` once generated.
- [ ] `service-worker.js` - PWA service worker for offline support
  - Findings:
    - File is `web/public/sw.js`, not `service-worker.js` (check registration path).
    - Precaches `/offline.html` and `/icon-*.png`, which are missing.
    - Verbose console logs present; consider silencing in production builds.
  - Action Plan:
    - Align filename with registration or rename to `service-worker.js`.
    - Add `offline.html` and required icons, or update precache list.
    - Consider Workbox or add cache versioning/limits and GET-only caching.
- [ ] `sitemap.xml` - Search engine sitemap
  - Findings:
    - Missing in `web/public`.
  - Action Plan:
    - Generate a sitemap for public routes and include it in `web/public`.

---

## 📱 Source Files (/src)

### Entry Points
- [ ] `main.jsx` - React application entry point
- [ ] `test-main.jsx` - Test environment entry point
- [ ] `App.css` - Main application styles
- [ ] `App.jsx` - Root application component with routing
- [ ] `index.css` - Global CSS styles and imports

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
- [ ] `BackButton.jsx` - Navigation back button
  - Findings:
    - File is missing from `web/src/components`.
  - Action Plan:
    - Restore the component or remove it from the checklist if deprecated.
- [ ] `BackButton.css` - Back button styling
  - Findings:
    - File is missing from `web/src/components`.
  - Action Plan:
    - Restore the stylesheet or remove it from the checklist if deprecated.

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
- [ ] `EntityCard.jsx` - Generic entity display card
  - Findings:
    - `GenerativeArt` renders per card; may be heavy in large lists.
    - Icon-only buttons rely on `title` but lack `aria-label`s.
  - Action Plan:
    - Lazy-render or memoize `GenerativeArt` (or disable on large lists).
    - Add `aria-label`s for like/pin actions.
- [ ] `EntityCard.css` - Entity card styling
  - Findings:
    - Uses `--accent-secondary-dim`, which is not defined in global tokens.
  - Action Plan:
    - Define the missing token or switch to an existing theme variable.
- [ ] `SimilarEntities.jsx` - Related entities component
  - Findings:
    - Calls `getAllEntities()` on every entity change; could be expensive for large datasets.
  - Action Plan:
    - Use a precomputed index or memoized dataset; consider limiting by domain.
- [ ] `SimilarEntities.css` - Similar entities styling
  - Findings:
    - No reduced-motion handling for hover transforms.
  - Action Plan:
    - Add `prefers-reduced-motion` overrides for hover animations.

### Domain Components
- [ ] `DomainCard.jsx` - Domain category card
  - Findings:
    - File is missing from `web/src/components` (DomainGrid imports `DomainCard2`).
  - Action Plan:
    - Restore `DomainCard` or update checklist to reference `DomainCard2`.
- [ ] `DomainCard.css` - Domain card styling
  - Findings:
    - File is missing from `web/src/components`.
  - Action Plan:
    - Restore the stylesheet or update checklist if deprecated.
- [ ] `DomainGrid.jsx` - Grid layout for domains
  - Findings:
    - Imports `DomainCard2` while checklist references `DomainCard`.
    - `DOMAIN_ICONS` is defined but unused.
  - Action Plan:
    - Align checklist/component usage and remove unused constants or wire icons into cards.
- [ ] `DomainGrid.css` - Domain grid styling
  - Findings:
    - Uses `--surface-overlay`, which may be undefined globally.
  - Action Plan:
    - Define the token or switch to an existing surface variable.

### Dictionary Components
- [ ] `DictionaryNav.jsx` - A-Z dictionary navigation
  - Findings:
    - File is missing from `web/src/components`.
  - Action Plan:
    - Restore the component or remove it from the checklist if deprecated.
- [ ] `DictionaryNav.css` - Dictionary nav styling
  - Findings:
    - File is missing from `web/src/components`.
  - Action Plan:
    - Restore the stylesheet or remove it from the checklist if deprecated.

### Error Handling
- [ ] `ErrorBoundary.jsx` - React error boundary
  - Findings:
    - Uses `process.env.NODE_ENV`; Vite prefers `import.meta.env`.
    - `handleGoHome` uses `/` which may not work with `HashRouter`.
    - Logs error data to `localStorage` without size/PII guard.
  - Action Plan:
    - Switch to `import.meta.env.DEV/PROD` checks.
    - Navigate home using router or `#/` when hash routing is used.
    - Add size limits/PII filtering or make logging optional.
- [ ] `ErrorBoundary.css` - Error boundary styling
  - Findings:
    - Hardcoded light/dark palettes that ignore app design tokens.
    - Animations ignore reduced-motion preferences.
  - Action Plan:
    - Restyle using theme tokens and add reduced-motion overrides.

### Miscellaneous Components
- [ ] `RandomDiscovery.jsx` - Random content discovery
  - Findings:
    - Uses a fixed 500ms spinner timeout; no cancellation on unmount.
  - Action Plan:
    - Clear pending timeouts on unmount and handle empty results gracefully.
- [ ] `RandomDiscovery.css` - Random discovery styling
  - Findings:
    - Uses `--gradient-primary`, which may not exist in global tokens.
  - Action Plan:
    - Replace with `--brand-gradient` or define the missing token.
- [ ] `RhymeSchemeAnalyzer.jsx` - Rhyme pattern analysis
  - Findings:
    - Scheme letter assignment can overflow beyond `Z` for long texts.
  - Action Plan:
    - Cap/loop scheme labels after `Z` or use a wider labeling strategy.
- [ ] `RhymeSchemeAnalyzer.css` - Analyzer styling
  - Findings:
    - Hover animations lack reduced-motion handling.
  - Action Plan:
    - Add `prefers-reduced-motion` overrides for hover transforms.
- [ ] `GhostModule.jsx` - Placeholder/skeleton component
  - Findings:
    - References `/beats/lofi-loop.mp3`, which may not exist in `public`.
    - Imports `getRhymeScheme` but never uses it.
    - Uses random heights for syllable bars on each render (visual jitter).
    - Uses `--accent-tertiary` token which may be undefined.
  - Action Plan:
    - Add the audio asset or make the beat source configurable.
    - Remove unused imports and stabilize the syllable bar visualization.
    - Define or replace missing tokens; add `aria-label`s for controls.
- [ ] `GhostModule.css` - Ghost module styling
  - Findings:
    - Uses `--accent-tertiary`, which is not defined globally.
  - Action Plan:
    - Replace with existing accent tokens or define the variable.
- [ ] `ImmersiveMode.jsx` - Full-screen immersive view
  - Findings:
    - Random particle positions are regenerated each render (visual jitter).
    - Multiple animated layers (scanlines, particles, glow) ignore reduced-motion.
    - Icon-only buttons rely on `title` only.
  - Action Plan:
    - Memoize particle positions and add reduced-motion toggles.
    - Add `aria-label`s and consider keyboard shortcuts for controls.
- [ ] `ImmersiveMode.css` - Immersive mode styling
  - Findings:
    - Heavy animations without reduced-motion fallback.
  - Action Plan:
    - Add `prefers-reduced-motion` overrides for scanlines/particles/glow.
- [ ] `InstallPrompt.jsx` - PWA install prompt
  - Findings:
    - Uses `setTimeout` without cleanup; logs to console in production.
    - Uses localStorage but no guard for storage failures.
  - Action Plan:
    - Clear timeouts on unmount and gate logs by env.
    - Wrap storage access in try/catch and add aria-labels for close/dismiss.
- [ ] `InstallPrompt.css` - Install prompt styling
  - Findings:
    - Uses custom color tokens (`--bg-secondary`, `--accent`) that may not exist.
  - Action Plan:
    - Align with global theme tokens and add reduced-motion overrides.
- [ ] `KeyboardShortcutsHelp.jsx` - Keyboard shortcuts modal
  - Findings:
    - No focus trap or Escape key handling in the modal itself.
    - Assumes all `SHORTCUTS` keys exist; no fallback.
  - Action Plan:
    - Add focus trap + Escape handler and guard against missing shortcut entries.
- [ ] `KeyboardShortcutsHelp.css` - Shortcuts help styling
  - Findings:
    - Hover animations lack reduced-motion handling.
  - Action Plan:
    - Add `prefers-reduced-motion` overrides.
- [ ] `StudioPlayer.jsx` - Audio player for studio
  - Findings:
    - Loads all track metadata from `tracks` at module load; can be heavy.
    - Global keyboard shortcuts may conflict with app-level shortcuts.
  - Action Plan:
    - Lazy-load track metadata or page it; gate shortcuts when player is not focused.
    - Add a global preference to disable/enable player hotkeys.
- [ ] `StudioPlayer.css` - Player styling
  - Findings:
    - File appears duplicated (two different style blocks).
  - Action Plan:
    - Remove duplicate blocks and keep a single source of truth.
- [ ] `SystemStatus.jsx` - System status indicator
  - Findings:
    - Metrics are randomized and labeled as real (e.g., latency, memory).
    - Displays local time as UTC.
  - Action Plan:
    - Either wire to real metrics or label as simulated.
    - Show actual local time zone or format explicitly as UTC.
- [ ] `SystemStatus.css` - Status styling
  - Findings:
    - File contains `StudioPlayer` styles instead of status styles.
  - Action Plan:
    - Replace with the correct SystemStatus styles and restore missing CSS.
- [ ] `HapticFeedback.jsx` - Haptic feedback handler
  - Findings:
    - Plays sounds on all clicks/routes with no user preference or mute control.
  - Action Plan:
    - Respect user preferences (mute/disable) and avoid triggering on form inputs.

---

## 🏠 Home Section Components (/src/components/home)

- [ ] `DailyDigest.jsx` - Daily content summary
  - Findings:
    - Recomputes tag counts across all entities each time the search index loads.
  - Action Plan:
    - Precompute trending tags in the data layer or memoize the counts.
- [ ] `DailyDigest.css` - Digest styling
  - Findings:
    - Uses `--gradient-primary`, which may not be defined globally.
    - Animations lack reduced-motion overrides.
  - Action Plan:
    - Replace with `--brand-gradient` or define the token; add reduced-motion styles.
- [ ] `FeaturedContent.jsx` - Featured items showcase
  - Findings:
    - Featured domain link uses `/entities/${featuredDomain.id}` but routes expect `/domains/:id`.
    - Random selection is not deterministic (changes on each mount).
  - Action Plan:
    - Fix the domain route and make selections date-based for consistency.
- [ ] `FeaturedContent.css` - Featured content styling
  - Findings:
    - Uses `--gradient-primary`, `--gradient-secondary`, `--accent-primary-dim`, `--accent-primary-bright` which may be undefined.
  - Action Plan:
    - Replace with existing theme tokens or define the missing variables.
- [ ] `RecommendedFeed.jsx` - Personalized recommendations
  - Findings:
    - Recommendation computations run on every history/favorites change; could be heavy.
  - Action Plan:
    - Memoize or move recommendation calculations to a worker/data layer.
- [ ] `RecommendedFeed.css` - Feed styling
  - Findings:
    - Uses `--gradient-primary`, which may not be defined globally.
    - Animations lack reduced-motion overrides.
  - Action Plan:
    - Replace with `--brand-gradient` or define the token; add reduced-motion styles.

---

## 📑 Section Components (/src/components/sections)

- [ ] `HeroSection.jsx` - Homepage hero banner
  - Findings:
    - GSAP animations run without reduced-motion checks.
  - Action Plan:
    - Skip/shorten animations when `prefers-reduced-motion` is enabled.
- [ ] `HeroSection.css` - Hero styling
  - Findings:
    - No reduced-motion handling for hover/ambient effects.
  - Action Plan:
    - Add reduced-motion overrides for ambient/hover effects.
- [ ] `EraTimeline.jsx` - Hip-hop eras timeline
  - Findings:
    - Uses `ScrollTrigger` without clear registration in this file.
    - Era dots are not interactive (no click/scroll behavior).
  - Action Plan:
    - Ensure `ScrollTrigger` is registered globally.
    - Add click-to-scroll for era dots and reduced-motion fallbacks.
- [ ] `EraTimeline.css` - Timeline styling
  - Findings:
    - Fixed right-side nav may overlap small screens.
  - Action Plan:
    - Add responsive rules to reposition or hide era nav on mobile.
- [ ] `InfluencesGrid.jsx` - Artist influences grid
  - Findings:
    - GSAP animations run without reduced-motion checks.
  - Action Plan:
    - Add reduced-motion handling to disable scroll animations.
- [ ] `InfluencesGrid.css` - Influences styling
  - Findings:
    - Hover animations lack reduced-motion handling.
  - Action Plan:
    - Add `prefers-reduced-motion` overrides.
- [ ] `KnowledgeHubExplorer.jsx` - Knowledge hub browser
  - Findings:
    - Search has no debounce; domain filter can render very large lists.
  - Action Plan:
    - Add debounce and paginate/virtualize large entity lists.
- [ ] `KnowledgeHubExplorer.css` - Explorer styling
  - Findings:
    - No empty/loading state styles for large queries.
  - Action Plan:
    - Add loading/empty state styles and responsive tweaks for long filters.
- [ ] `Philosophy.jsx` - Philosophy section
  - Findings:
    - GSAP animations run without reduced-motion checks.
  - Action Plan:
    - Add reduced-motion handling for scroll-triggered reveals.
- [ ] `Philosophy.css` - Philosophy styling
  - Findings:
    - No reduced-motion styling for pull-quote emphasis.
  - Action Plan:
    - Add reduced-motion overrides for emphasis animations.
- [ ] `RapDictionaryExplorer.jsx` - Dictionary preview
  - Findings:
    - Letter filter can render very large lists; search is not debounced.
  - Action Plan:
    - Add debounce and paginate/virtualize word lists.
- [ ] `RapDictionaryExplorer.css` - Dictionary explorer styling
  - Findings:
    - No loading/empty state styles for large searches.
  - Action Plan:
    - Add loading/empty styles and responsive tightening for large grids.
- [ ] `ToolsDeck.jsx` - Tools showcase
  - Findings:
    - GSAP animations run without reduced-motion checks.
  - Action Plan:
    - Add reduced-motion handling for scroll-triggered reveals.
- [ ] `ToolsDeck.css` - Tools deck styling
  - Findings:
    - Hover animations lack reduced-motion handling.
  - Action Plan:
    - Add `prefers-reduced-motion` overrides.

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
- [ ] `SearchResults.css` - Results styling
  - Findings:
    - Hover animations already have reduced-motion handling (good).
  - Action Plan:
    - No changes needed unless visual direction shifts.
- [ ] `SearchSuggestions.jsx` - Search autocomplete
  - Findings:
    - `getDidYouMean` runs Levenshtein over entire dictionary (expensive for large lists).
  - Action Plan:
    - Limit dictionary size, pre-index, or move suggestion logic to a worker.
- [ ] `SearchSuggestions.css` - Suggestions styling
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
- [ ] `ResultCategory.jsx` - Categorized results
  - Findings:
    - Collapsible UI looks solid; no functional issues found.
  - Action Plan:
    - No changes needed unless accessibility requirements expand.
- [ ] `ResultCategory.css` - Category styling
  - Findings:
    - Reduced-motion handling is present (good).
  - Action Plan:
    - No changes needed unless tokens change.
- [ ] `EmptyState.jsx` - No results state
  - Findings:
    - Trending terms are hardcoded (not data-driven).
  - Action Plan:
    - Replace with real trending terms or remove the section.
- [ ] `EmptyState.css` - Empty state styling
  - Findings:
    - Reduced-motion handling is present (good).
  - Action Plan:
    - No changes needed unless tokens change.

---

## 📊 Stats Components (/src/components/stats)

- [ ] `ActivityCalendar.jsx` - User activity heatmap
  - Findings:
    - `activityData` is assumed to be non-empty; `Math.max` on empty data yields `-Infinity`.
  - Action Plan:
    - Default `activityData` to `{}` and guard for empty datasets.
- [ ] `ActivityCalendar.css` - Calendar styling
  - Findings:
    - Uses `--glass-*` and `--activity-level-*` tokens; ensure they exist.
  - Action Plan:
    - Define tokens or map to existing theme variables.
- [ ] `DomainChart.jsx` - Domain usage charts
  - Findings:
    - Division by zero when `domainData` is empty.
  - Action Plan:
    - Guard empty datasets and display an empty-state message.
- [ ] `DomainChart.css` - Chart styling
  - Findings:
    - Animations lack reduced-motion overrides.
  - Action Plan:
    - Add `prefers-reduced-motion` handling for bar animations.
- [ ] `ShareCard.jsx` - Social sharing card
  - Findings:
    - Download uses an alert placeholder; no actual image export.
  - Action Plan:
    - Use `html-to-image` or canvas export for real downloads and add error handling.
- [ ] `ShareCard.css` - Share card styling
  - Findings:
    - Uses hard-coded gradients instead of theme tokens.
  - Action Plan:
    - Align gradients/colors with the global design tokens.

---

## 🏆 Gamification Components (/src/components/gamification)

- [ ] `AchievementUnlock.jsx` - Achievement notification
- [ ] `AchievementUnlock.css` - Achievement styling
- [ ] `ProgressBar.jsx` - Progress indicator
- [ ] `ProgressBar.css` - Progress bar styling

---

## 🎭 Domain Specific Components (/src/components/domains)

- [ ] `DomainStats.jsx` - Domain statistics display
- [ ] `DomainStats.css` - Stats styling

---

## ✨ Interactions Components (/src/components/interactions)

- [ ] `index.js` - Interactions barrel export
- [ ] `MagneticButton.jsx` - Magnetic hover effect button
- [ ] `MagneticButton.css` - Magnetic button styling
- [ ] `HoverCard.jsx` - Data-rich hover overlay
- [ ] `HoverCard.css` - Hover card styling
- [ ] `HapticFeedback.jsx` - Haptic feedback wrapper
- [ ] `HapticFeedback.css` - Haptic styling

---

## 📱 Mobile Components (/src/components/mobile)

- [ ] `index.js` - Mobile components barrel export
- [ ] `BottomSheet.jsx` - Mobile bottom sheet drawer
- [ ] `BottomSheet.css` - Bottom sheet styling
- [ ] `MobileHeader.jsx` - Mobile header with hamburger
- [ ] `MobileHeader.css` - Mobile header styling
- [ ] `MobileNavigation.jsx` - Mobile nav menu
- [ ] `MobileNavigation.css` - Mobile nav styling
- [ ] `CompactCard.jsx` - Compact mobile card
- [ ] `CompactCard.css` - Compact card styling
- [ ] `MobileOptimizedGrid.jsx` - Mobile-optimized grid layout
- [ ] `MobileOptimizedGrid.css` - Grid styling
- [ ] `ResponsiveCard.jsx` - Responsive card component
- [ ] `ResponsiveCard.css` - Responsive card styling
- [ ] `SwipeableCard.jsx` - Swipeable card with gestures
- [ ] `SwipeableCard.css` - Swipeable card styling
- [ ] `TouchFriendlyButton.jsx` - Touch-optimized button
- [ ] `TouchFriendlyButton.css` - Touch button styling
- [ ] `SwipeHandler.jsx` - Swipe gesture handler

---

## 🎬 Motion Components (/src/components/motion)

- [ ] `PageTransition.jsx` - Page transition animations
- [ ] `PageTransition.css` - Transition styling
- [ ] `BootSequence.jsx` - App loading boot sequence
- [ ] `BootSequence.css` - Boot sequence styling
- [ ] `ScanningLines.jsx` - Cyber scanning line effect
- [ ] `ScanningLines.css` - Scanning lines styling
- [ ] `TextScramble.jsx` - Text scramble animation
- [ ] `ScrollContainer.jsx` - Smooth scroll container
- [ ] `useGSAPContext.js` - GSAP context hook

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
- [ ] `BeatLibraryManager.jsx` - Beat library management
  - Findings:
    - Line 67: TODO not implemented - `handlePlayPreview()` doesn't actually play audio, creates false functionality
    - Line 75: TODO not implemented - favorite toggling doesn't persist to IndexedDB, state is lost on reload
    - Icon-only buttons lack `aria-label` attributes for accessibility
    - No modal ARIA attributes (role="dialog", aria-modal="true")
  - Action Plan:
    - Implement actual audio preview using Web Audio API or HTML5 audio element
    - Wire favorite toggles to IndexedDB persistence with error handling
    - Add `aria-label` to all icon buttons and modal ARIA attributes for accessibility
- [ ] `BeatLibraryManager.css` - Library styling
- [ ] `BeatUploader.jsx` - Beat upload interface
  - Findings:
    - Line 77: Inefficient FileReader base64 conversion; IndexedDB can store Blob objects directly
    - No validation for file size limits before processing
    - Missing error handling for failed uploads
  - Action Plan:
    - Store Blobs directly in IndexedDB instead of base64 encoding (reduces memory footprint)
    - Add file size validation (e.g., max 50MB) before processing
    - Implement proper error UI and retry logic for upload failures
- [ ] `BeatUploader.css` - Uploader styling
- [ ] `ExportDialog.jsx` - Export lyrics dialog
  - Findings:
    - Line 3: Incorrect import path - uses `../lib/exportFormats` but should be `../../lib/exportFormats` (one less `../`)
    - This will cause module not found error and break exports
    - Missing modal ARIA attributes (role="dialog", aria-modal="true")
    - No keyboard navigation support (Tab/Escape)
  - Action Plan:
    - Fix import path to `../../lib/exportFormats`
    - Add ARIA attributes and keyboard navigation (Escape to close, Tab to navigate)
    - Test all export formats before shipping
- [ ] `ExportDialog.css` - Export dialog styling
- [ ] `ShareDialog.jsx` - Share lyrics dialog
  - Findings:
    - Line 17: Uses `btoa()` for encoding share links - unencrypted and unsafe for sensitive data
    - Should use proper URL encoding or backend-generated share tokens
    - Missing modal ARIA attributes and keyboard support
  - Action Plan:
    - Replace `btoa()` with proper URL encoding (`encodeURIComponent()`)
    - Consider backend-generated secure share tokens for sensitive content
    - Add ARIA attributes and keyboard navigation
- [ ] `ShareDialog.css` - Share dialog styling
- [ ] `FeedbackPanel.jsx` - Writing feedback panel
- [ ] `FeedbackPanel.css` - Feedback styling
- [ ] `FlowAnalyzer.jsx` - Flow pattern analysis
  - Findings:
    - Recalculates syllable counts multiple times; lacks result caching
    - Performance degrades with long lyrics (>1000 lines)
    - No memoization of intermediate calculations
  - Action Plan:
    - Implement memoized syllable calculation using `useMemo()`
    - Cache results keyed by word hash to avoid recalculation
    - Add performance monitoring for long texts
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

- [ ] `index.js` - UI components barrel export
  - Findings:
    - Missing 7 exports from the directory (only 12 of 22 components exported):
      - `Autocomplete` (file exists but not exported)
      - `MatchScoreBars` (file exists but not exported)
      - `MultiSelect` (file exists but not exported)
      - `RadioGroup` (file exists but not exported)
      - `RangeSlider` (file exists but not exported)
      - `SkeletonCard` (file exists but not exported)
      - `VirtualWordGrid` (file exists but not exported)
    - Makes it impossible to import these components from the barrel
  - Action Plan:
    - Add all missing exports to index.js
    - Audit other component directories for similar export gaps
    - Consider using TypeScript or a linter rule to enforce barrel consistency
- [ ] `Button.jsx` - Standard button component
  - Findings:
    - No PropTypes validation (unlike FavoriteButton which has them)
    - No `aria-label` support for icon-only buttons
    - Uses `--variant` naming but only in CSS (no design documentation)
  - Action Plan:
    - Add PropTypes for type safety and IDE support
    - Support `aria-label` prop for icon variants
    - Document all available variants and their use cases
- [ ] `Button.css` - Button styling
  - Findings:
    - Uses BEM-like naming (`button--variant`) which is good
    - Animations lack `prefers-reduced-motion` overrides
  - Action Plan:
    - Add `@media (prefers-reduced-motion)` rules for all hover/focus animations
- [ ] `Card.jsx` - Card container component
  - Findings:
    - No PropTypes or type validation
    - Renders sub-components (CardHeader, CardBody, etc.) but docs unclear
  - Action Plan:
    - Add PropTypes documentation
    - Create clear examples/docs for sub-component usage
- [ ] `Card.css` - Card styling
  - Findings:
    - Inconsistent naming (uses `card--variant` and `card__section`); good BEM but not standardized with other components
    - Reduced-motion handling present (good)
  - Action Plan:
    - Ensure consistency with other component naming patterns
- [ ] `Badge.jsx` - Badge/tag component
  - Findings:
    - No PropTypes validation
    - Limited variant support; consider adding `success`, `error`, `warning` variants
  - Action Plan:
    - Add PropTypes
    - Extend variants if used in different contexts
- [ ] `Badge.css` - Badge styling
- [ ] `SearchBar.jsx` - Search input bar
  - Findings:
    - No keyboard navigation documentation
    - Missing `aria-label` for the input field
    - No clear error state styling
  - Action Plan:
    - Document keyboard shortcuts and navigation
    - Add `aria-label` and `aria-describedby` for error messages
    - Add CSS for error/warning states
- [ ] `SearchBar.css` - Search bar styling
  - Findings:
    - Animations need `prefers-reduced-motion` handling
  - Action Plan:
    - Add reduced-motion media query for smooth transitions
- [ ] `LoadingState.jsx` - Loading spinner/skeleton
  - Findings:
    - Exports 3 variants (Spinner, Skeleton, Shimmer) but unclear in export
    - Missing `aria-label` for spinner (should announce "Loading")
  - Action Plan:
    - Document all 3 variants clearly in code comments
    - Add default `aria-label="Loading"` to spinner variant
    - Consider adding `role="status"` or `role="progressbar"`
- [ ] `LoadingState.css` - Loading styling
  - Findings:
    - Heavy animations without `prefers-reduced-motion` fallback
  - Action Plan:
    - Add `prefers-reduced-motion` overrides to disable animations
- [ ] `EmptyState.jsx` - Empty state placeholder
  - Findings:
    - No PropTypes for message/icon customization
  - Action Plan:
    - Add PropTypes for customizable messages and icons
- [ ] `EmptyState.css` - Empty state styling
- [ ] `SkeletonCard.jsx` - Skeleton loading card
  - Findings:
    - Not exported from index.js (missing from barrel)
    - No `aria-busy` or accessibility indication that content is loading
  - Action Plan:
    - Add to index.js exports
    - Add `aria-busy="true"` and `aria-label="Loading"` for screen readers
- [ ] `SkeletonCard.css` - Skeleton styling
- [ ] `FavoriteButton.jsx` - Favorite toggle button
  - Findings:
    - Only UI component with PropTypes (good standard to follow)
    - Has proper `aria-label` support
  - Action Plan:
    - Use as template for other components to match this quality standard
- [ ] `FavoriteButton.css` - Favorite button styling
  - Findings:
    - Animations have `prefers-reduced-motion` handling (good)
  - Action Plan:
    - No changes needed; maintain this standard
- [ ] `CopyButton.jsx` - Copy to clipboard button
  - Findings:
    - Doesn't handle clipboard API failures gracefully (old browsers, permission denied)
    - No feedback state (should show "Copied!" briefly)
    - Missing `aria-label`
  - Action Plan:
    - Add try/catch for clipboard API with fallback to `document.execCommand()`
    - Add visual feedback (toast/label change) for successful copy
    - Add `aria-label` that updates when copied
- [ ] `CopyButton.css` - Copy button styling
- [ ] `Breadcrumbs.jsx` - Breadcrumb navigation
  - Findings:
    - Proper ARIA attributes present (good)
    - Imports `BrowsingHistoryContext` but stores complex state
    - Could benefit from memoization in large navigation hierarchies
  - Action Plan:
    - Consider memoizing if used in deep hierarchies
    - Document the BrowsingHistory integration
- [ ] `Breadcrumbs.css` - Breadcrumbs styling
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

- [ ] `index.js` - Workspace components barrel export
  - Findings:
    - **Critical: Export mismatch** - exports components that don't exist in directory:
      - `DraggableItem` - NOT FOUND (should be `DraggableCard`)
      - `WorkspaceDropZone` - NOT FOUND (should be `DropZone`)
      - `WorkspaceDndProvider` - NOT FOUND (no file with this name)
    - Only 2 components actually exported; 4 files exist (DraggableCard, DropZone, WorkspaceGraphD3, WorkspaceItemCard)
    - This causes import failures if consumers try to import the non-existent names
  - Action Plan:
    - Fix exports: export actual component names that exist
    - Add missing `DropZone` export (currently missing)
    - Add missing `WorkspaceGraphD3` export (currently missing)
    - Remove non-existent component exports
    - Consider if `WorkspaceDndProvider` is needed as a new wrapper component

- [ ] `DraggableCard.jsx` - Drag-and-drop card
  - Findings:
    - **Incomplete implementation** - Sets `draggable={!disabled}` HTML5 attribute but no event handlers
    - No `onDragStart`, `onDragEnd`, or `onDrag` handlers implemented
    - Only 40 lines of code; appears to be a stub waiting for drag-drop integration
    - References drag-and-drop but doesn't actually implement any drag logic
    - No integration with `@dnd-kit` or `react-dnd` (both in package.json)
    - Missing ARIA `role="button"` and keyboard support for draggable items
  - Action Plan:
    - Implement drag event handlers (onDragStart, onDragEnd, onDrag)
    - Wire up with actual drag-drop library (@dnd-kit recommended over react-dnd)
    - Add `role="button"` and `aria-draggable="true"` ARIA attributes
    - Add keyboard support for accessibility (e.g., Enter to activate drag mode)
    - Document the drag-drop integration approach

- [ ] `DraggableCard.css` - Draggable card styling
  - Findings:
    - Uses placeholder styles; appears unfinished
  - Action Plan:
    - Add visual feedback for drag states (`dragging`, `drag-over`, `disabled`)
    - Add styles for keyboard focus indicator

- [ ] `DropZone.jsx` - Drop zone for draggables
  - Findings:
    - **Incomplete implementation** - Only 10 lines of code; extremely minimal
    - No `onDrop`, `onDragOver`, `onDragLeave`, `onDragEnter` handlers
    - File is missing CSS file while similar components have it
    - No validation of dropped content
    - No ARIA attributes for drop zone region
    - Name suggests functionality but doesn't deliver it
  - Action Plan:
    - Implement full drop zone event handlers
    - Add drop zone validation (e.g., accept only draggable cards)
    - Create accompanying DropZone.css with visual feedback states
    - Add `role="region"` and `aria-label` for accessibility
    - Consider `role="button"` with keyboard support for keyboard users

- [ ] `WorkspaceItemCard.jsx` - Workspace item card
  - Findings:
    - No PropTypes validation (inconsistent with FavoriteButton standard)
    - Line 41: Uses CSS custom property `--item-color` without fallback value
    - Missing null safety checks for optional fields (subtitle, notes, link)
    - Could render undefined/null values in template if data incomplete
    - No memoization despite potentially rendering in large lists
  - Action Plan:
    - Add PropTypes for type safety
    - Provide fallback for `--item-color` or ensure it's always defined
    - Add null checks: `{subtitle && <div>{subtitle}</div>}` pattern
    - Memoize with `React.memo()` if in scrollable lists
    - Add proper `aria-label` for card content

- [ ] `WorkspaceItemCard.css` - Item card styling
  - Findings:
    - Missing `--item-color` definition or fallback
    - Animations lack `prefers-reduced-motion` handling
  - Action Plan:
    - Define `--item-color` with sensible default
    - Add `prefers-reduced-motion` media queries

- [ ] `WorkspaceGraphD3.jsx` - D3-based graph visualization
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
    - **Remove random logic** - Use deterministic layout based on data properties or seed fixed by data hash
    - **Make responsive** - Use container queries or ResizeObserver for dynamic sizing
    - **Optimize re-renders** - Cache D3 simulation, only recreate when data changes
    - **Add accessibility** - Provide `aria-label`, consider adding text legend for graph
    - **Handle large datasets** - Add pagination/filtering UI for 100+ nodes
    - **Document D3 structure** - Clear comments on how source/target properties work
    - Consider using `d3-force` best practices and examples

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
- [ ] `Home.css` - Homepage styling
- [ ] `NotFound.jsx` - 404 error page
- [ ] `NotFound.css` - 404 styling

### Dictionary Pages
- [ ] `Dictionary.jsx` - Dictionary home page
- [ ] `Dictionary.css` - Dictionary styling
- [ ] `DictionaryLetter.jsx` - Dictionary letter view
- [ ] `DictionaryLetter.css` - Letter view styling
- [ ] `DictionaryWord.jsx` - Single word detail page
- [ ] `DictionaryWord.css` - Word page styling
- [ ] `DictionaryFavorites.jsx` - Favorited words
- [ ] `DictionaryFavorites.css` - Favorites styling

### Domain Pages
- [ ] `Domains.jsx` - Domains listing page
- [ ] `Domains.css` - Domains styling
- [ ] `DomainDetail.jsx` - Single domain detail
- [ ] `DomainDetail.css` - Domain detail styling
- [ ] `DomainView.jsx` - Domain content view
- [ ] `EntityDetail.jsx` - Entity detail page
- [ ] `EntityDetail.css` - Entity detail styling

### Utility Pages
- [ ] `Search.jsx` - Search results page
- [ ] `Search.css` - Search page styling
- [ ] `WordCompare.jsx` - Word comparison page
- [ ] `WordCompare.css` - Compare styling
- [ ] `RhymeGalaxy.jsx` - Visual rhyme exploration
- [ ] `RhymeGalaxy.css` - Galaxy styling
- [ ] `WritingStudio.jsx` - Writing studio page
- [ ] `WritingStudio.css` - Studio page styling
- [ ] `Stats.jsx` - User statistics page
- [ ] `Stats.css` - Stats page styling
- [ ] `Settings.jsx` - Settings page
- [ ] `Settings.css` - Settings styling

### Info Pages
- [ ] `About.jsx` - About page
- [ ] `About.css` - About styling
- [ ] `Architecture.jsx` - Architecture documentation
- [ ] `Architecture.css` - Architecture styling
- [ ] `Docs.jsx` - Documentation page
- [ ] `Docs.css` - Docs styling
- [ ] `ContentPage.css` - Generic content page styling

---

## 🛠️ Utilities & Libraries (/src/lib)

### Context Providers
- [ ] `WorkspaceContext.jsx` - Workspace state management
- [ ] `FavoritesContext.jsx` - Favorites state
- [ ] `EntityLikesContext.jsx` - Likes/reactions state
- [ ] `FilterContext.jsx` - Filter state management
- [ ] `UserPreferencesContext.jsx` - User preferences
- [ ] `BrowsingHistoryContext.jsx` - Browsing history
- [ ] `SearchHistoryContext.jsx` - Search history

### Core Utilities
- [ ] `hooks.js` - Custom React hooks
- [ ] `dataLoader.js` - Data loading utilities
- [ ] `rhymeFinder.js` - Rhyme matching algorithm
- [ ] `flowAnalysis.js` - Flow pattern analysis
- [ ] `searchParser.js` - Search query parser
- [ ] `recommendationEngine.js` - Content recommendations
- [ ] `collections.js` - Collection management
- [ ] `exportFormats.js` - Export formatting
- [ ] `voiceInput.js` - Voice input handler

### PWA & Performance
- [ ] `pwaHelpers.js` - PWA utilities
- [ ] `offlineManager.js` - Offline data management
- [ ] `prefetchManager.js` - Resource prefetching
- [ ] `imageOptimizer.js` - Image optimization
- [ ] `performanceMonitor.js` - Performance tracking

### SEO & Analytics
- [ ] `seoHelpers.js` - SEO utilities
- [ ] `analytics.js` - Analytics tracking

### Media & Audio
- [ ] `SoundManager.js` - Sound effects manager
- [ ] `audioProcessing.js` - Audio analysis

### GSAP Animation
- [ ] `gsap.js` - GSAP setup and configuration
- [ ] `gsap/registerPlugins.js` - GSAP plugin registration
- [ ] `gsap/easing.js` - Custom easing functions

### Accessibility
- [ ] `accessibility.js` - A11y utilities
- [ ] `useKeyboardShortcuts.js` - Keyboard shortcuts hook

### Gamification
- [ ] `achievements.js` - Achievements system

---

## 📊 Data Files (/src/lib/data)

- [ ] `eras.js` - Hip-hop eras data
- [ ] `knowledgeHub.js` - Knowledge hub content
- [ ] `philosophy.js` - Philosophy content
- [ ] `rapDictionary.js` - Dictionary data
- [ ] `tools.js` - Tools data
- [ ] `tracks.js` - Track/beat data

---

## 🎣 Custom Hooks (/src/hooks)

- [ ] `useMobileGestures.js` - Mobile gesture handlers
- [ ] `useNetworkStatus.js` - Network connectivity detection
- [ ] `usePrefetch.js` - Resource prefetching hook
- [ ] `useSEO.js` - SEO metadata hook

---

## 🎨 Global Styles (/src/styles)

- [ ] `theme.css` - Theme variables and tokens
- [ ] `glassmorphism.css` - Glassmorphism effects
- [ ] `mobile.css` - Mobile-specific styles
- [ ] `high-contrast.css` - High contrast mode
- [ ] `reduced-motion.css` - Reduced motion preferences

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
