const fs = require('fs');
const path = require('path');

// Words to remove from the definiteRemove list
const wordsToRemove = [
  "kraft", "wellington", "bandwidth", "database", "derivative", "hardware", 
  "integral", "interface", "linker", "quartile", "regression", "throughput", 
  "variable", "variance", "compliance", "deposition", "injunction", "judicial", 
  "judiciary", "jurisdiction", "quorum", "thereof", "whereas", "workgroup", 
  "anon", "thee", "thou", "unto", "whilst", "yea", "arrogant", "gossip", 
  "malice", "rumor", "useless", "vicious", "quark", "lux", "volt", "watt", 
  "niche", "reduction", "abstract"
];

// Function to get the first letter of a word (for directory structure)
function getLetterFromWord(word) {
  return word[0].toUpperCase();
}

// Counter for removed items
let removedCount = 0;
let notFoundCount = 0;

console.log('Starting removal process...\n');

// Loop through each word to remove
for (const word of wordsToRemove) {
  const letter = getLetterFromWord(word);
  const wordDirPath = path.join(__dirname, '..', letter, '01_Words', word);
  
  if (fs.existsSync(wordDirPath)) {
    try {
      fs.rmSync(wordDirPath, { recursive: true, force: true });
      console.log(`✓ Removed: ${wordDirPath}`);
      removedCount++;
    } catch (error) {
      console.error(`✗ Error removing ${wordDirPath}:`, error.message);
    }
  } else {
    console.log(`- Not found: ${wordDirPath}`);
    notFoundCount++;
  }
}

console.log('\nRemoval process completed!');
console.log(`Removed: ${removedCount} directories`);
console.log(`Not found: ${notFoundCount} directories`);

// Also check for the word.md files that might exist in a different structure
console.log('\nChecking for alternate file structure...');
const alternatePaths = [
  path.join(__dirname, '..', 'public', 'dictionary'),
  path.join(__dirname, '..', 'web', 'public', 'dictionary')
];

let foundInAlternate = 0;
for (const dictPath of alternatePaths) {
  if (fs.existsSync(dictPath)) {
    console.log(`Checking alternate path: ${dictPath}`);
    
    for (const word of wordsToRemove) {
      const letter = getLetterFromWord(word);
      const wordPath = path.join(dictPath, letter, '01_Words', word);
      
      if (fs.existsSync(wordPath)) {
        try {
          fs.rmSync(wordPath, { recursive: true, force: true });
          console.log(`✓ Removed from alternate: ${wordPath}`);
          foundInAlternate++;
        } catch (error) {
          console.error(`✗ Error removing ${wordPath}:`, error.message);
        }
      }
    }
  }
}

if (foundInAlternate > 0) {
  console.log(`Also removed ${foundInAlternate} items from alternate structure.`);
}