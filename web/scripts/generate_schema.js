import fs from 'fs';
import path from 'path';

const walk = (dir, level = 0) => {
  let output = '';
  const files = fs.readdirSync(dir, { withFileTypes: true });
  // Filter out node_modules
  const filteredFiles = files.filter(file => file.name !== 'node_modules');

  filteredFiles.forEach((file, index) => {
    const fullPath = path.join(dir, file.name);
    const prefix = '│   '.repeat(level);
    const connector = index === filteredFiles.length - 1 ? '└───' : '├───';
    
    // Add a trailing slash for directories
    const displayName = file.isDirectory() ? `${file.name}/` : file.name;
    output += `${prefix}${connector}${displayName}\n`;

    if (file.isDirectory()) {
      output += walk(fullPath, level + 1);
    }
  });
  return output;
};

const rootDir = '.';
const header = `Folder schema for: ${path.resolve(rootDir)}\n\n`;
const schema = walk(rootDir);
fs.writeFileSync('folder_schema.txt', header + schema);
console.log('Folder schema generated and saved to folder_schema.txt');
