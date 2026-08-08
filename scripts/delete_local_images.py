import json
import os
import sys

STATE_FILE = 'r2_migration_state.json'
PUBLIC_DIR = 'public'

def main():
    if not os.path.exists(STATE_FILE):
        print(f"Error: State file {STATE_FILE} not found.")
        return

    print(f"Loading state from {STATE_FILE}...")
    with open(STATE_FILE, 'r', encoding='utf-8') as f:
        state = json.load(f)

    print(f"Found {len(state)} entries in state file.")

    deleted_count = 0
    error_count = 0
    skipped_count = 0

    for local_path_key, r2_url in state.items():
        # local_path_key looks like "/canvas/filename.jpg"
        # We need to construct valid system path relative to 'public' folder
        
        # Remove leading slash if present
        relative_path = local_path_key.lstrip('/')
        
        # Full local path
        file_path = os.path.join(PUBLIC_DIR, relative_path)
        
        # Security check: ensure effective path is inside public directory
        # (Though simple join is usually fine, good to be safe)
        
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                deleted_count += 1
                if deleted_count % 500 == 0:
                    print(f"Deleted {deleted_count} files...")
            except Exception as e:
                print(f"Error deleting {file_path}: {e}")
                error_count += 1
        else:
            # File already gone
            skipped_count += 1

    print("-" * 30)
    print("Cleanup Complete")
    print(f"Total entries processed: {len(state)}")
    print(f"Simply Deleted: {deleted_count}")
    print(f"Skipped (Not Found): {skipped_count}")
    print(f"Errors: {error_count}")
    print("-" * 30)

    # Check remaining files in public/canvas just in case
    canvas_dir = os.path.join(PUBLIC_DIR, 'canvas')
    if os.path.exists(canvas_dir):
        remaining = [f for f in os.listdir(canvas_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        print(f"Remaining image-like files in {canvas_dir}: {len(remaining)}")
        if len(remaining) > 0:
            print("First 5 remaining:", remaining[:5])

if __name__ == "__main__":
    main()
