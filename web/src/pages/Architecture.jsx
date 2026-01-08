import { Card, MarkdownRenderer } from '../components/ui';
import './ContentPage.css';

const architectureContent = `
# System Architecture

## Four-Layer System

\`\`\`
┌─────────────────────────────────────────┐
│         🗂️  DOMAINS LAYER              │
│  Organized categories (music, tech...)  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         📄  ENTITIES LAYER              │
│  Individual JSON files per concept      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         🔍  INDEXES LAYER               │
│  Auto-generated lookup tables           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         🔗  RELATIONS LAYER             │
│  Cross-domain connections & influences  │
└─────────────────────────────────────────┘
\`\`\`

## Data Flow

Add Entity → Validate → Build Indexes → Generate Relations → Serve to AI/Web

## Layer Breakdown

| Layer | Purpose | Example |
|-------|---------|---------|
| **Domains** | High-level categorization | \`data/music/\`, \`data/lingo/\` |
| **Entities** | Atomic knowledge units | \`kendrick-lamar.json\`, \`flexing.json\` |
| **Indexes** | Fast lookups & discovery | Tag maps, era timelines, aliases |
| **Relations** | Semantic connections | "Tupac influenced Kendrick" |
`;

export function Architecture() {
  return (
    <div className="content-page">
      <div className="content-page__header">
        <h1 className="content-page__title">Architecture</h1>
        <p className="content-page__subtitle">
          Understanding the system design and data flow
        </p>
      </div>
      <Card className="content-page__content">
        <MarkdownRenderer content={architectureContent} />
      </Card>
    </div>
  );
}
