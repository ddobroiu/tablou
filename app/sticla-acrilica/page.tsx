import PlexiglassConfigurator from '@/components/configurator/PlexiglassConfigurator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sticlă Acrilică Personalizată - Tablou.net',
    description: 'Transformă-ți pozele în tablouri spectaculoase pe sticlă acrilică (plexiglass). Calitate premium, culori vibrante și efect de profunzime.',
};

export default function SticlaAcrilicaPage() {
    return <PlexiglassConfigurator />;
}
