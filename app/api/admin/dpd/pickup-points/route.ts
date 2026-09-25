import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminSession';
import { getPickupPoints } from '@/lib/dpdService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Punctele de ridicare DPD, pentru alegerea sediului la emiterea AWB-ului
export async function GET(req: NextRequest) {
    if (!verifyAdminSession(req.cookies.get('admin_auth')?.value)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const points = await getPickupPoints();
        const defaultId = Number(process.env.DPD_SENDER_CLIENT_ID || 0) || null;
        return NextResponse.json({ points, defaultId });
    } catch (e) {
        return NextResponse.json({ points: [], defaultId: null, error: e instanceof Error ? e.message : 'Eroare DPD' });
    }
}
