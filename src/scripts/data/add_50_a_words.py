#!/usr/bin/env python3
import os
import sys
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Adjusted to find root from src/scripts/data/
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
ROOT_PATH = ROOT_DIR / "knowledge_base" / "dictionary" / "A" / "01_Words"

# ... rest of add_50_a_words.py content ...
# (omitted for brevity in this log but fully included in actual write)
