"use client";

import React from 'react';
import HeroCarousel from '@/components/HeroCarousel';
import MasterConfigurator from '@/components/MasterConfigurator';
import PromoSection from '@/components/PromoSection';
import FAQSection from '@/components/FAQSection';

export default function HomeClient() {
    return (
        <div className="w-full">

            {/* 1. MASTER CONFIGURATOR - PIESA CENTRALĂ */}
            <div className="pt-8 lg:pt-12 pb-0">
                <MasterConfigurator />
            </div>

            {/* 3. HERO */}
            <div className="mb-12">
                <HeroCarousel />
            </div>

            {/* 6. FAQ SECTION */}
            <FAQSection />

            {/* 7. PORTOFOLIU */}
            <PromoSection />
        </div>
    );
}



