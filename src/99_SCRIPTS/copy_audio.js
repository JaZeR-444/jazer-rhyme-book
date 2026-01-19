const fs = require('fs');
const path = require('path');

const sourceDir = 'Instrumentals-For-Rhyme-Book';
const destDir = path.join('web', 'public', 'audio');
const jsOutput = path.join('web', 'src', 'lib', 'data', 'tracks.js');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
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
