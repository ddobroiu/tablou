import json
import os

JSON_FILE = 'public/canvas/products-r2-optimized.json'
OLD_DOMAIN = 'https://pub-cddc2e12a0093629d37fdc3198767846.r2.dev'
NEW_DOMAIN = 'https://cdn.prynt.ro'

def main():
    if not os.path.exists(JSON_FILE):
        print(f"File not found: {JSON_FILE}")
        return

    print(f"Reading {JSON_FILE}...")
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    if OLD_DOMAIN not in content:
        print(f"No occurrences of {OLD_DOMAIN} found.")
        return

    print(f"Replacing {OLD_DOMAIN} with {NEW_DOMAIN}...")
    new_content = content.replace(OLD_DOMAIN, NEW_DOMAIN)

    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Done! URLs updated.")

if __name__ == "__main__":
    main()
