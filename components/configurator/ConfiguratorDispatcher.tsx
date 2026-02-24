"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { useSearchParams } from 'next/navigation';




interface ConfiguratorDispatcherProps {
    configuratorId: string;
    productSlug?: string;
    productImage?: string;
}

export default function ConfiguratorDispatcher({ configuratorId, productSlug }: ConfiguratorDispatcherProps) {
    const searchParams = useSearchParams();
    const finalSlug = productSlug || searchParams.get('productSlug') || searchParams.get('slug');

    return <div>Configurator invalid sau lipsă slug.</div>;
}
