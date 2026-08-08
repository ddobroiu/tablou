import json
import os
import re
import random
import shutil
import time
from typing import List, Dict

# Paths
INPUT_JSON = "public/canvas/products-with-categories.json"
OUTPUT_JSON = "public/canvas/products-seo-optimized.json"
IMAGES_DIR = "public/canvas"
BACKUP_DIR = "public/canvas/backups"

# SEO Configuration
STYLES = {
    'abstracte': 'Modern Abstract',
    'flori': 'Natură Florală', 
    'peisaje': 'Peisaj Natural',
    'animale': 'Faună Sălbatică',
    'orase': 'Urban & Arhitectură',
    'moderne': 'Design Modern',
    'vintage': 'Stil Vintage',
    'harti': 'Cartografie & Travel'
}

DESCRIPTION_TEMPLATES = [
    "Transformă-ți spațiul cu {title}. Acest tablou canvas {style} aduce o notă de {vibe} în orice încăpere. Imprimat la rezoluție înaltă pe pânză de bumbac și întins pe șasiu de lemn tratat, este gata de agățat pe perete.",
    "Adaugă eleganță casei tale cu {title}. Un produs premium din colecția {collection}, ideal pentru {room}. Culorile vibrante și detaliile {style} vor atrage toate privirile.",
    "Descoperă {title}, o piesă de artă {style} perfectă pentru decorul tău. Realizat din materiale eco-friendly, acest tablou canvas redă fidel nuanțele de {colors} și atmosfera {vibe}.",
    "Creează o atmosferă unică cu {title}. Fie că îl pui în living sau dormitor, acest tablou {collection} va deveni rapid piesa de rezistență a decorului."
]

VIBES = ['rafinament', 'energie', 'calm', 'sofisticare', 'culoare', 'dinamism', 'poveste']
ROOMS = ['living', 'dormitor', 'birou', 'hol', 'zona de relaxare']

