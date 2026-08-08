"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Download, FileImage, LayoutTemplate, Settings2, RefreshCw, Move, Type, Trash2, Plus, GripHorizontal } from "lucide-react";
import { jsPDF } from "jspdf";
import { v4 as uuidv4 } from "uuid";

type TextElement = {
    id: string;
    text: string;
    x: number; // in cm relative to core center
    y: number; // in cm relative to core center
    size: number; // in cm
    color: string;
};

export default function EditareMaterialePage() {
    // Media
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string>("");
    
    // Dimensiuni in cm - default: 100x50 cu 3 oglinda si 1 simpla (margine alba)
    const [widthCm, setWidthCm] = useState<number>(100);
    const [heightCm, setHeightCm] = useState<number>(50);
    const [tivOglindaCm, setTivOglindaCm] = useState<number>(3);
    const [tivSimpluCm, setTivSimpluCm] = useState<number>(1);
    const [showFoldMarks, setShowFoldMarks] = useState<boolean>(true);
    
    // Produs si Nume
    const [selectedProduct, setSelectedProduct] = useState<string>("Banner");
    const [thickness, setThickness] = useState<string>("");
    const [orderName, setOrderName] = useState<string>("");

    // Imagine (x,y in cm fata de centrul core-ului, scale=1 -> latimea imaginii e egala cu latimea core-ului)
    const [imgPos, setImgPos] = useState({ x: 0, y: 0, scale: 1 });
    
    // Texte
    const [texts, setTexts] = useState<TextElement[]>([]);
    
    // Status
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const originalImgRef = useRef<HTMLImageElement | null>(null);
    
    // Interaction
    const [draggingElem, setDraggingElem] = useState<'image' | string | null>(null);
    const [dragStart, setDragStart] = useState({ startX: 0, startY: 0, initialPosX: 0, initialPosY: 0 });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                const src = event.target?.result as string;
                setImageSrc(src);
                
                const img = new window.Image();
                img.onload = () => {
                    originalImgRef.current = img;
                    // Reset position and scale
                    setImgPos({ x: 0, y: 0, scale: 1 });
                    generatePreview();
                };
                img.src = src;
            };
            reader.readAsDataURL(file);
        }
    };

    const addText = () => {
        setTexts([...texts, {
            id: uuidv4(),
            text: "Text Nou",
            x: 0, 
            y: 0, 
            size: 10, // 10 cm inaltime
            color: "#000000"
        }]);
    };

    const updateText = (id: string, updates: Partial<TextElement>) => {
        setTexts(texts.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const removeText = (id: string) => {
        setTexts(texts.filter(t => t.id !== id));
    };

    // Apelata la incarcare si la modificare setari
    useEffect(() => {
        if (originalImgRef.current) {
            generatePreview();
        }
    }, [widthCm, heightCm, tivOglindaCm, tivSimpluCm, imgPos, texts, showFoldMarks]);


    const renderToContext = (
        mainCtx: CanvasRenderingContext2D, 
        basePxPerCm: number, 
        offscreenCanvas: HTMLCanvasElement
    ) => {
        if (!originalImgRef.current) return;
        
        const img = originalImgRef.current;
        
        // --- 1. PREGATESTE OFFSCREEN CANVAS (Doar nucleul) ---
        const corePw = widthCm * basePxPerCm;
        const corePh = heightCm * basePxPerCm;
        offscreenCanvas.width = corePw;
        offscreenCanvas.height = corePh;
        const offCtx = offscreenCanvas.getContext("2d");
        if (!offCtx) return;

        // Bg la core (optional pt imagini cu transparenta)
        offCtx.fillStyle = "#ffffff";
        offCtx.fillRect(0, 0, corePw, corePh);

        // Deseneaza imaginea
        offCtx.save();
        offCtx.translate(corePw / 2, corePh / 2); // Originea e centrul

        const drawWidth = corePw * imgPos.scale;
        const drawHeight = (img.height / img.width) * drawWidth;
        const imgPxX = imgPos.x * basePxPerCm;
        const imgPxY = imgPos.y * basePxPerCm;

        offCtx.drawImage(
            img, 
            (imgPxX) - drawWidth / 2, 
            (imgPxY) - drawHeight / 2, 
            drawWidth, 
            drawHeight
        );

        offCtx.restore();

        // --- 2. COMPOSE PE MAIN CANVAS ---
        const totalW = widthCm + 2 * (tivOglindaCm + tivSimpluCm);
        const totalH = heightCm + 2 * (tivOglindaCm + tivSimpluCm);
        mainCtx.canvas.width = totalW * basePxPerCm;
        mainCtx.canvas.height = totalH * basePxPerCm;

        // Background / Marginea simpla alba
        mainCtx.fillStyle = "#ffffff";
        mainCtx.fillRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);

        // Pozitii de translatie pentru Mirror
        const tpxSimp = tivSimpluCm * basePxPerCm;
        const tpxOgl = tivOglindaCm * basePxPerCm;
        const coreX = tpxSimp + tpxOgl;
        const coreY = tpxSimp + tpxOgl;

        mainCtx.save();
        
        // Desenam marginile oglinda din offscreenCanvas folosind un pattern similar celui anterior
        const drawMirrors = () => {
            mainCtx.save();

            // TOP
            mainCtx.save();
            mainCtx.translate(0, coreY);
            mainCtx.scale(1, -1);
            mainCtx.drawImage(offscreenCanvas, 0, 0, corePw, tpxOgl, coreX, 0, corePw, tpxOgl);
            mainCtx.restore();

            // BOTTOM
            mainCtx.save();
            mainCtx.translate(0, coreY + corePh + coreY);
            mainCtx.scale(1, -1);
            mainCtx.drawImage(offscreenCanvas, 0, corePh - tpxOgl, corePw, tpxOgl, coreX, coreY - tpxOgl, corePw, tpxOgl); // translated
            mainCtx.restore();

            // LEFT
            mainCtx.save();
            mainCtx.translate(coreX, 0);
            mainCtx.scale(-1, 1);
            mainCtx.drawImage(offscreenCanvas, 0, 0, tpxOgl, corePh, 0, coreY, tpxOgl, corePh);
            mainCtx.restore();

            // RIGHT
            mainCtx.save();
            mainCtx.translate(coreX + corePw + coreX, 0);
            mainCtx.scale(-1, 1);
            mainCtx.drawImage(offscreenCanvas, corePw - tpxOgl, 0, tpxOgl, corePh, coreX - tpxOgl, coreY, tpxOgl, corePh);
            mainCtx.restore();

            // CORNERS 
            // TL
            mainCtx.save();
            mainCtx.translate(coreX, coreY);
            mainCtx.scale(-1, -1);
            mainCtx.drawImage(offscreenCanvas, 0, 0, tpxOgl, tpxOgl, 0, 0, tpxOgl, tpxOgl);
            mainCtx.restore();
            // TR
            mainCtx.save();
            mainCtx.translate(coreX + corePw + coreX, coreY);
            mainCtx.scale(-1, -1);
            mainCtx.drawImage(offscreenCanvas, corePw - tpxOgl, 0, tpxOgl, tpxOgl, coreX - tpxOgl, 0, tpxOgl, tpxOgl);
            mainCtx.restore();
            // BL
            mainCtx.save();
            mainCtx.translate(coreX, coreY + corePh + coreY);
            mainCtx.scale(-1, -1);
            mainCtx.drawImage(offscreenCanvas, 0, corePh - tpxOgl, tpxOgl, tpxOgl, 0, coreY - tpxOgl, tpxOgl, tpxOgl);
            mainCtx.restore();
            // BR
            mainCtx.save();
            mainCtx.translate(coreX + corePw + coreX, coreY + corePh + coreY);
            mainCtx.scale(-1, -1);
            mainCtx.drawImage(offscreenCanvas, corePw - tpxOgl, corePh - tpxOgl, tpxOgl, tpxOgl, coreX - tpxOgl, coreY - tpxOgl, tpxOgl, tpxOgl);
            mainCtx.restore();

            mainCtx.restore();
        };

        if (tivOglindaCm > 0) {
            drawMirrors();
        }

        // Desenam Core-ul
        mainCtx.drawImage(offscreenCanvas, coreX, coreY);

        // Desenam ghidajele de pliere (active)
        
        // 1. Linia de pliere (unde se indoaie panza pe sașiu, la fix marginea oglinzii/baza)
        // mainCtx.strokeStyle = "rgba(0, 255, 0, 0.7)"; // Verde discret pt pliere
        // mainCtx.setLineDash([10, 10]);
        // mainCtx.lineWidth = Math.max(2, basePxPerCm * 0.1); 
        // mainCtx.strokeRect(coreX, coreY, corePw, corePh);
        
        // 2. Linia neagra la exteriorul oglinzii (unde incepe albul) - doar daca vrei si asta
        /*
        if (tivSimpluCm > 0) {
            mainCtx.strokeStyle = "rgba(0, 0, 0, 0.5)"; 
            mainCtx.setLineDash([5, 5]);
            mainCtx.strokeRect(coreX - tpxOgl, coreY - tpxOgl, corePw + 2*tpxOgl, corePh + 2*tpxOgl);
        }
        */

        mainCtx.setLineDash([]);

        if (showFoldMarks) {
            mainCtx.save();
            mainCtx.strokeStyle = "#000000";
            mainCtx.fillStyle = "#000000";
            mainCtx.lineWidth = Math.max(1.5, basePxPerCm * 0.04);
            
            // Săgețile vor fi desenate chiar pe linia de pliere (colțurile core-ului)
            const aLen = basePxPerCm * 0.7; // lungime de 0.7cm
            const aHead = basePxPerCm * 0.2; // cap de 0.2cm
            
            // Săgeată verticală spre coordonata x,y 
            const drawVArrow = (x: number, y: number, dir: -1|1) => {
                mainCtx.beginPath();
                mainCtx.moveTo(x, y - dir * aLen);
                mainCtx.lineTo(x, y); // linia pana la punct
                mainCtx.lineTo(x - aHead * 0.7, y - dir * aHead * 0.7); // latura stanga
                mainCtx.moveTo(x, y);
                mainCtx.lineTo(x + aHead * 0.7, y - dir * aHead * 0.7); // latura dreapta
                mainCtx.stroke();
            };
            
            // Săgeată orizontală spre coordonata x,y
            const drawHArrow = (x: number, y: number, dir: -1|1) => {
                mainCtx.beginPath();
                mainCtx.moveTo(x - dir * aLen, y);
                mainCtx.lineTo(x, y); // linia pana la punct
                mainCtx.lineTo(x - dir * aHead * 0.7, y - aHead * 0.7); // latura sus
                mainCtx.moveTo(x, y);
                mainCtx.lineTo(x - dir * aHead * 0.7, y + aHead * 0.7); // latura jos
                mainCtx.stroke();
            };

            // Top-Left (dir: 1 inseamna ca sageata e PESTE punct si coboara/vine dinspre exterior stanga spre core)
            drawVArrow(coreX, coreY, -1); // de sus in jos (sageata pozitionata in tiv)
            drawHArrow(coreX, coreY, -1); // de la stanga la dreapta
            
            // Top-Right
            drawVArrow(coreX + corePw, coreY, -1); 
            drawHArrow(coreX + corePw, coreY, 1);
            
            // Bottom-Left
            drawVArrow(coreX, coreY + corePh, 1);
            drawHArrow(coreX, coreY + corePh, -1);
            
            // Bottom-Right
            drawVArrow(coreX + corePw, coreY + corePh, 1);
            drawHArrow(coreX + corePw, coreY + corePh, 1);
            
            mainCtx.restore();
        }
        
        // Desenam Textele la FINAL, deasupra la orice!
        // Coordonatele lor sunt X,Y in CM relativ la centrul Core-ului.
        const centerCorePxX = coreX + corePw / 2;
        const centerCorePxY = coreY + corePh / 2;
        
        mainCtx.textAlign = "center";
        mainCtx.textBaseline = "middle";
        texts.forEach(t => {
            mainCtx.font = `bold ${t.size * basePxPerCm}px Arial`;
            mainCtx.fillStyle = t.color;
            mainCtx.fillText(
                t.text, 
                centerCorePxX + (t.x * basePxPerCm), 
                centerCorePxY + (t.y * basePxPerCm)
            );
        });

        mainCtx.restore();
    };

    const generatePreview = () => {
        if (!canvasRef.current || !originalImgRef.current) return;
        
        const maxWidth = 1000;
        const totalW = widthCm + 2 * (tivOglindaCm + tivSimpluCm);
        const pxPerCm = maxWidth / totalW; // Display px mapping

        const mainCtx = canvasRef.current.getContext("2d");
        const offCanvas = document.createElement("canvas");
        
        if (mainCtx) {
            renderToContext(mainCtx, pxPerCm, offCanvas);
            setPreviewUrl(canvasRef.current.toDataURL("image/jpeg", 0.8));
        }
    };

    // DRAG LOGIC pe Preview
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        
        const imgElement = e.currentTarget.querySelector('img');
        if (!imgElement) return;

        const rect = imgElement.getBoundingClientRect();
        
        // Verifica daca clickul e in afara imaginii
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            return; // Nu seta nimic daca da click afara imaginii
        }

        const clickXPx = e.clientX - rect.left;
        const clickYPx = e.clientY - rect.top;

        const totalW = widthCm + 2 * (tivOglindaCm + tivSimpluCm);
        const totalH = heightCm + 2 * (tivOglindaCm + tivSimpluCm);
        
        const cmPerPxPreview = totalW / rect.width;
        
        const clickXCm = clickXPx * cmPerPxPreview;
        const clickYCm = clickYPx * cmPerPxPreview;
        
        // Coordonatele X, Y ale textului și ale imaginii sunt relative la centrul Nucleului (Core).
        // Centrul Core-ului pe ecran/totalitate (în CM) este efectiv centrul imaginii totale, 
        // fiindcă marginile adăugate (oglindă+simplă) se adaugă simetric.
        const centerXCm = totalW / 2;
        const centerYCm = totalH / 2;

        const mapToCenterCmX = clickXCm - centerXCm;
        const mapToCenterCmY = clickYCm - centerYCm;

        // Hit text: parcurgem text invers pentru a agăța elementul de deasupra
        let hitTextId = null;
        let initialTextX = 0;
        let initialTextY = 0;

        for (let i = texts.length - 1; i >= 0; i--) {
            const t = texts[i];
            // Aproximare bounding box: latime baza pe lungimea text * mărime, inaltime = mărime
            const approxW = t.size * t.text.length * 0.55; 
            const approxH = t.size;

            if (
                mapToCenterCmX >= t.x - approxW / 2 &&
                mapToCenterCmX <= t.x + approxW / 2 &&
                mapToCenterCmY >= t.y - approxH / 2 &&
                mapToCenterCmY <= t.y + approxH / 2
            ) {
                hitTextId = t.id;
                initialTextX = t.x;
                initialTextY = t.y;
                break;
            }
        }

        if (hitTextId) {
            setDraggingElem(hitTextId);
            setDragStart({ 
                startX: e.clientX, 
                startY: e.clientY, 
                initialPosX: initialTextX, 
                initialPosY: initialTextY 
            });
        } else {
            // Tragem imaginea de fundal
            setDraggingElem('image');
            setDragStart({ 
                startX: e.clientX, 
                startY: e.clientY, 
                initialPosX: imgPos.x, 
                initialPosY: imgPos.y 
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!draggingElem) return;

        const imgElement = e.currentTarget.querySelector('img');
        const imgWidth = imgElement ? imgElement.getBoundingClientRect().width : 300;
        const totalW = widthCm + 2 * (tivOglindaCm + tivSimpluCm);
        const displayScaleFactor = totalW / imgWidth;

        const dxPx = e.clientX - dragStart.startX;
        const dyPx = e.clientY - dragStart.startY;

        const dxCm = dxPx * displayScaleFactor;
        const dyCm = dyPx * displayScaleFactor;

        if (draggingElem === 'image') {
            setImgPos({
                ...imgPos,
                x: dragStart.initialPosX + dxCm,
                y: dragStart.initialPosY + dyCm,
            });
        } else {
            updateText(draggingElem, {
                x: dragStart.initialPosX + dxCm,
                y: dragStart.initialPosY + dyCm,
            });
        }
    };

    const handleMouseUp = () => {
        setDraggingElem(null);
    };


    const handleExportPDF = async () => {
        if (!originalImgRef.current) return;
        setIsGenerating(true);

        try {
            // Hi-Res Export: 150 DPI by default
            let dpi = 150;
            let pxPerCm = dpi / 2.54; 

            const totalWidthCm = widthCm + 2 * (tivOglindaCm + tivSimpluCm);
            const totalHeightCm = heightCm + 2 * (tivOglindaCm + tivSimpluCm);

            // Ajustare dinamica rezolutie pentru marimi foarte mari (prevenire crash canvas in browser)
            // Limitele sigure de memorie:
            const MAX_DIM = 12000; // Chrome limit e ~16000, 12000 e f sigur.
            const MAX_AREA = 80000000; // max px total pt stabilitate de generare 80MP
            
            let eW = totalWidthCm * pxPerCm;
            let eH = totalHeightCm * pxPerCm;
            let currentDpiDownscaled = false;

            if (eW > MAX_DIM || eH > MAX_DIM) {
                const ratio = MAX_DIM / Math.max(eW, eH);
                pxPerCm *= ratio;
                currentDpiDownscaled = true;
            }

            eW = totalWidthCm * pxPerCm;
            eH = totalHeightCm * pxPerCm;

            if (eW * eH > MAX_AREA) {
                const ratio = Math.sqrt(MAX_AREA / (eW * eH));
                pxPerCm *= ratio;
                currentDpiDownscaled = true;
            }
            
            if (currentDpiDownscaled) {
                console.log(`DPI downscaled automat la ${Math.round(pxPerCm * 2.54)} DPI pentru a preveni erori la export.`);
            }

            const exportCanvas = document.createElement("canvas");
            const exportCtx = exportCanvas.getContext("2d");
            const offCanvas = document.createElement("canvas");

            if(exportCtx) {
                // Desenam full res pe canvas-ul acesta generat on the fly
                renderToContext(exportCtx, pxPerCm, offCanvas);

                // Optimizare generare imagine la export
                const imgData = exportCanvas.toDataURL("image/jpeg", 0.90);

                const orientation = totalWidthCm > totalHeightCm ? 'l' : 'p';
                const pdf = new jsPDF({
                    orientation: orientation,
                    unit: 'cm',
                    format: [totalWidthCm, totalHeightCm],
                    compress: true
                });

                pdf.addImage(imgData, 'JPEG', 0, 0, totalWidthCm, totalHeightCm, undefined, 'FAST');

                const thickStr = thickness.trim() ? `${thickness.trim()}_` : '';
                // Pastram doar alfanumeric pentru nume sigure
                const finalOrderName = orderName.trim() ? orderName.trim().replace(/[^a-zA-Z0-9]/g, '_') : 'lucrare';
                const finalFilename = `${selectedProduct.replace(/\s+/g, '')}_${thickStr}${widthCm}x${heightCm}cm_${finalOrderName}.pdf`;

                pdf.save(finalFilename);
            }

        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Memorie insuficientă în browser! Te rugăm să reduci dimensiunea sau DPI-ul (refresh la pagină).");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Studio Prepress & Editare</h1>
                <p className="text-slate-500 mt-2 font-medium">Panou complet: Liniament cut/fold dinamic, inserare text cu font nativ, oglindire a imaginii și repoziționare drag-and-drop.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* SETARI PANEL (Stanga) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-800">
                            <Settings2 className="text-emerald-500" size={20} />
                            Dimensiuni & Margini
                        </h2>

                        <div className="space-y-5">
                            {/* NEW ORDER INFO */}
                            <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-4 mb-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Cine e Clientul? / Nume Comandă</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: comanda 3"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-300" 
                                        value={orderName} 
                                        onChange={(e) => setOrderName(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Produs</label>
                                        <select 
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={selectedProduct}
                                            onChange={(e) => setSelectedProduct(e.target.value)}
                                        >
                                            <option value="Banner">Banner</option>
                                            <option value="Canvas">Canvas</option>
                                            <option value="Autocolant">Autocolant</option>
                                            <option value="Pvc">PVC / Forex</option>
                                            <option value="Plexic">Plexiglas</option>
                                            <option value="Alucobond">Alucobond</option>
                                            <option value="Carton">Carton</option>
                                            <option value="Hartie">Afiș / Hârtie</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Grosime</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: 3mm (Opțional)"
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-300" 
                                            value={thickness} 
                                            onChange={(e) => setThickness(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Fundal Imagine (JPG/PNG)</label>
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-emerald-300 rounded-xl cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-2">
                                        <Upload className="w-6 h-6 text-emerald-500 mb-1" />
                                        <p className="text-xs font-semibold text-emerald-700">Apasă pentru upload</p>
                                        {imageName && <p className="text-[10px] text-emerald-600 font-medium px-2 truncate max-w-full">{imageName}</p>}
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Lățime Bază (cm)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 outline-none" 
                                        value={widthCm} 
                                        onChange={(e) => setWidthCm(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Înălțime Bază (cm)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 outline-none" 
                                        value={heightCm} 
                                        onChange={(e) => setHeightCm(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Tiv Oglindă (cm)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm text-indigo-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                                        value={tivOglindaCm} 
                                        onChange={(e) => setTivOglindaCm(Number(e.target.value))}
                                    />
                                    <p className="text-[9px] text-slate-400 mt-1">Marginea clonată.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Margine Albă (cm)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 font-bold focus:ring-2 focus:ring-zinc-400 outline-none" 
                                        value={tivSimpluCm} 
                                        onChange={(e) => setTivSimpluCm(Number(e.target.value))}
                                    />
                                    <p className="text-[9px] text-slate-400 mt-1">Extra margine pentru fixare/sasiu. Va contine liniile negre.</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="showFoldMarks"
                                    checked={showFoldMarks}
                                    onChange={(e) => setShowFoldMarks(e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                                />
                                <label htmlFor="showFoldMarks" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                                    Afișează Săgețile de Pliere
                                </label>
                            </div>
                            
                            {/* IMAGINE ZOOM CONTROLS */}
                            {imageSrc && (
                                <div className="pt-4 border-t border-slate-100">
                                    <label className="block text-xs font-bold text-slate-700 mb-2 flex justify-between">
                                        <span>Zoom Imagine</span>
                                        <span className="text-emerald-600">{(imgPos.scale * 100).toFixed(0)}%</span>
                                    </label>
                                    <input 
                                        type="range"
                                        min="0.1" 
                                        max="3" 
                                        step="0.05"
                                        value={imgPos.scale}
                                        onChange={(e) => setImgPos({...imgPos, scale: Number(e.target.value)})}
                                        className="w-full accent-emerald-500"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><Move size={10} /> Trageți imaginea făcând click pe previzualizare în dreapta.</p>
                                </div>
                            )}

                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                <Type className="text-blue-500" size={20} />
                                Adaugă Text
                            </h2>
                            <button onClick={addText} className="text-xs bg-blue-100 text-blue-700 flex flex-center items-center gap-1 px-3 py-1.5 rounded-full font-bold hover:bg-blue-200 transition-colors">
                                <Plus size={14} /> Text
                            </button>
                        </div>

                        <div className="space-y-4">
                            {texts.length === 0 && <p className="text-xs text-slate-400">Niciun text adăugat. Textele sunt trasate HD direct în print.</p>}
                            {texts.map((t, index) => (
                                <div key={t.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl relative group">
                                    <button onClick={() => removeText(t.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors p-1">
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="space-y-3">
                                        <div>
                                            <input 
                                                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-bold w-[calc(100%-24px)]" 
                                                value={t.text}
                                                onChange={(e) => updateText(t.id, {text: e.target.value})}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-[10px] uppercase font-bold text-slate-500">Mărime(cm)</label>
                                                <input type="number" value={t.size} onChange={(e) => updateText(t.id, {size: Number(e.target.value)})} className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] uppercase font-bold text-slate-500">Culoare</label>
                                                <input type="color" value={t.color} onChange={(e) => updateText(t.id, {color: e.target.value})} className="w-full h-[26px] bg-white border border-slate-300 rounded cursor-pointer" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 bg-slate-200 p-1.5 rounded-lg items-center">
                                            <GripHorizontal size={14} className="text-slate-400 ml-1" />
                                            <div className="flex-1 flex items-center gap-1">
                                                <span className="text-[10px] font-bold">X:</span>
                                                <input type="number" value={t.x} onChange={(e) => updateText(t.id, {x: Number(e.target.value)})} className="w-full bg-white border border-slate-300 rounded px-1 py-0.5 text-xs text-center" />
                                            </div>
                                            <div className="flex-1 flex items-center gap-1">
                                                <span className="text-[10px] font-bold">Y:</span>
                                                <input type="number" value={t.y} onChange={(e) => updateText(t.id, {y: Number(e.target.value)})} className="w-full bg-white border border-slate-300 rounded px-1 py-0.5 text-xs text-center" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {(imageSrc || texts.length > 0) && (
                        <button
                            onClick={handleExportPDF}
                            disabled={isGenerating}
                            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-emerald-600 shadow-xl shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
                            {isGenerating ? "SE GENEREAZĂ PDF HD..." : "EXPORTĂ PDF PENTRU PRINT"}
                        </button>
                    )}
                </div>

                {/* PREVIEW PANEL (Dreapta) */}
                <div className="lg:col-span-8">
                    <div className="bg-slate-100 rounded-2xl border border-slate-200 min-h-[500px] flex flex-col overflow-hidden relative shadow-inner">
                        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-200 bg-white gap-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <LayoutTemplate size={18} className="text-emerald-500" />
                                <span className="text-slate-500 font-medium">Export:</span> 
                                <span className="font-black text-emerald-600">
                                    {selectedProduct.replace(/\s+/g, '')}_{thickness.trim() ? `${thickness.trim()}_` : ''}{widthCm}x{heightCm}cm_{orderName.trim() ? orderName.trim().replace(/\s+/g, '_') : 'lucrare'}.pdf
                                </span>
                            </h3>
                            <div className="flex gap-2 text-xs font-bold text-slate-600">
                                <div className="bg-slate-100 px-3 py-1 rounded-md">Bază: {widthCm}x{heightCm}cm</div>
                                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md border border-emerald-200">
                                    Total Tipar: {widthCm + (tivOglindaCm+tivSimpluCm)*2} x {heightCm + (tivOglindaCm+tivSimpluCm)*2}cm
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            className="p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-[url('/pattern-grid.svg')] bg-center bg-repeat opacity-90 cursor-grab active:cursor-grabbing"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {previewUrl ? (
                                <img 
                                    src={previewUrl} 
                                    alt="Preview Tiv" 
                                    draggable={false}
                                    className="max-h-[600px] max-w-full object-contain shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] ring-1 ring-slate-900/10 select-none"
                                />
                            ) : (
                                <div className="text-center text-slate-400 flex flex-col items-center select-none pointer-events-none">
                                    <FileImage size={48} className="mb-4 text-slate-300" />
                                    <p className="font-bold">Încarcă o imagine sau adaugă text.</p>
                                </div>
                            )}
                            
                            {/* Legend removed at user request */}
                        </div>

                        {/* Hidden canvas for preview generation */}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
