import json

json_path = 'public/canvas/products-r2-optimized.json'
old_domain = 'https://pub-cddc2e12a0093629d37fdc3198767846.r2.dev'
new_domain = 'https://poze.prynt.ro'
# Also handle the user's verified one just in case it slipped in
verified_r2 = 'https://pub-6b8f161e90f040688bbfecff19d5cac3.r2.dev'

try:
    with open(json_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Simple string replacement is faster and safer for this structured data
    # ensuring we don't partial match if not careful, but exact domain match is safe
    new_content = content.replace(old_domain, new_domain)
    # Also replace the verified R2 with custom domain if present (standardization)
    new_content = new_content.replace(verified_r2, new_domain)

    if content != new_content:
        with open(json_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully updated URLs in products-r2-optimized.json")
    else:
        print("No changes needed in products-r2-optimized.json (URLs might already be correct or different domain used)")
        
except Exception as e:
    print(f"Error: {e}")
