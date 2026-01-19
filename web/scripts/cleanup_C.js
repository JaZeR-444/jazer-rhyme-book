import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targets = [
  // ... (keep same)
];

const wordsDir = path.resolve(__dirname, 'public', 'dictionary', 'C', '01_Words');

console.log('Starting cleanup of C dictionary...');

let removedCount = 0;
targets.forEach(target => {
  const targetPath = path.join(wordsDir, target);
  if (fs.existsSync(targetPath)) {
    try {
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`- Removed: ${target}`);
      removedCount++;
    } catch (err) {
      console.error(`! Failed to remove ${target}:`, err.message);
    }
  }
});

console.log(`
Cleanup complete. Total folders removed: ${removedCount}`);
console.log('Next step: Run "npm run prepare" to update the site.');
