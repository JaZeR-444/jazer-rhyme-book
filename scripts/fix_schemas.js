const fs = require('fs');
const path = require('path');

const schemasDir = path.join(__dirname, '../schemas');
const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'));

files.forEach(file => {
  const filePath = path.join(schemasDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  let schema;
  try {
    schema = JSON.parse(content);
  } catch (e) {
    console.error(`Failed to parse ${file}`);
    return;
  }

  let modified = false;
  if (schema.properties && !schema.type) {
    schema.type = "object";
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(schema, null, 2));
    console.log(`Updated ${file}`);
  }
});
