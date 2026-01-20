# ⚡ Quick Test Reference Card

**Server:** http://localhost:5174/  
**Test Suite:** web/test-suite.html  
**Time:** 25 minutes total

---

## 🎯 5-Minute Quick Test

### 1. MagneticButton (1 min)
```
URL: http://localhost:5174/
Action: Hover "Explore Domains" button
✅ Button follows cursor smoothly
✅ Snaps back when mouse leaves
```

### 2. HoverCard (1 min)
```
URL: http://localhost:5174/#/domains
Action: Hover any domain card
✅ Overlay appears with data
✅ Scan line animates
```

### 3. EntityCard (2 min)
```
URL: http://localhost:5174/#/domains/music
Action: Hover entity, click pin
✅ Entity overlay appears
✅ Toast notification shows
✅ Auto-dismisses in 3s
```

### 4. Performance (1 min)
```
Tool: Chrome DevTools
Action: Record performance
✅ 60fps maintained
```

---

## 📋 Full Test (20 minutes)

### Sprint 1 Tests (12 min)
- [ ] MagneticButton desktop (3 min)
- [ ] MagneticButton mobile (2 min)
- [ ] HoverCard desktop (3 min)
- [ ] EntityHoverCard (2 min)
- [ ] FeedbackProvider (2 min)

### Sprint 2 Tests (5 min)
- [ ] NL Parser console (2 min)
- [ ] ActionHistory (2 min)
- [ ] QuickPreview (1 min)

### Cross-Cutting (3 min)
- [ ] Performance check (1 min)
- [ ] Accessibility (1 min)
- [ ] Mobile responsive (1 min)

---

## ✅ Pass Criteria

### Must Pass:
- Components render
- No console errors
- 60fps on desktop
- Mobile responsive

### Should Pass:
- Animations smooth
- Keyboard works
- Touch optimized
- Screen reader compatible

---

## 🐛 Issue Template

```
Component: [name]
Issue: [description]
Steps: 
1. 
2. 
3. 
Expected: 
Actual: 
Priority: Critical/Important/Minor
Browser: 
OS: 
```

---

## 📊 Results Template

```
Sprint 1: ___/5 passed
Sprint 2: ___/3 passed
Performance: Pass/Fail
Accessibility: Pass/Fail
Mobile: Pass/Fail

Overall: ___/12 (___%)
Status: Ready/Needs Work
```

---

**Start testing now!** 🚀

Open http://localhost:5174/ and work through the checklist above.
