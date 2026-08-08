
import json
import os
import requests
from bs4 import BeautifulSoup
import re
import time

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

def extract_categories_from_product_page(url):
    """Extrage categoria și subcategoria din pagina produsului (Breadcrumbs sau Tags)"""
    if not url:
        return None
    
    try:
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
                category = 'art-photo' # Force main
                subcategory = categories[0]
                genre = categories[1] if len(categories) >= 2 else None
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
                    return {
                        'category': category,
                        'subcategory': subcategory.lower().replace(' ', '-'),
                        'genre': genre.lower().replace(' ', '-') if genre else None
                    }

    except Exception as e:
        print(f"  ✗ Failed to extract categories: {e}")
    
    return None

def update_categories():
    json_path = 'public/posters/products-europosters.json'
    if not os.path.exists(json_path):
        print("JSON not found")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        variants = json.load(f)

    print(f"Loaded {len(variants)} variants.")
    
    processed_base_ids = set()
    updates_count = 0
    
    for i, v in enumerate(variants):
        base_id = v.get('base_id')
        if not base_id or base_id in processed_base_ids:
            continue
            
        current_sub = v.get('subcategory')
        # Only update if subcategory is 'europosters' (generic)
        if current_sub != 'europosters':
             processed_base_ids.add(base_id)
             continue

        url = v.get('metadata', {}).get('original_url')
        if not url:
            continue

        print(f"[{base_id}] Updating categories from {url}...")
        cats = extract_categories_from_product_page(url)
        
        if cats:
            print(f"  ✓ Found: {cats}")
            # Update all variants with this base_id
            for target in variants:
                if target.get('base_id') == base_id:
                    target['category'] = cats['category']
                    target['subcategory'] = cats['subcategory']
                    target['genre'] = cats['genre']
                    # Update breadcrumbs metadata too
                    new_bread = f"{cats['category']} > {cats['subcategory']}" + (f" > {cats['genre']}" if cats['genre'] else "")
                    target['metadata']['breadcrumbs'] = new_bread
                    # Update tags? Maybe keep valid tags
            updates_count += 1
        else:
            print("  ✗ Could not extract categories")
        
        processed_base_ids.add(base_id)
        time.sleep(0.5)

    if updates_count > 0:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(variants, f, ensure_ascii=False, indent=2)
        print(f"✅ Updated {updates_count} products (sets of variants).")
    else:
        print("No updates needed.")

if __name__ == "__main__":
    update_categories()
