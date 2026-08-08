'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import { CanvasElement } from './CanvasElement';
import { ZoomControls } from './ZoomControls';
import { ConfigElement } from './Configurator.types';

interface WorkspaceProps {
    widthCm: number;
    heightCm: number;
    elements: ConfigElement[];
    background: string;
    zoom: number;
    setZoom: (v: number | ((prev: number) => number)) => void;
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
    setActiveTool: (tool: string | null) => void;
    activeTool: string | null;
    handleDragEnd: (id: string, info: any) => void;
    handleContextMenu: (e: React.MouseEvent, id: string) => void;
    updateElementStyle: (id: string, property: keyof ConfigElement, value: any) => void;
    deleteElement: (id: string) => void;
    handleTextChange: (id: string, newText: string) => void;
    isMobile: boolean;
    workspaceContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const Workspace: React.FC<WorkspaceProps> = ({
    widthCm,
    heightCm,
    elements,
    background,
    zoom,
    setZoom,
    selectedId,
    setSelectedId,
    setActiveTool,
    activeTool,
    handleDragEnd,
    handleContextMenu,
    updateElementStyle,
    deleteElement,
    handleTextChange,
    isMobile,
    workspaceContainerRef
}) => {
    // Determine Pixels Per CM ratio to fit in a reasonable "base" size (e.g. 800px width)
    // Actually, let's just pick a constant scale factor, e.g. 5px per cm?
    // 200cm * 5 = 1000px. That's fine.
    const PX_PER_CM = 5;
    const baseWidth = widthCm * PX_PER_CM;
    const baseHeight = heightCm * PX_PER_CM;

    // Auto-fit Logic
    React.useEffect(() => {
        const calculateZoom = () => {
            const container = workspaceContainerRef.current;
            if (!container) return;

            const containerW = container.clientWidth;
            const containerH = container.clientHeight;

            if (containerW === 0 || containerH === 0) return;

            // Padding calculation (e.g., 40px total)
            const availableW = containerW - 60;
            const availableH = containerH - 60;

            const scaleW = availableW / baseWidth;
            const scaleH = availableH / baseHeight;

            // Fit entirely
            const fitScale = Math.min(scaleW, scaleH);

            // Limit max default zoom to prevent huge banners on big screens? 
            // Or act natural. Let's maximize fit but cap at decent max if very small item.
            // But usually fitScale is perfect.
            // Let's force a minimum gap and a maximum initial zoom if needed.
            // Actually, if it's 200x100cm (1000x500px) and container is 500x500, we need scale 0.5.

            setZoom(fitScale * 0.95); // 95% fit
        };

        // Initial calc
        calculateZoom();

        // Add Resize observer
        const container = workspaceContainerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => {
            calculateZoom();
        });
        observer.observe(container);

        return () => observer.disconnect();
    }, [widthCm, heightCm, setZoom, baseWidth, baseHeight]); // Recalculate if dimensions change


    return (
        <main
            ref={workspaceContainerRef as React.RefObject<HTMLDivElement>}
            onClick={() => { setSelectedId(null); setActiveTool(null); }}
            style={{
                flex: 1,
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden', // Zoom controls handle panning if we implement it, but for now simple center
                width: '100%',
                height: '100%',
                minHeight: '500px'
            }}
        >
            {!isMobile && <ZoomControls zoom={zoom} setZoom={setZoom} isMobile={isMobile} />}

            <div
                style={{
                    width: `${baseWidth}px`,
                    height: `${baseHeight}px`,
                    aspectRatio: `${widthCm} / ${heightCm}`,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center',
                    background: background.startsWith('data:') || background.startsWith('http') ? `url(${background})` : background,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'all 0.2s ease-out', // Changed to all for width/height anims too
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '0',
                    border: '2px dashed #94a3b8',
                    flexShrink: 0
                }}
            >
                {elements.length === 0 && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#cbd5e1', textAlign: 'center', pointerEvents: 'none' }}>
                        <Settings size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <div>Spațiu de Lucru</div>
                        <div style={{ fontSize: '0.875rem' }}>Folosește meniul din stânga</div>
                    </div>
                )}

                {elements.map((el, index) => (
                    <CanvasElement
                        key={el.id}
                        el={el}
                        index={index}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        setActiveTool={setActiveTool}
                        handleDragEnd={handleDragEnd}
                        handleContextMenu={handleContextMenu}
                        updateElementStyle={updateElementStyle}
                        deleteElement={deleteElement}
                        handleTextChange={handleTextChange}
                        isMobile={isMobile}
                    />
                ))}
            </div>
        </main >
    );
};
