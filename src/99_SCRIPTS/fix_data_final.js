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

      if (data.type) {
        const oldType = data.type;
        let newType = oldType.toLowerCase();

        if (newType === 'meme') newType = 'internet-culture';
        if (newType === 'memes') newType = 'internet-culture';
        if (newType === 'person') newType = 'people';
        if (newType === 'weapon') newType = 'weapons-objects';
        if (newType === 'weapons') newType = 'weapons-objects';
        if (newType === 'object') newType = 'weapons-objects';
        if (newType === 'writing tool') newType = 'writing-tool'; // just in case

        if (newType !== oldType) {
            data.type = newType;
            modified = true;
        }
      }

      // Sanitize related_ids
      if (data.related_ids && Array.isArray(data.related_ids)) {
          const sanitized = data.related_ids.map(id => {
              // lowercase and replace invalid chars with nothing (like apostrophe) or hyphens?
              // The pattern is ^[a-z0-9-]+$.
              // Usually spaces -> hyphens. apostrophes -> remove.
              let newId = id.toLowerCase();
              newId = newId.replace(/'/g, '');
              newId = newId.replace(/\s+/g, '-');
              newId = newId.replace(/[^a-z0-9-]/g, '');
              if (newId !== id) modified = true;
              return newId;
          });
          if (modified) data.related_ids = sanitized;
      }

      if (modified) {
        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
        console.log(`Fixed ${item}`);
      }
    }
  });
}

console.log('Starting final data fix...');
fixDir(dataDir);
console.log('Final fix complete.');
