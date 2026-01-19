#!/usr/bin/env node
/**
 * JaZeR Hub Builder
 * Unified build script that syncs data, builds indexes, and generates manifests
 *
 * Usage: node prepare-hub.js [--quick] [--skip-indexes] [--skip-manifests]
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// Configuration
const ROOT_DIR = path.join(__dirname, '..', '..');
const KNOWLEDGE_BASE_DIR = path.join(ROOT_DIR, 'knowledge_base');
const WEB_PUBLIC_DIR = path.join(ROOT_DIR, 'web', 'public');
const DATA_SOURCE_DIR = path.join(KNOWLEDGE_BASE_DIR, 'data');
const DICT_SOURCE_DIR = path.join(KNOWLEDGE_BASE_DIR, 'dictionary');

// Parse arguments
const args = process.argv.slice(2);
const options = {
  quick: args.includes('--quick'),
  skipIndexes: args.includes('--skip-indexes'),
  skipManifests: args.includes('--skip-manifests'),
  verbose: args.includes('--verbose') || args.includes('-v')
};

// Utility functions
function log(message, type = 'info') {
  const prefix = {
    info: 'ℹ',
    success: '✅',
    warn: '⚠️',
    error: '❌',
    step: '🔄'
  }[type] || 'ℹ';
  console.log(`${prefix} ${message}`);
}

function logTime(label) {
  if (options.verbose) {
    console.time(label);
  }
}

function logTimeEnd(label) {
  if (options.verbose) {
    console.timeEnd(label);
  }
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * Recursively copy directory
 */
