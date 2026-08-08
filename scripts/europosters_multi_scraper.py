"""
Europosters Multi-Product Scraper
Extrage imagini de pe Europosters, le uploadează la R2, și creează 4 variante de produse
"""

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
from deep_translator import GoogleTranslator

load_dotenv('.env.local')

# R2 Configuration
ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
ACCESS_KEY = os.getenv('R2_ACCESS_KEY_ID')
SECRET_KEY = os.getenv('R2_SECRET_ACCESS_KEY')
ENDPOINT_URL = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"
BUCKET_NAME = 'prynt-assets'
R2_PUBLIC_DOMAIN = "https://pub-6b8f161e90f040688bbfecff19d5cac3.r2.dev"

# Europosters Configuration
# Europosters Configuration
CATEGORY_URLS = [
    "https://www.europosters.ro/afise-cu-filme-si-seriale/",
    "https://www.europosters.ro/postere-jocuri/",
    "https://www.europosters.ro/portrete-de-staruri-muzicale/",
    "https://www.europosters.ro/sport/",
    "https://www.europosters.ro/harta-lumii/",
    "https://www.europosters.ro/arta-din-jurul-nostru/",
    "https://www.europosters.ro/imagini-si-postere-cu-animale/",
    "https://www.europosters.ro/fantezie/" 
]
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

# Product Variants Configuration
VARIANTS_CONFIG = {
    'afis': {
        'price': 29,
        'route_prefix': '/afise',
        'name_ro': 'Afiș',
        'description_suffix': 'pe hârtie premium'
    },
    'canvas': {
        'price': 79,
        'route_prefix': '/canvas',
        'name_ro': 'Canvas',
        'description_suffix': 'pe pânză canvas'
    },
    'tapet': {
        'price': 149,
        'route_prefix': '/tapet',
        'name_ro': 'Tapet',
        'description_suffix': 'ca fototapet'
    },
    'autocolant': {
        'price': 39,
        'route_prefix': '/autocolante',
        'name_ro': 'Autocolant',
        'description_suffix': 'ca autocolant decorativ'
    }
}

def get_s3_client():
    """Creează client S3 pentru R2"""
    return boto3.client(
        's3',
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name='auto'
    )

def download_image(url, local_path):
    """Download imagine de pe Europosters"""
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
    """Upload imagine la R2"""
    try:
        # Check dacă există deja
        try:
            s3.head_object(Bucket=BUCKET_NAME, Key=r2_key)
            print(f"  ⚡ Already exists in R2: {r2_key}")
            return f"{R2_PUBLIC_DOMAIN}/{r2_key}"
        except ClientError:
            pass
        
        # Upload
        s3.upload_file(
            local_path,
            BUCKET_NAME,
            r2_key,
            ExtraArgs={'ContentType': 'image/jpeg'}
        )
        
        public_url = f"{R2_PUBLIC_DOMAIN}/{r2_key}"
        print(f"  ✓ Uploaded to R2: {r2_key}")
        return public_url
        
    except Exception as e:
        print(f"  ✗ R2 upload failed: {e}")
        return None

def translate_title(english_title):
    """Traduce titlul în română folosind Google Translate"""
    # 1. Eliminăm prefixul "Poster" din engleză înainte de traducere
    clean_title = english_title.replace('Poster ', '').strip()
    
    # 2. Dicționar manual pentru termeni specifici sau corecții
    manual_translations = {
        'Brothers for Life': 'Frați Pe Viață',
        'Desertstorm': 'Furtună În Deșert',
        'Love is Universal': 'Dragostea Este Universală',
        'Amsterdam colors': 'Culorile Amsterdam-ului',
        'Sagrada Familia Temple': 'Templul Sagrada Familia',
        'Cappodocia Hot Air Balloon': 'Baloane Cu Aer Cald În Cappadocia',
        'Around the world': 'În Jurul Lumii',
        'October Days': 'Zile De Octombrie',
        'Greenland fire sky': 'Cer De Foc În Groenlanda'
    }
    
    for en, ro in manual_translations.items():
        if en in clean_title:
            clean_title = clean_title.replace(en, ro)

    # 3. Traducere automată
    try:
        translated = GoogleTranslator(source='auto', target='ro').translate(clean_title)
        return translated if translated else clean_title
    except Exception as e:
        print(f"  ⚠ Translation failed for '{clean_title}': {e}")
        return clean_title

