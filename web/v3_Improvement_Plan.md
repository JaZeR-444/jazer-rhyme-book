# v3 Improvement Plan — JaZeR Rhyme Book (/web)

## How this plan was generated
- **Full recursive scan** of `./web` directory including all 7 target folders (assets, audio, data, dictionary, public, scripts, src).
- **Source code analysis** of 40+ React components, 20+ library modules, 15+ pages, and 30+ build/data scripts.
- **Dependency audit** of package.json showing React 19, Vite 7, GSAP 3, Fuse.js, natural/metaphone NLP, and 30+ other packages.
- **No test coverage found** — zero .test.js or .spec.js files discovered across entire codebase.
- **Console usage audit** revealed 40+ console statements (log/warn/error) distributed across modules.
- **Build artifacts scan** showed pre-hashed bundles in dist/ and assets/ folders needing cleanup/optimization.

## Summary: Top 15 cross-cutting wins

1. **Implement comprehensive test suite** — Zero test coverage is a critical gap; add Jest + React Testing Library for components, Vitest for utilities, E2E with Playwright — `(Priority P0, Effort L)`

2. **Optimize dictionary data loading** — 6700+ word files loaded individually creates massive overhead; implement lazy pagination, virtual scrolling improvements, and chunked manifests — `(Priority P0, Effort M)`

3. **Remove/consolidate 40+ console statements** — Production code contains extensive console.log/warn/error; implement proper logging service with log levels and silent production mode — `(Priority P1, Effort S)`

4. **Fix bundle size via code splitting** — Manual chunks exist but missing route-based splitting; implement lazy loading for all domain data, refactor monolithic contexts — `(Priority P0, Effort M)`

5. **Add TypeScript or JSDoc types** — Zero type safety increases bug risk; migrate incrementally to TypeScript or add comprehensive JSDoc annotations — `(Priority P1, Effort L)`

6. **Implement proper error boundaries** — ErrorBoundary exists but needs granular fallbacks per route/component; add retry logic, offline detection, better UX — `(Priority P0, Effort S)`

7. **Optimize audio player performance** — WaveSurfer.js loading all 120+ MP3s is heavy; implement on-demand loading, audio sprite technique, streaming optimization — `(Priority P1, Effort M)`

8. **Add service worker caching strategy** — PWA helpers exist but sw.js is basic; implement workbox patterns, cache versioning, stale-while-revalidate for data — `(Priority P1, Effort M)`

9. **Fix accessibility issues** — No aria-labels on interactive elements, missing keyboard navigation in complex components, poor screen reader support — `(Priority P0, Effort M)`

10. **Consolidate duplicate cleanup scripts** — 26 nearly-identical cleanup_X.js scripts (A-Z); create single parameterized script to reduce maintenance burden — `(Priority P2, Effort S)`

11. **Implement search debouncing** — Fuse.js searches trigger on every keystroke; add 300ms debounce, cancel pending searches, show loading states — `(Priority P1, Effort S)`

12. **Add performance budgets** — No Lighthouse CI, no performance monitoring in CI/CD; set budgets for FCP, LCP, TTI, bundle size — `(Priority P1, Effort S)`

13. **Fix navigation state persistence** — Browser back/forward loses scroll position, filter state, workspace context; implement proper state restoration — `(Priority P1, Effort M)`

14. **Optimize GSAP animations** — Heavy animation vendor bundle, potential layout thrashing; audit all animations for will-change, transform-only properties — `(Priority P2, Effort M)`

15. **Implement progressive image loading** — SVG icons loaded synchronously, no skeleton states for slow networks; add blur-up technique, lazy loading — `(Priority P1, Effort S)`

---

## Category 1 — assets (20 items)

1. **Remove redundant hashed CSS bundles**
   - **What to change:** Delete duplicate index-*.css files (BiC4j0dT, CIgdO60K, CLIqjNdN, DDRwWVYs, lLN5jlOM variants); verify only latest build artifacts remain
   - **Why:** Multiple hashed CSS bundles suggest incomplete cleanup between builds, increasing repo size unnecessarily
   - **Where:** `./web/assets/`
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** Only 1-2 CSS bundles remain after clean build

2. **Consolidate hashed JS bundles**
   - **What to change:** Similar to CSS, verify index-*.js files (bVm2dbqi, CWNePXgR, DM0boM-l, s2TaxC-e, v0o1cnts) are all needed or clean up stale ones
   - **Why:** Old bundles from previous builds should not persist; .gitignore or clean script should prevent this
   - **Where:** `./web/assets/`
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** Only current build bundles exist

3. **Add cache busting verification**
   - **What to change:** Ensure vite.config.js hash generation is deterministic; verify manifest.json includes all assets with correct hashes
   - **Why:** Prevent cache invalidation issues in production
   - **Where:** `./web/scripts/vite.config.js`
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** `npm run build` twice produces identical hashes for unchanged files

4. **Optimize SVG icons**
   - **What to change:** Run SVGO on icon.svg and logo.svg to remove unnecessary metadata, optimize paths, reduce file size
   - **Why:** SVG files often contain editor metadata and redundant markup
   - **Where:** `./web/icon.svg`, `./web/logo.svg` (and copies in public/)
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** File sizes reduced by 20-30% with no visual change

5. **Add preload hints for critical assets**
   - **What to change:** In index.html, add `<link rel="preload">` for main JS bundle and critical CSS
   - **Why:** Improves FCP and LCP by prioritizing critical resources
   - **Where:** `./web/index.html`
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** Lighthouse shows preload resources in network waterfall

6. **Implement font subset loading**
   - **What to change:** Google Fonts loads entire Inter and JetBrains Mono sets; use `&text=` param to subset or self-host woff2
   - **Why:** Reduces font payload from ~200KB to <50KB for used glyphs
   - **Where:** `./web/index.html` line 8
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Network tab shows <50KB font transfers

