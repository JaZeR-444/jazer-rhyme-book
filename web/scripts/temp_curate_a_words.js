
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The list of words to KEEP. All others in A/01_Words/ will be deleted.
const KEEP_LIST = new Set([
  'ability', 'ablaze', 'academy', 'accelerate', 'achieve', 'acknowledge', 
  'acronyms', 'adamant', 'adjacent', 'aero', 'afterglow', 'aftermath', 
  'agile', 'agility', 'aim', 'airwave', 'alarm', 'album', 'alchemy', 
  'alerts', 'alley', 'altitude', 'ambition', 'amplifier', 'amplify', 
  'amplitude', 'angel', 'angelic', 'animation', 'anime', 'anonymous', 
  'antenna', 'anthem', 'anticipate', 'apex', 'appearance', 'applause', 
  'arc', 'architect', 'ares', 'ark', 'arrange', 'artificial', 'artists', 
  'ascend', 'ascendancy', 'ascension', 'asphalt', 'assurance', 'assure', 
  'astrology', 'astronomic', 'astronomical', 'atmosphere', 'atomic', 
  'attitude', 'attraction', 'attracts', 'audible', 'aura', 'aurora', 
  'authentic', 'automatic', 'autonomous', 'autonomy', 'avalanche', 
  'avenue', 'awake', 'awaken', 'awe', 'axis'
]);

const dictionaryPath = path.join(__dirname, '..', 'Rap_Dictionary_Master_Hub', 'A', '01_Words');

if (!fs.existsSync(dictionaryPath)) {
  console.error(`❌ Dictionary path not found: ${dictionaryPath}`);
  process.exit(1);
}

console.log(`🔍 Scanning ${dictionaryPath}...`);

const allWords = fs.readdirSync(dictionaryPath).filter(file => {
  return fs.statSync(path.join(dictionaryPath, file)).isDirectory();
});

console.log(`📊 Found ${allWords.length} total words starting with 'A'.`);

let deletedCount = 0;
let keptCount = 0;




console.log(`\n🔒 SAFETY CHECK: Verifying target directory...`);
if (!dictionaryPath.endsWith('Rap_Dictionary_Master_Hub\\A\\01_Words') && !dictionaryPath.endsWith('Rap_Dictionary_Master_Hub/A/01_Words')) {
    console.error(`❌ DANGER: Target directory seems wrong! ${dictionaryPath}`);
    process.exit(1);
}
console.log(`✅ Target directory verified: ${dictionaryPath}`);


// Helper to delete directory robustly
function deleteDirectory(dirPath) {
    try {
        // Try Node native deletion first
        fs.rmSync(dirPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
        if (!fs.existsSync(dirPath)) return true;
    } catch (e) { /* ignore and try fallback */ }

    try {
        // Fallback to Windows native command
        execSync(`cmd /c rd /s /q "${dirPath}"`, { stdio: 'ignore' });
        if (!fs.existsSync(dirPath)) return true;
    } catch (e) { /* ignore */ }
    
    return false;
}

for (const word of allWords) {
  if (!KEEP_LIST.has(word)) {
    const wordPath = path.join(dictionaryPath, word);
    
    // Extra safety: ensure we are deleting a directory inside A/01_Words
    if (word.includes('/') || word.includes('\\') || word === '..') {
        console.error(`❌ SKIPPING suspicious path: ${word}`);
        continue;
    }

    if (deleteDirectory(wordPath)) {
        // console.log(`🗑️ Deleted: ${word}`);
        deletedCount++;
    } else {
        console.error(`❌ FAILED to delete: ${word}`);
    }
  } else {
    // console.log(`✅ Keeping: ${word}`);
    keptCount++;
  }
}

console.log(`\n🎉 Curation Complete!`);
console.log(`   - Kept: ${keptCount}`);
console.log(`   - Deleted: ${deletedCount}`);

