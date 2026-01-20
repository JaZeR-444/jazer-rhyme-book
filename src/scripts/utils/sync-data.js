const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
// Adjusted for new location: src/scripts/utils/sync-data.js
const rootDir = path.join(__dirname, '..', '..', '..');
const SOURCE_DATA = path.join(rootDir, 'knowledge_base', 'data');
const SOURCE_DICT = path.join(rootDir, 'knowledge_base', 'dictionary');
const DEST_PUBLIC_DATA = path.join(rootDir, 'web', 'public', 'data');

// Ensure destination exists
if (fs.existsSync(DEST_PUBLIC_DATA)) {
    fs.rmSync(DEST_PUBLIC_DATA, { recursive: true, force: true });
}
fs.mkdirSync(DEST_PUBLIC_DATA, { recursive: true });

console.log('🔄 Syncing Data...');

// 1. Copy Knowledge Hub Domains
const domains = fs.readdirSync(SOURCE_DATA).filter(item => {
    const itemPath = path.join(SOURCE_DATA, item);
    return fs.statSync(itemPath).isDirectory() && !item.startsWith('_');
});

const manifest = {
    domains: [],
    stats: {
        entities: 0,
        words: 0
    }
};

domains.forEach(domain => {
    const domainDir = path.join(SOURCE_DATA, domain);
    const destDir = path.join(DEST_PUBLIC_DATA, 'domains', domain);
    
    // Copy Entites
    const entityDir = path.join(domainDir, 'entities');
    if (fs.existsSync(entityDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        const entities = glob.sync('**/*.json', { cwd: entityDir });
        
        entities.forEach(file => {
            const srcFile = path.join(entityDir, file);
            const destFile = path.join(destDir, file);
            fs.mkdirSync(path.dirname(destFile), { recursive: true });
            fs.copyFileSync(srcFile, destFile);
            manifest.stats.entities++;
        });
        
        manifest.domains.push(domain);
        console.log(`✅ Synced ${domain} (${entities.length} entities)`);
    }
});

// 2. Copy Rap Dictionary
const destDict = path.join(DEST_PUBLIC_DATA, 'dictionary');
fs.mkdirSync(destDict, { recursive: true });

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
alphabet.forEach(letter => {
    const letterDir = path.join(SOURCE_DICT, letter);
    if (fs.existsSync(letterDir)) {
        const destLetterDir = path.join(destDict, letter);
        fs.mkdirSync(destLetterDir, { recursive: true });
        
        const words = glob.sync('*.json', { cwd: letterDir });
        words.forEach(file => {
            fs.copyFileSync(path.join(letterDir, file), path.join(destLetterDir, file));
            manifest.stats.words++;
        });
        
        // Also sync markdown files if JSONs aren't the primary source yet
         const mdWords = glob.sync('*.md', { cwd: letterDir });
         mdWords.forEach(file => {
             // Convert MD to JSON structure if needed, or just copy for raw display
             // For now, simple copy
            fs.copyFileSync(path.join(letterDir, file), path.join(destLetterDir, file));
         });
    }
});
console.log(`✅ Synced Rap Dictionary`);

// 3. Write Manifest
fs.writeFileSync(path.join(DEST_PUBLIC_DATA, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('📝 Manifest generated.');
console.log('🎉 Data sync complete!');
