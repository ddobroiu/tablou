"use client";

import { useState } from 'react';
import { Mail, Check, ShieldCheck, Sparkles } from 'lucide-react';

interface NewsletterProps {
  siteName: string;
  siteDomain: string;
}

export default function Newsletter({ siteName, siteDomain }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: siteDomain }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Te-ai abonat cu succes!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'A apărut o eroare. Încearcă din nou.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Eroare de conexiune. Încearcă din nou.');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  return (
    <section className="relative overflow-hidden py-16 px-4">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <div className="relative z-10 bg-white/40 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
          {/* Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                  <Sparkles size={12} />
                  Oferte Exclusive
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                Newsletter <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{siteName}</span>
              </h2>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Abonează-te pentru a primi cupoane de reducere, ghiduri de design și noutăți despre materialele noastre premium.
              </p>

              <div className="flex flex-wrap gap-6 items-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-green-500" size={18} />
                  <span>Fără Spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" size={18} />
                  <span>Dezabonare oricând</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-2xl p-2 flex flex-col gap-2">
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <Mail className="text-gray-400 mr-3" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="adresa.ta@email.com"
                      className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder:text-gray-400"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={status === 'loading' || !email}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    {status === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : status === 'success' ? (
                      <Check size={20} />
                    ) : (
                      'Vreau Ofertele'
                    )}
                  </button>
                </div>
              </form>

              {message && (
                <div className={`mt-4 text-center text-sm font-medium ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
