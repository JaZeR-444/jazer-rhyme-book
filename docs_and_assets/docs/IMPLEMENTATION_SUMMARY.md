# 🎯 JaZeR Rhyme Book - Project Roadmap

**Last Updated**: January 15, 2026  
**Current Status**: Phase 3 Ready → Dictionary at 4,799 words (Target: ~3,500)

---

## ✅ COMPLETED PHASES

### Phase 1: Core Site Features ✅

_Completed January 10, 2026_

| Feature            | Status | Description                                                   |
| ------------------ | ------ | ------------------------------------------------------------- |
| Music Player       | ✅     | Real HTML5 Audio + Web Audio API with frequency visualization |
| Cross-Domain Links | ✅     | Deep-link entity relationships with navigation                |
| Advanced Search    | ✅     | Multi-domain, tag, and era filtering                          |
| Rhyme Finder       | ✅     | Phonetic matching (perfect/near/assonance)                    |
| Random Discovery   | ✅     | "Surprise Me" button for exploration                          |

### Phase 2: Dictionary Curation (Conservative Pass) ✅

_Completed January 15, 2026_

| Metric         | Result    |
| -------------- | --------- |
| Starting Count | 4,937     |
| Words Removed  | 138       |
| Motifs Added   | 12        |
| Current Count  | **4,799** |

**Categories Removed**: Tech jargon, scientific terms, obscure/archaic, legal, anti-JaZeR energy, geographic proper nouns

**Motifs Added**: starlight, thrum, weighty, airy, asphalt, curve, huddle, bullpen, antenna, hallway, porch, lamp

---

## 🔄 CURRENT PHASE

### Phase 3: High-Value Vibe Consolidation

**Status**: ACTIVE  
**Target**: Reduce from 4,799 → ~3,500 words (remove ~1,300 more)  
**Strategy**: Maximize "Vibe Density" — every click should lead to a creative spark.

> **Vibe Density** = (Creative Utility Words) / (Total Words)

---

#### Batch A: Anti-Vibe Removal (~90 words) ✅ DONE

_Source: `JAZER-WORDS-TO-REMOVE.json`_

Removed words that actively lower the dictionary's vibration:

- Corporate/Legal: `compliance`, `jurisdiction`, `workgroup`
- Tech/Clinical: `bandwidth`, `throughput`, `database`
- Archaic: `thou`, `thee`, `whilst`
- Anti-Brand: `gossip`, `malice`, `useless`

---

#### Batch B: Inflection Cleanup (~1,200 words) ⏳ PENDING

_Source: Pattern matching_

Remove standard grammatical variations to focus on **root concepts**:

- `-ing` endings: `acting`, `breaking`, `calling` (keep unique nouns like `building`, `lightning`)
- `-ed` endings: `accepted`, `climbed`, `talked`
- `-ly` endings: `clearly`, `loudly`, `quickly` (keep unique vibes like `lonely`)

---

#### Batch C: Core Motif Assurance (156 words) ✅ VERIFIED

_Source: `JAZER-MOTIF-VOCABULARY.json`_

All core motif words confirmed present:

- Light/Signal: `prism`, `gradient`, `shimmer`, `neon`, `ember`
- Sound/Rhythm: `thrum`, `pulse`, `hiss`, `swell`, `bass`
- Motion: `drift`, `glide`, `orbit`, `surge`, `coast`
- Night Drive: `dashboard`, `asphalt`, `headlights`, `lane`

---

#### Batch D: Rhyme Anchor Additions ⏳ PENDING

_Source: `JAZER-BATCH-3-TARGETS.json`_

**Multi-Syllabic Power Nouns:**
`hesitation`, `motivation`, `dedication`, `intuition`, `premonition`, `definition`, `reputation`, `situation`

**Atmospheric Adjectives:**
`cinematic`, `automatic`, `panoramic`, `diplomatic`, `enigmatic`

**Verbs of Motion/Change:**
`accelerate`, `resonate`, `gravitate`

---

**Execution Order:**

1. Run inflection cleanup script (Batch B)
2. Generate Batch D word files
3. Re-index manifest

**Config Files:**

- `web/public/dictionary/JAZER-VIBE-CURATION-PLAN.md` — Full strategy
- `web/public/dictionary/JAZER-BATCH-3-TARGETS.json` — Batch D targets

---

## 📋 FUTURE PHASES

### Phase 4: AI Integration

- [ ] "Ask AI" buttons on entity pages
- [ ] Claude/Gemini/Qwen showcase page
- [ ] JSON export for AI training
- [ ] Example prompts library

### Phase 5: Personal Workspace

- [ ] Save entity collections
- [ ] Word banks for projects
- [ ] Notes and annotations
- [ ] Export to PDF/Markdown

### Phase 6: Polish & Performance

- [ ] Visual timeline explorer
- [ ] Social sharing cards
- [ ] Mobile gesture optimization
- [ ] Code splitting for bundle size
- [ ] Service worker for offline access

---

## 📁 KEY FILES

### Dictionary Curation

| File                                                    | Purpose              |
| ------------------------------------------------------- | -------------------- |
| `web/execute-phase2-curation.js`                        | Main curation script |
| `web/public/dictionary/JAZER-MOTIF-VOCABULARY.json`     | Protected words      |
| `web/public/dictionary/JAZER-WORDS-TO-REMOVE.json`      | Removal targets      |
| `web/public/dictionary/JAZER-BATCH-3-TARGETS.json`      | Phase 3 config       |
| `web/public/dictionary/MASTER-DICTIONARY-MANIFEST.json` | Word index           |

### Site Features

| File                                  | Purpose             |
| ------------------------------------- | ------------------- |
| `web/src/components/StudioPlayer.jsx` | Music player        |
| `web/src/lib/rhymeFinder.js`          | Phonetic algorithms |
| `web/src/pages/EntityDetail.jsx`      | Cross-domain links  |
| `web/src/pages/Search.jsx`            | Advanced filters    |

---

## 🚀 QUICK START COMMANDS

```bash
# Start development server
cd web && npm run dev

# Run dictionary curation (dry-run first!)
cd web && node execute-phase2-curation.js --dry-run
cd web && node execute-phase2-curation.js

# Validate and build
npm run validate
npm run build
```

---

## 📊 SUCCESS METRICS

| Area            | Before | After  | Target   |
| --------------- | ------ | ------ | -------- |
| Dictionary Size | 4,937  | 4,799  | ~3,500   |
| Navigation UX   | 3/5    | 5/5    | ✅       |
| Discoverability | 3/5    | 5/5    | ✅       |
| Search Power    | 2/5    | 5/5    | ✅       |
| Bundle Size     | 2.1 MB | 3.1 MB | Optimize |

---

## ⚠️ KNOWN ISSUES

- **Rhyme Finder**: Phonetic accuracy limited (CMU dictionary would improve)
- **Bundle Size**: 3.1 MB due to metaphone library (consider code splitting)
- **Dictionary Manifest**: Loads all words upfront (could lazy load)

---

## 🎯 NEXT ACTION

**To continue Phase 3 curation**, update `execute-phase2-curation.js` with:

1. Inflection removal patterns (-ing, -ed, -ly)
2. Lower flow-score threshold
3. Add rhyme anchor words from batch targets

Or ask to generate a Phase 3 script that handles the above automatically.
