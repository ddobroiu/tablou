import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    // Stub endpoint for payment methods
    return NextResponse.json({ methods: [] });
}

export async function POST(req: Request) {
    return NextResponse.json({ success: true });
}
