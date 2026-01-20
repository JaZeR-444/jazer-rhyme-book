/**
 * Command: build
 * Runs the unified hub builder
 */

const fs = require('fs');
const path = require('path');
const ui = require('../lib/ui');

module.exports = async function(config) {
  const { ROOT_DIR } = config;
  const prepareScript = path.join(ROOT_DIR, 'src', 'scripts', 'build', 'prepare-hub.js');

  if (fs.existsSync(prepareScript)) {
    ui.log('Running hub builder...', 'step');
    // Use require to run the script
    // Note: Since prepare-hub.js is also an async IIFE or script, 
    // we might need to be careful with how it's executed.
    // Standard jazer-cli used require().
    try {
      require(prepareScript);
    } catch (err) {
      ui.log(`Build failed: ${err.message}`, 'error');
    }
  } else {
    ui.log(`Build script not found at: ${prepareScript}`, 'error');
  }
};
