const fs = require('fs');
const path = require('path');

// Adjusted for new location: src/scripts/maintenance/archive-scripts.js
const rootDir = path.join(__dirname, '..', '..', '..');
const SCRIPTS_DIR = path.join(rootDir, 'src', 'scripts', 'build');
const ARCHIVE_DIR = path.join(rootDir, 'archive', 'scripts');

// Ensure archive exists
if (!fs.existsSync(ARCHIVE_DIR)) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

// ... rest of archive-scripts.js logic ...
