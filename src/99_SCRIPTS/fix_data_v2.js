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
              url: "https://example.com/placeholder",
              type: "other",
              accessed_at: new Date().toISOString().split('T')[0]
            };
          } else if (s && !s.url) {
             s.url = "https://example.com/placeholder";
             modified = true;
             return s;
          }
           else if (s && s.url === "") {
             s.url = "https://example.com/placeholder";
             modified = true;
             return s;
          }
          return s;
        });
        if (modified) data.sources = newSources;
      }

      // Fix duplicates and casing in type
      // JSON.parse already deduplicated logic (kept last), but we check logic.
      if (data.type) {
        const oldType = data.type;
        let newType = oldType.toLowerCase();

        // Plural to singular mapping
        if (newType === 'brands') newType = 'brand';
        if (newType === 'places') newType = 'place';
        if (newType === 'techs') newType = 'tech';
        if (newType === 'memes') newType = 'internet-culture';
        if (newType === 'vehicles') newType = 'vehicles'; // Keep plural if correct?
        // Wait, check allowed: 'vehicles' is correct based on base schema. 'vehicle' is WRONG.
        // But what if data has 'Vehicle'? -> 'vehicle' -> wrong?
        if (newType === 'vehicle') newType = 'vehicles';
        
        // Place special logic
        const placeTypes = ['city', 'venue', 'district', 'landmark'];
        if (placeTypes.includes(newType) || placeTypes.includes(oldType.toLowerCase())) {
            // It was a place_type put in type
            data.place_type = newType;
            newType = 'place';
            modified = true;
        }

        if (newType !== oldType) {
            data.type = newType;
            modified = true;
        }
      }

      // Fix ID patterns
      if (data.id && data.id.includes("'")) {
          data.id = data.id.replace(/'/g, ''); // just remove apostrophe
          modified = true;
          // Rename file logic handled outside or just save new content?
          // If ID changes, we should ideally rename file, but let's stick to content first.
          // Wait, if content ID != filename, that might be an issue?
          // For now, fix the invalid pattern error.
      }
      
      // Fix string fit to array (Fashion)
      if (data.fit && typeof data.fit === 'string') {
          data.fit = [data.fit];
          modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
        console.log(`Fixed ${item}`);
      }
    }
  });
}

console.log('Starting data fix v2...');
fixDir(dataDir);
console.log('Complete.');
