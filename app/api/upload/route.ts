import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from "@/lib/prisma";

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
