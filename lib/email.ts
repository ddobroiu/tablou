import { Resend } from 'resend';
import { siteConfig } from './siteConfig';

export const getResend = () => {
  const key = process.env.RESEND_API_KEY || process.env.REESEND_API_KEY;
  if (!key) {
    console.warn('[EMAIL] RESEND_API_KEY (or REESEND_API_KEY) is missing. Emails will not be sent.');
    return null;
  }
  return new Resend(key);
};

export function escapeHtml(text: string): string {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getConfigForSource(source?: string | null) {
  const s = source?.toLowerCase() || '';

  if (s.includes('prynt.ro')) {
    return { name: 'Prynt.ro', url: 'www.prynt.ro', email: 'contact@prynt.ro' };
  }
  if (s.includes('euprint.ro')) {
    return { name: 'EuPrint.ro', url: 'www.euprint.ro', email: 'contact@euprint.ro' };
  }
  if (s.includes('adbanner.ro')) {
    return { name: 'AdBanner.ro', url: 'www.adbanner.ro', email: 'contact@adbanner.ro' };
  }
  if (s.includes('tablou.net')) {
    return { name: 'Tablou.net', url: 'www.tablou.net', email: 'contact@tablou.net' };
  }
  if (s.includes('visionboard.ro')) {
    return { name: 'VisionBoard.ro', url: 'www.visionboard.ro', email: 'contact@visionboard.ro' };
  }

  return {
    name: siteConfig.name.includes('.ro') || siteConfig.name.includes('.net') ? siteConfig.name : `${siteConfig.name}.ro`,
    url: (siteConfig as any).domain || siteConfig.url?.replace('https://', '').replace('www.', ''),
    email: siteConfig.email
  };
}

export function getPremiumHtmlTemplate({
  title,
  subtitle,
  content,
  buttonText,
  buttonUrl,
  brandConfig,
  footerExtra
}: {
  title: string;
  subtitle?: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  brandConfig: ReturnType<typeof getConfigForSource>;
  footerExtra?: string;
}) {
  const currentYear = new Date().getFullYear();
  const brandName = brandConfig.name;
  const brandEmail = brandConfig.email;
  const brandUrl = brandConfig.url;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155; background-color: #f8fafc; padding: 20px; border-radius: 16px;">
      <div style="text-align:center; padding: 30px 20px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); margin-bottom: 20px;">
        <h1 style="color:#0f172a; font-size: 24px; margin-top: 0; margin-bottom: 10px;">${title}</h1>
        ${subtitle ? `<p style="font-size: 16px; color: #64748b; margin: 0;">${subtitle}</p>` : ''}
      </div>
      
      <div style="background-color: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); margin-bottom: 20px;">
        ${content}
        
        ${buttonText && buttonUrl ? `
          <div style="margin-top: 24px; text-align: center;">
            <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">${buttonText}</a>
          </div>
        ` : ''}
      </div>

      <div style="text-align:center; margin-top: 30px; font-size: 13px; color: #94a3b8;">
        ${footerExtra ? `${footerExtra}<br/><br/>` : ''}
        Pentru orice asistență, răspunde la acest email sau contactează-ne la <a href="mailto:${brandEmail}" style="color: #4f46e5; text-decoration: none;">${brandEmail}</a>.<br/><br/>
        © ${currentYear} <a href="https://${brandUrl}" style="color: #94a3b8; font-weight: bold; text-decoration:none;">${brandName}</a>
      </div>
    </div>
  `;
}

// Compatibility wrapper for old callers
export function getHtmlTemplate(options: any) {
  const config = getConfigForSource(options.source || options.brandConfig?.name || null);
  return getPremiumHtmlTemplate({
    title: options.title || "Notificare",
    subtitle: options.subtitle || "",
    content: options.message || options.content || "",
    buttonText: options.buttonText,
    buttonUrl: options.buttonUrl,
    brandConfig: config,
    footerExtra: options.footerText || options.footerExtra
  });
}

export async function sendWelcomeEmail(to: string, name: string, source?: string) {
  try {
    const resend = getResend();
    if (!resend) return;
    const config = getConfigForSource(source);

    const content = `
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Salut, <strong>${escapeHtml(name)}</strong>!<br/><br/>
        Îți mulțumim că te-ai alăturat comunității noastre. Pe <strong>${config.name}</strong> găsești cele mai bune soluții pentru tipografie și materiale personalizate.
      </p>
    `;

    const html = getPremiumHtmlTemplate({
      title: "Bine ai venit! 🎉",
      subtitle: `Contul tău pe ${config.name} este gata.`,
      content,
      buttonText: "Vezi Produsele",
      buttonUrl: `https://${config.url}`,
      brandConfig: config
    });

    console.log(`[EMAIL] Attempting to send welcome email to ${to} from ${config.email}`);
    const result = await sendEmail({
      from: `${config.name} <${config.email}>`,
      to,
      subject: `Bine ai venit pe ${config.name}!`,
      html,
    });
    
    if (!result.error && (result as any).data) {
      console.log(`[EMAIL] Welcome email sent successfully to ${to}. ID: ${(result as any).data?.id}`);
    }
  } catch (error) {
    console.error('[EMAIL] sendWelcomeEmail exception:', error);
  }
}

