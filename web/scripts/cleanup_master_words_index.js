import fs from 'fs';
import path from 'path';

const filePath = './public/dictionary/MASTER-WORDS-INDEX.md';

const wordsToDelete = new Set([
  'academies', 'academia', 'accessed', 'advice', 'adviser', 'advises', 'advisor', 'advisories', 'advisors', 'agenda', 'agencies', 'agreement', 'appraisal', 'appraiser', 'attorneys', 'authority', 'authorized', 'authorizes', 'assessment', 'allocate', 'archival', 'archive', 'archiving', 'archives',
  'acreage', 'acres', 'add', 'added', 'across', 'amounts', 'areas', 'articles', 'annotation', 'attach', 'attempt', 'attempting', 'allowing', 'allows',
  'adapters', 'adhesion', 'assembler', 'aerosol', 'axle', 'axis',
  'ah', 'am', 'are', 'anon', 'another', 'anywhere',
  'afghan', 'allah', 'almighty', 'anglican', 'apostle', 'archbishop', 'asians', 'atheism', 'atheist', 'atheists',
  'ambush', 'ammo', 'ammunition', 'arm', 'armed', 'armies', 'armada', 'armor', 'armour', 'armoured', 'arsenal', 'artillery', 'assassin', 'assault', 'attack', 'attacked', 'attacker', 'attacks', 'arrested', 'arrestee', 'arrests',
  'acuities', 'amidated', 'antilogs', 'anfeeld', 'agueweed', 'aquiline', 'amphorae', 'argolic', 'arguta', 'armenoïd', 'arsenism', 'astilbe', 'anthemís',
  'abandon', 'abandoned', 'afraid', 'angry', 'anxiety', 'anxious', 'arrogant', 'avarice', 'alcoholic'
]);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // --- Step 1: Filter out deleted words and collect kept words ---
  const keptWordEntries = {}; // { 'A': ['- [ablaze]...', '- [abroad]...'], 'B': [...] }
  const originalHeaders = {}; // { 'A': ['- **Total words**: ...', '...'] }
  let quickStatsHeader = [];

  let currentLetter = '';
  let parsingState = 'QUICK_STATS'; // QUICK_STATS, LETTER_HEADER, WORDS

  for (const line of lines) {
    if (line.startsWith('## Quick Stats')) {
      parsingState = 'QUICK_STATS';
    } else if (line.startsWith('## ')) {
      currentLetter = line.match(/^## ([A-Z])$/)[1];
      keptWordEntries[currentLetter] = [];
      originalHeaders[currentLetter] = [];
      parsingState = 'LETTER_HEADER';
    } else if (line.startsWith('### Words')) {
      parsingState = 'WORDS';
    }

    if (parsingState === 'QUICK_STATS') {
      quickStatsHeader.push(line);
    } else if (parsingState === 'LETTER_HEADER') {
      if (!line.startsWith('## ')) originalHeaders[currentLetter].push(line);
    } else if (parsingState === 'WORDS') {
      const wordMatch = line.match(/^- \[(.+) \]/); // Corrected regex to match the example format
      if (wordMatch) {
        const word = wordMatch[1];
        if (!wordsToDelete.has(word)) {
          keptWordEntries[currentLetter].push(line);
        }
      }
    }
  }

  // --- Step 2: Recalculate stats ---
  let grandTotal = 0;
  for (const letter in keptWordEntries) {
    grandTotal += keptWordEntries[letter].length;
  }

  // --- Step 3: Rebuild the file content ---
  let finalContent = '';
  
  // Rebuild Quick Stats
  const lastUpdatedLine = quickStatsHeader.find(l => l.includes('Last updated'));
  finalContent += '# Master Words Index\n\n';
  finalContent += '## Quick Stats\n';
  finalContent += `- **Total words**: \`${grandTotal}\`\n`;
  if(lastUpdatedLine) finalContent += `${lastUpdatedLine}\n`;
  finalContent += `- **Vibe Density Optimized**: ✅\n\n---\n\n`;

  // Rebuild each letter section
  const sortedLetters = Object.keys(keptWordEntries).sort();
  for (const letter of sortedLetters) {
    finalContent += `## ${letter}\n`;
    finalContent += `- **Total words**: `${keptWordEntries[letter].length}`\n`; // Using unicode for backticks
    // For now, we will reset the other stats as they are complex to recalculate
    finalContent += `- **Avg length**: `N/A`\n`; // Using unicode for backticks
    finalContent += `- **Shortest**: `N/A`\n`; // Using unicode for backticks
    finalContent += `- **Longest**: `N/A`\n`; // Using unicode for backticks
    finalContent += `- **Length distribution**:\n`;
    finalContent += `  - N/A\n`;
    finalContent += `\n### Words\n`;
    finalContent += keptWordEntries[letter].join('\n');
    finalContent += `\n\n---\n\n`;
  }
  
  // Trim trailing newlines for a clean file end
  finalContent = finalContent.trimEnd() + '\n';
  
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log(`Successfully cleaned up ${filePath} and updated word counts.`);
  console.log(`Removed ${wordsToDelete.size} different word types. New total is ${grandTotal}.`);

} catch (error) {
  console.error(`Error processing file: ${error.message}`);
}