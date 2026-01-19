
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DICTIONARY_PATH = path.join(__dirname, '../public/dictionary');
const MANIFEST_PATH = path.join(DICTIONARY_PATH, 'MASTER-DICTIONARY-MANIFEST.json');

console.log('🔄 Rebuilding MASTER-DICTIONARY-MANIFEST.json from file system...');

if (!fs.existsSync(DICTIONARY_PATH)) {
  console.error('❌ Dictionary path not found:', DICTIONARY_PATH);
  process.exit(1);
}

const letters = fs.readdirSync(DICTIONARY_PATH).filter(d => /^[A-Z]$/.test(d)).sort();
const manifest = { totalWords: 0, letters: {} };

for (const letter of letters) {
  const wordsDir = path.join(DICTIONARY_PATH, letter, '01_Words');
  if (!fs.existsSync(wordsDir)) continue;

  const words = fs.readdirSync(wordsDir).filter(w => {
    return fs.statSync(path.join(wordsDir, w)).isDirectory();
  });

  manifest.letters[letter] = {
    count: words.length,
    words: words.map(w => ({
      word: w,
      path: `${letter}/01_Words/${w}/word.md`
    }))
  };
  
  manifest.totalWords += words.length;
  console.log(`   ${letter}: ${words.length} words`);
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

console.log(`\n✅ Manifest rebuilt. Total words: ${manifest.totalWords}`);
