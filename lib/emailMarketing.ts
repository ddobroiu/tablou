// lib/emailMarketing.ts
// Email Marketing System focused on 14 main configurators

import { Resend } from 'resend';
import { getHtmlTemplate } from './email';

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY is missing');
    return new Resend('re_123456789');
  }
  return new Resend(apiKey);
};

// 14 Main Configurators (Core Products)
export const MAIN_CONFIGURATORS = [
  {
    id: 'banner',
    title: 'Bannere Outdoor',
    description: 'Rezistente UV, tiv & capse incluse',
    url: '/banner',
    image: '/products/banner/1.webp',
    category: 'outdoor',
    startingPrice: 50,
    benefits: ['Rezistent la UV', 'Tiv inclus', 'Capse metalice', 'Livrare rapidă']
  },
  {
    id: 'banner-verso',
    title: 'Bannere Față-Verso',
    description: 'Vizibilitate maximă din ambele părți',
    url: '/banner-verso',
    image: '/products/banner/verso/1.webp',
    category: 'outdoor',
    startingPrice: 85,
    benefits: ['Print dublu', 'Material blockout', 'Impact vizual maxim', 'ROI superior']
  },
  {
    id: 'autocolante',
    title: 'Autocolante & Stickere',
    description: 'Print & Cut pe contur, orice formă',
    url: '/autocolante',
    image: '/products/autocolante/1.webp',
    category: 'indoor',
    startingPrice: 25,
    benefits: ['Decupaj pe contur', 'Vinyl premium', 'Adeziv puternic', 'Orice formă']
  },
  {
    id: 'afise',
    title: 'Afișe & Postere',
    description: 'A4, A3, A2, A1, A0 - toate formatele',
    url: '/afise',
    image: '/products/afise/1.webp',
    category: 'indoor',
    startingPrice: 3,
    benefits: ['Toate formatele', 'Hârtie premium', 'Rezoluție înaltă', 'Prețuri mici']
  },
  {
    id: 'canvas',
    title: 'Tablouri Canvas',
    description: 'Print pe pânză întinsă pe șasiu',
    url: '/canvas',
    image: '/products/canvas/1.webp',
    category: 'decor',
    startingPrice: 79,
    benefits: ['Pânză premium', 'Șasiu lemn', 'Gata de agățat', 'Cadou perfect']
  },
  {
    id: 'tapet',
    title: 'Tapet Personalizat',
    description: 'Fototapet la dimensiuni custom',
    url: '/tapet',
    image: '/products/tapet/1.webp',
    category: 'decor',
    startingPrice: 45,
    benefits: ['Orice dimensiune', 'Rezoluție 4K', 'Adeziv inclus', 'Instalare ușoară']
  },
  {
    id: 'flayere',
    title: 'Flyere Promoționale',
    description: 'A6, A5, DL - promovare stradală',
    url: '/flayere',
    image: '/products/flayere/1.webp',
    category: 'promo',
    startingPrice: 50,
    benefits: ['Hârtie 250g', 'Tiraje mari', 'Livrare rapidă', 'Cost per bucată mic']
  },
  {
    id: 'pliante',
    title: 'Pliante Marketing',
    description: 'Brosuri pliabile pentru prezentare',
    url: '/pliante',
    image: '/products/pliante/1.webp',
    category: 'promo',
    startingPrice: 120,
    benefits: ['Multiple pliuri', 'Hârtie lucioasă', 'Design profesional', 'Impact mare']
  },
  {
    id: 'pvc-forex',
    title: 'PVC Forex',
    description: 'Panouri rigide pentru interior/exterior',
    url: '/materiale/pvc-forex',
    image: '/products/materiale/pvc-forex/1.webp',
    category: 'rigide',
    startingPrice: 85,
    benefits: ['Rezistent UV', 'Ușor de montat', 'Suprafață netedă', 'Durabilitate mare']
  },
  {
    id: 'plexiglass',
    title: 'Plexiglass Premium',
    description: 'Transparență cristalină, aspect luxury',
    url: '/materiale/plexiglass',
    image: '/products/materiale/plexiglass/1.webp',
    category: 'rigide',
    startingPrice: 150,
    benefits: ['Transparență perfectă', 'Aspect premium', 'Rezistent șocuri', 'Finisaj luxury']
  },
  {
    id: 'alucobond',
    title: 'Alucobond Composite',
    description: 'Material premium pentru exterior',
    url: '/materiale/alucobond',
    image: '/products/materiale/alucobond/1.webp',
    category: 'rigide',
    startingPrice: 200,
    benefits: ['Durabilitate extremă', 'Aspect metalic', 'Rezistent intemperii', 'Profesional']
  },
  {
    id: 'carton',
    title: 'Carton Plast',
    description: 'Soluția economică pentru indoor',
    url: '/materiale/carton',
    image: '/products/materiale/carton/1.webp',
    category: 'rigide',
    startingPrice: 35,
    benefits: ['Economic', 'Ușor', 'Ideal evenimente', 'Livrare rapidă']
  },
  {
    id: 'polipropilena',
    title: 'Polipropilenă',
    description: 'Flexibilă și rezistentă',
    url: '/materiale/polipropilena',
    image: '/products/materiale/polipropilena/1.webp',
    category: 'rigide',
    startingPrice: 45,
    benefits: ['Flexibilă', 'Rezistentă apă', 'Ușor de curățat', 'Versatilă']
  },
  {
    id: 'fonduri-eu',
    title: 'Pachete Fonduri UE',
    description: 'Set complet pentru proiecte europene',
    url: '/fonduri-pnrr',
    image: '/products/fonduri/1.webp',
    category: 'pachete',
    startingPrice: 850,
    benefits: ['Pachet complet', 'Conforme cerințe UE', 'Consultanță inclusă', 'Aprobare garantată']
  }
] as const;

