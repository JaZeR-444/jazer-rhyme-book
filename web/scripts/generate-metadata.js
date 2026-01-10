
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
        
        // We assume the word is the folder name
        const syllableCount = countSyllables(word);
        const rhymeSound = getRhymeSound(word);
        
        metadata[word] = {
          s: syllableCount,
          r: rhymeSound
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
