# JaZeR Rhyme Book - Web Directory Inventory

**Generated:** January 20, 2026  
**Purpose:** Complete catalog of all files in the `/web` directory with descriptions

---

## 📁 Root Level Files

### Configuration Files
- **`package.json`** - NPM dependencies and scripts configuration
- **`package-lock.json`** - Locked dependency versions
- **`vite.config.js`** - Vite build tool configuration
- **`.eslintrc.cjs`** - ESLint code quality rules
- **`.gitignore`** - Git ignore patterns

### HTML Entry Points
- **`index.html`** - Main application entry point
- **`test-suite.html`** - Testing harness for components

### Assets
- **`vite.svg`** - Vite logo icon

### Documentation
- **`v3_Checklist.md`** - Version 3 implementation checklist
- **`v3_Improvement_Plan.md`** - Version 3 improvement roadmap

---

## 📂 `/public` Directory

### Images & Media
- **`logo.png`** - JaZeR Rhyme Book primary logo
- **`JaZeR-Wordmark-LOGO.png`** - Wordmark variant
- **`MASTER-FLOW-LOGO.png`** - Master Flow branding
- **`icon-192.png`** - PWA icon (192x192)
- **`icon-512.png`** - PWA icon (512x512)

### PWA Configuration
- **`manifest.json`** - Progressive Web App manifest
- **`service-worker.js`** - Service worker for offline functionality

### SEO & Metadata
- **`robots.txt`** - Search engine crawling instructions
- **`sitemap.xml`** - Site structure for search engines

---

## 📂 `/src` Directory

### Core Application Files
- **`main.jsx`** - React application entry point and router setup
- **`test-main.jsx`** - Test environment entry point
- **`App.jsx`** - Main application component with routing
- **`App.css`** - Application-level styles
- **`index.css`** - Global CSS variables and base styles

---

## 📂 `/src/components` - UI Components

### Navigation Components
- **`Nav.jsx`** / **`Nav.css`** - Main navigation header
- **`BottomNav.jsx`** / **`BottomNav.css`** - Mobile bottom navigation
- **`BreadcrumbNav.jsx`** / **`BreadcrumbNav.css`** - Breadcrumb navigation
- **`Sidebar.jsx`** / **`Sidebar.css`** - Left sidebar navigation

### Core UI Components
- **`Hero.jsx`** / **`Hero.css`** - Homepage hero section
- **`Footer.jsx`** / **`Footer.css`** - Site footer
- **`ErrorBoundary.jsx`** - React error boundary wrapper
- **`SEO.jsx`** - SEO metadata component

### Search & Filters
- **`SearchBar.jsx`** / **`SearchBar.css`** - Search input component
- **`FilterPanel.jsx`** / **`FilterPanel.css`** - Filter controls
- **`CommandPalette.jsx`** / **`CommandPalette.css`** - Keyboard-driven command interface
- **`SmartSearch.jsx`** / **`SmartSearch.css`** - Enhanced search with suggestions

### Card Components
- **`EntityCard.jsx`** / **`EntityCard.css`** - Generic entity display card
- **`WordCard.jsx`** / **`WordCard.css`** - Dictionary word display
- **`DomainCard.jsx`** - Domain category card
- **`DomainCard2.jsx`** - Enhanced domain card with rich media

### Interactive Components
- **`Toast.jsx`** / **`Toast.css`** - Notification toast system
- **`Modal.jsx`** / **`Modal.css`** - Modal dialog component
- **`LoadingSpinner.jsx`** / **`LoadingSpinner.css`** - Loading indicator
- **`ProgressBar.jsx`** / **`ProgressBar.css`** - Progress indicator

### Content Display
- **`ContentRenderer.jsx`** / **`ContentRenderer.css`** - Markdown/content renderer
- **`Tabs.jsx`** / **`Tabs.css`** - Tab navigation component
- **`TagCloud.jsx`** / **`TagCloud.css`** - Interactive tag visualization
- **`Timeline.jsx`** / **`Timeline.css`** - Chronological timeline display

### Workspace & Tools
- **`WorkspaceDrawer.jsx`** / **`WorkspaceDrawer.css`** - Workspace sidebar panel
- **`WorkspaceGraph.jsx`** / **`WorkspaceGraph.css`** - Visual relationship graph
- **`StudioPlayer.jsx`** / **`StudioPlayer.css`** - Audio player for writing studio
- **`RhymeAssistant.jsx`** / **`RhymeAssistant.css`** - Contextual rhyme suggestions
- **`FloatingRhymeAssistant.jsx`** - Floating rhyme helper panel

