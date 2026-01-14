/**
 * Rhyme Finder
 * Uses phonetic algorithms to find rhymes
 */

import * as metaphoneLib from 'metaphone';

// Robust import handling for different environments
let metaphone;
try {
  if (typeof metaphoneLib === 'function') {
    metaphone = metaphoneLib;
  } else if (metaphoneLib && typeof metaphoneLib.default === 'function') {
    metaphone = metaphoneLib.default;
  } else {
    // Attempt to find it or fallback
    metaphone = metaphoneLib;
  }
} catch (e) {
  console.warn('Error resolving metaphone:', e);
}

export function getRhymeScheme(word) {
  if (!word) return { perfect: '', ending: '', syllables: 0 };
  
  const cleaned = word.toLowerCase().trim();
  let perfect = '';

  try {
    if (typeof metaphone === 'function') {
      perfect = metaphone(cleaned);
    } else {
      // Fallback if metaphone isn't a function
      console.warn('Metaphone is not a function in getRhymeScheme', metaphone);
      perfect = cleaned; 
    }
  } catch (err) {
    console.warn(`Error generating metaphone for ${word}:`, err);
    perfect = cleaned; // Fallback
  }

  return {
    perfect,
    ending: getEndingSound(cleaned),
    syllables: countSyllables(cleaned),
  };
}

export function findRhymes(targetWord, wordList, options = {}) {
  const {
    perfectOnly = false,
    maxResults = 50,
    minSyllables = 1,
  } = options;

  const target = getRhymeScheme(targetWord);
  const rhymes = {
    perfect: [],
    near: [],
    assonance: [],
  };

  wordList.forEach(word => {
    if (word.toLowerCase() === targetWord.toLowerCase()) return;

    const candidate = getRhymeScheme(word);

    // Perfect rhyme: same phonetic ending
    if (candidate.perfect === target.perfect) {
      rhymes.perfect.push({ word, ...candidate });
    }
    // Near rhyme: similar ending sounds
    else if (!perfectOnly && candidate.ending === target.ending) {
      rhymes.near.push({ word, ...candidate });
    }
    // Assonance: similar vowel sounds
    else if (!perfectOnly && hasAssonance(word, targetWord)) {
      rhymes.assonance.push({ word, ...candidate });
    }
  });

  // Sort by syllable similarity
  const sortBySyllables = (arr) => 
    arr.sort((a, b) => 
      Math.abs(a.syllables - target.syllables) - Math.abs(b.syllables - target.syllables)
    );

  return {
    perfect: sortBySyllables(rhymes.perfect).slice(0, maxResults),
    near: sortBySyllables(rhymes.near).slice(0, maxResults),
    assonance: sortBySyllables(rhymes.assonance).slice(0, maxResults / 2),
    target: { word: targetWord, ...target },
  };
}

function getEndingSound(word) {
  // Get last 2-3 characters for ending sound
  return word.slice(-3).toLowerCase();
}

export function countSyllables(word) {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  
  // Remove silent e
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  // Count vowel groups
  const vowelMatches = word.match(/[aeiouy]{1,2}/g);
  return vowelMatches ? vowelMatches.length : 1;
}

function hasAssonance(word1, word2) {
  const vowels1 = word1.toLowerCase().match(/[aeiouy]/g) || [];
  const vowels2 = word2.toLowerCase().match(/[aeiouy]/g) || [];
  
  if (vowels1.length === 0 || vowels2.length === 0) return false;
  
  // Check if they share significant vowel sounds
  const shared = vowels1.filter(v => vowels2.includes(v));
  return shared.length >= Math.min(vowels1.length, vowels2.length) * 0.5;
}

export function getRhymeQuality(word1, word2) {
  const scheme1 = getRhymeScheme(word1);
  const scheme2 = getRhymeScheme(word2);

  if (scheme1.perfect === scheme2.perfect) return 'perfect';
  if (scheme1.ending === scheme2.ending) return 'near';
  if (hasAssonance(word1, word2)) return 'assonance';
  return 'none';
}
