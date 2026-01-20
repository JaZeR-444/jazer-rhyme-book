# Sprint 7 Quick Reference Card 🌌

## New Routes
```
/#/dictionary/galaxy     → Rhyme Galaxy Page
/#/dictionary/compare    → Enhanced Word Compare (with Radar)
```

## New Components

### GalaxyView
```jsx
import { GalaxyView } from '../components/discovery';

<GalaxyView 
  words={wordArray}
  onWordClick={(word) => navigate(word.path)}
/>
```

**Props:**
- `words` - Array of word objects
- `onWordClick` - Callback for word selection

**Features:**
- Orbital rhyme cluster animation
- Interactive hover tooltips
- Zoom controls
- Search filtering

---

### VibeRadarChart
```jsx
import { VibeRadarChart } from '../components/discovery';

<VibeRadarChart 
  word1={firstWord}
  word2={secondWord}
/>
```

**Props:**
- `word1` - First word object
- `word2` - Second word object

**Metrics Calculated:**
- Complexity
- Versatility
- Intensity
- Flow
- Creativity
- Impact

---

## Usage Shortcuts

### Navigate to Galaxy
```javascript
navigate('/dictionary/galaxy');
```

### Open Word Compare
```javascript
navigate('/dictionary/compare');
```

### Calculate Vibe Metric
```javascript
import { VIBE_METRICS } from './VibeRadarChart';

const score = VIBE_METRICS.complexity.calculate(word);
```

---

## File Locations

```
Components:
  web/src/components/discovery/GalaxyView.jsx
  web/src/components/discovery/VibeRadarChart.jsx

Pages:
  web/src/pages/RhymeGalaxy.jsx
  web/src/pages/WordCompare.jsx (enhanced)

Styles:
  web/src/components/discovery/*.css
  web/src/pages/RhymeGalaxy.css
```

---

## Key Features

**Galaxy View:**
- ✨ 60fps canvas animations
- 🎨 Color-coded clusters
- 🔍 Real-time search
- 🔭 Zoom controls
- 🖱️ Interactive tooltips

**Vibe Radar:**
- 📊 6-dimension comparison
- 🎯 Dual-word overlay
- 📈 Animated metrics
- 🌈 Gradient visuals
- 💡 Instant calculations

---

## Quick Commands

```bash
# Install dependencies
npm install recharts

# Build project
npm run build

# Test locally
npm run dev
```

---

## Integration Points

**From Word Pages:**
```jsx
<Link to="/dictionary/galaxy">Explore in Galaxy</Link>
```

**From Search Results:**
```jsx
<button onClick={() => navigate('/dictionary/compare')}>
  Compare Words
</button>
```

**In Workspace:**
```jsx
// Add galaxy exploration to workspace
workspace.addAction({
  type: 'explore',
  target: 'galaxy',
  words: selectedWords
});
```

---

## Styling Classes

```css
/* Galaxy */
.galaxy-view
.galaxy-canvas
.galaxy-tooltip

/* Radar */
.vibe-radar-chart
.vibe-radar-header
.metric-bar
```

---

## Performance Tips

1. **Limit Word Count:** Keep clusters under 50 nodes
2. **Use Memoization:** Cache cluster calculations
3. **Optimize Canvas:** Clear with opacity instead of full clear
4. **Lazy Load:** Only render visible elements

---

## Accessibility

**Keyboard:**
- Tab → Navigate controls
- Enter → Activate buttons
- Escape → Clear search

**Screen Readers:**
- Semantic HTML structure
- ARIA labels on buttons
- Alt text on canvas fallback

---

## Common Patterns

**Get Rhyme Clusters:**
```javascript
const clusters = words.reduce((acc, word) => {
  const rhyme = word.rhyme || word.name.slice(-2);
  if (!acc[rhyme]) acc[rhyme] = [];
  acc[rhyme].push(word);
  return acc;
}, {});
```

**Calculate Vibe Score:**
```javascript
const complexity = (word.syllables || 1) * 20 + 
                   (word.t?.length || 0) * 15;
```

---

## Troubleshooting

**Canvas Not Rendering:**
- Check browser compatibility
- Verify ref is attached
- Ensure dimensions are set

**Radar Chart Empty:**
- Verify both words are selected
- Check word object structure
- Ensure recharts is installed

**Performance Issues:**
- Reduce word count
- Limit cluster depth
- Increase throttle delays

---

**Sprint 7 Complete!** ✅
Ready for Sprint 8 - Performance & Accessibility
