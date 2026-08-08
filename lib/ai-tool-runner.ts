import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/email";
import {
    calculateBannerPrice,
    calculateBannerVersoPrice,
    calculateFlyerPrice,
    calculateWindowGraphicsPrice,
    calculateRollupPrice,
    calculateCanvasPrice,
    calculateTapetPrice,
    calculateAutocolantePrice,
    calculatePosterPrice,
    calculatePliantePrice,
    calculatePlexiglassPrice,
    calculatePVCForexPrice,
    calculateAlucobondPrice,
    calculatePolipropilenaPrice,
    calculateCartonPrice,
    calculateFonduriEUPrice,
    type PlianteWeightKey,
    type PlianteFoldType,
} from "@/lib/pricing";

type ToolContext = {
    source: 'whatsapp' | 'web';
    identifier: string; // telefon pentru whatsapp, email/session pentru web
};

export async function executeTool(fnName: string, args: any, context: ToolContext) {
    console.log(`🔧 Executare tool: ${fnName}`, args);

    try {
        // ============================================================
        // 1. CALCUL PREȚ BANNER
        // ============================================================
        if (fnName === "calculate_banner_price") {
            const hem = true; // STANDARD: Tiv și capse sunt INCLUSE automat
            const mat = args.material?.includes("510") ? "frontlit_510" : "frontlit_440";

            if (args.type === "verso") {
                const res = calculateBannerVersoPrice({
                    width_cm: args.width_cm,
                    height_cm: args.height_cm,
                    quantity: args.quantity,
                    want_wind_holes: args.want_wind_holes || false,
                    same_graphic: args.same_graphic ?? true,
                    designOption: "upload",
                });
                return { pret_total: res.finalPrice, info: "Banner față-verso" };
            } else {
                const res = calculateBannerPrice({
                    width_cm: args.width_cm,
                    height_cm: args.height_cm,
                    quantity: args.quantity,
                    material: mat,
                    want_wind_holes: args.want_wind_holes || false,
                    want_hem_and_grommets: hem,
                    designOption: "upload",
                });
                return {
                    pret_total: res.finalPrice,
                    info: `Banner ${mat}, ${hem ? "cu finisaje" : "fără finisaje"}`,
                };
            }
        }

        // ============================================================
        // 2. CALCUL PREȚ FLYER / AFIȘE / PLIANTE
        // ============================================================
        else if (fnName === "calculate_standard_print_price") {
            if (args.product_type === "afis") {
                const { AFISE_CONSTANTS } = await import('@/lib/pricing');
                const matKey = args.paper_type || "whiteback_150_material";
                const sizeKey = args.size || "A2";

                if (!AFISE_CONSTANTS.PRICE_TABLE[matKey]?.[sizeKey]) {
                    const availableMaterials = Object.keys(AFISE_CONSTANTS.PRICE_TABLE)
                        .filter(m => AFISE_CONSTANTS.PRICE_TABLE[m][sizeKey])
                        .map(m => AFISE_CONSTANTS.MATERIALS.find(mat => mat.key === m)?.label || m)
                        .join(', ');

                    return {
                        error: true,
                        message: `Materialul ${matKey} nu este disponibil pentru dimensiunea ${sizeKey}.\n\nMateriale disponibile pentru ${sizeKey}: ${availableMaterials}`
                    };
                }

                const res = calculatePosterPrice({
                    size: sizeKey,
                    material: matKey,
                    quantity: args.quantity,
                    designOption: "upload",
                });
                return {
                    pret_total: res.finalPrice,
                    pret_unitar: res.unitPrice,
                    info: `Afișe ${sizeKey} pe ${AFISE_CONSTANTS.MATERIALS.find(m => m.key === matKey)?.label || matKey}`
                };
            } else if (args.product_type === "pliant") {
                const res = calculatePliantePrice({
                    weight: (args.paper_type || "130") as PlianteWeightKey,
                    quantity: args.quantity,
                    fold: (args.fold_type || "simplu") as PlianteFoldType,
                    designOption: "upload",
                });
                return {
                    pret_total: res.finalPrice,
                    pret_unitar: res.pricePerUnit,
                    info: `Pliante ${args.fold_type || 'simplu'} pe hârtie ${args.paper_type || '130g'}`
                };
            } else {
                const res = calculateFlyerPrice({
                    sizeKey: args.size || "A6",
                    quantity: args.quantity,
                    twoSided: args.two_sided ?? true,
                    paperWeightKey: "135",
                    designOption: "upload",
                });
                return {
                    pret_total: res.finalPrice,
                    pret_unitar: res.unitPrice,
                    info: `Flyere ${args.size} ${args.two_sided ? 'față-verso' : 'o față'}`
                };
            }
        }

        // ============================================================
        // 3. CALCUL PREȚ WINDOW GRAPHICS
        // ============================================================
        else if (fnName === "calculate_window_graphics_price") {
            const res = calculateWindowGraphicsPrice({
                width_cm: args.width_cm,
                height_cm: args.height_cm,
                quantity: args.quantity,
                designOption: args.design_pro ? "pro" : "upload",
            });
            return {
                pret_total: res.finalPrice,
                pret_unitar: res.pricePerSqm,
                suprafata_mp: res.total_sqm,
                info: `Window Graphics folie PVC 140μ perforată (${res.total_sqm.toFixed(2)} mp × ${res.pricePerSqm} lei/mp)${args.design_pro ? ' + Design Pro 100 lei' : ''}`
            };
        }

        // ============================================================
        // 4. CALCUL PREȚ CANVAS
        // ============================================================
        else if (fnName === "calculate_roll_print_price" && args.product_type === "canvas") {
            let frameType: "framed" | "none" = "none";
            let framedSize: string | undefined = undefined;
            let framedShape: "rectangle" | "square" = "rectangle";

            if (args.framed_size) {
                frameType = "framed";
                framedSize = args.framed_size;
                if (framedSize) {
                    const parts = framedSize.split("x");
                    if (parts.length === 2) {
                        const [w, h] = parts.map(Number);
                        framedShape = w === h ? "square" : "rectangle";
                    }
                }
            }

            const res = calculateCanvasPrice({
                width_cm: args.width_cm || 0,
                height_cm: args.height_cm || 0,
                quantity: args.quantity,
                edge_type: "mirror",
                designOption: args.design_pro ? "pro" : "upload",
                frameType: frameType,
                framedSize: framedSize,
                framedShape: framedShape,
            });

            const typeInfo = frameType === "framed"
                ? `Canvas cu Ramă ${framedSize?.replace("x", "×")} cm`
                : `Canvas ${args.width_cm}×${args.height_cm} cm`;

            return {
                pret_total: res.finalPrice,
                pret_unitar: Math.round((res.finalPrice / args.quantity) * 100) / 100,
                info: `${typeInfo} (margine oglindită, include șasiu)${args.design_pro ? ' + Design Pro 40 lei' : ''}`
            };
        }

        // ============================================================
        // 4.5. CALCUL PREȚ TAPET
        // ============================================================
        else if (fnName === "calculate_roll_print_price" && args.product_type === "tapet") {
            const res = calculateTapetPrice({
                width_cm: args.width_cm || 0,
                height_cm: args.height_cm || 0,
                quantity: args.quantity,
                want_adhesive: args.options?.adhesive || false,
                designOption: args.design_pro ? "pro" : "upload",
            });

            return {
                pret_total: res.finalPrice,
                pret_unitar: res.pricePerUnit,
                suprafata_mp: (res as any).totalSqm || (res as any).total_sqm || 0,
                info: `Tapet ${args.width_cm}×${args.height_cm} cm (${((res as any).totalSqm || (res as any).total_sqm || 0).toFixed(2)} mp total)${args.options?.adhesive ? ' + Adeziv auto-adeziv (+10%)' : ''}${args.design_pro ? ' + Design Pro 200 lei' : ''}`
            };
        }

        // ============================================================
        // 4.6. CALCUL PREȚ AUTOCOLANTE
        // ============================================================
        else if (fnName === "calculate_roll_print_price" && args.product_type === "autocolant") {
            const res = calculateAutocolantePrice({
                width_cm: args.width_cm || 0,
                height_cm: args.height_cm || 0,
                quantity: args.quantity,
                material: args.material_subtype || "oracal_3641",
                print_type: args.options?.diecut === false ? "print_only" : "print_cut",
                laminated: args.options?.laminated || false,
                transfer_film: args.options?.transfer_film || args.options?.transfer || false,
                designOption: args.design_pro ? "pro" : "upload",
            });

            return {
                pret_total: res.finalPrice,
                pret_unitar: Math.round((res.finalPrice / args.quantity) * 100) / 100,
                suprafata_mp: (res as any).total_sqm || 0,
                info: `Autocolante ${args.width_cm}×${args.height_cm} cm (${((res as any).total_sqm || 0).toFixed(2)} mp) pe ${args.material_subtype || 'Economic'}${args.options?.laminated ? ' + Laminare' : ''}${(args.options?.transfer_film || args.options?.transfer) ? ' + Folie transfer' : ''}${args.options?.diecut === false ? ' Print Only' : ' Print+Cut'}${args.design_pro ? ' + Design Pro 50 lei' : ''}`
            };
        }

        // ============================================================
        // 4.7. CALCUL PREȚ MATERIALE RIGIDE
        // ============================================================
        else if (fnName === "calculate_rigid_price") {
            const { material_type, width_cm, height_cm, quantity, thickness_mm, print_double, color, subtype } = args;

            if (material_type === "plexiglass") {
                const res = calculatePlexiglassPrice({
                    width_cm: width_cm || 0,
                    height_cm: height_cm || 0,
                    quantity: quantity || 1,
                    material: subtype === "transparent" ? "transparent" : "alb",
                    thickness_mm: thickness_mm || 3,
                    print_double: print_double || false,
                    designOption: args.design_pro ? "pro" : "upload",
                });
                return {
                    pret_total: res.finalPrice,
                    pret_unitar: res.pricePerUnit,
                    suprafata_mp: (res as any).total_sqm || 0,
                    info: `Plexiglas ${subtype || 'alb'} ${thickness_mm}mm (${((res as any).total_sqm || 0).toFixed(2)} mp)${print_double ? ' print față-verso' : ''}${args.design_pro ? ' + Design Pro 60 lei' : ''}`
                };
            } else if (material_type === "forex") {
                const res = calculatePVCForexPrice({
                    width_cm: width_cm || 0,
                    height_cm: height_cm || 0,
                    quantity: quantity || 1,
                    thickness_mm: thickness_mm || 3,
                    designOption: args.design_pro ? "pro" : "upload",
                });
                return {
                    pret_total: res.finalPrice,
                    pret_unitar: res.pricePerUnit,
                    suprafata_mp: (res as any).total_sqm || 0,
                    info: `PVC Forex ${thickness_mm}mm (${((res as any).total_sqm || 0).toFixed(2)} mp)${args.design_pro ? ' + Design Pro 50 lei' : ''}`
                };
            } else if (material_type === "alucobond") {
                const res = calculateAlucobondPrice({
                    width_cm: width_cm || 0,
                    height_cm: height_cm || 0,
                    quantity: quantity || 1,
                    thickness_mm: thickness_mm || 3,
                    color: color || "alb",
                    designOption: args.design_pro ? "pro" : "upload",
                });
                return {
                    pret_total: res.finalPrice,
                    pret_unitar: res.pricePerUnit,
                    suprafata_mp: (res as any).total_sqm || 0,
                    info: `Alucobond ${thickness_mm}mm culoare ${color || 'alb'} (${((res as any).total_sqm || 0).toFixed(2)} mp)${args.design_pro ? ' + Design Pro 60 lei' : ''}`
                };
            } else if (material_type === "polipropilena") {
                const res = calculatePolipropilenaPrice({
                    width_cm: width_cm || 0,
                    height_cm: height_cm || 0,
                    quantity: quantity || 1,
                    thickness_mm: thickness_mm || 3,
                    designOption: args.design_pro ? "pro" : "upload",
                });
                return {
                    pret_total: res.finalPrice,
                    pret_unitar: res.pricePerUnit,
                    suprafata_mp: (res as any).total_sqm || 0,
                    info: `Polipropilenă ${thickness_mm}mm (${((res as any).total_sqm || 0).toFixed(2)} mp)${args.design_pro ? ' + Design Pro 50 lei' : ''}`
                };
            } else if (material_type === "carton") {
                const material = subtype?.includes("reciclat") ? "reciclat" : "ondulat";
                const res = calculateCartonPrice({
                    width_cm: width_cm || 0,
                    height_cm: height_cm || 0,
                    quantity: quantity || 1,
                    material,
                    ondula: material === "ondulat" ? (subtype || "E") : undefined,
                    reciclatBoard: material === "reciclat" ? (subtype || "400g") : undefined,
                    printDouble: print_double || false,
                    designOption: args.design_pro ? "pro" : "upload",
                });
                return {
                    pret_total: res.finalPrice,
                    pret_unitar: res.pricePerUnit,
                    suprafata_mp: (res as any).total_sqm || 0,
                    info: `Carton ${subtype || 'ondulat E'} (${((res as any).total_sqm || 0).toFixed(2)} mp)${print_double ? ' print față-verso' : ''}${args.design_pro ? ' + Design Pro 50 lei' : ''}`
                };
            }
            return { error: "Tip material rigid necunoscut" };
        }

        // ============================================================
        // 5. CALCUL PREȚ ROLLUP BANNER
        // ============================================================
        else if (fnName === "calculate_rollup_price") {
            const res = calculateRollupPrice({
                width_cm: args.width_cm,
                quantity: args.quantity,
                designOption: args.design_pro ? "pro" : "upload",
            });
            return {
                pret_total: res.finalPrice,
                pret_unitar: res.unitPrice,
                info: `Rollup ${args.width_cm}cm × 200cm (${args.quantity} buc × ${res.unitPrice} lei/buc)${args.design_pro ? ' + Design Pro 100 lei' : ''}. Include: casetă aluminiu + print Blueback 440g + geantă transport`
            };
        }

        // ============================================================
        // 5.5. CALCUL PREȚ FONDURI EU
        // ============================================================
        else if (fnName === "calculate_fonduri_eu_price") {
            const selections: Record<string, string> = {
                comunicat: args.comunicat || "none",
                panouPrincipal: args.panou_principal_size || "none",
                materialPanouPrincipal: args.panou_principal_material || "alucobond",
                autocolanteLaterale: args.autocolante_size || "none",
                panouTemporar: args.panou_temporar || "none",
                placaPermanenta: args.placa_permanenta || "none",
            };

            if (args.add_logo) selections.logo = "yes";

            const res = calculateFonduriEUPrice({ selections });

            return {
                pret_total: res.finalPrice,
                info: `Kit Vizibilitate Fonduri ${args.funding_type?.toUpperCase() || 'UE'}: Panou ${args.panou_principal_size} pe ${args.panou_principal_material || 'Alucobond'}${args.autocolante_size && args.autocolante_size !== 'none' ? ` + Autocolante ${args.autocolante_size}` : ''}${args.add_logo ? ' + Logo' : ''}`
            };
        }

        // ============================================================
        // 6. VERIFICARE STATUS COMANDĂ + LINK DPD
        // ============================================================
        else if (fnName === "check_order_status") {
            const orderNo = parseInt(args.orderNo);
            if (isNaN(orderNo)) return { error: "Numărul comenzii trebuie să fie numeric." };

            const order = await prisma.order.findUnique({
                where: { orderNo: orderNo },
                select: { status: true, awbNumber: true, awbCarrier: true }
            });

            if (!order) return { found: false, message: "Comanda nu a fost găsită." };

            let trackingInfo = "";
            if (order.awbNumber) {
                const trackingUrl = `https://tracking.dpd.ro/?shipmentNumber=${order.awbNumber}&language=ro`;
                trackingInfo = `AWB: ${order.awbNumber}. Tracking: ${trackingUrl}`;
            } else {
                trackingInfo = "Încă nu a fost generat un AWB.";
            }

            return {
                found: true,
                status: order.status,
                message: `Status: ${order.status}.\n\n${trackingInfo}`
            };
        }

        // ============================================================
        // 7. CĂUTARE CLIENȚI
        // ============================================================
        else if (fnName === "search_customers") {
            const { partial_name } = args;
            if (!partial_name || partial_name.length < 2) return { success: false, message: "Minim 2 caractere." };

            try {
                const orders = await prisma.order.findMany({
                    where: { shippingAddress: { path: ['name'], string_contains: partial_name } },
                    select: { billingAddress: true },
                    distinct: ['billingAddress'],
                    take: 5
                });

                const names = Array.from(new Set(orders.map((o: any) => o.billingAddress?.name).filter(Boolean)));

                return { success: true, customers: names, message: names.length ? `Sugestii: ${names.join(', ')}` : "Nu am găsit." };
            } catch (e) {
                return { success: false, message: "Eroare căutare." };
            }
        }

        // ============================================================
        // 8. GENERARE OFERTĂ PDF
        // ============================================================
        else if (fnName === "generate_offer") {
            const { customer_details, items } = args;
            if (!customer_details?.name || !items?.length) return { success: false, error: "Date insuficiente." };

            const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
            const lastOrder = await prisma.order.findFirst({ orderBy: { orderNo: 'desc' } });
            const nextOrderNo = (lastOrder?.orderNo ?? 1000) + 1;

            const addressData = {
                name: customer_details.name,
                email: customer_details.email || `offer_${context.source}@tablou.net`,
                phone: customer_details.phone || "",
                street: customer_details.address || "",
                city: customer_details.city || "",
                county: customer_details.county || "",
                country: "Romania",
            };

            const offerRecord = await prisma.order.create({
                data: {
                    orderNo: nextOrderNo,
                    type: "offer",
                    status: "pending_verification",
                    paymentMethod: "Ramburs",
                    totalAmount: totalAmount,
                    shippingAddress: addressData,
                    billingAddress: addressData,
                    marketing: { type: 'offer', generatedFrom: context.source },
                    items: {
                        create: items.map((item: any) => ({
                            name: item.title,
                            quantity: Number(item.quantity) || 1,
                            price: Number(item.price) || 0,
                            total: (Number(item.price) || 0) * (Number(item.quantity) || 1),
                            metadata: { details: item.details, source: `AI Offer (${context.source})` },
                        })),
                    },
                }
            });

            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net";
            const offerLink = `${baseUrl}/api/pdf/offer?id=${offerRecord.id}`;

            return {
                success: true,
                orderNo: nextOrderNo,
                link: offerLink,
                message: `✅ Oferta #${nextOrderNo} generată!\n📄 Descarcă: ${offerLink}`
            };
        }

        // ============================================================
        // 9. CREARE COMANDĂ FERMĂ
        // ============================================================
        else if (fnName === "create_order") {
            const { customer_details, items } = args;
            const totalAmount = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

            const lastOrder = await prisma.order.findFirst({ orderBy: { orderNo: "desc" } });
            const nextOrderNo = (lastOrder?.orderNo ?? 1000) + 1;

            const order = await prisma.order.create({
                data: {
                    orderNo: nextOrderNo,
                    status: "pending_verification",
                    paymentMethod: "ramburs",
                    totalAmount: totalAmount,
                    shippingAddress: {
                        name: customer_details.name,
                        phone: customer_details.phone,
                        street: customer_details.address,
                        city: customer_details.city,
                        county: customer_details.county,
                        country: "Romania",
                    },
                    billingAddress: {
                        name: customer_details.name,
                        phone: customer_details.phone,
                        street: customer_details.address,
                        city: customer_details.city,
                        county: customer_details.county,
                        country: "Romania",
                    },
                    items: {
                        create: items.map((item: any) => ({
                            name: item.title,
                            quantity: Number(item.quantity) || 1,
                            price: Number(item.price) || 0,
                            total: (Number(item.price) || 0) * (Number(item.quantity) || 1),
                            metadata: { details: item.details, source: "Assistant" },
                        })),
                    },
                }
            });

            try {
                await sendOrderConfirmationEmail(order);
                await sendNewOrderAdminEmail(order);
            } catch (e) { }

            return { success: true, orderNo: order.orderNo };
        }

        return { info: "Tool necunoscut." };
    } catch (e: any) {
        return { error: e.message };
    }
}
