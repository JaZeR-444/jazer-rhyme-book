/**
 * Regenerate MASTER-WORDS-INDEX.md from MASTER-DICTIONARY-MANIFEST.json
 * 
 * Usage: node regenerate-index.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DICTIONARY_PATH = path.join(__dirname, '../public/dictionary');
const MANIFEST_PATH = path.join(DICTIONARY_PATH, 'MASTER-DICTIONARY-MANIFEST.json');
const INDEX_PATH = path.join(DICTIONARY_PATH, 'MASTER-WORDS-INDEX.md');

// Load manifest
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

console.log(`📊 Total words in manifest: ${manifest.totalWords}`);

// Generate markdown
let md = `# Master Words Index

## Quick Stats
- **Total words**: \`${manifest.totalWords}\`
- **Last updated**: \`${new Date().toISOString().split('T')[0]}\`
- **Vibe Density Optimized**: ✅

---

`;

// Sort letters
const sortedLetters = Object.keys(manifest.letters).sort();

for (const letter of sortedLetters) {
  const data = manifest.letters[letter];
  const words = data.words || [];
  const count = data.count || words.length;
  
  if (count === 0) continue;
  
  // Calculate stats
  const wordNames = words.map(w => w.word);
  const lengths = wordNames.map(w => w.length);
  const avgLength = (lengths.reduce((a, b) => a + b, 0) / lengths.length).toFixed(2);
  const shortest = wordNames.reduce((a, b) => a.length <= b.length ? a : b);
  const longest = wordNames.reduce((a, b) => a.length >= b.length ? a : b);
  
  // Length distribution
  const lengthCounts = {};
  for (const len of lengths) {
    lengthCounts[len] = (lengthCounts[len] || 0) + 1;
  }
  
  md += `## ${letter}\n`;
  md += `- **Total words**: \`${count}\`\n`;
  md += `- **Avg length**: \`${avgLength}\`\n`;
  md += `- **Shortest**: *${shortest}*\n`;
  md += `- **Longest**: *${longest}*\n`;
  md += `- **Length distribution**:\n`;
  
  const sortedLengths = Object.keys(lengthCounts).map(Number).sort((a, b) => a - b);
  for (const len of sortedLengths) {
    md += `  - ${len} letters: ${lengthCounts[len]} words\n`;
  }
  
  md += `\n### Words\n`;
  
  // Sort words alphabetically
  const sortedWords = [...words].sort((a, b) => a.word.localeCompare(b.word));
  
  for (const entry of sortedWords) {
    md += `- [${entry.word}](${entry.path})\n`;
  }
  
  md += `\n---\n\n`;
}

// Write file
fs.writeFileSync(INDEX_PATH, md);

console.log(`✅ MASTER-WORDS-INDEX.md regenerated with ${manifest.totalWords} words`);
console.log(`📁 Saved to: ${INDEX_PATH}`);
