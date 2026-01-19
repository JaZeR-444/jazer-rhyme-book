# Repository Guidelines

## Project Structure & Module Organization
- `_meta/`: Controlled vocabularies and global rules (tags, ID rules, relation types).
- `data/<domain>/entities/`: Source JSON entities (one concept per file).
- `data/<domain>/indexes/` and `data/_indexes/`: Generated lookup indexes.
- `data/<domain>/relations/` and `data/_relations/`: Typed relationship maps.
- `schemas/`: JSON Schemas used by validation.
- `scripts/`: Node.js tools for validation and index building.

## Build, Test, and Development Commands
- `npm install`: Install Node.js dependencies.
- `npm run validate`: Validate all entity files against schemas and metadata rules.
- `npm run build`: Regenerate domain and global indexes after data changes.

## Coding Style & Naming Conventions
- JSON uses 2-space indentation and UTF-8.
- Entity file names match their `id` (e.g., `data/music/entities/daft-punk.json`).
- IDs are lowercase, hyphenated slugs; follow `_meta/id_rules.json`.
- Tags must come from `_meta/tags.json`.
- Relations use the types listed in `_meta/relation_types.json`.

## Testing Guidelines
- There is no separate test framework in this repo.
- Treat `npm run validate` as the primary test; run it before commits.
- After edits, run `npm run build` to keep indexes in sync.

## Commit & Pull Request Guidelines
- This checkout has no Git history, so no local conventions are visible.
- Use concise Conventional Commit-style messages (e.g., `feat(data): add new people entity`).
- PRs should include a brief summary, domains touched, and note that `npm run validate` and `npm run build` were run.

## Data Hygiene & Safety
- Do not hand-edit generated index files in `data/*/indexes/` or `data/_indexes/`.
- Ensure new entities include sources and relevant `related_ids` where applicable.
