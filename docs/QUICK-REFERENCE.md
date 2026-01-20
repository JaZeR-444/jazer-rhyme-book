# 🚀 Quick Reference Guide - JaZeR Rhyme Book v3.0

## Development Commands

```bash
cd web
npm install              # Install dependencies
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run preview          # Preview production build
```

## New Component Quick Reference

### 🎨 Motion Components

#### PageTransition
```jsx
import { PageTransition } from '@/components/motion/PageTransition';

<PageTransition type="fade">      {/* fade, slide, glitch, scale */}
  <YourPage />
</PageTransition>
```

#### TextScramble
```jsx
import { TextScramble } from '@/components/motion/TextScramble';

<TextScramble duration={1.2} delay={0.3}>
  Master Flow Knowledge Hub
</TextScramble>
```

#### ScanningLines
```jsx
import { ScanningLines } from '@/components/motion/ScanningLines';

<ScanningLines 
  intensity="subtle"     {/* subtle, medium, heavy */}
  speed="slow"          {/* slow, medium, fast */}
  color="secondary"     {/* primary, secondary, accent */}
  count={2}
/>
```

#### BootSequence
```jsx
import { BootSequence } from '@/components/motion/BootSequence';

<BootSequence onComplete={handleComplete} skipable />
```

---

### ⚡ Interaction Components

#### MagneticButton
```jsx
import { MagneticButton } from '@/components/interactions/MagneticButton';

<MagneticButton 
  strength={0.3}        {/* 0.1-0.5 */}
  onClick={handleClick}
  className="your-class"
>
  Click Me
</MagneticButton>
```

#### HoverCard
```jsx
import { HoverCard } from '@/components/interactions/HoverCard';

<HoverCard
  title="Entity Name"
  data={[
    { label: 'Type', value: 'Concept' },
    { label: 'Domains', value: 3 }
  ]}
  actions={[
    { label: 'Explore', onClick: handleExplore },
    { label: 'Save', onClick: handleSave }
  ]}
/>
```

#### FeedbackProvider (Toast System)
```jsx
import { useFeedback } from '@/components/interactions';

const { success, error, warning, info } = useFeedback();

success('Item saved!');
error('Failed to load');
warning('Low battery');
info('New update available');
```

---

### 🔍 Search Components

#### SmartSearch
```jsx
import { SmartSearch } from '@/components/search/SmartSearch';

<SmartSearch
  onSelect={handleSelect}
  placeholder="Search anything..."
  className="your-class"
/>
```

Features:
- Real-time as-you-type results
- Categorization (Words, Entities, Domains)
- "Did you mean?" suggestions
- Keyboard navigation (↑↓ Enter Esc)
- Recent searches

---

### 📝 Writing Studio

#### ImmersiveStudio
```jsx
import { ImmersiveStudio } from '@/components/studio/ImmersiveStudio';

<ImmersiveStudio
  initialVibe="creative-flow"
  onSave={handleSave}
/>
```

**5 Vibe Presets:**
- `deep-focus` - Concentrated work mode
- `creative-flow` - Balanced creativity
- `high-energy` - Fast-paced intensity
- `chill-vibes` - Relaxed ambiance
- `midnight-oil` - Late night focus

#### GhostModule (Contextual Suggestions)
```jsx
import { GhostModule } from '@/components/studio/GhostModule';

<GhostModule
  cursorPosition={{ line: 5, column: 10 }}
  currentWord="fire"
  onSuggestionClick={handleAdd}
/>
```

---

### 📊 Visualization

#### GalaxyView
```jsx
import { GalaxyView } from '@/components/visualization/GalaxyView';

<GalaxyView
  words={wordData}
  onWordClick={handleWordClick}
  zoom={1.5}
  showConnections={true}
/>
```

#### VibeRadarChart
```jsx
import { VibeRadarChart } from '@/components/visualization/VibeRadarChart';

<VibeRadarChart
  word1Data={{ complexity: 7, versatility: 8, ... }}
  word2Data={{ complexity: 5, versatility: 9, ... }}
  word1Name="blazing"
  word2Name="scorching"
/>
```

**6 Vibe Metrics:**
- Complexity
- Versatility
- Intensity
- Flow
- Creativity
- Impact

---

### 🎴 Domain Components

#### DomainCard2
```jsx
import { DomainCard2 } from '@/components/domains/DomainCard2';

<DomainCard2
  domain={{
    id: 'music',
    name: 'Music & Rhythm',
    category: 'Creative Arts',
    entities: 156,
    description: 'Musical concepts...'
  }}
  onClick={handleClick}
/>
```

---

### 🎯 Drag & Drop

#### DraggableCard
```jsx
import { DraggableCard } from '@/components/interactions/DraggableCard';

<DraggableCard
  id="word-123"
  type="word"
  data={{ word: 'fire', rhymes: [...] }}
>
  <WordCard word="fire" />
</DraggableCard>
```

#### DropZone
```jsx
import { DropZone } from '@/components/interactions/DropZone';

<DropZone
  onDrop={handleDrop}
  accepts={['word', 'entity']}
>
  Drop items here
</DropZone>
```

---

## 🎨 Enhanced Styling

### Glassmorphism
```jsx
import { Card } from '@/components/ui/Card';

<Card 
  glass                    {/* Enable glass effect */}
  glassVariant="heavy"     {/* light, medium, heavy */}
  glow                     {/* Add border glow */}
  hover                    {/* Hover animations */}
>
  Content
</Card>
```

