import { CONFIGURATORS_REGISTRY } from '@/lib/configurators-registry';

/**
 * Câte localități încap într-un singur fișier de sitemap.
 *
 * Indexul (app/sitemap.xml) și generatorul (app/server-sitemap/[id]) trebuie să
 * folosească ACEEAȘI valoare: indexul decide câte părți anunță pe județ, iar
 * generatorul decide ce felie servește pentru fiecare parte. Dacă cele două nu
 * se potrivesc, localitățile din coada fiecărui județ nu ajung niciodată în
 * sitemap și Google nu află că există.
 *
 * Limita Google e 50.000 de URL-uri pe fișier; lăsăm marjă până la 45.000.
 */
const MAX_URLS_PER_SITEMAP = 45000;

/** Pagina localității + câte o pagină pentru fiecare configurator. */
export const URLS_PER_LOCALITY = CONFIGURATORS_REGISTRY.length + 1;

export const LOCS_PER_SITEMAP = Math.max(
    1,
    Math.floor(MAX_URLS_PER_SITEMAP / URLS_PER_LOCALITY)
);
