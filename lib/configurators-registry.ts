// lib/configurators-registry.ts
// Central registry for all configurators with detailed metadata

export type ConfiguratorMetadata = {
  id: string;
  name: string;
  slug: string;
  url: string;
  category: string;
  description: string;
  keywords: string[];
  useCases: string[];
  dimensions: {
    type: 'fixed' | 'custom' | 'preset';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    presets?: Array<{ width: number; height: number; label: string }>;
  };
  materials: Array<{
    id: string;
    name: string;
    description: string;
    priceModifier?: number;
    recommended?: boolean;
  }>;
  pricing: {
    type: 'per_sqm' | 'per_unit' | 'per_perimeter' | 'fixed';
    basePricePerSqm?: number;
    bands?: Array<{ max: number; price: number }>;
    formula?: string; // Human-readable formula explanation
  };
  options: Array<{
    id: string;
    name: string;
    type: 'select' | 'radio' | 'checkbox';
    values?: string[];
    priceImpact?: string;
  }>;
  turnaroundTime: string; // e.g., "2-4 zile lucrătoare"
  shippingNotes?: string;
  technicalSpecs?: string[];
  faq?: Array<{ q: string; a: string }>;
};

export const CONFIGURATORS_REGISTRY: ConfiguratorMetadata[] = [
  {
    id: 'afise',
    name: 'Afișe Hârtie',
    slug: 'afise',
    url: '/afise',
    category: 'indoor',
    description: 'Afișe tipărite pe hârtie de calitate (Blueback, Whiteback, Satin, Foto) în formate standard sau personalizate. Ideale pentru interior.',
    keywords: ['afise', 'poster', 'hartie', 'a3', 'a2', 'a1', 'a0', 'indoor', 'print', 'blueback', 'whiteback'],
    useCases: [
      'Afișe promoționale magazine',
      'Postere evenimente',
      'Afișe decorative',
      'Materiale info puncte vânzare',
      'Campanii publicitare indoor'
    ],
    dimensions: {
      type: 'preset',
      presets: [
        { width: 29.7, height: 42, label: 'A3' },
        { width: 42, height: 59.4, label: 'A2' },
        { width: 59.4, height: 84.1, label: 'A1' },
        { width: 84.1, height: 118.9, label: 'A0' },
        { width: 70, height: 100, label: 'S5' },
        { width: 100, height: 140, label: 'S7' }
      ]
    },
    materials: [
      {
        id: 'blueback_115',
        name: 'Blueback 115g',
        description: 'Hârtie opacă cu spate albastru, anti-transparență',
        recommended: true
      },
      {
        id: 'whiteback_150_material',
        name: 'Whiteback 150g',
        description: 'Hârtie albă pe ambele părți, greutate medie'
      },
      {
        id: 'satin_170',
        name: 'Satin 170g',
        description: 'Hârtie satinată elegantă, finisaj semi-mat'
      },
      {
        id: 'foto_220',
        name: 'Foto 220g',
        description: 'Hârtie foto premium, culori vibrante'
      },
      {
        id: 'paper_150_lucioasa',
        name: 'Hârtie 150g Lucioasă',
        description: 'Ideală pentru tiraje mari'
      }
    ],
    pricing: {
      type: 'per_unit',
      formula: 'Preț per bucată, scade cu cantitatea. Variază după format și material.',
      bands: [
        { max: 50, price: 7.5 },
        { max: 100, price: 5.0 },
        { max: 200, price: 4.0 },
        { max: 500, price: 3.0 },
        { max: Infinity, price: 2.5 }
      ]
    },
    options: [],
    turnaroundTime: '1-3 zile lucrătoare',
    shippingNotes: 'Livrat în tub pentru protecție (formate mari)',
    technicalSpecs: [
      'Rezoluție: 1440 DPI',
      'Fișiere: PDF, AI, JPG (min 300 DPI pentru A3-A2, 150 DPI pentru A1-A0)'
    ]
  },
  {
    id: 'canvas',
    name: 'Canvas pe Pânză (Tablouri)',
    slug: 'canvas',
    url: '/canvas',
    category: 'decor',
    description: 'Tablouri canvas printate pe pânză textilă, întinse pe șasiu de lemn. Cu sau fără ramă, margine oglindită automată.',
    keywords: ['canvas', 'tablou', 'panza', 'decoratiune', 'personalizat', 'fotografie', 'art', 'rama'],
    useCases: [
      'Tablouri decorative casă',
      'Canvas cu fotografii personale',
      'Artă reproducere',
      'Decorațiuni birouri',
      'Cadouri personalizate'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 20,
      maxWidth: 300,
      minHeight: 20,
      maxHeight: 200
    },
    materials: [
      {
        id: 'canvas-polyester',
        name: 'Pânză Polyester 360g',
        description: 'Pânză textilă de calitate, print foto rezistent',
        recommended: true
      }
    ],
    pricing: {
      type: 'per_sqm',
      formula: 'Preț per mp + cost șasiu lemn (20 RON/ml perimetru). Reducere 20% aplicată automat.',
      bands: [
        { max: 1, price: 180 },
        { max: 3, price: 160 },
        { max: 5, price: 140 },
        { max: Infinity, price: 120 }
      ]
    },
    options: [
      {
        id: 'frame',
        name: 'Tip ramă',
        type: 'radio',
        values: ['Fără ramă (doar șasiu)', 'Cu ramă lemn natural', 'Cu ramă albă', 'Cu ramă neagră'],
        priceImpact: 'Rama adaugă 40-80 RON în funcție de dimensiune'
      },
      {
        id: 'design',
        name: 'Design',
        type: 'radio',
        values: ['Am fotografie', 'Design Pro colaj/editare (+40 RON)']
      }
    ],
    turnaroundTime: '3-5 zile lucrătoare',
    shippingNotes: 'Livrat cu protecție specială, pregătit pentru montaj imediat',
    technicalSpecs: [
      'Margine oglindită AUTOMATĂ (imaginea continuă pe laterale)',
      'Șasiu lemn inclus (înălțime 2cm)',
      'Fișiere recomandate: JPG/PNG min 150 DPI la dimensiunea finală'
    ],
    faq: [
      { q: 'Ce înseamnă margine oglindită?', a: 'Imaginea se extinde automat pe lateralele șasiului (2cm), creând un efect 3D fără chenare albe.' },
      { q: 'Pot comanda mai multe canvas formând un set?', a: 'Da, specifică în observații că vrei set triptic/poliptic și vom alinia imaginile.' }
    ]
  },
  {
    id: 'plexiglass',
    name: 'Sticlă Acrilică (Plexiglas)',
    slug: 'sticla-acrilica',
    url: '/sticla-acrilica',
    category: 'rigid',
    description: 'Sticlă acrilică transparentă sau opacă, grosimi 2-10mm. Print UV direct sau aplicare vinyl. Dimensiuni max 400×200cm.',
    keywords: ['plexiglas', 'plexiglass', 'metacrilat', 'transparent', 'sticla', 'acrilic', 'premium'],
    useCases: [
      'Plăci firmă luminoasă',
      'Totem interior premium',
      'Display produse',
      'Separatoare elegante',
      'Panouri decorative'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 10,
      maxWidth: 400,
      minHeight: 10,
      maxHeight: 200
    },
    materials: [
      {
        id: 'plexi-transparent',
        name: 'Transparent (față)',
        description: 'Transparent, print UV pe față (vizibil prin material)',
        recommended: true
      },
      {
        id: 'plexi-alb',
        name: 'Alb opac',
        description: 'Opac alb, ideal pentru iluminare din spate',
        priceModifier: -0.2
      }
    ],
    pricing: {
      type: 'per_sqm',
      formula: 'Preț variază după grosime. Transparent mai scump decât alb.',
      bands: [
        { max: 1, price: 280 },
        { max: 5, price: 250 },
        { max: Infinity, price: 220 }
      ]
    },
    options: [
      {
        id: 'thickness',
        name: 'Grosime',
        type: 'select',
        values: ['2mm', '3mm', '4mm', '5mm', '6mm', '8mm', '10mm'],
        priceImpact: '2mm: bază | 10mm: +400% (vezi tabel prețuri)'
      },
      {
        id: 'print',
        name: 'Print',
        type: 'radio',
        values: ['Print UV direct', 'Aplicare vinyl'],
        priceImpact: 'UV direct mai durabil, vinyl mai economic'
      }
    ],
    turnaroundTime: '5-7 zile lucrătoare',
    shippingNotes: 'Livrat cu folie protecție, fragil - manipulare atentă'
  }
];