// Email Marketing Categories
export const EMAIL_CATEGORIES = {
  outdoor: {
    name: 'Publicitate Exterior',
    products: ['banner', 'banner-verso'],
    audience: 'Afaceri cu vizibilitate stradală'
  },
  indoor: {
    name: 'Materiale Interior',
    products: ['autocolante', 'afise'],
    audience: 'Magazine, birouri, evenimente indoor'
  },
  decor: {
    name: 'Decorațiuni & Cadouri',
    products: ['canvas', 'tapet'],
    audience: 'Persoane fizice, designeri, arhitecti'
  },
  promo: {
    name: 'Marketing Direct',
    products: ['flayere', 'pliante'],
    audience: 'Campanii promoționale, evenimente'
  },
  rigide: {
    name: 'Materiale Rigide',
    products: ['pvc-forex', 'plexiglass', 'alucobond', 'carton', 'polipropilena'],
    audience: 'Constructii, amenajari, signaletică'
  },
  pachete: {
    name: 'Soluții Complete',
    products: ['fonduri-eu'],
    audience: 'Organizații cu proiecte europene'
  }
} as const;

// Newsletter Signup with Interest Tracking
export interface NewsletterSubscription {
  email: string;
  name?: string;
  interests: string[]; // configurator IDs
  source: string; // 'footer' | 'popup' | 'checkout' | 'configurator'
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

// Email Templates for Configurators
export function generateConfiguratorEmailContent(configurator: typeof MAIN_CONFIGURATORS[number], type: 'welcome' | 'abandoned' | 'recommendation') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net";

  switch (type) {
    case 'welcome':
      return {
        subject: `Bine ai venit! Descoperă ${configurator.title}`,
        title: `Mulțumim pentru interesul în ${configurator.title}!`,
        message: `${configurator.description}. Începe să configurezi produsul perfect pentru nevoile tale cu prețuri de la ${configurator.startingPrice} RON.`,
        benefits: configurator.benefits,
        buttonText: "Configurează Acum",
        buttonUrl: `${baseUrl}${configurator.url}`,
        image: `${baseUrl}${configurator.image}`
      };

    case 'abandoned':
      return {
        subject: `Ai uitat ${configurator.title} în coș?`,
        title: `Produsele tale te așteaptă!`,
        message: `Ai început să configurezi ${configurator.title} dar nu ai finalizat comanda. Continuă de unde ai rămas și profită de prețurile noastre competitive.`,
        benefits: configurator.benefits,
        buttonText: "Continuă Comanda",
        buttonUrl: `${baseUrl}${configurator.url}?utm_source=email&utm_medium=abandoned&utm_campaign=recovery`,
        image: `${baseUrl}${configurator.image}`,
        incentive: 'Livrare GRATUITĂ pentru comenzi peste 100 RON'
      };

    case 'recommendation':
      return {
        subject: `Recomandare specială: ${configurator.title}`,
        title: `Produsul perfect pentru tine!`,
        message: `Pe baza preferințelor tale, ${configurator.title} ar putea fi exact ce cauți. ${configurator.description} cu beneficii exclusive.`,
        benefits: configurator.benefits,
        buttonText: "Vezi Detalii",
        buttonUrl: `${baseUrl}${configurator.url}?utm_source=email&utm_medium=recommendation`,
        image: `${baseUrl}${configurator.image}`
      };
  }
}

