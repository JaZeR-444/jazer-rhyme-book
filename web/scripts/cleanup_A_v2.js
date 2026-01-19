import fs from 'fs';
import path from 'path';

// Use relative paths since we verified they work in this environment
const relativePath = './public/dictionary/A/01_Words';
const wordsDir = path.resolve(relativePath);

const targets = [
  "abacas", "abietic", "acinous", "adenine", "adipo", "aedicula", "aefaldy", 
  "agathism", "ainhum", "albizzia", "almagra", "almuce", "alogia", "amabel", 
  "ambreate", "amoebeum", "amoebous", "anapnoic", "anareta", "ancilia", 
  "ascoma", "ascula", "atp", "atrypa", "auctors", "auronal", "auslaute", 
  "auxocyte", "avarish", "awny", "axolotls", "azides", "azotate",
  "aaron", "abdul", "aberdeen", "abramis", "adaptec", "agnes", "alastor", 
  "alibaba", "alibris", "anjou", "antonio", "aralie", "arauan", "ariel", 
  "aristotle", "armstrong", "asoka", "ashford", "asus", "auckland", "augustus",
  "accession", "accredited", "accrued", "accounting", "acta", "adjourned", 
  "adjourns", "appellate", "appendices", "auditing", "auditors"
];

console.log('--- DIAGNOSTIC START ---');
console.log('Current Working Directory:', process.cwd());
console.log('Target Relative Path:', relativePath);
console.log('Resolved Absolute Path:', wordsDir);

if (!fs.existsSync(wordsDir)) {
  console.error('!! ERROR: Cannot find the directory. The relative path might be wrong.');
  process.exit(1);
}

const existingFolders = fs.readdirSync(wordsDir);
console.log(`Total folders found in A: ${existingFolders.length}`);

let removedCount = 0;
let failCount = 0;

targets.forEach(target => {
  const targetPath = path.join(wordsDir, target);
  if (fs.existsSync(targetPath)) {
    try {
      // Using fs.rmSync which is more aggressive for Windows
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`[OK] Deleted: ${target}`);
      removedCount++;
    } catch (err) {
      console.error(`[FAIL] Could not delete ${target}: ${err.message}`);
      failCount++;
    }
  } else {
    // This logs if the target was already gone or never existed
    // console.log(`[SKIP] Not found: ${target}`);
  }
});

console.log('--- SUMMARY ---');
console.log(`Successfully Removed: ${removedCount}`);
console.log(`Failed to Remove: ${failCount}`);
console.log('------------------');
