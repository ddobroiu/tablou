# Script pentru a modifica scrape-arthub-canvas.py
with open('scrape-arthub-canvas.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Găsește și elimină liniile 237-249 (verificarea butonului next)
new_lines = []
skip = False
for i, line in enumerate(lines, 1):
    if i == 237 and '# Verifică dacă există pagina următoare' in line:
        skip = True
        # Adaugă cod nou
        new_lines.append('            # Continuă automat cu pagina următoare\n')
        new_lines.append('            page += 1\n')
        new_lines.append('            \n')
        new_lines.append('            # Salvează progresul la fiecare 5 pagini\n')
        new_lines.append('            if page % 5 == 1 and page > 1:\n')
        new_lines.append('                print(f"\\n💾 Salvare intermediară... ({len(products)} produse)")\n')
        new_lines.append('                with open(JSON_OUTPUT, \'w\', encoding=\'utf-8\') as f:\n')
        new_lines.append('                    json.dump(products, f, ensure_ascii=False, indent=2)\n')
        new_lines.append('            \n')
        new_lines.append('            # Pauză între pagini\n')
        new_lines.append('            print(f"\\n⏳ Pauză {DELAY_BETWEEN_PAGES}s înainte de următoarea pagină...")\n')
        new_lines.append('            time.sleep(DELAY_BETWEEN_PAGES)\n')
        continue
    
    if skip and i <= 261:
        continue
    
    if i == 262:
        skip = False
    
    if not skip:
        new_lines.append(line)

# Salvează fișierul modificat
with open('scrape-arthub-canvas.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✅ Fișier modificat cu succes!")