// Smart Recommendations based on behavior
export function getSmartRecommendations(userHistory: string[], currentInterest?: string): typeof MAIN_CONFIGURATORS[number][] {
  // Cross-sell logic
  const crossSellMap: Record<string, string[]> = {
    'banner': ['autocolante', 'afise', 'pvc-forex'],
    'banner-verso': ['banner', 'plexiglass', 'alucobond'],
    'autocolante': ['afise', 'banner', 'tapet'],
    'afise': ['flayere', 'pliante', 'autocolante'],
    'canvas': ['tapet', 'afise', 'plexiglass'],
    'tapet': ['canvas', 'autocolante', 'pvc-forex'],
    'pvc-forex': ['plexiglass', 'alucobond', 'banner'],
    'plexiglass': ['alucobond', 'pvc-forex', 'canvas']
  };

  const recommended = new Set<string>();

  // Add cross-sell recommendations
  if (currentInterest && crossSellMap[currentInterest]) {
    crossSellMap[currentInterest].forEach(id => recommended.add(id));
  }

  // Add category-based recommendations
  userHistory.forEach(productId => {
    if (crossSellMap[productId]) {
      crossSellMap[productId].forEach(id => recommended.add(id));
    }
  });

  // Remove already viewed products
  userHistory.forEach(id => recommended.delete(id));
  if (currentInterest) recommended.delete(currentInterest);

  // Return top 3 recommendations
  return Array.from(recommended)
    .slice(0, 3)
    .map(id => MAIN_CONFIGURATORS.find(c => c.id === id))
    .filter(Boolean) as typeof MAIN_CONFIGURATORS[number][];
}

// Newsletter Campaign Templates
export function generateNewsletterCampaign(theme: 'weekly' | 'promotional' | 'educational') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";

  switch (theme) {
    case 'weekly':
      return {
        subject: 'Săptămâna aceasta la Tablou.net: Noutăți și Oferte',
        title: 'Noutățile săptămânii',
        sections: [
          {
            title: 'Produs în Spotul Săptămânii',
            configurator: MAIN_CONFIGURATORS[Math.floor(Math.random() * MAIN_CONFIGURATORS.length)],
            discount: '10% REDUCERE'
          },
          {
            title: 'Configuratoare Populare',
            configurators: MAIN_CONFIGURATORS.slice(0, 3)
          }
        ]
      };

    case 'promotional':
      return {
        subject: '🔥 OFERTĂ SPECIALĂ: Până la 25% Reducere!',
        title: 'Oferte Limitate - Nu Rata Ocazia!',
        sections: [
          {
            title: 'Reduceri Masive',
            configurators: MAIN_CONFIGURATORS.filter(c => c.category === 'outdoor'),
            discount: '25% REDUCERE'
          }
        ]
      };

    case 'educational':
      return {
        subject: 'Ghid Complet: Cum Alegi Materialul Perfect',
        title: 'Învață să Alegi Optim',
        sections: [
          {
            title: 'Materiale pentru Exterior vs Interior',
            configurators: [
              MAIN_CONFIGURATORS.find(c => c.id === 'banner')!,
              MAIN_CONFIGURATORS.find(c => c.id === 'afise')!
            ]
          }
        ]
      };
  }
}

