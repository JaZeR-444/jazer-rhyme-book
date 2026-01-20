# 📋 JaZeR Rhyme Book - File Review & Enhancement Checklist

**Purpose:** Track manual review and enhancement of all `/web` directory files.

**Instructions:** 
- Check `[ ]` when you start reviewing a file
- Mark `[x]` when enhancement is complete
- Add notes in the `Notes` column for any significant changes

---

## 🎯 Core Application Files

### Root (`web/`)
- [ ] **index.html** - Main HTML entry point, meta tags, root div
- [ ] **vite.config.js** - Vite build configuration
- [ ] **package.json** - Dependencies and scripts
- [ ] **.eslintrc.cjs** - ESLint configuration for code quality

---

## 📦 Source Files (`src/`)

### Main Entry (`src/`)
- [ ] **main.jsx** - Application entry point, providers setup
- [ ] **App.jsx** - Root component, routing, global state
- [ ] **App.css** - Global application styles
- [ ] **index.css** - CSS reset, root variables, global utilities

---

## 🧩 Components

### 🏠 Layout Components (`src/components/`)
- [ ] **CommandPalette.jsx** - Quick command/search interface (Cmd+K)
- [ ] **CommandPalette.css** - Command palette styling
- [ ] **EntityCard.jsx** - Card component for rhymes/words/entities
- [ ] **EntityCard.css** - Entity card styles
- [ ] **Hero.jsx** - Homepage hero section
- [ ] **Hero.css** - Hero section styles with animations
- [ ] **Nav.jsx** - Main navigation bar
- [ ] **Nav.css** - Navigation styles
- [ ] **SystemInitAnimation.jsx** - Boot sequence loading animation
- [ ] **SystemInitAnimation.css** - System init styles
- [ ] **WorkspaceDrawer.jsx** - Sidebar drawer for saved items/workspace
- [ ] **WorkspaceDrawer.css** - Workspace drawer styles
- [ ] **WorkspaceGraph.jsx** - Visual graph of workspace connections (react-force-graph)

### 📱 Mobile Components (`src/components/mobile/`)
- [ ] **BottomSheet.jsx** - Swipeable bottom sheet drawer for mobile
- [ ] **BottomSheet.css** - Bottom sheet styles
- [ ] **CompactCard.jsx** - Compact card variant optimized for mobile screens
- [ ] **CompactCard.css** - Compact card styles with responsive sizing
- [ ] **MobileHeader.jsx** - Mobile-optimized header with hamburger menu
- [ ] **MobileHeader.css** - Mobile header styles
- [ ] **MobileNavigation.jsx** - Mobile-specific navigation component
- [ ] **MobileNavigation.css** - Mobile nav styles
- [ ] **MobileOptimizedGrid.jsx** - Responsive grid layout for mobile (1-3 columns)
- [ ] **MobileOptimizedGrid.css** - Grid styles with breakpoints
- [ ] **ResponsiveCard.jsx** - Adaptive card that adjusts to screen size
- [ ] **ResponsiveCard.css** - Responsive card styles
- [ ] **SwipeableCard.jsx** - Card with swipe gestures (reveal actions)
- [ ] **SwipeableCard.css** - Swipeable card animations
- [ ] **SwipeHandler.jsx** - Gesture handler for swipe interactions
- [ ] **TouchFriendlyButton.jsx** - Large touch-target buttons for mobile
- [ ] **TouchFriendlyButton.css** - Touch-friendly button styles (min 44px)
- [ ] **index.js** - Mobile components barrel export

### 🎨 UI Components (`src/components/ui/`)
- [ ] **Badge.jsx** - Small status/category badges
- [ ] **Button.jsx** - Primary button component
- [ ] **Card.jsx** - Base card component
- [ ] **Dialog.jsx** - Modal dialog component
- [ ] **Drawer.jsx** - Sliding drawer component
- [ ] **Input.jsx** - Form input component
- [ ] **Label.jsx** - Form label component
- [ ] **Progress.jsx** - Progress bar/indicator
- [ ] **RadioGroup.jsx** - Radio button group
- [ ] **Select.jsx** - Dropdown select component
- [ ] **Slider.jsx** - Range slider component
- [ ] **Switch.jsx** - Toggle switch component
- [ ] **Tabs.jsx** - Tabbed interface component
- [ ] **Textarea.jsx** - Multi-line text input
- [ ] **index.js** - UI components barrel export

### 🎭 Advanced UI (`src/components/advanced/`)
- [ ] **GenerativeBackground.jsx** - Animated canvas/Three.js backgrounds
- [ ] **GlassmorphicCard.jsx** - Glassmorphism card with border glow
- [ ] **HoverCard.jsx** - Card with data-readout overlay on hover
- [ ] **MagneticButton.jsx** - Button with magnetic cursor effect
- [ ] **PageTransition.jsx** - GSAP-based route transition wrapper
- [ ] **ScanningLines.jsx** - Cyber-aesthetic scanning line overlay
- [ ] **TextScramble.jsx** - GSAP text scramble animation for headers

---

## 📄 Pages (`src/pages/`)
- [ ] **Dictionary.jsx** - Main dictionary/rhyme search page
- [ ] **Dictionary.css** - Dictionary page styles
- [ ] **DomainPage.jsx** - Individual domain detail page (e.g., "Fire", "Water")
- [ ] **DomainPage.css** - Domain page styles
- [ ] **Domains.jsx** - Domain explorer/listing page
- [ ] **Domains.css** - Domains page styles
- [ ] **Studio.jsx** - Writing studio/creative workspace
- [ ] **Studio.css** - Studio page styles

---

## 🔧 Utilities & Hooks (`src/lib/`)

### Contexts
- [ ] **EntityLikesContext.jsx** - Context for managing entity likes/favorites
- [ ] **WorkspaceContext.jsx** - Context for workspace state (saved items, connections)

### Custom Hooks
- [ ] **useMobileGestures.js** - Hook for mobile swipe/gesture handling
- [ ] **usePageTransition.js** - Hook for GSAP page transitions
- [ ] **useResponsive.js** - Hook for responsive breakpoint detection

### Utilities
- [ ] **api.js** - API client for backend communication
- [ ] **storage.js** - LocalStorage/IndexedDB utilities
- [ ] **utils.js** - General utility functions

---

## 🎵 Assets (`src/assets/`)
- [ ] **logo.svg** - Application logo
- [ ] **sounds/** - Audio files for haptic feedback (if applicable)
- [ ] **icons/** - Custom icon set

---

## 🎨 Styles (`src/styles/`)
- [ ] **mobile.css** - Mobile-specific styles and overrides
- [ ] **variables.css** - CSS custom properties (colors, spacing, etc.)
- [ ] **animations.css** - Reusable animation keyframes
- [ ] **glassmorphism.css** - Glassmorphism utility classes

---

## 📝 Enhancement Notes Template

**File:** _____________________  
**Date Reviewed:** _____________________  
**Changes Made:**
- 
- 
- 

**Performance Impact:** [ ] Positive [ ] Neutral [ ] Negative  
**Mobile Optimized:** [ ] Yes [ ] No [ ] N/A  
**Accessibility:** [ ] Improved [ ] Unchanged [ ] Needs Work  

---

## 🏁 Completion Summary

**Total Files:** ~80+  
**Files Reviewed:** _____ / _____  
**Files Enhanced:** _____ / _____  
**Completion %:** _____%  

---

**Last Updated:** January 20, 2026
