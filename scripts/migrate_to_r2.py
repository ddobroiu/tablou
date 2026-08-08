import json
import os
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from dotenv import load_dotenv

load_dotenv('.env.local')

# Configuration
INPUT_JSON = 'public/canvas/products-seo-optimized.json'
OUTPUT_JSON = 'public/canvas/products-r2-optimized.json'
STATE_FILE = 'r2_migration_state.json'

ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
ACCESS_KEY = os.getenv('R2_ACCESS_KEY_ID')
SECRET_KEY = os.getenv('R2_SECRET_ACCESS_KEY')
ENDPOINT_URL = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"

# Bucket & Domain
BUCKET_NAME = 'prynt-assets'
PUBLIC_DOMAIN = os.getenv('R2_PUBLIC_DOMAIN')  # User instructions needed if not set

if not PUBLIC_DOMAIN:
    # Fallback to dev subdomain pattern if not provided, but likely needs user confirmation
    # Or we can assume user will map it later. For now, we store the relative path or raw R2 URL.
    # We will assume a placeholder and let the user replace it in frontend config if needed.
    PUBLIC_DOMAIN = f"https://pub-{ACCOUNT_ID[:8]}.r2.dev" 
    print(f"⚠️ R2_PUBLIC_DOMAIN not set. Using placeholder: {PUBLIC_DOMAIN}")

def get_s3_client():
    return boto3.client(
        's3',
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name='auto'  # R2 requires this but ignores it
    )

def ensure_bucket(s3):
    try:
        s3.head_bucket(Bucket=BUCKET_NAME)
        print(f"✅ Bucket '{BUCKET_NAME}' exists.")
    except ClientError:
        print(f"I️ Bucket '{BUCKET_NAME}' not found. Creating...")
        try:
            s3.create_bucket(Bucket=BUCKET_NAME)
            print(f"✅ Created bucket '{BUCKET_NAME}'.")
        except Exception as e:
            print(f"❌ Failed to create bucket: {e}")
            raise e

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_state(state):
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, indent=2)

def main():
    print("🚀 Starting R2 Migration...")
    
    if not ACCOUNT_ID or not ACCESS_KEY or not SECRET_KEY:
        print("❌ Missing R2 credentials in .env.local")
        return

    s3 = get_s3_client()
    ensure_bucket(s3)
    
    # Load Data
    if not os.path.exists(INPUT_JSON):
        print(f"❌ Input file missing: {INPUT_JSON}")
        return

    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        products = json.load(f)
        
    migration_map = load_state()
    updated_products = []
    stats = {'uploaded': 0, 'skipped': 0, 'errors': 0, 'cached': 0}
    
    print(f"📦 Processing {len(products)} products...")
    
    for i, p in enumerate(products):
        local_rel_path = p.get('image', '')
        
        # Skip if invalid
        if not local_rel_path or local_rel_path.startswith('http'):
            stats['skipped'] += 1
            updated_products.append(p)
            continue
            
        local_abs_path = os.path.join('public', local_rel_path.lstrip('/'))
        
        # Check Cache
        if local_rel_path in migration_map:
            p['image'] = migration_map[local_rel_path]
            updated_products.append(p)
            stats['cached'] += 1
            if i % 100 == 0: print(f"[{i}] Cached...")
            continue
            
        # Check Existence
        if not os.path.exists(local_abs_path):
            print(f"⚠️ Missing: {local_abs_path}")
            stats['errors'] += 1
            updated_products.append(p)
            continue
            
        # Upload
        try:
            key = f"canvas/{os.path.basename(local_abs_path)}"
            
            # Smart Check: Only upload if object doesn't exist (save bandwidth/calls)
            try:
                s3.head_object(Bucket=BUCKET_NAME, Key=key)
                # Exists
            except ClientError:
                # Doesn't exist, upload
                s3.upload_file(
                    local_abs_path, 
                    BUCKET_NAME, 
                    key,
                    ExtraArgs={'ContentType': 'image/jpeg'} # Key for serving images correctly!
                )
                stats['uploaded'] += 1
            
            # Construct Public URL
            # Format: {PUBLIC_DOMAIN}/{key}
            public_url = f"{PUBLIC_DOMAIN}/{key}"
            
            p['image'] = public_url
            migration_map[local_rel_path] = public_url
            
            if stats['uploaded'] % 50 == 0 and stats['uploaded'] > 0:
                print(f"[{i}] Uploaded 50 items... Saved state.")
                save_state(migration_map)
                
        except Exception as e:
            print(f"❌ Error uploading {key}: {e}")
            stats['errors'] += 1
            
        updated_products.append(p)
        
    save_state(migration_map)
    
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(updated_products, f, indent=2, ensure_ascii=False)
        
    print(f"\n✅ Done! File saved to {OUTPUT_JSON}")
    print(f"Stats: {stats}")

if __name__ == "__main__":
    main()
