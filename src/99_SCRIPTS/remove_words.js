const fs = require('fs');

// Read the current word bank
const wordBank = JSON.parse(fs.readFileSync('./word_bank.json', 'utf8'));

// List of words to remove
const wordsToRemove = [
  "kraft",
  "wellington", 
  "bandwidth",
  "database",
  "derivative",
  "hardware",
  "integral",
  "interface",
  "linker",
  "quartile",
  "regression",
  "throughput",
  "variable",
  "variance",
  "compliance",
  "deposition",
  "injunction",
  "judicial",
  "judiciary",
  "jurisdiction",
  "quorum",
  "thereof",
  "whereas",
  "workgroup",
  "anon",
  "thee",
  "thou",
  "unto",
  "whilst",
  "yea",
  "arrogant",
  "gossip",
  "malice",
  "rumor",
  "useless",
  "vicious",
  "quark",
  "lux",
  "volt",
  "watt",
  "niche",
  "reduction",
  "abstract"
];

console.log(`Starting with ${wordBank.length} words in the word bank.`);

// Filter out the words to remove
const filteredWordBank = wordBank.filter(wordObj => {
  const wordName = wordObj.name.toLowerCase();
  return !wordsToRemove.includes(wordName);
});

const removedCount = wordBank.length - filteredWordBank.length;
console.log(`Removed ${removedCount} words from the word bank.`);

// Save the updated word bank
fs.writeFileSync('./word_bank.json', JSON.stringify(filteredWordBank, null, 2));

console.log('Updated word bank saved successfully!');
console.log(`New word count: ${filteredWordBank.length}`);