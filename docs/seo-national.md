# Strategie SEO pentru print și livrare în România

Data: 3 octombrie 2026. Domenii: EuPrint, ShopPrint, Prynt, AdBanner, HomePrint și Tablou.

## Acoperire națională

Livrarea și comenzile rămân disponibile în toate localitățile. Acoperirea comercială nu depinde de indexarea fiecărui sat în Google.

- Pagina `/print-romania` prezintă specialitatea magazinului, configuratoarele, prețurile cu baza calculului, pregătirea comenzii și directorul tuturor județelor/București.
- Paginile de produs și ghidurile răspund cererilor naționale: material, utilizare, dimensiune, tiraj, finisare și fișier. Fiecare magazin are o temă comercială proprie.
- Paginile județelor oferă navigare către localități; nu pretind că există atelier în fiecare zonă.
- Paginile locale rămân accesibile. Selecția pentru sitemap și indexare folosește aceeași regulă, inclusiv pentru familiile catalogului.

## Specializarea magazinelor

| Magazin | Direcție principală pentru conținut nou |
|---|---|
| EuPrint | Panouri și plăci pentru proiecte și instituții |
| AdBanner | Banner, mesh, publicitate outdoor |
| Prynt | Flyere, pliante, print mic, textile |
| HomePrint | Fototapet și decor interior |
| Tablou | Canvas din fotografie |
| ShopPrint | Alegerea suporturilor și catalogul general |

Nu se mută automat canonicalurile între domenii. Paginile existente cu vizibilitate se păstrează, chiar dacă produsul nu este specialitatea principală a acelui domeniu.

## Selecția paginilor locale

1. Huburile orașelor principale din director rămân eligibile pentru indexare.
2. Pentru combinații noi produs–localitate, selecția inițială include numai produsele specialității în primul oraș al fiecărui județ. Acesta este un pilot editorial, nu dovada că o pagină merită automat indexată.
3. URL-urile locale valide cu afișări în istoricul disponibil din Search Console, interogat între 4 iunie 2025 și 30 septembrie 2026, rămân eligibile. Datele disponibile diferă între proprietăți. Aliasurile se consolidează; produsele retrase și URL-urile invalide nu intră în sitemap.
4. Restul paginilor locale folosesc `noindex, follow`, rămân accesibile și permit comanda. Nu sunt blocate în robots.txt, astfel încât Google poate vedea regula.
5. Canonicalul și sitemapul indică adresa finală. Nu combinăm `noindex` cu un canonical către altă pagină ca metodă de consolidare a duplicatelor.

## Când extindem selecția

O localitate nouă se promovează după verificarea paginii și a unei nevoi reale: cereri observate, comenzi sau căutări relevante. Conținutul trebuie să ajute cumpărătorul prin informații verificabile, precum un proiect realizat cu acord de publicare, fotografii proprii, explicații despre produs sau condiții reale de livrare. Numele orașului, populația și reformulările automate nu sunt suficiente pentru extindere.

O pagină trebuie să permită alegerea produsului și verificarea prețului, nu să existe doar pentru a trimite vizitatorul mai departe. Paginile fără diferențe utile pot fi consolidate sau menținute în afara indexului. Indexarea actuală ori afișările sunt motive de a evita retragerile bruște, nu o certificare a calității paginii.

## Lucru în următoarele 90 de zile

| Perioadă | Acțiuni | Ce măsurăm |
|---|---|---|
| 0–30 zile | Publicarea regulilor, retrimiterea sitemapurilor, verificarea recrawl-ului și a paginilor păstrate | Afișări și clicuri pe pagini și interogări; canonical ales de Google; erori de fetch; conversii |
| 30–60 zile | Îmbunătățirea paginilor principale pe baza întrebărilor clienților; publicarea proiectelor reale disponibile | Evoluția comparată cu intervalul anterior; căutări fără brand; conversii din organic |
| 60–90 zile | Extindere în loturi mici numai unde există conținut util; reevaluarea paginilor locale fără rezultate | Rezultatele lotului comparate cu paginile existente; cost de crawl; cereri și comenzi |

Verificare săptămânală în Search Console; evaluare lunară a selecției. Separăm căutările cu brand de cele fără brand și nu interpretăm câteva zile ca verdict final. Verificăm separat raportul de acțiuni manuale în interfața Search Console; API-ul de inspectare a URL-urilor nu confirmă absența unei penalizări manuale.

Nu cumpărăm linkuri pentru manipularea clasamentelor și nu publicăm recenzii, sedii, portofolii sau termene de livrare inventate. Nu generăm automat variante de text pentru fiecare localitate. Aceste reguli reduc riscul, dar nu garantează indexarea sau pozițiile.

## Referințe

- [Politicile Google: doorway abuse, keyword stuffing și scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies)
- [Controlul indexării](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Canonical și consolidarea duplicatelor](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Sitemapuri: URL-uri canonice](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

Implementare: `priorityLocalities.ts`, `localIndexPolicy.ts`, metadatele paginilor locale și ale familiilor din catalog. Verificări: `_deploy/test-print-seo.cjs`, `_deploy/verify-print-seo.py` și `_deploy/visual-print-seo.cjs` în workspace. Nu trimitem prin Indexing API pagini normale de comerț; acesta nu este destinat acestui tip de conținut.
