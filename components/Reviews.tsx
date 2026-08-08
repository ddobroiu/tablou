"use client";
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Star, UserCircle } from 'lucide-react';

// Tipuri de date
type Review = {
  id: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
  user: {
    name?: string | null;
    image?: string | null;
  };
};

// Componentă pentru afișarea stelelor
const StarRating = ({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`
          ${rating > i ? 'text-yellow-400' : 'text-gray-300'}
          ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
        `}
        fill="currentColor"
      />
    ))}
  </div>
);


// Componenta principală pentru Recenzii
export default function Reviews({ productSlug }: { productSlug?: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Starea pentru formularul de adăugare
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const url = productSlug ? `/api/reviews?productSlug=${encodeURIComponent(productSlug)}` : `/api/reviews`;
      const res = await fetch(url, { credentials: 'same-origin' });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || 'Nu am putut încărca recenziile.');
      }
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err: any) {
      setError(err?.message || 'Eroare la încărcare recenzii.');
    } finally {
      setLoading(false);
    }
  }, [productSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewRating === 0 || newReviewContent.trim() === '') {
        setFormError("Rating-ul și conținutul sunt obligatorii.");
        return;
    }
    setSubmitting(true);
    setFormError(null);

    try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productSlug,
            rating: newReviewRating,
            title: newReviewTitle,
            content: newReviewContent,
          }),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "A apărut o eroare la trimitere.");
        }
        
        // Reset form & reload reviews
        setNewReviewRating(0);
        setNewReviewTitle('');
        setNewReviewContent('');
        await fetchReviews();

    } catch(err: any) {
        setFormError(err.message);
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 mt-12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Star className="text-emerald-500 fill-emerald-500 h-6 w-6" />
              Recenzii Verificate
            </h3>
            <p className="text-slate-500 mt-1">Impresii de la clienții noștri despre acest produs.</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Partea Stanga - Formular Adaugare (Sticky) */}
          <div className="lg:col-span-5 relative">
             <div className="sticky top-32">
                  {session?.user ? (
                    <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-colors pointer-events-none"></div>
                      
                      <h4 className="font-bold text-slate-900 mb-6 text-lg">Lasă-ne părerea ta</h4>
                      
                      <div className="space-y-5 relative z-10">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Acordă o notă</label>
                            <div className="flex items-center gap-2 bg-white w-fit px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
                                {[...Array(5)].map((_, i) => (
                                    <button type="button" key={i} onClick={() => setNewReviewRating(i + 1)} className="group/star outline-none">
                                        <Star className={`w-7 h-7 transition-all duration-300 ${newReviewRating > i ? 'text-amber-400 fill-amber-400 scale-110' : 'text-slate-200 hover:text-amber-300 hover:scale-110'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Titlu (Opțional)</label>
                            <input 
                                type="text" 
                                value={newReviewTitle} 
                                onChange={(e) => setNewReviewTitle(e.target.value)} 
                                placeholder="Cum ai rezuma experiența?" 
                                className="w-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl px-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Părerea ta</label>
                            <textarea 
                                value={newReviewContent} 
                                onChange={(e) => setNewReviewContent(e.target.value)} 
                                placeholder="Ce ți-a plăcut? Ce putem îmbunătăți?" 
                                rows={4} 
                                className="w-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none resize-none" 
                                required 
                            />
                        </div>

                        {formError && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                                {formError}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={submitting} 
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white hover:text-slate-950 h-14 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                          {submitting ? 'Se salvează...' : 'Trimite Recenzia'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                            <UserCircle className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="font-black text-slate-900 mb-2 text-lg">Ai cumpărat acest produs?</h4>
                        <p className="text-slate-500 text-sm mb-6">Autentifică-te pentru a lăsa o recenzie și a ajuta ceilalți clienți.</p>
                        <a href="/login" className="px-8 py-3 bg-slate-900 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-slate-900/10">
                            Intră în cont
                        </a>
                    </div>
                  )}
             </div>
          </div>

          {/* Partea Dreapta - Lista Recenzii */}
          <div className="lg:col-span-7">
            {loading ? (
                <div className="animate-pulse space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0"></div>
                            <div className="space-y-3 flex-1">
                                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                <div className="h-16 bg-slate-200 rounded w-full mt-2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">{error}</div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center">
                    <Star className="w-12 h-12 text-slate-300 mb-4" />
                    <h4 className="font-bold text-slate-700 text-lg mb-1">Lipsă Recenzii</h4>
                    <p className="text-slate-500">Acest produs nu are încă recenzii. Fii primul care sparge gheața!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="p-6 md:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    {review.user.image ? (
                                        <img src={review.user.image} alt={review.user.name || ''} className="w-12 h-12 rounded-full ring-4 ring-emerald-50" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                            <UserCircle className="w-6 h-6 text-slate-400" />
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-black text-slate-900 block leading-tight">{review.user.name || "Client Autentificat"}</span>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-flex uppercase tracking-wider">Achițizie Verificată</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:items-end gap-1">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${review.rating > i ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} `} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">{new Date(review.createdAt).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                            
                            <div className="mt-5 pl-0 sm:pl-16">
                                {review.title && <h4 className="font-bold text-slate-900 mb-2 text-lg">{review.title}</h4>}
                                <p className="text-slate-600 leading-relaxed font-light">{review.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
      </div>
    </div>
  );
}

