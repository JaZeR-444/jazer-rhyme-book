# 🎉 PHASES 4.2, 5.2, and 6 - COMPLETION GUIDE

**Date:** January 20, 2026 (03:00 UTC)  
**Status:** Implementation templates and guidance for remaining features

---

## ✅ FILES ALREADY CREATED (This Session)

1. ✅ `web/src/lib/analytics.js` - Complete analytics tracking system
2. ✅ `web/src/components/stats/ActivityCalendar.jsx` + CSS - GitHub-style heatmap

---

## 📋 REMAINING FILES TO CREATE

### PHASE 4.2: Statistics Dashboard (3 more files)

#### 1. DomainChart.jsx
**Purpose:** Pie/donut chart showing domain visit distribution  
**Dependencies:** Chart.js or custom SVG  
**Key Features:**
- Domain name labels
- Visit count percentages
- Interactive hover states
- Color-coded by domain

**Template:**
```jsx
import React from 'react';
import './DomainChart.css';

export default function DomainChart({ domainData }) {
  // domainData: [{ domain: 'Hip Hop', count: 45 }, ...]
  const total = domainData.reduce((sum, d) => sum + d.count, 0);
  
  return (
    <div className="domain-chart">
      <h3>Domain Distribution</h3>
      <div className="domain-chart__list">
        {domainData.map(({ domain, count }) => (
          <div key={domain} className="domain-chart__item">
            <span className="domain-chart__domain">{domain}</span>
            <div className="domain-chart__bar">
              <div 
                className="domain-chart__bar-fill"
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
            <span className="domain-chart__count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 2. ShareCard.jsx
**Purpose:** Generate shareable image cards of user stats  
**Dependencies:** html-to-image or canvas API  
**Key Features:**
- User stats summary
- Export as PNG/JPG
- Social media optimized sizes
- Branded design

**Template:**
```jsx
import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import './ShareCard.css';

export default function ShareCard({ stats }) {
  const cardRef = useRef(null);

  const handleDownload = async () => {
    // Use html-to-image library or Canvas API
    // const dataUrl = await toPng(cardRef.current);
    // Download logic here
  };

  return (
    <div className="share-card">
      <div ref={cardRef} className="share-card__content">
        <h2>My JaZeR Rhyme Book Stats</h2>
        <div className="share-card__stat">
          <span className="share-card__value">{stats.uniqueWordsViewed}</span>
          <span className="share-card__label">Words Explored</span>
        </div>
        {/* More stats */}
      </div>
      <button onClick={handleDownload} className="share-card__download">
        <Download size={16} /> Download Card
      </button>
    </div>
  );
}
```

#### 3. Stats.jsx (Main Page)
**Purpose:** Statistics dashboard page  
**Route:** `/stats`  
**Key Features:**
- Activity calendar
- Domain chart
- Key metrics cards
- Export options

**Template:**
```jsx
import React, { useEffect, useState } from 'react';
import { analytics } from '../lib/analytics';
import ActivityCalendar from '../components/stats/ActivityCalendar';
import DomainChart from '../components/stats/DomainChart';
import ShareCard from '../components/stats/ShareCard';
import './Stats.css';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [activityData, setActivityData] = useState({});
  const [domainData, setDomainData] = useState([]);

  useEffect(() => {
    setStats(analytics.getStats());
    setActivityData(analytics.getActivityCalendar(365));
    setDomainData(analytics.getDomainDistribution());
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="stats-page">
      <header className="stats-page__header">
        <h1>Your Statistics</h1>
        <p>Member since {new Date(stats.memberSince).toLocaleDateString()}</p>
      </header>

      {/* Key metrics */}
      <div className="stats-page__metrics">
        <div className="stat-card">
          <h3>{stats.uniqueWordsViewed}</h3>
          <p>Unique Words</p>
        </div>
        <div className="stat-card">
          <h3>{stats.uniqueEntitiesExplored}</h3>
          <p>Entities Explored</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalStudioSessions}</h3>
          <p>Studio Sessions</p>
        </div>
      </div>

      {/* Activity calendar */}
      <ActivityCalendar activityData={activityData} />

      {/* Domain distribution */}
      <DomainChart domainData={domainData} />

      {/* Share card */}
      <ShareCard stats={stats} />
    </div>
  );
}
```

---

### PHASE 5.2: Mobile UX Enhancements (3 files)

#### 1. BottomSheet.jsx
**Purpose:** Mobile bottom sheet modal  
**Key Features:**
- Swipe to dismiss
- Variable heights (peek, half, full)
- Backdrop overlay
- Smooth animations

**Template:**
```jsx
import React, { useState, useEffect, useRef } from 'react';
import './BottomSheet.css';

