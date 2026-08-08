"use client";

import { useEffect } from "react";

export default function ConversionTracker({ orderNo }: { orderNo: string | number | null }) {
    useEffect(() => {
        if (!orderNo) return;

        window.dataLayer = window.dataLayer || [];

        window.dataLayer.push({
            event: "purchase",
            transaction_id: orderNo,
            value: 1,
            currency: "RON"
        });

        console.log("[ConversionTracker] Pushed purchase event for order:", orderNo);

    }, [orderNo]);

    return null;
}