def generate_seo_description(title_ro, variant_type):
    """Generează descriere SEO unică pentru fiecare tip de variantă"""
    
    # Descrieri specifice pentru fiecare tip de produs
    variant_descriptions = {
        'afis': [
            f"Descoperă {title_ro} ca afiș premium pe hârtie fotografică de calitate. Perfect pentru încadrare, acest poster aduce eleganță oricărui spațiu. Disponibil în multiple dimensiuni, livrare rapidă în toată România.",
            f"{title_ro} - afiș pe hârtie premium, ideal pentru decorarea pereților. Design modern, culori vibrante și calitate superioară. Comandă online cu livrare gratuită.",
            f"Transformă-ți spațiul cu afișul {title_ro}. Imprimat pe hârtie fotografică de înaltă calitate, perfect pentru living, dormitor sau birou. Personalizează dimensiunile după preferințe.",
            f"Afiș {title_ro} - calitate premium pentru decorarea casei tale. Hârtie fotografică rezistentă, culori intense și detalii clare. Livrare rapidă în toată România.",
        ],
        'canvas': [
            f"Descoperă {title_ro} ca tablou canvas premium pe pânză. Întins pe ramă de lemn, acest canvas aduce profunzime și eleganță spațiului tău. Disponibil în multiple dimensiuni, livrare rapidă.",
            f"{title_ro} - tablou canvas pe pânză de calitate superioară. Întins pe ramă de lemn, gata de montat. Design modern pentru living, dormitor sau birou. Comandă online cu livrare gratuită.",
            f"Transformă-ți casa cu tabloul canvas {title_ro}. Pânză premium întinsă pe ramă de lemn, rezistentă în timp. Personalizează dimensiunile și creează atmosfera perfectă.",
            f"Canvas {title_ro} - calitate premium pentru decorarea casei tale. Pânză de înaltă rezoluție pe ramă de lemn, gata de montat. Livrare rapidă în toată România.",
        ],
        'tapet': [
            f"Descoperă {title_ro} ca tapet decorativ premium. Transformă complet peretele cu acest fototapet de înaltă rezoluție. Disponibil în dimensiuni personalizate, livrare rapidă în toată România.",
            f"{title_ro} - tapet decorativ de calitate superioară. Acoperă întregi pereți cu design modern și culori vibrante. Perfect pentru living, dormitor sau spații comerciale. Comandă online.",
            f"Transformă-ți spațiul cu tapetul {title_ro}. Fototapet premium, rezistent la umiditate, ușor de aplicat. Personalizează dimensiunile exact pentru peretele tău.",
            f"Tapet {title_ro} - calitate premium pentru decorarea pereților. Fototapet de înaltă rezoluție, rezistent și ușor de întreținut. Livrare rapidă în toată România.",
        ],
        'autocolant': [
            f"Descoperă {title_ro} ca autocolant decorativ premium. Aplicare ușoară pe orice suprafață netedă, îndepărtare fără urme. Perfect pentru personalizarea spațiului tău. Livrare rapidă.",
            f"{title_ro} - autocolant decorativ de calitate superioară. Vinil premium, rezistent la apă și UV. Ideal pentru pereți, mobilier sau geamuri. Comandă online cu livrare gratuită.",
            f"Transformă-ți spațiul cu autocolantul {title_ro}. Vinil premium, aplicare ușoară, îndepărtare fără urme. Personalizează dimensiunile și creează design-ul perfect.",
            f"Autocolant {title_ro} - calitate premium pentru decorarea casei tale. Vinil rezistent, culori vibrante și aplicare simplă. Livrare rapidă în toată România.",
        ]
    }
    
    # Alegem template bazat pe hash-ul titlului (pentru varietate)
    templates = variant_descriptions.get(variant_type, variant_descriptions['afis'])
    template_index = hash(title_ro) % len(templates)
    return templates[template_index]