// Send Welcome Series Email
export async function sendConfiguratorWelcomeEmail(subscription: NewsletterSubscription) {
  if (!subscription.interests.length) return;

  const mainInterest = subscription.interests[0];
  const configurator = MAIN_CONFIGURATORS.find(c => c.id === mainInterest);

  if (!configurator) return;

  const content = generateConfiguratorEmailContent(configurator, 'welcome');

  // Create welcome discount code
  let discountCodeHtml = '';
  try {
    const { createEmailDiscountCode } = await import('@/lib/discountCodes');
    const discountCode = await createEmailDiscountCode('welcome');

    const daysLeft = Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    discountCodeHtml = `
    <div style="background:#0F172A;color:#F8FAFC;padding:22px;border-radius:14px;margin:24px 0;font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.25);">
      <div style="font-size:22px;font-weight:700;letter-spacing:.5px;display:flex;align-items:center;justify-content:center;gap:8px;">
        <span>🎁</span><span>Cadou de Bun Venit</span>
      </div>
      <div style="margin-top:10px;font-size:15px;line-height:1.5;">
        <strong style="color:#C7D2FE;">🚚 Livrare gratuită</strong> la <u>toată comanda</u> cu codul:<br/>
        <span style="display:inline-block;margin-top:8px;padding:10px 16px;background:#1E3A8A;border:1px solid #3B82F6;border-radius:10px;font-size:18px;font-weight:700;letter-spacing:1px;">${discountCode.code}</span>
      </div>
      <div style="margin-top:12px;font-size:12px;opacity:.85;line-height:1.4;">
        Prag minim: ${discountCode.minOrderValue} RON • Valabil ${daysLeft} ${daysLeft === 1 ? 'zi' : 'zile'} • Se aplică la toate produsele din coș. Nu se cumulează cu alte coduri.
      </div>
    </div>`;
  } catch (error) {
    console.error('[Email] Failed to create welcome discount:', error);
  }

  const html = getHtmlTemplate({
    title: content.title,
    message: content.message,
    buttonText: content.buttonText,
    buttonUrl: content.buttonUrl,
    footerText: "Mulțumim că te-ai alăturat comunității Tablou.net!"
  });

  // Add benefits list, image and discount code
  const enhancedHtml = html.replace(
    content.message,
    `${content.message}<br/><br/>
    ${discountCodeHtml}
    <img src="${content.image}" alt="${configurator.title}" style="max-width: 300px; border-radius: 8px; margin: 16px 0;"/>
    <h3 style="color: #333; margin-top: 20px;">De ce să alegi ${configurator.title}?</h3>
    <ul style="color: #666; line-height: 1.6;">
      ${content.benefits.map(benefit => `<li>✅ ${benefit}</li>`).join('')}
    </ul>`
  );

  await getResendClient().emails.send({
    from: 'Tablou.net Configuratoare <no-reply@tablou.net>',
    to: subscription.email,
    subject: content.subject,
    html: enhancedHtml,
  });
}