// Helper function to find configurator by various criteria
export function findConfigurator(criteria: {
  id?: string;
  slug?: string;
  keyword?: string;
  category?: string;
}): ConfiguratorMetadata | undefined {
  return CONFIGURATORS_REGISTRY.find(c => {
    if (criteria.id && c.id === criteria.id) return true;
    if (criteria.slug && c.slug === criteria.slug) return true;
    if (criteria.keyword && c.keywords.some(k => k.includes(criteria.keyword!.toLowerCase()))) return true;
    if (criteria.category && c.category === criteria.category) return true;
    return false;
  });
}

// Get all configurators by category
export function getConfiguratorsByCategory(category: string): ConfiguratorMetadata[] {
  return CONFIGURATORS_REGISTRY.filter(c => c.category === category);
}

// Generate comprehensive text description for embeddings
export function generateConfiguratorDescription(config: ConfiguratorMetadata): string {
  let desc = `# ${config.name}\n\n`;
  desc += `**Categoria**: ${config.category}\n`;
  desc += `**URL**: ${config.url}\n\n`;
  desc += `## Descriere\n${config.description}\n\n`;

  desc += `## Cazuri de utilizare\n`;
  config.useCases.forEach(uc => desc += `- ${uc}\n`);
  desc += `\n`;

  desc += `## Cuvinte cheie\n${config.keywords.join(', ')}\n\n`;

  desc += `## Dimensiuni\n`;
  if (config.dimensions.type === 'custom') {
    desc += `Dimensiuni personalizate: ${config.dimensions.minWidth}-${config.dimensions.maxWidth}cm × ${config.dimensions.minHeight}-${config.dimensions.maxHeight}cm\n`;
  } else if (config.dimensions.type === 'preset') {
    desc += `Dimensiuni prestabilite:\n`;
    config.dimensions.presets?.forEach(p => desc += `- ${p.label}: ${p.width}×${p.height}cm\n`);
  }
  desc += `\n`;

  desc += `## Materiale disponibile\n`;
  config.materials.forEach(m => {
    desc += `- **${m.name}**: ${m.description}`;
    if (m.recommended) desc += ` ✓ RECOMANDAT`;
    if (m.priceModifier) desc += ` (${m.priceModifier > 0 ? '+' : ''}${(m.priceModifier * 100).toFixed(0)}%)`;
    desc += `\n`;
  });
  desc += `\n`;

  desc += `## Pricing\n`;
  desc += `Tip: ${config.pricing.type}\n`;
  if (config.pricing.formula) desc += `Formula: ${config.pricing.formula}\n`;
  if (config.pricing.bands) {
    desc += `Benzi de preț:\n`;
    let prevMax = 0;
    config.pricing.bands.forEach(band => {
      const range = band.max === Infinity ? `> ${prevMax}` : `${prevMax}-${band.max}`;
      desc += `- ${range}: ${band.price} RON\n`;
      prevMax = band.max;
    });
  }
  desc += `\n`;

  if (config.options.length > 0) {
    desc += `## Opțiuni configurare\n`;
    config.options.forEach(opt => {
      desc += `**${opt.name}** (${opt.type}):\n`;
      if (opt.values) desc += `Valori: ${opt.values.join(', ')}\n`;
      if (opt.priceImpact) desc += `Impact preț: ${opt.priceImpact}\n`;
    });
    desc += `\n`;
  }

  desc += `## Timp producție\n${config.turnaroundTime}\n\n`;

  if (config.shippingNotes) {
    desc += `## Livrare\n${config.shippingNotes}\n\n`;
  }

  if (config.technicalSpecs && config.technicalSpecs.length > 0) {
    desc += `## Specificații tehnice\n`;
    config.technicalSpecs.forEach(spec => desc += `- ${spec}\n`);
    desc += `\n`;
  }

  if (config.faq && config.faq.length > 0) {
    desc += `## Întrebări frecvente\n`;
    config.faq.forEach(faq => desc += `**Î**: ${faq.q}\n**R**: ${faq.a}\n\n`);
  }

  return desc;
}
