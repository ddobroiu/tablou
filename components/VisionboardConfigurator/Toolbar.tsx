import React from 'react';
import { Upload, Type, Image as ImageIcon, LayoutGrid, Sparkles, Download } from 'lucide-react';

interface ToolbarProps {
    activeTool: string | null;
    setActiveTool: (tool: string | null) => void;
    addElement: (type: 'image' | 'text', content: string) => void;
    isMobile: boolean;
    onExportSvgCut?: () => void;
    /** Exportul SVG cu contur de tăiere e unealtă internă (producție), nu pentru clienți. */
    isAdmin?: boolean;
}

export const TEXT_PLACEHOLDER = 'Scrie textul tău';

export const Toolbar: React.FC<ToolbarProps> = ({ activeTool, setActiveTool, addElement, isMobile, onExportSvgCut, isAdmin }) => {

    const sidebarStyle: React.CSSProperties = isMobile ? {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 0.5rem',
        background: 'var(--surface)',
        zIndex: 20,
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '60px',
        borderTop: '1px solid var(--border)'
    } : {
        width: '80px',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 0',
        background: 'var(--surface)',
        zIndex: 10
    };

    return (
        <aside style={sidebarStyle}>
            <button className={`tool-btn ${activeTool === 'upload' ? 'active' : ''}`} title="Încarcă poză" aria-label="Încarcă poză" onClick={() => setActiveTool(activeTool === 'upload' ? null : 'upload')}>
                <Upload size={24} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Upload</span>
            </button>
            <button className={`tool-btn ${activeTool === 'text' ? 'active' : ''}`} title="Adaugă text" aria-label="Adaugă text" onClick={() => addElement('text', TEXT_PLACEHOLDER)}>
                <Type size={24} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Text</span>
            </button>
            <button className={`tool-btn ${activeTool === 'bg' ? 'active' : ''}`} title="Fundal" aria-label="Fundal" onClick={() => setActiveTool(activeTool === 'bg' ? null : 'bg')}>
                <ImageIcon size={24} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Fundal</span>
            </button>

            <button className={`tool-btn ${activeTool === 'library' ? 'active' : ''}`} title="Bibliotecă de imagini" aria-label="Bibliotecă de imagini" onClick={() => setActiveTool(activeTool === 'library' ? null : 'library')}>
                <LayoutGrid size={24} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Bibliotecă</span>
            </button>
            <button className={`tool-btn ${activeTool === 'elements' ? 'active' : ''}`} title="Elemente și forme" aria-label="Elemente și forme" onClick={() => setActiveTool(activeTool === 'elements' ? null : 'elements')}>
                <Sparkles size={24} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Elemente</span>
            </button>

            {isAdmin && (
                <button className="tool-btn" title="Export SVG cu contur de tăiere (admin)" aria-label="Export SVG CUT" onClick={() => onExportSvgCut?.()}>
                    <Download size={24} />
                    <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>SVG CUT</span>
                </button>
            )}

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
                @media (max-width: 768px) {
                    .tool-btn {
                        width: auto;
                        height: 100%;
                        margin-bottom: 0;
                        padding: 0 0.5rem;
                    }
                }
            `}</style>
        </aside>
    );
};
