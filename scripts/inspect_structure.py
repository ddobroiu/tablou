
import requests
from bs4 import BeautifulSoup
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

url = "https://stickermania.ro/catalog/indicator-avertizare-zona-supravegheata-video/"
print(f"Fetching {url}...")
resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
soup = BeautifulSoup(resp.text, 'html.parser')

print("\n--- JSON-LD ---")
scripts = soup.find_all('script', type='application/ld+json')
for s in scripts:
    print(s.string[:500] + "...")

print("\n--- Variations Form ---")
v_form = soup.select_one('form.variations_form')
if v_form:
    v_data = v_form.get('data-product_variations')
    if v_data:
        parsed_v = json.loads(v_data)
        print(f"Found {len(parsed_v)} variations")
        for v in parsed_v[:3]:
            print(f"  - Alt: {v.get('attributes')}, Price: {v.get('display_price')}, SKU: {v.get('sku')}")
    else:
        print("Form found but no data-product_variations")
else:
    print("No variations form found")

print("\n--- Breadcrumbs ---")
bc = soup.select_one('.woocommerce-breadcrumb') or soup.select_one('nav.breadcrumbs')
if bc:
    print(bc.get_text(strip=True, separator=' > '))
else:
    print("No breadcrumbs found")

