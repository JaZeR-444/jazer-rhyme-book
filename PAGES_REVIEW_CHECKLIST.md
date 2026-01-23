# Pages Directory Review Checklist

## 📋 Overview

**Directory:** `web/src/pages`
**Total Pages:** 19 JSX files
**Total CSS Files:** 19 (one-to-one pairing)
**Current Export Pattern:** Lazy-loaded in App.jsx (no barrel export)
**Total Size:** ~388KB

---

## 🔍 Issue Categories

### 1. ✅ Export Organization
- [ ] **Create pages/index.js** - Add barrel export for all page components
  - **Status:** NOT STARTED
  - **Impact:** Makes imports cleaner and enables tree-shaking
  - **Files Affected:** All 19 pages
  - **Scope:** Create new pages/index.js with all exports

### 2. ♿ Accessibility Issues
- [ ] **Add ARIA landmarks to pages** - Ensure proper page structure with role, aria-label
  - **Status:** NOT STARTED
  - **Files to Check:** Home.jsx, Dictionary.jsx, Search.jsx, WritingStudio.jsx, Settings.jsx
  - **Common Missing Attributes:**
    - `role="main"` on primary content
    - `aria-label` on major sections
    - `aria-live="polite"` on dynamic content updates
    - `aria-current="page"` on active navigation

- [ ] **Add page title updates** - Ensure each page updates document.title
  - **Status:** NOT STARTED
  - **Impact:** Screen readers announce page context
  - **Files Affected:** All 19 pages

- [ ] **Semantic HTML structure** - Use `<main>`, `<section>`, `<article>` correctly
  - **Status:** NOT STARTED
  - **Files to Check:** Dictionary*, Search.jsx, WritingStudio.jsx

### 3. ⚡ Performance Issues
- [ ] **Add memoization to filter/search operations**
  - **Files:** Search.jsx, Dictionary.jsx, DictionaryLetter.jsx, DomainDetail.jsx
  - **Current Issues:**
    - Fuse instances recreated on every render (Search.jsx lines 46-62)
    - Filter results not memoized (Dictionary.jsx)
    - Utility functions called without useMemo

- [ ] **Optimize list rendering**
  - **Files:** DictionaryLetter.jsx, Search.jsx, Domains.jsx
  - **Issue:** Large lists may need virtualization or pagination

- [ ] **Lazy-load heavy components**
  - **Files:** WritingStudio.jsx (21K), Search.jsx (13K)
  - **Components:** Graph visualizations, complex analyzers

### 4. 🎨 CSS Issues
- [ ] **Add @media (prefers-reduced-motion: reduce)** to animated pages
  - **Files:** Home.css (GSAP animations), WritingStudio.css, Search.css
  - **Status:** NOT STARTED
  - **Priority:** HIGH (accessibility)

- [ ] **Add responsive design verification**
  - **Files:** All 19 CSS files
  - **Check:** Mobile breakpoints, tablet layout

- [ ] **Verify color contrast** and dark mode support
  - **Files:** All pages that have custom color schemes

### 5. 📝 Code Quality Issues
- [ ] **Add JSDoc/PropTypes documentation**
  - **Missing:** All pages lack JSDoc parameter documentation
  - **Files:** Especially WritingStudio.jsx, Search.jsx, DictionaryLetter.jsx
  - **Benefit:** Type safety and IDE autocomplete

- [ ] **Reduce code duplication**
  - **Issues Identified:**
    - `analyzeDictionarySearch()` defined in Dictionary.jsx (reused logic)
    - Search filtering logic duplicated in Search.jsx and other pages
    - Export functionality duplicated across WritingStudio.jsx (lines 77-110)

- [ ] **Extract utility functions**
  - **Candidates:**
    - Search bar filtering (shared between Home.jsx, Dictionary.jsx, Search.jsx)
    - Export handlers (used in WritingStudio.jsx, could be library function)
    - Memoized search/filter patterns

