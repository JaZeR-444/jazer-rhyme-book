# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**JaZeR Master Flow Knowledge Hub** is a structured knowledge base for creative writing, lyrics, and AI integration. It organizes 25+ domains (music, lingo, tech, culture, etc.) into validated JSON entities with cross-domain relationships. The system includes:

- **25+ Knowledge Domains**: From `music` and `lingo` to `mythology-legend` and `science-future`
- **A-Z Rhyme Dictionary**: Complete word bank in `Rap_Dictionary_Master_Hub/`
- **React Web Interface**: Interactive UI for browsing entities and relationships
- **Automated Validation**: JSON Schema validation with AJV
- **Auto-Generated Indexes**: Tag maps, alias lookups, and era timelines

## Essential Commands

### Development Workflow
```bash
# Install dependencies (root project)
npm install

# Install web interface dependencies
cd web && npm install

# Validate all entity data (ALWAYS run before commits)
npm run validate

# Build/rebuild all indexes after data changes
npm run build

# Start web development server
cd web && npm run dev

# Build web interface for production
cd web && npm run build
```

### Python Dictionary Tools
```bash
# Auto-expand entire dictionary
python auto_expand_dictionary.py

# Add words to specific letters
python add_50_a_words.py
python add_v_words_2.py
python add_w_words_2.py
# ... (similar scripts for other letters)
```

### Validation & Testing
- No separate test suite - use `npm run validate` as the primary test
- Validation checks: Schema compliance, ID/filename match, tag validity, metadata rules
- Always run `npm run validate` before committing
- Always run `npm run build` after entity changes to regenerate indexes

## Architecture & Data Flow

### Four-Layer System

1. **Domains Layer** (`data/<domain>/`)
   - 25 specialized knowledge categories
   - Each domain contains: `entities/`, `indexes/`, `relations/`

2. **Entities Layer** (`data/<domain>/entities/`)
   - **SOURCE OF TRUTH** - all knowledge lives here
   - One JSON file per concept (e.g., `kendrick-lamar.json`)
   - Filename MUST match entity `id` field
   - Validated against domain-specific schemas

3. **Indexes Layer** (`data/<domain>/indexes/` and `data/_indexes/`)
   - **AUTO-GENERATED** - never edit manually
   - Created by `npm run build`
   - Contains: `alias_map.json`, `by_tag.json`, `by_era.json`
   - Global indexes in `data/_indexes/` for cross-domain queries

4. **Relations Layer** (`data/<domain>/relations/` and `data/_relations/`)
   - Typed relationships between entities
   - Types defined in `_meta/relation_types.json`
   - Includes: `influenced_by`, `member_of`, `created_by`, etc.

### Critical Data Flow
```
Create/Edit Entity → Validate (npm run validate) → Build Indexes (npm run build) → Serve to Web/AI
```

### Domain-to-Schema Mapping

The validation system maps each domain to a specific schema (see `scripts/validate.js:54-79`):

```javascript
// Domain → Schema File mappings
'music' → 'music.entity.schema.json'
'lingo' → 'lingo.entity.schema.json'
'people' → 'people.entity.schema.json'
'cinema' → 'cinema.entity.schema.json'
// ... etc for all 25 domains
```

All schemas extend `base.entity.schema.json` which defines core fields.

## Entity Schema & Structure

### Required Fields (from base.entity.schema.json)

Every entity MUST include:
- `id`: Lowercase hyphenated slug (e.g., `kendrick-lamar`)
- `type`: Entity type matching domain (see enum in base schema)
- `name`: Display name
- `created_at`: ISO 8601 datetime
- `updated_at`: ISO 8601 datetime
- `one_liner`: Max 280 chars description/tagline
- `tags`: Array of strings from controlled vocabulary (`_meta/tags.json`)
- `angles`: Array of creative angles/perspectives
- `bar_seeds`: Array of lyric seeds/reference points
- `related_ids`: Array of related entity IDs

### Optional But Common Fields
- `aliases`: Alternative names (used in alias_map index)
- `era`: Time period (e.g., `1990s`, `2010s-Present`)
- `sources`: Array of source objects with title/url/type/accessed_at

### Domain-Specific Fields

Different domains extend the base schema with additional fields:

**Music entities** (`music.entity.schema.json`):
- `genre`: Array of genres
- `signature_songs`: Notable tracks
- `sonic_descriptors`: Sound characteristics
- `influence_tree`: Influences/predecessors
- `aesthetic`: Visual/thematic style

