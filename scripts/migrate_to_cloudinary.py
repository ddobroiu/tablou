import json
import os
import time
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv

# Load env vars
load_dotenv('.env.local')

# Configuration
INPUT_JSON = 'public/canvas/products-seo-optimized.json'
OUTPUT_JSON = 'public/canvas/products-cloud-optimized.json'
STATE_FILE = 'migration_state.json'
CLOUD_FOLDER = 'prynt/canvas'

def setup_cloudinary():
    # Credentials from .env.local
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET'),
        secure=True
    )
    print(f"✅ Cloudinary Configured: {os.getenv('CLOUDINARY_CLOUD_NAME')}")

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_state(state):
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, indent=2)

def main():
    setup_cloudinary()
    
    # Load Data
    if not os.path.exists(INPUT_JSON):
        print(f"❌ Input file missing: {INPUT_JSON}")
        return

    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"📦 Total Products to Process: {len(products)}")
    
    # Load Migration State (local_path -> cloud_url)
    migration_map = load_state()
    
    updated_products = []
    stats = {'uploaded': 0, 'skipped': 0, 'errors': 0, 'cached': 0}
    
    for i, p in enumerate(products):
        local_rel_path = p.get('image', '')
        
        # Skip if already a URL or empty
        if not local_rel_path or local_rel_path.startswith('http'):
            stats['skipped'] += 1
            updated_products.append(p)
            continue
            
        # Normalize Path
        local_abs_path = os.path.join('public', local_rel_path.lstrip('/'))
        
        # CHECK 1: Already Migrated in this run?
        if local_rel_path in migration_map:
            p['image'] = migration_map[local_rel_path]
            updated_products.append(p)
            stats['cached'] += 1
            if i % 100 == 0:
                print(f"[{i}/{len(products)}] Using cached URL...")
            continue
            
        # CHECK 2: File Exists?
        if not os.path.exists(local_abs_path):
            print(f"⚠️ Missing File: {local_abs_path}")
            stats['errors'] += 1
            updated_products.append(p) # Keep original path if missing
            continue
            
        # UPLOAD
        try:
            # Use filename as public_id (without extension)
            filename = os.path.basename(local_abs_path)
            name_without_ext = os.path.splitext(filename)[0]
            public_id = f"{CLOUD_FOLDER}/{name_without_ext}"
            
            # Upload
            res = cloudinary.uploader.upload(
                local_abs_path, 
                public_id=public_id,
                unique_filename=False,
                overwrite=False, # Don't re-upload if exists (assumes immutable names)
                resource_type="image"
            )
            
            cloud_url = res.get('secure_url')
            
            # Update Product
            p['image'] = cloud_url
            
            # Update State
            migration_map[local_rel_path] = cloud_url
            stats['uploaded'] += 1
            
            # Save State Every 50 uploads
            if stats['uploaded'] % 50 == 0:
                save_state(migration_map)
                print(f"[{i}/{len(products)}] Uploaded 50 items... Saved state.")
                
        except Exception as e:
            print(f"❌ Upload Error for {local_abs_path}: {e}")
            stats['errors'] += 1
            
        updated_products.append(p)

    # Final Save
    save_state(migration_map)
    
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(updated_products, f, indent=2, ensure_ascii=False)
        
    print("\n" + "="*40)
    print("🚀 Migration Complete")
    print("="*40)
    print(f"Total:      {len(products)}")
    print(f"Uploaded:   {stats['uploaded']}")
    print(f"Cached:     {stats['cached']}")
    print(f"Skipped:    {stats['skipped']}")
    print(f"Errors:     {stats['errors']}")
    print(f"Saved to:   {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
