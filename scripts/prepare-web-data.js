/**
 * Prepare Web Data Script
 * Copies /data and /Rap_Dictionary_Master_Hub to /web/public for static serving
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const webPublicDir = path.join(rootDir, 'web', 'public');

// Ensure public directory exists
if (!fs.existsSync(webPublicDir)) {
  fs.mkdirSync(webPublicDir, { recursive: true });
}

/**
 * Recursively copy directory
 */
function copyDir(src, dest) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }
      copyDir(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('📦 Preparing web data...\n');

// Copy /data to /web/public/data
const dataSource = path.join(rootDir, 'data');
const dataDest = path.join(webPublicDir, 'data');

if (fs.existsSync(dataSource)) {
  console.log('  → Copying /data to /web/public/data...');
  copyDir(dataSource, dataDest);
  console.log('  ✓ Data copied successfully\n');
} else {
  console.warn('  ⚠ Warning: /data directory not found\n');
}

// Copy /Rap_Dictionary_Master_Hub to /web/public/dictionary
const dictionarySource = path.join(rootDir, 'Rap_Dictionary_Master_Hub');
const dictionaryDest = path.join(webPublicDir, 'dictionary');

if (fs.existsSync(dictionarySource)) {
  console.log('  → Copying /Rap_Dictionary_Master_Hub to /web/public/dictionary...');
  copyDir(dictionarySource, dictionaryDest);
  console.log('  ✓ Dictionary copied successfully\n');
} else {
  console.warn('  ⚠ Warning: /Rap_Dictionary_Master_Hub directory not found\n');
}

// Generate domain list manifest
console.log('  → Generating domain manifest...');
const domainsManifest = [];
if (fs.existsSync(dataDest)) {
  const domains = fs.readdirSync(dataDest, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('_'))
    .map(entry => entry.name);

  domainsManifest.push(...domains);

  fs.writeFileSync(
    path.join(webPublicDir, 'domains-manifest.json'),
    JSON.stringify({ domains: domainsManifest }, null, 2)
  );
  console.log('  ✓ Domain manifest generated\n');

  // Generate entity manifests for each domain
  console.log('  → Generating entity manifests for each domain...');
  for (const domain of domains) {
    const entitiesDir = path.join(dataDest, domain, 'entities');
    if (fs.existsSync(entitiesDir)) {
      const entityFiles = fs.readdirSync(entitiesDir)
        .filter(f => f.endsWith('.json'));

      fs.writeFileSync(
        path.join(dataDest, domain, 'entities-manifest.json'),
        JSON.stringify({ files: entityFiles }, null, 2)
      );
    }
  }
  console.log('  ✓ Entity manifests generated\n');
}

// Generate dictionary manifest
console.log('  → Generating dictionary manifest...');
if (fs.existsSync(dictionaryDest)) {
  const letters = fs.readdirSync(dictionaryDest, { withFileTypes: true })
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

  // Generate word manifests and metadata for each letter
  console.log('  → Generating word metadata for each letter (this may take a moment)...');
  for (const letter of letters) {
    const wordsDir = path.join(dictionaryDest, letter, '01_Words');
    if (fs.existsSync(wordsDir)) {
      const words = fs.readdirSync(wordsDir, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);

      const metadata = {};
      
      // Process each word to build metadata
      words.forEach(word => {
        allWords.push({ name: word, letter });
        const wordPath = path.join(wordsDir, word, 'word.md');
        const data = parseWordFile(wordPath);
        if (data) {
          metadata[word] = data;
        } else {
          metadata[word] = { s: 0 }; // Minimal fallback
        }
      });

      // Write metadata.json (Rich data for recommender)
      fs.writeFileSync(
        path.join(dictionaryDest, letter, 'metadata.json'),
        JSON.stringify(metadata, null, 0) // Minified to save space
      );

      // Write legacy manifest just in case
      fs.writeFileSync(
        path.join(dictionaryDest, letter, 'words-manifest.json'),
        JSON.stringify({ words }, null, 2)
      );
    }
  }

  // Write dictionary manifest with all words
  fs.writeFileSync(
    path.join(webPublicDir, 'dictionary-manifest.json'),
    JSON.stringify({ letters, words: allWords }, null, 2)
  );
  console.log('  ✓ Dictionary manifest generated\n');
  console.log('  ✓ Word manifests generated\n');
}

console.log('✅ Web data preparation complete!\n');
