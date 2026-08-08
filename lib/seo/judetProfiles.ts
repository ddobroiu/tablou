/**
 * Profiluri factuale pentru cele 42 de județe (41 + București), partajate identic
 * pe toate site-urile din familie — geografia nu ține de brand.
 *
 * Fiecare profil oferă date reale, verificabile, care alimentează generatorul de
 * conținut din `localContent.ts` pentru paginile județ/localitate/produs, astfel
 * încât variația textului vină din fapte reale combinate (regiune, industrie
 * locală, relevanță pentru produs, distanță de livrare), nu din rotație de
 * sinonime (spintax).
 */

export type DeliveryTier = "apropiat" | "mediu" | "distant";

export type JudetProfile = {
  /** slug-ul județului, așa cum apare în ro_localitati.json */
  slug: string;
  /** regiunea istorică din care face parte */
  regiune:
    | "Muntenia"
    | "Oltenia"
    | "Moldova"
    | "Ardeal"
    | "Banat"
    | "Crișana"
    | "Maramureș"
    | "Bucovina"
    | "Dobrogea"
    | "București";
  /** 2-3 industrii/particularități locale relevante pentru print/publicitate */
  industrii: string[];
  /** notă geografică/climatică relevantă pentru durabilitatea materialelor de print */
  notaGeografica: string;
  /** un reper local distinctiv, folosit ca ancoră de context, nu ca umplutură */
  reper: string;
  /** tier de livrare aproximativ față de hub-urile principale de producție (București + Buzău) */
  tierLivrare: DeliveryTier;
};

