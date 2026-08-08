
import { toPng } from 'html-to-image';

function dataUrlToBlob(dataUrl: string): Blob {
    const [header, data] = dataUrl.split(',');
    if (!data) throw new Error('Format imagine invalid');
    const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
}

/** Elemente UI din editor (ștergere, resize) — nu intră în export. */
function shouldIncludeInCapture(node: HTMLElement): boolean {
    if (node.closest('[data-export-ignore="true"]')) return false;
    if (node.tagName === 'BUTTON') return false;
    return true;
}

export async function captureDesign(
    containerRef: React.RefObject<HTMLDivElement | null>
): Promise<string> {
    if (!containerRef.current) throw new Error('Workspace-ul nu a fost găsit');

    const workspaceDiv = containerRef.current;

    try {
        const dataUrl = await toPng(workspaceDiv, {
            quality: 0.92,
            pixelRatio: Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1),
            cacheBust: true,
            skipFonts: true,
            includeQueryParams: true,
            filter: (node) => {
                if (!(node instanceof HTMLElement)) return true;
                return shouldIncludeInCapture(node);
            },
        });

        if (!dataUrl || dataUrl.length < 200) {
            throw new Error('Captura designului a eșuat (imagine goală)');
        }

        return dataUrl;
    } catch (err) {
        console.error('Capture failed:', err);
        const msg = err instanceof Error ? err.message : String(err);
        if (/cssRules|SecurityError|tainted|cross-origin|CORS/i.test(msg)) {
            throw new Error(
                'Unele imagini externe blochează exportul. Folosește imagini din „Încarcă” sau din biblioteca noastră.'
            );
        }
        throw new Error('Nu am putut salva designul. Încearcă din nou sau redu numărul de elemente.');
    }
}

export async function uploadToCloudinary(dataUrl: string): Promise<string> {
    const blob = dataUrlToBlob(dataUrl);
    const formData = new FormData();
    formData.append('file', blob, 'design.png');
    formData.append('type', 'visionboard_capture');

    const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });

    const data = await uploadRes.json().catch(() => ({}));
    if (!uploadRes.ok) {
        const detail = typeof data?.error === 'string' ? data.error : 'Upload failed';
        throw new Error(detail);
    }
    if (!data?.url) throw new Error('Serverul nu a returnat URL-ul imaginii');
    return data.url as string;
}

function escapeXml(s: string) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
}

export type SvgCutExportOptions = {
    offsetMm?: number;
    cutStrokeColor?: string;
    cutStrokeWidthMm?: number;
};

