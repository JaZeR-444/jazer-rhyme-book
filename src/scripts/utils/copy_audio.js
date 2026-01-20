const fs = require('fs');
const path = require('path');

// Adjusted for new location: src/scripts/utils/copy_audio.js
const rootDir = path.join(__dirname, '..', '..', '..');
const sourceDir = path.join(rootDir, 'Instrumentals-For-Rhyme-Book');
const destDir = path.join(rootDir, 'web', 'public', 'audio');
const jsOutput = path.join(rootDir, 'web', 'src', 'lib', 'data', 'tracks.js');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (!fs.existsSync(sourceDir)) {
  console.warn(`Source directory not found: ${sourceDir}`);
  return;
}

const tracks = [];

fs.readdirSync(sourceDir).forEach(filename => {
  const srcFile = path.join(sourceDir, filename);
  if (fs.statSync(srcFile).isFile()) {
    // Copy file
    const destFile = path.join(destDir, filename);
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${filename}`);

    // Add to tracks list
    const name = path.parse(filename).name;
    tracks.push({
      title: name,
      src: `/audio/${filename}`
    });
  }
});

// Write JS file
const content = `export const tracks = ${JSON.stringify(tracks, null, 2)};\n`;
fs.writeFileSync(jsOutput, content);

console.log('Done.');
