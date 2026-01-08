import os
import json

base_dir = r"C:\Users\JaZeR\OneDrive\Desktop\2026 → JaZeR Mainframe\2026 → JaZeR Master Flow Knowledge Hub\data"

domains = [
    "history",
    "sports",
    "fashion",
    "vehicles",
    "weapons-objects",
    "philosophy-ideas",
    "emotions-states",
    "aesthetics-visuals",
    "business-economics",
    "science-future",
    "mythology-legend",
    "architecture-spaces",
    "rituals-symbols",
    "time-energy",
    "media-platforms"
]

for domain in domains:
    domain_path = os.path.join(base_dir, domain)
    
    # Create directories
    os.makedirs(os.path.join(domain_path, "entities"), exist_ok=True)
    os.makedirs(os.path.join(domain_path, "indexes"), exist_ok=True)
    os.makedirs(os.path.join(domain_path, "relations"), exist_ok=True)
    
    # Create index files
    indexes_path = os.path.join(domain_path, "indexes")
    
    with open(os.path.join(indexes_path, "alias_map.json"), "w") as f:
        json.dump({}, f, indent=2)
        
    with open(os.path.join(indexes_path, "by_era.json"), "w") as f:
        json.dump({}, f, indent=2)
        
    with open(os.path.join(indexes_path, "by_tag.json"), "w") as f:
        json.dump({}, f, indent=2)
        
    # Create relations file
    relations_path = os.path.join(domain_path, "relations")
    
    with open(os.path.join(relations_path, "relations.json"), "w") as f:
        json.dump([], f, indent=2)

print("Scaffolding complete.")
