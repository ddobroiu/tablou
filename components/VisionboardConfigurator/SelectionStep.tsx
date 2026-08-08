import React, { useState, useEffect } from 'react';
import { Layout, Check, ArrowRight, Ruler, Maximize, Smartphone, Monitor, Image as ImageIcon, Flag, FileText, ScrollText, Layers, Square, AppWindow as WindowIcon, Paintbrush, Box, MonitorPlay } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface SelectionStepProps {
    onComplete: (config: { orientation: 'landscape' | 'portrait', size: string, product: string }) => void;
}

const PRODUCTS = [
    { id: 'canvas', label: 'Tablou Canvas', icon: ImageIcon, color: '#10b981' },
    { id: 'banner', label: 'Banner Frontlit', icon: Flag, color: '#3b82f6' },
    { id: 'banner-verso', label: 'Banner Față-Verso', icon: MonitorPlay, color: '#0891b2' },
    { id: 'afise', label: 'Afișe HD', icon: FileText, color: '#ef4444' },
    { id: 'rollup', label: 'Sisteme Roll-up', icon: ScrollText, color: '#8b5cf6' },
    { id: 'flyers', label: 'Flyere / Fluturași', icon: FileText, color: '#ec4899' },
    { id: 'pliante', label: 'Pliante / Broșuri', icon: Layers, color: '#f59e0b' },
    { id: 'autocolante', label: 'Autocolante', icon: Layers, color: '#ea580c' },
    { id: 'window-graphics', label: 'Stickere Geam', icon: WindowIcon, color: '#06b6d4' },
    { id: 'tapet', label: 'Tapet Custom', icon: Paintbrush, color: '#6366f1' },
    { id: 'acrylic', label: 'Plexiglass (Acrylic)', icon: Square, color: '#64748b' },
    { id: 'forex', label: 'PVC Forex', icon: Box, color: '#94a3b8' },
];

const PREDEFINED_SIZES = [
    { id: '10x15', label: 'A6', dimensions: '10 × 15 cm' },
    { id: '21x30', label: 'A4', dimensions: '21 × 30 cm' },
    { id: '30x42', label: 'A3', dimensions: '30 × 42 cm' },
    { id: '40x60', label: 'Standard', dimensions: '40 × 60 cm' },
    { id: '50x70', label: 'Mare', dimensions: '50 × 70 cm' },
    { id: '70x100', label: 'XL', dimensions: '70 × 100 cm' },
];

