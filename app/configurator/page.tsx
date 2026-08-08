import { Metadata } from 'next';
import ConfiguratorsClient from "@/components/ConfiguratorsClient";

export const metadata: Metadata = {
  title: 'Toate Configuratoarele de Print Online',
  description: 'Alege produsul dorit și configurează-l online: bannere, autocolante, tablouri canvas, afișe, flyere și multe altele. Preț instant și personalizare rapidă.',
  keywords: ['configuratoare print', 'print online romania', 'personalizare produse', 'bannere online', 'autocolante personalizate'],
  alternates: {
    canonical: '/configuratoare',
  },
};

export default function ConfiguratorsPage() {
  return <ConfiguratorsClient />;
}