function copyDir(src, dest, options = {}) {
  const { skipPatterns = ['node_modules', '.git', 'tmpclaude'], extensions = null } = options;

  if (!fs.existsSync(src)) {
    log(`Source not found: ${src}`, 'warn');
    return 0;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  let fileCount = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    // Skip patterns
    if (skipPatterns.some(pattern => entry.name.includes(pattern))) {
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fileCount += copyDir(srcPath, destPath, options);
    } else {
      // Filter by extension if specified
      if (extensions && !extensions.includes(path.extname(entry.name).toLowerCase())) {
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
      fileCount++;
    }
  }

  return fileCount;
}

/**
 * Build indexes for a domain
 */
function buildDomainIndexes(domainPath) {
  const entitiesDir = path.join(domainPath, 'entities');
  const indexesDir = path.join(domainPath, 'indexes');

  if (!fs.existsSync(entitiesDir)) return null;

  // Ensure indexes directory exists
  if (!fs.existsSync(indexesDir)) {
    fs.mkdirSync(indexesDir, { recursive: true });
  }

  const aliasMap = {};
  const byTag = {};
  const byEra = {};

  const entities = fs.readdirSync(entitiesDir).filter(f => f.endsWith('.json'));

  entities.forEach(file => {
    try {
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
    } catch (e) {
      log(`Error processing ${file}: ${e.message}`, 'warn');
    }
  });

  fs.writeFileSync(path.join(indexesDir, 'alias_map.json'), JSON.stringify(aliasMap, null, 2));
  fs.writeFileSync(path.join(indexesDir, 'by_tag.json'), JSON.stringify(byTag, null, 2));
  fs.writeFileSync(path.join(indexesDir, 'by_era.json'), JSON.stringify(byEra, null, 2));

  return entities.length;
}

/**
 * Generate dictionary manifest and metadata
 */
function generateDictionaryManifest(dictDest) {
  const letters = fs.readdirSync(dictDest, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && /^[A-Z]$/.test(entry.name))
    .map(entry => entry.name)
    .sort();

  const allWords = [];

  // Parsing function for word files
  const parseWordFile = (filePath) => {
    try {
      if (!fs.existsSync(filePath)) return null;
      const content = fs.readFileSync(filePath, 'utf8');
      const sections = {};
      const parts = content.split(/^##\s+/m);

      parts.forEach(part => {
        const firstLineEnd = part.indexOf('\n');
        if (firstLineEnd === -1) return;

        const header = part.substring(0, firstLineEnd).trim().toLowerCase().replace(':', '');
        const body = part.substring(firstLineEnd).trim();

        if (header.includes('meaning (plain)')) sections.d = body;
        else if (header.includes('rap meaning')) sections.rd = body;
        else if (header.includes('syllables')) sections.s = parseInt(body.split(' ')[0]) || 0;
        else if (header.includes('synonyms')) sections.syn = body.split(',').map(s => s.trim()).filter(Boolean);
        else if (header.includes('tags')) sections.t = body.split(',').map(s => s.trim()).filter(Boolean);
        else if (header.includes('rhyme ideas')) sections.r = body;
      });
      return sections;
    } catch (e) {
      return null;
    }
  };

  // Process each letter
  for (const letter of letters) {
    const wordsDir = path.join(dictDest, letter, '01_Words');
    if (!fs.existsSync(wordsDir)) continue;

    const words = fs.readdirSync(wordsDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    const metadata = {};

    words.forEach(word => {
      allWords.push({ name: word, letter });
      const wordPath = path.join(wordsDir, word, 'word.md');
      const data = parseWordFile(wordPath);
      if (data) {
        metadata[word] = data;
      } else {
        metadata[word] = { s: 0 };
      }
    });

    // Write metadata.json
    fs.writeFileSync(
      path.join(dictDest, letter, 'metadata.json'),
      JSON.stringify(metadata, null, 0)
    );

    // Write legacy manifest
    fs.writeFileSync(
      path.join(dictDest, letter, 'words-manifest.json'),
      JSON.stringify({ words }, null, 2)
    );

    log(`Processed ${words.length} words for letter ${letter}`);
  }

  return { letters, words: allWords };
}

/**
 * Main build function
 */
async function build() {
  const startTime = performance.now();
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🏗️  JaZeR Hub Builder');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  const stats = {
    entities: 0,
    words: 0,
    domains: 0,
    letters: 0
  };

  try {
    // Step 1: Clean destination
    log('Cleaning destination directory...', 'step');
    if (fs.existsSync(WEB_PUBLIC_DIR)) {
      fs.rmSync(WEB_PUBLIC_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(WEB_PUBLIC_DIR, { recursive: true });
    log('Destination cleaned', 'success');

    // Step 2: Sync domains data
    log('Syncing knowledge base domains...', 'step');
    logTime('domain-sync');

    if (fs.existsSync(DATA_SOURCE_DIR)) {
      const domains = fs.readdirSync(DATA_SOURCE_DIR)
        .filter(item => {
          const itemPath = path.join(DATA_SOURCE_DIR, item);
          return fs.statSync(itemPath).isDirectory() && !item.startsWith('_');
        });

      const destDataDir = path.join(WEB_PUBLIC_DIR, 'data');

      for (const domain of domains) {
        const srcDir = path.join(DATA_SOURCE_DIR, domain);
        const destDir = path.join(destDataDir, domain);

        const count = copyDir(srcDir, destDir, {
          extensions: ['.json']
        });

        if (count > 0) {
          stats.entities += count;
          stats.domains++;
          log(`  Synced ${domain} (${count} files)`, 'success');
        }
      }

      logTimeEnd('domain-sync');
    } else {
      log('Knowledge base data directory not found', 'warn');
    }

    // Step 3: Build domain indexes
    if (!options.skipIndexes) {
      log('Building domain indexes...', 'step');
      logTime('index-build');

      const destDataDir = path.join(WEB_PUBLIC_DIR, 'data');
      if (fs.existsSync(destDataDir)) {
        const domains = fs.readdirSync(destDataDir)
          .filter(item => {
            const itemPath = path.join(destDataDir, item);
            return fs.statSync(itemPath).isDirectory();
          });

        for (const domain of domains) {
          const domainPath = path.join(destDataDir, domain);
          const result = buildDomainIndexes(domainPath);
          if (result) {
            log(`  Built indexes for ${domain}`, 'success');
          }
        }
      }

      logTimeEnd('index-build');
    } else {
      log('Skipping index build', 'warn');
    }

    // Step 4: Sync dictionary
    log('Syncing rap dictionary...', 'step');
    logTime('dict-sync');

    if (fs.existsSync(DICT_SOURCE_DIR)) {
      const destDictDir = path.join(WEB_PUBLIC_DIR, 'dictionary');
      copyDir(DICT_SOURCE_DIR, destDictDir, {
        extensions: ['.md', '.json']
      });

      // Generate dictionary manifest and metadata
      if (!options.skipManifests) {
        const result = generateDictionaryManifest(destDictDir);
        stats.words = result.words.length;
        stats.letters = result.letters.length;
        log(`  Generated manifests for ${stats.letters} letters`, 'success');
      }
    } else {
      log('Rap dictionary source not found', 'warn');
    }

    logTimeEnd('dict-sync');

    // Step 5: Generate main manifests
    if (!options.skipManifests) {
      log('Generating main manifests...', 'step');

      // Domain manifest
      const destDataDir = path.join(WEB_PUBLIC_DIR, 'data');
      if (fs.existsSync(destDataDir)) {
        const domains = fs.readdirSync(destDataDir, { withFileTypes: true })
          .filter(entry => entry.isDirectory() && !entry.name.startsWith('_'))
          .map(entry => entry.name);

        fs.writeFileSync(
          path.join(WEB_PUBLIC_DIR, 'domains-manifest.json'),
          JSON.stringify({ domains }, null, 2)
        );
        log('  Domain manifest generated', 'success');

        // Entity manifests
        for (const domain of domains) {
          const entitiesDir = path.join(destDataDir, domain, 'entities');
          if (fs.existsSync(entitiesDir)) {
            const entityFiles = fs.readdirSync(entitiesDir).filter(f => f.endsWith('.json'));
            fs.writeFileSync(
              path.join(destDataDir, domain, 'entities-manifest.json'),
              JSON.stringify({ files: entityFiles }, null, 2)
            );
          }
        }
        log('  Entity manifests generated', 'success');
      }
    } else {
      log('Skipping manifest generation', 'warn');
    }

    // Step 6: Create build info
    const buildInfo = {
      version: '1.0.0',
      builtAt: new Date().toISOString(),
      stats
    };
    fs.writeFileSync(
      path.join(WEB_PUBLIC_DIR, 'build-info.json'),
      JSON.stringify(buildInfo, null, 2)
    );

    // Summary
    const duration = performance.now() - startTime;
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  ✅ Build Complete!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log(`  📊 Stats:`);
    console.log(`     • Domains: ${stats.domains}`);
    console.log(`     • Entities: ${stats.entities}`);
    console.log(`     • Letters: ${stats.letters}`);
    console.log(`     • Words: ${stats.words}`);
    console.log('');
    console.log(`  ⏱️  Duration: ${formatDuration(duration)}`);
    console.log(`  📁 Output: ${WEB_PUBLIC_DIR}`);
    console.log('');

  } catch (error) {
    console.error('');
    log(`Build failed: ${error.message}`, 'error');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run build
build().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
