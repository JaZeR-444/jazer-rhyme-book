const fs = require('fs');
const path = require('path');

const inboxDir = path.join(__dirname, '../00_INBOX');
const dictionaryRoot = path.join(__dirname, '../');

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function processWords() {
    const wordsFile = path.join(inboxDir, 'words.json');
    if (!fs.existsSync(wordsFile)) {
        console.log('No words.json found in inbox.');
        return;
    }

    const data = JSON.parse(fs.readFileSync(wordsFile, 'utf8'));
    let count = 0;

    data.categories.forEach(category => {
        category.items.forEach(item => {
            const word = item.word;
            const letter = word.charAt(0).toUpperCase();
            const wordSlug = word.toLowerCase(); // Simple lowercase for folder name as per observation
            
            const targetDir = path.join(dictionaryRoot, letter, '01_Words', wordSlug);
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const content = `# WORD: ${word}

## Meaning (plain):
${item.definition || ''}

## Sonic Texture:
${item.sonic_texture || ''}

## Contrast:
${item.contrast || ''}

## 3 bar-ready examples:
1. ${item.usage || ''}

## Tags:
${category.category_name}
`;
            
            fs.writeFileSync(path.join(targetDir, 'word.md'), content);
            console.log(`Created word: ${word} in ${targetDir}`);
            count++;
        });
    });
    console.log(`Processed ${count} words.`);
}

function processPhrases() {
    const phrasesFile = path.join(inboxDir, 'phrases.json');
    if (!fs.existsSync(phrasesFile)) {
        console.log('No phrases.json found in inbox.');
        return;
    }

    const data = JSON.parse(fs.readFileSync(phrasesFile, 'utf8'));
    let count = 0;

    data.categories.forEach(category => {
        category.items.forEach(item => {
            const phrase = item.phrase;
            const letter = phrase.charAt(0).toUpperCase();
            // Handle phrases starting with non-letters if any (not expected based on sample but good practice)
            // Assuming phrases start with letters A-Z.
            
            const phraseSlug = slugify(phrase);
            const targetDir = path.join(dictionaryRoot, letter, '02_Phrases');
            
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const content = `# PHRASE: ${phrase}

## Meaning:
${item.context || ''}

## Tags:
${category.category_name}
`;

            fs.writeFileSync(path.join(targetDir, `${phraseSlug}.md`), content);
            console.log(`Created phrase: ${phrase} in ${targetDir}`);
            count++;
        });
    });
    console.log(`Processed ${count} phrases.`);
}

processWords();
processPhrases();
