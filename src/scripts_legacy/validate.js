const fs = require('fs');
const path = require('path');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

const schemasDir = path.join(__dirname, '../schemas');
const dataDir = path.join(__dirname, '../../knowledge_base/data');

// Load schemas
const schemas = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'));
// Ensure base is loaded first
schemas.sort((a, b) => {
  if (a === 'base.entity.schema.json') return -1;
  if (b === 'base.entity.schema.json') return 1;
  return a.localeCompare(b);
});
const schemaFileToId = {};

schemas.forEach(schemaFile => {
  const schema = JSON.parse(fs.readFileSync(path.join(schemasDir, schemaFile), 'utf8'));
  try {
    ajv.addSchema(schema); // Let AJV use the $id
    
    if (schema.$id) {
      schemaFileToId[schemaFile] = schema.$id;
    } else {
      // If no $id, AJV might not register it by name unless we stick to the addSchema(schema, key)
      // But mixed usage is confusing. Let's assume all our schemas have IDs or we add them by key as fallback
      ajv.removeSchema(schema); // Remove just in case
      ajv.addSchema(schema, schemaFile);
      schemaFileToId[schemaFile] = schemaFile;
    }
  } catch (err) {
    console.error(`Error loading schema ${schemaFile}:`, err.message);
  }
});

let hasErrors = false;

function validateDir(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      validateDir(fullPath);
    } else if (item.endsWith('.json') && dir.endsWith('entities')) {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const domain = path.basename(path.dirname(dir));
      
      // Map domains to their specific schema files
      const domainToSchema = {
        'aesthetics-visuals': 'aesthetic.entity.schema.json',
        'architecture-spaces': 'architecture.entity.schema.json',
        'brands': 'brand.entity.schema.json',
        'business-economics': 'business.entity.schema.json',
        'cinema': 'cinema.entity.schema.json',
        'emotions-states': 'emotion.entity.schema.json',
        'fashion': 'fashion.entity.schema.json',
        'history': 'history.entity.schema.json',
        'internet-culture': 'meme.entity.schema.json',
        'lingo': 'lingo.entity.schema.json',
        'media-platforms': 'media.entity.schema.json',
        'music': 'music.entity.schema.json',
        'mythology-legend': 'mythology.entity.schema.json',
        'people': 'people.entity.schema.json',
        'philosophy-ideas': 'philosophy.entity.schema.json',
        'places': 'place.entity.schema.json',
        'rituals-symbols': 'ritual.entity.schema.json',
        'science-future': 'science.entity.schema.json',
        'sports': 'sport.entity.schema.json',
        'tech': 'tech.entity.schema.json',
        'time-energy': 'time.entity.schema.json',
        'vehicles': 'vehicle.entity.schema.json',
        'weapons-objects': 'weapon.entity.schema.json',
        'writing-tools': 'writing-tool.entity.schema.json'
      };

      const schemaFilename = domainToSchema[domain] || 'base.entity.schema.json';
      const schemaId = schemaFileToId[schemaFilename];
      
      const validate = ajv.getSchema(schemaId);
      if (!validate) {
        console.error(`Schema not found: ${schemaId}`);
        hasErrors = true;
        return;
      }

      const valid = validate(data);
      if (!valid) {
        console.error(`Validation failed for ${fullPath}:`);
        console.error(validate.errors);
        hasErrors = true;
      } else {
        console.log(`✓ ${item} is valid`);
      }
    }
  });
}

console.log('Starting validation...');
validateDir(dataDir);

if (hasErrors) {
  process.exit(1);
} else {
  console.log('All entities are valid!');
}