export async function sendOrderConfirmationEmail(order: any, customContent?: string) {
  try {
    const resend = getResend();
    if (!resend) return;

    const config = getConfigForSource(order.source);
    const orderNo = order.orderNo || (order.id && order.id !== 'N/A' ? order.id.slice(-6).toUpperCase() : 'NO-ID');
    const orderId = order.id;
    const paymentType = order.paymentMethod || 'Ramburs';
    
    let content = '';

    if (customContent) {
      content = customContent;
    } else {
      const items = order.items || [];
      const itemsHtml = items.map((it: any) => `
        <div style="padding:12px 0; border-bottom:1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
          <div style="flex: 1; padding-right: 15px;">
            <div style="font-weight:600; font-size: 15px; color: #1e293b;">${escapeHtml(it.name || it.title)}</div>
            <div style="font-size:13px; color:#64748b; margin-top: 4px;">Cantitate: ${it.quantity || it.qty} buc. @ ${it.price || it.unit} RON/buc.</div>
          </div>
          <div style="font-weight: bold; color: #0f172a; font-size: 15px; white-space: nowrap;">
            ${Number(it.total || 0).toFixed(2)} RON
          </div>
        </div>
      `).join('');

      content = `
        <h2 style="font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">Detalii Comandă</h2>
        <div style="margin-bottom: 20px;">
          ${itemsHtml}
        </div>
        
        <div style="border-top: 1px dashed #cbd5e1; padding-top: 16px; margin-top: 16px;">
          <div style="display:flex; justify-content:space-between; margin-bottom: 8px; color: #64748b; font-size: 14px;">
            <span>Transport:</span> <span style="font-weight: 500;">${Number(order.shippingFee || 0).toFixed(2)} RON</span>
          </div>
          <div style="display:flex; justify-content:space-between; color: #0f172a; font-size: 18px; font-weight: bold; margin-top: 8px;">
            <span>Total de Achitat:</span> <span>${Number(order.totalAmount || order.total || 0).toFixed(2)} RON</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top: 8px; color: #64748b; font-size: 14px;">
            <span>Metodă de plată:</span> <span style="font-weight: 500;">${paymentType}</span>
          </div>
        </div>

        <h2 style="font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-top: 30px;">Detalii Livrare</h2>
        <p style="font-size: 14px; color: #334155; line-height: 1.5; margin: 10px 0;">
          <strong>Client:</strong> ${escapeHtml(order.shippingAddress?.name || order.shippingAddress?.nume_prenume || '')}<br/>
          <strong>Adresă:</strong> ${escapeHtml(order.shippingAddress?.localitate || '')}, ${escapeHtml(order.shippingAddress?.judet || '')}, ${escapeHtml(order.shippingAddress?.street || order.shippingAddress?.strada_nr || '')}<br/>
          <strong>Telefon:</strong> ${escapeHtml(order.shippingAddress?.phone || order.shippingAddress?.telefon || '')}
        </p>
      `;
    }

    const html = getPremiumHtmlTemplate({
      title: "Comandă Confirmată! 🎉",
      subtitle: `Solicitarea ta #${orderNo} a fost recepționată și este în curs de prelucrare.`,
      content,
      buttonText: order.invoiceUrl ? "Descarcă Factura" : (orderId && orderId !== 'N/A' ? "Vezi Comanda pe Site" : undefined),
      buttonUrl: order.invoiceUrl || (orderId && orderId !== 'N/A' ? `https://${config.url}/account/orders/${orderId}` : undefined),
      brandConfig: config
    });

    console.log(`[EMAIL] Attempting to send order confirmation for #${orderNo} to ${(order.shippingAddress as any)?.email || order.userEmail || order.email} from ${config.email}`);
    const result = await sendEmail({
      from: `${config.name} <${config.email}>`,
      to: (order.shippingAddress as any)?.email || order.userEmail || order.email,
      subject: `Confirmare comandă #${orderNo} - ${config.name}`,
      html,
    });
  } catch (error) {
    console.error('[EMAIL] sendOrderConfirmationEmail exception:', error);
  }
}

