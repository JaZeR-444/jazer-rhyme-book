# JaZeR Master Flow Knowledge Hub

## Project Overview
This project is a local, structured knowledge base designed for rap/music writing retrieval and long-term expansion. It uses a "Domains → Entities → Indexes → Relations" architecture stored in JSON files, managed by Node.js scripts.

## Architecture
- **Domains**: Categorized folders under `data/` (e.g., `people`, `tech`, `lingo`).
- **Entities**: Individual JSON files within `data/<domain>/entities/` representing single concepts.
- **Indexes**: Generated JSON files in `data/<domain>/indexes/` for quick lookup (by tag, era, alias).
- **Relations**: Mappings in `data/<domain>/relations/` and `related_ids` fields.
- **Schemas**: JSON Schemas in `schemas/` used for validation.

## Key Commands
- **Validate Data**: `npm run validate`
  - Validates all entity files against their respective schemas.
  - Ensures data integrity and correct formatting.
- **Build Indexes**: `npm run build`
  - Regenerates all index files (`alias_map.json`, `by_tag.json`, `by_era.json`) based on the current entities.
  - Should be run after adding or modifying entities.

## Development Conventions
- **Entity Creation**:
  - Create a new JSON file in the appropriate `data/<domain>/entities/` folder.
  - Follow the schema defined in `schemas/<domain>.entity.schema.json`.
  - Ensure the `id` is unique and follows the project's ID rules.
- **Tagging**: Use only tags defined in `_meta/tags.json`.
- **Linking**: Use `related_ids` for simple connections and `relations/relations.json` for complex, typed relationships.
- **Validation**: Always run `npm run validate` before committing changes to ensure the knowledge base remains consistent.