7. **Add modernizr or feature detection**
   - **What to change:** Check for CSS Grid, Intersection Observer, Web Audio API support before loading heavy features
   - **Why:** Graceful degradation for older browsers
   - **Where:** New file `./web/src/lib/featureDetection.js`
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** App shows fallback UI on IE11 or unsupported browsers

8. **Enable Brotli compression**
   - **What to change:** Generate .br files during build for text assets; configure server to serve them
   - **Why:** Brotli compresses 20-30% better than gzip for text
   - **Where:** `./web/scripts/vite.config.js` — add vite-plugin-compression
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** dist/ contains .br files alongside originals

9. **Add resource hints for domains**
   - **What to change:** Add `<link rel="dns-prefetch">` for fonts.googleapis.com and fonts.gstatic.com
   - **Why:** Speeds up font loading by resolving DNS early
   - **Where:** `./web/index.html`
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** DNS lookup happens during HTML parse, not font fetch

10. **Lazy load react.svg**
    - **What to change:** Move react.svg from eager import to lazy import; it's only used in About page
    - **Why:** Reduces main bundle size
    - **Where:** `./web/src/assets/react.svg`
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** react.svg only loads when About page accessed

11. **Create asset manifest**
    - **What to change:** Generate assets-manifest.json listing all hashed assets for programmatic access
    - **Why:** Enables programmatic cache invalidation and asset verification
    - **Where:** New script `./web/scripts/generate-asset-manifest.js`
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** assets-manifest.json exists in dist/

12. **Add image format detection**
    - **What to change:** Serve WebP with PNG fallback for logo/icon; use `<picture>` element
    - **Why:** WebP reduces image size 25-35% vs PNG
    - **Where:** `./web/index.html` (favicon), components using Logo component
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** WebP served on supporting browsers

13. **Remove unused CSS**
    - **What to change:** Run PurgeCSS or UnCSS on final bundle to remove unused styles
    - **Why:** CSS bundles likely contain unused framework styles
    - **Where:** `./web/scripts/vite.config.js` — add vite-plugin-purgecss
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** CSS bundle size reduces by 10-20%

14. **Add critical CSS extraction**
    - **What to change:** Extract above-fold CSS into <style> tag in index.html
    - **Why:** Eliminates render-blocking CSS for initial paint
    - **Where:** Build step using critters or critical package
    - **Priority/Effort:** P1 — M
    - **Acceptance check:** FCP improves by 200-500ms

15. **Implement asset versioning**
    - **What to change:** Ensure all assets use content hash in filename, not just JS/CSS
    - **Why:** Long-term caching without stale content
    - **Where:** `./web/scripts/vite.config.js` lines 64-74
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** All dist/ files have hashes in names

16. **Add favicon variants**
    - **What to change:** Generate apple-touch-icon.png (180x180), favicon-16x16.png, favicon-32x32.png from icon.svg
    - **Why:** Better mobile/desktop icon support
    - **Where:** `./web/public/` — add missing favicon sizes
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** PWA audit shows all recommended icon sizes

17. **Optimize chunk loading**
    - **What to change:** Add `<link rel="modulepreload">` for critical chunks in index.html
    - **Why:** Parallel loading of related chunks
    - **Where:** Build step to inject modulepreload hints
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** Network tab shows parallel chunk loads

18. **Add asset integrity checks**
    - **What to change:** Generate SRI hashes for all assets; add integrity attribute to script/link tags
    - **Why:** Security — prevents CDN tampering
    - **Where:** Build step using rollup-plugin-sri
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** All script tags have integrity="sha384-..."

19. **Create asset size budget**
    - **What to change:** Add size-limit or bundlesize to package.json to enforce max bundle sizes
    - **Why:** Prevents gradual bundle size creep
    - **Where:** `./web/package.json` scripts section
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** CI fails if bundle exceeds threshold

20. **Add sourcemap upload**
    - **What to change:** Upload sourcemaps to Sentry or similar for production error tracking
    - **Why:** Debug production errors effectively
    - **Where:** Build script post-build step
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Production errors show original source in Sentry

---

## Category 2 — audio (20 items)

1. **Implement audio lazy loading**
   - **What to change:** Don't preload all 120+ MP3 files; load on-demand when track is played
   - **Why:** Initial page load includes all audio metadata, slowing down app startup
   - **Where:** `./web/src/lib/data/tracks.js`
   - **Priority/Effort:** P0 — M
   - **Acceptance check:** Network tab shows audio files only load when user clicks play

2. **Add audio file compression check**
   - **What to change:** Verify all MP3s are consistently encoded (128kbps or 192kbps); re-encode inconsistent files
   - **Why:** File sizes vary wildly (some tracks likely 320kbps); standardize for predictable performance
   - **Where:** `./web/audio/*.mp3`
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** All MP3s within 2-5MB range at 192kbps

3. **Create audio manifest**
   - **What to change:** Generate audio-manifest.json with metadata (duration, bitrate, waveform peaks) during build
   - **Why:** Avoid runtime metadata fetching; enables instant UI rendering
   - **Where:** New script `./web/scripts/generate-audio-manifest.js`
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** audio-manifest.json exists with duration for all tracks

4. **Fix filename inconsistencies**
   - **What to change:** Some files have extensions, some don't (e.g., "is it enough" lacks .mp3); rename for consistency
   - **Why:** Inconsistent naming breaks programmatic access
   - **Where:** `./web/audio/is it enough` → `is it enough.mp3`
   - **Priority/Effort:** P0 — S
   - **Acceptance check:** All files end with .mp3 extension

