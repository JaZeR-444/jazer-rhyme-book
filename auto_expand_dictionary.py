#!/usr/bin/env python3
import os
import sys
import json
import requests
import re
from pathlib import Path


# --- CONFIGURATION ---
API_KEY = "AIzaSyBqui9VFmbDI7QaxWD5onITVNFZWKag4SU"
BASE_PATH = r"C:\Users\JaZeR\OneDrive\Desktop\2026 → JaZeR Mainframe\2026 → JaZeR Master Flow Knowledge Hub\Rap_Dictionary_Master_Hub"
BASE_URL = "https://generativelanguage.googleapis.com/v1beta"

def setup_console():
    if sys.platform == 'win32':
        sys.stdout.reconfigure(encoding='utf-8')

def get_model_url():
    """Dynamically finds a working Gemini model."""
    try:
        response = requests.get(f"{BASE_URL}/models?key={API_KEY}")
        response.raise_for_status()
        data = response.json()
        
        # Priority list
        priorities = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"]
        
        available_models = [m['name'] for m in data.get('models', []) if 'generateContent' in m.get('supportedGenerationMethods', [])]
        
        # Check for priorities
        for p in priorities:
            for model in available_models:
                if p in model:
                    print(f"[*] Using model: {model}")
                    return f"{BASE_URL}/{model}:generateContent?key={API_KEY}"
        
        # Fallback to first available
        if available_models:
            print(f"[*] Using fallback model: {available_models[0]}")
            return f"{BASE_URL}/{available_models[0]}:generateContent?key={API_KEY}"
            
    except Exception as e:
        print(f"[!] Model discovery failed: {e}")
    
    # Ultimate fallback
    return f"{BASE_URL}/models/gemini-1.5-flash:generateContent?key={API_KEY}"

MODEL_URL = get_model_url()

def get_existing_words(letter):
    """Scans the directory for existing word folders."""
    letter_path = Path(BASE_PATH) / letter / "01_Words"
    if not letter_path.exists():
        return []
    
    existing = []
    for item in letter_path.iterdir():
        if item.is_dir():
            existing.append(item.name.lower())
    return existing

def generate_new_words(letter, existing_words):
    """Calls Gemini API to populate 50 new words."""
    print(f"[*] Contacting Gemini AI to find 50 NEW words for '{letter}'...")
    print(f"[*] Exclusion list size: {len(existing_words)} words")

    prompt_text = f"""
    You are an expert Rap Lyricist and Linguist building a comprehensive Rap Dictionary.
    
    TASK:
    Generate a JSON list of exactly 50 NEW unique English words starting with the letter "{letter}".
    
    CONSTRAINTS:
    1. Do NOT use any of these existing words: {json.dumps(existing_words)}
    2. The output must be a valid JSON array of objects.
    3. Focus on words that have good potential for rap bars, metaphors, or street slang.
    4. "rap_meaning" should be how a rapper uses the word, not just the dictionary definition.
    5. "rhymes" should include End, Slant, and Multi-syllabic rhymes.
    
    JSON STRUCTURE FOR EACH OBSJECT:
    {{
        "name": "word-in-kebab-case",
        "word": "Capitalized Word",
        "letter": "{letter}",
        "meaning": "Standard dictionary definition",
        "rap_meaning": "Slang or specific rap context definition",
        "syllables": "Num (phon-et-ic)",
        "pos": "Part of Speech",
        "synonyms": "Comma separated list",
        "antonyms": "Comma separated list",
        "rhymes": "END: ... / SLANT: ... / MULTI: ...",
        "bars": [
            "Bar 1 example",
            "Bar 2 example",
            "Bar 3 example"
        ],
        "punchlines": [
            "Angle 1",
            "Angle 2",
            "Angle 3"
        ],
        "tags": "comma, separated, tags"
    }}
    """

    payload = {
        "contents": [{
            "parts": [{"text": prompt_text}]
        }],
        "generationConfig": {
            "temperature": 0.9,
            "maxOutputTokens": 8192,
            "responseMimeType": "application/json"
        }
    }

    try:
        response = requests.post(MODEL_URL, json=payload)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract text content
        generated_text = data['candidates'][0]['content']['parts'][0]['text']
        
        # Clean up any potential markdown formatting if the model disregards mimeType (safety net)
        generated_text = generated_text.replace("```json", "").replace("```", "").strip()
        
        words_data = json.loads(generated_text)
        return words_data
        
    except Exception as e:
        print(f"[!] Error generating words: {str(e)}")
        if 'response' in locals():
            print(f"Response: {response.text}")
        return []

def create_word_files(words_data):
    """Creates the markdown files for the generated words."""
    if not words_data:
        print("[!] No data to process.")
        return

    print(f"[*] Generated {len(words_data)} words. Writing files...")
    
    count = 0
    for word_data in words_data:
        try:
            # Ensure basic validation
            if "name" not in word_data or "word" not in word_data:
                continue

            letter = word_data.get("letter", word_data["word"][0].upper())
            letter_path = Path(BASE_PATH) / letter
            words_base_path = letter_path / "01_Words"
            words_base_path.mkdir(parents=True, exist_ok=True)
            
            word_folder = words_base_path / word_data["name"]
            
            if word_folder.exists():
                print(f"[-] Skipping {word_data['name']} (Already exists)")
                continue

            word_folder.mkdir(exist_ok=True)

            template = f"""# WORD: {word_data["word"]}

## Meaning (plain):
{word_data["meaning"]}

## Rap meaning (how I'd say it):
{word_data["rap_meaning"]}

## Syllables:
{word_data["syllables"]}

## Part of speech:
{word_data["pos"]}

## Synonyms:
{word_data["synonyms"]}

## Antonyms:
{word_data["antonyms"]}

## Rhyme ideas (end / slant / multi):
{word_data["rhymes"]}

## 3 bar-ready examples:
1. {word_data["bars"][0]}
2. {word_data["bars"][1]}
3. {word_data["bars"][2]}

## 3 punchline angles:
1. {word_data["punchlines"][0]}
2. {word_data["punchlines"][1]}
3. {word_data["punchlines"][2]}

## Tags:
{word_data["tags"]}
"""
            word_file = word_folder / "word.md"
            word_file.write_text(template, encoding='utf-8')
            print(f"[+] Created: {letter}/{word_data['name']}")
            count += 1
            
        except Exception as e:
            print(f"[!] Failed to write {word_data.get('name', 'Unknown')}: {e}")

    print(f"\n[=] Success! Added {count} new words.")

def main():
    setup_console()
    print("--- AUTOMATIC RAP DICTIONARY EXPANDER ---")
    print("This script uses your Gemini API key to generate new words.")
    
    if len(sys.argv) > 1:
        letter = sys.argv[1].upper()
    else:
        letter = input("Enter the letter you want to expand (e.g., Z): ").strip().upper()

    if len(letter) != 1 or not letter.isalpha():
        print("[!] Invalid letter.")
        return

    print(f"[*] analyzing current library for '{letter}'...")
    existing_words = get_existing_words(letter)
    print(f"[*] Found {len(existing_words)} existing words to exclude.")

    new_words = generate_new_words(letter, existing_words)
    create_word_files(new_words)

if __name__ == "__main__":
    main()
