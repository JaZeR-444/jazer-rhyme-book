import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wordsDir = path.resolve(__dirname, 'public', 'dictionary', 'A', '01_Words');

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

console.log(`Checking directory: ${wordsDir}`);

if (!fs.existsSync(wordsDir)) {
  console.error('ERROR: Could not find the folder. Please check the path in the script.');
  process.exit(1);
}

let removedCount = 0;
let errorCount = 0;

targets.forEach(target => {
  const targetPath = path.join(wordsDir, target);
  if (fs.existsSync(targetPath)) {
    try {
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`[DELETED] ${target}`);
      removedCount++;
    } catch (err) {
      console.error(`[FAILED] ${target}: ${err.message}`);
      errorCount++;
    }
  }
});

console.log(`
--- FINISHED A ---`);
console.log(`Removed: ${removedCount}`);
console.log(`Errors: ${errorCount}`);