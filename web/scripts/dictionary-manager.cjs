#!/usr/bin/env node
/**
 * JaZeR Dictionary Manager
 * Unified tool for managing dictionary entries
 *
 * Usage: node dictionary-manager.js <command> [options]
 *
 * Commands:
 *   list          List all dictionary entries
 *   count         Show word count per letter
 *   cleanup       Run cleanup on all/specific letters
 *   validate      Validate dictionary structure
 *   export        Export word list to JSON
 *   stats         Show statistics
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = path.join(__dirname, '..', '..', 'knowledge_base', 'dictionary');
const OUTPUT_DIR = path.join(__dirname, '..', 'web', 'public', 'dictionary');

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Utility functions
function log(message, type = 'info') {
  const prefix = {
    info: 'ℹ',
    success: '✅',
    warn: '⚠️',
    error: '❌',
    step: '🔄'
  }[type] || 'ℹ';
  console.log(`${prefix} ${message}`);
}

function getLetterDir(letter) {
  return path.join(ROOT_DIR, letter);
}

function getOutputLetterDir(letter) {
  return path.join(OUTPUT_DIR, letter);
}

/**
 * Count words in a letter directory
 */
function countWords(letter) {
  const dir = getLetterDir(letter);
  if (!fs.existsSync(dir)) return 0;

  const wordsDir = path.join(dir, '01_Words');
  if (!fs.existsSync(wordsDir)) return 0;

  return fs.readdirSync(wordsDir).filter(f =>
    fs.statSync(path.join(wordsDir, f)).isDirectory()
  ).length;
}

/**
 * Get all words across all letters
 */
function getAllWords() {
  const words = [];

  for (const letter of ALPHABET) {
    const dir = getLetterDir(letter);
    if (!fs.existsSync(dir)) continue;

    const wordsDir = path.join(dir, '01_Words');
    if (!fs.existsSync(wordsDir)) continue;

    const wordDirs = fs.readdirSync(wordsDir).filter(f =>
      fs.statSync(path.join(wordsDir, f)).isDirectory()
    );

    for (const word of wordDirs) {
      const wordPath = path.join(wordsDir, word, 'word.md');
      const metadata = parseWordFile(wordPath);
      words.push({
        name: word,
        letter,
        ...metadata
      });
    }
  }

  return words;
}

/**
 * Parse word markdown file
 */
