/**
 * CLI UI Utilities
 * Standardized logging and formatting for JaZeR CLI
 */

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  
  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",
  
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m"
};

const icons = {
  info: 'ℹ',
  success: '✅',
  warn: '⚠️',
  error: '❌',
  step: '🔄',
  bullet: '•',
  domain: '📁',
  entity: '📝',
  word: '📖',
  build: '🏗️',
  star: '✨'
};

function log(message, type = 'info') {
  const icon = icons[type] || icons.info;
  let color = colors.fgWhite;
  
  switch(type) {
    case 'success': color = colors.fgGreen; break;
    case 'warn': color = colors.fgYellow; break;
    case 'error': color = colors.fgRed; break;
    case 'step': color = colors.fgCyan; break;
    case 'highlight': color = colors.fgMagenta; break;
  }
  
  console.log(`${color}${icon} ${message}${colors.reset}`);
}

function divider() {
  console.log(`${colors.dim}═══════════════════════════════════════════════════════════${colors.reset}`);
}

function header(title) {
  console.log('');
  divider();
  console.log(`  ${colors.bright}${title}${colors.reset}`);
  divider();
  console.log('');
}

module.exports = {
  log,
  header,
  divider,
  colors,
  icons
};
