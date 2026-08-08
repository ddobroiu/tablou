import requests
from bs4 import BeautifulSoup
import json
import os
import time
from urllib.parse import urljoin
import re
from typing import List, Dict, Optional

# Configurare
BASE_URL = "https://www.arthub.ro"
CANVAS_URL = f"{BASE_URL}/tablouri-canvas"
OUTPUT_DIR = "public/canvas"
JSON_OUTPUT = "public/canvas/products.json"
MAX_RETRIES = 3
DELAY_BETWEEN_REQUESTS = 0.5  # secunde
DELAY_BETWEEN_PAGES = 2  # secunde

# Creează directorul de output dacă nu există
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clean_filename(name: str) -> str:
    """Curăță numele fișierului de caractere invalide"""
    # Înlocuiește caracterele speciale cu underscore
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '-', name)
    return name.lower().strip('-')

def download_image(url: str, filename: str, retries: int = MAX_RETRIES) -> bool:
    """Descarcă o imagine și o salvează local cu retry logic"""
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    # Verifică dacă fișierul există deja
    if os.path.exists(filepath):
        print(f"⏭️  Există deja: {filename}")
        return True
    
    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=15, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ Descărcat: {filename} ({len(response.content) // 1024} KB)")
            return True
        except Exception as e:
            if attempt < retries - 1:
                print(f"⚠️  Încercare {attempt + 1}/{retries} eșuată pentru {filename}, reîncerc...")
                time.sleep(2)
            else:
                print(f"✗ Eroare la descărcarea {filename}: {e}")
                return False
    return False

def extract_image_from_page(product_url: str, retries: int = MAX_RETRIES) -> Optional[str]:
    """Extrage URL-ul imaginii principale dintr-o pagină de produs"""
    for attempt in range(retries):
        try:
            response = requests.get(product_url, timeout=15, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Strategie 1: Caută în tag-uri <img> cu atribute specifice
            img_selectors = [
                'img[src*="tablouri-canvas"]',
                'img[src*="images-arthub"]',
                'img.product-image',
                'img[itemprop="image"]',
                '.product-gallery img',
                'img[alt*="Tablou"]',
                'img[alt*="Canvas"]'
            ]
            
            for selector in img_selectors:
                img_tag = soup.select_one(selector)
                if img_tag:
                    src = img_tag.get('src') or img_tag.get('data-src')
                    if src and ('tablouri-canvas' in src or 'images-arthub' in src):
                        return src
            
            # Strategie 2: Caută în toate imaginile mari
            all_imgs = soup.find_all('img')
            for img in all_imgs:
                src = img.get('src', '') or img.get('data-src', '')
                if src and ('tablouri-canvas' in src or 'images-arthub' in src):
                    # Verifică dacă nu e thumbnail
                    if 'thumb' not in src.lower() and 'small' not in src.lower():
                        return src
            
            return None
            
        except Exception as e:
            if attempt < retries - 1:
                print(f"    ⚠️  Încercare {attempt + 1}/{retries} eșuată, reîncerc...")
                time.sleep(2)
            else:
                print(f"    ✗ Eroare la accesarea paginii: {e}")
                return None
    return None

def scrape_canvas_products() -> List[Dict]:
    """Extrage TOATE produsele canvas de pe arthub.ro"""
    products = []
    seen_names = set()
    page = 1
    max_pages = 500  # Limită extinsă pentru a lua toate produsele
    consecutive_empty_pages = 0
    
    print("🚀 Începem extragerea COMPLETĂ a produselor canvas de pe arthub.ro...")
    print(f"📁 Imaginile vor fi salvate în: {OUTPUT_DIR}")
    print(f"📄 Datele JSON vor fi salvate în: {JSON_OUTPUT}\n")
    
    while page <= max_pages:
        url = f"{CANVAS_URL}?page={page}"
        print(f"\n{'='*80}")
        print(f"📄 PAGINA {page}: {url}")
        print(f"{'='*80}")
        
        try:
            response = requests.get(url, timeout=15, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Caută link-uri către produse cu mai multe strategii
            product_links = []
            
            # Strategie 1: Link-uri cu pattern specific
            links = soup.select('a[href*="/tablou-canvas-"]')
            product_links.extend(links)
            
            # Strategie 2: Link-uri în containere de produse
            product_containers = soup.select('.product-card, .product-item, [class*="product"]')
            for container in product_containers:
                link = container.find('a', href=re.compile(r'/tablou-canvas-'))
                if link and link not in product_links:
                    product_links.append(link)
            
            # Elimină duplicate
            unique_links = []
            seen_hrefs = set()
            for link in product_links:
                href = link.get('href', '')
                if href and href not in seen_hrefs and 'tablou-canvas-' in href:
                    unique_links.append(link)
                    seen_hrefs.add(href)
            
            if not unique_links:
                consecutive_empty_pages += 1
                print(f"⚠️  Nu s-au găsit produse pe pagina {page}")
                
                if consecutive_empty_pages >= 3:
                    print(f"\n🛑 Am găsit {consecutive_empty_pages} pagini consecutive fără produse. Oprim extragerea.")
                    break
                
                page += 1
                time.sleep(DELAY_BETWEEN_PAGES)
                continue
            
            consecutive_empty_pages = 0
            print(f"✓ Găsite {len(unique_links)} produse unice pe această pagină")
            
            products_on_page = 0
            for idx, link in enumerate(unique_links, 1):
                href = link.get('href')
                product_url = urljoin(BASE_URL, href)
                
                # Extrage numele produsului - prioritizează URL-ul
                slug = href.split('/')[-1].split('?')[0]
                product_name = slug.replace('tablou-canvas-', '').replace('-', ' ').title()
                
                # Verifică dacă numele este valid
                if not product_name or len(product_name) < 3:
                    # Încearcă din atributul title sau alt
                    product_name = link.get('title', '') or link.get('alt', '')
                    if not product_name:
                        # Încearcă din textul link-ului, dar filtrează prețurile
                        text = link.get_text(strip=True)
                        if text and not re.match(r'^\d+\.?\d*\s*Lei', text):
                            product_name = text
                        else:
                            # Fallback la slug
                            product_name = slug.replace('tablou-canvas-', '').replace('-', ' ').title()
                
                # Skip dacă am văzut deja acest produs
                if product_name in seen_names:
                    print(f"  [{idx}/{len(unique_links)}] ⏭️  Duplicat: {product_name}")
                    continue
                
                seen_names.add(product_name)
                print(f"\n  [{idx}/{len(unique_links)}] 🎨 Procesăm: {product_name}")
                print(f"      URL: {product_url}")
                
                # Extrage imaginea produsului
                image_url = extract_image_from_page(product_url)
                
                if image_url:
                    # Asigură-te că URL-ul este complet
                    if not image_url.startswith('http'):
                        image_url = urljoin(BASE_URL, image_url)
                    
                    print(f"      📸 Imagine găsită: {image_url[:80]}...")
                    
                    # Generează numele fișierului
                    clean_name = clean_filename(product_name)
                    ext = image_url.split('.')[-1].split('?')[0].split('&')[0]
                    if ext not in ['jpg', 'jpeg', 'png', 'webp']:
                        ext = 'jpg'
                    
                    image_filename = f"{clean_name}.{ext}"
                    
                    # Descarcă imaginea
                    if download_image(image_url, image_filename):
                        products.append({
                            'name': product_name,
                            'image': f'/canvas/{image_filename}',
                            'originalUrl': product_url,
                            'sourceImage': image_url
                        })
                        products_on_page += 1
                else:
                    print(f"      ⚠️  Nu s-a găsit imagine pentru acest produs")
                
                # Pauză între produse
                time.sleep(DELAY_BETWEEN_REQUESTS)
            
            print(f"\n✅ Pagina {page} completă: {products_on_page} produse noi adăugate")
            print(f"📊 Total produse până acum: {len(products)}")
            
            # Logica de detectare "Next" a fost dezactivată.
            # Ne bazăm pe `consecutive_empty_pages` pentru a opri scriptul.
            # if not has_next: break
            
            page += 1
            
            # Salvează progresul la fiecare 5 pagini
            if page % 5 == 0:
                print(f"\n💾 Salvare intermediară... ({len(products)} produse)")
                with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
                    json.dump(products, f, ensure_ascii=False, indent=2)
            
            # Pauză între pagini
            print(f"\n⏳ Pauză {DELAY_BETWEEN_PAGES}s înainte de următoarea pagină...")
            time.sleep(DELAY_BETWEEN_PAGES)
            
        except Exception as e:
            print(f"\n❌ Eroare la procesarea paginii {page}: {e}")
            print(f"Continuăm cu următoarea pagină...")
            page += 1
            time.sleep(DELAY_BETWEEN_PAGES)
            continue
    
    # Salvează datele finale în JSON
    print(f"\n{'='*80}")
    print(f"💾 SALVARE FINALĂ")
    print(f"{'='*80}")
    with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    print(f"\n🎉 FINALIZAT CU SUCCES!")
    print(f"{'='*80}")
    print(f"✅ Au fost extrase {len(products)} produse canvas unice")
    print(f"📁 Imaginile sunt în: {OUTPUT_DIR}")
    print(f"📄 Datele JSON sunt în: {JSON_OUTPUT}")
    print(f"📄 Pagini procesate: {page}")
    print(f"{'='*80}")
    
    return products

if __name__ == "__main__":
    print("\n" + "="*80)
    print("🎨 SCRAPER ARTHUB.RO - TABLOURI CANVAS")
    print("="*80 + "\n")
    
    products = scrape_canvas_products()
    
    # Statistici finale
    print(f"\n📊 STATISTICI FINALE:")
    print(f"{'='*80}")
    print(f"Total produse: {len(products)}")
    
    # Grupează pe categorii
    categories = {
        'Abstracte': 0,
        'Flori': 0,
        'Peisaje': 0,
        'Auriu': 0,
        'Aripi': 0,
        'Fashion': 0,
        'Altele': 0
    }
    
    for product in products:
        name_lower = product['name'].lower()
        categorized = False
        
        if 'abstract' in name_lower:
            categories['Abstracte'] += 1
            categorized = True
        if any(word in name_lower for word in ['flower', 'lily', 'magnol', 'daisy', 'poppy', 'rose']):
            categories['Flori'] += 1
            categorized = True
        if any(word in name_lower for word in ['mountain', 'tatra', 'sea', 'nature', 'landscape']):
            categories['Peisaje'] += 1
            categorized = True
        if any(word in name_lower for word in ['gold', 'golden']):
            categories['Auriu'] += 1
            categorized = True
        if any(word in name_lower for word in ['angel', 'wings']):
            categories['Aripi'] += 1
            categorized = True
        if any(word in name_lower for word in ['lips', 'eyeliner', 'fashion']):
            categories['Fashion'] += 1
            categorized = True
        
        if not categorized:
            categories['Altele'] += 1
    
    for cat, count in categories.items():
        if count > 0:
            print(f"  • {cat}: {count} produse")
    
    print(f"\n📋 Primele 10 produse:")
    for i, product in enumerate(products[:10], 1):
        print(f"  {i}. {product['name']}")
    
    if len(products) > 10:
        print(f"  ... și încă {len(products) - 10} produse")
    
    print(f"\n{'='*80}")
    print("✨ Gata! Toate produsele au fost preluate cu succes!")
    print(f"{'='*80}\n")

