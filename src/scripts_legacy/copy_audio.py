import os
import shutil
import json

source_dir = "Instrumentals-For-Rhyme-Book"
dest_dir = os.path.join("web", "public", "audio")
js_output = os.path.join("web", "src", "lib", "data", "tracks.js")

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

# Ensure output directory for JS exists
os.makedirs(os.path.dirname(js_output), exist_ok=True)

tracks = []

for filename in os.listdir(source_dir):
    src_file = os.path.join(source_dir, filename)
    if os.path.isfile(src_file):
        # Copy file
        dest_file = os.path.join(dest_dir, filename)
        shutil.copy2(src_file, dest_file)
        print(f"Copied {filename}")
        
        # Add to tracks list
        name = os.path.splitext(filename)[0]
        tracks.append({
            "title": name,
            "src": f"/audio/{filename}"
        })

# Write JS file
with open(js_output, "w") as f:
    f.write("export const tracks = ")
    json.dump(tracks, f, indent=2)
    f.write(";\n")

print("Done.")

