
import requests
from bs4 import BeautifulSoup
import json
import os
import re
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from urllib.parse import urlparse
import time

load_dotenv('.env.local')

# R2 Configuration
ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
ACCESS_KEY = os.getenv('R2_ACCESS_KEY_ID')
SECRET_KEY = os.getenv('R2_SECRET_ACCESS_KEY')
ENDPOINT_URL = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"
BUCKET_NAME = 'prynt-assets'
R2_PUBLIC_DOMAIN = "https://pub-6b8f161e90f040688bbfecff19d5cac3.r2.dev"

BASE_URL = "https://stickermania.ro/cumpara/semnalistica/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

def get_s3_client():
    return boto3.client(
        's3',
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name='auto'
    )

def download_image(url, local_path):
    try:
        response = requests.get(url, headers=HEADERS, timeout=30, stream=True)
        response.raise_for_status()
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"✗ Failed to download {url}: {e}")
        return False

def upload_to_r2(s3, local_path, r2_key):
    try:
        try:
            s3.head_object(Bucket=BUCKET_NAME, Key=r2_key)
            print(f"  ⚡ Already exists in R2: {r2_key}")
            return f"{R2_PUBLIC_DOMAIN}/{r2_key}"
        except ClientError:
            pass
        s3.upload_file(local_path, BUCKET_NAME, r2_key, ExtraArgs={'ContentType': 'image/jpeg'})
        print(f"  ✓ Uploaded to R2: {r2_key}")
        return f"{R2_PUBLIC_DOMAIN}/{r2_key}"
    except Exception as e:
        print(f"✗ R2 upload failed: {e}")
        return None

def create_slug(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


def scrape_stickermania(limit=1000):
    s3 = get_s3_client()
    output_file = 'public/stickermania/products-stickermania.json'
    temp_dir = 'temp_stickermania'
    os.makedirs(temp_dir, exist_ok=True)
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    # Load existing
    existing_data = []
    start_counter = 1
    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                if existing_data:
                    # Find max ID
                    for item in existing_data:
                        try:
                            num = int(item['id'].split('-')[1])
                            start_counter = max(start_counter, num + 1)
                        except: pass
        except: pass
    
    processed_urls = {v.get('metadata', {}).get('original_url') for v in existing_data if v.get('metadata')}
    
    # 1. Get Subcategories
    print(f"🌐 Fetching categories from {BASE_URL}...")
    resp = requests.get(BASE_URL, headers=HEADERS)
    soup = BeautifulSoup(resp.text, 'html.parser')
    subcats = []
    for a in soup.find_all('a', href=True):
        if '/cumpara/semnalistica/' in a['href'] and a['href'] != BASE_URL:
            subcats.append(a['href'])
    
    subcats = list(dict.fromkeys(subcats)) # unique
    print(f"Found {len(subcats)} subcategories")

    new_products_count = 0
    all_variants = existing_data
    current_idx = start_counter

    for subcat_url in subcats:
        if new_products_count >= limit: break
        print(f"\n📂 Subcategory: {subcat_url}")
        
        page = 1
        while new_products_count < limit:
            p_url = f"{subcat_url}page/{page}/" if page > 1 else subcat_url
            r = requests.get(p_url, headers=HEADERS)
            if r.status_code == 404: break
            
            s = BeautifulSoup(r.text, 'html.parser')
            products = s.select('.product')
            if not products: break
            
            for p in products:
                if new_products_count >= limit: break
                
                link_el = p.select_one('a')
                if not link_el: continue
                prod_url = link_el['href']
                
                if prod_url in processed_urls:
                    print(f"  ⏭️ Skipping existing: {prod_url}")
                    continue
                
                # Fetch product detail
                pd_r = requests.get(prod_url, headers=HEADERS)
                pd_s = BeautifulSoup(pd_r.text, 'html.parser')
                
                title_el = pd_s.select_one('.product_title')
                if not title_el: continue
                title = title_el.get_text(strip=True)
                
                img_el = pd_s.select_one('.woocommerce-product-gallery__image img')
                if not img_el: continue
                img_url = img_el.get('data-src') or img_el.get('src')
                
                # Variations
                v_form = pd_s.select_one('form.variations_form')
                if not v_form: 
                    print(f"  ⚠️ No variations found for {title}")
                    continue
                    
                v_data_raw = v_form.get('data-product_variations', '[]')
                v_data = json.loads(v_data_raw)
                
                # Collect all variations
                product_variants = []
                for v in v_data:
                    attr = v.get('attributes', {}).get('attribute_pa_tip', '')
                    price = v.get('display_price')
                    
                    # Parse attr: "15x20cm-autocolant" or "20x30cm-placa-pvc-2mm"
                    parts = attr.split('-')
                    size = parts[0]
                    material_raw = "-".join(parts[1:])
                    
                    product_variants.append({
                        'id': f"sm-{current_idx}-{attr}",
                        'size': size,
                        'material': material_raw,
                        'price': price,
                        'sku': v.get('sku')
                    })
                
                # Categories from breadcrumbs
                bc = pd_s.select_one('.woocommerce-breadcrumb')
                cats = [t.strip() for t in bc.get_text(strip=True, separator='>').split('>') if t.strip()] if bc else []
                # Remove "Prima pagină" and "Semnalistica"
                clean_cats = [c for c in cats if c not in ["Prima pagină", "Semnalistica", ">", "/", "Indicatori"]]
                subcategory = clean_cats[0] if clean_cats else "General"

                # Process
                print(f"  ✨ Processing {new_products_count + 1}/{limit}: {title}")
                img_ext = os.path.splitext(urlparse(img_url).path)[1] or '.jpg'
                slug = create_slug(title)
                local_img = os.path.join(temp_dir, f"{slug}{img_ext}")
                
                if download_image(img_url, local_img):
                    r2_key = f"stickermania/{slug}{img_ext}"
                    r2_url = upload_to_r2(s3, local_img, r2_key)
                    
                    if r2_url:
                        all_variants.append({
                            'id': f"sm-{current_idx}",
                            'title': title,
                            'image': r2_url,
                            'priceBase': min([v['price'] for v in product_variants]) if product_variants else 0,
                            'category': 'Semnalistică',
                            'subcategory': subcategory,
                            'subcategoryLabel': title,
                            'slug': slug,
                            'routePrefix': '/semnalistica',
                            'variants': product_variants,
                            'metadata': {
                                'original_url': prod_url,
                                'source': 'stickermania',
                                'original_title': title
                            }
                        })
                        processed_urls.add(prod_url)
                        new_products_count += 1
                        current_idx += 1
                        print(f"    ✅ Added product with {len(product_variants)} variations")
                        
                        # Incremental save
                        with open(output_file, 'w', encoding='utf-8') as f:
                            json.dump(all_variants, f, indent=2, ensure_ascii=False)
                    
                    # Cleanup local
                    try: os.remove(local_img)
                    except: pass
                
                time.sleep(1)
            page += 1

    # Save
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_variants, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Done! Total new products added: {new_products_count}")

if __name__ == "__main__":
    scrape_stickermania(limit=1000)
