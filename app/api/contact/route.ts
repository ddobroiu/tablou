import { NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message, website } = body;

    // Honeypot check: If the 'website' hidden field is filled, it's likely a bot.
    // We return success to the "user" but don't actually send the email.
    if (website) {
      console.warn('Bot detected in contact form (honeypot triggered)');
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Toate câmpurile sunt obligatorii.' }, { status: 400 });
    }

    await sendContactFormEmail({
      name,
      email,
      phone,
      message,
      source: 'Tablou.net'
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou.' }, { status: 500 });
  }
}
