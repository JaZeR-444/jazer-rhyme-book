# Phase 1 Quick Reference Card 📋

## 🎨 Glassmorphism

```jsx
// Basic Glass
<Card glass>Content</Card>

// Heavy Glass with Glow
<Card glass glassVariant="heavy" glow>Content</Card>

// Direct HTML
<div className="glass glass--frosted glass--primary">Content</div>
```

**Variants:** `subtle` | `heavy` | `frosted`  
**Colors:** `primary` (purple) | `secondary` (cyan) | `warm` (amber)

---

## 🎬 Page Transitions

```jsx
// App-level
<PageTransition type="fade">
  <Routes>...</Routes>
</PageTransition>

// Page-level HOC
export default withPageTransition(MyPage, 'glitch');
```

**Types:** `fade` | `slide` | `glitch` | `scale`

---

## ✨ Text Scramble

```jsx
// Single element
<TextScramble as="h1" duration={1.2} delay={0.3}>
  Your Heading
</TextScramble>

// Multiple with stagger
<ScrambleReveal stagger={0.1}>
  <span data-scramble>First</span>
  <span data-scramble>Second</span>
</ScrambleReveal>
```

---

## 📡 Scanning Lines

```jsx
<ScanningLines 
  intensity="subtle"    // subtle | medium | high
  speed="slow"          // slow | medium | fast
  color="secondary"     // primary | secondary | warm
  count={2}
/>
```

---

## 💻 Boot Sequence

```jsx
const [loading, setLoading] = useState(true);

{loading && (
  <BootSequence 
    onComplete={() => setLoading(false)}
    skipable={true}
  />
)}
```

---

## 🖼️ Generative Art

```jsx
<GenerativeArt 
  seed="unique-id"
  animated={true}
  width="100%"
  height="100%"
/>
```

---

## 🎯 CSS Variables

```css
/* Glass Effects */
--overlay-glass: hsla(240, 15%, 16%, 0.6);
--border-visible: hsla(0, 0%, 100%, 0.12);

/* Brand Colors */
--accent-primary: hsl(262, 70%, 55%);
--accent-secondary: hsl(180, 100%, 41%);
--accent-neon: hsl(180, 100%, 50%);

/* Animation Durations */
--duration-micro: 150ms;
--duration-short: 300ms;
--duration-medium: 500ms;
```

---

## ⚡ Performance Tips

- Use `animated={false}` on static backgrounds
- Limit ScanningLines to 2-3 instances
- Prefer `fade` transitions on mobile
- Test with reduced motion enabled

---

## 🔧 Import Paths

```jsx
// Motion Components
import { PageTransition } from './components/motion/PageTransition';
import { ScanningLines } from './components/motion/ScanningLines';
import { TextScramble } from './components/motion/TextScramble';
import { BootSequence } from './components/motion/BootSequence';

// UI Components
import { Card, GenerativeArt } from './components/ui';
```

---

## 📦 Files Added

```
components/motion/
├── PageTransition.jsx/css
├── ScanningLines.jsx/css
├── TextScramble.jsx
└── BootSequence.jsx/css

styles/
└── glassmorphism.css
```

---

## ✅ Checklist for New Pages

- [ ] Add GenerativeArt background
- [ ] Use TextScramble on main heading
- [ ] Apply glass effects to cards
- [ ] Test with reduced motion
- [ ] Verify mobile responsiveness

---

**Version:** 2.1.0 | **Phase:** 1 Complete | **Date:** 2026-01-20