// Post-purchase Follow-up (1 week after order)
export async function sendPostPurchaseFollowUp(email: string, name: string, orderId: string, orderNo: number) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net";

  // Create a special offer discount code
  let discountCodeHtml = '';
  try {
    const { createEmailDiscountCode } = await import('@/lib/discountCodes');
    // Generating a 15% discount for returning customers
    const discountCode = await createEmailDiscountCode('post_purchase', 'all');

    discountCodeHtml = `
    <div style="background:#FDF2F8; border:2px dashed #DB2777; padding:24px; border-radius:16px; margin:24px 0; text-align:center; font-family:Arial,sans-serif;">
      <div style="color:#DB2777; font-size:18px; font-weight:700; margin-bottom:8px;">🎁 Surpriză! 15% Reducere la următoarea comandă</div>
      <div style="color:#9D174D; font-size:14px; margin-bottom:16px;">Îți mulțumim că ești clientul nostru. Am vrut să-ți facem ziua mai frumoasă cu un cadou special.</div>
      <div style="display:inline-block; background:#DB2777; color:white; padding:12px 24px; border-radius:12px; font-size:24px; font-weight:800; letter-spacing:2px;">${discountCode.code}</div>
      <div style="margin-top:12px; font-size:11px; color:#BE185D;">Prag minim: ${discountCode.minOrderValue} RON • Valabil 14 zile • Se aplică la orice produs.</div>
    </div>`;
  } catch (error) {
    console.error('[Email] Failed to create follow-up discount:', error);
  }

  const html = getHtmlTemplate({
    title: `Bună ${name}, cum ți s-au părut produsele Tablou.net?`,
    message: `A trecut o săptămână de la comanda ta #${orderNo} și sperăm că ești încântat de rezultat. Ne-am bucura să aflăm părerea ta!`,
    buttonText: "Vezi noutățile pe site",
    buttonUrl: `${baseUrl}/shop?utm_source=email&utm_medium=followup&utm_campaign=customer_love`,
    footerText: "Echipa Tablou.net vă mulțumește!"
  });

  const enhancedHtml = html.replace(
    `sperăm că ești încântat de rezultat. Ne-am bucura să aflăm părerea ta!`,
    `sperăm că ești încântat de rezultat. Ne-am bucura să aflăm părerea ta!<br/><br/>
    ${discountCodeHtml}
    <h3 style="color:#0F172A; text-align:center; margin-top:32px;">Alte idei care te-ar putea inspira:</h3>
    <div style="display:flex; gap:12px; justify-content:center; margin-top:16px; flex-wrap:wrap;">
      <a href="${baseUrl}/canvas" style="text-decoration:none; color:#475569; width:140px; text-align:center;">
        <img src="${baseUrl}/products/canvas/1.webp" style="width:100%; border-radius:8px; margin-bottom:6px;"/>
        <span style="font-size:12px; font-weight:600;">Tablouri Canvas</span>
      </a>
      <a href="${baseUrl}/tapet" style="text-decoration:none; color:#475569; width:140px; text-align:center;">
        <img src="${baseUrl}/products/tapet/1.webp" style="width:100%; border-radius:8px; margin-bottom:6px;"/>
        <span style="font-size:12px; font-weight:600;">Tapet Custom</span>
      </a>
      <a href="${baseUrl}/autocolante" style="text-decoration:none; color:#475569; width:140px; text-align:center;">
        <img src="${baseUrl}/products/autocolante/1.webp" style="width:100%; border-radius:8px; margin-bottom:6px;"/>
        <span style="font-size:12px; font-weight:600;">Autocolante</span>
      </a>
    </div>`
  );

  try {
    await getResendClient().emails.send({
      from: 'Tablou.net <no-reply@tablou.net>',
      to: email,
      subject: `🎁 Avem un cadou pentru tine (Comanda ta #${orderNo} la Tablou.net)`,
      html: enhancedHtml,
    });
    return true;
  } catch (error) {
    console.error('[Email] Follow-up send failed:', error);
    return false;
  }
}

