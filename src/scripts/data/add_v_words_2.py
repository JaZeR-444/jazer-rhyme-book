#!/usr/bin/env python3
import os
import sys
from pathlib import Path

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Adjusted to find root from src/scripts/data/
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
BASE_PATH = ROOT_DIR / "knowledge_base" / "dictionary"

# ... rest of add_v_words_2.py content ...
