const ANAF_API_URL = 'https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva';

export type CompanyData = {
    cui: string;
    denumire: string;
    regCom: string;
    telefon: string;
    adresa: string;
    localitate: string;
    judet: string;
    codPostal: string;
    platitorTva: boolean;
    lastUpdated: string;
};

/**
 * Caută o companie în ANAF după CUI (API public v9).
 */
export async function searchCompanyByCUI(cui: string): Promise<CompanyData | null> {
    try {
        const cleanCui = cui.replace(/\D/g, '');
        const cuiInt = parseInt(cleanCui, 10);
        if (!cuiInt) return null;

        const today = new Date().toISOString().split('T')[0];
        const payload = [{ cui: cuiInt, data: today }];

        const response = await fetch(ANAF_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10000),
        });

        if (response.status === 404) return null;

        if (!response.ok) {
            throw new Error('Serviciul ANAF este indisponibil sau a returnat o eroare.');
        }

        const data = await response.json();
        if (data?.found?.length > 0) {
            const entry = data.found[0];
            const gen = entry.date_generale;
            const adr = entry.adresa_sediu_social;

            return {
                cui: cleanCui,
                denumire: gen.denumire,
                regCom: gen.nrRegCom,
                telefon: gen.telefon,
                adresa: gen.adresa,
                localitate: adr.sdenumire_Localitate,
                judet: adr.sdenumire_Judet,
                codPostal: adr.scod_Postal,
                platitorTva: entry.inregistrare_scop_Tva?.scpTVA || false,
                lastUpdated: today,
            };
        }

        return null;
    } catch (error) {
        if (error instanceof Error && error.name === 'TimeoutError') {
            throw new Error('Serviciul ANAF este indisponibil sau a returnat o eroare.');
        }
        if (error instanceof Error && error.message.includes('ANAF')) throw error;
        console.error('[ANAF] Error fetching data:', error);
        throw new Error('Serviciul ANAF este indisponibil sau a returnat o eroare.');
    }
}
