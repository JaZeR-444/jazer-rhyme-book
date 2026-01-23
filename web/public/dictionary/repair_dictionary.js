const fs = require('fs');
const path = require('path');

const INDEX_FILE = 'MASTER-WORDS-INDEX.md';
const MANIFEST_FILE = 'MASTER-DICTIONARY-MANIFEST.json';

// Template for new word files
const getTemplate = (word) => `# WORD: ${word.charAt(0).toUpperCase() + word.slice(1)}

## Meaning (plain):
[Meaning of ${word}]

## Rap meaning (how I'd say it):
[Rap usage for ${word}]

## Syllables:
[Syllables]

## Part of speech:
[POS]

## Synonyms:
[Synonyms]

## Antonyms:
[Antonyms]

## Rhyme ideas (end / slant / multi):
END: 
SLANT: 
MULTI: 

## 3 bar-ready examples:
1. 
2. 
3. 

## 3 punchline angles:
1. 
2. 
3. 

## Tags:
[Tags]
`;

function main() {
    console.log('Starting dictionary repair...');

    if (!fs.existsSync(INDEX_FILE)) {
        console.error(`Error: ${INDEX_FILE} not found.`);
        process.exit(1);
    }

    const content = fs.readFileSync(INDEX_FILE, 'utf8');
    const manifest = { totalWords: 0, letters: {} };
    let missingCount = 0;
    let createdCount = 0;

    // Regex to match letter sections
    const letterSectionRegex = /## Words Starting with `?([A-Z])`?[^]*?(?=## Words Starting with|$)/g;
    // Regex to match word entries: 1. [word](PATH)
    const wordRegex = /\d+\. \[([^\]]+)\]\(([^\)]+)\)/g;

    let match;
    while ((match = letterSectionRegex.exec(content)) !== null) {
        const letter = match[1];
        const sectionContent = match[0];

        manifest.letters[letter] = { count: 0, words: [] };

        let wordMatch;
        while ((wordMatch = wordRegex.exec(sectionContent)) !== null) {
            const word = wordMatch[1];
            const relativePath = wordMatch[2]; // e.g., A/01_Words/ability/word.md
            
            // Normalize path for Windows if needed
            const fullPath = path.resolve(relativePath);
            const dirPath = path.dirname(fullPath);

            manifest.letters[letter].words.push({ word, path: relativePath });
            manifest.letters[letter].count++;
            manifest.totalWords++;

            // Check if file exists
            if (!fs.existsSync(fullPath)) {
                console.log(`Missing: ${word} (${relativePath})`);
                missingCount++;

                try {
                    // Create directory recursively
                    fs.mkdirSync(dirPath, { recursive: true });
                    // Write template
                    fs.writeFileSync(fullPath, getTemplate(word));
                    console.log(`  Created: ${fullPath}`);
                    createdCount++;
                } catch (err) {
                    console.error(`  Failed to create ${fullPath}: ${err.message}`);
                }
            }
        }
    }

    // Write Manifest
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`\nUpdated ${MANIFEST_FILE}`);
    console.log(`Total words in index: ${manifest.totalWords}`);
    console.log(`Missing files detected: ${missingCount}`);
    console.log(`Files created: ${createdCount}`);
}

main();
