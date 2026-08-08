'use client';

import React from 'react';
import { Box, ShoppingCart } from 'lucide-react';

interface MobileNavProps {
    isMobile: boolean;
    setShowMobileSettings: (v: boolean) => void;
    showMobileSettings: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
    isMobile,
    setShowMobileSettings,
    showMobileSettings
}) => {
    if (!isMobile) return null;

    return (
        <>
            {/* Floating Settings/Order Button (Top Right) */}
            <button
                onClick={() => setShowMobileSettings(true)}
                style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: '#f97316', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '99px',
                    boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)', border: 'none',
                    zIndex: 40, fontWeight: 900, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px'
                }}
            >
                <ShoppingCart size={18} /> Produs & Finalizare
            </button>

            {/* Overlay for Settings */}
            {showMobileSettings && (
                <div
                    onClick={() => setShowMobileSettings(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
                />
            )}
        </>
    );
};
