/**
 * Command: validate
 * Validates all project data
 */

const fs = require('fs');
const path = require('path');
const ui = require('../lib/ui');

module.exports = function(config) {
  const { DATA_DIR, DICT_DIR } = config;
  ui.log('Validating project data...', 'step');

  const issues = [];

  // Helper to get domains
  function getDomains() {
    if (!fs.existsSync(DATA_DIR)) return [];
    return fs.readdirSync(DATA_DIR)
      .filter(item => {
        const itemPath = path.join(DATA_DIR, item);
        return fs.statSync(itemPath).isDirectory() && !item.startsWith('_');
      });
  }

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
    ui.log('Validation passed! No issues found.', 'success');
  } else {
    const errors = issues.filter(i => i.type === 'error');
    const warnings = issues.filter(i => i.type === 'warning');

    console.log('');
    if (errors.length > 0) {
      console.log('Errors:');
      errors.forEach(i => ui.log(i.message, 'error'));
    }
    if (warnings.length > 0) {
      console.log('Warnings:');
      warnings.forEach(i => ui.log(i.message, 'warn'));
    }
    ui.log(`Found ${issues.length} issue(s)`, errors.length > 0 ? 'error' : 'warn');
  }
};