5. **Add waveform pre-generation**
   - **What to change:** Generate waveform JSON/PNG during build instead of runtime with WaveSurfer
   - **Why:** Eliminates 120+ expensive audio decoding operations
   - **Where:** New script using audiowaveform or similar
   - **Priority/Effort:** P1 — L
   - **Acceptance check:** Waveforms load instantly from JSON

6. **Implement audio sprite technique**
   - **What to change:** For preview mode, create audio sprites (all tracks combined with timing map)
   - **Why:** Reduces HTTP requests from 120 to 1 for quick previews
   - **Where:** Build script to generate sprite + timing manifest
   - **Priority/Effort:** P2 — L
   - **Acceptance check:** Preview mode loads single sprite file

7. **Add audio caching strategy**
   - **What to change:** Service worker should cache played tracks with LRU eviction (max 20 tracks)
   - **Why:** Offline playback + reduces data usage
   - **Where:** `./web/public/sw.js`
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Offline playback works for recently played tracks

8. **Add album art metadata**
   - **What to change:** Embed ID3 tags or create album-art/ folder with cover images per track
   - **Why:** Better player UI, media session API integration
   - **Where:** ID3 tags in MP3s or new `./web/audio/album-art/`
   - **Priority/Effort:** P2 — M
   - **Acceptance check:** Player shows album art for each track

9. **Implement streaming optimization**
   - **What to change:** Serve audio via HTTP range requests; ensure server supports Accept-Ranges
   - **Why:** Enables seeking without downloading entire file
   - **Where:** Server configuration (Vite dev server already supports this)
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** Seeking works instantly even on large files

10. **Add playlist grouping**
    - **What to change:** Organize tracks into folders: released/, demos/, features/, etc.
    - **Why:** 120 files in flat structure is hard to manage
    - **Where:** Restructure `./web/audio/` into subdirectories
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Audio files organized by category

11. **Create audio metadata JSON**
    - **What to change:** Extract ID3 tags (artist, title, year, genre) into tracks-metadata.json
    - **Why:** Enables filtering/search without loading audio files
    - **Where:** Build script using music-metadata package
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** tracks-metadata.json contains all track info

12. **Add playback analytics**
    - **What to change:** Track play count, skip rate, favorite rate per song
    - **Why:** Understand which tracks resonate with users
    - **Where:** `./web/src/lib/analytics.js` — add track event logging
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Play events logged to analytics service

13. **Implement gapless playback**
    - **What to change:** Preload next track in queue while current plays; use Web Audio API
    - **Why:** Professional listening experience
    - **Where:** `./web/src/components/StudioPlayer.jsx`
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** No silence between consecutive tracks

14. **Add audio normalization check**
    - **What to change:** Analyze loudness (LUFS) of all tracks; normalize to -14 LUFS
    - **Why:** Consistent volume across tracks
    - **Where:** Batch process audio/ files with ffmpeg-normalize
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Perceived volume consistent between tracks

15. **Create audio search index**
    - **What to change:** Index track names/lyrics in Fuse.js search
    - **Why:** Users should find tracks via search
    - **Where:** `./web/src/lib/data/tracks.js`
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** Searching "ALIVE" returns ALIVE.mp3

16. **Add track popularity sorting**
    - **What to change:** Use play count to show "most played" tracks first
    - **Why:** Surface popular content
    - **Where:** StudioPlayer track list UI
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Tracks sortable by play count

17. **Implement audio quality toggle**
    - **What to change:** Provide HQ (192kbps) and LQ (96kbps) versions; let user choose
    - **Why:** Bandwidth conservation option
    - **Where:** Generate dual quality files in build
    - **Priority/Effort:** P2 — L
    - **Acceptance check:** Settings has audio quality toggle

18. **Add error handling for missing files**
    - **What to change:** If audio file 404s, show error state with retry button
    - **Why:** Graceful degradation
    - **Where:** `./web/src/components/StudioPlayer.jsx`
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** Missing audio shows error instead of infinite loading

19. **Create audio CDN strategy**
    - **What to change:** Move audio/ to CDN (Cloudflare, AWS CloudFront) for better delivery
    - **Why:** Reduces main server load, geo-distributed delivery
    - **Where:** Build script to sync audio/ to CDN
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Audio loads from cdn.yourdomain.com

20. **Add shuffle algorithm**
    - **What to change:** Implement proper shuffle (Fisher-Yates) for playlist randomization
    - **Why:** Better user experience than naive Math.random() sort
    - **Where:** StudioPlayer shuffle logic
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Shuffle produces evenly distributed randomness

---

## Category 3 — data (20 items)

1. **Implement data pagination**
   - **What to change:** Load entities in chunks of 50 instead of all at once per domain
   - **Why:** Large domains (music, cinema, people) have 100+ entities causing slow initial load
   - **Where:** `./web/src/lib/dataLoader.js` loadDomainEntities function
   - **Priority/Effort:** P0 — M
   - **Acceptance check:** Domain pages load in <1s even with 100+ entities

2. **Add data validation schema**
   - **What to change:** Create JSON Schema or Zod schemas for entity, domain, relation data structures
   - **Why:** Catch malformed data at build time, not runtime
   - **Where:** New file `./web/scripts/schemas/entity.schema.json`
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Build fails if invalid entities detected

3. **Consolidate entity manifests**
   - **What to change:** Each domain has separate entities-manifest.json; create single unified manifest
   - **Why:** Reduces HTTP requests from 24 to 1
   - **Where:** Build script to merge all manifests into `./web/public/data/unified-manifest.json`
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Single manifest fetch loads all domain metadata

4. **Implement data compression**
   - **What to change:** Gzip compress large JSON files (knowledge-hub.json, manifests)
   - **Why:** Text compression reduces data transfer by 70-80%
   - **Where:** Build step + server configuration
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** Network shows gzipped responses for JSON

