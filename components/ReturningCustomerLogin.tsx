"use client";

import { useState, MouseEvent } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';

export default function ReturningCustomerLogin() {
    const { data: session } = useSession();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [view, setView] = useState<'login' | 'reset'>('login');
    const [loading, setLoading] = useState(false);

    const [resetMsg, setResetMsg] = useState<string | null>(null);
    const [resetErr, setResetErr] = useState<string | null>(null);

    const loggedIn = !!session?.user;

    async function passwordLogin(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!email || !password || loading) return;
        setLoading(true);
        try {
            await signIn('credentials', { email, password, callbackUrl: '/checkout' });
        } finally {
            setLoading(false);
        }
    }


    async function sendResetLink(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setResetMsg(null);
        setResetErr(null);
        try {
            const res = await fetch("/api/auth/request-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) throw new Error(data.message || "Nu s-a putut trimite emailul.");
            setResetMsg("Link-ul de resetare a fost trimis pe email.");
        } catch (e: any) {
            setResetErr(e?.message || "Eroare la trimitere.");
        } finally {
            setLoading(false);
        }
    }

    if (loggedIn) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="text-xs text-emerald-600">
                    Autentificat ca <strong>{session.user?.email}</strong>.
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-slate-900">
                    {view === 'login' ? 'Am deja cont' : 'Resetare Parolă'}
                </div>

                {view === 'login' ? (
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setView('reset'); }}
                        className="text-xs text-emerald-600 hover:text-emerald-500 underline underline-offset-2"
                    >
                        Ai uitat parola?
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setView('login');
                            setResetMsg(null);
                            setResetErr(null);
                        }}
                        className="text-xs text-gray-500 hover:text-slate-900 underline underline-offset-2"
                    >
                        Înapoi la autentificare
                    </button>
                )}
            </div>

            {view === 'login' && (
                <>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            autoComplete="email"
                        />

                        <div className="relative flex-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Parolă"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 pr-10"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            type="button"
                            onClick={passwordLogin}
                            disabled={!email || !password || loading}
                            className="flex-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition disabled:opacity-60"
                        >
                            {loading ? 'Se verifică...' : 'Autentificare'}
                        </button>
                    </div>

                </>
            )}

            {view === 'reset' && (
                <div className="space-y-3">
                    <p className="text-xs text-gray-500">
                        Introdu adresa de email pentru a primi instrucțiunile de resetare.
                    </p>
                    <input
                        type="email"
                        placeholder="Adresa de email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />

                    <button
                        type="button"
                        onClick={sendResetLink}
                        disabled={!email || loading}
                        className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition disabled:opacity-60"
                    >
                        {loading ? 'Se trimite...' : 'Trimite link resetare'}
                    </button>

                    {resetMsg && <p className="text-emerald-600 text-xs">{resetMsg}</p>}
                    {resetErr && <p className="text-red-600 text-xs">{resetErr}</p>}
                </div>
            )}
        </div>
    );
}

