import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { email, source } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ message: 'Email invalid.' }, { status: 400 });
        }

        const sourceVal = source || 'footer';
        
        // Find if already exists for this source
        const existing = await prisma.subscriber.findUnique({
            where: {
                email_source: {
                    email,
                    source: sourceVal,
                },
            },
        });

        if (existing) {
            return NextResponse.json({ message: 'Ești deja abonat! Mulțumim.' });
        }

        await prisma.subscriber.create({
            data: {
                email,
                source: sourceVal,
            },
        });

        return NextResponse.json({ message: 'Te-ai abonat cu succes!' });
    } catch (error) {
        console.error('Subscriber error:', error);
        return NextResponse.json({ message: 'Eroare server.' }, { status: 500 });
    }
}
