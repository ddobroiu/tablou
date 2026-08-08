import requests
from bs4 import BeautifulSoup
import json

URL = "https://www.europosters.ro/art-photo/noapte-instelata-peste-rhone-v50972?canvas=2&pocetDilu=3"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def analyze():
    print(f"Fetching {URL}...")
    try:
        response = requests.get(URL, headers=HEADERS, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to fetch: {e}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    
    print(f"Page Title: {soup.title.string.strip() if soup.title else 'No Title'}")

    # 1. Product Title
    h1 = soup.find('h1')
    print(f"H1: {h1.get_text(strip=True) if h1 else 'None'}")

    # 2. Main Image
    # Usually in a wrapper or with ID 'main-image' or similar
    images = soup.find_all('img')
    print(f"\nScanning {len(images)} images for candidates...")
    
    candidates = []
    for img in images:
        src = img.get('src')
        alt = img.get('alt', '')
        # Filter for large images or those containing specific keywords
        if src and ('static.posters.cz' in src) and ('large' in src or 'middle' in src or 'high' in src):
            candidates.append(src)
        
        # Also check for og:image meta
    
    og_image = soup.find('meta', property='og:image')
    if og_image:
        print(f"OG Image: {og_image.get('content')}")

    print("Candidate Images from <img> tags:")
    for c in candidates[:5]:
        print(f" - {c}")

    # 3. Dimensions / Size
    # Look for select options or specific divs
    # "Dimensiune" is likely key
    # 3. Dimensions / Size
    print("\nScanning for 'Dimensiune' or size selectors...")
    # Look for label containing Dimensiune
    labels = soup.find_all(lambda tag: tag.name in ['label', 'strong', 'span'] and 'Dimensiune' in tag.get_text())
    for l in labels:
        print(f"Found Label: {l.get_text(strip=True)}")
        parent = l.parent
        # Print next siblings
        print(f"  Parent content: {parent.get_text(strip=True)[:100]}")
        # Look for select
        sel = parent.find('select')
        if sel:
             options = sel.find_all('option')
             print("  Select Options:")
             for o in options:
                 print(f"    - {o.get_text(strip=True)} (value={o.get('value')})")

    # Look for active size
    active_size = soup.find(class_=lambda x: x and 'active' in x and 'size' in x)
    if active_size:
        print(f"Active Size Class: {active_size.get_text(strip=True)}")

    # Check for higher res image
    if og_image:
        url = og_image.get('content')
        if '/750/' in url:
            high_res = url.replace('/750/', '/original/')
            print(f"Testing High Res: {high_res}")
            try:
                h = requests.head(high_res, headers=HEADERS, timeout=5)
                print(f"  High Res Status: {h.status_code}")
                if h.status_code != 200:
                     high_res_alt = url.replace('/750/', '/large/') # Try large if original fails
                     print(f"  Testing Large Res: {high_res_alt}")
            except:
                print("  Failed to check high res.")


    # 4. JSON-LD Data
    # Many sites have structured data
    scripts = soup.find_all('script', type='application/ld+json')
    if scripts:
        print(f"\nFound {len(scripts)} JSON-LD scripts.")
        try:
             data = json.loads(scripts[0].string)
             print("JSON-LD Dump:")
             print(json.dumps(data, indent=2)[:500]) # First 500 chars
        except:
            print("Failed to parse JSON-LD")

if __name__ == "__main__":
    analyze()