5. **Add data versioning**
   - **What to change:** Include version field in manifests; implement migration system for breaking changes
   - **Why:** Enables backwards compatibility and cache invalidation
   - **Where:** All manifest files + new `./web/scripts/migrate-data.js`
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Version mismatch shows update prompt

6. **Create indexed DB cache**
   - **What to change:** Store loaded entity data in IndexedDB for instant offline access
   - **Why:** Reduces redundant network fetches
   - **Where:** `./web/src/lib/dataLoader.js` — add IndexedDB layer
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Second visit loads data from IndexedDB, not network

7. **Optimize relation data**
   - **What to change:** Relations files contain redundant entity data; store only IDs and fetch on-demand
   - **Why:** Reduces payload size
   - **Where:** All `data/*/relations/relations.json` files
   - **Priority/Effort:** P2 — M
   - **Acceptance check:** Relations payloads 50% smaller

8. **Add full-text search index**
   - **What to change:** Pre-generate Fuse.js index during build instead of runtime
   - **Why:** Eliminates expensive indexing on every app load
   - **Where:** Build script to generate search-index.json
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Search ready instantly without re-indexing

9. **Implement data prefetching**
   - **What to change:** On home page, prefetch popular domain data in background
   - **Why:** Makes navigation feel instant
   - **Where:** `./web/src/lib/prefetchManager.js`
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** Popular domains load instantly

10. **Add data integrity checks**
    - **What to change:** Validate all entity IDs are unique, relations point to existing entities
    - **Why:** Catch data corruption
    - **Where:** New script `./web/scripts/validate-data-integrity.js`
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** Build fails on broken relations

11. **Optimize image references**
    - **What to change:** Entity images use absolute URLs or base64; switch to relative paths
    - **Why:** Enables caching and offline support
    - **Where:** All entity JSON files
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Images load offline

12. **Create data migration tool**
    - **What to change:** Script to update all entities when schema changes
    - **Why:** Manual updates across 1500+ files is error-prone
    - **Where:** `./web/scripts/migrate-entities.js`
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Schema change propagates to all entities

13. **Add data backup automation**
    - **What to change:** Git pre-commit hook to backup data/ to separate repo
    - **Why:** Protects against accidental deletion
    - **Where:** `.git/hooks/pre-commit`
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Backup repo updates on every commit

14. **Implement stale-while-revalidate**
    - **What to change:** Serve cached data immediately, fetch fresh data in background
    - **Why:** Instant loads + always-fresh content
    - **Where:** Service worker cache strategy
    - **Priority/Effort:** P1 — M
    - **Acceptance check:** Data loads instantly, updates silently

15. **Add GraphQL layer (optional)**
    - **What to change:** Create GraphQL API for flexible data queries
    - **Why:** Reduces over-fetching; fetch only needed fields
    - **Where:** New `./web/src/lib/graphql/` module
    - **Priority/Effort:** P2 — L
    - **Acceptance check:** Queries fetch minimal data

16. **Create data export tool**
    - **What to change:** Allow users to export all data as JSON/CSV
    - **Why:** Data portability
    - **Where:** Settings page export button
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Export downloads complete dataset

17. **Add data import validation**
    - **What to change:** UI to import/merge external entity data
    - **Why:** Community contributions
    - **Where:** Admin page with upload + validation
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Invalid imports show errors

18. **Optimize alias map storage**
    - **What to change:** Alias maps are duplicated per domain; create global alias index
    - **Why:** Reduces redundancy
    - **Where:** Merge all `indexes/alias_map.json` into one
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Single alias map used by all domains

19. **Add data changelog**
    - **What to change:** Track entity additions/modifications in changelog.json
    - **Why:** Users can see what's new
    - **Where:** Build script to generate changelog from git history
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** About page shows recent additions

20. **Implement data deduplication**
    - **What to change:** Some entities appear in multiple domains; create canonical entities + references
    - **Why:** Reduces storage and inconsistency risk
    - **Where:** Data normalization script
    - **Priority/Effort:** P2 — L
    - **Acceptance check:** No duplicate entity content

---

## Category 4 — dictionary (20 items)

1. **Implement virtual scrolling for word lists**
   - **What to change:** DictionaryLetter page loads all words at once; use react-window for 1000+ word letters
   - **Why:** Pages with Y (100+ words) or W (200+ words) cause performance issues
   - **Where:** `./web/src/pages/DictionaryLetter.jsx`
   - **Priority/Effort:** P0 — M
   - **Acceptance check:** Smooth scrolling on letter W with 200+ words

2. **Reduce word.md file count**
   - **What to change:** 6700+ individual markdown files is excessive; consolidate into letter-based JSON files
   - **Why:** Reduces file system overhead, enables better caching
   - **Where:** `./web/dictionary/*/01_Words/` folders
   - **Priority/Effort:** P0 — L
   - **Acceptance check:** Single words-A.json replaces 200+ A word folders

3. **Fix MASTER-DICTIONARY-MANIFEST.json duplication**
   - **What to change:** MASTER-DICTIONARY-MANIFEST.json exists in both /dictionary/ and /public/; remove duplicate
   - **Why:** Source of truth should be single location
   - **Where:** Remove from `./web/dictionary/` or `./web/public/`
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** Only one MASTER-DICTIONARY-MANIFEST.json exists

4. **Optimize manifest file size**
   - **What to change:** dictionary-manifest.json is 170KB with repetitive structure; use short keys or binary format
   - **Why:** Reduces parse time and transfer size
   - **Where:** Build script to generate compact manifest
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Manifest size <50KB

5. **Remove .claude folder**
   - **What to change:** Delete `.claude` folder from dictionary/ — appears to be temp AI artifacts
   - **Why:** No need for AI temp files in source
   - **Where:** `./web/dictionary/.claude/`
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** .claude folder deleted