export const SelectionStep: React.FC<SelectionStepProps> = ({ onComplete }) => {
    const searchParams = useSearchParams();
    
    const [product, setProduct] = useState(searchParams.get('product') || 'canvas');
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
    const [w, setW] = useState(searchParams.get('w') || '40');
    const [h, setH] = useState(searchParams.get('h') || '60');
    const [activePreset, setActivePreset] = useState<string | null>(searchParams.get('w') && searchParams.get('h') ? `${searchParams.get('w')}x${searchParams.get('h')}` : '40x60');

    // Auto-complete if all params are present
    useEffect(() => {
        const urlW = searchParams.get('w');
        const urlH = searchParams.get('h');
        const urlProduct = searchParams.get('product');

        if (urlW && urlH) {
            setW(urlW);
            setH(urlH);
            if (urlProduct) setProduct(urlProduct);
            
            // Auto complete after a short delay to allow UI to settle
            const timer = setTimeout(() => {
                onComplete({ 
                    orientation: parseInt(urlW) >= parseInt(urlH) ? 'landscape' : 'portrait', 
                    size: `${urlW}x${urlH}`,
                    product: urlProduct || 'canvas'
                });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchParams, onComplete]);

    const handlePresetSelect = (presetId: string) => {
        const parts = presetId.split('x');
        setW(parts[0]);
        setH(parts[1]);
        setActivePreset(presetId);
        setOrientation(parseInt(parts[0]) >= parseInt(parts[1]) ? 'landscape' : 'portrait');
    };

    const handleInputChange = (type: 'w' | 'h', val: string) => {
        if (type === 'w') {
            setW(val);
            if (parseInt(val) >= parseInt(h)) setOrientation('landscape');
            else setOrientation('portrait');
        } else {
            setH(val);
            if (parseInt(w) >= parseInt(val)) setOrientation('landscape');
            else setOrientation('portrait');
        }
        setActivePreset(null);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto',
            fontFamily: 'var(--font-outfit), sans-serif'
        }}>
            <div style={{
                maxWidth: '1100px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                padding: '1rem 0'
            }}>
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <h2 className="step-title" style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 600 }}>Configurează dimensiunile și începe proiectul</h2>
                </div>

                {/* Paso 2: Custom Dimensions */}
                <div className="dimension-card" style={{
                    background: '#f8fafc',
                    borderRadius: '32px',
                    padding: '2rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem'
                }}>
                    <h2 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        DIMENSIUNI PERSONALIZATE (CM)
                    </h2>
                    
                    <div className="input-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', justifyContent: 'center' }}>
                        {/* Width Input */}
                        <div style={{ textAlign: 'center' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Latime</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    className="dim-input"
                                    type="number" 
                                    value={w} 
                                    onChange={(e) => handleInputChange('w', e.target.value)}
                                    style={{
                                        fontSize: '3.5rem',
                                        fontWeight: 900,
                                        width: '120px',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: `4px solid ${PRODUCTS.find(p => p.id === product)?.color || '#10b981'}`,
                                        textAlign: 'center',
                                        color: '#0f172a',
                                        outline: 'none'
                                    }}
                                />
                                <span className="unit-label" style={{ position: 'absolute', bottom: '0.5rem', right: '-1.5rem', fontSize: '1rem', fontWeight: 700, color: '#cbd5e1' }}>cm</span>
                            </div>
                        </div>

                        {/* Multiply Icon */}
                        <div className="multiply-icon" style={{ fontSize: '2rem', fontWeight: 200, color: '#cbd5e1', paddingTop: '1.5rem' }}>×</div>

                        {/* Height Input */}
                        <div style={{ textAlign: 'center' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Inaltime</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    className="dim-input"
                                    type="number" 
                                    value={h} 
                                    onChange={(e) => handleInputChange('h', e.target.value)}
                                    style={{
                                        fontSize: '3.5rem',
                                        fontWeight: 900,
                                        width: '120px',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: `4px solid ${PRODUCTS.find(p => p.id === product)?.color || '#10b981'}`,
                                        textAlign: 'center',
                                        color: '#0f172a',
                                        outline: 'none'
                                    }}
                                />
                                <span className="unit-label" style={{ position: 'absolute', bottom: '0.5rem', right: '-1.5rem', fontSize: '1rem', fontWeight: 700, color: '#cbd5e1' }}>cm</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        background: '#ffffff', 
                        padding: '0.4rem', 
                        borderRadius: '20px', 
                        border: '1px solid #e2e8f0',
                        gap: '0.4rem'
                    }}>
                        <button 
                            onClick={() => setOrientation('landscape')}
                            className="orientation-btn"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '16px', border: 'none', cursor: 'pointer',
                                background: orientation === 'landscape' ? '#0f172a' : 'transparent',
                                color: orientation === 'landscape' ? 'white' : '#64748b',
                                fontWeight: 700, transition: 'all 0.2s', fontSize: '0.85rem'
                            }}
                        >
                            <Monitor size={16} /> Orizontal
                        </button>
                        <button 
                            onClick={() => setOrientation('portrait')}
                            className="orientation-btn"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '16px', border: 'none', cursor: 'pointer',
                                background: orientation === 'portrait' ? '#0f172a' : 'transparent',
                                color: orientation === 'portrait' ? 'white' : '#64748b',
                                fontWeight: 700, transition: 'all 0.2s', fontSize: '0.85rem'
                            }}
                        >
                            <Smartphone size={16} /> Vertical
                        </button>
                    </div>
                </div>

                {/* Secondary Section: Presets */}
                <div>
                    <h2 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1.25rem', textAlign: 'center', letterSpacing: '0.15em' }}>
                        FORMAT STANDARD
                    </h2>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', 
                        gap: '0.75rem' 
                    }}>
                        {PREDEFINED_SIZES.map((preset) => (
                            <button 
                                key={preset.id}
                                onClick={() => handlePresetSelect(preset.id)}
                                style={{
                                    padding: '1rem 0.5rem',
                                    borderRadius: '20px',
                                    border: activePreset === preset.id ? '2px solid #ea580c' : '1px solid #e2e8f0',
                                    background: activePreset === preset.id ? '#fff7ed' : '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.25rem' }}>{preset.label}</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>{preset.id.replace('x', '×')}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Final Action */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
                    <button 
                        onClick={() => onComplete({ orientation, size: `${w}x${h}`, product })}
                        className="cta-btn"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 3rem', border: 'none', borderRadius: '999px', cursor: 'pointer',
                            background: '#ea580c', color: 'white', fontSize: '1.2rem', fontWeight: 900,
                            boxShadow: '0 20px 40px -10px rgba(234, 88, 12, 0.4)',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                    >
                        Continua <ArrowRight size={24} />
                    </button>
                </div>
            </div>
            
            <style jsx>{`
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type=number] {
                  -moz-appearance: textfield;
                }

                @media (max-width: 768px) {
                    .step-title {
                        font-size: 1.1rem !important;
                    }
                    .dimension-card {
                        padding: 1.5rem 1rem !important;
                    }
                    .dim-input {
                        font-size: 2.5rem !important;
                        width: 80px !important;
                    }
                    .unit-label {
                        font-size: 0.8rem !important;
                        right: -1rem !important;
                    }
                    .multiply-icon {
                        font-size: 1.5rem !important;
                        padding-top: 1rem !important;
                    }
                    .orientation-btn {
                        padding: 0.6rem 1rem !important;
                        font-size: 0.75rem !important;
                    }
                    .cta-btn {
                        width: 100% !important;
                        padding: 1.25rem !important;
                        justify-content: center !important;
                        font-size: 1.1rem !important;
                    }
                }
            `}</style>
        </div>
    );
};
