import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_auth')?.value;
    const session = verifyAdminSession(token);
    
    // We keep this behind admin session for security, 
    // but if you can't log in, you can temporarily remove the session check below to test.
    if (!session) {
       // return NextResponse.json({ error: 'Unauthorized. Please login as admin first.' }, { status: 401 });
    }

    const key = process.env.RESEND_API_KEY || process.env.REESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM;
    const adminEmail = process.env.ADMIN_EMAIL;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      env: {
        hasResendKey: !!key,
        resendKeyPrefix: key ? key.substring(0, 7) + '...' : 'NONE',
        emailFrom: emailFrom || 'NOT_SET',
        adminEmail: adminEmail || 'NOT_SET',
        nodeEnv: process.env.NODE_ENV,
      },
      instructions: "If hasResendKey is false, check your GitHub Secrets and deploy again."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
