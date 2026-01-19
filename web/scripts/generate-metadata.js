
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DICTIONARY_DIR = path.join(__dirname, '../public/dictionary');

// Heuristic Syllable Counter
function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Simple Rhyme Sound Extractor (Last stressed vowel sound approximation)
function getRhymeSound(word) {
  // This is a very rough approximation.
  // Real implementation would need a CMU Dict or similar.
  // For now, we take the last 2-3 chars to group by "ending".
  return word.slice(-3).toLowerCase();
}

// Extract part of speech from markdown content
function extractPartOfSpeech(content) {
  const match = content.match(/partOfSpeech:\s*"?([^"\n]+)"?/i);
  return match ? match[1].trim() : 'unknown';
}

// Extract tags from markdown content
function extractTags(content) {
  const match = content.match(/tags:\s*\[(.*?)\]/s);
  if (!match) return [];
  return match[1]
    .split(',')
    .map(t => t.trim().replace(/['"]/g, ''))
    .filter(t => t.length > 0);
}

// Check if content has rhymes section
function hasRhymes(content) {
  return content.includes('## Rhymes') ||
         content.includes('## Perfect Rhymes') ||
         content.includes('rhymes:');
}

// Check if content has examples section
function hasExamples(content) {
  return content.includes('barReadyExamples') ||
         content.includes('## Examples') ||
         content.includes('## Bar-Ready Examples');
}

// Determine complexity based on word characteristics
function determineComplexity(word, syllables) {
  if (syllables <= 2 && word.length <= 6) return 'basic';
  if (syllables >= 4 || word.length >= 10) return 'advanced';
  return 'medium';
}

async function processDictionary() {
  console.log('Starting Metadata Generation...');
  
  try {
    const letters = await fs.readdir(DICTIONARY_DIR);
    
    for (const letter of letters) {
      if (letter.length !== 1) continue; // Skip non-letter folders like '.DS_Store'
      
      const letterDir = path.join(DICTIONARY_DIR, letter);
      const wordsDir = path.join(letterDir, '01_Words');
      const metadataPath = path.join(letterDir, 'metadata.json');
      
      try {
        await fs.access(wordsDir);
      } catch {
        continue; // No words dir
      }

      console.log(`Processing Letter: ${letter}`);
      
      // Get all word directories
      const words = await fs.readdir(wordsDir);
      const metadata = {};

      for (const word of words) {
        if (word.startsWith('.') || word === '_example_word') continue;

        // Basic metadata
        const syllableCount = countSyllables(word);
        const rhymeSound = getRhymeSound(word);
        const wordLength = word.length;

        // Try to read word.md file for additional metadata
        let content = '';
        const wordFile = path.join(wordsDir, word, 'word.md');

        try {
          content = await fs.readFile(wordFile, 'utf-8');
        } catch {
          // File doesn't exist, use basic metadata only
        }

        // Extract enhanced metadata
        metadata[word] = {
          s: syllableCount,
          r: rhymeSound,
          l: wordLength,
          pos: content ? extractPartOfSpeech(content) : 'unknown',
          t: content ? extractTags(content) : [],
          hr: content ? hasRhymes(content) : false,
          he: content ? hasExamples(content) : false,
          c: determineComplexity(word, syllableCount)
        };
      }

      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    }

    console.log('Metadata generation complete!');
    
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

processDictionary();
