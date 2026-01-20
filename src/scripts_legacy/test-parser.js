const fs = require('fs');
const path = require('path');

const wordPath = path.join(__dirname, '../Rap_Dictionary_Master_Hub/A/01_Words/aaron/word.md');

function parseWordFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const sections = {};
    
    // Split by H2 headers
    const parts = content.split(/^##\s+/m);
    
    // First part is usually H1 or empty
    
    parts.forEach(part => {
      const firstLineEnd = part.indexOf('\n');
      if (firstLineEnd === -1) return;
      
      const header = part.substring(0, firstLineEnd).trim().toLowerCase().replace(':', '');
      const body = part.substring(firstLineEnd).trim();
      
      if (header.includes('meaning (plain)')) {
        sections.definition = body;
      } else if (header.includes('rap meaning')) {
        sections.rapDefinition = body;
      } else if (header.includes('syllables')) {
        sections.syllables = parseInt(body.split(' ')[0]) || 0; // "2 (aar-on)" -> 2
      } else if (header.includes('synonyms')) {
        sections.synonyms = body.split(',').map(s => s.trim()).filter(Boolean);
      } else if (header.includes('tags')) {
        sections.tags = body.split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    
    return sections;
  } catch (e) {
    console.error('Error parsing:', e);
    return null;
  }
}

console.log('Testing parser on:', wordPath);
const result = parseWordFile(wordPath);
console.log('Result:', JSON.stringify(result, null, 2));
