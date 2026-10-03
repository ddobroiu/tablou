import { siteKeyFromOrigin, type SiteKey } from "./siteSpecialization";

type Choice = { product: string; title: string; when: string; check: string };
type Guide = { title: string; description: string; intro: string; choices: Choice[]; checklist: string[] };

const GUIDES: Record<SiteKey, Guide> = {
  adbanner: {
    title: "Banner, mesh sau banner față-verso? Materiale și prețuri",
    description: "Compară Frontlit, mesh și Blockout: unde se folosesc, ce finisaje alegi și cât costă formatele uzuale. Configurează printul cu livrare prin curier.",
    intro: "Locul de montaj decide materialul. Pentru un gard, o schelă și un banner citit din ambele sensuri ai nevoie de soluții diferite, chiar dacă grafica este aceeași.",
    choices: [
      { product: "banner", title: "Banner PVC Frontlit", when: "Pentru un mesaj citit dintr-o singură parte, pe garduri, fațade sau la evenimente.", check: "Măsoară spațiul de prindere și lasă zona textului departe de capse. Un material mai gros nu înlocuiește o fixare corectă." },
      { product: "mesh", title: "Mesh microperforat", when: "Pentru suprafețe mari expuse la vânt, unde perforațiile permit trecerea aerului.", check: "La montajul pe schelă, verifică sistemul de prindere cu persoana responsabilă de structură. Mesh-ul reduce suprafața închisă, dar nu elimină solicitările." },
      { product: "banner-verso", title: "Banner Blockout față-verso", when: "Pentru mesaje citite din ambele părți; stratul opac separă cele două imagini.", check: "Pregătește fișierele pentru ambele fețe și verifică orientarea lor înainte de comandă." },
    ],
    checklist: ["Dimensiunea finală în centimetri și cantitatea", "Expunerea la interior sau exterior și locul de prindere", "O față sau două fețe și finisajele alese", "Fișierul final și adresa de livrare"],
  },
  euprint: {
    title: "Panouri pentru fonduri europene: material, dimensiune și preț",
    description: "Compară PVC Forex și alucobond pentru panouri și plăci. Vezi prețuri calculate, pregătirea graficii și pașii comenzii pentru proiectul tău.",
    intro: "Alege materialul după amplasare, apoi verifică dimensiunea și grafica cerute de documentația proiectului. Materialul potrivit nu garantează singur conformitatea unui panou.",
    choices: [
      { product: "pvc-forex", title: "Panou PVC Forex", when: "Pentru un panou rigid ușor; grosimea se alege în funcție de dimensiune și suport.", check: "Stabilește cum va fi fixat panoul și verifică dimensiunea minimă din documentația programului, nu dintr-un model generic." },
      { product: "alucobond", title: "Placă din compozit de aluminiu", when: "Pentru o placă rigidă, inclusiv atunci când proiectul cere o placă permanentă.", check: "La exterior, verifică suportul, punctele de fixare și amplasarea. Confirmă separat siglele și textele obligatorii." },
      { product: "autocolante", title: "Autocolante pentru echipamente", when: "Pentru identificarea bunurilor achiziționate; formatul trebuie să păstreze lizibile informațiile.", check: "Numără echipamentele și stabilește dimensiunea fiecărei etichete. Verifică suprafața pe care va fi lipită." },
    ],
    checklist: ["Programul de finanțare și manualul de identitate vizuală aplicabil", "Tipul de suport și dimensiunea solicitată", "Siglele, textele și datele proiectului în versiunea finală", "Datele de facturare și adresa de livrare"],
  },
  prynt: {
    title: "Flyere, pliante sau tricouri: cum pregătești o comandă de print",
    description: "Alege între flyere, pliante și textile personalizate. Compară tiraje, materiale și prețuri calculate, apoi pregătește fișierele pentru comandă.",
    intro: "Un mesaj scurt, o prezentare detaliată și un logo pe tricou cer produse și fișiere diferite. Pornește de la modul în care va fi folosit printul, apoi alege tirajul.",
    choices: [
      { product: "flayere", title: "Flyere", when: "Pentru un mesaj scurt, oferte și distribuție; alegi formatul, hârtia și una sau două fețe.", check: "Păstrează textul în interiorul zonei de siguranță și pregătește marginea de tăiere. Verifică tirajul înainte de calculul prețului." },
      { product: "pliante", title: "Pliante pliate", when: "Pentru mai multe informații, împărțite pe panouri care se pliază.", check: "Verifică ordinea paginilor după pliere. Liniile de pliere nu trebuie să treacă prin texte importante." },
      { product: "tricouri", title: "Tricouri personalizate", when: "Pentru echipe și evenimente; comanda are nevoie de mărimi și poziția imprimării.", check: "Pregătește lista de mărimi, culorile și fișierul logo. Un total de tricouri fără distribuția mărimilor nu este suficient pentru producție." },
    ],
    checklist: ["Produsul și numărul de bucăți", "Formatul hârtiei sau lista de mărimi pentru textile", "Print pe o față sau față-verso / poziția pe textil", "Grafica finală și data la care ai nevoie de comandă"],
  },
  homeprint: {
    title: "Fototapet sau tablou canvas? Măsurători, imagine și preț",
    description: "Alege printul pentru perete: fototapet la dimensiune sau canvas. Vezi cum măsori, cum verifici fotografia și prețuri pentru formate uzuale.",
    intro: "Pentru un perete întreg începi cu măsurătoarea suprafeței. Pentru un tablou începi cu locul de expunere și proporția fotografiei. Același fișier nu se încadrează automat bine în orice format.",
    choices: [
      { product: "tapet", title: "Fototapet personalizat", when: "Pentru acoperirea unei suprafețe mari de perete, cu imagine adaptată măsurătorilor.", check: "Măsoară lățimea și înălțimea în mai multe puncte, identifică prizele și ușile și confirmă pregătirea peretelui cu montatorul." },
      { product: "canvas", title: "Tablou canvas", when: "Pentru o imagine delimitată, pe pânză; alegi dimensiunea și varianta de finisare.", check: "Folosește fotografia originală și verifică decupajul. Nu așeza fețe sau text important chiar lângă margine." },
      { product: "afise", title: "Poster pe hârtie", when: "Pentru o imagine ce urmează să fie montată într-o ramă sau schimbată periodic.", check: "Alege formatul după rama pe care o ai și verifică dacă suportul se potrivește expunerii planificate." },
    ],
    checklist: ["Dimensiunea măsurată, nu estimată", "Fotografia originală și proporția dorită", "Suprafața de montaj sau rama disponibilă", "Adresa de livrare și organizarea montajului"],
  },
  tablou: {
    title: "Tablou canvas din poză: format, decupaj și preț",
    description: "Pregătește fotografia pentru un tablou canvas: proporție, decupaj, margini și finisare. Compară prețurile formatelor și configurează online.",
    intro: "Calitatea tabloului începe cu fotografia și încadrarea ei. O imagine bună pe telefon poate necesita un format mai mic la print, iar un portret nu se transformă într-un peisaj fără decupare.",
    choices: [
      { product: "canvas", title: "Canvas personalizat", when: "Pentru fotografii și ilustrații pe pânză, cu finisarea aleasă în configurator.", check: "Verifică imaginea originală la mărire, alege proporția potrivită și urmărește previzualizarea înainte de comandă. Zona vizibilă și marginile trebuie planificate împreună." },
    ],
    checklist: ["Încarcă fotografia originală, fără captură de ecran", "Alege un format care păstrează subiectul în cadru", "Lasă spațiu la margini pentru finisarea selectată", "Verifică fotografia și dimensiunea înainte de plată"],
  },
  shopprint: {
    title: "Ghid de print: banner, autocolant sau panou rigid?",
    description: "Compară printul flexibil, folia adezivă și panourile rigide. Materiale, utilizări, prețuri calculate și ce informații pregătești pentru comandă.",
    intro: "Alegerea suportului schimbă montajul și costul. Un banner se prinde, un autocolant se lipește, iar un panou rigid are nevoie de suport sau fixare. Compară variantele înainte să trimiți grafica.",
    choices: [
      { product: "banner", title: "Banner flexibil", when: "Pentru mesaje mari prinse pe garduri, fațade sau structuri.", check: "Verifică dimensiunea spațiului și sistemul de prindere. Grafica și finisajele se aleg împreună." },
      { product: "autocolante", title: "Folie autocolantă", when: "Pentru suprafețe potrivite lipirii, etichete și elemente grafice.", check: "Verifică materialul suprafeței, starea ei și dimensiunea zonei. O folie nu corectează un suport murdar sau deteriorat." },
      { product: "pvc-forex", title: "Panou rigid PVC", when: "Pentru informații și semnalistică pe un suport care își păstrează forma.", check: "Stabilește grosimea, punctele de fixare și expunerea la interior sau exterior." },
    ],
    checklist: ["Unde va fi folosit produsul și cum se montează", "Dimensiunea finală și cantitatea", "Materialul, grosimea și finisajele", "Grafica, adresa de livrare și datele de facturare"],
  },
};

export function printGuide(origin: string): Guide {
  return GUIDES[siteKeyFromOrigin(origin) ?? "shopprint"];
}