### 6. 🔗 Import/Structure Issues
- [ ] **Verify all component imports exist**
  - **Status:** UNKNOWN - Need to verify imports match component exports
  - **Critical Files:** All pages
  - **Example Issue:** Lines missing from component exports could cause runtime errors

- [ ] **Check for broken routes**
  - **Files:** All pages that use navigation (Home.jsx, Dictionary*, Search.jsx)
  - **Issue:** Verify route links match actual page paths

### 7. 🧪 Testing & Documentation
- [ ] **Add error boundaries** to complex pages
  - **Files:** WritingStudio.jsx, Search.jsx, Dictionary.jsx
  - **Benefit:** Graceful error handling

- [ ] **Add loading states** verification
  - **Files:** Dictionary.jsx (has), Search.jsx (partial), others (missing)

---

## 📊 Pages by Category & Issues

### Dictionary System (5 pages)
| Page | Size | Issues | Priority |
|------|------|--------|----------|
| Dictionary.jsx | 12K | Reduce code dup, add ARIA | Medium |
| DictionaryLetter.jsx | 18K | Add memoization, perf, ARIA | High |
| DictionaryWord.jsx | 11K | Add ARIA, page title | Medium |
| DictionaryFavorites.jsx | 2.9K | Add ARIA, styling check | Low |
| (implied: DictionaryFavorites.css) | ? | Check reduced-motion | Medium |

### Domain/Entity System (4 pages)
| Page | Size | Issues | Priority |
|------|------|--------|----------|
| Domains.jsx | 3.1K | Add ARIA, virtualization | Medium |
| DomainDetail.jsx | 8.6K | Add memoization, ARIA | Medium |
| DomainView.jsx | 1.8K | Add ARIA | Low |
| EntityDetail.jsx | 9.7K | Add error handling, ARIA | Medium |

### Core Features (5 pages)
| Page | Size | Issues | Priority |
|------|------|--------|----------|
| WritingStudio.jsx | 21K | Refactor, add ARIA, reduce motion | **Critical** |
| Search.jsx | 13K | Add memoization, ARIA, duplication | **High** |
| WordCompare.jsx | 9.5K | Add ARIA, performance | Medium |
| RhymeGalaxy.jsx | 3.0K | Add ARIA, motion reduction | Medium |
| Stats.jsx | 6.9K | Add ARIA, visualization a11y | Medium |

### Utility Pages (5 pages)
| Page | Size | Issues | Priority |
|------|------|--------|----------|
| Home.jsx | 8.3K | Add ARIA, motion reduction | High |
| About.jsx | 13K | Add ARIA, JSDoc | Medium |
| Settings.jsx | 16K | Add ARIA, file handling a11y | Medium |
| Docs.jsx | 2.0K | Add ARIA, check links | Low |
| NotFound.jsx | 1.1K | Add ARIA | Low |

---

## 🎯 Implementation Plan (5 Phases)

### Phase 1: Critical Fixes & Foundation (11-13 tasks)
**Duration:** Foundation setup for all other phases
**Dependencies:** None

1. Create pages/index.js barrel export with all 19 page exports
2. Add main layout skeleton with role="main" to all pages
3. Add aria-label to major sections in WritingStudio.jsx
4. Add aria-label to major sections in Search.jsx
5. Add aria-label to major sections in Dictionary.jsx
6. Extract analyzeDictionarySearch() to lib utility
7. Extract exportToFile() to lib utility (used in WritingStudio.jsx)
8. Fix any import/export mismatches between pages and components
9. Add basic error boundaries to WritingStudio.jsx, Search.jsx, Dictionary.jsx
10. Verify route paths match actual page components in App.jsx
11. Add page title updates using useEffect to all pages

### Phase 2: Accessibility Enhancements (8-10 tasks)
**Duration:** Accessibility compliance
**Dependencies:** Phase 1

1. Add @media (prefers-reduced-motion: reduce) to Home.css (GSAP animations)
2. Add @media (prefers-reduced-motion: reduce) to WritingStudio.css
3. Add @media (prefers-reduced-motion: reduce) to remaining CSS files
4. Add aria-live regions to Search.jsx results
5. Add aria-busy states to loading indicators (Dictionary.jsx, Search.jsx)
6. Add aria-expanded for collapsible sections (Settings.jsx)
7. Add focus management to modal/dialog interactions
8. Verify semantic HTML structure in all pages