### Charts & Visualizations
- **`StatCard.jsx`** / **`StatCard.css`** - Statistics display card
- **`RadarChart.jsx`** - Radar chart visualization
- **`WordComparisonChart.jsx`** - Side-by-side word comparison

### Special Effects
- **`GenerativeArt.jsx`** - Animated background art component
- **`ScanningLines.jsx`** / **`ScanningLines.css`** - Cyber aesthetic effect
- **`BootSequence.jsx`** / **`BootSequence.css`** - Terminal-style loading screen

---

## 📂 `/src/components/ui` - Reusable UI Primitives

- **`index.js`** - Barrel export for all UI components
- **`Badge.jsx`** / **`Badge.css`** - Badge/label component
- **`Button.jsx`** / **`Button.css`** - Button component
- **`MagneticButton.jsx`** / **`MagneticButton.css`** - Interactive magnetic button
- **`Card.jsx`** / **`Card.css`** - Generic card container
- **`HoverCard.jsx`** / **`HoverCard.css`** - Card with hover effects
- **`ResponsiveCard.jsx`** / **`ResponsiveCard.css`** - Mobile-optimized card
- **`Input.jsx`** / **`Input.css`** - Form input component
- **`Toggle.jsx`** / **`Toggle.css`** - Toggle switch
- **`Slider.jsx`** / **`Slider.css`** - Range slider

---

## 📂 `/src/components/mobile` - Mobile-Specific Components

- **`MobileHeader.jsx`** / **`MobileHeader.css`** - Mobile navigation header
- **`MobileNav.jsx`** / **`MobileNav.css`** - Mobile navigation menu
- **`MobileOptimizedGrid.jsx`** - Responsive grid layout for mobile

---

## 📂 `/src/pages` - Route Pages

### Main Pages
- **`Home.jsx`** / **`Home.css`** - Homepage/landing page
- **`About.jsx`** / **`About.css`** - About page
- **`NotFound.jsx`** / **`NotFound.css`** - 404 error page

### Dictionary Section
- **`Dictionary.jsx`** / **`Dictionary.css`** - Dictionary hub page
- **`DictionaryLetter.jsx`** / **`DictionaryLetter.css`** - Words by letter view
- **`DictionaryWord.jsx`** / **`DictionaryWord.css`** - Individual word detail
- **`DictionaryFavorites.jsx`** / **`DictionaryFavorites.css`** - Saved favorite words

### Domain Section
- **`Domains.jsx`** / **`Domains.css`** - Domain categories overview
- **`DomainDetail.jsx`** / **`DomainDetail.css`** - Domain category detail
- **`DomainView.jsx`** - Alternative domain view
- **`EntityDetail.jsx`** / **`EntityDetail.css`** - Individual entity detail page

### Tools & Features
- **`Search.jsx`** / **`Search.css`** - Global search page
- **`WordCompare.jsx`** / **`WordCompare.css`** - Side-by-side word comparison
- **`RhymeGalaxy.jsx`** / **`RhymeGalaxy.css`** - Visual rhyme explorer
- **`WritingStudio.jsx`** / **`WritingStudio.css`** - Immersive writing environment

### System Pages
- **`Settings.jsx`** / **`Settings.css`** - User preferences
- **`Stats.jsx`** / **`Stats.css`** - Usage statistics
- **`Architecture.jsx`** / **`Architecture.css`** - System architecture documentation
- **`Docs.jsx`** / **`Docs.css`** - Documentation hub

### Shared Styles
- **`ContentPage.css`** - Shared styles for content pages

---

## 📂 `/src/lib` - Business Logic & Utilities

### Context Providers (State Management)
- **`WorkspaceContext.jsx`** - Workspace state (saved items, collections)
- **`FilterContext.jsx`** - Filter state management
- **`FavoritesContext.jsx`** - Favorites tracking
- **`EntityLikesContext.jsx`** - Entity likes/ratings
- **`BrowsingHistoryContext.jsx`** - Navigation history
- **`SearchHistoryContext.jsx`** - Search history tracking
- **`UserPreferencesContext.jsx`** - User settings/preferences

### Data Management
- **`dataLoader.js`** - Data fetching and caching utilities
- **`collections.js`** - Collection management logic
- **`exportFormats.js`** - Export functionality (JSON, CSV, etc.)

