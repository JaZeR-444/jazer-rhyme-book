/**
 * Real Knowledge Hub Data Loader
 * ===============================
 * 
 * Loads ALL entity JSON files from @data (../data/) using Vite's import.meta.glob
 * This happens at BUILD TIME so all data is bundled.
 */

// Use Vite alias to access parent directory data
// The @data alias is configured in vite.config.js
const entityModules = import.meta.glob('@data/*/entities/*.json', { eager: true });

// Process into usable format
const allEntities = [];
const domainMap = {};

for (const [path, module] of Object.entries(entityModules)) {
  // Extract domain from path like "@data/music/entities/kendrick-lamar.json"
  const pathParts = path.split('/');
  // Find the position after @data
  const dataIndex = pathParts.findIndex(p => p === '@data' || p.includes('data'));
  const domain = pathParts[dataIndex + 1] || pathParts[1]; // Gets "music"
  
  const entity = module.default || module;
  
  // Skip if no data
  if (!entity || !entity.id) continue;
  
  // Add domain to entity if not present
  if (!entity.domain) {
    entity.domain = domain;
  }
  
  // Add to domain map
  if (!domainMap[domain]) {
    domainMap[domain] = [];
  }
  domainMap[domain].push(entity);
  allEntities.push(entity);
}

// Export organized data
export const entities = allEntities;
export const domains = domainMap;
export const domainNames = Object.keys(domainMap).sort();

// Stats
export const stats = {
  totalEntities: allEntities.length,
  totalDomains: Object.keys(domainMap).length,
  byDomain: Object.fromEntries(
    Object.entries(domainMap).map(([k, v]) => [k, v.length])
  ),
};

// Search function
export function searchEntities(query, options = {}) {
  const { domain = null, limit = 50 } = options;
  const q = query.toLowerCase();
  
  let results = allEntities;
  
  // Filter by domain if specified
  if (domain) {
    results = results.filter(e => e.domain === domain);
  }
  
  // Search in name, aliases, tags, one_liner
  results = results.filter(e => {
    const name = (e.name || '').toLowerCase();
    const aliases = (e.aliases || []).join(' ').toLowerCase();
    const tags = (e.tags || []).join(' ').toLowerCase();
    const oneLiner = (e.one_liner || '').toLowerCase();
    
    return name.includes(q) || aliases.includes(q) || tags.includes(q) || oneLiner.includes(q);
  });
  
  return results.slice(0, limit);
}

// Get entity by ID
export function getEntityById(id) {
  return allEntities.find(e => e.id === id);
}

// Get entity with domain by ID (cross-domain search)
export function findEntityById(id) {
  const entity = allEntities.find(e => e.id === id);
  if (!entity) return null;
  return {
    entity,
    domain: entity.domain || entity.type,
  };
}

// Get multiple entities by IDs with their domains
export function findEntitiesByIds(ids) {
  return ids.map(id => findEntityById(id)).filter(Boolean);
}

// Get random entities
export function getRandomEntities(count = 5, domain = null) {
  let pool = domain ? domainMap[domain] || [] : allEntities;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get all entities with their domains
export function getAllEntities() {
  return allEntities.map(entity => ({
    entity,
    domain: entity.domain || entity.type
  }));
}

console.log(`[Knowledge Hub] Loaded ${stats.totalEntities} entities from ${stats.totalDomains} domains`);
