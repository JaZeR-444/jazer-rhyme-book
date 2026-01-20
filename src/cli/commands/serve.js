/**
 * Command: serve
 * Explains how to start the development server
 */

const ui = require('../lib/ui');

module.exports = function() {
  ui.log('Starting development server...', 'step');
  console.log('');
  console.log(`  ${ui.icons.info} The web dev server should be started from the web directory:`);
  console.log(`    ${ui.colors.fgCyan}cd web && npm run dev${ui.colors.reset}`);
  console.log('');
};
