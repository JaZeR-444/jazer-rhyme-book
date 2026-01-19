#!/usr/bin/env python3
import os
import sys
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# CONFIGURATION
OVERWRITE = False  # Set to True to overwrite existing files
ROOT_PATH = r"C:\Users\JaZeR\OneDrive\Desktop\2026 → JaZeR Mainframe\2026 → JaZeR Master Flow Knowledge Hub"
HUB_NAME = "Rap_Dictionary_Master_Hub"

# TEMPLATES
WORD_TEMPLATE = """# WORD:

## Meaning (plain):

## Rap meaning (how I'd say it):

## Syllables:

## Part of speech:

## Synonyms:

## Antonyms:

## Rhyme ideas (end / slant / multi):

## 3 bar-ready examples:

## 3 punchline angles:

## Tags:
"""

PHRASE_TEMPLATE = """# PHRASE:

## Meaning:

## When to use it:

## 2 bar-ready examples:

## Similar phrases:

## Tags:
"""

LETTER_INDEX_TEMPLATE = """# {letter} - Index

## Quick Stats
- Words:
- Phrases:
- Rhyme buckets:

## Recently Added

## High Priority

## Notes
"""

RHYME_END_README = """# End Rhymes
Perfect rhymes that end with the same sound.
"""

RHYME_SLANT_README = """# Slant Rhymes
Near-rhymes, assonance, consonance - close but not perfect.
"""

RHYME_MULTI_README = """# Multi-Syllable Rhymes
Complex rhyme schemes spanning multiple syllables.
"""

HUB_README = """# Rap Dictionary Master Hub

Your personal word arsenal for crafting bars.

## How to Add a New Word

1. Navigate to the letter folder (A-Z)
2. Go to `01_Words/`
3. Create a new folder: `your_word_name/` (lowercase_with_underscores)
4. Copy the `word.md` template from `_example_word/`
5. Fill it out

## Naming Rules

- Word folders: `lowercase_with_underscores`
- Examples: `opulent`, `cosmic_drift`, `paradigm_shift`
- Keep it simple and searchable

## Quick Workflow

1. **Inbox** → Hear/read a word you like
2. **Add** → Create word folder + fill template
3. **Write** → Drop 3 bars using it
4. **Tag** → Add relevant tags for search
5. **Export** → (Optional) Add to curated lists in `04_Exports/`

## Structure

- `A-Z/` → Letter-based organization
  - `01_Words/` → Individual word folders
  - `02_Phrases/` → Multi-word expressions
  - `03_Rhymes/` → Rhyme buckets (end/slant/multi)
  - `04_Exports/` → Curated lists for sessions

## Tips

- Fill out examples as you USE words in actual bars
- Tag aggressively (moods, topics, complexity)
- Review your exports before writing sessions
- Update letter indexes weekly
"""

def create_file(path, content):
    """Create file if it doesn't exist or if OVERWRITE is True"""
    if OVERWRITE or not path.exists():
        path.write_text(content, encoding='utf-8')
        print(f"[+] Created: {path}")
    else:
        print(f"[-] Skipped (exists): {path}")

def create_structure():
    """Create the complete Rap Dictionary Master Hub structure"""

    # Create hub root
    hub_root = Path(ROOT_PATH) / HUB_NAME
    hub_root.mkdir(parents=True, exist_ok=True)
    print(f"\nCreating Rap Dictionary Master Hub at:\n   {hub_root}\n")

    # Create main README
    create_file(hub_root / "README.md", HUB_README)

    # Create A-Z folders
    for letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
        letter_folder = hub_root / letter
        letter_folder.mkdir(exist_ok=True)

        # Create subfolders
        words_folder = letter_folder / "01_Words"
        phrases_folder = letter_folder / "02_Phrases"
        rhymes_folder = letter_folder / "03_Rhymes"
        exports_folder = letter_folder / "04_Exports"

        words_folder.mkdir(exist_ok=True)
        phrases_folder.mkdir(exist_ok=True)
        rhymes_folder.mkdir(exist_ok=True)
        exports_folder.mkdir(exist_ok=True)

        # Create example word folder
        example_word_folder = words_folder / "_example_word"
        example_word_folder.mkdir(exist_ok=True)
        create_file(example_word_folder / "word.md", WORD_TEMPLATE)

        # Create example phrase
        create_file(phrases_folder / "_example_phrase.md", PHRASE_TEMPLATE)

        # Create rhyme buckets
        end_rhymes = rhymes_folder / "End_Rhymes"
        slant_rhymes = rhymes_folder / "Slant_Rhymes"
        multi_rhymes = rhymes_folder / "Multi_Rhymes"

        end_rhymes.mkdir(exist_ok=True)
        slant_rhymes.mkdir(exist_ok=True)
        multi_rhymes.mkdir(exist_ok=True)

        create_file(end_rhymes / "README.md", RHYME_END_README)
        create_file(slant_rhymes / "README.md", RHYME_SLANT_README)
        create_file(multi_rhymes / "README.md", RHYME_MULTI_README)

        # Create letter index
        letter_index_content = LETTER_INDEX_TEMPLATE.format(letter=letter)
        create_file(letter_folder / f"{letter.lower()}_index.md", letter_index_content)

        print(f"[*] {letter}/ complete")

    print(f"\nRap Dictionary Master Hub created successfully!")
    print(f"Location: {hub_root}")
    print(f"\nStart adding words and building your arsenal!\n")

if __name__ == "__main__":
    create_structure()