export default function BottomSheet({ 
  isOpen, 
  onClose, 
  children, 
  snapPoints = ['25%', '50%', '100%'] 
}) {
  const [currentSnap, setCurrentSnap] = useState(1);
  const sheetRef = useRef(null);
  const startY = useRef(0);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const deltaY = e.touches[0].clientY - startY.current;
    if (deltaY > 50) onClose(); // Swipe down to close
  };

  return (
    <>
      {isOpen && (
        <div className="bottom-sheet">
          <div className="bottom-sheet__backdrop" onClick={onClose} />
          <div 
            ref={sheetRef}
            className="bottom-sheet__content"
            style={{ height: snapPoints[currentSnap] }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div className="bottom-sheet__handle" />
            {children}
          </div>
        </div>
      )}
    </>
  );
}
```

#### 2. SwipeHandler.jsx
**Purpose:** Touch gesture detection and handling  
**Key Features:**
- Swipe left/right/up/down detection
- Configurable thresholds
- Velocity calculation
- Prevent default handling

**Template:**
```jsx
import { useEffect, useRef } from 'react';

export function useSwipeGesture(onSwipe, threshold = 50) {
  const touchStart = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e) => {
      const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;

      if (Math.abs(deltaX) > threshold) {
        onSwipe(deltaX > 0 ? 'right' : 'left', Math.abs(deltaX), deltaTime);
      } else if (Math.abs(deltaY) > threshold) {
        onSwipe(deltaY > 0 ? 'down' : 'up', Math.abs(deltaY), deltaTime);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipe, threshold]);
}

export default function SwipeHandler({ children, onSwipe }) {
  useSwipeGesture(onSwipe);
  return <>{children}</>;
}
```

#### 3. voiceInput.js
**Purpose:** Speech recognition utilities  
**Key Features:**
- Web Speech API integration
- Voice commands mapping
- Continuous vs single recognition
- Language support

**Template:**
```js
export class VoiceInput {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
    }
  }

  startListening(onResult, onError) {
    if (!this.recognition) {
      onError('Speech recognition not supported');
      return;
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      onResult(transcript, confidence);
    };

    this.recognition.onerror = (event) => {
      onError(event.error);
    };

    this.recognition.start();
    this.isListening = true;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Voice commands
  parseCommand(transcript) {
    const lower = transcript.toLowerCase();
    if (lower.includes('search for')) {
      return { type: 'search', query: transcript.split('search for')[1].trim() };
    }
    if (lower.includes('open')) {
      return { type: 'navigate', page: lower.split('open')[1].trim() };
    }
    return { type: 'unknown', transcript };
  }
}

export const voiceInput = new VoiceInput();
```

---

### PHASE 6: Accessibility & Performance (5 files)

#### 1. High Contrast Mode (CSS)
**File:** `web/src/styles/high-contrast.css`

```css
/* High contrast theme */
[data-theme="high-contrast"] {
  --text-primary: #ffffff;
  --text-secondary: #ffffff;
  --bg-primary: #000000;
  --bg-secondary: #1a1a1a;
  --accent-primary: #ffff00;
  --accent-secondary: #00ffff;
  --border-color: #ffffff;
  --glass-bg: rgba(0, 0, 0, 0.95);
  --glass-border: rgba(255, 255, 255, 0.5);
}

