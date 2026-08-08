import React from 'react';

export default function SeoProductContent({ productName, productId }: { productName: string, productId?: string }) {
  
  // Custom descriptions based on product type
  let materialDesc = "soluția supremă pentru promovare și semnalistică de înaltă calitate.";
  let finisajDesc = "Fiecare produs pleacă de la noi complet finisat și pregătit pentru montaj, fără costuri ascunse.";
  
  if (productId?.includes('banner')) {
      materialDesc = "reclame din material poliplan (440g/mp - 510g/mp), rezistente la intemperii, o soluție excelentă pentru fațade și garduri.";
      finisajDesc = "Tiv perimetral (termosudat pentru a nu se rupe în vânt) și capse metalice din 30 în 30cm incluse gratuit.";
  } else if (productId?.includes('canvas')) {
      materialDesc = "tablouri premium printate pe pânză, perfect întinse pe șasiuri durabile din lemn, destinate decorațiunilor interioare.";
      finisajDesc = "Întindere profesională pe șasiu din lemn și agățătoare metalice incluse gratuit.";
  } else if (productId?.includes('autocolant') || productId?.includes('window-graphics')) {
      materialDesc = "printuri pe vinyl autoadeziv premium, rezistente la apă, excelente pentru colantări auto, vitrine sau perete.";
      finisajDesc = "Decupare pe contur precisă (cutter-plotter) conform graficii tale, gata de aplicare.";
  } else if (productId?.includes('afise')) {
      materialDesc = "postere și afișe printate la calitate fotografică pe hârtie premium (mată sau lucioasă).";
      finisajDesc = "Tăiere la format exact, garantând o integrare perfectă în rame sau sisteme click.";
  }

  return (
    <section className="bg-white py-16 mt-16 border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            {productName} la Comandă - Calitate Producător
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Realizăm <strong className="text-emerald-600">{productName.toLowerCase()} premium</strong>, rezistente în timp, produse eco-friendly la preț de producător. Printăm exact la dimensiunea ta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">De ce să ne alegi pe noi?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <strong className="block text-slate-900">Print UV de Înaltă Rezoluție</strong>
                  <span className="text-slate-600 text-sm">Cerneala UV se polimerizează instantaneu pe material. Culorile își păstrează vivacitatea ani de zile, fără să se decoloreze la soare.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <strong className="block text-slate-900">Finisaje Premium GRATUITE</strong>
                  <span className="text-slate-600 text-sm">{finisajDesc}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <strong className="block text-slate-900">Orice Dimensiune (Configurare Instantă)</strong>
                  <span className="text-slate-600 text-sm">Folosește configuratorul de proporții din partea de sus, introduci cotele exacte și afli prețul instant calculat strict la consum.</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-emerald-500/5">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Ce trebuie să știi înainte să comanzi:</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Produsele noastre, în special gama <strong className="text-slate-800">{productName}</strong>, reprezintă {materialDesc}
            </p>
            <p className="text-slate-600 leading-relaxed font-bold">
              Pentru pregătirea graficii: folosiți profilul de culoare CMYK și asigurați-vă că detaliile importante (texte, logo) au o distanță de siguranță de 3-5 cm față de margine pentru un finisaj estetic perfect!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
