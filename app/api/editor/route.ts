import { NextRequest, NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";

export async function POST(req: NextRequest) {
    try {
        const { imageUrl, action } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
        }

        if (!process.env.REPLICATE_API_TOKEN) {
            return NextResponse.json({ error: "Replicate API token is not configured" }, { status: 500 });
        }

        let prediction: any = null;
        if (action === "restore") {
            // Detailed way to call Replicate to see exactly what's happening
            const response = await replicate.predictions.create({
                version: "cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2",
                input: {
                    image: imageUrl,
                    upscale: 2,
                    face_upsample: true,
                    background_enhance: true,
                    codeformer_fidelity: 0.7,
                },
            });

            // Wait for completion (max 60 seconds)
            prediction = await replicate.wait(response);
        } else if (action === "caricature") {
            const response = await replicate.predictions.create({
                version: "2c4f810237785be36207c4bc459463999907f14b30c87383e65b90b95b309a4d",
                input: {
                    image: imageUrl,
                },
            });
            prediction = await replicate.wait(response);
        } else {
            return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
        }

        console.log("Replicate AI full prediction:", JSON.stringify(prediction, null, 2));

        if (prediction.status === "failed") {
            return NextResponse.json({
                error: "AI failed",
                message: prediction.error || "Model failed to process image"
            }, { status: 500 });
        }

        return NextResponse.json({ success: true, url: prediction.output });
    } catch (error: any) {
        console.error("Replicate Editor Error Details:", error);
        return NextResponse.json({
            error: "AI processing failed",
            message: error.message || "Unknown error",
            details: error.response?.data || null
        }, { status: 500 });
    }
}
