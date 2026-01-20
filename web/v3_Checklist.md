# v3 Improvement Checklist — JaZeR Rhyme Book

Quick reference checklist for v3 Improvement Plan. Check off items as completed.

---

## 🔥 Priority P0 — Critical (Must Fix)

### Testing & Quality

- [ ] Add comprehensive test suite (Jest + RTL + Vitest + Playwright)
- [ ] Remove tmpclaude-\* temp folders from src/

### Performance

- [ ] Optimize dictionary data loading (6700+ files → lazy pagination)
- [ ] Fix bundle size via code splitting improvements
- [ ] Implement data pagination for large domains (50 entities/chunk)
- [ ] Add virtual scrolling for word lists (DictionaryLetter.jsx)
- [ ] Reduce word.md file count (consolidate to JSON)
- [ ] Implement audio lazy loading (120+ MP3s)
- [ ] Fix audio filename inconsistencies (add .mp3 extensions)

### UX & Reliability

- [ ] Implement proper error boundaries (retry, offline detection)
- [ ] Fix accessibility issues (aria-labels, keyboard nav, screen reader)
- [ ] Add error handling to buildData.js (fail build on errors)
- [ ] Consolidate 26 cleanup scripts into single parameterized script

---

## ⚡ Priority P1 — High Value

### Performance & Optimization

- [ ] Remove/consolidate 40+ console statements
- [ ] Add performance budgets (Lighthouse CI)
- [ ] Implement search debouncing (300ms)
- [ ] Fix navigation state persistence (scroll, filters, workspace)
- [ ] Implement progressive image loading
- [ ] Add audio file compression check (standardize bitrate)
- [ ] Create audio manifest with metadata
- [ ] Add waveform pre-generation
- [ ] Optimize audio player error handling
- [ ] Create audio metadata JSON (ID3 tags)
- [ ] Add audio search index
- [ ] Implement audio caching strategy (service worker)
- [ ] Optimize streaming (HTTP range requests)

### Data & Caching

- [ ] Add data validation schema (JSON Schema/Zod)
- [ ] Consolidate entity manifests (24 → 1 unified)
- [ ] Implement data compression (gzip JSON)
- [ ] Add data versioning
- [ ] Create IndexedDB cache
- [ ] Add full-text search index (pre-generate Fuse.js)
- [ ] Implement data prefetching
- [ ] Add data integrity checks
- [ ] Implement stale-while-revalidate cache strategy

### Dictionary

- [ ] Fix MASTER-DICTIONARY-MANIFEST.json duplication
- [ ] Optimize manifest file size (170KB → <50KB)
- [ ] Consolidate dictionary cleanup scripts
- [ ] Implement rhyme scheme analyzer
- [ ] Add word similarity search (metaphone/soundex)

### PWA & Public

- [ ] Optimize manifest.json (screenshots, shortcuts)
- [ ] Enhance service worker (workbox patterns)
- [ ] Add robots.txt
- [ ] Create sitemap.xml
- [ ] Add CSP headers
- [ ] Create offline fallback page
- [ ] Optimize icon variants (all PWA sizes)
- [ ] Create 404 page
- [ ] Add Open Graph images
- [ ] Implement asset versioning

### Build Scripts

- [ ] Implement parallel processing in buildData.js
- [ ] Add dry-run mode to destructive scripts
- [ ] Implement script testing
- [ ] Add schema validation to generate-metadata.js
- [ ] Create pre-commit hooks (data validation)
- [ ] Optimize scan-tracks.js (cache, incremental)
- [ ] Create master build script (build-all.js)
- [ ] Add incremental builds
- [ ] Implement data backup before cleanup
- [ ] Implement CI/CD scripts (GitHub Actions)

### Source Code

- [ ] Add TypeScript or JSDoc types
- [ ] Optimize context providers (7 nested → combined)
- [ ] Implement code splitting by route
- [ ] Remove console statements (use logger service)
- [ ] Add loading skeletons
- [ ] Implement search debouncing
- [ ] Add mobile-specific components (touch gestures)
- [ ] Implement virtual scrolling everywhere
- [ ] Add state persistence (localStorage)
- [ ] Optimize bundle splitting

### Assets

- [ ] Add cache busting verification
- [ ] Add preload hints for critical assets
- [ ] Implement font subset loading (<50KB)
- [ ] Remove unused CSS (PurgeCSS)
- [ ] Add critical CSS extraction
- [ ] Implement asset versioning
- [ ] Optimize chunk loading (modulepreload)
- [ ] Create asset size budget

---