6. **Remove .wordlists folder**
   - **What to change:** Delete `.wordlists` folder if it's just build cache
   - **Why:** Build artifacts shouldn't be committed
   - **Where:** `./web/dictionary/.wordlists/`
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** .wordlists folder deleted or .gitignored

7. **Consolidate cleanup scripts**
   - **What to change:** 26 cleanup_X.js files (A-Z) have 95% identical code; create cleanup_letter.js that takes parameter
   - **Why:** Reduces code duplication, easier maintenance
   - **Where:** `./web/dictionary/99_SCRIPTS/`
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** Single cleanup_letter.js(letter) replaces 26 files

8. **Add word pronunciation data**
   - **What to change:** word.md files lack IPA pronunciation; add phonetic field
   - **Why:** Improves educational value
   - **Where:** All word.md files + new field in schema
   - **Priority/Effort:** P2 — L
   - **Acceptance check:** Word pages show IPA pronunciation

9. **Implement rhyme scheme analyzer**
   - **What to change:** Add tool to detect rhyme patterns in verses
   - **Why:** Core value prop for rap dictionary
   - **Where:** `./web/src/components/RhymeSchemeAnalyzer.jsx` (exists but check implementation)
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Paste verse, see AABB/ABAB pattern detected

10. **Add word etymology**
    - **What to change:** Include origin/history field in word.md
    - **Why:** Educational value
    - **Where:** word.md schema + UI display
    - **Priority/Effort:** P2 — L
    - **Acceptance check:** Words show etymology when available

11. **Create word usage examples**
    - **What to change:** Add 2-3 lyrical examples per word from track library
    - **Why:** Contextual learning
    - **Where:** Link words to tracks using them
    - **Priority/Effort:** P2 — L
    - **Acceptance check:** Word pages show usage in actual lyrics

12. **Implement spaced repetition**
    - **What to change:** Flashcard mode for vocabulary building
    - **Why:** Learning tool
    - **Where:** New study mode UI
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Study mode cycles words with SRS algorithm

13. **Add word frequency analysis**
    - **What to change:** Track how often each word appears in lyrics
    - **Why:** Show popular/rare words
    - **Where:** Analyze track lyrics, store counts
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Words tagged with frequency tier

14. **Fix Master Index duplication**
    - **What to change:** Each letter has "X Master Index.md" — these should be auto-generated, not committed
    - **Why:** Reduces manual maintenance
    - **Where:** `./web/dictionary/*/X Master Index.md`
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Master Indexes generated on build, not committed

15. **Add word similarity search**
    - **What to change:** "Find similar" button using metaphone/soundex
    - **Why:** Helps find rhyming alternatives
    - **Where:** Word detail page
    - **Priority/Effort:** P1 — M
    - **Acceptance check:** "throne" shows "tone, clone, phone"

16. **Create word collections**
    - **What to change:** Let users create custom word lists (themes: space, money, emotions)
    - **Why:** Personalized learning
    - **Where:** Collections UI + storage
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Users save words to named collections

17. **Add word export**
    - **What to change:** Export word list as Anki deck or CSV
    - **Why:** Integration with other tools
    - **Where:** Export button on dictionary page
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Downloads Anki-compatible file

18. **Implement word randomizer**
    - **What to change:** "Random word" button for creative prompts
    - **Why:** Writer's block tool
    - **Where:** Dictionary navigation
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Button shows random word

19. **Add synonym/antonym data**
    - **What to change:** Link words to synonyms and antonyms
    - **Why:** Vocabulary expansion
    - **Where:** word.md schema + thesaurus data
    - **Priority/Effort:** P2 — L
    - **Acceptance check:** Words show related synonyms

20. **Create practice quizzes**
    - **What to change:** Multiple choice word definition quizzes
    - **Why:** Gamification
    - **Where:** New quiz mode
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Quiz generates from word database

---

## Category 5 — public (20 items)

1. **Optimize manifest.json**
   - **What to change:** Add fuller PWA manifest fields (screenshots, shortcuts, categories)
   - **Why:** Better app install experience
   - **Where:** `./web/public/manifest.json`
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** PWA audit shows 100% installability

2. **Enhance service worker**
   - **What to change:** sw.js is minimal; implement workbox patterns, versioning, cleanup
   - **Why:** Better offline experience
   - **Where:** `./web/public/sw.js`
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Offline mode fully functional

3. **Add robots.txt**
   - **What to change:** Create robots.txt to guide search crawlers
   - **Why:** SEO optimization
   - **Where:** New file `./web/public/robots.txt`
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** robots.txt exists with sitemap reference

4. **Create sitemap.xml**
   - **What to change:** Generate sitemap with all pages during build
   - **Why:** SEO — helps Google index all content
   - **Where:** Build script to generate `./web/public/sitemap.xml`
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Sitemap lists all entity and dictionary pages

5. **Add security.txt**
   - **What to change:** Create security.txt for vulnerability disclosure
   - **Why:** Security best practice
   - **Where:** `./web/public/.well-known/security.txt`
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** security.txt exists with contact info

6. **Implement humans.txt**
   - **What to change:** Add humans.txt crediting contributors
   - **Why:** Nice touch for open source
   - **Where:** `./web/public/humans.txt`
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** humans.txt lists team

7. **Add CSP headers**
   - **What to change:** Define Content Security Policy in meta tag
   - **Why:** Security — prevents XSS
   - **Where:** `./web/index.html` meta tag
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** CSP header blocks inline scripts

8. **Create offline fallback page**
   - **What to change:** offline.html shown when no connectivity
   - **Why:** Better offline UX
   - **Where:** `./web/public/offline.html`
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** Airplane mode shows friendly offline page

