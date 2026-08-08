
import requests
from bs4 import BeautifulSoup
import json
import os
import re
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv('.env.local')

# R2 Configuration
ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
ACCESS_KEY = os.getenv('R2_ACCESS_KEY_ID')
SECRET_KEY = os.getenv('R2_SECRET_ACCESS_KEY')
ENDPOINT_URL = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"
BUCKET_NAME = 'prynt-assets'
R2_PUBLIC_DOMAIN = "https://pub-6b8f161e90f040688bbfecff19d5cac3.r2.dev"

BASE_URL = "https://stickermania.ro/cumpara/bannere/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
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
        print(f"  ✗ R2 upload failed: {e}")
        return None

def enhance_description(original_desc):
    # Create a more marketing-oriented description
    intro = "<strong>Banner Publicitar PRO - Vizibilitate Maximă pentru Afacerea Ta!</strong><br><br>"
    
    features = """
    <p>Atrage clienții cu un banner profesional, rezistent și vibrant. Ideal pentru promovarea ofertelor, a locației sau a evenimentelor tale.</p>
    <ul>
        <li>✅ <strong>Material Premium:</strong> Frontlit (poliplan) de înaltă rezistență, tratat UV și anti-umezeală.</li>
        <li>✅ <strong>Print Outdoor:</strong> Culori intense, rezistente la razele soarelui și ploaie.</li>
        <li>✅ <strong>Finisaje Incluse:</strong> Tiv perimetral pentru rezistență sporită și capse de prindere la fiecare 50cm.</li>
        <li>✅ <strong>Gata de Montaj:</strong> Îl primești complet finisat, gata să fie afișat.</li>
    </ul>
    <p><em>Ai nevoie de o altă dimensiune? Folosește configuratorul nostru pentru bannere personalizate!</em></p>
    """
    
    clean_desc = re.sub(r'<[^>]+>', '', original_desc).strip()
    return f"{intro}{features}<br><p>{clean_desc}</p>"

def scrape_banners():
    print("🚀 Starting Stickermania Banners Scraper...")
    
    s3 = get_s3_client()
    products = []
    
    try:
        # Get Product List
        res = requests.get(BASE_URL, headers=HEADERS)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        links = soup.select('.woocommerce-LoopProduct-link')
        print(f"Found {len(links)} products.")

        os.makedirs('temp_banners', exist_ok=True)
        
        for idx, link in enumerate(links):
            product_url = link['href']
            print(f"\n[{idx+1}/{len(links)}] Processing: {product_url}")
            
            p_res = requests.get(product_url, headers=HEADERS)
            p_soup = BeautifulSoup(p_res.text, 'html.parser')
            
            # Title
            title_elem = p_soup.select_one('h1.product_title')
            if not title_elem:
                continue
            title = title_elem.text.strip()
            
            # Variations Data
            form = p_soup.select_one('form.variations_form')
            variants_data = []
            
            if form and form.has_attr('data-product_variations'):
                raw_vars = json.loads(form['data-product_variations'])
                for v in raw_vars:
                    # Find size attribute
                    size = v['attributes'].get('attribute_pa_marime-banner', '')
                    if not size:
                        # Fallback try finding any attribute
                        for k, val in v['attributes'].items():
                            if 'marime' in k:
                                size = val
                                break
                    
                    price = v['display_price']
                    variants_data.append({
                        'size': size,
                        'price': price,
                        'id': v['variation_id']
                    })
            else:
                # Simple product?
                price_elem = p_soup.select_one('.price .amount')
                price = float(price_elem.text.replace('lei', '').replace('.', '').replace(',', '.').strip()) if price_elem else 0
                variants_data.append({
                    'size': 'Standard',
                    'price': price,
                    'id': 'simple'
                })

            # Image
            img_elem = p_soup.select_one('.woocommerce-product-gallery__image img')
            img_url = img_elem['src'] if img_elem else None
            
            r2_url = None
            if img_url:
                local_path = f"temp_banners/banner_{idx}.jpg"
                if download_image(img_url, local_path):
                    slug = re.sub(r'[^a-z0-9-]', '', title.lower().replace(' ', '-'))
                    r2_key = f"products/banners/{slug}.jpg"
                    r2_url = upload_to_r2(s3, local_path, r2_key)
                    
            # Description
            desc_elem = p_soup.select_one('.product-short-description')
            raw_desc = desc_elem.text.strip() if desc_elem else ""
            final_desc = enhance_description(raw_desc)
            
            # Construct Product Object
            product_obj = {
                "id": f"banner-sm-{idx}",
                "title": title,
                "slug": re.sub(r'[^a-z0-9-]', '', title.lower().replace(' ', '-')),
                "description": final_desc,
                "images": [r2_url] if r2_url else [],
                "price": variants_data[0]['price'] if variants_data else 0,
                "category": "bannere",
                "metadata": {
                    "source": "stickermania",
                    "original_url": product_url,
                    "type": "banner-predefinit",
                    "variants": variants_data
                }
            }
            products.append(product_obj)
            print(f"  ✅ Added product: {title} ({len(variants_data)} sizes)")
            
            time.sleep(1)

        # Save to JSON
        with open('scripts/data/banners_stickermania.json', 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
            
        print("\n🎉 DONE! Saved to scripts/data/banners_stickermania.json")

    except Exception as e:
        print(f"CRITICAL ERROR: {e}")

if __name__ == "__main__":
    scrape_banners()
