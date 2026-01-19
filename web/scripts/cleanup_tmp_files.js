
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dictionaryPath = path.join(__dirname, '..', 'Rap_Dictionary_Master_Hub', 'A', '01_Words');

if (!fs.existsSync(dictionaryPath)) {
    console.log("Dictionary path not found.");
    process.exit(0);
}

const files = fs.readdirSync(dictionaryPath);
const tmpFiles = files.filter(f => f.startsWith('tmpclaude'));

console.log(`Found ${tmpFiles.length} temporary files/folders to delete.`);

for (const file of tmpFiles) {
    const p = path.join(dictionaryPath, file);
    console.log(`Deleting ${file}...`);
    try {
        fs.rmSync(p, { recursive: true, force: true, maxRetries: 5 });
    } catch (e) {
        console.log(`Node delete failed, trying cmd...`);
        try {
            execSync(`cmd /c rd /s /q "${p}"`);
        } catch(e2) {
            console.error(`Failed to delete ${file}: ${e2.message}`);
        }
    }
}
console.log("Cleanup done.");
