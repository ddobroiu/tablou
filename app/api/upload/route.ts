import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyAdminSession } from "@/lib/adminSession";

// Grafica unui produs din comanda o poate schimba doar adminul sau clientul caruia ii apartine comanda
async function canEditOrderItem(itemId: string): Promise<boolean> {
    const jar = await cookies();
    if (verifyAdminSession(jar.get("admin_auth")?.value)) return true;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    const email = session?.user?.email?.toLowerCase();
    if (!userId) return false;
    const item = await prisma.orderItem.findUnique({ where: { id: itemId }, select: { order: { select: { userId: true, shippingAddress: true } } } });
    if (!item) return false;
    if (item.order.userId === userId) return true;
    // comanda fara cont, cu acelasi email, doar daca emailul contului e verificat (ca in pagina contului)
    const orderEmail = String((item.order.shippingAddress as any)?.email || "").toLowerCase();
    if (!email || orderEmail !== email) return false;
    const account = await prisma.user.findUnique({ where: { id: userId }, select: { emailVerified: true } });
    return Boolean(account?.emailVerified);
}

// Configurația Cloudinary se încarcă automat din variabilele de mediu
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const type = formData.get("type") as string | null;
        const publicId = formData.get("publicId") as string | null; // Acesta este orderItemId

        if (!file) {
            return NextResponse.json({ error: "Lipsește fișierul" }, { status: 400 });
        }
        if (type === 'order_item_artwork' && (!publicId || !(await canEditOrderItem(publicId)))) {
            return NextResponse.json({ error: "Nu ai acces la această comandă." }, { status: 403 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Determinăm resource_type (raw pentru vectori/pdf, image pentru poze)
        let resourceType: 'image' | 'auto' | 'raw' | 'video' | undefined = 'auto';
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.pdf') || fileName.endsWith('.ai') || fileName.endsWith('.psd') || fileName.endsWith('.zip') || fileName.endsWith('.rar')) {
            resourceType = 'raw';
        }

        // Upload către Cloudinary
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'tablou-artworks',
                    resource_type: resourceType,
                    use_filename: true,
                    unique_filename: true,
                    overwrite: false,
                },
                (error, result) => {
                    if (error || !result) reject(error || new Error("Upload failed"));
                    else resolve({ secure_url: result.secure_url });
                }
            );
            uploadStream.end(buffer);
        });

        const fileUrl = result.secure_url;

        // Dacă este o grafică pentru un articol de comandă, actualizăm baza de date
        if (type === 'order_item_artwork' && publicId) {
            await prisma.orderItem.update({
                where: { id: publicId },
                data: { artworkUrl: fileUrl }
            });
        }

        return NextResponse.json({
            ok: true,
            url: fileUrl
        });
    } catch (error: any) {
        console.error("Error in /api/upload:", error);
        return NextResponse.json({ error: error.message || "Eroare la încărcare" }, { status: 500 });
    }
}
