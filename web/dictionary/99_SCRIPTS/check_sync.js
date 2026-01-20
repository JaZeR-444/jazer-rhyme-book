const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync('MASTER-DICTIONARY-MANIFEST.json', 'utf8'));
let missingCount = 0;
const missingWords = [];

for (const letter in manifest.letters) {
    const words = manifest.letters[letter].words;
    words.forEach(wordObj => {
        // The path in manifest is like "A/01_Words/ability/word.md"
        // We just need to check if the directory exists
        const wordDir = path.dirname(wordObj.path);
        if (!fs.existsSync(wordDir)) {
            missingCount++;
            missingWords.push(wordObj.word);
        }
    });
}

console.log(`Total words in manifest: ${manifest.totalWords}`);
console.log(`Total missing on disk: ${missingCount}`);
if (missingCount > 0) {
    console.log('Missing words:', missingWords.join(', '));
}
