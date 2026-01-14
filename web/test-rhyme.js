import { getRhymeScheme } from './src/lib/rhymeFinder.js';

console.log("Starting Rhyme Test...");
try {
    const word = "test";
    console.log(`Getting rhyme scheme for '${word}'...`);
    const scheme = getRhymeScheme(word);
    console.log("Result:", scheme);
} catch (e) {
    console.error("CRASH DETECTED:");
    console.error(e);
}