export function exportSvgWithCut(
    workspaceEl: HTMLDivElement,
    sizeCm: string,
    options: SvgCutExportOptions = {}
) {
    const { offsetMm = 2, cutStrokeColor = "#ff00ff", cutStrokeWidthMm = 0.3 } = options;

    const [wCmRaw, hCmRaw] = sizeCm.split('x').map((x) => Number(x));
    const wCm = Number.isFinite(wCmRaw) && wCmRaw > 0 ? wCmRaw : 40;
    const hCm = Number.isFinite(hCmRaw) && hCmRaw > 0 ? hCmRaw : 60;
    const widthMm = wCm * 10;
    const heightMm = hCm * 10;

    const wsRect = workspaceEl.getBoundingClientRect();
    const mmPerPxX = widthMm / wsRect.width;
    const mmPerPxY = heightMm / wsRect.height;

    const nodes = Array.from(workspaceEl.querySelectorAll<HTMLElement>('[data-element-id]'));
    let bbox = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };

    const elementSvgs: string[] = [];

    for (const node of nodes) {
        const r = node.getBoundingClientRect();
        const xMm = (r.left - wsRect.left) * mmPerPxX;
        const yMm = (r.top - wsRect.top) * mmPerPxY;
        const wMm = r.width * mmPerPxX;
        const hMm = r.height * mmPerPxY;

        bbox.x1 = Math.min(bbox.x1, xMm);
        bbox.y1 = Math.min(bbox.y1, yMm);
        bbox.x2 = Math.max(bbox.x2, xMm + wMm);
        bbox.y2 = Math.max(bbox.y2, yMm + hMm);

        const type = node.getAttribute('data-element-type') || '';

        if (type === 'text') {
            const textEl = node.querySelector<HTMLElement>('[contenteditable="true"]');
            const text = (textEl?.textContent || '').trim();
            if (!text) continue;

            const cs = textEl ? window.getComputedStyle(textEl) : window.getComputedStyle(node);
            const fontSizePx = parseFloat(cs.fontSize || '24');
            const fontSizeMm = fontSizePx * mmPerPxY;
            const fill = cs.color || '#000000';
            const fontFamily = (cs.fontFamily || 'sans-serif').split(',')[0].replace(/["']/g, '').trim();
            const fontWeight = cs.fontWeight || '400';

            const tx = xMm + 2;
            const ty = yMm + hMm - 2;
            elementSvgs.push(
                `<text x="${tx.toFixed(2)}" y="${ty.toFixed(2)}" font-family="${escapeXml(fontFamily)}" font-size="${fontSizeMm.toFixed(2)}" font-weight="${escapeXml(fontWeight)}" fill="${escapeXml(fill)}">${escapeXml(text)}</text>`
            );
            continue;
        }

        const img = node.querySelector<HTMLImageElement>('img');
        const src = img?.getAttribute('src') || '';
        if (src) {
            elementSvgs.push(
                `<image href="${escapeXml(src)}" x="${xMm.toFixed(2)}" y="${yMm.toFixed(2)}" width="${wMm.toFixed(2)}" height="${hMm.toFixed(2)}" preserveAspectRatio="xMidYMid meet" />`
            );
        }
    }

    if (!Number.isFinite(bbox.x1)) {
        bbox = { x1: 0, y1: 0, x2: widthMm, y2: heightMm };
    }

    const cutX = clamp(bbox.x1 - offsetMm, 0, widthMm);
    const cutY = clamp(bbox.y1 - offsetMm, 0, heightMm);
    const cutW = clamp((bbox.x2 - bbox.x1) + offsetMm * 2, 0, widthMm - cutX);
    const cutH = clamp((bbox.y2 - bbox.y1) + offsetMm * 2, 0, heightMm - cutY);

    const cutLayer = [
        `<g id="CUT" fill="none" stroke="${escapeXml(cutStrokeColor)}" stroke-width="${cutStrokeWidthMm}">`,
        `<rect x="${cutX.toFixed(2)}" y="${cutY.toFixed(2)}" width="${cutW.toFixed(2)}" height="${cutH.toFixed(2)}" />`,
        `</g>`
    ].join('');

    const svg =
        `<?xml version="1.0" encoding="UTF-8"?>` +
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${widthMm}mm" height="${heightMm}mm" viewBox="0 0 ${widthMm} ${heightMm}">` +
        `<g id="ARTWORK">${elementSvgs.join('')}</g>` +
        cutLayer +
        `</svg>`;

    return { svg, cut: { x: cutX, y: cutY, width: cutW, height: cutH } };
}

/** Rute configurator pentru produsul selectat în editor. */
export function resolveConfiguratorRoute(material: string): string {
    const map: Record<string, string> = {
        canvas: 'canvas',
        banner: 'banner',
        'banner-verso': 'banner-verso',
        mesh: 'mesh',
        afise: 'afise',
        rollup: 'rollup',
        autocolante: 'autocolante',
        'window-graphics': 'window-graphics',
        tapet: 'tapet',
        acrylic: 'materiale/plexiglass',
        plexiglass: 'materiale/plexiglass',
        forex: 'materiale/pvc-forex',
        'pvc-forex': 'materiale/pvc-forex',
        alucobond: 'materiale/alucobond',
        polipropilena: 'materiale/polipropilena',
        carton: 'materiale/carton',
        'carti-vizita': 'carti-vizita',
        tricouri: 'tricouri',
        hanorace: 'hanorace',
        sepci: 'sepci',
        flyers: 'flayere',
        flyere: 'flayere',
        pliante: 'pliante',
    };
    return map[material] ?? material;
}
