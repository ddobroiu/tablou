import requests
from bs4 import BeautifulSoup
import json
import re

# Test cu pagina art-photo de pe Europosters
CATEGORY_URL = "https://www.europosters.ro/art-photo/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def analyze_category_page():
    """Analizează structura unei pagini de categorie"""
    print(f"Fetching category page: {CATEGORY_URL}")
    
    try:
        response = requests.get(CATEGORY_URL, headers=HEADERS, timeout=15)
        response.raise_for_status()
        print(f"✓ Status: {response.status_code}")
    except Exception as e:
        print(f"✗ Failed to fetch: {e}")
        return
    
    soup = BeautifulSoup(response.text, 'html.parser')
    print(f"✓ Page Title: {soup.title.string.strip() if soup.title else 'No Title'}\n")
    
    # Căutăm produse - mai multe strategii
    print("=== Strategy 1: Looking for product containers ===")
    
    # Europosters folosește de obicei class-uri ca 'product-item', 'product-box', etc.
    product_containers = soup.find_all(['div', 'article'], class_=re.compile(r'product|item', re.I))
    print(f"Found {len(product_containers)} potential product containers\n")
    
    if product_containers:
        print("=== Analyzing first 3 products ===")
        for i, container in enumerate(product_containers[:3], 1):
            print(f"\n--- Product {i} ---")
            print(f"Classes: {container.get('class')}")
            
            # Căutăm imaginea
            img = container.find('img')
            if img:
                img_src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
                print(f"Image: {img_src}")
                print(f"Alt: {img.get('alt', 'N/A')}")
            
            # Căutăm link-ul produsului
            link = container.find('a', href=True)
            if link:
                href = link['href']
                if not href.startswith('http'):
                    href = 'https://www.europosters.ro' + href
                print(f"Link: {href}")
                print(f"Link Text: {link.get_text(strip=True)}")
            
            # Căutăm titlul
            title_elem = container.find(['h2', 'h3', 'h4', 'span'], class_=re.compile(r'title|name', re.I))
            if title_elem:
                print(f"Title: {title_elem.get_text(strip=True)}")
            
            # Căutăm prețul (pentru referință)
            price_elem = container.find(['span', 'div'], class_=re.compile(r'price', re.I))
            if price_elem:
                print(f"Price: {price_elem.get_text(strip=True)}")
    
    # Strategy 2: Căutăm în JSON-LD sau alte scripturi
    print("\n\n=== Strategy 2: Looking for structured data ===")
    scripts = soup.find_all('script', type='application/ld+json')
    if scripts:
        print(f"Found {len(scripts)} JSON-LD scripts")
        for i, script in enumerate(scripts[:2], 1):
            try:
                data = json.loads(script.string)
                print(f"\nJSON-LD {i}:")
                print(json.dumps(data, indent=2)[:500])  # First 500 chars
            except:
                pass
    
    # Strategy 3: Căutăm grid-ul de produse
    print("\n\n=== Strategy 3: Looking for product grid ===")
    grid = soup.find(['div', 'ul'], class_=re.compile(r'grid|list|products', re.I))
    if grid:
        print(f"Found grid: {grid.get('class')}")
        items = grid.find_all(['div', 'li'], recursive=False)
        print(f"Grid contains {len(items)} direct children")

def analyze_product_page():
    """Analizează structura unei pagini de produs individual"""
    # Vom folosi un URL de test după ce găsim unul din category page
    print("\n\n=== Product Page Analysis (will be implemented after category analysis) ===")

if __name__ == "__main__":
    analyze_category_page()
    # analyze_product_page()  # Vom implementa după ce avem URL-uri
