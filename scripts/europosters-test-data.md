# Test Data Structure - 10 Europosters Products

## Produse Test (Categorii Diverse)

### 1. New York Skyline (Orașe / New York)
- **Titlu Original**: New York Skyline
- **Titlu RO**: Tablou New York Skyline
- **Descriere**: Descoperă frumusețea New York-ului cu acest poster modern. Skyline-ul iconic al orașului care nu doarme, perfect pentru decorarea livingului sau biroului.
- **Categorie**: orase
- **Subcategorie**: new-york
- **Tags**: orase, new-york, modern, skyline, urban

**Variante**:
- Afiș: `/afise/afis-new-york-skyline` (29 RON)
- Canvas: `/canvas/canvas-new-york-skyline` (79 RON)
- Tapet: `/tapet/tapet-new-york-skyline` (149 RON)
- Autocolant: `/autocolante/autocolant-new-york-skyline` (39 RON)

---

### 2. Eiffel Tower Sunset (Orașe / Paris)
- **Titlu Original**: Eiffel Tower Sunset
- **Titlu RO**: Tablou Turnul Eiffel La Apus
- **Descriere**: Capturează romantismul Parisului cu acest poster al Turnului Eiffel la apus. Culorile calde și atmosfera magică a capitalei franceze.
- **Categorie**: orase
- **Subcategorie**: paris
- **Tags**: orase, paris, turnul-eiffel, apus, romantic

---

### 3. Abstract Geometric Blue (Abstracte / Modern)
- **Titlu Original**: Abstract Geometric Blue
- **Titlu RO**: Tablou Abstract Geometric Albastru
- **Descriere**: Design modern cu forme geometrice în nuanțe de albastru. Perfect pentru spații contemporane și minimaliste.
- **Categorie**: abstracte
- **Subcategorie**: modern
- **Tags**: abstracte, modern, geometric, albastru, minimalist

---

### 4. Mountain Landscape (Natură / Peisaje)
- **Titlu Original**: Mountain Landscape
- **Titlu RO**: Tablou Peisaj Montan
- **Descriere**: Peisaj montan spectaculos cu vârfuri înzăpezite. Aduceți natura în casa dumneavoastră cu acest poster relaxant.
- **Categorie**: natura
- **Subcategorie**: peisaje
- **Tags**: natura, peisaje, munti, zapada, relaxant

---

### 5. Tiger Portrait (Animale / Sălbatice)
- **Titlu Original**: Tiger Portrait
- **Titlu RO**: Tablou Portret Tigru
- **Descriere**: Portret impresionant al unui tigru maiestuos. Putere și eleganță într-o singură imagine captivantă.
- **Categorie**: animale
- **Subcategorie**: salbatice
- **Tags**: animale, tigru, salbatic, portret, putere

---

### 6. Cherry Blossom (Natură / Flori)
- **Titlu Original**: Cherry Blossom
- **Titlu RO**: Tablou Flori De Cireș
- **Descriere**: Delicatețea florilor de cireș în toată splendoarea lor. Inspirație din grădinile japoneze pentru un decor zen.
- **Categorie**: natura
- **Subcategorie**: flori
- **Tags**: natura, flori, cirese, japonez, zen

---

### 7. Marvel Avengers (Filme / Marvel)
- **Titlu Original**: Marvel Avengers
- **Titlu RO**: Tablou Marvel Avengers
- **Descriere**: Eroii Marvel reuniți într-un poster epic. Perfect pentru fanii universului Marvel și colecționari.
- **Categorie**: filme
- **Subcategorie**: marvel
- **Tags**: filme, marvel, avengers, eroi, actiune

---

### 8. Star Wars Poster (Filme / Star Wars)
- **Titlu Original**: Star Wars Poster
- **Titlu RO**: Tablou Star Wars
- **Descriere**: Iconicul univers Star Wars într-un design vintage. Pentru adevărații fani ai galaxiei îndepărtate.
- **Categorie**: filme
- **Subcategorie**: star-wars
- **Tags**: filme, star-wars, vintage, sci-fi, clasic

---

### 9. Tropical Beach (Natură / Plaje)
- **Titlu Original**: Tropical Beach
- **Titlu RO**: Tablou Plajă Tropicală
- **Descriere**: Evadați pe o plajă tropicală cu nisip alb și ape turcoaz. Relaxare și vacanță în fiecare zi.
- **Categorie**: natura
- **Subcategorie**: plaje
- **Tags**: natura, plaja, tropical, vacanta, relaxare

---

### 10. Modern Art Lines (Abstracte / Linii)
- **Titlu Original**: Modern Art Lines
- **Titlu RO**: Tablou Artă Modernă Cu Linii
- **Descriere**: Linii elegante și forme fluide într-un design contemporan. Sofisticare și stil pentru interioare moderne.
- **Categorie**: abstracte
- **Subcategorie**: linii
- **Tags**: abstracte, modern, linii, elegant, contemporan

---

## Structura JSON Output

Fiecare produs va genera 4 intrări în JSON (câte una pentru fiecare variantă):

```json
{
  "id": "poster-1-afis",
  "base_id": "poster-1",
  "variant_type": "afis",
  "title": "Afiș New York Skyline",
  "original_name": "New York Skyline",
  "description": "Descoperă frumusețea New York-ului cu acest afiș pe hârtie premium...",
  "image": "https://pub-6b8f161e90f040688bbfecff19d5cac3.r2.dev/posters/new-york-skyline.jpg",
  "category": "orase",
  "subcategory": "new-york",
  "price": 29,
  "currency": "RON",
  "slug": "afis-new-york-skyline",
  "route": "/afise/afis-new-york-skyline",
  "configurator": "/afise",
  "tags": ["orase", "new-york", "modern", "skyline", "afis"],
  "metadata": {
    "seo_title": "Afiș New York Skyline - Hârtie Premium | Prynt.ro",
    "seo_description": "Afiș New York Skyline pe hârtie premium. Disponibil și ca canvas, tapet, autocolant. Livrare rapidă.",
    "alt_text": "Afiș New York Skyline",
    "original_url": "https://www.europosters.ro/...",
    "source_image": "https://www.europosters.ro/..."
  },
  "related_variants": [
    {"type": "canvas", "slug": "canvas-new-york-skyline"},
    {"type": "tapet", "slug": "tapet-new-york-skyline"},
    {"type": "autocolant", "slug": "autocolant-new-york-skyline"}
  ]
}
```

---

## Total Output

**10 imagini** × **4 variante** = **40 produse** în JSON

Fiecare cu:
- SEO optimizat
- Traducere în română
- Link către configurator
- Cross-linking între variante
