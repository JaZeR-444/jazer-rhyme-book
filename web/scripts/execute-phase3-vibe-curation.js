/**
 * JaZeR Dictionary Phase 3 Curation Script
 * 
 * Goal: Reduce from 4,799 to ~3,500 words via "Vibe Density" optimization
 * 
 * Batch A: Anti-Vibe Removal (DONE in Phase 2)
 * Batch B: Inflection Cleanup (~1,200 words) - THIS SCRIPT
 * Batch C: Core Motif Assurance (DONE - verified)
 * Batch D: Rhyme Anchor Additions - THIS SCRIPT
 * 
 * Usage:
 *   node execute-phase3-vibe-curation.js --dry-run   # Preview changes
 *   node execute-phase3-vibe-curation.js             # Execute changes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRY_RUN = process.argv.includes('--dry-run');
const DICTIONARY_PATH = path.join(__dirname, 'public', 'dictionary');
const MANIFEST_PATH = path.join(DICTIONARY_PATH, 'MASTER-DICTIONARY-MANIFEST.json');
const REMOVE_LIST_PATH = path.join(DICTIONARY_PATH, 'JAZER-WORDS-TO-REMOVE.json');

// ============================================================
// PROTECTED WORDS - Never remove these even if they match patterns
// ============================================================

const PROTECTED_INFLECTIONS = new Set([
  // Unique nouns (not verb forms)
  'building', 'lightning', 'morning', 'evening', 'ceiling', 'feeling',
  'meaning', 'beginning', 'ending', 'warning', 'opening', 'closing',
  'blessing', 'wedding', 'setting', 'meeting', 'greeting', 'reading',
  'writing', 'living', 'giving', 'loving', 'moving', 'being', 'thing',
  'nothing', 'something', 'everything', 'anything', 'king', 'ring', 'sing',
  'spring', 'string', 'swing', 'wing', 'bring', 'bling', 'cling', 'fling',
  'sling', 'sting', 'wring',
  
  // Unique vibes (-ly words to keep)
  'lonely', 'lovely', 'holy', 'only', 'early', 'nearly', 'clearly',
  'deadly', 'friendly', 'heavenly', 'earthly', 'ghostly', 'costly',
  'worldly', 'godly', 'ungodly', 'saintly', 'beastly', 'princely',
  'kingly', 'queenly', 'manly', 'womanly', 'fatherly', 'motherly',
  'brotherly', 'sisterly', 'cowardly', 'leisurely', 'scholarly',
  'masterly', 'orderly', 'timely', 'untimely', 'seemly', 'unsightly',
  'ghastly', 'stately', 'comely', 'homely', 'shapely', 'lively',
  'weekly', 'daily', 'nightly', 'monthly', 'yearly', 'hourly',
  'bodily', 'costly', 'elderly', 'jolly', 'melancholy', 'ugly',
  'silly', 'chilly', 'hilly', 'frilly', 'sully', 'bully', 'gully',
  'fully', 'dully', 'jelly', 'belly', 'smelly', 'ally', 'rally',
  'tally', 'valley', 'alley', 'trolley', 'volley', 'parsley',
  
  // Unique past forms (not just verb+ed)
  'blessed', 'beloved', 'wicked', 'sacred', 'naked', 'crooked',
  'rugged', 'ragged', 'jagged', 'alleged', 'aged', 'dogged',
  'learned', 'cursed', 'marked', 'striped', 'winged', 'horned',
  'skilled', 'blessed', 'beloved', 'cherished', 'devoted', 'mixed',
  'fixed', 'combined', 'united', 'divided', 'retired', 'tired',
  
  // JaZeR protected words
  'grounded', 'glowing', 'landing', 'climbing', 'shining', 'grinding',
  'flowing', 'rising', 'falling', 'flying', 'driving', 'thriving',
  'surviving', 'striving', 'arriving', 'diving', 'moving', 'proving',
  'improving', 'grooving', 'soothing', 'breathing', 'seething',
  'calling', 'balling', 'falling', 'stalling', 'crawling', 'mauling',
  'hauling', 'rolling', 'trolling', 'controlling', 'patrolling', 
  'scrolling', 'consoling', 'strolling',
  
  // Compound protection
  'everything', 'something', 'nothing', 'anything', 'understanding'
]);

// ============================================================
// BATCH B: INFLECTION PATTERNS
// ============================================================

function hasBaseWord(word, allWords) {
  const w = word.toLowerCase();
  
  // Check -ing → base
  if (w.endsWith('ing') && w.length > 4) {
    const base = w.slice(0, -3);
    const baseIng = w.slice(0, -3) + 'e'; // running → run, driving → drive
    if (allWords.has(base) || allWords.has(baseIng)) return { hasBase: true, base: base };
  }
  
  // Check -ed → base
  if (w.endsWith('ed') && w.length > 3) {
    const base = w.slice(0, -2);
    const baseD = w.slice(0, -1); // saved → save
    const baseEd = w.slice(0, -3); // stopped → stop (double consonant)
    if (allWords.has(base) || allWords.has(baseD) || allWords.has(baseEd)) return { hasBase: true, base: base };
  }
  
  // Check -ly → base
  if (w.endsWith('ly') && w.length > 3) {
    const base = w.slice(0, -2);
    const baseIly = w.slice(0, -3) + 'y'; // happily → happy
    if (allWords.has(base) || allWords.has(baseIly)) return { hasBase: true, base: base };
  }
  
  return { hasBase: false };
}

function shouldRemoveInflection(word, allWordsSet) {
  const w = word.toLowerCase();
  
  // Protected words are never removed
  if (PROTECTED_INFLECTIONS.has(w)) {
    return { remove: false, reason: 'Protected inflection' };
  }
  
  // AGGRESSIVE: Remove ALL words ending in -ing, -ed, -ly (except protected)
  if (w.endsWith('ing') && w.length > 4) {
    return { remove: true, reason: 'Gerund/progressive form' };
  }
  
  if (w.endsWith('ed') && w.length > 3) {
    return { remove: true, reason: 'Past tense form' };
  }
  
  if (w.endsWith('ly') && w.length > 3) {
    return { remove: true, reason: 'Adverb form' };
  }
  
  return { remove: false, reason: 'Does not match inflection pattern' };
}

// ============================================================
// BATCH D: RHYME ANCHOR ADDITIONS
// ============================================================

const RHYME_ANCHORS = [
  // Multi-Syllabic Power Nouns
  { word: 'hesitation', definition: 'A pause before action; the moment between thought and decision.' },
  { word: 'motivation', definition: 'The driving force behind action; what pushes you forward.' },
  { word: 'dedication', definition: 'Committed focus to a goal; the grind personified.' },
  { word: 'intuition', definition: 'Inner knowing without logic; gut feeling that guides.' },
  { word: 'premonition', definition: 'A feeling about the future; sensing what\'s coming.' },
  { word: 'definition', definition: 'Clear boundaries of meaning; knowing exactly what something is.' },
  { word: 'reputation', definition: 'What they say when you\'re not there; your name in the streets.' },
  { word: 'situation', definition: 'The current state of affairs; where you find yourself.' },
  { word: 'elevation', definition: 'Rising up; the climb to higher ground.' },
  { word: 'navigation', definition: 'Finding your way; steering through the unknown.' },
  
  // Atmospheric Adjectives
  { word: 'cinematic', definition: 'Movie-quality visual; life playing out like a film.' },
  { word: 'automatic', definition: 'Moving without thought; instinctive and effortless.' },
  { word: 'panoramic', definition: 'Wide-angle view; seeing the full picture.' },
  { word: 'diplomatic', definition: 'Smooth with words; navigating conflict with finesse.' },
  { word: 'enigmatic', definition: 'Mysteriously attractive; hard to read, impossible to ignore.' },
  
  // Verbs of Motion/Change
  { word: 'accelerate', definition: 'Speed up; pushing harder, moving faster.' },
  { word: 'resonate', definition: 'Echo deeply; vibrating with meaning.' },
  { word: 'gravitate', definition: 'Pulled toward; naturally drawn to something.' }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
    return true;
  }
  return false;
}

function getLetterFromWord(word) {
  return word[0].toUpperCase();
}

function createWordMd(word, definition) {
  const syllables = word.length <= 4 ? 1 : word.length <= 7 ? 2 : word.length <= 10 ? 3 : 4;
  
  return `# WORD: ${word.charAt(0).toUpperCase() + word.slice(1)}

## Meaning (plain):
${definition}

## Rap meaning (how I'd say it):
${definition}

## Syllables:
${syllables} (${word})

## Part of speech:
noun / verb / adjective

## Synonyms:
[to be curated]

## Antonyms:
[to be curated]

## Rhyme ideas (end / slant / multi):
[to be curated]

## 3 bar-ready examples:
1. [to be curated]
2. [to be curated]
3. [to be curated]

## 3 punchline angles:
1. [to be curated]
2. [to be curated]
3. [to be curated]

## Tags:
JaZeR-rhyme-anchor
`;
}

// ============================================================
// MAIN EXECUTION
// ============================================================

console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
console.log('║                    JAZER DICTIONARY PHASE 3 VIBE CURATION                     ║');
console.log('║                      "Maximize Vibe Density"                                  ║');
console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No changes will be made\n');
}

// Load manifest
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
const originalCount = manifest.totalWords;

// Load removal targets
let removeTargets = { definiteRemove: [] };
if (fs.existsSync(REMOVE_LIST_PATH)) {
  removeTargets = JSON.parse(fs.readFileSync(REMOVE_LIST_PATH, 'utf-8'));
  console.log(`📋 Loaded removal targets: ${removeTargets.definiteRemove.length} words marked for definite removal`);
} else {
  console.log('⚠️ JAZER-WORDS-TO-REMOVE.json not found, skipping specific removals');
}

console.log(`📊 Current word count: ${originalCount}`);
console.log(`🎯 Target word count: ~3,500\n`);

// Build set of all words
const allWordsSet = new Set();
Object.values(manifest.letters).forEach(letterData => {
  letterData.words.forEach(entry => {
    allWordsSet.add(entry.word.toLowerCase());
  });
});

// ============================================================
// BATCH A2: SPECIFIC REMOVALS (From Audit)
// ============================================================

console.log('┌────────────────────────────────────────────────────────────────────────────────┐');
console.log('│ BATCH A2: SPECIFIC REMOVAL TARGETS                                            │');
console.log('└────────────────────────────────────────────────────────────────────────────────┘\n');

const specificToRemove = [];
const specificWords = new Set();

if (removeTargets.definiteRemove) {
  removeTargets.definiteRemove.forEach(target => {
    // Check if word exists in manifest (case insensitive)
    if (allWordsSet.has(target.word.toLowerCase())) {
      specificToRemove.push({
        word: target.word,
        reason: target.reason || 'Specified in removal list',
        source: 'JAZER-WORDS-TO-REMOVE.json'
      });
      specificWords.add(target.word.toLowerCase());
    }
  });
}

console.log(`   Found ${specificToRemove.length} specific words to remove`);
specificToRemove.forEach(w => console.log(`   - ${w.word}: ${w.reason}`));
console.log('');

// ============================================================
// BATCH B: ANALYZE INFLECTIONS
// ============================================================

console.log('┌────────────────────────────────────────────────────────────────────────────────┐');
console.log('│ BATCH B: INFLECTION CLEANUP                                                   │');
console.log('└────────────────────────────────────────────────────────────────────────────────┘\n');

const inflectionsToRemove = [];

Object.entries(manifest.letters).forEach(([letter, data]) => {
  data.words.forEach(entry => {
    const result = shouldRemoveInflection(entry.word, allWordsSet);
    if (result.remove) {
      inflectionsToRemove.push({
        word: entry.word,
        path: entry.path,
        letter,
        ...result
      });
    }
  });
});

// Group by reason
const byReason = {};
inflectionsToRemove.forEach(w => {
  byReason[w.reason] = byReason[w.reason] || [];
  byReason[w.reason].push(w);
});

console.log('   Inflection Removal Breakdown:');
Object.entries(byReason).forEach(([reason, words]) => {
  console.log(`   - ${reason}: ${words.length} words`);
});
console.log(`\n   📉 Total inflections to remove: ${inflectionsToRemove.length}`);

// ============================================================
// BATCH D: CHECK RHYME ANCHORS
// ============================================================

console.log('\n┌────────────────────────────────────────────────────────────────────────────────┐');
console.log('│ BATCH D: RHYME ANCHOR ADDITIONS                                               │');
console.log('└────────────────────────────────────────────────────────────────────────────────┘\n');

const missingAnchors = RHYME_ANCHORS.filter(a => !allWordsSet.has(a.word.toLowerCase()));
const presentAnchors = RHYME_ANCHORS.filter(a => allWordsSet.has(a.word.toLowerCase()));

console.log(`   Already present: ${presentAnchors.length}`);
presentAnchors.forEach(a => console.log(`   ✓ ${a.word}`));

console.log(`\n   Missing (to add): ${missingAnchors.length}`);
missingAnchors.forEach(a => console.log(`   + ${a.word}`));

// ============================================================
// SUMMARY
// ============================================================

const projectedCount = originalCount - specificToRemove.length - inflectionsToRemove.length + missingAnchors.length;

console.log('\n┌────────────────────────────────────────────────────────────────────────────────┐');
console.log('│ PROJECTED RESULTS                                                             │');
console.log('├────────────────────────────────────────────────────────────────────────────────┤');
console.log(`│ Current count:      ${originalCount}`.padEnd(79) + '│');
console.log(`│ Specific remove:    ${specificToRemove.length}`.padEnd(79) + '│');
console.log(`│ Inflections remove: ${inflectionsToRemove.length}`.padEnd(79) + '│');
console.log(`│ Anchors add:        ${missingAnchors.length}`.padEnd(79) + '│');
console.log(`│ Projected final:    ${projectedCount}`.padEnd(79) + '│');
console.log('└────────────────────────────────────────────────────────────────────────────────┘\n');

// ============================================================
// EXECUTE CHANGES
// ============================================================

const stats = {
  removed: 0,
  added: 0,
  errors: [],
  removedEntries: [],
  addedEntries: []
};

if (!DRY_RUN) {
  console.log('🗑️  Removing specific targets...');
  
  for (const entry of specificToRemove) {
    const letter = getLetterFromWord(entry.word);
    const wordPath = path.join(DICTIONARY_PATH, letter, '01_Words', entry.word);
    
    try {
      if (deleteFolderRecursive(wordPath)) {
        stats.removed++;
        stats.removedEntries.push(entry.word);
        console.log(`   - Removed: ${entry.word}`);
      }
    } catch (err) {
      stats.errors.push(`Failed to remove ${entry.word}: ${err.message}`);
    }
  }

  console.log('🗑️  Removing inflections...');
  
  for (const entry of inflectionsToRemove) {
    const wordPath = path.join(DICTIONARY_PATH, entry.letter, '01_Words', entry.word);
    
    try {
      if (deleteFolderRecursive(wordPath)) {
        stats.removed++;
        stats.removedEntries.push(entry.word);
        if (stats.removed % 100 === 0) {
          console.log(`   Removed ${stats.removed} inflections...`);
        }
      }
    } catch (err) {
      stats.errors.push(`Failed to remove ${entry.word}: ${err.message}`);
    }
  }
  
  console.log(`   ✓ Removed ${stats.removed} inflections\n`);
  
  console.log('📝 Adding rhyme anchors...');
  
  for (const anchor of missingAnchors) {
    const letter = getLetterFromWord(anchor.word);
    const wordDir = path.join(DICTIONARY_PATH, letter, '01_Words', anchor.word);
    
    try {
      if (!fs.existsSync(wordDir)) {
        fs.mkdirSync(wordDir, { recursive: true });
      }
      
      const wordMdPath = path.join(wordDir, 'word.md');
      fs.writeFileSync(wordMdPath, createWordMd(anchor.word, anchor.definition));
      
      stats.added++;
      stats.addedEntries.push(anchor.word);
      console.log(`   + Added: ${anchor.word}`);
    } catch (err) {
      stats.errors.push(`Failed to add ${anchor.word}: ${err.message}`);
    }
  }
  
  console.log(`   ✓ Added ${stats.added} rhyme anchors\n`);
  
  // Update manifest
  console.log('📋 Updating manifest...');
  
  // Remove entries from manifest
  for (const word of stats.removedEntries) {
    const letter = getLetterFromWord(word);
    if (manifest.letters[letter]) {
      manifest.letters[letter].words = manifest.letters[letter].words.filter(
        w => w.word.toLowerCase() !== word.toLowerCase()
      );
      manifest.letters[letter].count = manifest.letters[letter].words.length;
    }
  }
  
  // Add new entries to manifest
  for (const word of stats.addedEntries) {
    const letter = getLetterFromWord(word);
    if (!manifest.letters[letter]) {
      manifest.letters[letter] = { count: 0, words: [] };
    }
    manifest.letters[letter].words.push({
      word: word,
      path: `${letter}/01_Words/${word}/word.md`
    });
    manifest.letters[letter].count = manifest.letters[letter].words.length;
  }
  
  // Recalculate total
  let newTotal = 0;
  for (const letter of Object.keys(manifest.letters)) {
    newTotal += manifest.letters[letter].count;
  }
  manifest.totalWords = newTotal;
  
  // Save updated manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`   ✓ Manifest updated\n`);
}

// ============================================================
// FINAL SUMMARY
// ============================================================

console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
console.log('║                              EXECUTION SUMMARY                                ║');
console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');

if (DRY_RUN) {
  console.log(`   Original count:     ${originalCount}`);
  console.log(`   Would remove (specific): ${specificToRemove.length} specific words`);
  console.log(`   Would remove (inflect): ${inflectionsToRemove.length} inflections`);
  console.log(`   Would add:              ${missingAnchors.length} rhyme anchors`);
  console.log(`   Projected final:    ${projectedCount}`);
  console.log('\n💡 Run without --dry-run to execute changes.');
} else {
  console.log(`   Original count:     ${originalCount}`);
  console.log(`   Specific words removed: ${stats.removedEntries.filter(w => specificWords.has(w.toLowerCase())).length}`);
  console.log(`   Inflections removed:    ${stats.removedEntries.filter(w => !specificWords.has(w.toLowerCase())).length}`);
  console.log(`   Total removed:          ${stats.removed}`);
  console.log(`   Anchors added:          ${stats.added}`);
  console.log(`   Final count:         ${manifest.totalWords}`);
}

if (stats.errors.length > 0) {
  console.log('\n⚠️  ERRORS:');
  for (const err of stats.errors) {
    console.log(`   - ${err}`);
  }
}

// Save execution log
const logPath = path.join(__dirname, 'phase3-vibe-curation-log.json');
fs.writeFileSync(logPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  dryRun: DRY_RUN,
  originalCount,
  specificToRemove: specificToRemove.map(w => w.word),
  inflectionsToRemove: inflectionsToRemove.map(w => ({ word: w.word, reason: w.reason, base: w.base })),
  rhymeAnchorsToAdd: missingAnchors.map(a => a.word),
  stats: DRY_RUN ? { removed: 0, added: 0 } : stats,
  projectedCount
}, null, 2));

console.log(`\n📁 Execution log saved to: phase3-vibe-curation-log.json`);
