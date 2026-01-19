/**
 * Dictionary Cleanup Execution Script
 * Moves hyphenated entries to PHRASES and removes inflection duplicates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DICTIONARY_PATH = path.join(__dirname, 'public', 'dictionary');
const MANIFEST_PATH = path.join(DICTIONARY_PATH, 'MASTER-DICTIONARY-MANIFEST.json');
const PHRASES_PATH = path.join(DICTIONARY_PATH, 'PHRASES');

// Load audit results
const auditResultsPath = path.join(__dirname, 'audit_results.json');
console.log('Loading audit results from:', auditResultsPath);

let auditResults;
try {
  auditResults = JSON.parse(fs.readFileSync(auditResultsPath, 'utf-8'));
} catch (err) {
  console.error('Failed to load audit_results.json:', err.message);
  console.log('Please run audit_dictionary_cleanup.js first.');
  process.exit(1);
}

// Helper to delete a folder recursively
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

// Helper to copy folder recursively
function copyFolderRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src);
  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      // Rename word.md to phrase.md when copying
      const destFile = entry === 'word.md' ? 'phrase.md' : entry;
      fs.copyFileSync(srcPath, path.join(dest, destFile));
    }
  }
}

function getLetterFromWord(word) {
  return word[0].toUpperCase();
}

// Execution stats
const stats = {
  moved: 0,
  removed: 0,
  errors: [],
  movedEntries: [],
  removedEntries: []
};

console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
console.log('║                        DICTIONARY CLEANUP EXECUTION                           ║');
console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');

// Step 1: Create PHRASES directory
console.log('📁 Step 1: Creating PHRASES directory...');
if (!fs.existsSync(PHRASES_PATH)) {
  fs.mkdirSync(PHRASES_PATH, { recursive: true });
  console.log('   ✓ Created PHRASES directory\n');
} else {
  console.log('   ✓ PHRASES directory already exists\n');
}

// Step 2: Move hyphenated entries to PHRASES
console.log('📦 Step 2: Moving hyphenated entries to PHRASES...');
for (const entry of auditResults.move) {
  if (entry.status === 'found') {
    const letter = getLetterFromWord(entry.target);
    const srcPath = path.join(DICTIONARY_PATH, letter, '01_Words', entry.target);
    const destPath = path.join(PHRASES_PATH, entry.target);
    
    try {
      // Copy to new location (with word.md -> phrase.md rename)
      copyFolderRecursive(srcPath, destPath);
      // Delete original
      deleteFolderRecursive(srcPath);
      stats.moved++;
      stats.movedEntries.push(entry.target);
      console.log(`   ✓ Moved: ${entry.target}`);
    } catch (err) {
      stats.errors.push(`Failed to move ${entry.target}: ${err.message}`);
      console.log(`   ✗ Error moving ${entry.target}: ${err.message}`);
    }
  }
}
console.log(`   Total moved: ${stats.moved}\n`);

// Step 3: Remove entries marked for deletion
console.log('🗑️  Step 3: Removing inflection duplicates and utility words...');
for (const entry of auditResults.remove) {
  if (entry.status === 'found') {
    const letter = getLetterFromWord(entry.target);
    const wordPath = path.join(DICTIONARY_PATH, letter, '01_Words', entry.target);
    
    try {
      if (deleteFolderRecursive(wordPath)) {
        stats.removed++;
        stats.removedEntries.push(entry.target);
        console.log(`   ✓ Removed: ${entry.target}`);
      }
    } catch (err) {
      stats.errors.push(`Failed to remove ${entry.target}: ${err.message}`);
      console.log(`   ✗ Error removing ${entry.target}: ${err.message}`);
    }
  }
}
console.log(`   Total removed: ${stats.removed}\n`);

// Step 4: Update manifest
console.log('📋 Step 4: Updating MASTER-DICTIONARY-MANIFEST.json...');
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
const originalTotalWords = manifest.totalWords;

// Remove entries from letter buckets
for (const entry of [...stats.movedEntries, ...stats.removedEntries]) {
  const letter = getLetterFromWord(entry);
  if (manifest.letters[letter]) {
    const originalCount = manifest.letters[letter].words.length;
    manifest.letters[letter].words = manifest.letters[letter].words.filter(
      w => w.word !== entry
    );
    if (manifest.letters[letter].words.length < originalCount) {
      manifest.letters[letter].count = manifest.letters[letter].words.length;
    }
  }
}

// Add PHRASES section
manifest.phrases = {
  count: stats.movedEntries.length,
  words: stats.movedEntries.map(phrase => ({
    word: phrase,
    path: `PHRASES/${phrase}/phrase.md`
  }))
};

// Recalculate total
let newTotal = 0;
for (const letter of Object.keys(manifest.letters)) {
  newTotal += manifest.letters[letter].count;
}
manifest.totalWords = newTotal;

// Save updated manifest
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
console.log(`   ✓ Updated manifest`);
console.log(`   ✓ Total words: ${originalTotalWords} → ${manifest.totalWords} (-${originalTotalWords - manifest.totalWords})\n`);

// Step 5: Summary
console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
console.log('║                              EXECUTION SUMMARY                                ║');
console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');

console.log('┌────────────────────────────────────────────────────────────────────────────────┐');
console.log('│ BEFORE vs AFTER                                                               │');
console.log('├────────────────────────────────────────────────────────────────────────────────┤');
console.log(`│ Total words:        ${originalTotalWords} → ${manifest.totalWords}`.padEnd(79) + '│');
console.log(`│ Words removed:      ${stats.removed}`.padEnd(79) + '│');
console.log(`│ Moved to PHRASES:   ${stats.moved}`.padEnd(79) + '│');
console.log(`│ Net change:         -${stats.moved + stats.removed}`.padEnd(79) + '│');
console.log('└────────────────────────────────────────────────────────────────────────────────┘\n');

if (stats.errors.length > 0) {
  console.log('⚠️  ERRORS:');
  for (const err of stats.errors) {
    console.log(`   - ${err}`);
  }
}

// Save execution log
const logPath = path.join(__dirname, 'cleanup_execution_log.json');
fs.writeFileSync(logPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  originalTotalWords,
  newTotalWords: manifest.totalWords,
  stats
}, null, 2));
console.log(`📁 Execution log saved to: ${logPath}`);
