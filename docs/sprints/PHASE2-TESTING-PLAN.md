# Phase 2 Testing & Polish Plan 🧪

**Date:** 2026-01-20  
**Server:** http://localhost:5174/  
**Status:** In Progress

---

## 🎯 Testing Objectives

1. ✅ Verify all Sprint 1 components work correctly
2. ✅ Test Sprint 2 components in isolation
3. ✅ Performance benchmarking
4. ✅ Mobile responsiveness
5. ✅ Accessibility compliance
6. ✅ Polish and fix issues

---

## 📋 Testing Checklist

### Sprint 1 Components

#### ✅ MagneticButton
**Test Page:** Home (/)

**Tests:**
- [ ] Button follows cursor on hover
- [ ] Smooth GSAP animation (60fps)
- [ ] Elastic snap-back when cursor leaves
- [ ] Glow effect appears on hover
- [ ] Disabled on mobile (scale tap instead)
- [ ] Keyboard focus works (Tab key)
- [ ] Screen reader announces button
- [ ] Reduced motion respected

**How to Test:**
1. Navigate to http://localhost:5174/
2. Hover over "Explore Domains" button
3. Move cursor in circles - button should follow
4. Move cursor away - should snap back
5. Test on mobile device/emulator
6. Test with keyboard (Tab + Enter)

**Expected Behavior:**
- Desktop: Magnetic attraction within button bounds
- Mobile: No magnetic effect, scale on tap
- Focus: Visible outline when tabbed

---

#### ✅ HoverCard (DomainGrid)
**Test Page:** Domains (/domains)

**Tests:**
- [ ] Overlay appears on hover
- [ ] Shows category, entity count, type
- [ ] Scan line animation visible
- [ ] Content fades in with stagger
- [ ] Position-aware (shows below card)
- [ ] Hidden on mobile/touch devices
- [ ] No overlay on quick mouse-through
- [ ] Smooth fade out

**How to Test:**
1. Navigate to http://localhost:5174/#/domains
2. Hover over any domain card
3. Wait ~300ms - overlay should appear
4. Check scan line animation
5. Move mouse away - should fade out
6. Test on mobile - overlay should not appear

**Expected Behavior:**
- Desktop: Rich overlay with data
- Mobile: No overlay (hidden)
- Animation: Smooth 60fps transitions

---

#### ✅ EntityHoverCard
**Test Page:** Any domain detail page (/domains/music)

**Tests:**
- [ ] Entity cards show hover overlay
- [ ] Displays: domain, category, tags, vibe
- [ ] Pre-configured variant works
- [ ] Footer message appears
- [ ] Touch devices hide overlay

**How to Test:**
1. Navigate to http://localhost:5174/#/domains/music
2. Hover over any entity card
3. Verify all fields display correctly
4. Check "Click to explore" footer

---

#### ✅ FeedbackProvider (Global)
**Test Page:** Any page

**Tests:**
- [ ] Toast appears on pin action
- [ ] Toast appears on like action
- [ ] Success messages (green)
- [ ] Info messages (cyan)
- [ ] Auto-dismiss after 3 seconds
- [ ] Multiple toasts stack properly
- [ ] Mobile positioning correct
- [ ] Screen reader announces messages

**How to Test:**
1. Navigate to any entity page
2. Click "Pin" button on entity card
3. Toast should appear: "Added [name] to workspace!"
4. Click "Like" button
5. Toast should appear: "Added to favorites"
6. Wait 3 seconds - toasts should disappear

**Expected Behavior:**
- Toast appears at top center
- Green checkmark for success
- Cyan info icon for info
- Smooth fade in/out animations

---

### Sprint 2 Components (Standalone)

#### ✅ NaturalLanguageParser

**Tests:**
- [ ] Parse "find rhymes for fire"
- [ ] Parse "go to domains"
- [ ] Parse "what is flow"
- [ ] Parse "clear workspace"
- [ ] Unknown input defaults to search
- [ ] Suggestions appear for partial input
- [ ] Intent-to-action conversion works

**How to Test (Browser Console):**
```javascript
// Test in browser console
import { nlParser } from './components/command/NaturalLanguageParser.js';

// Test parsing
nlParser.parse("find rhymes for fire");
// Should return: { intent: 'search_rhyme', data: { query: 'fire' }, matched: true }

nlParser.parse("go to domains");
// Should return: { intent: 'navigate', data: { destination: 'domains' }, matched: true }

// Test suggestions
nlParser.getSuggestions("find");
// Should return array of suggestions
```

---

#### ✅ ActionHistory

**Tests:**
- [ ] History loads from localStorage
- [ ] Adding items works
- [ ] Deduplication works
- [ ] Timestamps format correctly
- [ ] Clear history works
- [ ] Max 20 items enforced
- [ ] Click to re-execute works

**How to Test (Create Test Page):**
Create `web/test-history.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Action History Test</title>
  <script type="module">
    // Manual test of ActionHistory
    import { useActionHistory } from './src/components/command/ActionHistory.jsx';
    
    // Test adding items
    const { addToHistory, history } = useActionHistory();
    
    addToHistory({ type: 'search', query: 'fire' });
    addToHistory({ type: 'navigate', path: '/domains' });
    
    console.log('History:', history);
  </script>
</head>
<body>
  <h1>Check Console</h1>
</body>
</html>
```

---

#### ✅ QuickPreview

