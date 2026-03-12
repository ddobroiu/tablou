import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from './email';
import { signAdminAction } from './adminAction';
import { appendOrder } from './orderStore';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

type AnyRecord = Record<string, unknown>;

interface CartItem {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  quantity?: number;
  unitAmount?: number;
  price?: number;
  totalAmount?: number;
  artworkUrl?: string;
  textDesign?: string;
  metadata?: AnyRecord;
  designOption?: string;
}

interface Address {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
  postCode?: string;
  bloc?: string;
  scara?: string;
  etaj?: string;
  ap?: string;
  interfon?: string;
}

interface Billing {
  tip_factura: 'persoana_fizica' | 'companie' | 'persoana_juridica';
  cui?: string;
  reg_com?: string;
  denumire_companie?: string;
  name?: string;
  email?: string;
  telefon?: string;
  phone?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
  postCode?: string;
  bloc?: string;
  scara?: string;
  etaj?: string;
  ap?: string;
  interfon?: string;
}

interface MarketingInfo {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landingPage?: string;
  userAgent?: string;
}

const SHIPPING_FEE = 19.99;
const FREE_SHIPPING_THRESHOLD = 500;

let oblioTokenCache: { token: string; expiresAt: number } | null = null;

async function getOblioAccessToken() {
  const now = Date.now();
  if (oblioTokenCache && oblioTokenCache.expiresAt > now) return oblioTokenCache.token;

  const params = new URLSearchParams({
    client_id: process.env.OBLIO_CLIENT_ID!,
    client_secret: process.env.OBLIO_CLIENT_SECRET!,
    grant_type: 'client_credentials',
  });

  const response = await fetch('https://www.oblio.eu/api/authorize/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Eroare obținere token Oblio: ${response.status}. Răspuns: ${err}`);
  }
  const data = (await response.json()) as { access_token?: string; expires_in?: string };
  if (!data.access_token) throw new Error('Token API Oblio invalid.');

  const expiresIn = parseInt(data.expires_in || '3600', 10);
  oblioTokenCache = { token: data.access_token, expiresAt: now + expiresIn * 1000 - 60000 };
  return data.access_token;
}

function formatRON(n: number) {
  return n.toFixed(2);
}

