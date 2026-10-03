import { siteKeyFromOrigin } from "./siteSpecialization";

const COVERAGE = {
  adbanner: {
    title: "Bannere și mesh cu livrare în România",
    intro: "Comanzi materialul pentru locul în care îl vei monta, indiferent de județ. Bannerul PVC, mesh-ul și materialul opac față-verso au utilizări diferite; adresa de livrare nu schimbă alegerea printului.",
    check: "Stabilește dimensiunea, expunerea la vânt, fețele imprimate și punctele de prindere. Pentru instalare la înălțime, discută fixarea cu persoana care face montajul; cumpărarea printului nu include automat montaj local.",
  },
  euprint: {
    title: "Panouri și plăci pentru proiecte, cu livrare în România",
    intro: "Poți pregăti comanda pentru o instituție sau un proiect din orice județ. Alegi suportul, dimensiunea și grafica în funcție de amplasament și de cerințele finanțatorului, apoi introduci adresa beneficiarului.",
    check: "Verifică manualul de identitate al programului înainte de aprobarea machetei. Menționează datele instituției pentru factură și compară PVC-ul cu alucobondul în funcție de durata și condițiile expunerii.",
  },
  prynt: {
    title: "Flyere, pliante și textile personalizate, livrate în România",
    intro: "Pentru o campanie, un eveniment sau o echipă, alegi întâi tirajul și produsul. Poți primi materialele la adresa organizatorului din orice județ, fără să cauți un atelier în fiecare localitate.",
    check: "La pliante, verifică ordinea fețelor și poziția îndoiturilor. La flyere, păstrează marginea de siguranță pentru text. Pentru textile, stabilește mărimile și poziția graficii înainte de comandă.",
  },
  shopprint: {
    title: "Print personalizat și materiale publicitare cu livrare în România",
    intro: "Alegi produsul după suprafața pe care îl aplici și spațiul în care îl folosești. Comanda online îți permite să compari suporturi flexibile, autocolante și plăci rigide, cu livrare la adresa ta din România.",
    check: "Măsoară suprafața, verifică dacă produsul stă la interior sau exterior și alege finisarea. Pentru autocolant, ține cont de materialul suprafeței; pentru plăci, stabilește separat sistemul de prindere.",
  },
  homeprint: {
    title: "Fototapet și decor personalizat cu livrare în România",
    intro: "Pregătești decorul după camera ta, nu după localitatea în care locuiești. Măsoară peretele pentru fototapet sau alege locul tabloului, apoi verifică imaginea în formatul final înainte să comanzi.",
    check: "Pentru fototapet, notează lățimea și înălțimea peretelui, obstacolele și starea suprafeței. Pentru canvas sau afiș, verifică decupajul și calitatea fotografiei; instalarea decorului se organizează separat.",
  },
  tablou: {
    title: "Tablouri canvas din fotografii, livrate în România",
    intro: "Transformi fotografia ta într-un tablou și alegi adresa la care vrei să ajungă, inclusiv atunci când pregătești un cadou pentru cineva din alt județ. Formatul și încadrarea se verifică în configurator.",
    check: "Folosește fotografia originală, alege proporția potrivită și lasă spațiu pentru marginea întinsă pe șasiu. Verifică adresa destinatarului și datele comenzii înainte de plată.",
  },
};
export function nationalCoverage(origin: string) {
  return COVERAGE[siteKeyFromOrigin(origin) ?? "shopprint"];
}