def slugify(text: str) -> str:
    """Creates a clean URL/filename slug"""
    text = text.lower()
    text = re.sub(r'[ăâ]', 'a', text)
    text = re.sub(r'[î]', 'i', text)
    text = re.sub(r'[ș]', 's', text)
    text = re.sub(r'[ț]', 't', text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text

def optimize_title(product: Dict) -> str:
    """Generates a rich SEO title"""
    theme = (product.get('arthubSubcategory') or '').replace('-', ' ').title()
    style_raw = product.get('arthubCategory', 'moderne')
    style = STYLES.get(style_raw, 'Modern').split(' ')[0]
    
    # Use translated name if available
    detail_raw = product.get('name_ro') or product.get('name')
    detail = detail_raw.replace('Tablou Canvas', '').strip()
    
    if theme.lower() in detail.lower():
        detail = detail.lower().replace(theme.lower(), '').strip()
    
    parts = ["Tablou Canvas"]
    if theme: parts.append(theme)
    if style and style.lower() not in theme.lower(): parts.append(style)
    if detail and len(detail) > 2: parts.append(detail.title())
    
    final_title = " ".join(parts)
    words = final_title.split()
    seen = set()
    clean_words = []
    for w in words:
        if w.lower() not in seen:
            clean_words.append(w)
            seen.add(w.lower())
    
    return " ".join(clean_words)

def generate_description(title: str, category: str) -> str:
    template = random.choice(DESCRIPTION_TEMPLATES)
    style_full = STYLES.get(category, 'Artă Modernă')
    
    return template.format(
        title=title,
        style=style_full,
        vibe=random.choice(VIBES),
        collection=category.title(),
        room=random.choice(ROOMS),
        colors="vii și rezistente la UV"
    )

def main():
    print("🚀 Starting SEO Optimization (Safe Mode)...")
    
    # 0. Backup
    if os.path.exists(INPUT_JSON):
        os.makedirs(BACKUP_DIR, exist_ok=True)
        backup_path = os.path.join(BACKUP_DIR, f"products-backup-{int(time.time())}.json")
        shutil.copy(INPUT_JSON, backup_path)
        print(f"📦 Backup created at: {backup_path}")
    
    try:
        with open(INPUT_JSON, 'r', encoding='utf-8') as f:
            products = json.load(f)
    except FileNotFoundError:
        print(f"❌ Input file {INPUT_JSON} not found!")
        return

    # Load existing IDs if map exists to ensure stability
    existing_map = {}
    if os.path.exists(OUTPUT_JSON):
        try:
            with open(OUTPUT_JSON, 'r', encoding='utf-8') as f:
                old_data = json.load(f)
                for item in old_data:
                    # Map original URL or Name to ID/Filename to keep consistency
                    key = item.get('metadata', {}).get('original_url') or item.get('original_name')
                    existing_map[key] = item
        except:
            pass

    optimized_products = []
    stats = {'processed': 0, 'renamed': 0, 'skipped': 0, 'errors': 0}
    total = len(products)

    for idx, p in enumerate(products):
        print(f"\rProcessing {idx+1}/{total}...", end="")
        stats['processed'] += 1
        
        # Identity Logic
        original_url = p.get('originalUrl')
        original_name = p.get('name')
        lookup_key = original_url or original_name
        
        existing_item = existing_map.get(lookup_key)
        
        # 1. SEO Data
        new_title = optimize_title(p)
        description = generate_description(new_title, p.get('arthubCategory', 'moderne'))
        new_slug = slugify(new_title)
        
        # 2. Image Handling (Smart & Aggressive)
        # Find where the file is currently located
        current_physical_path = None
        
        # Check A: Original Scrape Path
        path_a_rel = p.get('image', '').lstrip('/')
        path_a_abs = os.path.join("public", path_a_rel)
        if os.path.exists(path_a_abs):
            current_physical_path = path_a_abs
            
        # Check B: Previous Optimized Path (if available)
        if not current_physical_path and existing_item:
             path_b_rel = existing_item.get('image', '').lstrip('/')
             path_b_abs = os.path.join("public", path_b_rel)
             if os.path.exists(path_b_abs):
                 current_physical_path = path_b_abs
        
        # Desired Path
        new_filename = f"{new_slug}.jpg"
        new_image_rel_path = f"/canvas/{new_filename}" 
        new_image_abs_path = os.path.join(IMAGES_DIR, new_filename)
        
        if current_physical_path:
             # If current path implies we need to rename (mismatch with target)
             # Note: samefile check handles case where paths differ string-wise but point to same file
             should_rename = True
             if current_physical_path == new_image_abs_path:
                 should_rename = False
             elif os.path.exists(new_image_abs_path) and os.path.samefile(current_physical_path, new_image_abs_path):
                 should_rename = False
                 
             if should_rename:
                  # Collision Check
                  counter = 1
                  base_slug = new_slug
                  while os.path.exists(new_image_abs_path):
                       # Verify it's not the same file (again, just to be safe)
                       if os.path.samefile(current_physical_path, new_image_abs_path):
                            break
                       new_filename = f"{base_slug}-{counter}.jpg"
                       new_image_abs_path = os.path.join(IMAGES_DIR, new_filename)
                       counter += 1
                  
                  # Final check before move
                  if not os.path.exists(new_image_abs_path):
                       try:
                           os.rename(current_physical_path, new_image_abs_path)
                           new_image_rel_path = f"/canvas/{new_filename}"
                           stats['renamed'] += 1
                       except OSError as e:
                           # Fallback
                           relative_current = os.path.relpath(current_physical_path, "public").replace("\\", "/")
                           new_image_rel_path = f"/{relative_current}"
                           stats['errors'] += 1
                  else:
                       # Collision persisted or same file
                       new_image_rel_path = f"/canvas/{os.path.basename(new_image_abs_path)}"
             else:
                  # Already correct
                  new_image_rel_path = f"/canvas/{new_filename}"
        else:
             stats['skipped'] += 1
             # Keep old path reference even if missing
             new_image_rel_path = existing_item.get('image') if existing_item else p.get('image')
        
        # 3. Construct Object
        stable_id = existing_item.get('id') if existing_item else f"canvas-{idx+1}"
        
        opt_p = {
            "id": stable_id,
            "title": new_title,
            "original_name": original_name,
            "description": description,
            "image": new_image_rel_path,
            "category": p.get('arthubCategory', 'moderne'),
            "subcategory": p.get('arthubSubcategory', 'diverse'),
            "price": 79,
            "currency": "RON",
            "slug": new_slug, 
            "tags": [p.get('arthubCategory'), p.get('arthubSubcategory'), "tablou canvas", "decor perete"],
            "metadata": {
                "seo_title": f"{new_title} | Prynt.ro",
                "seo_description": description[:160],
                "alt_text": new_title,
                "original_url": original_url,
                "source_image": p.get('sourceImage')
            }
        }
        optimized_products.append(opt_p)

    # Save
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(optimized_products, f, indent=2, ensure_ascii=False)
        
    print("\n\n" + "="*40)
    print("📊 Execution Summary")
    print("="*40)
    print(f"Total Products:   {total}")
    print(f"Processed:        {stats['processed']}")
    print(f"Renamed Images:   {stats['renamed']}")
    print(f"Skipped/Missing:  {stats['skipped']}")
    print(f"Errors:           {stats['errors']}")
    print(f"Output File:      {OUTPUT_JSON}")
    print("="*40)

if __name__ == "__main__":
    main()
