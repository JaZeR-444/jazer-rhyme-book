#!/usr/bin/env node
/**
 * JaZeR CLI
 * Command-line interface for managing the JaZeR Rhyme Book
 *
 * Usage: node jazer-cli.js <command> [options]
 *
 * Commands:
 *   add-entity <domain>    Add a new entity to a domain
 *   add-word <letter>      Add a new word to the dictionary
 *   validate               Validate all data
 *   build                  Build the web data
 *   status                 Show project status
 *   serve                  Start development server
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const ROOT_DIR = path.join(__dirname, '..', '..');
const KNOWLEDGE_BASE_DIR = path.join(ROOT_DIR, 'knowledge_base');
const DATA_DIR = path.join(KNOWLEDGE_BASE_DIR, 'data');
const DICT_DIR = path.join(KNOWLEDGE_BASE_DIR, 'dictionary');

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

function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getDomains() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR)
    .filter(item => {
      const itemPath = path.join(DATA_DIR, item);
      return fs.statSync(itemPath).isDirectory() && !item.startsWith('_');
    });
}

/**
 * Command: add-entity
 */
async function cmdAddEntity(domainArg) {
  const domains = getDomains();

  let domain = domainArg;
  if (!domain) {
    console.log('Available domains:');
    domains.forEach((d, i) => console.log(`  ${i + 1}. ${d}`));
    domain = await askQuestion('\nEnter domain name or number: ');
  }

  // Handle number selection
  const domainNum = parseInt(domain);
  if (!isNaN(domainNum) && domainNum > 0 && domainNum <= domains.length) {
    domain = domains[domainNum - 1];
  }

  if (!domains.includes(domain)) {
    const createNew = await askQuestion(`Domain "${domain}" doesn't exist. Create it? (y/n): `);
    if (createNew.toLowerCase() !== 'y') {
      log('Cancelled', 'warn');
      return;
    }

    // Create domain directory
    const domainPath = path.join(DATA_DIR, domain);
    fs.mkdirSync(path.join(domainPath, 'entities'), { recursive: true });
    fs.mkdirSync(path.join(domainPath, 'indexes'), { recursive: true });
    fs.mkdirSync(path.join(domainPath, 'relations'), { recursive: true });
    log(`Created domain: ${domain}`, 'success');
  }

  // Get entity details
  const name = await askQuestion('Entity name: ');
  const id = slugify(name);
  const type = await askQuestion('Entity type (person, concept, tool, etc.): ') || 'person';
  const description = await askQuestion('Description: ');
  const era = await askQuestion('Era (e.g., 1990s, 2010s-Present): ') || '';
  const tags = await askQuestion('Tags (comma-separated): ');

  const aliasesStr = await askQuestion('Aliases (comma-separated, optional): ');
  const aliases = aliasesStr.split(',').map(a => a.trim()).filter(Boolean);

  const entity = {
    id,
    name,
    type,
    description,
    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    aliases,
    era,
    related_ids: [],
    sources: [],
    metadata: {
      added: new Date().toISOString().split('T')[0],
      verified: false
    }
  };

  // Save entity
  const entityPath = path.join(DATA_DIR, domain, 'entities', `${id}.json`);
  fs.writeFileSync(entityPath, JSON.stringify(entity, null, 2));
  log(`Created entity: ${entityPath}`, 'success');
}

/**
 * Command: add-word
 */
async function cmdAddWord(letterArg) {
  let letter = letterArg;
  if (!letter) {
    letter = await askQuestion('Enter letter (A-Z): ');
  }
  letter = letter.toUpperCase().charAt(0);

  if (!/^[A-Z]$/.test(letter)) {
    log('Invalid letter', 'error');
    return;
  }

  // Get word details
  const name = await askQuestion('Word name: ');
  if (!name) {
    log('Word name is required', 'error');
    return;
  }

  const syllables = await askQuestion('Syllables (number): ');
  const definition = await askQuestion('Definition (plain English): ');
  const rapDefinition = await askQuestion('Rap meaning/context: ');
  const tags = await askQuestion('Tags (comma-separated): ');
  const rhymes = await askQuestion('Rhyme ideas (comma-separated): ');
  const synonyms = await askQuestion('Synonyms (comma-separated): ');

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
  log(`Created word: ${wordPath}`, 'success');
}

/**
 * Command: validate
 */
