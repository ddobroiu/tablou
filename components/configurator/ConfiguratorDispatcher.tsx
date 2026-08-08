"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const BannerConfigurator = dynamic(() => import('./BannerConfigurator'));
const BannerVersoConfigurator = dynamic(() => import('./BannerVersoConfigurator'));
const MeshConfigurator = dynamic(() => import('./MeshConfigurator'));
const AfiseConfigurator = dynamic(() => import('./AfiseConfigurator'));
const AutocolanteConfigurator = dynamic(() => import('./AutocolanteConfigurator'));
const CanvasConfigurator = dynamic(() => import('./CanvasConfigurator'));
const StockCanvasConfigurator = dynamic(() => import('./StockCanvasConfigurator'));
const TapetConfigurator = dynamic(() => import('./TapetConfigurator'));
const RollupConfigurator = dynamic(() => import('./RollupConfigurator'));
const WindowGraphicsConfigurator = dynamic(() => import('./WindowGraphicsConfigurator'));
const PlianteConfigurator = dynamic(() => import('./PlianteConfigurator'));
const FlyerConfigurator = dynamic(() => import('./FlyerConfigurator'));
const FonduriEUConfigurator = dynamic(() => import('./FonduriEUConfigurator'));
const ConfiguratorPlexiglass = dynamic(() => import('./ConfiguratorPlexiglass'));
const ConfiguratorPVCForex = dynamic(() => import('./ConfiguratorPVCForex'));
const ConfiguratorPolipropilena = dynamic(() => import('./ConfiguratorPolipropilena'));
const ConfiguratorAlucobond = dynamic(() => import('./ConfiguratorAlucobond'));
const ConfiguratorCarton = dynamic(() => import('./ConfiguratorCarton'));
const ConfiguratorCartiVizita = dynamic(() => import('./ConfiguratorCartiVizita'));

import QuickNav from '../QuickNav';
import { SeoDimensionsLinks } from '../SeoDimensionsLinks';




const StockBannerConfigurator = dynamic(() => import('./StockBannerConfigurator'));
const TextileConfigurator = dynamic(() => import('../TextileConfigurator'));

const CONFIGURATOR_COMPONENTS: Record<string, React.ComponentType<any>> = {
    'banner': BannerConfigurator,
    'banner-verso': BannerVersoConfigurator,
    'mesh': MeshConfigurator,
    'afise': AfiseConfigurator,
    'autocolante': AutocolanteConfigurator,
    'canvas': CanvasConfigurator,

    'tapet': TapetConfigurator,
    // ...
    'rollup': RollupConfigurator,
    'window-graphics': WindowGraphicsConfigurator,
    'pliante': PlianteConfigurator,
    'flayere': FlyerConfigurator,
    'fonduri-eu': FonduriEUConfigurator,
    'configurator-fonduri': FonduriEUConfigurator,
    'plexiglass': ConfiguratorPlexiglass,
    'configuratoare-plexiglass': ConfiguratorPlexiglass,
    'pvc-forex': ConfiguratorPVCForex,
    'polipropilena': ConfiguratorPolipropilena,
    'configuratoare-polipropilena': ConfiguratorPolipropilena,
    'alucobond': ConfiguratorAlucobond,
    'configuratoare-alucobond': ConfiguratorAlucobond,
    'carton': ConfiguratorCarton,
    'configuratoare-carton': ConfiguratorCarton,
    'carti-vizita': ConfiguratorCartiVizita,
    'tricouri': (props: any) => <TextileConfigurator type="tricouri" {...props} />,
    'hanorace': (props: any) => <TextileConfigurator type="hanorace" {...props} />,
    'sepci': (props: any) => <TextileConfigurator type="sepci" {...props} />,
};

interface ConfiguratorDispatcherProps {
    configuratorId: string;
    productSlug?: string;
    productImage?: string;
    initialWidth?: number;
    initialHeight?: number;
    intent?: string;
    renderOnlyConfigurator?: boolean;
}

import { useSearchParams } from 'next/navigation';

export default function ConfiguratorDispatcher({ 
    configuratorId, 
    productSlug, 
    productImage, 
    initialWidth: propW, 
    initialHeight: propH, 
    intent: propIntent,
    renderOnlyConfigurator: propRenderOnly
}: ConfiguratorDispatcherProps) {
    const searchParams = useSearchParams();
    const finalSlug = productSlug || searchParams.get('productSlug') || searchParams.get('slug');
    const isCustomMode = searchParams.get('mode') === 'custom';

    // Dacă avem un slug și NU suntem în mod custom, folosim configuratorul de stoc
    if (configuratorId === 'canvas' && finalSlug && !isCustomMode) {
        return <StockCanvasConfigurator productSlug={finalSlug} renderOnlyConfigurator={propRenderOnly ?? false} />;
    }


    if (configuratorId === 'banner' && finalSlug && !isCustomMode) {
        return <StockBannerConfigurator productSlug={finalSlug} renderOnlyConfigurator={propRenderOnly ?? false} />;
    }

    const Component = CONFIGURATOR_COMPONENTS[configuratorId];
    const initialWidth = propW || (searchParams.get('w') ? parseInt(searchParams.get('w')!) : undefined);
    const initialHeight = propH || (searchParams.get('h') ? parseInt(searchParams.get('h')!) : undefined);
    const initialImage = searchParams.get('image') || productImage;

    if (!Component) {
        return null;
    }

    if (propRenderOnly) {
        return (
            <Component
                productSlug={finalSlug}
                productImage={initialImage}
                initialWidth={initialWidth}
                initialHeight={initialHeight}
                intent={propIntent || searchParams.get('intent')}
                renderOnlyConfigurator={true}
            />
        );
    }

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <Component
                productSlug={finalSlug}
                productImage={initialImage}
                initialWidth={initialWidth}
                initialHeight={initialHeight}
                intent={propIntent || searchParams.get('intent')}
                renderOnlyConfigurator={false}
            />

            <SeoDimensionsLinks 
                productId={configuratorId} 
                productName={PRODUCT_NAMES[configuratorId] || configuratorId} 
                currentW={initialWidth || 100} 
                currentH={initialHeight || 100} 
            />
        </div>
    );
}

const PRODUCT_NAMES: Record<string, string> = {
    'banner': 'Banner Frontlit',
    'banner-verso': 'Banner Față-Verso',
    'mesh': 'Mesh publicitar',
    'afise': 'Afiș HD',
    'autocolante': 'Autocolant',
    'canvas': 'Tablou Canvas',
    'tapet': 'Tapet Personalizat',
    'rollup': 'Sistem Roll-up',
    'window-graphics': 'Sticker Geam',
    'pliante': 'Pliant',
    'flayere': 'Flyer / Fluturaș',
    'plexiglass': 'Plexiglass',
    'pvc-forex': 'PVC Forex',
    'alucobond': 'Alucobond',
    'fonduri-eu': 'Panou Fonduri Europene',
    'polipropilena': 'Placă Polipropilenă',
    'carton': 'Placă Carton',
    'carti-vizita': 'Cărți de Vizită',
    'tricouri': 'Tricou Personalizat',
    'hanorace': 'Hanorac Personalizat',
    'sepci': 'Șapcă Personalizată',
};

