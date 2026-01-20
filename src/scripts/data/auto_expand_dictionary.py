#!/usr/bin/env python3
import os
import sys
import json
import requests
import re
from pathlib import Path


# --- CONFIGURATION ---
API_KEY = "AIzaSyBqui9VFmbDI7QaxWD5onITVNFZWKag4SU"
# Adjusted for new location: src/scripts/data/
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
BASE_PATH = ROOT_DIR / "knowledge_base" / "dictionary"
BASE_URL = "https://generativelanguage.googleapis.com/v1beta"

# ... rest of auto_expand_dictionary.py content ...
