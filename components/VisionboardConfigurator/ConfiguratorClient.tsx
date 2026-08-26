'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { LibraryPanel } from './LibraryPanel';
import { ProductSidebar } from './ProductSidebar';
import { Workspace } from './Workspace';
import { MobileNav } from './MobileNav';
import { ContextMenu } from './ContextMenu';
import { useLibrarySearch } from './useLibrarySearch';
import { use3DPreview } from './use3DPreview';
import { useConfigurator } from './useConfigurator';
import { useFileUpload } from './useFileUpload';
import { SelectionStep } from './SelectionStep';
import { captureDesign, uploadToCloudinary, exportSvgWithCut, resolveConfiguratorRoute } from './exportUtils';
import { useRouter, useSearchParams } from 'next/navigation';


export default function ConfiguratorClient() {
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const isAdmin = (session?.user as any)?.role === 'admin';
    const [isMobile, setIsMobile] = useState(false);


    const initMat = searchParams.get('product') || undefined;
    const initW = searchParams.get('w');
    const initH = searchParams.get('h');
    const initSize = (initW && initH) ? `${initW}x${initH}` : undefined;

    const {
        material, setMaterial,
        size, setSize,
        orientation, setOrientation,
        viewMode, setViewMode,
        zoom, setZoom,
        elements,
        background, setBackground,
        activeTool, setActiveTool,
        selectedId, setSelectedId,
        contextMenu,
        workspaceContainerRef,
        price,
        handleAddToCart,
        addElement,
        deleteElement,
        loadTemplate,
        handleDragEnd,
        handleTextChange,
        updateElementStyle,
        duplicateElement,
        bringToFront,
        sendToBack,
        handleContextMenu,
        setContextMenu
    } = useConfigurator(initMat, initSize);
    
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile && viewMode === '3d') {
                setViewMode('workspace');
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [viewMode, setViewMode]);

    // Auto-zoom for mobile to fit workspace
    useEffect(() => {
        if (isMobile) {
            const calculateZoom = () => {
                const workspaceWidth = orientation === 'landscape' ? 600 : 400;
                // Padding 1rem each side (16px * 2 = 32px), plus some safety margin
                const availableWidth = window.innerWidth - 40;
                if (availableWidth > 0) {
                    const newZoom = Math.min(availableWidth / workspaceWidth, 1);
                    setZoom(newZoom);
                }
            };

            calculateZoom();
            // Recalculate on resize (e.g. orientation change on valid mobile implementation)
            window.addEventListener('resize', calculateZoom);
            return () => window.removeEventListener('resize', calculateZoom);
        }
    }, [isMobile, orientation, setZoom]);

    const modelViewerRef = useRef<any>(null);

    const { update3DTexture } = use3DPreview(
        modelViewerRef,
        elements,
        background,
        orientation,
        viewMode,
        size
    );

    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const {
        pixabayQuery, setPixabayQuery,
        pixabayResults, setPixabayResults,
        isSearching,
        pixabayTransparent, setPixabayTransparent,
        pixabayOrientation, setPixabayOrientation,
        pixabayError,
        vectorQuery, setVectorQuery,
        vectorResults, setVectorResults,
        isSearchingVectors,
        vectorError,
        activeLibraryCategory, setActiveLibraryCategory,
        performPixabaySearch,
        handleVectorSearch,
        handleLoadMoreVectors,
        handleLoadMore,
        handlePixabaySearch,
        setVectorPage,
        setPixabayPage
    } = useLibrarySearch(activeTool);

    const {
        fileInputRef,
        bgFileInputRef,
        handleUploadClick,
        handleFileChange,
        handleBgUploadClick,
        handleBgFileChange
    } = useFileUpload(setUploadedImages, setPixabayResults, setActiveTool, setBackground);

    const [showSelection, setShowSelection] = useState(!searchParams.get('product') && !searchParams.get('w'));

    const handleSelectionComplete = (config: { orientation: 'landscape' | 'portrait', size: string, product: string }) => {
        setOrientation(config.orientation);
        setSize(config.size);
        setMaterial(config.product);
        setShowSelection(false);
    };

    const [showMobileSettings, setShowMobileSettings] = useState(false);
    const [isConfiguring, setIsConfiguring] = useState(false);
    const router = useRouter();

    const handleConfigureProduct = async () => {
        try {
            setIsConfiguring(true);

            // Ascunde controalele de editare și revino la vederea 2D înainte de captură
            setSelectedId(null);
            setActiveTool(null);
            if (viewMode !== 'workspace') {
                setViewMode('workspace');
            }
            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            });

            const dataUrl = await captureDesign(workspaceContainerRef, size);
            const uploadUrl = await uploadToCloudinary(dataUrl);

            const parts = size.split('x');
            const w = parts[0]?.trim();
            const h = parts[1]?.trim();
            if (!w || !h || Number(w) <= 0 || Number(h) <= 0) {
                throw new Error('Dimensiunile produsului nu sunt valide.');
            }

            const route = resolveConfiguratorRoute(material);
            const targetUrl = `/configurator/${route}?w=${w}&h=${h}&image=${encodeURIComponent(uploadUrl)}`;

            router.push(targetUrl);
        } catch (err) {
            console.error('Failed to configure:', err);
            const message =
                err instanceof Error && err.message
                    ? err.message
                    : 'A apărut o eroare la salvarea designului. Te rugăm să încerci din nou.';
            alert(message);
        } finally {
            setIsConfiguring(false);
        }
    };

    const handleExportSvgCut = () => {
        try {
            const ws = workspaceContainerRef.current;
            if (!ws) {
                alert("Nu am găsit workspace-ul.");
                return;
            }
            const { svg } = exportSvgWithCut(ws, size, { offsetMm: 2 });
            const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `shopprint-cut-${material}-${size}.svg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e: any) {
            console.error("SVG export failed:", e);
            alert("Exportul SVG a eșuat. Încearcă din nou.");
        }
    };



    const toolPanelStyle: React.CSSProperties = isMobile ? {
        position: 'fixed',
        left: 0,
        bottom: '60px',
        width: '100%',
        height: '50vh',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '1rem',
        zIndex: 19,
        display: (activeTool === 'bg' || activeTool === 'library' || activeTool === 'elements' || activeTool === 'templates' || activeTool === 'upload' || !!selectedId) ? 'flex' : 'none',
        flexDirection: 'column',
        boxShadow: '0 -5px 15px -3px rgba(0,0,0,0.1)',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
    } : {
        position: 'absolute',
        left: '80px',
        top: 0,
        bottom: 0,
        width: '300px',
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '1rem',
        zIndex: 9,
        display: (activeTool === 'bg' || activeTool === 'library' || activeTool === 'elements' || activeTool === 'templates' || activeTool === 'upload' || !!selectedId) ? 'flex' : 'none',
        flexDirection: 'column',
        boxShadow: '10px 0 15px -3px rgba(0,0,0,0.05)'
    };

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', overflow: 'hidden', position: 'relative' }}>
            {showSelection && <SelectionStep onComplete={handleSelectionComplete} />}
            <Script src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" type="module" strategy="afterInteractive" />

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />
            <input
                type="file"
                ref={bgFileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleBgFileChange}
            />

            <Toolbar
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                addElement={addElement}
                isMobile={isMobile}
                onExportSvgCut={handleExportSvgCut}
            />

            <div style={toolPanelStyle}>
                <LibraryPanel
                    activeTool={activeTool}
                    uploadedImages={uploadedImages}
                    addElement={addElement}
                    handleUploadClick={handleUploadClick}

                    vectorQuery={vectorQuery}
                    setVectorQuery={setVectorQuery}
                    handleVectorSearch={handleVectorSearch}
                    isSearchingVectors={isSearchingVectors}
                    vectorResults={vectorResults}
                    handleLoadMoreVectors={handleLoadMoreVectors}
                    vectorError={vectorError}
                    handleBgUploadClick={handleBgUploadClick}
                    background={background}
                    setBackground={setBackground}
                    pixabayQuery={pixabayQuery}
                    setPixabayQuery={setPixabayQuery}
                    handlePixabaySearch={handlePixabaySearch}
                    isSearching={isSearching}
                    pixabayTransparent={pixabayTransparent}
                    setPixabayTransparent={setPixabayTransparent}
                    pixabayOrientation={pixabayOrientation}
                    setPixabayOrientation={setPixabayOrientation}
                    pixabayResults={pixabayResults}
                    handleLoadMore={handleLoadMore}
                    pixabayError={pixabayError}
                    activeLibraryCategory={activeLibraryCategory}
                    setActiveLibraryCategory={setActiveLibraryCategory}
                    performPixabaySearch={performPixabaySearch}
                    setVectorPage={setVectorPage}
                    setPixabayPage={setPixabayPage}

                    setActiveTool={setActiveTool}
                    setSelectedId={setSelectedId}
                />

                {selectedId && (
                    <PropertiesPanel
                        activeTool={activeTool}
                        selectedId={selectedId}
                        elements={elements}
                        updateElementStyle={updateElementStyle}
                        setSelectedId={setSelectedId}
                        setActiveTool={setActiveTool}
                        deleteElement={deleteElement}
                    />
                )}
            </div>

            <Workspace
                orientation={orientation}
                elements={elements}
                background={background}
                viewMode={viewMode}
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
                modelViewerRef={modelViewerRef}
                size={size}
                update3DTexture={update3DTexture}
                workspaceContainerRef={workspaceContainerRef}
            />

            <MobileNav
                isMobile={isMobile}
                setShowMobileSettings={setShowMobileSettings}
                showMobileSettings={showMobileSettings}
            />

            <ProductSidebar
                isMobile={isMobile}
                showMobileSettings={showMobileSettings}
                orientation={orientation}
                setOrientation={setOrientation}
                size={size}
                setSize={setSize}
                material={material}
                setMaterial={setMaterial}
                viewMode={viewMode}
                setViewMode={setViewMode}
                background={background}
                elements={elements}
                price={price}
                handleAddToCart={handleAddToCart}
                isAdmin={isAdmin}
                setShowMobileSettings={setShowMobileSettings}
                handleConfigureProduct={handleConfigureProduct}
                isConfiguring={isConfiguring}
            />

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

            <style jsx>{`
                .tool-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    color: var(--secondary-foreground);
                    margin-bottom: 0.5rem;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .tool-btn:hover, .tool-btn.active {
                    background: var(--secondary);
                    color: var(--primary);
                }
                .element-wrapper:hover .editable-text {
                    border-color: var(--primary) !important;
                }
                .element-wrapper .delete-btn {
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .element-wrapper:hover .delete-btn {
                    opacity: 1;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