function parseWordFile(filePath) {
  const sections = {
    syllables: 0,
    tags: [],
    synonyms: [],
    rhymes: ''
  };

  try {
    if (!fs.existsSync(filePath)) return sections;

    const content = fs.readFileSync(filePath, 'utf8');
    const parts = content.split(/^##\s+/m);

    parts.forEach(part => {
      const firstLineEnd = part.indexOf('\n');
      if (firstLineEnd === -1) return;

      const header = part.substring(0, firstLineEnd).trim().toLowerCase().replace(':', '');
      const body = part.substring(firstLineEnd).trim();

      if (header.includes('meaning') && !header.includes('plain')) {
        sections.rapDefinition = body;
      } else if (header.includes('plain') || header.includes('definition')) {
        sections.definition = body;
      } else if (header.includes('syllables')) {
        sections.syllables = parseInt(body.split(' ')[0]) || 0;
      } else if (header.includes('tags')) {
        sections.tags = body.split(',').map(s => s.trim()).filter(Boolean);
      } else if (header.includes('synonyms')) {
        sections.synonyms = body.split(',').map(s => s.trim()).filter(Boolean);
      } else if (header.includes('rhyme')) {
        sections.rhymes = body;
      }
    });
  } catch (e) {
    // Return default sections on error
  }

  return sections;
}

/**
 * Command: list
 */
function cmdList(options) {
  const { letter, limit = 50 } = options;

  if (letter) {
    // List specific letter
    const wordsDir = path.join(getLetterDir(letter), '01_Words');
    if (!fs.existsSync(wordsDir)) {
      log(`Letter ${letter} not found`, 'error');
      return;
    }

    const words = fs.readdirSync(wordsDir).filter(f =>
      fs.statSync(path.join(wordsDir, f)).isDirectory()
    );

    console.log(`Words in ${letter}:`);
    words.slice(0, limit).forEach(word => console.log(`  - ${word}`));

    if (words.length > limit) {
      console.log(`  ... and ${words.length - limit} more`);
    }
  } else {
    // List all letters with counts
    console.log('Dictionary word counts:');
    console.log('');

    let total = 0;
    for (const letter of ALPHABET) {
      const count = countWords(letter);
      if (count > 0) {
        const bar = '█'.repeat(Math.min(count / 50, 40));
        console.log(`  ${letter}: ${String(count).padStart(4)} ${bar}`);
        total += count;
      }
    }
    console.log('');
    console.log(`  Total: ${total} words`);
  }
}

/**
 * Command: count
 */
function cmdCount() {
  console.log('Word count per letter:');
  console.log('');

  let total = 0;
  for (const letter of ALPHABET) {
    const count = countWords(letter);
    if (count > 0) {
      console.log(`  ${letter}: ${count}`);
      total += count;
    }
  }
  console.log('');
  console.log(`  Total: ${total} words`);
}

/**
 * Command: cleanup
 */
function cmdCleanup(options) {
  const { letter, all } = options;

  log('Starting dictionary cleanup...', 'step');

  const lettersToClean = all ? ALPHABET : (letter ? [letter] : []);

  for (const l of lettersToClean) {
    const wordsDir = path.join(getLetterDir(l), '01_Words');
    if (!fs.existsSync(wordsDir)) continue;

    const words = fs.readdirSync(wordsDir).filter(f =>
      fs.statSync(path.join(wordsDir, f)).isDirectory()
    );

    let cleaned = 0;
    for (const word of words) {
      const wordPath = path.join(wordsDir, word, 'word.md');

      // Check if file exists and is valid
      if (!fs.existsSync(wordPath)) {
        log(`  Missing: ${word}`, 'warn');
        continue;
      }

      const content = fs.readFileSync(wordPath, 'utf8');

      // Basic validation
      if (content.length < 50) {
        log(`  Empty/short: ${word}`, 'warn');
      }

      cleaned++;
    }

    log(`  ${l}: ${cleaned} words processed`, 'success');
  }

  log('Cleanup complete', 'success');
}

/**
 * Command: validate
 */
function cmdValidate(options) {
  const { letter } = options;
  const lettersToValidate = letter ? [letter] : ALPHABET;

  let errors = 0;
  let warnings = 0;

  console.log('Validating dictionary...');
  console.log('');

  for (const l of lettersToValidate) {
    const wordsDir = path.join(getLetterDir(l), '01_Words');
    if (!fs.existsSync(wordsDir)) continue;

    const words = fs.readdirSync(wordsDir).filter(f =>
      fs.statSync(path.join(wordsDir, f)).isDirectory()
    );

    for (const word of words) {
      const wordPath = path.join(wordsDir, word, 'word.md');

      if (!fs.existsSync(wordPath)) {
        log(`  ${l}/${word}: Missing word.md`, 'error');
        errors++;
        continue;
      }

      const content = fs.readFileSync(wordPath, 'utf8');

      // Check for required sections
      if (!content.includes('## Definition')) {
        log(`  ${l}/${word}: Missing Definition section`, 'warn');
        warnings++;
      }

      if (!content.includes('## Syllables')) {
        log(`  ${l}/${word}: Missing Syllables section`, 'warn');
        warnings++;
      }
    }
  }

  console.log('');
  console.log(`  Errors: ${errors}`);
  console.log(`  Warnings: ${warnings}`);

  if (errors === 0) {
    log('Validation passed!', 'success');
  } else {
    log('Validation failed', 'error');
  }
}

/**
 * Command: export
 */
function cmdExport(options) {
  const { output } = options;

  log('Exporting dictionary...', 'step');

  const words = getAllWords();
  const exportPath = output || path.join(__dirname, '..', 'dictionary-export.json');

  fs.writeFileSync(exportPath, JSON.stringify({
    exportedAt: new Date().toISOString(),
    totalWords: words.length,
    words
  }, null, 2));

  log(`Exported ${words.length} words to ${exportPath}`, 'success');
}

/**
 * Command: stats
 */
function cmdStats() {
  const words = getAllWords();

  // Calculate statistics
  const syllablesStats = words.reduce((acc, w) => {
    acc[w.syllables] = (acc[w.syllables] || 0) + 1;
    return acc;
  }, {});

  const allTags = words.flatMap(w => w.tags || []);
  const tagStats = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const topTags = Object.entries(tagStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  console.log('Dictionary Statistics');
  console.log('═════════════════════════════════════');
  console.log('');
  console.log(`  Total Words: ${words.length}`);
  console.log('');
  console.log('  Syllables Distribution:');
  for (const [syllables, count] of Object.entries(syllablesStats).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    console.log(`    ${syllables} syllable${syllables !== '1' ? 's' : ''}: ${count}`);
  }
  console.log('');
  console.log('  Top 10 Tags:');
  for (const [tag, count] of topTags) {
    console.log(`    #${tag}: ${count}`);
  }
  console.log('');
}

// Main command router
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  const options = {
    letter: args.find(a => /^[A-Z]$/i.test(a))?.toUpperCase(),
    all: args.includes('--all') || args.includes('-a'),
    limit: parseInt(args.find(a => /--limit=\d+/.test(a))?.split('=')[1] || '50'),
    output: args.find(a => a.startsWith('--output='))?.split('=')[1]
  };

  switch (command) {
    case 'list':
      cmdList(options);
      break;

    case 'count':
      cmdCount();
      break;

    case 'cleanup':
      cmdCleanup(options);
      break;

    case 'validate':
      cmdValidate(options);
      break;

    case 'export':
      cmdExport(options);
      break;

    case 'stats':
      cmdStats();
      break;

    case 'help':
    default:
      console.log(`
JaZeR Dictionary Manager

Usage: node dictionary-manager.js <command> [options]

Commands:
  list [letter]      List words (optionally for specific letter)
  count              Show word count per letter
  cleanup [letter]   Run cleanup on all or specific letter
  validate [letter]  Validate dictionary structure
  export [--output]  Export word list to JSON
  stats              Show statistics

Options:
  --all, -a          Apply to all letters
  --limit=N          Limit output (default: 50)
  --output=PATH      Output file path for export

Examples:
  node dictionary-manager.js list A
  node dictionary-manager.js count
  node dictionary-manager.js cleanup --all
  node dictionary-manager.js validate
  node dictionary-manager.js stats
`);
      break;
  }
}

main();