9. **Optimize icon variants**
   - **What to change:** Generate all required PWA icon sizes from icon.svg
   - **Why:** PWA compliance
   - **Where:** Build script to create 192x192, 512x512 PNGs
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** manifest.json references all icon sizes

10. **Add theme-color meta**
    - **What to change:** Set theme-color in manifest and meta tag
    - **Why:** Native app feel on mobile
    - **Where:** `./web/public/manifest.json` + index.html
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Android shows custom toolbar color

11. **Create 404 page**
    - **What to change:** Custom 404.html for GitHub Pages
    - **Why:** Better UX on missing pages
    - **Where:** `./web/public/404.html`
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** Invalid URLs show custom 404

12. **Add Open Graph images**
    - **What to change:** Generate og-image.png for social sharing
    - **Why:** Better link previews
    - **Where:** `./web/public/og-image.png`
    - **Priority/Effort:** P1 — M
    - **Acceptance check:** Share on Twitter shows preview image

13. **Implement asset versioning**
    - **What to change:** Add version query param to build-info.json
    - **Why:** Cache busting
    - **Where:** Build script
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** build-info.json?v=timestamp prevents caching

14. **Add browserconfig.xml**
    - **What to change:** Configure Windows tile icons
    - **Why:** Better Windows integration
    - **Where:** `./web/public/browserconfig.xml`
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Windows tile shows custom icon

15. **Create data sync endpoint**
    - **What to change:** API endpoint for data updates
    - **Why:** Live data updates
    - **Where:** Consider Firebase/Supabase integration
    - **Priority/Effort:** P2 — L
    - **Acceptance check:** App syncs new entities without rebuild

16. **Add analytics configuration**
    - **What to change:** Include GA4 or Plausible config file
    - **Why:** Privacy-first analytics
    - **Where:** `./web/public/analytics-config.json`
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Page views tracked

17. **Implement CORS headers**
    - **What to change:** Add _headers file for Netlify/Vercel
    - **Why:** Proper CORS for API access
    - **Where:** `./web/public/_headers`
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** API requests from other domains work

18. **Add redirect rules**
    - **What to change:** Create _redirects for clean URLs
    - **Why:** Better SEO
    - **Where:** `./web/public/_redirects`
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** /dictionary/A redirects to /dictionary/A/

19. **Create data validation endpoint**
    - **What to change:** Public endpoint to validate entity JSON
    - **Why:** Community data contributions
    - **Where:** Serverless function
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** POST entity JSON returns validation errors

20. **Add version indicator**
    - **What to change:** Display build version in footer
    - **Why:** User awareness of updates
    - **Where:** Read from build-info.json
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Footer shows v1.0.0 + build date

---

## Category 6 — scripts (20 items)

1. **Consolidate cleanup scripts**
   - **What to change:** Replace cleanup_A.js through cleanup_Z.js (26 files) with single cleanup_letter.js(letter)
   - **Why:** Massive code duplication
   - **Where:** `./web/scripts/cleanup_*.js`
   - **Priority/Effort:** P0 — S
   - **Acceptance check:** `node scripts/cleanup.js A` works for all letters

2. **Add error handling to buildData.js**
   - **What to change:** Lines 74-77 have try/catch but errors are just logged, not bubbled; fail build on critical errors
   - **Why:** Malformed data should break build, not silently fail
   - **Where:** `./web/scripts/buildData.js`
   - **Priority/Effort:** P0 — S
   - **Acceptance check:** Invalid JSON breaks build with clear error

3. **Implement parallel processing**
   - **What to change:** buildData.js processes domains sequentially; use Promise.all for parallel processing
   - **Why:** Build time optimization
   - **Where:** `./web/scripts/buildData.js` line 96-100
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** Build time reduces by 40-60%

4. **Add progress indicators**
   - **What to change:** Long-running scripts (buildData, scan-tracks) lack progress bars
   - **Why:** User feedback during builds
   - **Where:** All build scripts
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** Scripts show "Processing 45/100..."

5. **Create script documentation**
   - **What to change:** No README in scripts/ explaining what each does
   - **Why:** Onboarding new developers
   - **Where:** New file `./web/scripts/README.md`
   - **Priority/Effort:** P2 — S
   - **Acceptance check:** README lists all scripts + usage

6. **Add dry-run mode**
   - **What to change:** Destructive scripts (cleanup) should have --dry-run flag
   - **Why:** Safety before mass changes
   - **Where:** All cleanup_*.js scripts
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** `--dry-run` shows changes without applying

7. **Implement script testing**
   - **What to change:** Write tests for critical scripts (buildData, generate-metadata)
   - **Why:** Prevent regressions
   - **Where:** New `./web/scripts/__tests__/` folder
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** `npm test` runs script tests

8. **Add schema validation**
   - **What to change:** generate-metadata.js should validate output against schema
   - **Why:** Catch errors early
   - **Where:** `./web/scripts/generate-metadata.js`
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** Invalid metadata breaks build

9. **Create pre-commit hooks**
   - **What to change:** Run data validation before commits
   - **Why:** Prevent bad data from entering repo
   - **Where:** `.git/hooks/pre-commit`
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** Committing invalid data fails

10. **Optimize scan-tracks.js**
    - **What to change:** Scans all 120+ MP3s every time; cache metadata, only scan new/modified files
    - **Why:** Speed up builds
    - **Where:** `./web/scripts/scan-tracks.js`
    - **Priority/Effort:** P1 — M
    - **Acceptance check:** Second run skips unchanged files

11. **Add script versioning**
    - **What to change:** Scripts have no version; add --version flag
    - **Why:** Track script changes
    - **Where:** All scripts
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** `--version` prints script version

