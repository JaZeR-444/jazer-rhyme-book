/**
 * Command: add-word
 * Interactively adds a new word to the dictionary
 */

const fs = require('fs');
const path = require('path');
const ui = require('../lib/ui');
const prompts = require('../lib/prompts');

module.exports = async function(config, letterArg) {
  const { DICT_DIR } = config;

  let letter = letterArg;
  if (!letter) {
    letter = await prompts.askQuestion('Enter letter (A-Z): ');
  }
  letter = letter.toUpperCase().charAt(0);

  if (!/^[A-Z]$/.test(letter)) {
    ui.log('Invalid letter', 'error');
    return;
  }

  // Get word details
  const name = await prompts.askQuestion('Word name: ');
  if (!name) {
    ui.log('Word name is required', 'error');
    return;
  }

  const syllables = await prompts.askQuestion('Syllables (number): ');
  const definition = await prompts.askQuestion('Definition (plain English): ');
  const rapDefinition = await prompts.askQuestion('Rap meaning/context: ');
  const tags = await prompts.askQuestion('Tags (comma-separated): ');
  const rhymes = await prompts.askQuestion('Rhyme ideas (comma-separated): ');
  const synonyms = await prompts.askQuestion('Synonyms (comma-separated): ');

  // Create directory structure
  const letterDir = path.join(DICT_DIR, letter);
  fs.mkdirSync(letterDir, { recursive: true });
  fs.mkdirSync(path.join(letterDir, '01_Words'), { recursive: true });
  fs.mkdirSync(path.join(letterDir, '02_Phrases'), { recursive: true });
  fs.mkdirSync(path.join(letterDir, '03_Rhymes'), { recursive: true });

  // Create word directory
  const wordDir = path.join(letterDir, '01_Words', name.toLowerCase());
  fs.mkdirSync(wordDir, { recursive: true });

  // Create word.md
  const wordContent = `# ${name}

**Syllables:** ${syllables || 'TBD'}

## Definition (Plain English)

${definition || 'TBD'}

## Rap Meaning / Context

${rapDefinition || 'TBD'}

## Tags

${tags ? tags.split(',').map(t => `- ${t.trim()}`).join('\n') : '- TBD'}

## Rhymes

${rhymes ? rhymes.split(',').map(r => `- ${r.trim()}`).join('\n') : '- TBD'}

## Synonyms

${synonyms ? synonyms.split(',').map(s => s.trim()).join(', ') : 'TBD'}

## Examples

- Example usage 1
- Example usage 2

## Notes

Add any additional notes here.
`;

  const wordPath = path.join(wordDir, 'word.md');
  fs.writeFileSync(wordPath, wordContent);
  ui.log(`Created word: ${wordPath}`, 'success');
};
