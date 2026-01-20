const fs = require('fs');
const path = require('path');

// Current dir is .../web/public/dictionary
// We want to reference .../web/public and .../web/dist

const PUBLIC_DIR = path.resolve(__dirname, '..'); 
const DIST_DIR = path.resolve(__dirname, '../../dist');

const TARGETS = ['dictionary', 'data'];

function countFiles(dirPath) {
    if (!fs.existsSync(dirPath)) return 0;
    let count = 0;
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const item of items) {
        if (item.isDirectory()) {
            count += countFiles(path.join(dirPath, item.name));
        } else {
            count++;
        }
    }
    return count;
}

function syncAndVerify() {
    console.log(`\n[ Synchronization Start ]`);
    console.log(`Source (Public): ${PUBLIC_DIR}`);
    console.log(`Target (Dist):   ${DIST_DIR}\n`);

    if (!fs.existsSync(DIST_DIR)) {
        console.log(`Creating 'dist' directory...`);
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    TARGETS.forEach(target => {
        const sourcePath = path.join(PUBLIC_DIR, target);
        const destPath = path.join(DIST_DIR, target);

        console.log(`Checking '${target}'...`);

        if (!fs.existsSync(sourcePath)) {
            console.log(`  ! Source directory not found: ${sourcePath}`);
            return;
        }

        const initialSourceCount = countFiles(sourcePath);
        const initialDestCount = countFiles(destPath);

        console.log(`  Files in Public: ${initialSourceCount}`);
        console.log(`  Files in Dist:   ${initialDestCount}`);

        if (initialSourceCount !== initialDestCount) {
            console.log(`  Mismatch detected. Syncing...`);
            
            // Clean destination specifically? The user just said "match". 
            // Usually copying over is enough, but to truly match counts (handle deletions),
            // we'd need to delete the dest first or use rsync logic.
            // For safety and "dist" usually being a build artifact, wiping dest then copying is standard. 
            
            if (fs.existsSync(destPath)) {
                console.log(`  Cleaning destination '${target}'...`);
                fs.rmSync(destPath, { recursive: true, force: true });
            }
            
            console.log(`  Copying '${target}' to dist...`);
            fs.cpSync(sourcePath, destPath, { recursive: true });
            
            const finalDestCount = countFiles(destPath);
            console.log(`  Sync complete. New Dist Count: ${finalDestCount}`);
            
            if (initialSourceCount === finalDestCount) {
                console.log(`  [OK] Counts match.`);
            } else {
                console.error(`  [ERR] Counts still differ!`);
            }
        } else {
            console.log(`  [OK] Already in sync.`);
        }
        console.log('');
    });
}

syncAndVerify();