## 🔧 Priority P2 — Nice to Have

### Assets

- [ ] Remove redundant hashed CSS bundles
- [ ] Consolidate hashed JS bundles
- [ ] Optimize SVG icons (SVGO)
- [ ] Add modernizr/feature detection
- [ ] Enable Brotli compression
- [ ] Add resource hints for domains (dns-prefetch)
- [ ] Lazy load react.svg
- [ ] Create asset manifest
- [ ] Add image format detection (WebP)
- [ ] Add favicon variants
- [ ] Add asset integrity checks (SRI)
- [ ] Add sourcemap upload (Sentry)

### Audio

- [ ] Implement audio sprite technique
- [ ] Add album art metadata
- [ ] Add playlist grouping (folders)
- [ ] Add playback analytics
- [ ] Implement gapless playback
- [ ] Add audio normalization check (LUFS)
- [ ] Add track popularity sorting
- [ ] Implement audio quality toggle (HQ/LQ)
- [ ] Create audio CDN strategy
- [ ] Add shuffle algorithm (Fisher-Yates)

### Data

- [ ] Optimize relation data (IDs only)
- [ ] Optimize image references (relative paths)
- [ ] Create data migration tool
- [ ] Add data backup automation
- [ ] Add GraphQL layer (optional)
- [ ] Create data export tool
- [ ] Add data import validation
- [ ] Optimize alias map storage (global index)
- [ ] Add data changelog
- [ ] Implement data deduplication

### Dictionary

- [ ] Remove .claude folder
- [ ] Remove .wordlists folder
- [ ] Add word pronunciation data (IPA)
- [ ] Add word etymology
- [ ] Create word usage examples (from lyrics)
- [ ] Implement spaced repetition (flashcards)
- [ ] Add word frequency analysis
- [ ] Fix Master Index duplication
- [ ] Create word collections
- [ ] Add word export (Anki/CSV)
- [ ] Implement word randomizer
- [ ] Add synonym/antonym data
- [ ] Create practice quizzes

### Public

- [ ] Add security.txt
- [ ] Implement humans.txt
- [ ] Add theme-color meta
- [ ] Add browserconfig.xml
- [ ] Create data sync endpoint (Firebase/Supabase)
- [ ] Add analytics configuration (GA4/Plausible)
- [ ] Implement CORS headers
- [ ] Add redirect rules
- [ ] Create data validation endpoint
- [ ] Add version indicator (footer)

### Scripts

- [ ] Add progress indicators
- [ ] Create script documentation (README)
- [ ] Add script versioning (--version)
- [ ] Add CLI argument parsing (commander/yargs)
- [ ] Create data migration tool
- [ ] Add linting for scripts
- [ ] Add script metrics (execution time)
- [ ] Create rollback mechanism

### Source Code

- [ ] Optimize GSAP usage (transform-only)
- [ ] Add route transition animations
- [ ] Optimize images (inline SVG)
- [ ] Add component documentation (JSDoc/Storybook)
- [ ] Implement telemetry
- [ ] Add feature flags

---

## 📊 Progress Summary

- **P0 (Critical):** 0 / 12 complete
- **P1 (High Value):** 0 / 65 complete
- **P2 (Nice to Have):** 0 / 63 complete

**Total:** 0 / 140 complete

---

## 🎯 Recommended Implementation Order

### Week 1-2: Foundation

1. Add test suite infrastructure
2. Clean up temp folders (tmpclaude-\*)
3. Consolidate cleanup scripts
4. Add error handling to build scripts
5. Implement proper error boundaries

### Week 3-4: Performance Critical

1. Optimize dictionary loading (pagination, virtual scroll)
2. Fix bundle size (code splitting)
3. Implement audio lazy loading
4. Add data pagination
5. Remove console statements

### Week 5-6: Data & Caching

1. Add data validation schema
2. Consolidate manifests
3. Implement IndexedDB cache
4. Add service worker improvements
5. Pre-generate search index

### Week 7-8: UX & Accessibility

1. Fix accessibility issues
2. Add loading skeletons
3. Implement state persistence
4. Add search debouncing
5. Fix navigation state

### Week 9-10: Build & Deploy

1. Add CI/CD scripts
2. Implement performance budgets
3. Create sitemap/robots.txt
4. Add PWA improvements
5. Implement incremental builds

### Week 11-12: Polish

1. Add TypeScript/JSDoc
2. Implement telemetry
3. Add component documentation
4. Create admin tools
5. Final optimization pass

---

**Generated:** 2026-01-20  
**Source:** v3_Improvement_Plan.md
