import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendConfiguratorWelcomeEmail, type NewsletterSubscription } from '@/lib/emailMarketing';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, source } = body;

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

        const subscriberData = {
            email,
            source: sourceVal,
        };

        const subscriber = await prisma.subscriber.create({
            data: subscriberData,
        });

        // Send welcome email based on main interest
        const interests = body.interests || [];
        if (interests.length > 0) {
            try {
                await sendConfiguratorWelcomeEmail({
                    email,
                    interests,
                    source: sourceVal,
                    name: body.name || undefined
                });
            } catch (emailError) {
                console.warn('[Newsletter] Welcome email failed:', emailError);
            }
        }

        return NextResponse.json({ 
            message: 'Te-ai abonat cu succes!',
            subscriber: {
                email: subscriber.email,
                source: subscriber.source
            }
        });
    } catch (error) {
        console.error('Subscriber error:', error);
        return NextResponse.json({ message: 'Eroare server.' }, { status: 500 });
    }
}
