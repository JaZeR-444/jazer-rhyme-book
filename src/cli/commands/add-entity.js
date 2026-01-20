/**
 * Command: add-entity
 * Interactively adds a new entity to a domain
 */

const fs = require('fs');
const path = require('path');
const ui = require('../lib/ui');
const prompts = require('../lib/prompts');

module.exports = async function(config, domainArg) {
  const { DATA_DIR } = config;

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

  let domain = domainArg;
  if (!domain) {
    ui.log('Available domains:', 'info');
    domains.forEach((d, i) => console.log(`  ${i + 1}. ${d}`));
    domain = await prompts.askQuestion('\nEnter domain name or number: ');
  }

  // Handle number selection
  const domainNum = parseInt(domain);
  if (!isNaN(domainNum) && domainNum > 0 && domainNum <= domains.length) {
    domain = domains[domainNum - 1];
  }

  if (!domains.includes(domain)) {
    const createNew = await prompts.askQuestion(`Domain "${domain}" doesn't exist. Create it? (y/n): `);
    if (createNew.toLowerCase() !== 'y') {
      ui.log('Cancelled', 'warn');
      return;
    }

    // Create domain directory
    const domainPath = path.join(DATA_DIR, domain);
    fs.mkdirSync(path.join(domainPath, 'entities'), { recursive: true });
    fs.mkdirSync(path.join(domainPath, 'indexes'), { recursive: true });
    fs.mkdirSync(path.join(domainPath, 'relations'), { recursive: true });
    ui.log(`Created domain: ${domain}`, 'success');
  }

  // Get entity details
  const name = await prompts.askQuestion('Entity name: ');
  const id = prompts.slugify(name);
  const type = await prompts.askQuestion('Entity type (person, concept, tool, etc.): ') || 'person';
  const description = await prompts.askQuestion('Description: ');
  const era = await prompts.askQuestion('Era (e.g., 1990s, 2010s-Present): ') || '';
  const tags = await prompts.askQuestion('Tags (comma-separated): ');

  const aliasesStr = await prompts.askQuestion('Aliases (comma-separated, optional): ');
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
  ui.log(`Created entity: ${entityPath}`, 'success');
};
