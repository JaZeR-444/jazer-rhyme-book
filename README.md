# 🎤 JaZeR Master Flow Knowledge Hub

> **A production-ready, AI-powered knowledge base optimized for rap/music writing, creative retrieval, and long-term expansion.**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](package.json)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Domain Categories](#domain-categories)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Workflows](#workflows)
- [Advanced Features](#advanced-features)
- [AI Agent Guidelines](#ai-agent-guidelines)
- [Contributing](#contributing)
- [Maintenance](#maintenance)

---

## 🌟 Overview

The **JaZeR Master Flow Knowledge Hub** is a comprehensive creative knowledge system designed for:
- **Rap/Hip-Hop Writing**: Quick access to rhymes, metaphors, slang, and cultural references
- **Multi-Domain Knowledge**: 25+ categorized domains from music to tech to mythology
- **AI Integration**: Optimized for LLM agents (Claude, Gemini, Qwen) with structured JSON
- **Scalability**: Built for continuous expansion with automated validation and indexing
- **Cross-Reference System**: Complex relationship mapping between entities

### Key Features
✅ **25+ Domain Categories** covering culture, technology, arts, and more  
✅ **Automated Validation** via JSON Schema and metadata rules  
✅ **Auto-Generated Indexes** for tags, eras, aliases, and cross-references  
✅ **Rap Dictionary Integration** with 26 alphabetical word banks (A-Z)  
✅ **Python Expansion Tools** for automated dictionary growth  
✅ **Web Interface** for browsing and searching  
✅ **Multi-Agent Support** with dedicated AI configuration files

---

## 🏗️ Architecture

This project uses a **Domains → Entities → Indexes → Relations** architecture:

```
┌─────────────┐
│   DOMAINS   │  Categorized knowledge areas (music, tech, lingo, etc.)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  ENTITIES   │  Individual JSON files (one concept/person/thing per file)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   INDEXES   │  Auto-generated lookups (by tag, era, alias)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  RELATIONS  │  Explicit cross-domain connections
└─────────────┘
```

### Core Concepts
- **Domains**: High-level categories organizing related entities
- **Entities**: Atomic knowledge units (people, concepts, objects, terms)
- **Indexes**: Generated maps for efficient lookup and discovery
- **Relations**: Typed connections between entities (influences, uses, appears_in, etc.)
- **Metadata**: Controlled vocabularies ensuring consistency (tags, ID rules, relation types)

---

## 🗂️ Domain Categories

The knowledge base spans **25 domains**:

| Domain | Description | Example Entities |
|--------|-------------|------------------|
| **aesthetics-visuals** | Visual styles, art movements | Cyberpunk, Vaporwave, Graffiti |
| **architecture-spaces** | Buildings, locations, spatial concepts | Studio, Arena, Skyscraper |
| **brands** | Companies, labels, products | Nike, Apple, Supreme |
| **business-economics** | Money, trade, systems | Cryptocurrency, Hustle, Investment |
| **cinema** | Films, directors, techniques | Tarantino, Film Noir, Montage |
| **emotions-states** | Feelings, mental states | Rage, Euphoria, Paranoia |
| **fashion** | Clothing, style, trends | Streetwear, Drip, Sneakers |
| **history** | Events, eras, movements | Civil Rights, Golden Era |
| **internet-culture** | Memes, trends, online phenomena | Viral, Clout, Algorithm |
| **lingo** | Slang, jargon, expressions | Flex, Cap, Vibe |
| **media-platforms** | TV, radio, streaming | YouTube, Spotify, TikTok |
| **music** | Artists, genres, techniques | Hip-Hop, Jazz, Flow |
| **mythology-legend** | Gods, heroes, folklore | Zeus, Odin, Phoenix |
| **people** | Historical figures, celebrities | Tupac, MLK, Einstein |
| **philosophy-ideas** | Concepts, ideologies | Existentialism, Freedom |
| **places** | Cities, countries, landmarks | Brooklyn, Tokyo, The Block |
| **rituals-symbols** | Cultural practices, icons | Crown, Handshake, Cipher |
| **science-future** | Tech, space, innovation | AI, Mars, Quantum |
| **sports** | Athletes, games, terms | Jordan, Boxing, Championship |
| **tech** | Gadgets, software, platforms | iPhone, Bitcoin, VR |
| **time-energy** | Temporal and vital concepts | Grind, Moment, Legacy |
| **vehicles** | Cars, transport | Benz, Lambo, Whip |
| **weapons-objects** | Tools, items, artifacts | Microphone, Chain, Sword |
| **writing-tools** | Craft elements | Metaphor, Punchline, Wordplay |

---

## 📁 Project Structure

```
JaZeR-Rhyme-Book/
├── data/                          # All knowledge domains
│   ├── music/
│   │   ├── entities/             # Individual concept files
│   │   ├── indexes/              # Generated lookups
│   │   └── relations/            # Cross-references
│   ├── lingo/
│   ├── tech/
│   ├── [... 22 more domains]
│   ├── _indexes/                 # Global cross-domain indexes
│   └── _relations/               # Global relation maps
│
├── Rap_Dictionary_Master_Hub/    # A-Z rhyme dictionary
│   ├── A/
│   │   ├── abandon.json
│   │   ├── absolute.json
│   │   └── [... more words]
│   ├── B/ ... Z/
│   ├── A Master Index.md
│   └── [... master indexes]
│
├── schemas/                      # JSON Schema definitions
│   ├── entity.schema.json
│   └── [... more schemas]
│
├── _meta/                        # Controlled vocabularies
│   ├── tags.json                # Approved tags list
│   ├── id_rules.json            # ID formatting rules
│   └── relation_types.json      # Valid relation types
│
├── scripts/                      # Automation tools
│   ├── validate.js              # Schema & metadata validation
│   └── build-indexes.js         # Index generation
│
├── web/                          # Web interface (if applicable)
│
├── add_*.py                      # Python dictionary expansion tools
├── auto_expand_dictionary.py
├── create_rap_hub.py
│
├── AGENTS.md                     # AI agent instructions
├── GEMINI.md                     # Gemini-specific config
├── QWEN.md                       # Qwen-specific config
│
├── package.json                  # Node.js dependencies
├── word_bank.json                # Master word bank
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 14.0.0 or higher
- **Python** 3.8+ (for dictionary expansion tools)
- **npm** (comes with Node.js)

### Installation

```bash
# Clone or navigate to the repository
cd "C:\Users\JaZeR\OneDrive\Desktop\2026 → JaZeR Mainframe\2026 → JaZeR Rhyme Book"

# Install Node.js dependencies
npm install

# Verify installation
npm run validate
```

### Quick Commands

| Command | Description |
|---------|-------------|
| `npm run validate` | Validate all entities against schemas and metadata |
| `npm run build` | Regenerate all indexes after data changes |
| `python create_rap_hub.py` | Initialize rap dictionary structure |
| `python auto_expand_dictionary.py` | Auto-expand word banks |
| `python add_[letter]_words_2.py` | Add words for specific letter |

---

## 🔄 Workflows

### Adding a New Entity

1. **Choose Domain**: Select the appropriate folder in `data/`
2. **Create JSON File**: Name it after the entity ID (e.g., `data/music/entities/kendrick-lamar.json`)
3. **Follow Schema**: Use the structure from `schemas/entity.schema.json`
4. **Required Fields**:
   - `id`: Lowercase, hyphenated slug
   - `name`: Display name
   - `type`: Entity type (person, concept, object, etc.)
   - `description`: Clear, concise explanation
   - `tags`: From `_meta/tags.json` only
   - `sources`: Citations/references

5. **Validate**: Run `npm run validate`
6. **Build Indexes**: Run `npm run build`
7. **Commit**: Document your changes

### Example Entity

```json
{
  "id": "mic-check",
  "name": "Mic Check",
  "type": "ritual",
  "description": "The practice of testing microphone levels before a performance",
  "tags": ["hip-hop", "performance", "ritual"],
  "aliases": ["sound check", "one-two"],
  "related_ids": ["microphone", "stage", "performance"],
  "era": "1970s-present",
  "sources": [
    "Hip-Hop Culture Encyclopedia"
  ]
}
```

### Linking Entities

**Simple Associations** (within entity file):
```json
{
  "related_ids": ["entity-1", "entity-2", "entity-3"]
}
```

**Complex Relations** (in `relations/relations.json`):
```json
{
  "source_id": "tupac",
  "target_id": "biggie",
  "relation_type": "influenced_by",
  "context": "East Coast-West Coast rivalry era"
}
```

### Expanding the Rap Dictionary

```bash
# Add 50 words starting with 'A'
python add_50_a_words.py

# Auto-expand entire dictionary
python auto_expand_dictionary.py

# Add specific letter range
python add_v_words_2.py
python add_w_words_2.py
```

---

## 🎯 Advanced Features

### Tag Governance
- **Controlled Vocabulary**: All tags must be defined in `_meta/tags.json`
- **Prevents Tag Sprawl**: Ensures consistency across 1000s of entities
- **Hierarchical Organization**: Tags can be grouped by category

### Validation System
The `npm run validate` command checks:
- ✅ JSON syntax correctness
- ✅ Schema compliance
- ✅ ID format rules (from `_meta/id_rules.json`)
- ✅ Tag validity (must exist in `_meta/tags.json`)
- ✅ Relation type validity (must exist in `_meta/relation_types.json`)
- ✅ No orphaned references

### Index Generation
The `npm run build` command creates:
- **Tag Indexes**: Find all entities with a given tag
- **Era Indexes**: Timeline-based lookup
- **Alias Maps**: Alternative names → canonical IDs
- **Domain Indexes**: Per-domain master lists
- **Global Indexes**: Cross-domain aggregations

### Relation Types
Supported in `_meta/relation_types.json`:
- `influences` / `influenced_by`
- `appears_in` / `features`
- `uses` / `used_in`
- `contrasts_with`
- `originates_from`
- `evolved_into`
- `synonymous_with`

---

## 🤖 AI Agent Guidelines

This repository is optimized for AI assistants. See dedicated files:
- **`AGENTS.md`**: General AI interaction guidelines
- **`GEMINI.md`**: Google Gemini-specific instructions
- **`QWEN.md`**: Qwen model-specific instructions

### Key Agent Workflows
1. **Entity Lookup**: Search by ID, tag, or alias
2. **Semantic Search**: Find related concepts across domains
3. **Rhyme Assistance**: Query `Rap_Dictionary_Master_Hub/` by letter
4. **Validation Support**: Auto-run validation after changes
5. **Index Rebuilding**: Auto-trigger after bulk updates

---

## 🤝 Contributing

### Data Hygiene Rules
- ❌ **Never hand-edit** generated index files in `data/*/indexes/` or `data/_indexes/`
- ✅ **Always validate** before committing: `npm run validate`
- ✅ **Rebuild indexes** after entity changes: `npm run build`
- ✅ **Include sources** for all factual claims
- ✅ **Use existing tags** from `_meta/tags.json` (propose new ones separately)

### Commit Conventions
Use [Conventional Commits](https://www.conventionalcommits.org/):
```
feat(music): add J. Cole entity
fix(lingo): correct definition of "drip"
docs(readme): update installation instructions
chore(indexes): rebuild after bulk import
```

### Pull Request Checklist
- [ ] Entities follow schema structure
- [ ] IDs match file names
- [ ] Tags exist in `_meta/tags.json`
- [ ] `npm run validate` passes
- [ ] `npm run build` executed
- [ ] Sources cited
- [ ] Description provided in PR

---

## 🛠️ Maintenance

### Regular Tasks
- **Weekly**: Review validation output files (`validation_output*.txt`)
- **Monthly**: Audit tag usage, consolidate duplicates
- **Quarterly**: Prune unused relations, update schemas

### Backup Strategy
- Keep `word_bank.json` backed up (master word list)
- Version control all entity files
- Indexes can be regenerated, but archive before major refactors

### Performance Tips
- Indexes are fast; rebuild liberally
- Keep individual entity files small (<50KB)
- Split large domains into subdomains if needed

### Troubleshooting

**Validation Fails**:
```bash
# Check specific validation output
cat validation_output_v6.txt

# Validate single domain
node scripts/validate.js data/music
```

**Index Build Errors**:
```bash
# Clear and rebuild
rm -rf data/*/indexes/*
rm -rf data/_indexes/*
npm run build
```

**Python Script Issues**:
```bash
# Ensure dependencies installed
pip install -r requirements.txt  # if requirements.txt exists

# Check Python version
python --version  # Should be 3.8+
```

---

## 📊 Statistics (as of Jan 2026)

- **Domains**: 25
- **Entities**: Growing library
- **Rap Dictionary Words**: A-Z coverage with thousands of entries
- **Validation Rules**: 50+ checks
- **Relation Types**: 15+
- **Tags**: 100+ controlled vocabulary terms

---

## 📄 License

This is a personal creative project. All content is owned by JaZeR.

---

## 🙏 Acknowledgments

Special thanks to:
- The hip-hop community for endless inspiration
- Open-source schema validation tools (AJV)
- AI assistants that help expand this knowledge base

---

## 📞 Contact & Support

For questions, suggestions, or collaboration:
- **Project Location**: `C:\Users\JaZeR\OneDrive\Desktop\2026 → JaZeR Mainframe\2026 → JaZeR Rhyme Book`
- **AI Agents**: Refer to `AGENTS.md`, `GEMINI.md`, `QWEN.md` for interaction protocols

---

**Built with 🎤 for the culture. Keep creating, keep flowing.**
