'use client';

import React, { useState } from 'react';
import { ShoppingCart, Box, Eye, X, Ruler, Check, ArrowRight, PencilRuler } from 'lucide-react';
import Script from 'next/script';
import { ConfigElement } from './Configurator.types';

interface ProductSidebarProps {
    isMobile: boolean;
    showMobileSettings: boolean;
    orientation: 'landscape' | 'portrait';
    setOrientation: (v: 'landscape' | 'portrait') => void;
    size: string;
    setSize: (v: string) => void;
    material: string;
    setMaterial: (v: string) => void;
    viewMode: 'workspace' | '3d';
    setViewMode: (v: 'workspace' | '3d') => void;
    background: string;
    elements: ConfigElement[];
    price: number;
    handleAddToCart: () => void;
    isAdmin: boolean;
    setShowMobileSettings: (v: boolean) => void;
    handleConfigureProduct: () => void;
    isConfiguring: boolean;
}

const PRESET_SIZES = [
    { label: 'A6 (10×15)', value: '10x15' },
    { label: 'A4 (21×30)', value: '21x30' },
    { label: 'A3 (30×42)', value: '30x42' },
    { label: 'Standard (40×60)', value: '40x60' },
    { label: 'Mare (50×70)', value: '50x70' },
    { label: 'XL (70×100)', value: '70x100' },
];

export const ProductSidebar: React.FC<ProductSidebarProps> = ({
    isMobile,
    showMobileSettings,
    orientation,
    setOrientation,
    size,
    setSize,
    material,
    setMaterial,
    viewMode,
    setViewMode,
    background,
    elements,
    price,
    handleAddToCart,
    isAdmin,
    setShowMobileSettings,
    handleConfigureProduct,
    isConfiguring
}) => {
    // Parse current size
    const parts = size.split('x');
    const [customW, setCustomW] = useState(parts[0] || '40');
    const [customH, setCustomH] = useState(parts[1] || '60');
    const [isCustom, setIsCustom] = useState(!PRESET_SIZES.find(p => p.value === size));

    const applyPreset = (preset: string) => {
        setIsCustom(false);
        setSize(preset);
        const p = preset.split('x');
        setCustomW(p[0]);
        setCustomH(p[1]);
    };

    const applyCustom = (w: string, h: string) => {
        const wNum = parseInt(w) || 0;
        const hNum = parseInt(h) || 0;
        setCustomW(w);
        setCustomH(h);
        if (wNum > 0 && hNum > 0) {
            setSize(`${wNum}x${hNum}`);
        }
    };

    const toggleOrientation = () => {
        setOrientation(orientation === 'landscape' ? 'portrait' : 'landscape');
    };

    return (
        <aside style={{
            width: isMobile ? '100%' : '350px',
            height: isMobile ? 'auto' : '100%',
            overflowY: 'auto',
            borderLeft: isMobile ? 'none' : '1px solid var(--border)',
            padding: '1.5rem',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: isMobile ? 1002 : 10,
            position: isMobile ? 'fixed' : 'relative',
            bottom: 0,
            right: 0,
            transform: isMobile && !showMobileSettings ? 'translateY(100%)' : 'none',
            transition: 'transform 0.3s ease-out',
            borderTopLeftRadius: isMobile ? '1rem' : 0,
            borderTopRightRadius: isMobile ? '1rem' : 0,
            boxShadow: isMobile ? '0 -10px 25px -5px rgba(0, 0, 0, 0.1)' : 'none'
        }}>
            {isMobile && (
                <button onClick={() => setShowMobileSettings(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X />
                </button>
            )}

            {/* Product Type / Material Section */}
            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>
                    Selectare Produs
                </label>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.5rem',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    paddingRight: '0.5rem'
                }}>
                    {[
                        { id: 'canvas', label: 'Tablou Canvas' },
                        { id: 'banner', label: 'Banner Frontlit' },
                        { id: 'banner-verso', label: 'Banner Față-Verso' },
                        { id: 'afise', label: 'Afișe HD' },
                        { id: 'rollup', label: 'Sisteme Roll-up' },
                        { id: 'autocolante', label: 'Autocolante' },
                        { id: 'window-graphics', label: 'Stickere Geam' },
                        { id: 'tapet', label: 'Tapet Custom' },
                        { id: 'plexiglass', label: 'Plexiglass (Acrylic)' },
                        { id: 'forex', label: 'PVC Forex' },
                        { id: 'polipropilena', label: 'Placă Polipropilenă' },
                        { id: 'carton', label: 'Placă Carton' },
                        { id: 'carti-vizita', label: 'Cărți de Vizită' },
                        { id: 'tricouri', label: 'Tricouri / Textile' },
                    ].map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setMaterial(p.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '0.875rem 1rem',
                                borderRadius: '12px',
                                border: material === p.id ? '2px solid #f97316' : '1px solid #e2e8f0',
                                background: material === p.id ? '#fff7ed' : '#ffffff',
                                color: material === p.id ? '#ea580c' : '#475569',
                                fontSize: '0.9rem',
                                fontWeight: material === p.id ? 800 : 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left'
                            }}
                        >
                            <span>{p.label}</span>
                            {material === p.id && <Check size={16} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Manual Dimensions Input */}
            <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Dimensiuni Manuale (cm)</label>
                
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>Lățime</span>
                        <input 
                            type="number" 
                            value={customW} 
                            onChange={(e) => applyCustom(e.target.value, customH)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700 }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>Înălțime</span>
                        <input 
                            type="number" 
                            value={customH} 
                            onChange={(e) => applyCustom(customW, e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700 }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Ruler size={14} /> {size.replace('x', ' × ')} cm
                    </div>
                    <button 
                        onClick={toggleOrientation}
                        style={{ border: 'none', background: '#e2e8f0', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', color: '#475569' }}
                    >
                        {orientation === 'landscape' ? 'PORTRET' : 'LANDSCAPE'}
                    </button>
                </div>
            </div>

            {/* Presets Grid */}
            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Predefinite</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {PRESET_SIZES.map((preset) => (
                        <button
                            key={preset.value}
                            onClick={() => applyPreset(preset.value)}
                            style={{
                                padding: '0.5rem 0',
                                fontSize: '10px',
                                fontWeight: 800,
                                borderRadius: '8px',
                                border: size === preset.value ? '2px solid #f97316' : '1px solid #e2e8f0',
                                background: size === preset.value ? '#fff7ed' : '#ffffff',
                                color: size === preset.value ? '#ea580c' : '#64748b',
                                cursor: 'pointer'
                            }}
                        >
                            {preset.label.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={handleConfigureProduct}
                    disabled={isConfiguring}
                    style={{
                        width: '100%',
                        padding: '1.25rem',
                        borderRadius: '20px',
                        background: '#f97316', // Orange
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 900,
                        border: 'none',
                        cursor: isConfiguring ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)',
                        transition: 'all 0.2s',
                        opacity: isConfiguring ? 0.7 : 1
                    }}
                >
                    {isConfiguring ? (
                        <>Pregătire...</>
                    ) : (
                        <>
                            <PencilRuler size={20} />
                            Finalizare
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};
