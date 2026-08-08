export const dynamic = 'force-dynamic';

import { redirect, notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";

export default async function GenericCatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const resolved = await params;
    const slugParts = resolved.slug;
    
    // Suport pentru rutele /product/[slug] care pot veni din linkuri externe
    if (slugParts[0] === 'product' && slugParts.length > 1) {
        const actualSlug = slugParts.slice(1).join("/");
        
        // Căutăm produsul după slug-ul real
        const product = getProductBySlug(actualSlug);
        if (product) {
            const canonicalRoute = product.routeSlug ? 
                (product.routeSlug.startsWith('/') ? product.routeSlug : `/${product.routeSlug}`) : 
                `/${actualSlug}`;
            redirect(canonicalRoute);
        }
        
        // Caz special pentru rollup
        if (actualSlug === 'rollup') {
            redirect('/rollup');
        }
    }

    const joinedSlug = slugParts.join("/");

    // Încercăm să găsim produsul folosind logica de rezolvare existentă
    const product = getProductBySlug(joinedSlug);

    if (product) {
        // Dacă am găsit produsul și are o rută canonică diferită de cea actuală, redirecționăm
        const canonicalRoute = product.routeSlug ?
            (product.routeSlug.startsWith('/') ? product.routeSlug : `/${product.routeSlug}`) :
            null;

        if (canonicalRoute && canonicalRoute !== `/${joinedSlug}`) {
            // Folosim permanentRedirect pentru SEO (308)
            redirect(canonicalRoute);
        }
    }

    // Ultima șansă: Dacă e pur și simplu "product/rollup" sau "rollup" (dar nu a prins pagină specifică)
    if (joinedSlug === 'rollup' || joinedSlug === 'product/rollup') {
        redirect('/rollup');
    }

    // Dacă nu e un produs sau nu avem unde redirecționa, 404
    return notFound();
}
