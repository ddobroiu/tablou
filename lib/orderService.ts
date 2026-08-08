
import { Address, Billing, StoredOrderItem, StoredOrder, MarketingInfo, appendOrder } from './orderStore';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from './email';
import { getEstimatedShippingCost } from './shippingUtils';


// Constante locale pentru a evita erori de import
const FREE_SHIPPING_THRESHOLD = 500;

export type CartItem = {
  id?: string;
  productId?: string;
  slug?: string;
  title?: string;
  name?: string;
  quantity: number;
  price: number;
  unitAmount?: number;
  totalAmount?: number;
  image?: string;
  metadata?: any;
  artworkUrl?: string;
  unit?: number;
};

// --- UTILS ---

function escapeHtml(text: string): string {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildAddressLine(billing: any, shipping: any): string {
  const b = billing || {};
  const s = shipping || {};
  const j = b.judet || s.judet || '';
  const l = b.localitate || s.localitate || '';
  const st = b.strada_nr || s.strada_nr || '';
  return [j, l, st].filter(Boolean).join(', ');
}

function normalizeCUI(input: unknown): { primary?: string; alternate?: string } {
  if (!input) return {};
  let raw = String(input).trim().toUpperCase();
  raw = raw.replace(/\s|-/g, '');
  const digits = raw.replace(/\D/g, '');
  const hasRO = /^RO\d+$/i.test(raw);
  const primary = hasRO ? raw : digits;
  const alternate = hasRO ? digits : (digits ? `RO${digits}` : undefined);
  return { primary, alternate };
}

async function buildDetailsHTML(item: any) {
  const details: string[] = [];
  const meta = item.metadata || {};
  
  // Example Shopprint metadata keys
  const labelMap: Record<string, string> = {
    paper_type: 'Tip hârtie',
    corners: 'Colțuri',
    lamination: 'Laminare',
    sides: 'Fețe',
    design_option: 'Grafică',
    artwork_url: 'Fișier',
    text_design: 'Text Design',
    logo_url: 'Logo'
  };

  Object.entries(meta).forEach(([k, v]) => {
    if (v && labelMap[k]) {
      details.push(`<div><strong>${labelMap[k]}:</strong> ${String(v)}</div>`);
    } else if (v && !['price', 'total', 'qty', 'title', 'name'].includes(k)) {
      // Show other metadata if present but not mapped
      // details.push(`<div><strong>${k}:</strong> ${String(v)}</div>`);
    }
  });

  if (details.length === 0) return '';
  return `<div style="margin-top:4px; padding:6px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:12px; color:#475569;">${details.join('')}</div>`;
}

async function sendEmails(
  address: Address,
  billing: Billing,
  cart: any[] = [],
  invoiceLink: string | null,
  paymentType: 'Ramburs' | 'Card',
  marketing?: MarketingInfo,
  orderNo?: number,
  createdPassword?: string,
  orderId?: string,
  source?: string
) {
  try {
    const subtotal = (cart || []).reduce((acc, it) => acc + (Number(it.totalAmount || it.total || (it.price * it.quantity) || 0)), 0);
    const fee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : getEstimatedShippingCost(address.country || 'RO', cart);
    const totalAmount = subtotal + fee;

    // --- BUILD CUSTOM CONTENT ---
    const itemsHtml = await Promise.all((cart || []).map(async (it) => {
      const name = escapeHtml(it.name || it.title || 'Produs');
      const qty = it.quantity || it.qty || 1;
      const unit = it.price || it.unit || 0;
      const total = it.totalAmount || it.total || (unit * qty) || 0;
      const artwork = it.artworkUrl || it.artwork || it.metadata?.artworkUrl || it.metadata?.artwork_url || it.metadata?.artwork || null;
      const details = await buildDetailsHTML(it);
      
      return `
        <div style="padding:12px 0; border-bottom:1px solid #f1f5f9;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1; padding-right: 15px;">
              <div style="font-weight:600; font-size: 15px; color: #1e293b;">${name}</div>
              <div style="font-size:13px; color:#64748b; margin-top: 4px;">Cantitate: ${qty} buc. @ ${unit} RON/buc.</div>
              ${artwork ? `<div style="font-size:12px; margin-top:6px;"><a href="${String(artwork)}" target="_blank" style="color:#4f46e5; font-weight:700; text-decoration:none;">Descarcă fișier print</a></div>` : ``}
            </div>
            <div style="font-weight: bold; color: #0f172a; font-size: 15px; white-space: nowrap;">
              ${Number(total).toFixed(2)} RON
            </div>
          </div>
          ${details}
        </div>
      `;
    }));

    const content = `
      <h2 style="font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">Detalii Comandă</h2>
      <div>${itemsHtml.join('')}</div>
      
      <div style="border-top: 1px dashed #cbd5e1; padding-top: 16px; margin-top: 16px;">
        <div style="display:flex; justify-content:space-between; margin-bottom: 8px; color: #64748b; font-size: 14px;">
          <span>Transport:</span> <span style="font-weight: 500;">${fee.toFixed(2)} RON</span>
        </div>
        <div style="display:flex; justify-content:space-between; color: #0f172a; font-size: 18px; font-weight: bold; margin-top: 8px;">
          <span>Total de Achitat:</span> <span>${totalAmount.toFixed(2)} RON</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top: 8px; color: #64748b; font-size: 14px;">
          <span>Metodă de plată:</span> <span style="font-weight: 500;">${paymentType}</span>
        </div>
      </div>

      <h2 style="font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-top: 30px;">Detalii Livrare</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.5; margin: 10px 0;">
        <strong>Client:</strong> ${address.nume_prenume}<br/>
        <strong>Adresă:</strong> ${address.localitate}, ${address.judet}, ${address.strada_nr}<br/>
        <strong>Telefon:</strong> ${address.telefon}
      </p>
    `;

    const orderMeta = {
      id: orderId || 'N/A',
      orderNo: orderNo,
      source: source || 'Tablou.net',
      invoiceUrl: invoiceLink,
      shippingAddress: { ...address, street: address.strada_nr, name: address.nume_prenume }
    };

    await sendOrderConfirmationEmail(orderMeta, content);
    await new Promise(r => setTimeout(r, 1000));
    await sendNewOrderAdminEmail(orderMeta, content);
  } catch (e) {
    console.error('[OrderService] Unified email failed:', e);
  }
}

export async function fulfillOrder(
  orderData: {
    address: Address;
    billing: Billing;
    cart?: any[];
    items?: any[];
    marketing?: MarketingInfo;
    createAccount?: boolean;
    subscribeNewsletter?: boolean;
    userId?: string | null;
    stripeSessionId?: string;
    source?: string;
  },
  paymentType: 'Ramburs' | 'Card'
): Promise<{ invoiceLink: string | null; orderNo?: number; orderId?: string; createdPassword?: string }> {
  const { address, billing, marketing, source } = orderData;
  const cart = orderData.cart || orderData.items || [];

  if (!billing.email) (billing as any).email = address.email;

  let invoiceLink: string | null = null;
  let createdPassword: string | undefined;
  let finalUserId = orderData.userId || null;

  // 1. Oblio
  const billingTip = billing?.tip_factura;
  const shouldTryOblio = billingTip === 'persoana_fizica' || billingTip === 'persoana_juridica' || billingTip === 'companie';

  if (shouldTryOblio) {
    try {
      const token = await getOblioAccessToken();
      const billingAddressLine = buildAddressLine(billing, address);
      let clientName = billing.name || address.nume_prenume;
      if (billingTip === 'persoana_juridica' || billingTip === 'companie') clientName = billing.denumire_companie || billing.name || billing.cui || address.nume_prenume;

      const cuiNormalized = normalizeCUI(billing.cui);
      let clientCif = cuiNormalized.primary || cuiNormalized.alternate;
      if (clientCif && !clientCif.toUpperCase().startsWith('RO')) clientCif = `RO${clientCif}`;

      const productsForOblio = (cart || []).map((item: any) => {
        const name = item.name || item.title || item.slug || (item.metadata?.title) || 'Produs';
        const qty = Number(item.quantity || item.qty || 1) || 1;
        const unit = Number(item.unitAmount || item.price || item.unit || item.metadata?.price || 0) || 0;
        return { name, price: unit, measuringUnitName: 'buc', vatName: 'Normala', quantity: qty };
      });

      const sub = productsForOblio.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : getEstimatedShippingCost(address.country || 'RO', cart);
      if (shipping > 0) productsForOblio.push({ name: 'Transport', price: shipping, measuringUnitName: 'buc', vatName: 'Normala', quantity: 1 });

      const invoice = await createOblioInvoice({
        cif: process.env.OBLIO_CIF_FIRMA,
        client: { name: clientName, address: billingAddressLine, email: billing.email || address.email, cif: clientCif, rc: billing.reg_com },
        issueDate: new Date().toISOString().slice(0, 10),
        seriesName: process.env.OBLIO_SERIE_FACTURA,
        documentType: 'Factura',
        products: productsForOblio,
      }, token);

      invoiceLink = invoice?.data?.link || invoice?.link || null;
      if (invoiceLink) console.log('[OrderService] Factura generata:', invoiceLink);
    } catch (e) { console.warn('[OrderService] Oblio failed:', e); }
  }

  // 1.5 Newsletter
  if (orderData.subscribeNewsletter) {
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: address.email, source: source || 'checkout-tablou' })
      });
    } catch (e: any) { }
  }

  // 2. Database & Emails
  try {
    const normalized = (cart || []).map((raw: any) => {
      const qty = Number(raw.quantity || raw.qty || 1) || 1;
      const unit = Number(raw.unitAmount || raw.price || raw.unit || raw.metadata?.price || 0) || 0;
      const total = Number(raw.totalAmount || raw.total || (unit > 0 ? unit * qty : raw.metadata?.totalAmount || 0)) || 0;
      const name = String(raw.name || raw.title || raw.slug || raw.metadata?.title || 'Produs');
      const artworkUrl = raw.artworkUrl || raw.metadata?.artworkUrl || raw.artwork || null;
      return { name, qty, unit, total, artworkUrl, metadata: raw.metadata || {} };
    });

    const subtotal = normalized.reduce((s, it) => s + Number(it.total), 0);
    const fee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : getEstimatedShippingCost(address.country || 'RO', cart);
    const finalTotal = subtotal + fee;

    // -- DUPLICATE CHECK FOR RAMBURS --
    // Previne crearea de comenzi duble si saltul numerelor in caz de dublu-click
    if (paymentType === 'Ramburs') {
      const recentOrders = await prisma.order.findMany({
        where: {
          totalAmount: finalTotal,
          paymentMethod: 'Ramburs',
          source: source || 'Tablou.net',
          createdAt: { gt: new Date(Date.now() - 60000) } // Ultima 1 minut
        }
      });

      const duplicate = recentOrders.find(o => {
        const addr = o.shippingAddress as any;
        return addr?.email === address.email;
      });

      if (duplicate) {
        console.log(`[OrderService] Duplicate Ramburs order detected (ID: ${duplicate.id}). Returning existing order.`);
        return { invoiceLink: duplicate.invoiceUrl, orderNo: duplicate.orderNo, orderId: duplicate.id };
      }
    }

    const saved = await appendOrder({
      paymentType,
      address,
      billing,
      items: normalized,
      shippingFee: fee,
      total: finalTotal,
      invoiceLink,
      marketing,
      userId: finalUserId,
      stripeSessionId: orderData.stripeSessionId,
      source: source || 'Tablou.net'
    });

    await sendEmails(address, billing, cart, invoiceLink, paymentType, marketing, saved.orderNo, createdPassword, saved.id, source);

    try { await prisma.abandonedCart.deleteMany({ where: { email: address.email } }); } catch { }

    return { invoiceLink, orderNo: saved.orderNo, orderId: saved.id, createdPassword };
  } catch (e: any) {
    console.error('[OrderService] fulfillOrder CRITICAL ERROR:', e);
    try { await sendEmails(address, billing, cart, invoiceLink, paymentType, marketing, undefined, createdPassword, undefined, source); } catch { }
    return { invoiceLink, createdPassword };
  }
}

export async function getOblioAccessToken(): Promise<string> {
  const r = await fetch('https://www.oblio.eu/api/authorize/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: process.env.OBLIO_CLIENT_ID, client_secret: process.env.OBLIO_CLIENT_SECRET }),
  });
  const d = await r.json();
  return d.access_token;
}

export async function createOblioInvoice(payload: any, token: string) {
  const r = await fetch('https://www.oblio.eu/api/docs/invoice', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return r.json();
}

function generateRandomPassword(): string {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let o = '';
  for (let i = 0; i < 10; i++) o += a[Math.floor(Math.random() * a.length)];
  return o;
}