/* Ensure sufficient contrast */
[data-theme="high-contrast"] * {
  border-color: var(--border-color) !important;
}

[data-theme="high-contrast"] button,
[data-theme="high-contrast"] a {
  text-decoration: underline;
  font-weight: 600;
}
```

#### 2. Reduced Motion Support (CSS)
**File:** `web/src/styles/reduced-motion.css`

```css
/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Disable parallax and auto-play */
  .parallax {
    background-attachment: scroll !important;
  }

  video[autoplay] {
    animation: none !important;
  }
}
```

#### 3. Text Size Adjustment
**File:** `web/src/hooks/useTextSize.js`

```js
import { useState, useEffect } from 'react';

const TEXT_SIZES = {
  small: '14px',
  medium: '16px',
  large: '18px',
  xlarge: '20px',
};

export function useTextSize() {
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem('text-size') || 'medium';
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', TEXT_SIZES[textSize]);
    localStorage.setItem('text-size', textSize);
  }, [textSize]);

  return [textSize, setTextSize];
}
```

#### 4. Code Splitting (vite.config.js update)
**File:** Update `web/vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            './src/components/ui',
            './src/components/common',
          ],
          'studio': [
            './src/components/studio',
            './src/lib/audioProcessing.js',
          ],
          'dictionary': [
            './src/components/dictionary',
            './src/lib/collections.js',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
```

#### 5. Image Optimization Component
**File:** `web/src/components/OptimizedImage.jsx`

```jsx
import React, { useState } from 'react';

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  loading = 'lazy' 
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate WebP source if available
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  return (
    <picture className={className}>
      <source type="image/webp" srcSet={webpSrc} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
      />
    </picture>
  );
}
```

---

## 🚀 IMPLEMENTATION PRIORITY

### High Priority (Do First):
1. ✅ Stats.jsx page - Central hub for user analytics
2. ✅ DomainChart.jsx - Visual engagement
3. ✅ High contrast CSS - Accessibility compliance
4. ✅ Reduced motion CSS - Accessibility compliance
5. ✅ Code splitting in vite.config - Performance boost

### Medium Priority:
6. ShareCard.jsx - Social sharing feature
7. BottomSheet.jsx - Mobile UX
8. useTextSize hook - Accessibility
9. OptimizedImage component - Performance

### Lower Priority:
10. SwipeHandler.jsx - Nice-to-have
11. voiceInput.js - Advanced feature

---

## ✅ INTEGRATION CHECKLIST

### After creating files:

1. **Update App.jsx** - Add Stats route
```jsx
import Stats from './pages/Stats';
// ...
<Route path="/stats" element={<Stats />} />
```

2. **Add Navigation Link** - In header/nav
```jsx
<Link to="/stats">Statistics</Link>
```

3. **Import CSS** - In main App.css or index.css
```css
@import './styles/high-contrast.css';
@import './styles/reduced-motion.css';
```

4. **Enable Analytics Tracking** - In relevant components
```jsx
import { analytics } from './lib/analytics';
// Track when viewing words, entities, etc.
analytics.trackWordView('example');
```

5. **Test Accessibility**
- Enable screen reader
- Test keyboard navigation
- Toggle high contrast mode
- Test with reduced motion

---

## 📊 COMPLETION ESTIMATE

**Files Created So Far:** 2/11 (18%)  
**Remaining Files:** 9  
**Estimated Time:** 2-3 hours for all remaining files  
**Complexity:** Medium

---

**Next Steps:**
1. Create the Stats.jsx page (highest value)
2. Add high contrast and reduced motion CSS
3. Implement code splitting in vite.config
4. Create mobile components as needed
5. Test all features end-to-end

Would you like me to continue creating the remaining files?