function escapeHtml(str: string) {
  return String(str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function apartmentLineText(src: { bloc?: string; scara?: string; etaj?: string; ap?: string; interfon?: string }): string {
  const parts: string[] = [];
  if (src.bloc) parts.push('Bloc ' + src.bloc);
  if (src.scara) parts.push('Sc. ' + src.scara);
  if (src.etaj) parts.push('Et. ' + src.etaj);
  if (src.ap) parts.push('Ap. ' + src.ap);
  if (src.interfon) parts.push('Interfon ' + src.interfon);
  return parts.join(', ');
}

function buildAddressLine(
  src: { judet?: string; localitate?: string; strada_nr?: string } | undefined,
  fallback: { judet: string; localitate: string; strada_nr: string }
) {
  const j = src?.judet || fallback.judet;
  const l = src?.localitate || fallback.localitate;
  const s = src?.strada_nr || fallback.strada_nr;
  return [s, l, j].filter(Boolean).join(', ');
}

async function createOblioInvoice(payload: unknown, token: string) {
  const endpoints = [
    'https://www.oblio.eu/api/invoices',
    'https://www.oblio.eu/api/invoice',
    'https://www.oblio.eu/api/1.0/invoices',
    'https://www.oblio.eu/api/docs/invoice',
  ];
  let lastErr: unknown = null;
  for (const url of endpoints) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const ct = resp.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const json = await resp.json();
        return { ...json, _endpoint: url };
      }
      const text = await resp.text();
      lastErr = new Error(`Oblio non-JSON (${resp.status}) @ ${url}: ${text.slice(0, 200)}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('Oblio: nu s-a putut emite factura (fără răspuns valid)');
}

function formatYesNo(v: unknown): string {
  if (typeof v === 'boolean') return v ? 'Da' : 'Nu';
  if (typeof v === 'string') {
    const t = v.toLowerCase();
    if (['true', 'da', 'yes', 'y', '1'].includes(t)) return 'Da';
    if (['false', 'nu', 'no', 'n', '0'].includes(t)) return 'Nu';
  }
  return String(v);
}

const labelForKey: Record<string, string> = {
  width: 'Lățime (cm)',
  height: 'Înălțime (cm)',
  width_cm: 'Lățime (cm)',
  height_cm: 'Înălțime (cm)',
  totalSqm: 'Suprafață totală (m²)',
  sqmPerUnit: 'm²/buc',
  pricePerSqm: 'Preț pe m² (RON)',
  materialId: 'Material',
  want_hem_and_grommets: 'Tiv și capse',
  want_wind_holes: 'Găuri pentru vânt',
  designOption: 'Grafică',
  want_adhesive: 'Adeziv',
  material: 'Material',
  laminated: 'Laminare',
  shape_diecut: 'Tăiere la contur',
  productType: 'Tip panou',
  thickness_mm: 'Grosime (mm)',
  sameGraphicFrontBack: 'Aceeași grafică față/spate',
  framed: 'Șasiu',
  sizeKey: 'Dimensiune preset',
  mode: 'Mod canvas',
  orderNotes: 'Observații',
};

function prettyValue(k: string, v: unknown): string {
  if (k === 'materialId') return v === 'frontlit_510' ? 'Frontlit 510g' : v === 'frontlit_440' ? 'Frontlit 440g' : String(v);
  if (k === 'productType') return v === 'alucobond' ? 'Alucobond' : v === 'polipropilena' ? 'Polipropilenă' : v === 'pvc-forex' ? 'PVC Forex' : String(v);
  if (k === 'designOption') return v === 'pro' ? 'Pro' : v === 'upload' ? 'Am fișier' : v === 'text_only' ? 'Text' : String(v);
  if (k === 'framed') return formatYesNo(v);
  if (typeof v === 'boolean') return formatYesNo(v);
  return String(v);
}

function buildDetailsHTML(item: any) {
  const details: string[] = [];
  const itemAny = item as any;
  const width = itemAny.width ?? itemAny.width_cm ?? itemAny.rawMetadata?.width_cm ?? itemAny.rawMetadata?.width;
  const height = itemAny.height ?? itemAny.height_cm ?? itemAny.rawMetadata?.height_cm ?? itemAny.rawMetadata?.height;
  if (width || height) {
    details.push(`<div><strong>Dimensiune:</strong> ${escapeHtml(String(width || '—'))} x ${escapeHtml(String(height || '—'))} cm</div>`);
  }
  const meta = (item.rawMetadata || item.metadata || {}) as any;
  const knownKeys = Object.keys(labelForKey).filter((k) => meta[k] !== undefined);
  knownKeys.forEach((k) => {
    const label = labelForKey[k];
    const val = prettyValue(k, meta[k]);
    details.push(`<div><strong>${escapeHtml(label)}:</strong> ${escapeHtml(val)}</div>`);
  });
  const itemsSqm = ['sqmPerUnit', 'totalSqm', 'pricePerSqm'];
  itemsSqm.forEach((k) => {
    if (!knownKeys.includes(k) && meta[k] !== undefined) {
      const label = labelForKey[k] || k;
      details.push(`<div><strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(meta[k]))}</div>`);
    }
  });
  const exclude = new Set(['price', 'totalAmount', 'qty', 'quantity', 'artwork', 'artworkUrl', 'artworkLink', 'text', 'textDesign', 'selectedReadable', 'selections', 'title', 'name']);
  const leftovers = Object.keys(meta).filter((k) => !knownKeys.includes(k) && !exclude.has(k));
  leftovers.forEach((k) => {
    const v = meta[k];
    details.push(`<div><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</div>`);
  });
  if (itemAny.artwork || itemAny.artworkUrl) {
    details.push(`<div><strong>Fișier:</strong> <a href="${escapeHtml(String(itemAny.artwork || itemAny.artworkUrl))}" target="_blank" rel="noopener noreferrer">link</a></div>`);
  }
  if (itemAny.textDesign) {
    details.push(`<div><strong>Text:</strong> <em>${escapeHtml(String(itemAny.textDesign))}</em></div>`);
  }
  if (details.length === 0) return '';
  return `<div style="margin-top:6px;padding:8px 10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;color:#334155;font-size:13px">${details.join('')}</div>`;
}

async function sendEmails(
  address: Address,
  billing: Billing,
  cart: CartItem[],
  invoiceLink: string | null,
  paymentType: 'Ramburs' | 'Card',
  marketing?: MarketingInfo,
  orderNo?: number,
  createdPassword?: string,
  orderId?: string
) {
  try {
    const normalized = cart.map((raw) => {
      const qty = Number(raw.quantity ?? 1) || 1;
      const unit = Number(raw.unitAmount ?? raw.price ?? (raw.metadata?.price ?? 0)) || 0;
      const total = Number(raw.totalAmount ?? (unit > 0 ? unit * qty : raw.metadata?.totalAmount ?? 0)) || 0;
      const artwork = raw.artworkUrl ?? raw.metadata?.artworkUrl ?? raw.metadata?.artworkLink ?? raw.metadata?.artwork ?? null;
      const textDesign = raw.textDesign ?? raw.metadata?.textDesign ?? raw.metadata?.text ?? null;
      const name = raw.name ?? raw.title ?? raw.metadata?.title ?? raw.slug ?? 'Produs';
      return { ...raw, name, qty, unit, total, artwork, textDesign, rawMetadata: raw.metadata ?? {} };
    });

    const subtotal = normalized.reduce((acc, it) => acc + (Number(it.total) || 0), 0);
    const shippingFeeForEmail = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const totalComanda = subtotal + shippingFeeForEmail;

    // --- BUILD CUSTOM CONTENT FOR CLIENT ---
    const clientItemsHtml = normalized.map((item) => {
      const escapedName = escapeHtml(String(item.name));
      const detailsBlock = buildDetailsHTML(item);
      return `
        <div style="padding:15px 0; border-bottom:1px solid #f1f5f9;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div style="flex: 1; padding-right: 15px;">
              <div style="font-weight:600; font-size: 16px; color: #0f172a;">${escapedName}</div>
              <div style="font-size:13px; color:#64748b; margin-top: 4px;">Cantitate: ${item.qty} buc. @ ${item.unit} RON/buc.</div>
            </div>
            <div style="font-weight: bold; color: #0f172a; font-size: 16px; white-space: nowrap;">
              ${Number(item.total).toFixed(2)} RON
            </div>
          </div>
          ${detailsBlock}
        </div>
      `;
    }).join('');

    let accountNotice = '';
    if (createdPassword) {
      accountNotice = `
        <div style="background:#eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 12px; margin: 20px 0;">
          <strong style="color: #1e40af;">Cont creat automat</strong>
          <p style="margin: 5px 0 0; font-size: 13px; color: #1e40af;">Parola ta este: <strong>${createdPassword}</strong><br/>Poți schimba parola oricând din setările contului.</p>
        </div>
      `;
    }

    const clientContent = `
      ${accountNotice}
      <h2 style="font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">Rezumat Comandă</h2>
      <div>${clientItemsHtml}</div>
      
      <div style="border-top: 1px dashed #cbd5e1; padding-top: 16px; margin-top: 16px;">
        <div style="display:flex; justify-content:space-between; margin-bottom: 8px; color: #64748b; font-size: 14px;">
          <span>Transport:</span> <span style="font-weight: 500;">${shippingFeeForEmail} RON</span>
        </div>
        <div style="display:flex; justify-content:space-between; color: #0f172a; font-size: 18px; font-weight: bold; margin-top: 8px;">
          <span>Total de Achitat:</span> <span>${totalComanda.toFixed(2)} RON</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top: 8px; color: #64748b; font-size: 14px;">
          <span>Metodă de plată:</span> <span style="font-weight: 500;">${paymentType}</span>
        </div>
      </div>

      <h2 style="font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-top: 30px;">Detalii Livrare</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.5; margin: 10px 0;">
        <strong>Client:</strong> ${escapeHtml(address.nume_prenume)}<br/>
        <strong>Adresă:</strong> ${escapeHtml(address.localitate)}, ${escapeHtml(address.judet)}, ${escapeHtml(address.strada_nr)}<br/>
        <strong>Telefon:</strong> ${escapeHtml(address.telefon)}
      </p>
    `;

    // --- BUILD CUSTOM CONTENT FOR ADMIN ---
    const isCompany = billing && (billing.tip_factura === 'persoana_juridica' || billing.tip_factura === 'companie');
    const contactName = isCompany ? (billing.denumire_companie || billing.name || billing.cui || address.nume_prenume) : (address.nume_prenume || billing.name || '');
    
    const adminContent = `
      <div style="background:#f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
        <h3 style="margin: 0 0 10px; font-size: 15px; color: #0f172a;">Detalii Client</h3>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Nume:</strong> ${escapeHtml(contactName)}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${address.email}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Telefon:</strong> ${address.telefon}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Plată:</strong> ${paymentType}</p>
      </div>
      <div>${clientItemsHtml}</div>
      <div style="background:#f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: right;">
        <p style="margin: 0; font-size: 14px; color: #64748b;">Transport: ${shippingFeeForEmail} RON</p>
        <h3 style="margin: 5px 0 0; color: #0f172a;">Total: ${totalComanda.toFixed(2)} RON</h3>
      </div>
    `;

    const orderMeta = {
      id: orderId || 'N/A',
      orderNo: orderNo,
      source: 'tablou.net',
      invoiceUrl: invoiceLink,
      shippingAddress: { ...address, street: address.strada_nr, name: address.nume_prenume }
    };

    await sendOrderConfirmationEmail(orderMeta, clientContent);
    await new Promise(r => setTimeout(r, 1000));
    await sendNewOrderAdminEmail(orderMeta, adminContent);

  } catch (e) {
    console.error('[OrderService] Tablou Unified email failed:', e);
  }
}

export async function fulfillOrder(
  orderData: { address: Address; billing: Billing; cart: CartItem[]; marketing?: MarketingInfo; createAccount?: boolean; subscribeNewsletter?: boolean; userId?: string | null },
  paymentType: 'Ramburs' | 'Card'
): Promise<{ invoiceLink: string | null; orderNo?: number; orderId?: string; createdPassword?: string }> {
  const { address, billing, cart, marketing } = orderData;

  if (!billing.email && address.email) {
    (billing as any).email = address.email;
  }

  let invoiceLink: string | null = null;
  const billingAddressLine = buildAddressLine(
    { judet: billing.judet, localitate: billing.localitate, strada_nr: billing.strada_nr },
    { judet: address.judet, localitate: address.localitate, strada_nr: address.strada_nr }
  );

  const products = (cart ?? []).map((item) => {
    const name = item.name || item.title || item.slug || 'Produs';
    const quantity = Number(item.quantity ?? 1) || 1;
    const unitAmount = Number(item.unitAmount ?? item.price ?? item.metadata?.price ?? 0) || 0;
    return { name, price: unitAmount, measuringUnitName: 'buc', vatName: 'S', quantity };
  });

  const billingTip = billing?.tip_factura;
  const shouldTryOblio = billingTip === 'persoana_fizica' || billingTip === 'persoana_juridica' || billingTip === 'companie';

  if (shouldTryOblio) {
    try {
      const token = await getOblioAccessToken();
      let clientName = billing.name || address.nume_prenume;
      if (billingTip === 'persoana_juridica' || billingTip === 'companie') {
        clientName = billing.denumire_companie || billing.name || billing.cui || address.nume_prenume;
      }
      const cuiRaw = billing.cui;
      const cuiNormalized = normalizeCUI(cuiRaw);
      let clientCif: string | undefined = cuiNormalized.primary || cuiNormalized.alternate;
      if (clientCif && !clientCif.toUpperCase().startsWith('RO')) clientCif = `RO${clientCif}`;
      const client: any = {
        name: clientName,
        address: billingAddressLine,
        email: billing.email || address.email,
        phone: billing.telefon || address.telefon,
      };
      if (clientCif) client.cif = clientCif;
      if (billing.reg_com) client.rc = billing.reg_com;
      const cartSubtotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      const shippingCost = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
      const productsWithShipping = [...products];
      if (shippingCost > 0) {
        productsWithShipping.push({
          name: 'Transport',
          price: shippingCost,
          measuringUnitName: 'buc',
          vatName: 'S',
          quantity: 1
        });
      }
      const basePayload: any = {
        cif: process.env.OBLIO_CIF_FIRMA,
        client,
        issueDate: new Date().toISOString().slice(0, 10),
        seriesName: process.env.OBLIO_SERIE_FACTURA,
        products: productsWithShipping,
      };
      const data = await createOblioInvoice(basePayload, token);
      const link = (data && (data.data?.link || data.link || data.data?.url || data.url)) as string | undefined;
      if (link) {
        invoiceLink = link;
      }
    } catch (e: any) {
      console.warn('[OrderService] Oblio a eșuat:', e?.message || e);
    }
  }

  let createdPassword: string | undefined;
  let finalUserId = orderData.userId || null;

  if (orderData.createAccount && !finalUserId) {
    try {
      const existing = await prisma.user.findUnique({
        where: {
          email_source: {
            email: address.email,
            source: "tablou.net"
          }
        }
      });
      if (existing) {
        finalUserId = existing.id;
      } else {
        const rawPass = generateRandomPassword();
        const hash = await bcrypt.hash(rawPass, 10);
        const newUser = await prisma.user.create({
          data: {
            email: address.email,
            source: "tablou.net",
            name: address.nume_prenume || undefined,
            passwordHash: hash,
            phone: address.telefon || undefined,
          },
        });
        createdPassword = rawPass;
        finalUserId = newUser.id;
      }
    } catch (e: any) {
      console.warn('[OrderService] Eroare la crearea contului:', e?.message || e);
    }
  }

  if (orderData.subscribeNewsletter) {
    try {
      const email = address.email;
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'checkout', configuratorId: 'order' })
      });
    } catch (e: any) { }
  }

  try {
    const normalized = (cart ?? []).map((raw) => {
      const qty = Number(raw.quantity ?? 1) || 1;
      const unit = Number((raw as any).unitAmount ?? (raw as any).price ?? (raw as any)?.metadata?.price ?? 0) || 0;
      const total = Number((raw as any).totalAmount ?? (unit > 0 ? unit * qty : (raw as any)?.metadata?.totalAmount ?? 0)) || 0;
      const name = String((raw as any).name ?? (raw as any).title ?? (raw as any).slug ?? (raw as any)?.metadata?.title ?? 'Produs');
      const artworkUrl = String(raw.artworkUrl ?? raw.metadata?.artworkUrl ?? '') || null;
      const textDesign = String(raw.textDesign ?? raw.metadata?.textDesign ?? '') || null;
      const designOption = String(raw.designOption ?? raw.metadata?.designOption ?? '') || null;
      return {
        name,
        qty,
        unit,
        total,
        artworkUrl,
        metadata: { ...(raw.metadata || {}), textDesign, designOption }
      };
    });
    const subtotal = normalized.reduce((s, it) => s + (Number(it.total) || 0), 0);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const totalComanda = subtotal + shippingFee;
    const saved = await appendOrder({
      paymentType,
      address,
      billing,
      items: normalized,
      shippingFee,
      total: totalComanda,
      invoiceLink,
      marketing,
      userId: finalUserId,
      source: 'tablou.net'
    });
    await sendEmails(address, billing, cart, invoiceLink, paymentType, marketing, saved.orderNo, createdPassword, saved.id);
    try {
      await prisma.abandonedCart.deleteMany({ where: { email: address.email } });
    } catch (err) { }
    return { invoiceLink, orderNo: saved.orderNo, orderId: saved.id, createdPassword };
  } catch (e: any) {
    console.warn('[OrderService] Salvare comandă a eșuat:', e?.message || e);
  }
  await sendEmails(address, billing, cart, invoiceLink, paymentType, marketing, undefined, createdPassword, undefined);
  return { invoiceLink, createdPassword };
}

function generateRandomPassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$%';
  let out = '';
  for (let i = 0; i < 12; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export { getOblioAccessToken, createOblioInvoice };