import requests
from bs4 import BeautifulSoup
import json
import re

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

def analyze_product_page(url):
    """Analizează o pagină de produs individual"""
    print(f"\n{'='*60}")
    print(f"Analyzing product page: {url}")
    print(f"{'='*60}\n")
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        print(f"✓ Status: {response.status_code}\n")
    except Exception as e:
        print(f"✗ Failed: {e}")
        return None
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    product_data = {}
    
    # 1. Titlu
    title = soup.find('h1')
    if title:
        product_data['title'] = title.get_text(strip=True)
        print(f"📌 Title: {product_data['title']}")
    
    # 2. Imagine principală (high-res)
    # Europosters folosește de obicei un container pentru imagine
    img_container = soup.find('div', class_=re.compile(r'product.*image|image.*product', re.I))
    if img_container:
        img = img_container.find('img')
        if img:
            img_src = img.get('src') or img.get('data-src') or img.get('data-zoom-image')
            product_data['image'] = img_src
            print(f"🖼️  Image: {img_src}")
    
    # Fallback: caută orice img mare
    if 'image' not in product_data:
        all_imgs = soup.find_all('img')
        for img in all_imgs:
            src = img.get('src', '')
            if 'storage.googleapis.com' in src or 'posters.cz' in src:
                product_data['image'] = src
                print(f"🖼️  Image (fallback): {src}")
                break
    
    # 3. Descriere
    desc = soup.find(['div', 'p'], class_=re.compile(r'description|desc', re.I))
    if desc:
        product_data['description'] = desc.get_text(strip=True)[:200]
        print(f"📝 Description: {product_data['description'][:100]}...")
    
    # 4. Categorie (din breadcrumbs)
    breadcrumbs = soup.find(['nav', 'div', 'ul'], class_=re.compile(r'breadcrumb', re.I))
    if breadcrumbs:
        links = breadcrumbs.find_all('a')
        categories = [link.get_text(strip=True) for link in links]
        product_data['breadcrumbs'] = categories
        print(f"🗂️  Breadcrumbs: {' > '.join(categories)}")
    
    # 5. Variante disponibile (Hârtie, Canvas, Tapet, Autocolant)
    variants = []
    variant_links = soup.find_all('a', href=re.compile(r'(canvas|sticker|material=vlies)', re.I))
    
    for link in variant_links[:10]:  # Primele 10
        href = link.get('href', '')
        text = link.get_text(strip=True)
        
        if 'canvas' in href.lower():
            variants.append({'type': 'canvas', 'text': text, 'url': href})
        elif 'sticker' in href.lower():
            variants.append({'type': 'autocolant', 'text': text, 'url': href})
        elif 'vlies' in href.lower():
            variants.append({'type': 'tapet', 'text': text, 'url': href})
        elif 'foto' in text.lower() or 'hartie' in text.lower():
            variants.append({'type': 'afis', 'text': text, 'url': href})
    
    if variants:
        product_data['variants'] = variants
        print(f"\n🎨 Variants found:")
        for v in variants:
            print(f"   - {v['type']}: {v['text']}")
    
    # 6. Meta tags pentru SEO
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if meta_desc:
        product_data['meta_description'] = meta_desc.get('content', '')
        print(f"\n🔍 Meta Description: {product_data['meta_description'][:100]}...")
    
    # 7. JSON-LD structured data
    scripts = soup.find_all('script', type='application/ld+json')
    for script in scripts:
        try:
            data = json.loads(script.string)
            if data.get('@type') == 'Product':
                product_data['structured_data'] = data
                print(f"\n📊 Structured Data Found:")
                print(f"   - Name: {data.get('name')}")
                print(f"   - Image: {data.get('image')}")
                if 'offers' in data:
                    print(f"   - Price: {data['offers'].get('price')} {data['offers'].get('priceCurrency')}")
                break
        except:
            pass
    
    return product_data


def extract_products_from_category(category_url, limit=10):
    """Extrage produse dintr-o pagină de categorie"""
    print(f"\n{'='*60}")
    print(f"Extracting products from: {category_url}")
    print(f"{'='*60}\n")
    
    try:
        response = requests.get(category_url, headers=HEADERS, timeout=15)
        response.raise_for_status()
    except Exception as e:
        print(f"✗ Failed: {e}")
        return []
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Găsim toate produsele cu clasa product-thumb
    products = soup.find_all('div', class_=re.compile(r'product-thumb', re.I))
    print(f"✓ Found {len(products)} products\n")
    
    extracted = []
    
    for i, product in enumerate(products[:limit], 1):
        print(f"--- Product {i} ---")
        
        data = {}
        
        # Link produs
        link = product.find('a', href=re.compile(r'/art-photo/'))
        if link:
            href = link.get('href', '')
            if not href.startswith('http'):
                href = 'https://www.europosters.ro' + href
            # Curățăm URL-ul de parametri (canvas, sticker, etc.)
            base_url = href.split('?')[0]
            data['url'] = base_url
            print(f"🔗 URL: {base_url}")
        
        # Imagine
        img = product.find('img')
        if img:
            img_src = img.get('src') or img.get('data-src')
            data['image'] = img_src
            data['alt'] = img.get('alt', '')
            print(f"🖼️  Image: {img_src}")
            print(f"📝 Alt: {data['alt']}")
        
        # Titlu (din alt sau link text)
        if 'alt' in data and data['alt']:
            data['title'] = data['alt']
        elif link:
            data['title'] = link.get_text(strip=True)
        
        if data.get('title'):
            print(f"📌 Title: {data['title']}")
        
        extracted.append(data)
        print()
    
    return extracted


if __name__ == "__main__":
    # Test 1: Extragem primele 10 produse din categoria art-photo
    print("="*60)
    print("STEP 1: Extracting products from category page")
    print("="*60)
    
    products = extract_products_from_category(
        "https://www.europosters.ro/art-photo/",
        limit=10
    )
    
    # Test 2: Analizăm primul produs în detaliu
    if products and products[0].get('url'):
        print("\n\n")
        print("="*60)
        print("STEP 2: Analyzing first product in detail")
        print("="*60)
        
        product_details = analyze_product_page(products[0]['url'])
        
        # Combinăm datele
        if product_details:
            products[0].update(product_details)
    
    # Salvăm rezultatele
    output_file = 'scripts/europosters-test-extraction.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    print(f"\n\n✅ Extraction complete! Saved to {output_file}")
    print(f"📊 Total products extracted: {len(products)}")
