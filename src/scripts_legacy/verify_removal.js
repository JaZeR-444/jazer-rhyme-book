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

// Check the exact path where the files exist
const dictPath = path.join(__dirname, 'web', 'public', 'dictionary');

console.log(`Checking dictionary path: ${dictPath}`);
console.log(`Path exists: ${fs.existsSync(dictPath)}\n`);

let removedCount = 0;
let failedCount = 0;

for (const word of wordsToRemove) {
  const letter = word[0].toUpperCase();
  const wordDirPath = path.join(dictPath, letter, '01_Words', word);
  
  console.log(`Checking: ${wordDirPath}`);
  
  if (fs.existsSync(wordDirPath)) {
    console.log(`  -> Found, attempting to remove...`);
    try {
      fs.rmSync(wordDirPath, { recursive: true, force: true });
      console.log(`  -> Successfully removed`);
      removedCount++;
    } catch (error) {
      console.error(`  -> ERROR: ${error.message}`);
      failedCount++;
    }
  } else {
    console.log(`  -> Not found`);
  }
}

console.log(`\nSummary:`);
console.log(`- Successfully removed: ${removedCount}`);
console.log(`- Failed to remove: ${failedCount}`);
console.log(`- Total processed: ${wordsToRemove.length}`);