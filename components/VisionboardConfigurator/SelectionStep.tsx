import React, { useState, useEffect } from 'react';
import { ArrowRight, Smartphone, Monitor, Image as ImageIcon, Flag, FileText, ScrollText, Layers, Square, AppWindow as WindowIcon, Paintbrush, Box, MonitorPlay, Check, Shirt, CreditCard } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface SelectionStepProps {
    onComplete: (config: { orientation: 'landscape' | 'portrait', size: string, product: string }) => void;
}

/** Produsele din editor. `id` trebuie să existe în resolveConfiguratorRoute (exportUtils.ts). */
export const EDITOR_PRODUCTS = [
    { id: 'canvas', label: 'Tablou Canvas', icon: ImageIcon, color: '#10b981', defaultSize: '40x60' },
    { id: 'banner', label: 'Banner Frontlit', icon: Flag, color: '#3b82f6', defaultSize: '200x100' },
    { id: 'banner-verso', label: 'Banner Față-Verso', icon: MonitorPlay, color: '#0891b2', defaultSize: '200x100' },
    { id: 'afise', label: 'Afișe', icon: FileText, color: '#ef4444', defaultSize: '50x70' },
    { id: 'rollup', label: 'Roll-up', icon: ScrollText, color: '#8b5cf6', defaultSize: '85x200' },
    { id: 'flyers', label: 'Flyere', icon: FileText, color: '#ec4899', defaultSize: '10x15' },
    { id: 'pliante', label: 'Pliante', icon: Layers, color: '#f59e0b', defaultSize: '21x30' },
    { id: 'carti-vizita', label: 'Cărți de vizită', icon: CreditCard, color: '#0f172a', defaultSize: '9x5' },
    { id: 'autocolante', label: 'Autocolante', icon: Layers, color: '#ea580c', defaultSize: '30x30' },
    { id: 'window-graphics', label: 'Folie geam', icon: WindowIcon, color: '#06b6d4', defaultSize: '100x100' },
    { id: 'tapet', label: 'Tapet', icon: Paintbrush, color: '#6366f1', defaultSize: '300x250' },
    { id: 'plexiglass', label: 'Plexiglas', icon: Square, color: '#64748b', defaultSize: '40x30' },
    { id: 'forex', label: 'PVC Forex', icon: Box, color: '#94a3b8', defaultSize: '50x70' },
    { id: 'tricouri', label: 'Tricouri', icon: Shirt, color: '#7c3aed', defaultSize: '30x40' },
];

const PREDEFINED_SIZES = [
    { id: '10x15', label: 'A6' },
    { id: '21x30', label: 'A4' },
    { id: '30x42', label: 'A3' },
    { id: '40x60', label: 'Standard' },
    { id: '50x70', label: 'Mare' },
    { id: '70x100', label: 'XL' },
    { id: '100x50', label: 'Banner mic' },
    { id: '200x100', label: 'Banner' },
    { id: '300x100', label: 'Banner mare' },
];

function normalizeProduct(id: string | null): string {
    if (!id) return 'canvas';
    if (id === 'acrylic') return 'plexiglass';
    if (id === 'pvc-forex') return 'forex';
    if (id === 'flayere' || id === 'flyere') return 'flyers';
    return id;
}