### CSS Classes
```css
.glass-light    /* Light glassmorphism */
.glass-medium   /* Medium glassmorphism */
.glass-heavy    /* Heavy glassmorphism */
.glass-glow     /* Border glow effect */
.glass-noise    /* Grain/noise overlay */
```

---

## 📱 Mobile Gestures

### useSwipeNavigation
```jsx
import { useSwipeNavigation } from '@/hooks/useMobileGestures';

function MyComponent() {
  useSwipeNavigation(); // Auto-enabled swipe-to-go-back
  
  return <div>Content</div>;
}
```

### useLongPress
```jsx
import { useLongPress } from '@/hooks/useMobileGestures';

function MyComponent() {
  const longPressProps = useLongPress((e) => {
    console.log('Long press detected!');
  }, 500);
  
  return <button {...longPressProps}>Hold me</button>;
}
```

### useSwipeActions
```jsx
import { useSwipeActions } from '@/hooks/useMobileGestures';

function MyComponent() {
  const swipeProps = useSwipeActions(
    () => console.log('Swiped left'),
    () => console.log('Swiped right'),
    75 // threshold in px
  );
  
  return <div {...swipeProps}>Swipe me</div>;
}
```

---

## ♿ Accessibility Utilities

### Focus Trap
```jsx
import { createFocusTrap } from '@/lib/accessibility';

useEffect(() => {
  const cleanup = createFocusTrap(modalRef.current);
  return cleanup;
}, []);
```

### Screen Reader Announcements
```jsx
import { announceToScreenReader } from '@/lib/accessibility';

announceToScreenReader('Item added to workspace', 'polite');
announceToScreenReader('Error occurred!', 'assertive');
```

### Contrast Checker
```jsx
import { getContrastRatio } from '@/lib/accessibility';

const ratio = getContrastRatio('rgb(255, 255, 255)', 'rgb(0, 0, 0)');
console.log(ratio); // 21 (AAA compliant!)
```

---

## 🖼️ Optimized Images

```jsx
import { OptimizedImage } from '@/components/ui/OptimizedImage';

<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero background"
  width={1920}
  height={1080}
  loading="lazy"
  fallback="/placeholder.svg"
/>
```

---

## 🎯 Context Providers

### WorkspaceContext
```jsx
import { useWorkspace } from '@/lib/WorkspaceContext';

const { 
  addToWorkspace, 
  removeFromWorkspace,
  workspace,
  recentSearches,
  addSearchHistory 
} = useWorkspace();

addToWorkspace({ type: 'word', data: wordData });
addSearchHistory('fire');
```

### DndContext
```jsx
import { useDndContext } from '@/contexts/DndContext';

const { isDragging, draggedItem } = useDndContext();
```

---

## 🎵 Audio System

### StudioPlayer
```jsx
import { StudioPlayer } from '@/components/studio/StudioPlayer';

<StudioPlayer
  playlist={ambientTracks}
  autoplay
  loop
  volume={0.5}
/>
```

---

## ⚙️ Performance

### Lazy Loading
All pages are already lazy loaded via `React.lazy()`.

### Image Optimization
```jsx
import { preloadCriticalImages } from '@/lib/imageOptimizer';

preloadCriticalImages([
  '/images/hero.jpg',
  '/images/logo.svg'
]);
```

### Code Splitting
Automatically configured in `vite.config.js`:
- vendor-react
- vendor-ui
- vendor-graph
- vendor-utils

---

## 🔧 Build Configuration

### Vite Config Highlights
- **Compression:** Brotli + Gzip
- **Minification:** Terser with console removal
- **Code Splitting:** Manual vendor chunks
- **Bundle Analysis:** Rollup visualizer at `dist/stats.html`

### View Bundle Stats
```bash
npm run build
# Open dist/stats.html in browser
```

---

## 📚 Documentation Files

1. **UI-UX-TODO.md** - Original requirements ✅
2. **FINAL-SUMMARY.md** - Complete project summary
3. **SPRINT5-COMPLETE.md** - Smart Search docs
4. **SPRINT6-COMPLETE.md** - Writing Studio docs
5. **SPRINT7-COMPLETE.md** - Visual Discovery docs
6. **SPRINT8-COMPLETE.md** - Domain Cards docs
7. **QUICK-REFERENCE.md** - This file

---

## 🎉 Quick Tips

### Enable Debug Mode
```jsx
// In App.jsx
performanceMonitor.setDebug(true);
```

### Check Accessibility
```jsx
import { prefersReducedMotion, prefersHighContrast } from '@/lib/accessibility';

if (prefersReducedMotion()) {
  // Disable animations
}
```

### Keyboard Shortcuts
- **Cmd/Ctrl + K** - Open command palette (when integrated)
- **↑↓** - Navigate search results
- **Enter** - Select item
- **Esc** - Close modals/search

---

## 🚀 Production Checklist

- [x] Run `npm run build`
- [x] Check bundle size warnings
- [x] Test on mobile devices
- [x] Verify accessibility (screen reader)
- [x] Test keyboard navigation
- [x] Check contrast ratios
- [x] Verify lazy loading works
- [x] Test drag-and-drop functionality
- [x] Verify all routes work
- [x] Check error boundaries

---

## 📞 Support

For questions or issues:
1. Check documentation in `/docs`
2. Review component source in `/src/components`
3. Check console for performance marks
4. Use React DevTools for debugging

---

**Version:** 3.0 - The Immersive Edition  
**Last Updated:** 2026-01-20  
**Status:** Production Ready ✅