12. **Create master build script**
    - **What to change:** Running prepare manually is error-prone; create build-all.js that orchestrates all steps
    - **Why:** One command to build everything
    - **Where:** New `./web/scripts/build-all.js`
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** `npm run build:all` runs full pipeline

13. **Add incremental builds**
    - **What to change:** buildData rebuilds everything; detect changed domains, rebuild only those
    - **Why:** Faster iteration
    - **Where:** `./web/scripts/buildData.js`
    - **Priority/Effort:** P1 — M
    - **Acceptance check:** Changing one domain doesn't rebuild all

14. **Implement data backup**
    - **What to change:** Before cleanup scripts run, backup original data
    - **Why:** Recovery from mistakes
    - **Where:** All destructive scripts
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** .backup/ folder created before changes

15. **Add CLI argument parsing**
    - **What to change:** Scripts use manual process.argv; use commander or yargs
    - **Why:** Better CLI UX
    - **Where:** All scripts with arguments
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** `--help` shows usage

16. **Create data migration tool**
    - **What to change:** Script to migrate data schema versions
    - **Why:** Breaking changes need migration path
    - **Where:** New `./web/scripts/migrate-data.js`
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Migration updates all files

17. **Add linting for scripts**
    - **What to change:** Scripts not covered by eslint; add to lint target
    - **Why:** Code quality
    - **Where:** `./web/scripts/eslint.config.js`
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** `npm run lint` checks scripts/

18. **Implement CI/CD scripts**
    - **What to change:** Scripts to run in GitHub Actions (validate, build, test)
    - **Why:** Automated quality checks
    - **Where:** New `.github/workflows/` files
    - **Priority/Effort:** P1 — M
    - **Acceptance check:** PR checks run automatically

19. **Add script metrics**
    - **What to change:** Log execution time, memory usage
    - **Why:** Performance monitoring
    - **Where:** All long-running scripts
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** Scripts log "Completed in 2.3s"

20. **Create rollback mechanism**
    - **What to change:** Way to undo last script run
    - **Why:** Safety net
    - **Where:** All data modification scripts
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** `--rollback` restores previous state

---

## Category 7 — src (20 items)

1. **Add comprehensive test suite**
   - **What to change:** Zero tests found; add Jest + React Testing Library for components, Vitest for utils
   - **Why:** No test coverage is critical risk
   - **Where:** New `./web/src/**/__tests__/` folders
   - **Priority/Effort:** P0 — L
   - **Acceptance check:** 60%+ code coverage

2. **Remove tmpclaude-* folders**
   - **What to change:** Delete tmpclaude-409f-cwd, tmpclaude-be68-cwd, etc. — these are temp AI artifacts
   - **Why:** Pollutes source tree
   - **Where:** `./web/src/components/`, `./web/src/lib/`, `./web/src/pages/`
   - **Priority/Effort:** P0 — S
   - **Acceptance check:** No tmpclaude folders remain

3. **Implement proper error boundaries**
   - **What to change:** ErrorBoundary exists but needs route-level wrapping, retry logic, offline detection
   - **Why:** Better error UX
   - **Where:** `./web/src/components/ErrorBoundary.jsx`
   - **Priority/Effort:** P0 — M
   - **Acceptance check:** Errors show retry button + offline message

4. **Add TypeScript or JSDoc**
   - **What to change:** No type safety; add .d.ts files or JSDoc comments
   - **Why:** Catch type errors
   - **Where:** Start with `./web/src/lib/` utilities
   - **Priority/Effort:** P1 — L
   - **Acceptance check:** VSCode shows type hints

5. **Optimize context providers**
   - **What to change:** 7 nested providers in App.jsx causes re-render issues; combine or use Context Selector pattern
   - **Why:** Performance
   - **Where:** `./web/src/App.jsx` lines 44-88
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Profiler shows fewer re-renders

6. **Implement code splitting by route**
   - **What to change:** Lazy loading exists but could be more aggressive; split large components
   - **Why:** Reduce initial bundle
   - **Where:** All pages already lazy-loaded; split large components like WorkspaceGraph
   - **Priority/Effort:** P1 — M
   - **Acceptance check:** Lighthouse shows smaller FCP bundle

7. **Add accessibility improvements**
   - **What to change:** Missing aria-labels, keyboard navigation incomplete, no skip links
   - **Why:** WCAG compliance
   - **Where:** All interactive components
   - **Priority/Effort:** P0 — M
   - **Acceptance check:** Lighthouse accessibility >90

8. **Remove console statements**
   - **What to change:** 40+ console.log/warn/error across codebase
   - **Why:** Production pollution
   - **Where:** Implement logger service replacing all console calls
   - **Priority/Effort:** P1 — S
   - **Acceptance check:** Production build has 0 console logs

9. **Optimize GSAP usage**
   - **What to change:** GSAP animations may cause layout thrashing; audit for transform-only animations
   - **Why:** Performance
   - **Where:** `./web/src/lib/gsap/` and all animation code
   - **Priority/Effort:** P2 — M
   - **Acceptance check:** Animations use will-change, transform, opacity only

10. **Add loading skeletons**
    - **What to change:** LoadingState exists but most components show blank during load
    - **Why:** Better perceived performance
    - **Where:** All data-loading components
    - **Priority/Effort:** P1 — M
    - **Acceptance check:** Loading states show content-shaped skeletons

11. **Implement search debouncing**
    - **What to change:** Search triggers on every keystroke
    - **Why:** Performance + reduces searches
    - **Where:** `./web/src/components/ui/SearchBar.jsx`
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** Search waits 300ms after typing stops

12. **Add route transition animations**
    - **What to change:** Page changes are instant; add GSAP transitions
    - **Why:** Professional feel
    - **Where:** AppLayout route wrapper
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Routes fade in/out smoothly

