import { Card, MarkdownRenderer } from '../components/ui';
import './ContentPage.css';

const docsContent = `
# Documentation

## Essential Commands

\`\`\`bash
# Validate all entity data
npm run validate

# Build/rebuild indexes after changes
npm run build

# Start web dev server
cd web && npm run dev

# Build web for production
cd web && npm run build
\`\`\`

## Adding New Entities

1. **Choose Domain**: Navigate to \`data/<domain>/entities/\`
2. **Create JSON File**: Name must match entity \`id\` (e.g., \`drake.json\`)
3. **Follow Schema**: Use required fields from \`schemas/base.entity.schema.json\`
4. **Validate**: Run \`npm run validate\`
5. **Build Indexes**: Run \`npm run build\`
6. **Commit**: Only commit entity files, never generated indexes

## Required Entity Fields

- \`id\`: Lowercase hyphenated slug
- \`type\`: Entity type matching domain
- \`name\`: Display name
- \`one_liner\`: Short description (max 280 chars)
- \`tags\`: Array from \`_meta/tags.json\`
- \`angles\`: Creative angles/perspectives
- \`bar_seeds\`: Lyric seeds/references
- \`related_ids\`: Related entity IDs
- \`created_at\`, \`updated_at\`: ISO 8601 timestamps

## Data Hygiene Rules

❌ **NEVER** manually edit \`data/*/indexes/*\` files (auto-generated)

❌ **NEVER** manually edit \`data/_indexes/*\` files (auto-generated)

✅ **ALWAYS** run \`npm run validate\` before commits

✅ **ALWAYS** run \`npm run build\` after entity changes

✅ **ALWAYS** use tags from \`_meta/tags.json\`

✅ **ALWAYS** match ID to filename

## Tag Management

All tags must exist in \`_meta/tags.json\`. To add new tags:

1. Edit \`_meta/tags.json\`
2. Run \`npm run validate\`
3. Use in entities

## Relations

Valid relation types in \`_meta/relation_types.json\`:

- \`influenced_by\` / \`influences\`
- \`member_of\` / \`has_member\`
- \`created_by\` / \`created\`
- \`part_of\` / \`contains\`
- \`similar_to\`
`;

export function Docs() {
  return (
    <div className="content-page">
      <div className="content-page__header">
        <h1 className="content-page__title">Documentation</h1>
        <p className="content-page__subtitle">
          How to use, contribute, and maintain the knowledge base
        </p>
      </div>
      <Card className="content-page__content">
        <MarkdownRenderer content={docsContent} />
      </Card>
    </div>
  );
}
