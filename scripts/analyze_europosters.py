import requests
from bs4 import BeautifulSoup
import json

URL = "https://www.europosters.ro/tablou-pe-panza-din-mai-multe-piese/"
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

    # Try to find products. Common classes involve 'product', 'item'
    # Look for elements that might contain product links
    potential_products = []
    
    # Strategy 1: Look for 'article' tags or divs with class *product*
    articles = soup.find_all('article')
    print(f"Found {len(articles)} <article> tags.")
    
    if not articles:
        divs = soup.find_all('div', class_=lambda x: x and 'product' in x.lower())
        print(f"Found {len(divs)} divs with 'product' in class.")
        articles = divs[:5] # Analyze first 5

    # Inspect the structure of found divs more closely
    for i, item in enumerate(divs[:10]):
        print(f"\n--- Div {i+1} (Classes: {item.get('class')}) ---")
        
        # Check if it has an image
        img = item.find('img')
        if img:
            print(f"  Image: {img.get('src')}")
        
        # Check if it has a link
        links = item.find_all('a', href=True)
        for l in links:
            print(f"  Link: {l['href']} (Text: {l.get_text(strip=True)})")
            
        # Check text
        txt = item.get_text(strip=True)
        if len(txt) < 50:
            print(f"  Text: {txt}")

    # Try to find a common parent for image and title link if they seem split


if __name__ == "__main__":
    analyze()