def create_slug(title):
    """Creează slug din titlu"""
    # Lowercase și înlocuim spații
    slug = title.lower()
    
    # Înlocuim caractere speciale românești
    replacements = {
        'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't',
        'Ă': 'a', 'Â': 'a', 'Î': 'i', 'Ș': 's', 'Ț': 't'
    }
    for old, new in replacements.items():
        slug = slug.replace(old, new)
    
    # Păstrăm doar litere, cifre și spații
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    
    # Înlocuim spații cu -
    slug = re.sub(r'\s+', '-', slug)
    
    # Eliminăm - multiple
    slug = re.sub(r'-+', '-', slug)
    
    return slug.strip('-')

def extract_categories_from_product_page(url):
    """Extrage categoria și subcategoria din pagina produsului (Breadcrumbs sau Tags)"""
    if not url:
        return {'category': 'art-photo', 'subcategory': 'europosters', 'genre': None}
    
    try:
        # print(f"  📂 Fetching categories from {url}...")
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 1. Try Breadcrumbs (Generic)
        breadcrumbs = soup.find(['nav', 'div', 'ul'], class_=re.compile(r'breadcrumb', re.I))
        if breadcrumbs:
            links = breadcrumbs.find_all('a')
            categories = [link.get_text(strip=True) for link in links if link.get_text(strip=True)]
            # Filter generic
            categories = [c for c in categories if c.lower() not in ['home', 'acasa', 'homepage', 'postere']]
            
            if len(categories) >= 1:
                category = 'art-photo' # Force main category to align with system
                subcategory = categories[0]
                genre = categories[1] if len(categories) >= 2 else None
                print(f"  ✓ Categories (Breadcrumb): {category} > {subcategory} > {genre}")
                return {
                    'category': category,
                    'subcategory': subcategory.lower().replace(' ', '-'),
                    'genre': genre.lower().replace(' ', '-') if genre else None
                }

        # 2. Try Tags "Categorii asemănătoare"
        tag_header = soup.find(['h4', 'h3', 'div'], string=re.compile(r'Categorii asemănătoare|Similar categories', re.I))
        if tag_header:
            container = tag_header.find_next_sibling('div') or tag_header.parent
            if container:
                links = container.find_all('a')
                tags = [l.get_text(strip=True) for l in links if l.get_text(strip=True)]
                # Filter 'Postere', 'Cadouri', etc.
                tags = [t for t in tags if 'Poster' not in t and 'Cadou' not in t and 'Art' not in t]
                
                if tags:
                    category = 'art-photo'
                    subcategory = tags[0]
                    genre = tags[1] if len(tags) > 1 else None
                    
                    print(f"  ✓ Categories (Tags): {category} > {subcategory} > {genre}")
                    return {
                        'category': category,
                        'subcategory': subcategory.lower().replace(' ', '-'),
                        'genre': genre.lower().replace(' ', '-') if genre else None
                    }

        # 3. Fallback from URL
        parts = url.split('/')
        # Example: /postere/filme/star-wars OR /art-photo/something
        if 'postere' in parts:
             idx = parts.index('postere')
             if len(parts) > idx + 1:
                  return {'category': 'art-photo', 'subcategory': parts[idx+1], 'genre': None}
        elif 'art-photo' in parts:
              if len(parts) >= 2:
                  return {'category': 'art-photo', 'subcategory': parts[-2], 'genre': None}

    except Exception as e:
        print(f"  ✗ Failed to extract categories: {e}")
    
    # Default
    return {'category': 'art-photo', 'subcategory': 'europosters', 'genre': None}


