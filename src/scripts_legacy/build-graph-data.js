const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const outputDocs = path.join(__dirname, '../web/public/graph_data.json');

const nodes = [];
const links = [];
const idMap = new Set();

function traverseDir(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (item.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const entity = JSON.parse(content);
        
        // Add Node
        if (!idMap.has(entity.id)) {
            nodes.push({
                id: entity.id,
                name: entity.name,
                type: entity.type || entity.place_type || 'unknown',
                group: entity.type || 'default',
                val: 1 // Default size
            });
            idMap.add(entity.id);
        }

        // Add Links (from related_ids)
        if (entity.related_ids && Array.isArray(entity.related_ids)) {
            entity.related_ids.forEach(relId => {
                links.push({
                    source: entity.id,
                    target: relId
                });
            });
        }
        
        // Add Links (from typed relations if implementing that later)

      } catch (err) {
        console.error(`Error processing ${item}:`, err);
      }
    }
  });
}

console.log('Building graph data...');
traverseDir(dataDir);

const graphData = {
    nodes,
    links
};

fs.writeFileSync(outputDocs, JSON.stringify(graphData, null, 2));
console.log(`Graph data written to ${outputDocs}: ${nodes.length} nodes, ${links.length} links.`);
