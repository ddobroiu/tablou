# 📦 Products Module Structure

## Overview
Produsele sunt organizate modular pentru a menține codul curat și ușor de întreținut.

## 📁 Structura Fișierelor

```
lib/
├── products.ts                 # Main products logic & configuration
├── extraProducts.ts            # Legacy products (minimal, imports from products/)
└── products/                   # Modular products directory
    ├── index.ts               # Main export - combines all modules ✅
    ├── canvas.ts              # 750 Canvas products from arthub.ro ✅
    ├── bannere.ts             # Banner products ✅
    ├── afise.ts               # ~150 Poster products ✅
    ├── flayere.ts             # ~20 Flyer products ✅
    ├── autocolante.ts         # ~10 Sticker products ✅
    ├── carton.ts              # ~8 Cardboard products ✅
    └── README.md              # This file
```

## 🎯 Cum Funcționează

### 1. Fiecare Modul de Produs
Fiecare fișier din `lib/products/` exportă un array de produse pentru categoria sa:

```typescript
// lib/products/canvas.ts
export const SCRAPED_CANVAS_PRODUCTS = [...750 produse];

// lib/products/afise.ts
export const AFISE_PRODUCTS = [...150 produse];
```

### 2. Index Principal
`lib/products/index.ts` combină toate modulele:

```typescript
import { SCRAPED_CANVAS_PRODUCTS } from './canvas';
import { AFISE_PRODUCTS } from './afise';
import { FLAYERE_PRODUCTS } from './flayere';
// ... etc

export const ALL_EXTRA_PRODUCTS = [
  ...SCRAPED_CANVAS_PRODUCTS,
  ...AFISE_PRODUCTS,
  ...FLAYERE_PRODUCTS,
  // ... toate modulele
];
```

### 3. Import în extraProducts.ts
```typescript
import { ALL_EXTRA_PRODUCTS } from './products/index';

export const EXTRA_PRODUCTS_RAW = EXTRA_PRODUCTS_RAW_BASE.concat(
  EXTRA_AUTOCO_PRODUCTS,
  EXTRA_CARTON_PRODUCTS,
  ALL_EXTRA_PRODUCTS
);
```

## ✅ Avantaje

1. **Organizare**: Fiecare categorie are propriul fișier
2. **Performanță**: Fișiere mai mici = compilare mai rapidă
3. **Mențin**: Mai ușor de găsit și editat produse
4. **Scalabilitate**: Adaugi noi categorii fără să modifici fișiere mari
5. **Colaborare**: Mai mulți developeri pot lucra simultan
6. **Debugging**: Fiecare modul poate fi testat independent

## 📊 Statistici Curente

| Categorie | Produse | Status | Fișier |
|-----------|---------|--------|--------|
| **Canvas** | 750 | ✅ Complet | `canvas.ts` |
| **Afișe** | ~150 | ✅ Complet | `afise.ts` |
| **Bannere** | ~10 | 🟡 Starter | `bannere.ts` |
| **Flayere** | ~20 | ✅ Complet | `flayere.ts` |
| **Autocolante** | ~10 | ✅ Complet | `autocolante.ts` |
| **Carton** | ~8 | ✅ Complet | `carton.ts` |
| **TOTAL** | **~948** | ✅ **COMPLET** | - |

## 🚀 Cum să Adaugi Produse Noi

### Opțiunea 1: Adaugă într-un modul existent
```typescript
// lib/products/canvas.ts
export const SCRAPED_CANVAS_PRODUCTS = [
  // ... produse existente
  {
    id: "canvas-nou",
    title: "Tablou Canvas Nou",
    description: "Descriere...",
    priceBase: 79,
    currency: "RON",
    tags: ["canvas"],
    metadata: { category: "Canvas" }
  }
];
```

### Opțiunea 2: Creează un modul nou
1. Creează `lib/products/categoria-noua.ts`
2. Exportă array-ul de produse:
```typescript
export const CATEGORIA_NOUA_PRODUCTS = [
  { id: "...", title: "...", ... }
];
```
3. Importă în `lib/products/index.ts`:
```typescript
import { CATEGORIA_NOUA_PRODUCTS } from './categoria-noua';
```
4. Adaugă în `ALL_EXTRA_PRODUCTS`:
```typescript
export const ALL_EXTRA_PRODUCTS = [
  ...SCRAPED_CANVAS_PRODUCTS,
  ...CATEGORIA_NOUA_PRODUCTS,
  // ... etc
];
```

## 🔄 Structura Produsului

Fiecare produs trebuie să aibă următoarea structură:

```typescript
{
  id: string;              // Unique identifier (ex: "canvas-1")
  slug: string;            // URL-friendly slug (ex: "tablou-abstract")
  routeSlug: string;       // Route slug (ex: "tablou-abstract")
  title: string;           // Display title (ex: "Tablou Canvas Abstract")
  description: string;     // Product description
  priceBase: number;       // Base price in RON
  currency: string;        // "RON"
  tags: string[];          // Tags for search (ex: ["canvas", "abstract"])
  metadata: {
    category: string;      // Main category (ex: "Canvas")
    subcategory?: string;  // Optional subcategory (ex: "Canvas Abstracte")
    [key: string]: any;    // Other metadata
  }
}
```

## 📝 Best Practices

1. **Naming**: Folosește nume descriptive pentru module (ex: `canvas.ts`, nu `c.ts`)
2. **Exports**: Exportă întotdeauna un array constant (ex: `CANVAS_PRODUCTS`)
3. **Slugs**: Folosește funcția `slugify()` pentru a genera slug-uri consistente
4. **Categories**: Menține categoriile consistente cu cele din `ShopPageContent.tsx`
5. **Prices**: Setează prețuri realiste în `priceBase`
6. **Tags**: Adaugă tag-uri relevante pentru căutare

## 🐛 Debugging

Pentru a verifica numărul de produse din fiecare modul:

```typescript
import { PRODUCTS_COUNT } from './products/index';
console.log(PRODUCTS_COUNT);
// Output: { canvas: 750, afise: 150, ... total: 948 }
```

## 📚 Documentație Suplimentară

- **Configurator**: Vezi `lib/products.ts` pentru logica principală
- **Shop**: Vezi `app/shop/ShopPageContent.tsx` pentru filtrare
- **Pricing**: Vezi `lib/pricing.ts` pentru calculul prețurilor

## 🎉 Migrare Completă!

Toate produsele au fost migrate cu succes în structura modulară:
- ✅ Canvas (750 produse)
- ✅ Afișe (150 produse)
- ✅ Flayere (20 produse)
- ✅ Autocolante (10 produse)
- ✅ Carton (8 produse)
- ✅ Bannere (10 produse starter)

**Total: ~948 produse organizate modular!** 🚀