// --- 3. EMAIL NOTIFICARE ADMIN ---
export async function sendNewOrderAdminEmail(order: any, customContent?: string) {
  try {
    const resend = getResend();
    if (!resend) return;

    const config = getConfigForSource(order.source);
    const orderNo = order.orderNo || (order.id && order.id !== 'N/A' ? order.id.slice(-6).toUpperCase() : 'NO-ID');
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@shopprint.ro';

    let content = '';
    if (customContent) {
      content = customContent;
    } else {
      content = `
        <div style="background:#f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Sursă:</strong> ${config.name}</p>
          <p style="margin: 5px 0;"><strong>Total:</strong> ${Number(order.totalAmount || order.total || 0).toFixed(2)} RON</p>
          <p style="margin: 5px 0;"><strong>Client:</strong> ${escapeHtml(order.shippingAddress?.name || order.shippingAddress?.nume_prenume || '')}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${order.shippingAddress?.email || ''}</p>
          <p style="margin: 5px 0;"><strong>Telefon:</strong> ${order.shippingAddress?.phone || order.shippingAddress?.telefon || ''}</p>
        </div>
      `;
    }

    const html = getPremiumHtmlTemplate({
      title: "Comandă Nouă! 📦",
      subtitle: `Comanda #${orderNo} pe ${config.name}`,
      content,
      buttonText: "Gestionează în Admin",
      buttonUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shopprint.ro'}/admin/orders/${order.id}`,
      brandConfig: config
    });

    console.log(`[EMAIL] Attempting to send admin notification for #${orderNo} to ${adminEmail} from ${config.email}`);
    const result = await sendEmail({
      from: `${config.name} System <${config.email}>`,
      to: adminEmail,
      subject: `[ADMIN] Comandă Nouă #${orderNo} - ${config.name}`,
      html,
    });
  } catch (error) {
    console.error('[EMAIL] sendNewOrderAdminEmail exception:', error);
  }
}

export async function sendPasswordResetEmail(to: string, token: string, source?: string) {
  try {
    const resend = getResend();
    if (!resend) return;
    const config = getConfigForSource(source);
    const resetLink = `https://${config.url}/login?resetToken=${token}&view=reset`;

    const content = `<p>Am primit o cerere de resetare a parolei pentru contul tău pe ${config.name}.</p>`;

    const html = getPremiumHtmlTemplate({
      title: "Resetare Parolă",
      subtitle: "Apasă pe butonul de mai jos pentru a alege o parolă nouă.",
      content,
      buttonText: "Resetează Parola",
      buttonUrl: resetLink,
      brandConfig: config
    });

    console.log(`[EMAIL] Attempting to send password reset to ${to} from ${config.email}`);
    const result = await sendEmail({
      from: `${config.name} <${config.email}>`,
      to,
      subject: `Resetare parolă ${config.name}`,
      html,
    });
  } catch (error) {
    console.error('[EMAIL] sendPasswordResetEmail exception:', error);
  }
}

export async function sendContactFormEmail({ name, email, phone, message, subject: userSubject, source }: { name: string, email: string, phone?: string, message: string, subject?: string, source?: string }) {
  try {
    const resend = getResend();
    if (!resend) return;
    const config = getConfigForSource(source);
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@shopprint.ro';

    const content = `
      <div style="background:#f1f5f9; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 10px;"><strong>Nume:</strong> ${escapeHtml(name)}</p>
        <p style="margin: 0 0 10px;"><strong>Email:</strong> ${email}</p>
        ${phone ? `<p style="margin: 0 0 10px;"><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ''}
        ${userSubject ? `<p style="margin: 0 0 10px;"><strong>Subiect:</strong> ${escapeHtml(userSubject)}</p>` : ''}
        <p style="margin: 0 0 5px;"><strong>Mesaj:</strong></p>
        <div style="white-space: pre-wrap; color: #334155; line-height: 1.6;">${escapeHtml(message)}</div>
      </div>
    `;

    const html = getPremiumHtmlTemplate({
      title: "Mesaj Nou Contact ✉️",
      subtitle: `Primit via ${config.name}`,
      content,
      brandConfig: config
    });

    console.log(`[EMAIL] Attempting to send contact form email from ${email} to ${adminEmail} using ${config.email}`);
    const result = await sendEmail({
      from: `${config.name} Form <${config.email}>`,
      to: adminEmail,
      subject: `[CONTACT] ${userSubject || 'Mesaj nou'} - ${escapeHtml(name)}`,
      html,
    });
  } catch (error) {
    console.error('[EMAIL] sendContactFormEmail exception:', error);
  }
}

interface SendEmailParams {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  attachments?: any[];
  bcc?: string | string[];
}

export async function sendEmail({ from, to, subject, html, attachments, bcc }: SendEmailParams) {
  try {
    const resend = getResend();
    if (!resend) {
      console.error('[EMAIL] Cannot send email - Resend instance is null (check API Key)');
      return { error: new Error('Resend API key missing') };
    }

    console.log(`[EMAIL] Sending "${subject}" from "${from}" to "${to}"...`);
    
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      attachments,
      bcc,
    });

    if (result.error) {
      console.error('[EMAIL] Resend returned an error:', result.error);
    } else {
      console.log(`[EMAIL] Email sent successfully! ID: ${(result as any).data?.id}`);
    }
    return result;
  } catch (error: any) {
    console.error('[EMAIL] Fatal exception in sendEmail:', error?.message || error);
    return { error };
  }
}