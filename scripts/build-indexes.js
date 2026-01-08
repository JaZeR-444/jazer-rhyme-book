const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

function buildIndexesForDomain(domainPath) {
  const entitiesDir = path.join(domainPath, 'entities');
  const indexesDir = path.join(domainPath, 'indexes');

  if (!fs.existsSync(entitiesDir)) return;

  const aliasMap = {};
  const byTag = {};
  const byEra = {};

  const entities = fs.readdirSync(entitiesDir).filter(f => f.endsWith('.json'));

  entities.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(entitiesDir, file), 'utf8'));
    const id = data.id;

    // Alias Map
    if (data.aliases) {
      data.aliases.forEach(alias => {
        aliasMap[alias.toLowerCase()] = id;
      });
    }
    aliasMap[data.name.toLowerCase()] = id;

    // By Tag
    if (data.tags) {
      data.tags.forEach(tag => {
        if (!byTag[tag]) byTag[tag] = [];
        byTag[tag].push(id);
      });
    }

    // By Era
    if (data.era) {
      if (!byEra[data.era]) byEra[data.era] = [];
      byEra[data.era].push(id);
    }
  });

  fs.writeFileSync(path.join(indexesDir, 'alias_map.json'), JSON.stringify(aliasMap, null, 2));
  fs.writeFileSync(path.join(indexesDir, 'by_tag.json'), JSON.stringify(byTag, null, 2));
  fs.writeFileSync(path.join(indexesDir, 'by_era.json'), JSON.stringify(byEra, null, 2));
  
  console.log(`Updated indexes for ${path.basename(domainPath)}`);
}

const domains = fs.readdirSync(dataDir);
domains.forEach(domain => {
  const domainPath = path.join(dataDir, domain);
  if (fs.statSync(domainPath).isDirectory()) {
    buildIndexesForDomain(domainPath);
  }
});

console.log('Index build complete!');
