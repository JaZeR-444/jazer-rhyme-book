/**
 * Build Knowledge Hub Data
 * ========================
 * 
 * This script aggregates all entity JSON files from ../data/
 * into a single combined index for the web frontend.
 * 
 * Run: node scripts/buildData.js
 * Output: public/data/knowledge-hub.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_ROOT = path.join(__dirname, '../../data');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'knowledge-hub.json');

// Domains to scan (folders in data/)
const DOMAINS = [
  'music',
  'people',
  'lingo',
  'tech',
  'fashion',
  'cinema',
  'brands',
  'sports',
  'history',
  'philosophy-ideas',
  'aesthetics-visuals',
  'architecture-spaces',
  'business-economics',
  'emotions-states',
  'internet-culture',
  'media-platforms',
  'mythology-legend',
  'places',
  'rituals-symbols',
  'science-future',
  'time-energy',
  'vehicles',
  'weapons-objects',
  'writing-tools',
];

async function loadDomainEntities(domain) {
  const entitiesDir = path.join(DATA_ROOT, domain, 'entities');
  
  if (!fs.existsSync(entitiesDir)) {
    console.warn(`  ⚠ No entities folder for domain: ${domain}`);
    return [];
  }
  
  const files = fs.readdirSync(entitiesDir).filter(f => f.endsWith('.json'));
  const entities = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(entitiesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const entity = JSON.parse(content);
      
      // Add domain if not present
      if (!entity.domain) {
        entity.domain = domain;
      }
      
      entities.push(entity);
    } catch (err) {
      console.error(`  ✗ Failed to parse ${file}:`, err.message);
    }
  }
  
  return entities;
}

async function buildKnowledgeHub() {
  console.log('🔨 Building Knowledge Hub data...\n');
  
  const hub = {
    buildTime: new Date().toISOString(),
    domains: {},
    allEntities: [],
    stats: {
      totalDomains: 0,
      totalEntities: 0,
      byDomain: {},
    },
  };
  
  for (const domain of DOMAINS) {
    console.log(`📂 Loading domain: ${domain}`);
    const entities = await loadDomainEntities(domain);
    
    if (entities.length > 0) {
      hub.domains[domain] = entities;
      hub.allEntities.push(...entities);
      hub.stats.byDomain[domain] = entities.length;
      hub.stats.totalDomains++;
      hub.stats.totalEntities += entities.length;
      console.log(`  ✓ Loaded ${entities.length} entities`);
    }
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Write combined data
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(hub, null, 2));
  
  console.log('\n✅ Knowledge Hub built successfully!');
  console.log(`   Domains: ${hub.stats.totalDomains}`);
  console.log(`   Entities: ${hub.stats.totalEntities}`);
  console.log(`   Output: ${OUTPUT_FILE}`);
}

buildKnowledgeHub().catch(console.error);