**People entities** (`people.entity.schema.json`):
- Additional biographical fields

**Lingo entities** (`lingo.entity.schema.json`):
- Slang-specific metadata

*(Check `schemas/` directory for complete domain schemas)*

### Example Entity Structure

```json
{
  "id": "kendrick-lamar",
  "type": "music",
  "name": "Kendrick Lamar",
  "aliases": ["K-Dot", "Kung Fu Kenny"],
  "era": "2010s-Present",
  "tags": ["lyrical", "conscious", "compton", "storyteller"],
  "one_liner": "The Compton poet who elevated hip-hop with profound storytelling.",
  "angles": ["conscious rap", "lyrical complexity", "social commentary"],
  "bar_seeds": ["DAMN.", "good kid, m.A.A.d city", "Humble"],
  "genre": ["Hip Hop", "Conscious Rap", "Jazz Rap"],
  "signature_songs": ["Humble", "Alright", "Swimming Pools"],
  "related_ids": ["dr-dre", "j-cole"],
  "created_at": "2025-12-23T11:40:00Z",
  "updated_at": "2025-12-23T11:40:00Z",
  "sources": []
}
```

## Data Hygiene Rules (CRITICAL)

### ❌ NEVER Edit These Files
- **NEVER** manually edit `data/*/indexes/*` files (auto-generated)
- **NEVER** manually edit `data/_indexes/*` files (auto-generated)
- These are rebuilt by `npm run build` from entity sources

### ✅ ALWAYS Follow These Rules
- **ID/Filename Match**: File `drake.json` MUST have `"id": "drake"`
- **Lowercase Hyphenated IDs**: Use `jay-z`, not `Jay-Z` or `jay_z`
- **Controlled Vocabulary Tags**: All tags MUST exist in `_meta/tags.json`
- **Valid Relation Types**: Use only types from `_meta/relation_types.json`
- **Run Validation**: Execute `npm run validate` before every commit
- **Rebuild Indexes**: Execute `npm run build` after entity changes
- **Include Sources**: Provide citations for factual claims

### ID Naming Conventions (from _meta/id_rules.json)
- Use lowercase letters, numbers, and hyphens only
- Pattern: `^[a-z0-9-]+$`
- Examples: `tupac-shakur`, `boom-bap`, `the-matrix-1999`

### Tag Management
- Tags come from `_meta/tags.json` controlled vocabulary
- To add new tags: Edit `_meta/tags.json`, then run `npm run validate`
- Current tag categories: luxury, grit, futuristic, vintage, streetwear, cyberpunk, lo-fi, lyrical, storytelling, trap, boom-bap, drill, etc.

## Web Application Architecture

### Technology Stack
- **Framework**: React 19 + Vite 7
- **Routing**: react-router-dom
- **Animations**: GSAP (@gsap/react)
- **Icons**: lucide-react
- **Graph Visualization**: react-force-graph-2d

### Project Structure
```
web/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── sections/        # Page sections
│   │   ├── motion/          # GSAP animation components
│   │   ├── Layout.jsx       # Main layout wrapper
│   │   └── Layout.css
│   ├── pages/
│   │   └── DomainView.jsx   # Domain-specific views
│   ├── lib/                 # Utilities and helpers
│   ├── styles/              # Global styles
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/
├── vite.config.js           # Vite configuration
└── package.json
```

### Vite Configuration Notes (vite.config.js)

**Path Aliases** for importing data:
```javascript
'@data': '../data'              // Access domain entities
'@dictionary': '../Rap_Dictionary_Master_Hub'  // Access dictionary
```

**File System Config**:
- Allows serving files from parent directory (`allow: ['..']`)
- Uses polling for file watcher (resolves large directory issues)
- Ignores node_modules and .git to prevent overload

**JSON Imports**: Enabled with `stringify: false`

### Development Server
- Default port: `5173`
- Hot reload enabled for data and dictionary changes
- Polling interval: 1000ms (prevents file handle exhaustion)

## Scripts Directory

### Core Scripts
- `validate.js`: JSON Schema validation using AJV 2020-12
- `build-indexes.js`: Generates alias maps, tag indexes, era timelines
- `build-graph-data.js`: Builds relationship graph data for visualization
- `sync-data.js`: Data synchronization utilities
- `fix_data.js`: Data repair/migration scripts (versioned)

