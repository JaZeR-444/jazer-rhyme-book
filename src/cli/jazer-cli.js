#!/usr/bin/env node
/**
 * JaZeR CLI
 * Command-line interface for managing the JaZeR Rhyme Book
 *
 * Usage: node jazer-cli.js <command> [options]
 */

const path = require('path');
const ui = require('./lib/ui');

// Configuration
const ROOT_DIR = path.join(__dirname, '..', '..');
const config = {
  ROOT_DIR,
  KNOWLEDGE_BASE_DIR: path.join(ROOT_DIR, 'knowledge_base'),
  DATA_DIR: path.join(ROOT_DIR, 'knowledge_base', 'data'),
  DICT_DIR: path.join(ROOT_DIR, 'knowledge_base', 'dictionary')
};

// Main command router
async function main() {
  const command = process.argv[2] || 'help';
  const arg = process.argv[3];

  try {
    switch (command) {
      case 'add-entity':
        await require('./commands/add-entity')(config, arg);
        break;

      case 'add-word':
        await require('./commands/add-word')(config, arg);
        break;

      case 'validate':
        require('./commands/validate')(config);
        break;

      case 'build':
        await require('./commands/build')(config);
        break;

      case 'status':
        require('./commands/status')(config);
        break;

      case 'serve':
        require('./commands/serve')();
        break;

      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (err) {
    ui.log(`Command execution failed: ${err.message}`, 'error');
    if (process.env.DEBUG) console.error(err);
    process.exit(1);
  }
}

function showHelp() {
  ui.header('JaZeR CLI - Knowledge Hub Management');
  
  console.log(`  ${ui.colors.bright}Usage:${ui.colors.reset} node jazer-cli.js <command> [options]`);
  console.log('');
  console.log(`  ${ui.colors.bright}Commands:${ui.colors.reset}`);
  console.log(`    ${ui.colors.fgCyan}add-entity [domain]${ui.colors.reset}   Add a new entity to a domain`);
  console.log(`    ${ui.colors.fgCyan}add-word [letter]${ui.colors.reset}     Add a new word to the dictionary`);
  console.log(`    ${ui.colors.fgCyan}validate${ui.colors.reset}              Validate all data`);
  console.log(`    ${ui.colors.fgCyan}build${ui.colors.reset}                 Build the web data`);
  console.log(`    ${ui.colors.fgCyan}status${ui.colors.reset}                Show project status`);
  console.log(`    ${ui.colors.fgCyan}serve${ui.colors.reset}                 Start development server`);
  console.log('');
  console.log(`  ${ui.colors.bright}Examples:${ui.colors.reset}`);
  console.log('    node jazer-cli.js add-entity music');
  console.log('    node jazer-cli.js status');
  console.log('');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});