const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('MASTER-WORDS-INDEX.md', 'utf8');

const manifest = {
  totalWords: 0,
  letters: {}
};

// Regex to match letter sections
// Example: ## Words Starting with `A`
const letterSectionRegex = /## Words Starting with `?([A-Z])`?[^]*?(?=## Words Starting with|$)/g;
// Regex to match word entries
// Example: 1. [ability](A/01_Words/ability/word.md)
const wordRegex = /\d+\. \[([^\]]+)\]\(([^\)]+)\)/g;

let match;
while ((match = letterSectionRegex.exec(content)) !== null) {
  const letter = match[1];
  const sectionContent = match[0];
  
  manifest.letters[letter] = {
    count: 0,
    words: []
  };
  
  let wordMatch;
  while ((wordMatch = wordRegex.exec(sectionContent)) !== null) {
    const word = wordMatch[1];
    const wordPath = wordMatch[2];
    
    manifest.letters[letter].words.push({
      word: word,
      path: wordPath
    });
    manifest.letters[letter].count++;
    manifest.totalWords++;
  }
}

fs.writeFileSync('MASTER-DICTIONARY-MANIFEST.json', JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Generated manifest with ${manifest.totalWords} words.`);