def create_product_variants(base_product, r2_image_url, categories):
    """Creează 4 variante de produse din imaginea de bază"""
    variants = []
    
    title_ro = translate_title(base_product['title'])
    slug_base = create_slug(title_ro)
    
    # Keywords SEO pentru fiecare tip
    seo_keywords = {
        'afis': ['poster', 'afis', 'tablou'],
        'canvas': ['canvas', 'tablou', 'panza'],
        'tapet': ['tapet', 'fototapet', 'perete'],
        'autocolant': ['autocolant', 'sticker', 'decorativ']
    }
    
    for variant_type, config in VARIANTS_CONFIG.items():
        # Titlu optimizat SEO cu keywords (fără "Tablou" forțat)
        seo_title = f"{title_ro} - {config['name_ro']}"
        
        variant = {
            'id': f"{base_product.get('id', 'poster')}-{variant_type}",
            'base_id': base_product.get('id'),
            'variant_type': variant_type,
            'title': seo_title,
            'original_name': base_product['title'],
            'description': generate_seo_description(title_ro, variant_type),
            'image': r2_image_url,
            'category': categories.get('category', 'art-photo'),
            'subcategory': categories.get('subcategory', 'europosters'),
            'genre': categories.get('genre'),
            'price': config['price'],
            'currency': 'RON',
            'slug': f"{variant_type}-{slug_base}",
            'route': f"{config['route_prefix']}/{variant_type}-{slug_base}",
            'configurator': config['route_prefix'],
            'tags': [
                categories.get('category', 'art-photo'),
                categories.get('subcategory', 'europosters'),
                variant_type,
                'tablou',
                'poster',
                'canvas',
                'tapet',
                'autocolant'
            ],
            'metadata': {
                'seo_title': f"{seo_title} | Prynt.ro - Canvas, Poster, Tapet, Autocolant",
                'seo_description': generate_seo_description(title_ro, variant_type),
                'alt_text': f"{config['name_ro']} {title_ro} - disponibil ca tablou canvas, poster, tapet sau autocolant",
                'original_url': base_product.get('url', ''),
                'source_image': base_product.get('image', ''),
                'breadcrumbs': f"{categories.get('category')} > {categories.get('subcategory')}" + (f" > {categories.get('genre')}" if categories.get('genre') else ""),
                'keywords': seo_keywords[variant_type]
            },
            'related_variants': [
                {'type': vt, 'slug': f"{vt}-{slug_base}"}
                for vt in VARIANTS_CONFIG.keys() if vt != variant_type
            ]
        }
        
        variants.append(variant)
    
    return variants

