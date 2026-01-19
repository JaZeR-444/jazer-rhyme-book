import os

files_to_remove = [
    r"data\cinema\entities\the-matrix.json",
    r"data\places\entities\new-york-bronx.json"
]

for file_path in files_to_remove:
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"Removed: {file_path}")
        except Exception as e:
            print(f"Error removing {file_path}: {e}")
    else:
        print(f"Already gone: {file_path}")

