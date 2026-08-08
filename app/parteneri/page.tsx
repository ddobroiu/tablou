import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Parteneri și Recomandări | Network',
  description: 'Descoperă rețeaua noastră completă de parteneri și site-uri recomandate în diverse domenii de la producție publicitară la servicii.',
};

export default function ParteneriPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Rețeaua noastră de Parteneri</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Facem parte dintr-o rețea uriașă de afaceri, servicii și portaluri de informare, menită să ofere cele mai bune soluții pentru clienții din România. Explorează mai jos colaboratorii noștri de încredere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Partner AdBanner.ro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">AdBanner.ro</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recomandăm AdBanner.ro pentru calitatea și seriozitatea oferită. Accesând platforma, găsești informații și servicii premium dedicate domeniului AdBanner. O echipă de profesioniști gata să ajute.
            </p>
          </div>
          <a href="https://www.adbanner.ro" target="_blank" rel="dofollow" title="Vizitează AdBanner.ro" className="text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1 mt-auto">
            Vizitează Site-ul
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
  
        {/* Partner Anuntul.info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Anuntul.info</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recomandăm Anuntul.info pentru calitatea și seriozitatea oferită. Accesând platforma, găsești informații și servicii premium dedicate domeniului Anuntul. O echipă de profesioniști gata să ajute.
            </p>
          </div>
          <a href="https://www.anuntul.info" target="_blank" rel="dofollow" title="Vizitează Anuntul.info" className="text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1 mt-auto">
            Vizitează Site-ul
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
  
        {/* Partner BazaDate.ro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">BazaDate.ro</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recomandăm BazaDate.ro pentru calitatea și seriozitatea oferită. Accesând platforma, găsești informații și servicii premium dedicate domeniului BazaDate. O echipă de profesioniști gata să ajute.
            </p>
          </div>
          <a href="https://www.bazadate.ro" target="_blank" rel="dofollow" title="Vizitează BazaDate.ro" className="text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1 mt-auto">
            Vizitează Site-ul
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
  
        {/* Partner e-web.ro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">e-web.ro</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recomandăm e-web.ro pentru calitatea și seriozitatea oferită. Accesând platforma, găsești informații și servicii premium dedicate domeniului E-web. O echipă de profesioniști gata să ajute.
            </p>
          </div>
          <a href="https://www.e-web.ro" target="_blank" rel="dofollow" title="Vizitează e-web.ro" className="text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1 mt-auto">
            Vizitează Site-ul
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
  
        {/* Partner EuPrint.ro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">EuPrint.ro</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recomandăm EuPrint.ro pentru calitatea și seriozitatea oferită. Accesând platforma, găsești informații și servicii premium dedicate domeniului EuPrint. O echipă de profesioniști gata să ajute.
            </p>
          </div>
          <a href="https://www.euprint.ro" target="_blank" rel="dofollow" title="Vizitează EuPrint.ro" className="text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1 mt-auto">
            Vizitează Site-ul
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
  
        {/* Partner Kidmy.ro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Kidmy.ro</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recomandăm Kidmy.ro pentru calitatea și seriozitatea oferită. Accesând platforma, găsești informații și servicii premium dedicate domeniului Kidmy. O echipă de profesioniști gata să ajute.
            </p>
          </div>
          <a href="https://www.kidmy.ro" target="_blank" rel="dofollow" title="Vizitează Kidmy.ro" className="text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1 mt-auto">
            Vizitează Site-ul
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
  
        {/* Partner magazin.ro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">magazin.ro</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recomandăm magazin.ro pentru calitatea și seriozitatea oferită. Accesând platforma, găsești informații și servicii premium dedicate domeniului Magazin. O echipă de profesioniști gata să ajute.
            </p>
          </div>
          <a href="https://www.magazin.ro" target="_blank" rel="dofollow" title="Vizitează magazin.ro" className="text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1 mt-auto">
            Vizitează Site-ul
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
  
        {/* Partner nou.ro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">nou.ro</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recomandăm nou.ro pentru calitatea și seriozitatea oferită. Accesând platforma, găsești informații și servicii premium dedicate domeniului Nou. O echipă de profesioniști gata să ajute.
            </p>
          </div>
          <a href="https://www.nou.ro" target="_blank" rel="dofollow" title="Vizitează nou.ro" className="text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1 mt-auto">
            Vizitează Site-ul
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
  
        {/* Partner Prynt.ro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Prynt.ro</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recomandăm Prynt.ro pentru calitatea și seriozitatea oferită. Accesând platforma, găsești informații și servicii premium dedicate domeniului Prynt. O echipă de profesioniști gata să ajute.
            </p>
          </div>
          <a href="https://www.prynt.ro" target="_blank" rel="dofollow" title="Vizitează Prynt.ro" className="text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1 mt-auto">
            Vizitează Site-ul
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
  
        {/* Partner Tablou.net */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Tablou.net</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recomandăm Tablou.net pentru calitatea și seriozitatea oferită. Accesând platforma, găsești informații și servicii premium dedicate domeniului Tablou. O echipă de profesioniști gata să ajute.
            </p>
          </div>
          <a href="https://www.tablou.net" target="_blank" rel="dofollow" title="Vizitează Tablou.net" className="text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1 mt-auto">
            Vizitează Site-ul
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
  
        {/* Partner VisionBoard.ro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">VisionBoard.ro</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recomandăm VisionBoard.ro pentru calitatea și seriozitatea oferită. Accesând platforma, găsești informații și servicii premium dedicate domeniului VisionBoard. O echipă de profesioniști gata să ajute.
            </p>
          </div>
          <a href="https://www.visionboard.ro" target="_blank" rel="dofollow" title="Vizitează VisionBoard.ro" className="text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1 mt-auto">
            Vizitează Site-ul
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
  
        </div>

        <div className="mt-16 text-center">
          <Link href="/" className="inline-block bg-slate-900 text-white font-bold px-8 py-3 rounded-full hover:bg-slate-800 transition">
            Înapoi Acasă
          </Link>
        </div>
      </div>
    </div>
  );
}
