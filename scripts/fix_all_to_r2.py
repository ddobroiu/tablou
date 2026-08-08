import json

json_path = 'public/canvas/products-r2-optimized.json'
poze_domain = 'https://poze.prynt.ro'
r2_domain = 'https://pub-6b8f161e90f040688bbfecff19d5cac3.r2.dev'

print(f"Replacing ALL {poze_domain} URLs with {r2_domain}...")

try:
    with open(json_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Count before
    poze_count = content.count(poze_domain)
    print(f"Found {poze_count} URLs with poze.prynt.ro")

    # Replace ALL occurrences
    new_content = content.replace(poze_domain, r2_domain)

    # Count after
    r2_count = new_content.count(r2_domain)
    remaining_poze = new_content.count(poze_domain)

    # Save
    with open(json_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✓ Successfully replaced {poze_count} URLs")
    print(f"✓ Total R2 URLs now: {r2_count}")
    print(f"✓ Remaining poze.prynt.ro: {remaining_poze}")
        
except Exception as e:
    print(f"Error: {e}")
