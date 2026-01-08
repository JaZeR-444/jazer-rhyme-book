# JaZeR Master Flow Knowledge Hub

## Project Overview

The JaZeR Master Flow Knowledge Hub is a production-ready knowledge base optimized for rap/music writing retrieval and long-term expansion. It uses a "Domains → Entities → Indexes → Relations" architecture to organize information in a way that supports creative writing and idea generation.

### Architecture

The system follows a structured approach:
- **Domains**: Categorized folders (e.g., people, tech, lingo, music) that group related entities
- **Entities**: Individual JSON files representing a single concept, person, or thing
- **Indexes**: Generated files for quick lookup (by tag, by era, alias maps)
- **Relations**: Explicit mapping of how entities connect across domains

### Project Structure

```
JaZeR Master Flow Knowledge Hub/
├── _meta/                    # Global configuration and controlled vocabularies
│   ├── id_rules.json        # Rules for entity ID formatting
│   ├── relation_types.json  # Valid relationship types between entities
│   └── tags.json            # Controlled vocabulary of tags
├── data/                    # All domain data
│   ├── _indexes/            # Global indexes
│   ├── _relations/          # Global relations
│   ├── [domain_name]/       # Individual domains (e.g., music, people, tech)
│   │   ├── entities/        # Individual entity JSON files
│   │   ├── indexes/         # Domain-specific indexes
│   │   └── relations/       # Domain-specific relations
├── schemas/                 # JSON Schema definitions for validation
├── scripts/                 # Tools for validation and index building
└── README.md               # Project overview
```

### Data Domains

The knowledge hub includes these primary domains:
- aesthetics-visuals
- architecture-spaces
- brands
- business-economics
- cinema
- emotions-states
- fashion
- history
- internet-culture
- lingo
- media-platforms
- music
- mythology-legend
- people
- philosophy-ideas
- places
- rituals-symbols
- science-future
- sports
- tech
- time-energy
- vehicles
- weapons-objects
- writing-tools

## Entity Structure

Each entity follows a base schema with domain-specific extensions. The base entity includes:

### Base Fields
- `id`: Unique identifier following slug format
- `type`: Domain type (e.g., "music", "people", "tech")
- `name`: Primary name of the entity
- `aliases`: Array of alternative names
- `era`: Time period (e.g., "1990s", "2020s", "1999")
- `tags`: Array of tags from controlled vocabulary
- `one_liner`: Brief description (max 280 chars)
- `angles`: Creative angles for writing
- `bar_seeds`: Lyric seeds or hooks
- `related_ids`: Array of related entity IDs
- `created_at`: Creation timestamp (ISO-8601)
- `updated_at`: Last update timestamp (ISO-8601)
- `sources`: Array of source references

### Domain-Specific Extensions

Each domain has additional fields:
- **Music**: `genre`, `era_detail`, `signature_songs`, `sonic_descriptors`, `influence_tree`, `aesthetic`
- **People**: `known_for`, `vibe`, `signature_items`, `quotables_short`, `controversy_flags`
- **Tech**: `category`, `what_it_is`, `why_it_matters`, `risks`, `metaphors`, `keywords`
- **Cinema**: `plot_hooks`, `iconic_scenes`, `visual_motifs`, `themes`, `quotables_short`
- And many more domain-specific fields

## Building and Running

### Prerequisites
- Node.js installed on your system

### Setup
1. Install dependencies: `npm install`
2. Validate the knowledge base: `npm run validate`
3. Build indexes: `npm run build`

### Available Scripts

- `npm run validate`: Validates all entity JSON files against their schemas
- `npm run build`: Rebuilds all indexes from entity files

### Adding New Entities

1. Choose the correct domain in `data/`
2. Create a new JSON file in the `entities/` subfolder
3. Use the appropriate schema from `schemas/`
4. Run `npm run validate` to ensure correctness
5. Run `npm run build` to update indexes

### Linking Entities

- Use `related_ids` in the entity JSON for simple associations
- Add complex relations to the domain's `relations/relations.json` file

## Validation and Indexing

### Validation Process

The validation script (`scripts/validate.js`):
- Loads all JSON schemas from the `schemas/` directory
- Validates each entity file against its corresponding schema
- Checks that all required fields are present
- Ensures IDs follow the proper format
- Verifies that tags are from the controlled vocabulary

### Index Generation

The index building script (`scripts/build-indexes.js`) generates:
- `alias_map.json`: Maps aliases to entity IDs
- `by_tag.json`: Groups entities by tag
- `by_era.json`: Groups entities by era

## Controlled Vocabularies

### Tags

The system uses a controlled vocabulary of tags defined in `_meta/tags.json` to maintain consistency. Examples include:
- Descriptive: "luxury", "grit", "futuristic", "vintage"
- Temporal: "90s", "00s", "contemporary", "classic"
- Musical: "boom-bap", "trap", "drill", "soulful"
- Aesthetic: "minimalist", "maximalist", "cyberpunk", "lo-fi"

### ID Rules

Defined in `_meta/id_rules.json`, the ID format follows:
- Slug format (lowercase with hyphens)
- Globally unique across all domains
- No special characters (only lowercase letters, numbers, and hyphens)

### Relationship Types

Defined in `_meta/relation_types.json`, relationships include:
- "inspired_by", "references", "similar_to", "opposite_of"
- "associated_with", "originated_in", "popularized_by"
- "used_in", "depicted_in", "produced_by", "sampled_by"

## Development Conventions

### Entity Creation
- Use descriptive but concise names for entities
- Follow the ID format rules strictly
- Include relevant tags from the controlled vocabulary
- Provide multiple aliases when appropriate
- Add related entities to enhance discoverability

### Schema Extensions
- Domain-specific schemas extend the base schema using JSON Schema's `allOf`
- New domains should have their own schema file in the `schemas/` directory
- Follow the pattern of extending the base entity with domain-specific properties

### Index Updates
- Indexes must be rebuilt after adding or modifying entities
- The build process automatically updates all domain-specific indexes
- Global indexes are maintained separately in the `_indexes/` directory

## Key Files and Directories

- `package.json`: Defines project metadata and available scripts
- `README.md`: High-level project overview
- `_meta/`: Global configuration and controlled vocabularies
- `schemas/`: JSON Schema definitions for validation
- `scripts/`: Validation and index building tools
- `data/*/entities/`: Individual entity files
- `data/*/indexes/`: Generated lookup indexes
- `data/*/relations/`: Cross-entity relationship mappings