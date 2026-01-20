/**
 * Command: status
 * Shows the current project statistics
 */

const fs = require('fs');
const path = require('path');
const ui = require('../lib/ui');

module.exports = function(config) {
  const { DATA_DIR, DICT_DIR } = config;
  
  ui.header('📊 JaZeR Rhyme Book Status');

  // Helper to get domains
  function getDomains() {
    if (!fs.existsSync(DATA_DIR)) return [];
    return fs.readdirSync(DATA_DIR)
      .filter(item => {
        const itemPath = path.join(DATA_DIR, item);
        return fs.statSync(itemPath).isDirectory() && !item.startsWith('_');
      });
  }

  // Count domains
  const domains = getDomains();
  console.log(`  ${ui.icons.domain} Domains: ${domains.length}`);
  console.log(`     ${ui.colors.dim}${domains.join(', ')}${ui.colors.reset}`);

  // Count entities
  let totalEntities = 0;
  for (const domain of domains) {
    const entitiesDir = path.join(DATA_DIR, domain, 'entities');
    if (fs.existsSync(entitiesDir)) {
      const count = fs.readdirSync(entitiesDir).filter(f => f.endsWith('.json')).length;
      totalEntities += count;
    }
  }
  console.log(`  ${ui.icons.entity} Entities: ${totalEntities}`);

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
  console.log(`  ${ui.icons.word} Words: ${totalWords}`);

  console.log('');
};