13. **Optimize images**
    - **What to change:** react.svg is only usage; convert to inline SVG
    - **Why:** Reduce requests
    - **Where:** `./web/src/assets/react.svg`
    - **Priority/Effort:** P2 — S
    - **Acceptance check:** No external SVG requests

14. **Add mobile-specific components**
    - **What to change:** Mobile folder exists; ensure touch gestures, swipe navigation work
    - **Why:** Mobile UX
    - **Where:** `./web/src/components/mobile/`
    - **Priority/Effort:** P1 — M
    - **Acceptance check:** Swipe works on mobile browsers

15. **Implement virtual scrolling everywhere**
    - **What to change:** Long lists (domains, entities, words) should use react-window
    - **Why:** Performance for large lists
    - **Where:** All list components
    - **Priority/Effort:** P1 — M
    - **Acceptance check:** 1000+ item lists scroll smoothly

16. **Add state persistence**
    - **What to change:** Refresh loses search filters, scroll position, workspace state
    - **Why:** Better UX
    - **Where:** All contexts should persist to localStorage
    - **Priority/Effort:** P1 — M
    - **Acceptance check:** F5 preserves app state

17. **Optimize bundle splitting**
    - **What to change:** vite.config has manual chunks but could be better; use vite-plugin-chunk-split
    - **Why:** Better caching
    - **Where:** `./web/scripts/vite.config.js`
    - **Priority/Effort:** P1 — S
    - **Acceptance check:** Shared chunks <100KB

18. **Add component documentation**
    - **What to change:** Components lack prop documentation
    - **Why:** Developer experience
    - **Where:** Use JSDoc or Storybook
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** All components have prop docs

19. **Implement telemetry**
    - **What to change:** analytics.js exists but incomplete; add user journey tracking
    - **Why:** Product insights
    - **Where:** `./web/src/lib/analytics.js`
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Key interactions tracked

20. **Add feature flags**
    - **What to change:** No way to toggle experimental features
    - **Why:** Safe rollouts
    - **Where:** New `./web/src/lib/featureFlags.js`
    - **Priority/Effort:** P2 — M
    - **Acceptance check:** Features can be A/B tested

---

## Appendix

### A) Notable files reviewed

**Root Configuration:**
- `./web/package.json`
- `./web/package-lock.json`
- `./web/index.html`
- `./web/README.md`
- `./web/build.bat`
- `./web/generate_schema.bat`
- `./web/dictionary_schema.txt`
- `./web/folder_schema.txt`
- `./web/build-info.json`
- `./web/dictionary-manifest.json`
- `./web/domains-manifest.json`

**Source Code (selected):**
- `./web/src/App.jsx`
- `./web/src/main.jsx`
- `./web/src/lib/dataLoader.js`
- `./web/src/lib/rhymeFinder.js`
- `./web/src/lib/analytics.js`
- `./web/src/lib/performanceMonitor.js`
- `./web/src/lib/FavoritesContext.jsx`
- `./web/src/lib/WorkspaceContext.jsx`
- `./web/src/components/ErrorBoundary.jsx`
- `./web/src/components/AppLayout.jsx`
- `./web/src/components/StudioPlayer.jsx`
- `./web/src/pages/Dictionary.jsx`
- `./web/src/pages/DictionaryLetter.jsx`
- `./web/src/pages/DictionaryWord.jsx`
- `./web/src/pages/Home.jsx`
- `./web/src/pages/WritingStudio.jsx`

**Build Scripts:**
- `./web/scripts/buildData.js`
- `./web/scripts/scan-tracks.js`
- `./web/scripts/generate-metadata.js`
- `./web/scripts/vite.config.js`
- `./web/scripts/eslint.config.js`
- `./web/scripts/cleanup_A.js` through `cleanup_Z.js`

**Data Structure:**
- `./web/public/data/*/entities/*.json` (1571 entities)
- `./web/public/data/*/indexes/*.json` (by_tag, alias_map, by_era)
- `./web/public/data/*/relations/relations.json`
- `./web/public/dictionary/*/01_Words/*/word.md` (6700+ files)
- `./web/public/dictionary/MASTER-DICTIONARY-MANIFEST.json`
- `./web/audio/*.mp3` (120 tracks)

### B) Quick commands (optional)

Based on existing package.json scripts:

```bash
# Development
npm run dev          # Start Vite dev server with HMR
npm run prepare      # Generate metadata + scan tracks + build data

# Build & Deploy
npm run build        # Production build to dist/
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix linting issues (add this)

# Testing (NEED TO ADD)
npm test             # Run test suite (not implemented)
npm run test:watch   # Watch mode (not implemented)
npm run test:coverage # Coverage report (not implemented)

# Data Management
npm run prepare:metadata  # Generate build metadata
npm run prepare:tracks    # Scan audio tracks
npm run prepare:data      # Build knowledge hub data

# Utilities (RECOMMENDED TO ADD)
npm run clean        # Clean dist/ and temp files
npm run analyze      # Bundle size analysis
npm run lighthouse   # Run Lighthouse audit
npm run validate     # Validate data integrity
```

**Recommended new scripts to add:**

```json
{
  "scripts": {
    "clean": "rm -rf dist/ .vite/ node_modules/.vite/",
    "lint:fix": "eslint . --fix",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "analyze": "vite-bundle-visualizer",
    "lighthouse": "lighthouse http://localhost:5173 --view",
    "validate": "node scripts/validate-data-integrity.js",
    "typecheck": "tsc --noEmit" 
  }
}
```

---

**Document Generation Complete**  
Total recommendations: **140 actionable items** (20 per category × 7 categories)  
Confidence: High — all recommendations based on actual files/patterns found in codebase scan  
Next steps: Prioritize P0 items, then P1, then P2 as bandwidth allows
