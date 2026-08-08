"use client";

import React from 'react';
import Link from 'next/link';
import { PRODUCT_INTENTS } from '@/lib/seo/intents';

interface SeoDimensionsLinksProps {
    productId: string;
    productName: string;
    currentW: number;
    currentH: number;
}

// Common dimensions for Romanian printing market
const STANDARD_STEPS = [
    50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 250, 300, 400, 500
];

export const SeoDimensionsLinks: React.FC<SeoDimensionsLinksProps> = ({
    productId,
    productName,
    currentW,
    currentH
}) => {
    // Generate dimension combinations
    const combinations: { w: number, h: number }[] = [];
    STANDARD_STEPS.forEach(w => {
        STANDARD_STEPS.forEach(h => {
            if (w === currentW && h === currentH) return;
            combinations.push({ w, h });
        });
    });

    // Generate Intent links
    const intents = PRODUCT_INTENTS[productId] || [];

    return (
        <section 
            style={{ 
                position: 'absolute', 
                width: '1px', 
                height: '1px', 
                padding: '0', 
                margin: '-1px', 
                overflow: 'hidden', 
                clip: 'rect(0, 0, 0, 0)', 
                whiteSpace: 'nowrap', 
                borderWidth: '0',
                opacity: 0,
                pointerEvents: 'none'
            }}
            aria-hidden="true"
        >
            <h2>Dimensiuni disponibile pentru {productName}</h2>
            <div>
                {combinations.map((comb, idx) => (
                    <Link 
                        key={`dim-${idx}`}
                        href={`/configurator/${productId}-${comb.w}x${comb.h}`}
                    >
                        {productName} {comb.w}x{comb.h} cm
                    </Link>
                ))}
            </div>
            <h2>Proiecte și modele {productName}</h2>
            <div>
                {intents.map((intent, idx) => (
                    <Link 
                        key={`intent-${idx}`}
                        href={`/configurator/${productId}-${intent}`}
                    >
                        {productName} {intent.replace(/-/g, ' ')}
                    </Link>
                ))}
            </div>
        </section>
    );
};
