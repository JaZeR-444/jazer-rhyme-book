import fs from 'fs';
import path from 'path';

const rootDir = './public/dictionary';

const getWordCounts = () => {
  const counts = {};
  let grandTotal = 0;
  
  try {
    const letterDirs = fs.readdirSync(rootDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && /^[A-Z]$/.test(dirent.name))
      .map(dirent => dirent.name);

    letterDirs.sort();

    for (const letter of letterDirs) {
      const letterPath = path.join(rootDir, letter);
      const files = fs.readdirSync(letterPath).filter(file => file.endsWith('.json'));
      
      // Debugging log for 'A' and 'B'
      if (letter === 'A' || letter === 'B') {
        console.log(`DEBUG: Found files for letter ${letter}:`, files);
      }
      
      counts[letter] = files.length;
      grandTotal += files.length;
    }
  } catch (error) {
    return `Error counting words: ${error.message}\n\n`;
  }

  let summary = 'Dictionary Word Count Summary:\n';
  summary += '--------------------------------\n';
  for (const [letter, count] of Object.entries(counts)) {
    summary += `${letter}: ${count} words\n`;
  }
  summary += '--------------------------------\n';
  summary += `Grand Total: ${grandTotal} words\n\n`;
  return summary;
};

const walk = (dir, level = 0) => {
  let output = '';
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach((file, index) => {
      const fullPath = path.join(dir, file.name);
      const prefix = '│   '.repeat(level);
      const connector = index === files.length - 1 ? '└───' : '├───';
      
      const displayName = file.isDirectory() ? `${file.name}/` : file.name;
      output += `${prefix}${connector}${displayName}\n`;

      if (file.isDirectory()) {
        output += walk(fullPath, level + 1);
      }
    });
  } catch (error) {
    // If a directory doesn't exist, just return an empty string for that part of the walk
  }
  return output;
};

const countSummary = getWordCounts();
const schemaHeader = `Folder schema for: ${path.resolve(rootDir)}\n\n`;
const schema = walk(rootDir);

fs.writeFileSync('dictionary_schema.txt', countSummary + schemaHeader + schema);
console.log('Folder schema and word counts for dictionary generated and saved to dictionary_schema.txt');