export async function sendAbandonedCartEmail({ email, configuratorId, cartData, emailType, discountPercent = 0 }: {
  email: string;
  configuratorId: string;
  cartData: any;
  emailType: 'gentle' | 'discount' | 'final';
  discountPercent?: number;
}) {
  const configurator = MAIN_CONFIGURATORS.find(c => c.id === configuratorId);
  if (!configurator) return false;

  // Import discount codes function
  const { createEmailDiscountCode } = await import('@/lib/discountCodes');

  let incentiveText = '';
  let subject = '';
  let mainMessage = '';
  let discountCode = null;

  // Create discount code for this email
  try {
    switch (emailType) {
      case 'gentle':
        subject = `🎨 Te așteaptă ceva special la Tablou.net!`;
        mainMessage = `Am observat că ai lucrat la un proiect personalizat (${configurator.title}), dar nu ai apucat să îl finalizezi. Din experiența noastră, rezultatul final va arăta spectaculos pe peretele tău!`;
        discountCode = await createEmailDiscountCode('abandoned_gentle', configuratorId);
        {
          const daysLeft = Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          incentiveText = `
          <div style="background:#F0F9FF; border:1px solid #BAE6FD; padding:20px; border-radius:14px; margin:20px 0; font-family:Arial,sans-serif; text-align:center;">
            <div style="color:#0369A1; font-size:16px; font-weight:700; margin-bottom:10px;">🎁 Bonus: Livrare Gratuită</div>
            <div style="color:#075985; font-size:14px; margin-bottom:15px;">Finalizează comanda acum și noi ne ocupăm de costurile de transport.</div>
            <div style="display:inline-block; background:#0EA5E9; color:white; padding:8px 20px; border-radius:10px; font-weight:700; letter-spacing:1px;">${discountCode.code}</div>
            <div style="margin-top:8px; font-size:11px; color:#0369A1; opacity:.7;">Valabil ${daysLeft} ${daysLeft === 1 ? 'zi' : 'zile'} • O singură utilizare</div>
          </div>`;
        }
        break;

      case 'discount':
        subject = `🎁 O mică atenție: 10% reducere pentru ${configurator.title}`;
        mainMessage = `Știm că uneori e greu să te decizi. Pentru a-ți face alegerea mai ușoară, ți-am pregătit o reducere specială valabilă pentru tot coșul tău de cumpărături.`;
        discountCode = await createEmailDiscountCode('abandoned_discount', configuratorId);
        {
          const daysLeft = Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          incentiveText = `
          <div style="background:#F5F3FF; border:1px solid #DDD6FE; padding:22px; border-radius:14px; margin:22px 0; font-family:Arial,sans-serif; text-align:center;">
            <div style="color:#6D28D9; font-size:18px; font-weight:800; margin-bottom:10px;">✂️ 10% Reducere la Tot Coșul</div>
            <div style="color:#5B21B6; font-size:14px; margin-bottom:16px;">Folosește codul de mai jos în pagina de finalizare comandă.</div>
            <div style="display:inline-block; background:#7C3AED; color:white; padding:10px 24px; border-radius:10px; font-weight:800; letter-spacing:1px;">${discountCode.code}</div>
            <div style="margin-top:10px; font-size:11px; color:#6D28D9; opacity:.7;">Expiră în curând (${daysLeft} ${daysLeft === 1 ? 'zi' : 'zile'}) • Min. ${discountCode.minOrderValue} RON</div>
          </div>`;
        }
        break;

      case 'final':
        subject = `⏰ Ultima strigare! Rezervarea pentru ${configurator.title} expiră`;
        mainMessage = `Aceasta este ultima notificare înainte ca noi să eliberăm rezervarea pentru materialele tale. Am mărit reducerea la 15% pentru a ne asigura că nu ratezi ocazia de a avea un decor premium.`;
        discountCode = await createEmailDiscountCode('abandoned_final', configuratorId);
        {
          const hoursLeft = Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60));
          incentiveText = `
          <div style="background:#FFF1F2; border:1px solid #FECDD3; padding:24px; border-radius:16px; margin:24px 0; font-family:Arial,sans-serif; text-align:center;">
            <div style="color:#E11D48; font-size:20px; font-weight:900; margin-bottom:10px;">🔥 OFERTĂ FINALĂ: 15% REDUCERE</div>
            <div style="color:#BE123C; font-size:14px; margin-bottom:16px;">Codul tău exclusiv este activ pentru încă câteva ore:</div>
            <div style="display:inline-block; border:2px solid #E11D48; color:#E11D48; padding:10px 24px; border-radius:12px; font-size:22px; font-weight:900; letter-spacing:2px;">${discountCode.code}</div>
            <div style="margin-top:12px; font-size:11px; color:#E11D48; font-weight:600;">⚠️ EXPIRĂ ÎN ${hoursLeft} ${hoursLeft === 1 ? 'ORĂ' : 'ORE'}</div>
          </div>`;
        }
        break;
    }
  } catch (error) {
    console.error('[Email] Failed to create discount code:', error);
    // Fallback to generic incentives if discount creation fails
    incentiveText = `<div style="background: #EFF6FF; border: 1px solid #3B82F6; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
      <strong style="color: #1D4ED8;">💬 Ai întrebări?</strong><br/>
      <span style="color: #1E40AF;">Răspundem în maxim 30 minute la contact@tablou.net</span>
    </div>`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net";
  const buttonUrl = `${baseUrl}${configurator.url}?utm_source=email&utm_medium=abandoned&utm_campaign=${emailType}`;

  const html = getHtmlTemplate({
    title: subject.replace(/🎨|🎁|⏰/, '').trim(),
    message: mainMessage,
    buttonText: emailType === 'final' ? "Finalizează ACUM" : "Continuă Comanda",
    buttonUrl: buttonUrl,
    footerText: "Echipa Tablou.net"
  });

  const enhancedHtml = html.replace(
    '<div style="text-align: center; margin: 30px 0;">',
    `${incentiveText}<div style="text-align: center; margin: 30px 0;">`
  );

  try {
    await getResendClient().emails.send({
      from: 'Tablou.net <noreply@tablou.net>',
      to: email,
      subject: subject,
      html: enhancedHtml,
    });
    return true;
  } catch (error) {
    console.error('[Email] Abandoned cart send failed:', error);
    return false;
  }
}

export default {
  MAIN_CONFIGURATORS,
  EMAIL_CATEGORIES,
  generateConfiguratorEmailContent,
  getSmartRecommendations,
  sendConfiguratorWelcomeEmail,
  sendAbandonedCartEmail
};