### Search & Analysis
- **`rhymeFinder.js`** - Rhyme detection algorithms
- **`searchParser.js`** - Search query parsing
- **`flowAnalysis.js`** - Flow pattern analysis
- **`recommendationEngine.js`** - Content recommendations

### Audio & Media
- **`audioProcessing.js`** - Audio waveform/analysis
- **`SoundManager.js`** - Sound effects manager
- **`voiceInput.js`** - Voice recognition integration
- **`imageOptimizer.js`** - Image optimization utilities

### Performance & PWA
- **`performanceMonitor.js`** - Performance tracking
- **`prefetchManager.js`** - Resource prefetching
- **`offlineManager.js`** - Offline data management
- **`pwaHelpers.js`** - PWA utility functions

### UI Utilities
- **`accessibility.js`** - A11y helper functions
- **`analytics.js`** - Analytics tracking
- **`seoHelpers.js`** - SEO metadata helpers
- **`useKeyboardShortcuts.js`** - Keyboard shortcut hook

### Animation
- **`gsap.js`** - GSAP animation setup
- **`gsap/registerPlugins.js`** - GSAP plugin registration
- **`gsap/easing.js`** - Custom easing functions

### Achievements
- **`achievements.js`** - User achievements system

### Custom Hooks
- **`hooks.js`** - Collection of custom React hooks

---

## 📂 `/src/lib/data` - Static Data

- **`rapDictionary.js`** - Dictionary word definitions
- **`knowledgeHub.js`** - Knowledge base content
- **`philosophy.js`** - Philosophy/theory content
- **`eras.js`** - Hip-hop era data
- **`tools.js`** - Tool definitions and metadata
- **`tracks.js`** - Track/music data

---

## 📂 `/src/hooks` - Custom React Hooks

- **`useLocalStorage.js`** - LocalStorage persistence hook
- **`useSEO.js`** - SEO metadata management
- **`useMobileGestures.js`** - Touch gesture handling

---

## 📂 `/src/styles` - Global Stylesheets

- **`theme.css`** - CSS custom properties and theme variables
- **`glassmorphism.css`** - Glassmorphism effect styles
- **`mobile.css`** - Mobile-specific responsive styles
- **`high-contrast.css`** - High contrast accessibility mode
- **`reduced-motion.css`** - Reduced motion accessibility mode

---

## 🗑️ Temporary/Cleanup Files

The following files appear to be temporary and should be deleted:
- **`src/lib/tmpclaude-*`** - Temporary Claude files
- **`src/pages/tmpclaude-*`** - Temporary Claude files
- **`src/tmpclaude-*`** - Temporary Claude files

---

## 📊 File Statistics

- **Total Files:** ~150+
- **JavaScript/JSX:** ~100
- **CSS:** ~50
- **Configuration:** ~10
- **Data:** ~6
- **HTML:** 2

---

## 🎯 Component Hierarchy

```
App.jsx (Root)
├── Nav.jsx
├── Sidebar.jsx
├── CommandPalette.jsx
├── [Page Components]
│   ├── Home.jsx
│   │   └── Hero.jsx
│   │   └── GenerativeArt.jsx
│   ├── Dictionary.jsx
│   │   └── WordCard.jsx
│   │   └── FilterPanel.jsx
│   ├── Domains.jsx
│   │   └── DomainCard.jsx
│   ├── WritingStudio.jsx
│   │   └── StudioPlayer.jsx
│   │   └── RhymeAssistant.jsx
│   └── [Other Pages...]
├── WorkspaceDrawer.jsx
│   └── WorkspaceGraph.jsx
├── BottomNav.jsx (Mobile)
├── Footer.jsx
└── Toast.jsx
```

---

## 🔄 Context Provider Hierarchy

```
main.jsx
└── UserPreferencesContext
    └── WorkspaceContext
        └── FilterContext
            └── FavoritesContext
                └── EntityLikesContext
                    └── BrowsingHistoryContext
                        └── SearchHistoryContext
                            └── Router
                                └── App.jsx
```

---

## 🚀 Next Steps for Optimization

1. **Cleanup:** Remove all `tmpclaude-*` temporary files
2. **Code Splitting:** Implement lazy loading for page components
3. **Tree Shaking:** Ensure unused exports are eliminated
4. **Bundle Analysis:** Run bundle analyzer to identify large dependencies
5. **Image Optimization:** Compress and convert images to WebP
6. **CSS Optimization:** Extract critical CSS, minify stylesheets
7. **Service Worker:** Enhance caching strategies

---

*This inventory is current as of January 20, 2026 and should be updated when significant file structure changes occur.*