export const SelectionStep: React.FC<SelectionStepProps> = ({ onComplete }) => {
    const searchParams = useSearchParams();

    const [product, setProduct] = useState(normalizeProduct(searchParams.get('product')));
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');
    const [w, setW] = useState(searchParams.get('w') || '40');
    const [h, setH] = useState(searchParams.get('h') || '60');
    const [activePreset, setActivePreset] = useState<string | null>(searchParams.get('w') && searchParams.get('h') ? `${searchParams.get('w')}x${searchParams.get('h')}` : '40x60');

    // Dacă vin toți parametrii din URL (de pe pagina unui produs), sărim peste pasul de selecție.
    useEffect(() => {
        const urlW = searchParams.get('w');
        const urlH = searchParams.get('h');
        const urlProduct = normalizeProduct(searchParams.get('product'));

        if (urlW && urlH) {
            setW(urlW);
            setH(urlH);
            setProduct(urlProduct);
            const timer = setTimeout(() => {
                onComplete({
                    orientation: parseInt(urlW) >= parseInt(urlH) ? 'landscape' : 'portrait',
                    size: `${urlW}x${urlH}`,
                    product: urlProduct
                });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [searchParams, onComplete]);

    const applySize = (sizeId: string) => {
        const parts = sizeId.split('x');
        setW(parts[0]);
        setH(parts[1]);
        setActivePreset(PREDEFINED_SIZES.some((p) => p.id === sizeId) ? sizeId : null);
        setOrientation(parseInt(parts[0]) >= parseInt(parts[1]) ? 'landscape' : 'portrait');
    };

    const handleProductSelect = (id: string) => {
        setProduct(id);
        const def = EDITOR_PRODUCTS.find((p) => p.id === id)?.defaultSize;
        if (def) applySize(def);
    };

    const handleInputChange = (type: 'w' | 'h', val: string) => {
        const cleaned = val.replace(/[^\d]/g, '').slice(0, 4);
        if (type === 'w') setW(cleaned); else setH(cleaned);
        const wn = parseInt(type === 'w' ? cleaned : w) || 0;
        const hn = parseInt(type === 'h' ? cleaned : h) || 0;
        setOrientation(wn >= hn ? 'landscape' : 'portrait');
        setActivePreset(null);
    };

    const swapOrientation = (target: 'landscape' | 'portrait') => {
        const wn = parseInt(w) || 0;
        const hn = parseInt(h) || 0;
        if (target === 'landscape' && wn < hn) { setW(String(hn)); setH(String(wn)); }
        if (target === 'portrait' && wn > hn) { setW(String(hn)); setH(String(wn)); }
        setOrientation(target);
    };

    const wn = parseInt(w) || 0;
    const hn = parseInt(h) || 0;
    const valid = wn >= 2 && hn >= 2 && wn <= 1000 && hn <= 1000;
    const activeProduct = EDITOR_PRODUCTS.find((p) => p.id === product) || EDITOR_PRODUCTS[0];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto',
            fontFamily: 'var(--font-outfit), sans-serif'
        }}>
            <div style={{ maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    <h1 className="step-title" style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>Editor online</h1>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.35rem' }}>Alege produsul și dimensiunea, apoi adaugă pozele și textele tale. Prețul îl vezi la final, în configurator.</p>
                </div>

                {/* Pasul 1: produsul */}
                <div>
                    <h2 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center', letterSpacing: '0.15em' }}>
                        1. Ce vrei să printezi?
                    </h2>
                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.6rem' }}>
                        {EDITOR_PRODUCTS.map((p) => {
                            const Icon = p.icon;
                            const active = product === p.id;
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => handleProductSelect(p.id)}
                                    aria-pressed={active}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                                        padding: '0.75rem 0.9rem', borderRadius: '14px', cursor: 'pointer', textAlign: 'left',
                                        border: active ? `2px solid ${p.color}` : '1px solid #e2e8f0',
                                        background: active ? '#f8fafc' : '#ffffff',
                                        color: '#0f172a', fontWeight: active ? 800 : 600, fontSize: '0.85rem',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    <span style={{ width: 32, height: 32, borderRadius: 10, background: `${p.color}1a`, color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={18} />
                                    </span>
                                    <span style={{ flex: 1 }}>{p.label}</span>
                                    {active && <Check size={16} color={p.color} />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Pasul 2: dimensiunea */}
                <div className="dimension-card" style={{
                    background: '#f8fafc', borderRadius: '32px', padding: '2rem', border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem'
                }}>
                    <h2 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>
                        2. Dimensiunea (cm)
                    </h2>

                    <div className="input-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <label htmlFor="editor-w" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Lățime</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="editor-w"
                                    className="dim-input"
                                    type="text"
                                    inputMode="numeric"
                                    value={w}
                                    onChange={(e) => handleInputChange('w', e.target.value)}
                                    style={{ fontSize: '3.5rem', fontWeight: 900, width: '140px', background: 'transparent', border: 'none', borderBottom: `4px solid ${activeProduct.color}`, textAlign: 'center', color: '#0f172a', outline: 'none' }}
                                />
                                <span className="unit-label" style={{ position: 'absolute', bottom: '0.5rem', right: '-1.5rem', fontSize: '1rem', fontWeight: 700, color: '#cbd5e1' }}>cm</span>
                            </div>
                        </div>
                        <div className="multiply-icon" style={{ fontSize: '2rem', fontWeight: 200, color: '#cbd5e1', paddingTop: '1.5rem' }}>×</div>
                        <div style={{ textAlign: 'center' }}>
                            <label htmlFor="editor-h" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Înălțime</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="editor-h"
                                    className="dim-input"
                                    type="text"
                                    inputMode="numeric"
                                    value={h}
                                    onChange={(e) => handleInputChange('h', e.target.value)}
                                    style={{ fontSize: '3.5rem', fontWeight: 900, width: '140px', background: 'transparent', border: 'none', borderBottom: `4px solid ${activeProduct.color}`, textAlign: 'center', color: '#0f172a', outline: 'none' }}
                                />
                                <span className="unit-label" style={{ position: 'absolute', bottom: '0.5rem', right: '-1.5rem', fontSize: '1rem', fontWeight: 700, color: '#cbd5e1' }}>cm</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', background: '#ffffff', padding: '0.4rem', borderRadius: '20px', border: '1px solid #e2e8f0', gap: '0.4rem' }}>
                        <button type="button" onClick={() => swapOrientation('landscape')} className="orientation-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '16px', border: 'none', cursor: 'pointer', background: orientation === 'landscape' ? '#0f172a' : 'transparent', color: orientation === 'landscape' ? 'white' : '#64748b', fontWeight: 700, transition: 'all 0.2s', fontSize: '0.85rem' }}>
                            <Monitor size={16} /> Orizontal
                        </button>
                        <button type="button" onClick={() => swapOrientation('portrait')} className="orientation-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '16px', border: 'none', cursor: 'pointer', background: orientation === 'portrait' ? '#0f172a' : 'transparent', color: orientation === 'portrait' ? 'white' : '#64748b', fontWeight: 700, transition: 'all 0.2s', fontSize: '0.85rem' }}>
                            <Smartphone size={16} /> Vertical
                        </button>
                    </div>

                    <div style={{ width: '100%' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.6rem', textAlign: 'center', letterSpacing: '0.15em' }}>Formate uzuale</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '0.6rem' }}>
                            {PREDEFINED_SIZES.map((preset) => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => applySize(preset.id)}
                                    style={{ padding: '0.75rem 0.5rem', borderRadius: '16px', border: activePreset === preset.id ? '2px solid #ea580c' : '1px solid #e2e8f0', background: activePreset === preset.id ? '#fff7ed' : '#ffffff', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
                                >
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.2rem' }}>{preset.label}</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>{preset.id.replace('x', '×')}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '2rem' }}>
                    {!valid && <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>Introdu o lățime și o înălțime între 2 și 1000 cm.</div>}
                    <button
                        type="button"
                        disabled={!valid}
                        onClick={() => valid && onComplete({ orientation, size: `${wn}x${hn}`, product })}
                        className="cta-btn"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 3rem', border: 'none', borderRadius: '999px', cursor: valid ? 'pointer' : 'not-allowed',
                            background: valid ? '#ea580c' : '#cbd5e1', color: 'white', fontSize: '1.2rem', fontWeight: 900,
                            boxShadow: valid ? '0 20px 40px -10px rgba(234, 88, 12, 0.4)' : 'none',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                    >
                        Începe designul: {activeProduct.label} {wn}×{hn} cm <ArrowRight size={24} />
                    </button>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .step-title { font-size: 1.2rem !important; }
                    .dimension-card { padding: 1.25rem 0.75rem !important; border-radius: 20px !important; }
                    .dim-input { font-size: 2.4rem !important; width: 90px !important; }
                    .unit-label { font-size: 0.8rem !important; right: -1rem !important; }
                    .multiply-icon { font-size: 1.5rem !important; padding-top: 1rem !important; }
                    .orientation-btn { padding: 0.6rem 1rem !important; font-size: 0.75rem !important; }
                    .cta-btn { width: 100% !important; padding: 1.1rem !important; justify-content: center !important; font-size: 1rem !important; }
                    .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
            `}</style>
        </div>
    );
};