### Python Scripts (Root Directory)
- `auto_expand_dictionary.py`: Intelligently grows all dictionary letters
- `add_50_a_words.py`, `add_v_words_2.py`, etc.: Letter-specific word addition
- `create_rap_hub.py`: Generates initial dictionary structure
- `generate_tree.py`: Creates folder structure visualization
- `scaffold_new_domains.py`: Creates new domain scaffolding

## Metadata Configuration (_meta/)

### Global Rules & Vocabularies
- `tags.json`: Controlled vocabulary for entity tags (100+ terms)
- `id_rules.json`: ID naming conventions and patterns
- `relation_types.json`: Valid relationship types between entities
- `domain_config.json`: Domain metadata and configuration

### Relation Types
Common relation types include:
- `influenced_by` / `influences`
- `member_of` / `has_member`
- `created_by` / `created`
- `part_of` / `contains`
- `similar_to`
- `inspired_by` / `inspires`

## Common Workflows

### Adding a New Entity

1. Choose the appropriate domain (e.g., `data/music/`)
2. Create JSON file in `entities/` with hyphenated ID as filename
3. Follow the domain's schema (check `schemas/<domain>.entity.schema.json`)
4. Ensure all required fields are present
5. Use tags from `_meta/tags.json` only
6. Run `npm run validate` to check schema compliance
7. Run `npm run build` to regenerate indexes
8. Commit only the entity file (never commit generated indexes)

### Modifying an Existing Entity

1. Edit the entity file in `data/<domain>/entities/`
2. Update `updated_at` timestamp to current ISO 8601 datetime
3. Run `npm run validate`
4. Run `npm run build`
5. Commit changes

### Adding New Tags

1. Edit `_meta/tags.json` to add tag to controlled vocabulary
2. Run `npm run validate` to ensure no issues
3. Use new tag in entities
4. Run `npm run build`

### Creating Cross-Domain Relations

1. Edit `data/_relations/relations.json` OR domain-specific `relations/relations.json`
2. Use valid relation types from `_meta/relation_types.json`
3. Ensure source and target entity IDs exist
4. Run `npm run validate`

## Dictionary Structure

### Organization
```
Rap_Dictionary_Master_Hub/
├── A/
│   ├── 01_Words/
│   │   ├── abandon/
│   │   │   └── word.md
│   │   ├── ability/
│   │   └── [50+ words...]
│   └── A Master Index.md
├── B/ through Z/
└── Master_Hub_Index.md
```

### Word File Format (word.md)
```markdown
# [Word]

**Pronunciation**: /phonetic/
**Part of Speech**: [type]

## Definition
[Clear definition]

## Usage in Lyrics
- "[Example lyric]"
- "[Another example]"

## Synonyms
- [Related words]

## Related Words
- [Connected concepts]

## Cultural Context
[Background and usage notes]
```

## AI-Specific Guidance

### Entity Lookup Strategies
1. **By ID**: Direct file read from `data/<domain>/entities/<id>.json`
2. **By Tag**: Check `data/<domain>/indexes/by_tag.json`
3. **By Alias**: Check `data/<domain>/indexes/alias_map.json`
4. **By Era**: Check `data/<domain>/indexes/by_era.json`
5. **Cross-Domain**: Use `data/_indexes/` for global searches

### Validation Before Commits
Always validate data integrity before suggesting commits:
```bash
npm run validate && npm run build
```

### Working with Large Data
- The project contains thousands of entities across 25 domains
- Use indexes for fast lookups rather than scanning all entities
- Web interface uses Vite's JSON imports for efficient loading

## Additional Documentation

See also:
- `AGENTS.md`: General AI agent guidelines
- `GEMINI.md`: Google Gemini-specific configuration
- `QWEN.md`: Qwen model-specific configuration
- `README.md`: Full project documentation with examples

## Troubleshooting

### Validation Fails
- Check `validation_output_v*.txt` for detailed error logs
- Common issues: Missing required fields, invalid tags, ID/filename mismatch
- Fix data in entity files, never in index files

### Index Build Errors
- Delete `data/*/indexes/` and `data/_indexes/` directories
- Run `npm run build` to regenerate from scratch
- Check for circular dependencies in `related_ids`

### Web Dev Server Issues
- Port 5173 in use: Change port in `vite.config.js` or kill existing process
- File watcher overload: Already using polling mode (configured)
- Missing dependencies: Run `npm install` in `web/` directory
