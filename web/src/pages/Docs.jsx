import { Card, MarkdownRenderer } from '../components/ui';
import './Docs.css';

const docsContent = `
## Essential Commands

Running these commands will help you maintain the knowledge base.

\`\`\`bash
# Validate integrity of all entity files
npm run validate

# Rebuild search indexes and relations
npm run build

# Start local development server
cd web && npm run dev
\`\`\`

## Contributing Knowledge

### 1. Adding an Entity
Navigate to \`data/<domain>/entities/\` and create a JSON file. The filename should match the ID.

**File:** \`drake.json\`
\`\`\`json
{
  "id": "drake",
  "type": "artist",
  "name": "Drake",
  "one_liner": "Dominant force in modern hip-hop blending R&B sensibilities.",
  "tags": ["toronto", "ovo", "melodic-rap"],
  "era": "2010s"
}
\`\`\`

### 2. Validation
Always run the validation script before committing.
> **Note:** The CI/CD pipeline will fail if validation errors are present.

### 3. Tag Management
Tags are centralized in \`_meta/tags.json\`. If you need a new tag, add it there first, then use it in your entity files.

## Schema Reference

| Field | Type | Description |
|-------|------|-------------|
| \`id\` | slug | Unique identifier (kebab-case) |
| \`type\` | string | Must match domain types |
| \`name\` | string | Display name |
| \`tags\` | array | List of valid tags |
| \`related_ids\` | array | Direct connections to other entities |

`;

export function Docs() {
  return (
    <div className="docs-page">
      <div className="docs-page__header">
        <h1 className="docs-page__title">Documentation</h1>
        <p className="docs-page__subtitle">
          Operator's Manual for the JaZeR Master Flow Knowledge Hub.
        </p>
      </div>
      <Card className="docs-card">
        <div className="docs-content">
          <MarkdownRenderer content={docsContent} />
        </div>
      </Card>
    </div>
  );
}
