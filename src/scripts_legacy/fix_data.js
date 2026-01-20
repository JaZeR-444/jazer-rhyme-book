const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

function fixDir(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      fixDir(fullPath);
    } else if (item.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      let data;
      try {
        data = JSON.parse(content);
      } catch (e) {
        console.error(`Failed to parse ${fullPath}`);
        return;
      }

      let modified = false;

      // Fix sources
      if (Array.isArray(data.sources)) {
        const newSources = data.sources.map(s => {
          if (typeof s === 'string') {
            modified = true;
            return {
              title: s,
              url: "", // Placeholder
              type: "other",
              accessed_at: new Date().toISOString().split('T')[0]
            };
          }
          return s;
        });
        if (modified) data.sources = newSources;
      }

      // Fix type casing and pluralization
      if (data.type) {
        const oldType = data.type;
        let newType = oldType;

        if (newType === 'brands') newType = 'brand';
        if (newType === 'places') newType = 'place';
        if (newType === 'memes') newType = 'internet-culture';
        if (newType === 'techs') newType = 'tech';
        
        // Ensure matching base schema enums if obvious
        // We know 'brand', 'place', 'tech', 'people', 'music', etc.
        // If capitalize, lowercase?
        // But some might be camelCase? No, base schema enums are kebab-case/lowercase.
        
        if (newType !== oldType) {
            data.type = newType;
            modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
        console.log(`Fixed ${item}`);
      }
    }
  });
}

console.log('Starting data fix...');
fixDir(dataDir);
console.log('Complete.');
