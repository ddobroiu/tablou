export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { searchCompanyByCUI } from '@/lib/anaf';

export async function GET(request: NextRequest) {
    const cui = request.nextUrl.searchParams.get('cui');

    if (!cui) {
        return NextResponse.json({ error: 'CUI is required' }, { status: 400 });
    }

    try {
        const data = await searchCompanyByCUI(cui);

        if (!data) {
            return NextResponse.json({ error: 'Compania nu a fost gasita sau CUI invalid' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Eroare necunoscută';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