### Phase 3: Performance Optimization (7-9 tasks)
**Duration:** Performance improvements
**Dependencies:** Phase 1

1. Add useMemo to Fuse instances in Search.jsx (lines 46-62)
2. Add useMemo to filter calculations in Dictionary.jsx
3. Add useMemo to availableTags and availableEras in Search.jsx
4. Optimize DictionaryLetter.jsx rendering (memoize letter data)
5. Optimize DomainDetail.jsx filter/search operations
6. Consider virtualization for long lists (DictionaryLetter.jsx)
7. Lazy-load heavy components in WritingStudio.jsx (Graph, Recommender)
8. Memoize search result filtering functions
9. Add React.memo wrappers to page components that are rarely updated

### Phase 4: Code Quality & Refactoring (6-8 tasks)
**Duration:** Code cleanup
**Dependencies:** Phase 1

1. Add JSDoc documentation to all 19 page exports
2. Extract search bar logic to shared hook (useSearch)
3. Extract filter logic to shared hook (useFilters)
4. Extract animation patterns to shared utilities
5. Remove code duplication in export handlers
6. Add PropTypes/interface documentation
7. Verify all console.log statements are production-ready
8. Add error handling for data loading failures

### Phase 5: Testing & Documentation (5-7 tasks)
**Duration:** Final verification
**Dependencies:** Phases 1-4

1. Test all routes and navigation paths
2. Verify accessibility with screen reader (NVDA, JAWS)
3. Test reduced-motion preferences on all animated pages
4. Performance audit (bundle size, Core Web Vitals)
5. Cross-browser testing (Chrome, Firefox, Safari, Edge)
6. Document page structure and component hierarchy
7. Create README for pages directory

---

## 📋 Critical Files to Address First

### Tier 1 - Must Fix (Blocking Issues)
1. **WritingStudio.jsx** (21K) - Complex, many features, needs refactoring
2. **Search.jsx** (13K) - Performance critical, filter duplication
3. **pages/index.js** - MISSING (export barrel)

### Tier 2 - Should Fix (High Impact)
4. **Home.jsx** (8.3K) - GSAP animations need reduced-motion handling
5. **Dictionary.jsx** (12K) - Missing accessibility, needs ARIA
6. **Settings.jsx** (16K) - File handling and user preferences

### Tier 3 - Nice to Have (Medium Impact)
7. **DictionaryLetter.jsx** (18K) - Large list rendering
8. **About.jsx** (13K) - Documentation page
9. **DomainDetail.jsx** (8.6K) - Entity data display

---

## 🔧 Quick Wins (Can be done quickly)

- [ ] Create pages/index.js (5 min)
- [ ] Add role="main" to all pages (15 min)
- [ ] Add page title updates (20 min)
- [ ] Add aria-label to major sections (30 min)
- [ ] Add @media prefers-reduced-motion to Home.css (10 min)
- [ ] Extract utility functions (1 hour)

---

## 📚 Related Documentation

- **Components Review:** See COMPLETE_FILE_REVIEW_CHECKLIST.md
- **Accessibility Standards:** WCAG 2.1 Level AA
- **React Best Practices:** Memoization, lazy loading, error boundaries
- **Performance Targets:** LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## Status Tracking

- **Last Updated:** 2026-01-21
- **Review Status:** ✅ COMPLETE (initial analysis)
- **Implementation Status:** ⏳ PENDING
- **Completion Target:** TBD

---

## Notes

1. Pages currently use lazy loading in App.jsx - consider creating pages/index.js anyway for consistency
2. WritingStudio.jsx is the most complex page - may benefit from component extraction
3. Search.jsx has good structure but performance opportunities with memoization
4. Accessibility is the most impactful improvement for all pages
5. Code duplication between Dictionary.jsx and Search.jsx suggests shared utility potential