def scrape_and_process(limit=100):
    """Scraper principal cu paginare și append"""
    print("="*60)
    print("🚀 Europosters Multi-Product Scraper (Append Mode)")
    print("="*60)
    
    # Verificăm credențialele
    if not all([ACCOUNT_ID, ACCESS_KEY, SECRET_KEY]):
        print("❌ Missing R2 credentials in .env.local")
        return
    
    # Creăm client R2
    s3 = get_s3_client()
    print("✓ R2 client initialized\n")
    
    output_file = 'public/posters/products-europosters.json'
    all_variants = []
    processed_urls = set()
    next_id_num = 1
    
    # Încărcăm datele existente
    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                all_variants.extend(existing_data)
                
                # Colectăm URL-urile originale pentru a evita duplicatele
                for v in existing_data:
                    url = v.get('metadata', {}).get('original_url')
                    if url:
                        processed_urls.add(url)
                    
                    # Determinăm următorul ID disponibil
                    base_id = v.get('base_id', '')
                    if base_id.startswith('europosters-'):
                        try:
                            num = int(base_id.split('-')[1])
                            next_id_num = max(next_id_num, num + 1)
                        except:
                            pass
                            
            print(f"📂 Loaded {len(existing_data)} existing variants")
            print(f"🔗 Found {len(processed_urls)} processed URLs")
            print(f"🔢 Starting ID counter from: {next_id_num}")
        except Exception as e:
            print(f"⚠️ Error loading existing file: {e}")
            
    temp_dir = 'temp_europosters'
    os.makedirs(temp_dir, exist_ok=True)
    
    new_products_count = 0
    
    # Iterate through categories
    for category_url in CATEGORY_URLS:
        if new_products_count >= limit:
            break
            
        print(f"\n{'='*60}")
        print(f"🌍 SWITCHING TO CATEGORY: {category_url}")
        print(f"{'='*60}")
        
        page = 1
        
        while new_products_count < limit:
            url = f"{category_url}?page={page}"
            print(f"\n📥 Fetching page {page} ({url})...")
            
            try:
                response = requests.get(url, headers=HEADERS, timeout=30)
                if response.status_code == 404:
                    print("🏁 End of pagination for category.")
                    break
                response.raise_for_status()
            except Exception as e:
                print(f"❌ Failed to fetch page {page}: {e}")
                break
                
            soup = BeautifulSoup(response.text, 'html.parser')
            products = soup.find_all('div', class_=re.compile(r'product-thumb', re.I))
            
            if not products:
                print("🏁 No more products found.")
                break
                
            print(f"✓ Found {len(products)} products on page {page}")
            
            skipped_on_page = 0
            products_on_page_count = len(products)
            
            for product in products:
                if new_products_count >= limit:
                    break
                    
                # Extragem link (pentru verificare duplicate)
                link = product.find('a', href=re.compile(r'/(art-photo|postere)/', re.I))
                url = link.get('href', '') if link else ''
                
                if url and not url.startswith('http'):
                    url = 'https://www.europosters.ro' + url.split('?')[0]
                    
                if url in processed_urls:
                    skipped_on_page += 1
                    continue
                    
                # Extragem imagine
                img = product.find('img')
                if not img:
                    skipped_on_page += 1
                    continue
                
                img_url = img.get('src') or img.get('data-src')
                if not img_url or 'storage.googleapis.com' not in img_url:
                    skipped_on_page += 1
                    continue
                
                title = img.get('alt', f'Poster {next_id_num}')
                
                print(f"\n{'='*60}")
                print(f"Processing New Product {new_products_count + 1}/{limit}")
                print(f"📌 Title: {title}")
                
                # Download
                img_filename = f"europosters-{next_id_num}.jpg"
                local_path = os.path.join(temp_dir, img_filename)
                
                if not download_image(img_url, local_path):
                    continue
                    
                # Upload R2
                title_slug = create_slug(title)[:40]
                r2_key = f"posters/canvas-poster-tapet-autocolant-{title_slug}-{next_id_num}.jpg"
                r2_url = upload_to_r2(s3, local_path, r2_key)
                
                if not r2_url:
                    continue
                
                # Categorii
                categories = extract_categories_from_product_page(url)
                
                # Base Product Object
                base_product = {
                    'id': f'europosters-{next_id_num}',
                    'title': title,
                    'image': img_url,
                    'url': url
                }
                
                # Creează variante
                variants = create_product_variants(base_product, r2_url, categories)
                all_variants.extend(variants)
                processed_urls.add(url)
                
                new_products_count += 1
                next_id_num += 1
                
                print(f"✅ Added {len(variants)} variants")
                
                # Cleanup
                try:
                    os.remove(local_path)
                except:
                    pass
                
                time.sleep(1)
                
            # Check for duplicates on page
            if skipped_on_page >= products_on_page_count:
                print(f"🏁 Page {page} only contained duplicates ({skipped_on_page}/{products_on_page_count}). Moving to next category.")
                break
                
            page += 1
        
    # Salvare finală
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_variants, f, ensure_ascii=False, indent=2)
    
    print(f"\n\n{'='*60}")
    print(f"✅ Scraping Complete!")
    print(f"📊 New products added: {new_products_count}")
    print(f"📦 Total variants in file: {len(all_variants)}")
    print(f"💾 Saved to: {output_file}")

if __name__ == "__main__":
    scrape_and_process(limit=1000)
