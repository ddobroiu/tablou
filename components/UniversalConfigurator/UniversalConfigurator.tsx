'use client';

import React, { useEffect, useState } from 'react';
import { useUniversalConfigurator } from './useUniversalConfigurator';
import { Workspace } from './Workspace';
import { Toolbar } from './Toolbar';
import { LibraryPanel } from './LibraryPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { ContextMenu } from './ContextMenu';
import { useFileUpload } from './useFileUpload';
import { useLibrarySearch } from './useLibrarySearch';

interface UniversalConfiguratorProps {
    widthCm: number;
    heightCm: number;
    initialImage?: string; // Optional predefined image
    onUpdate?: (data: { elements: any[], snapshot?: string }) => void;
    className?: string;
}

export default function UniversalConfigurator({
    widthCm,
    heightCm,
    initialImage,
    onUpdate,
    className
}: UniversalConfiguratorProps) {
    const {
        elements, setElements,
        zoom, setZoom,
        background, setBackground,
        activeTool, setActiveTool,
        selectedId, setSelectedId,
        contextMenu, setContextMenu,
        workspaceContainerRef,
        addElement,
        deleteElement,
        handleDragEnd,
        handleTextChange,
        updateElementStyle,
        duplicateElement,
        bringToFront,
        sendToBack,
        handleContextMenu
    } = useUniversalConfigurator('canvas', `${widthCm}x${heightCm}`);

    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    // Initial Image Handling
    useEffect(() => {
        if (initialImage) {
            // Add as background or image element?
            // Usually background for banners if it's a template, or image element if it's a "sketch".
            // Let's assume background for now, or add as locked image.
            addElement('image', initialImage);
        }
    }, [initialImage]);

    // Mobile Check
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Hooks
    const librarySearch = useLibrarySearch(activeTool);
    const fileUpload = useFileUpload(
        (fn) => setUploadedImages(fn),
        librarySearch.setPixabayResults,
        setActiveTool,
        setBackground
    );

    // Notify parent on update (debounce?)
    useEffect(() => {
        if (onUpdate) {
            const timeout = setTimeout(() => {
                onUpdate({ elements });
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [elements, onUpdate]);

    return (
        <div className={`flex flex-col md:flex-row h-full w-full bg-slate-50 dark:bg-slate-800 relative overflow-hidden border border-slate-200 rounded-xl ${className}`}>

            {/* Hidden Inputs for Uploads */}
            <input type="file" ref={fileUpload.fileInputRef} onChange={fileUpload.handleFileChange} className="hidden" accept="image/*" />
            <input type="file" ref={fileUpload.bgFileInputRef} onChange={fileUpload.handleBgFileChange} className="hidden" accept="image/*" />

            {/* TOOLBAR */}
            <Toolbar
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                addElement={addElement}
                isMobile={isMobile}
            />

            {/* PANELS (Library or Properties) */}
            {(activeTool || selectedId) && (
                <div
                    className={`
                        z-30 bg-white border-r border-slate-200 shadow-xl
                        ${isMobile
                            ? 'fixed inset-x-0 bottom-[60px] top-[100px] border-t border-slate-200 rounded-t-2xl'
                            : 'w-[320px] relative flex shadow-none'
                        }
                    `}
                >
                    <div className="flex flex-col h-full w-full p-4 overflow-hidden">
                        {/* PROPERTIES PANEL (Priority if selected) */}
                        {selectedId ? (
                            <PropertiesPanel
                                activeTool={activeTool || (elements.find(e => e.id === selectedId)?.type === 'text' ? 'edit-text' : 'edit-image')}
                                selectedId={selectedId}
                                elements={elements}
                                updateElementStyle={updateElementStyle}
                                setSelectedId={setSelectedId}
                                deleteElement={deleteElement}
                                setActiveTool={setActiveTool}
                            />
                        ) : (
                            /* LIBRARY PANEL */
                            <LibraryPanel
                                activeTool={activeTool}
                                uploadedImages={uploadedImages}
                                addElement={addElement}
                                {...librarySearch}
                                {...fileUpload}
                                background={background}
                                setBackground={setBackground}
                                setActiveTool={setActiveTool}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* WORKSPACE */}
            <Workspace
                widthCm={widthCm}
                heightCm={heightCm}
                elements={elements}
                background={background}
                zoom={zoom}
                setZoom={setZoom}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                setActiveTool={setActiveTool}
                activeTool={activeTool}
                handleDragEnd={handleDragEnd}
                handleContextMenu={handleContextMenu}
                updateElementStyle={updateElementStyle}
                deleteElement={deleteElement}
                handleTextChange={handleTextChange}
                isMobile={isMobile}
                workspaceContainerRef={workspaceContainerRef}
            />

            {/* CONTEXT MENU */}
            <ContextMenu
                visible={contextMenu.visible}
                x={contextMenu.x}
                y={contextMenu.y}
                elementId={contextMenu.elementId}
                duplicateElement={duplicateElement}
                bringToFront={bringToFront}
                sendToBack={sendToBack}
                deleteElement={deleteElement}
                onClose={() => setContextMenu({ ...contextMenu, visible: false })}
                isMobile={isMobile}
            />

            {/* Mobile Toolbar Spacer if needed? No, fixed toolbar handles it. */}
        </div>
    );
}