**Tests:**
- [ ] Word preview shows correct fields
- [ ] Entity preview shows correct fields
- [ ] Domain preview shows correct fields
- [ ] Icons display correctly
- [ ] Scan line animates
- [ ] Keyboard hint visible
- [ ] Truncation works for long text

**Manual Test:**
```jsx
// Add to any test page
import { QuickPreview } from './components/command/QuickPreview';

<QuickPreview 
  item={{
    type: 'word',
    word: 'fire',
    syllables: 1,
    phonetic: '/faɪər/',
    rhymeFamily: '-ire',
    definition: 'Combustion or burning...'
  }}
  visible={true}
/>
```

---

## 🚀 Performance Testing

### Metrics to Check

| Component | Target FPS | Load Time | Memory |
|-----------|------------|-----------|--------|
| MagneticButton | 60fps | <10ms | <1MB |
| HoverCard | 60fps | <20ms | <2MB |
| FeedbackProvider | 60fps | <5ms | <1MB |
| NL Parser | N/A | <1ms | <0.5MB |
| ActionHistory | N/A | <5ms | <0.1MB |
| QuickPreview | 60fps | <10ms | <1MB |

### How to Measure:

**Chrome DevTools:**
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Interact with components
5. Stop recording
6. Check frame rate (should be 60fps)

**Memory:**
1. Open DevTools Memory tab
2. Take heap snapshot
3. Interact with components
4. Take another snapshot
5. Compare - growth should be minimal

---

## ♿ Accessibility Testing

### Tools to Use:
- Chrome Lighthouse
- axe DevTools
- NVDA/JAWS screen reader
- Keyboard only navigation

### Tests:

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter activates buttons
- [ ] Escape closes modals/overlays
- [ ] Arrow keys navigate lists
- [ ] Focus visible at all times

#### Screen Reader
- [ ] Buttons announce purpose
- [ ] Toast messages announced
- [ ] Card content readable
- [ ] No hidden content issues

#### Color Contrast
- [ ] Text meets WCAG AAA (7:1)
- [ ] Interactive elements visible
- [ ] Focus indicators clear
- [ ] Error states obvious

**Run Lighthouse:**
```bash
# In browser DevTools
1. Open Lighthouse tab
2. Select "Accessibility" only
3. Generate report
4. Target: 100 score
```

---

## 📱 Mobile Testing

### Devices to Test:
- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad)

### Tests:

#### Touch Interactions
- [ ] Magnetic buttons don't activate
- [ ] Tap scales buttons correctly
- [ ] Hover cards hidden
- [ ] Toasts position correctly
- [ ] Swipe gestures work

#### Responsive Layout
- [ ] Components scale properly
- [ ] Text readable at all sizes
- [ ] No horizontal scroll
- [ ] Touch targets 44x44px minimum

#### Performance
- [ ] 60fps on scrolling
- [ ] No jank on interactions
- [ ] Fast page loads (<3s)

**Test with Chrome DevTools:**
1. Open DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device (iPhone 14 Pro, etc.)
4. Test all components

---

## 🐛 Known Issues to Fix

### Priority 1 (Critical)
- [ ] None currently identified

### Priority 2 (Important)
- [ ] Verify import paths work in production build
- [ ] Test localStorage limits (ActionHistory)
- [ ] Check GSAP licensing for production

### Priority 3 (Nice to Have)
- [ ] Add loading states for async operations
- [ ] Improve error handling
- [ ] Add analytics tracking

---

## 🎨 Polish Tasks

### Visual Polish
- [ ] Verify all animations smooth
- [ ] Check color consistency
- [ ] Ensure spacing consistent
- [ ] Verify typography hierarchy
- [ ] Test dark mode only (current theme)

### Code Polish
- [ ] Add JSDoc comments
- [ ] Remove console.logs
- [ ] Optimize bundle size
- [ ] Add error boundaries
- [ ] Improve TypeScript types (if using)

### Documentation Polish
- [ ] Update README with new features
- [ ] Create video demos
- [ ] Add component screenshots
- [ ] Write migration guide

---

## 📊 Testing Progress

### Sprint 1 Components
- MagneticButton: ⏳ 0/8 tests
- HoverCard (Domain): ⏳ 0/8 tests
- EntityHoverCard: ⏳ 0/5 tests
- FeedbackProvider: ⏳ 0/8 tests

### Sprint 2 Components
- NaturalLanguageParser: ⏳ 0/7 tests
- ActionHistory: ⏳ 0/7 tests
- QuickPreview: ⏳ 0/7 tests

### Cross-Cutting
- Performance: ⏳ 0/6 components
- Accessibility: ⏳ 0/4 areas
- Mobile: ⏳ 0/3 devices

**Total Progress:** 0/57 tests (0%)

---

## ✅ Completion Criteria

Phase 2 is complete when:
- ✅ All 57 tests pass
- ✅ 60fps maintained on all animations
- ✅ Lighthouse score 90+ (Accessibility)
- ✅ Works on mobile (iOS & Android)
- ✅ Zero critical bugs
- ✅ Documentation updated

---

## 🚀 Next Steps

1. **Start Testing** (NOW)
   - Open http://localhost:5174/
   - Follow test checklist
   - Document issues

2. **Fix Issues**
   - Priority 1 first
   - Then Priority 2
   - Polish last

3. **Final Verification**
   - Re-test all components
   - Run Lighthouse
   - Test on mobile

4. **Document Results**
   - Create test report
   - Update README
   - Create demo video

---

**Testing Started:** 2026-01-20  
**Server Running:** http://localhost:5174/  
**Status:** Ready to test! 🧪
