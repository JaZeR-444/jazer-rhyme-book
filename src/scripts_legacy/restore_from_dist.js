
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'web', 'dist', 'dictionary');
const sourceDir = path.join(rootDir, 'Rap_Dictionary_Master_Hub');

if (!fs.existsSync(distDir)) {
  console.error('❌ Dist directory not found:', distDir);
  process.exit(1);
}

console.log('📦 Restoring dictionary from dist...');
console.log(`Source: ${distDir}`);
console.log(`Target: ${sourceDir}`);

if (!fs.existsSync(sourceDir)) {
  fs.mkdirSync(sourceDir, { recursive: true });
}

const letters = fs.readdirSync(distDir).filter(letter => /^[A-Z]$/.test(letter));

let totalRestored = 0;

for (const letter of letters) {
  const distLetterDir = path.join(distDir, letter);
  const sourceLetterDir = path.join(sourceDir, letter);
  
  if (!fs.existsSync(sourceLetterDir)) {
    fs.mkdirSync(sourceLetterDir, { recursive: true });
  }

  // Check for 01_Words
  const distWordsCompDir = path.join(distLetterDir, '01_Words');
  if (fs.existsSync(distWordsCompDir)) {
    const sourceWordsCompDir = path.join(sourceLetterDir, '01_Words');
    if (!fs.existsSync(sourceWordsCompDir)) {
      fs.mkdirSync(sourceWordsCompDir, { recursive: true });
    }

    const words = fs.readdirSync(distWordsCompDir);
    for (const word of words) {
        const distWordPath = path.join(distWordsCompDir, word);
        const sourceWordPath = path.join(sourceWordsCompDir, word);
        
        // Ensure word directory exists
        if (!fs.existsSync(sourceWordPath)) {
            fs.mkdirSync(sourceWordPath, { recursive: true });
        }

        // Copy content
        // We really only care about word.md for now, but let's copy everything recursively usually
        // But let's stick to word.md to be safe and clean
        const files = fs.readdirSync(distWordPath);
        for (const file of files) {
            fs.copyFileSync(path.join(distWordPath, file), path.join(sourceWordPath, file));
        }
        totalRestored++;
    }
    console.log(`Restored letter ${letter}: ${words.length} words`);
  }
}

console.log(`\n✅ Restoration complete. Restored ${totalRestored} words to ${sourceDir}`);