export const JUDET_PROFILES: JudetProfile[] = [
  { slug: "alba", regiune: "Ardeal", industrii: ["turism montan", "viticultură", "industrie auto (componente)"], notaGeografica: "zonă deluroasă și montană, cu ierni geroase — panourile outdoor au nevoie de rezistență la îngheț și vânt", reper: "Cetatea Alba Carolina", tierLivrare: "mediu" },
  { slug: "arad", regiune: "Banat", industrii: ["industrie ușoară", "logistică (poartă vestică spre UE)", "agricultură de câmpie"], notaGeografica: "câmpie deschisă, expunere puternică la soare vara — recomandăm laminare UV pentru bannere exterioare", reper: "Cetatea Aradului", tierLivrare: "mediu" },
  { slug: "arges", regiune: "Muntenia", industrii: ["industrie auto (Dacia/Pitești)", "turism montan (Transfăgărășan)", "producție industrială"], notaGeografica: "zonă mixtă deal-munte, trafic industrial intens care cere semnalistică rezistentă", reper: "Curtea de Argeș", tierLivrare: "apropiat" },
  { slug: "bacau", regiune: "Moldova", industrii: ["industrie chimică", "prelucrarea lemnului", "agricultură"], notaGeografica: "climă continentală cu variații mari de temperatură, potrivită pentru materiale rezistente la ciclurile termice", reper: "Valea Bistriței", tierLivrare: "mediu" },
  { slug: "bihor", regiune: "Crișana", industrii: ["industrie mobilă", "turism balnear (Băile Felix)", "comerț transfrontalier"], notaGeografica: "câmpie și zonă deluroasă, umiditate moderată din apele termale", reper: "Cetatea Oradea", tierLivrare: "mediu" },
  { slug: "bistrita-nasaud", regiune: "Ardeal", industrii: ["turism montan", "exploatare forestieră", "agroturism"], notaGeografica: "relief muntos, ierni lungi — bannere și panouri montate outdoor trebuie să reziste la zăpadă și vânt puternic", reper: "Munții Rodnei", tierLivrare: "distant" },
  { slug: "botosani", regiune: "Moldova", industrii: ["agricultură", "industrie textilă"], notaGeografica: "zonă de câmpie/podiș cu veri călduroase și ierni geroase", reper: "Podișul Moldovei de Nord", tierLivrare: "distant" },
  { slug: "braila", regiune: "Muntenia", industrii: ["port fluvial și logistică", "agricultură", "industrie navală"], notaGeografica: "climă de câmpie cu vânturi puternice dinspre Bărăgan — panourile mari au nevoie de fixare solidă", reper: "Dunărea și Portul Brăila", tierLivrare: "mediu" },
  { slug: "brasov", regiune: "Ardeal", industrii: ["turism montan", "industrie auto și aerospațială", "evenimente și HoReCa"], notaGeografica: "zonă montană cu trafic turistic intens tot anul, cerere mare pentru semnalistică și bannere de eveniment", reper: "Poiana Brașov", tierLivrare: "apropiat" },
  { slug: "buzau", regiune: "Muntenia", industrii: ["industrie și logistică (hub de producție propriu)", "agricultură", "viticultură"], notaGeografica: "zonă de câmpie/deal, sediul principal de producție al rețelei — timpi de livrare cei mai scurți din țară", reper: "Focurile vii de la Lopătari", tierLivrare: "apropiat" },
  { slug: "caras-severin", regiune: "Banat", industrii: ["turism montan", "exploatare minieră (istoric)", "agroturism"], notaGeografica: "relief muntos accidentat, acces mai dificil — timpi de livrare ușor mai lungi pentru zonele izolate", reper: "Cheile Nerei", tierLivrare: "distant" },
  { slug: "calarasi", regiune: "Muntenia", industrii: ["agricultură intensivă", "industrie alimentară"], notaGeografica: "câmpie deschisă cu veri toride — materialele outdoor trebuie să reziste la radiație UV puternică", reper: "Dunărea de la Călărași", tierLivrare: "apropiat" },
  { slug: "cluj", regiune: "Ardeal", industrii: ["IT și tech", "evenimente și educație (universități)", "real-estate/construcții"], notaGeografica: "zonă deluroasă cu climă temperată, piață urbană densă cu cerere mare de semnalistică comercială", reper: "Cluj-Napoca, hub tech al Transilvaniei", tierLivrare: "mediu" },
  { slug: "constanta", regiune: "Dobrogea", industrii: ["turism litoral", "port maritim și logistică", "HoReCa sezonier"], notaGeografica: "climă litorală cu salinitate ridicată în aer — recomandăm materiale cu rezistență UV și la coroziune sporită pentru bannere expuse pe litoral", reper: "litoralul Mării Negre", tierLivrare: "mediu" },
  { slug: "covasna", regiune: "Ardeal", industrii: ["turism balnear", "exploatare forestieră", "agroturism"], notaGeografica: "zonă montană cu ape minerale, climă răcoroasă", reper: "Stațiunea Covasna", tierLivrare: "distant" },
  { slug: "dambovita", regiune: "Muntenia", industrii: ["industrie (petrol/energie)", "agricultură", "proximitate București"], notaGeografica: "zonă de deal/câmpie, aproape de capitală — livrare rapidă din hub-ul principal", reper: "Târgoviște, fosta capitală", tierLivrare: "apropiat" },
  { slug: "dolj", regiune: "Oltenia", industrii: ["industrie auto (Ford)", "agricultură", "logistică fluvială (Dunăre)"], notaGeografica: "câmpie cu veri foarte calde, radiație UV ridicată", reper: "Craiova și Dunărea", tierLivrare: "mediu" },
  { slug: "galati", regiune: "Moldova", industrii: ["industrie siderurgică", "port fluvial/maritim", "logistică"], notaGeografica: "zonă industrială cu trafic greu, semnalistică industrială rezistentă necesară", reper: "Combinatul siderurgic și Dunărea", tierLivrare: "mediu" },
  { slug: "giurgiu", regiune: "Muntenia", industrii: ["logistică transfrontalieră (Podul Prieteniei)", "agricultură"], notaGeografica: "câmpie deschisă, aproape de București — printre cele mai scurte timpi de livrare", reper: "Podul Prieteniei peste Dunăre", tierLivrare: "apropiat" },
  { slug: "gorj", regiune: "Oltenia", industrii: ["industrie energetică (mineritul cărbunelui, termocentrale)", "turism montan"], notaGeografica: "zonă de deal/munte cu activitate industrială energetică intensă", reper: "Complexul Energetic Oltenia", tierLivrare: "mediu" },
  { slug: "harghita", regiune: "Ardeal", industrii: ["turism montan și balnear", "exploatare forestieră", "agroturism"], notaGeografica: "cea mai rece zonă a țării iarna — materialele exterioare au nevoie de rezistență sporită la îngheț", reper: "Munții Harghita", tierLivrare: "distant" },
  { slug: "hunedoara", regiune: "Ardeal", industrii: ["industrie siderurgică (istoric)", "turism (cetăți medievale)", "exploatare minieră"], notaGeografica: "zonă montană industrială, cu trafic greu în zonele foste miniere", reper: "Castelul Corvinilor", tierLivrare: "mediu" },
  { slug: "ialomita", regiune: "Muntenia", industrii: ["agricultură intensivă", "logistică (proximitate București)"], notaGeografica: "câmpia Bărăganului, veri toride și vânt constant", reper: "Bălțile Ialomiței", tierLivrare: "apropiat" },
  { slug: "iasi", regiune: "Moldova", industrii: ["IT și educație (universități)", "comerț", "evenimente culturale"], notaGeografica: "zonă de podiș, cel mai mare centru urban din Moldova — cerere ridicată de semnalistică comercială și educațională", reper: "Iași, capitala culturală a Moldovei", tierLivrare: "distant" },
  { slug: "ilfov", regiune: "București", industrii: ["logistică și depozite", "real-estate rezidențial", "proximitate directă cu Capitala"], notaGeografica: "centura Bucureștiului, cea mai rapidă zonă de livrare din țară", reper: "centura metropolitană București", tierLivrare: "apropiat" },
  { slug: "maramures", regiune: "Maramureș", industrii: ["turism rural și tradițional", "exploatare forestieră", "agroturism"], notaGeografica: "relief muntos izolat, ierni lungi — timpi de livrare ceva mai mari pentru zonele rurale", reper: "Mocănița din Vaser", tierLivrare: "distant" },
  { slug: "mehedinti", regiune: "Oltenia", industrii: ["energie hidro (Porțile de Fier)", "turism (Cazanele Dunării)", "agricultură"], notaGeografica: "zonă de graniță cu Dunărea, climă blândă submediteraneană", reper: "Cazanele Dunării", tierLivrare: "distant" },
  { slug: "mures", regiune: "Ardeal", industrii: ["industrie (mobilă, chimie)", "agricultură", "turism balnear"], notaGeografica: "zonă de deal cu climă temperat-continentală", reper: "Târgu Mureș, centru comercial al Transilvaniei", tierLivrare: "mediu" },
  { slug: "neamt", regiune: "Moldova", industrii: ["turism montan și mănăstiri", "exploatare forestieră", "industrie ușoară"], notaGeografica: "zonă montană cu trafic turistic religios intens", reper: "Mănăstirea Neamț", tierLivrare: "distant" },
  { slug: "olt", regiune: "Oltenia", industrii: ["agricultură intensivă", "industrie (Slatina — aluminiu)"], notaGeografica: "câmpie cu veri foarte calde", reper: "Uzina de aluminiu de la Slatina", tierLivrare: "mediu" },
  { slug: "prahova", regiune: "Muntenia", industrii: ["industrie petrolieră", "turism montan (Valea Prahovei)", "evenimente și HoReCa"], notaGeografica: "zonă de deal/munte cu trafic turistic intens tot anul, aproape de hub-ul de producție", reper: "Valea Prahovei", tierLivrare: "apropiat" },
  { slug: "satu-mare", regiune: "Crișana", industrii: ["industrie ușoară", "agricultură", "comerț transfrontalier (Ungaria)"], notaGeografica: "câmpie de graniță, climă temperată", reper: "Podișul Someșan", tierLivrare: "distant" },
  { slug: "salaj", regiune: "Crișana", industrii: ["agricultură", "exploatare de gaze naturale"], notaGeografica: "zonă de deal, județ predominant rural", reper: "Meseșul Sălăjean", tierLivrare: "distant" },
  { slug: "sibiu", regiune: "Ardeal", industrii: ["industrie auto și componente", "turism cultural și montan", "evenimente"], notaGeografica: "zonă de deal/munte cu trafic turistic ridicat, climă temperată", reper: "Centrul istoric al Sibiului", tierLivrare: "mediu" },
  { slug: "suceava", regiune: "Bucovina", industrii: ["turism (mănăstiri pictate)", "exploatare forestieră", "industrie ușoară"], notaGeografica: "zonă montană cu ierni lungi și geroase", reper: "Mănăstirile pictate din Bucovina", tierLivrare: "distant" },
  { slug: "teleorman", regiune: "Muntenia", industrii: ["agricultură intensivă", "industrie ușoară"], notaGeografica: "câmpie deschisă, veri toride", reper: "Câmpia Boianului", tierLivrare: "apropiat" },
  { slug: "timis", regiune: "Banat", industrii: ["IT și industrie ușoară", "logistică (poartă vestică spre UE)", "agricultură"], notaGeografica: "câmpie deschisă, al doilea mare hub economic al țării — cerere mare de semnalistică comercială și industrială", reper: "Timișoara, primul oraș european iluminat electric", tierLivrare: "mediu" },
  { slug: "tulcea", regiune: "Dobrogea", industrii: ["turism (Delta Dunării)", "pescuit și acvacultură", "port fluvial"], notaGeografica: "climă blândă de deltă, umiditate ridicată — recomandăm laminare suplimentară pentru bannere expuse", reper: "Delta Dunării", tierLivrare: "distant" },
  { slug: "vaslui", regiune: "Moldova", industrii: ["agricultură", "industrie ușoară"], notaGeografica: "zonă de podiș cu climă continentală accentuată", reper: "Podișul Central Moldovenesc", tierLivrare: "distant" },
  { slug: "valcea", regiune: "Oltenia", industrii: ["turism balnear (Călimănești-Căciulata)", "industrie chimică", "exploatare de sare"], notaGeografica: "zonă de deal/munte cu stațiuni balneare active tot anul", reper: "Mănăstirea Cozia", tierLivrare: "mediu" },
  { slug: "vrancea", regiune: "Moldova", industrii: ["viticultură", "zonă seismică activă (construcții antiseismice)", "agricultură"], notaGeografica: "zonă de deal/munte, cea mai activă zonă seismică a țării", reper: "Podgoriile Vrancei", tierLivrare: "mediu" },
  { slug: "bucuresti", regiune: "București", industrii: ["comerț și retail", "evenimente și corporate", "construcții/real-estate"], notaGeografica: "cel mai mare centru urban al țării, cerere permanentă de semnalistică comercială și panouri de eveniment", reper: "Capitala României", tierLivrare: "apropiat" },
];

export function getJudetProfile(slug: string): JudetProfile | undefined {
  const norm = slug.trim().toLowerCase();
  return JUDET_PROFILES.find((j) => j.slug === norm);
}
