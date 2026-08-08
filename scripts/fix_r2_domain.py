import json

json_path = 'public/canvas/products-r2-optimized.json'
old_domain = 'https://pub-cddc2e12a0093629d37fdc3198767846.r2.dev'
correct_domain = 'https://pub-6b8f161e90f040688bbfecff19d5cac3.r2.dev'

print(f"Replacing {old_domain} with {correct_domain}...")

try:
    with open(json_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Count occurrences
    count = content.count(old_domain)
    print(f"Found {count} occurrences of old domain")

    # Replace
    new_content = content.replace(old_domain, correct_domain)

    if content != new_content:
        with open(json_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✓ Successfully updated {count} URLs in products-r2-optimized.json")
    else:
        print("No changes needed - URLs might already be correct")
        
except Exception as e:
    print(f"Error: {e}")
