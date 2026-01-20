# JaZeR Dictionary Vibe Curation Plan

## Phase 2: Conservative Alignment (~3,500 target)

**Created:** 2026-01-14
**Starting Count:** 4,937 words
**Target Count:** ~3,500 words (trim ~1,400, add ~100 motifs)

---

## OBJECTIVE

Transform the dictionary from general-purpose vocabulary into a **JaZeR-aligned creative songwriting resource** by:

1. Removing words that conflict with JaZeR brand energy
2. Removing words with no songwriting utility
3. Adding all missing JaZeR motif words from `ABOUT_JAZER.md`

---

## REMOVAL CATEGORIES (Conservative)

### Category A: Brand Names & Products (Remove All)
Words that are trademarked or corporate:
- adobe, amazon, microsoft, google, facebook, intel, nvidia
- honda, toyota, volkswagen (keep as cultural reference? REVIEW)
- walmart, target, costco
- iphone, android, windows

### Category B: Geographic Proper Nouns (Remove Most)
Countries, cities, regions with no lyrical value:
- afghanistan, azerbaijan, bangladesh, cambodia...
- Keep: chicago (JaZeR's team city), austin (home), texas

### Category C: Technical/Scientific Jargon (Remove)
Words too clinical for songwriting:
- algorithm, bandwidth, firmware, protocol, syntax
- chromosome, nucleotide, mitochondria
- coefficient, logarithm, polynomial

### Category D: Academic/Bureaucratic (Remove)
Wrong energy for JaZeR vibe:
- administrative, jurisdiction, compliance, procurement
- bibliography, appendix, dissertation
- aforementioned, hereinafter, pursuant

### Category E: Obscure/Archaic (Remove)
No audience resonance:
- Words with fewer than 100 common uses
- Archaic terms not used in modern speech
- Highly specialized terminology

### Category F: Random Person Names (Remove)
First names with no creative utility:
- aaron, barbara, charles, david, edward...
- Keep: iconic names that have cultural weight

---

## WORDS TO PROTECT (Never Remove)

### JaZeR Core Motifs (from ABOUT_JAZER.md)
```
beam, light, color, signal, transmission, static, cosmic, home,
doorway, night, drive, highway, dashboard, glow, pressure, power,
scoreboard, momentum, focus, future, city, neon, sky, builder,
climb, pulse, lift, landing, calm, storm
```

### Sensory Palette
```
glow, shimmer, prism, skyline, horizon, halo, ember, flare,
gradient, starlight, thrum, hum, echo, ripple, click, hiss,
swell, drop, rush, smooth, crisp, velvet, glassy, warm, soft,
bright, clean, weighty, airy, grounded, glowing, rise, drift,
glide, surge, loop, coast, land, orbit, flow, arc, launch
```

### Imagery Anchors
```
road, lane, headlights, mirror, window, engine, curve, asphalt,
mic, booth, console, keys, pads, fader, cable, screen, session,
clock, huddle, whistle, baseline, overtime, season, jersey, arena,
thunder, lightning, rain, fog, clouds, wind, flood,
frequency, channel, code, circuit, waveform, antenna,
room, table, lamp, hallway, porch, frame, floor
```

### Contrast Pairing Words (Essential for JaZeR "turn")
```
static, signal, black, cloud, beam, noise, clarity, pressure,
power, storm, calm, shadow, glow, doubt, drive, cold, warm,
rush, focus, lost, found, closed, open, fade, flare
```

---

## WORDS TO ADD (Missing Motifs)

Based on ABOUT_JAZER.md imagery system, add these if missing:

### Light/Signal
- starlight, gradient, ember, prism, halo, spark, ray

### Sound
- thrum, hiss, swell, boom

### Texture
- velvet, glassy, weighty, airy

### Motion
- drift, glide, coast, orbit, arc

### Road/Night Drive
- headlights, asphalt, curve

### Sports/Game
- huddle, baseline, bullpen, overtime

### Weather
- fog, flood, static

### Tech/Transmission
- frequency, channel, waveform, antenna, circuit

### Home
- hallway, porch, frame, lamp

---

## IMPLEMENTATION STEPS

### Step 1: Generate Anti-JaZeR Word List
- Scan all 3 words
- Flag words matching removal categories
- Estimate ~1,400-1,500 removals

### Step 2: Review Protected Words
- Ensure no protected words are in removal list
- Cross-reference with JaZeR motif lists

### Step 3: Identify Missing Motifs
- Compare ABOUT_JAZER.md imagery to current dictionary
- Generate list of words to add

### Step 4: Create Word Folders for Additions
- Generate `word.md` files for each new motif word
- Use JaZeR-appropriate definitions

### Step 5: Execute Removals
- Delete word folders
- Update manifest

### Step 6: Execute Additions
- Create new word folders
- Update manifest

### Step 7: Validate
- Verify counts
- Confirm all paths exist
- Check protected words present

---

## SUCCESS CRITERIA

- [ ] Total word count: 3,400-3,600
- [ ] All JaZeR motif words present
- [ ] No brand names remaining
- [ ] No geographic proper nouns (except Austin/Chicago/Texas)
- [ ] No technical jargon
- [ ] No bureaucratic language
- [ ] Manifest validates cleanly