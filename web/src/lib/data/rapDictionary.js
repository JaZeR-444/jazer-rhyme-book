/**
 * Rap Dictionary Data Loader
 * ===========================
 * 
 * Loads ALL word.md files from Rap_Dictionary_Master_Hub
 * Structure: Letter/01_Words/word_folder/word.md
 */

// Deep glob to match: A/01_Words/abandon/word.md, B/01_Words/baby/word.md, etc.
const wordModules = import.meta.glob(
  '@dictionary/*/01_Words/*/word.md',
  { eager: true, query: '?raw', import: 'default' }
);

// Debug: Log first path to understand format
const firstPath = Object.keys(wordModules)[0];
if (import.meta.env.DEV) {
  console.log('[Rap Dictionary] First path:', firstPath);
}

// Process into usable format
const allWords = [];

for (const [path, content] of Object.entries(wordModules)) {
  // The path could be in various formats depending on how Vite resolves it:
  // - "@dictionary/A/01_Words/abandon/word.md"
  // - "/A/01_Words/abandon/word.md"
  // - Full absolute path
  
  // Use regex to extract letter (single capital letter followed by /)
  const letterMatch = path.match(/[\\/]([A-Z])[\\/]01_Words[\\/]/i);
  const letter = letterMatch ? letterMatch[1].toUpperCase() : null;
  
  // Extract word folder name (last folder before word.md)
  const wordMatch = path.match(/[\\/]([^\\/]+)[\\/]word\.md$/i);
  const wordFolder = wordMatch ? wordMatch[1] : null;
  
  // Skip if we didn't get proper values
  if (!letter || !wordFolder) {
    console.warn('[Rap Dictionary] Skipping path:', path);
    continue;
  }
  
  // Skip system/example files
  if (wordFolder.startsWith('_') || wordFolder.startsWith('.')) {
    continue;
  }
  
  // Skip if content is not a string
  if (typeof content !== 'string') continue;
  
  // Parse markdown content
  const lines = content.split('\n');
  
  // Find the word name (first H1)
  const titleLine = lines.find(l => l.startsWith('# '));
  let title = titleLine ? titleLine.replace('# ', '').replace('WORD:', '').trim() : wordFolder;
  
  // Clean up title
  title = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  
  const extractSection = (label) => {
    const labelIndex = lines.findIndex(l => l.toLowerCase().includes(label));
    if (labelIndex === -1) return '';
    const sectionLines = [];
    for (let i = labelIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        if (sectionLines.length > 0) break;
        continue;
      }
      if (/^#{1,6}\s/.test(line)) break;
      sectionLines.push(line.replace(/^\*\s*/, ''));
    }
    return sectionLines.join(' ').trim();
  };

  // Find meaning (plain) section
  const definition = extractSection('meaning (plain)');
  
  // Find part of speech
  const posLine = lines.find(l => l.toLowerCase().includes('part of speech'));
  const partOfSpeech = posLine ? posLine.split(':')[1]?.trim() || '' : '';
  
  // Find rap meaning
  const rapMeaning = extractSection('rap meaning');
  
  allWords.push({
    id: wordFolder,
    word: title,
    letter,
    definition: definition.substring(0, 200),
    rapMeaning: rapMeaning.substring(0, 200),
    partOfSpeech,
  });
}

// Sort alphabetically
allWords.sort((a, b) => a.word.localeCompare(b.word));

// Group by letter
const byLetter = {};
for (const word of allWords) {
  if (!byLetter[word.letter]) {
    byLetter[word.letter] = [];
  }
  byLetter[word.letter].push(word);
}

export const words = allWords;
export const letterGroups = byLetter;
export const letters = Object.keys(byLetter).sort();
export const totalWords = allWords.length;

// Search function
export function searchWords(query, limit = 50) {
  const q = query.toLowerCase();
  return allWords
    .filter(w => 
      w.word.toLowerCase().includes(q) || 
      w.definition.toLowerCase().includes(q) ||
      w.rapMeaning.toLowerCase().includes(q)
    )
    .slice(0, limit);
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Get random words (optionally seeded)
export function getRandomWords(count = 10, seed) {
  const rng = typeof seed === 'number' ? mulberry32(seed) : Math.random;
  const shuffled = [...allWords].sort(() => rng() - 0.5);
  return shuffled.slice(0, count);
}

if (import.meta.env.DEV) {
  console.log(`[Rap Dictionary] Loaded ${totalWords} words from ${letters.length} letters`);
  console.log(`[Rap Dictionary] Letters: ${letters.join(', ')}`);
}