function cmdValidate() {
  log('Validating project data...', 'step');

  const issues = [];
  const domains = getDomains();

  // Check domains
  for (const domain of domains) {
    const entitiesDir = path.join(DATA_DIR, domain, 'entities');
    if (!fs.existsSync(entitiesDir)) {
      issues.push({ type: 'warning', message: `${domain}: No entities directory` });
      continue;
    }

    const entities = fs.readdirSync(entitiesDir).filter(f => f.endsWith('.json'));
    for (const entity of entities) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(entitiesDir, entity), 'utf8'));
        if (!data.id || !data.name) {
          issues.push({ type: 'error', message: `${domain}/${entity}: Missing id or name` });
        }
      } catch (e) {
        issues.push({ type: 'error', message: `${domain}/${entity}: Invalid JSON` });
      }
    }
  }

  // Check dictionary
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  for (const letter of letters) {
    const letterDir = path.join(DICT_DIR, letter);
    if (!fs.existsSync(letterDir)) continue;

    const wordsDir = path.join(letterDir, '01_Words');
    if (!fs.existsSync(wordsDir)) continue;

    const words = fs.readdirSync(wordsDir).filter(f =>
      fs.statSync(path.join(wordsDir, f)).isDirectory()
    );

    for (const word of words) {
      const wordPath = path.join(wordsDir, word, 'word.md');
      if (!fs.existsSync(wordPath)) {
        issues.push({ type: 'error', message: `${letter}/${word}: Missing word.md` });
      }
    }
  }

  // Report results
  if (issues.length === 0) {
    log('Validation passed! No issues found.', 'success');
  } else {
    const errors = issues.filter(i => i.type === 'error');
    const warnings = issues.filter(i => i.type === 'warning');

    console.log('');
    if (errors.length > 0) {
      console.log('Errors:');
      errors.forEach(i => log(i.message, 'error'));
    }
    if (warnings.length > 0) {
      console.log('Warnings:');
      warnings.forEach(i => log(i.message, 'warn'));
    }
    log(`Found ${issues.length} issue(s)`, errors.length > 0 ? 'error' : 'warn');
  }
}

/**
 * Command: build
 */
async function cmdBuild() {
  const prepareScript = path.join(ROOT_DIR, 'src', '99_SCRIPTS', 'prepare-hub.js');

  if (fs.existsSync(prepareScript)) {
    log('Running hub builder...', 'step');
    // Use require to run the script
    require(prepareScript);
  } else {
    log('Build script not found', 'error');
  }
}

/**
 * Command: status
 */
function cmdStatus() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  📊 JaZeR Rhyme Book Status');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  // Count domains
  const domains = getDomains();
  console.log(`  📁 Domains: ${domains.length}`);
  console.log(`     ${domains.join(', ')}`);

  // Count entities
  let totalEntities = 0;
  for (const domain of domains) {
    const entitiesDir = path.join(DATA_DIR, domain, 'entities');
    if (fs.existsSync(entitiesDir)) {
      const count = fs.readdirSync(entitiesDir).filter(f => f.endsWith('.json')).length;
      totalEntities += count;
    }
  }
  console.log(`  📝 Entities: ${totalEntities}`);

  // Count words
  let totalWords = 0;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  for (const letter of letters) {
    const letterDir = path.join(DICT_DIR, letter);
    if (!fs.existsSync(letterDir)) continue;

    const wordsDir = path.join(letterDir, '01_Words');
    if (!fs.existsSync(wordsDir)) continue;

    const count = fs.readdirSync(wordsDir).filter(f =>
      fs.statSync(path.join(wordsDir, f)).isDirectory()
    ).length;
    totalWords += count;
  }
  console.log(`  📖 Words: ${totalWords}`);

  console.log('');
}

/**
 * Command: serve
 */
function cmdServe() {
  log('Starting development server...', 'step');
  console.log('');
  console.log('  The web dev server should be started from the web directory:');
  console.log('    cd web && npm run dev');
  console.log('');
}

// Main command router
async function main() {
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'add-entity':
      await cmdAddEntity(process.argv[3]);
      break;

    case 'add-word':
      await cmdAddWord(process.argv[3]);
      break;

    case 'validate':
      cmdValidate();
      break;

    case 'build':
      await cmdBuild();
      break;

    case 'status':
      cmdStatus();
      break;

    case 'serve':
      cmdServe();
      break;

    case 'help':
    default:
      console.log(`
JaZeR CLI - Command-line interface for JaZeR Rhyme Book

Usage: node jazer-cli.js <command> [options]

Commands:
  add-entity [domain]   Add a new entity to a domain
  add-word [letter]     Add a new word to the dictionary
  validate              Validate all data
  build                 Build the web data
  status                Show project status
  serve                 Start development server

Examples:
  node jazer-cli.js add-entity music
  node jazer-cli.js add-word A
  node jazer-cli.js validate
  node jazer-cli.js status
`);
      break;
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
