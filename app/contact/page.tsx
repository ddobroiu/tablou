import { Metadata } from 'next';
import ContactClient from "@/components/ContactClient";

export const metadata: Metadata = {
    title: 'Contactează-ne',
    description: 'Ai întrebări despre serviciile noastre de tipar digital sau vrei o ofertă personalizată? Suntem aici să te ajutăm. Contactează echipa Tablou prin email,...',
    keywords: ['contact', 'tablou', 'suport clienți', 'ofertă print', 'tipar digital romania'],
    alternates: {
        canonical: '/contact',
    },
};

export default function ContactPage() {
    return <ContactClient />;
}
