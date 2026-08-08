import React from 'react';

export const metadata = {
  title: 'Tablou Admin Panel',
  robots: 'noindex, nofollow',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // FIX: h-[100dvh] asigură înălțimea corectă pe mobil (fără bara de browser)
    <div className="h-[100dvh] w-full overflow-hidden bg-[#05070f] text-zinc-200 font-sans selection:bg-emerald-500/30 fixed inset-0">
      {/* Global Admin Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px] opacity-30" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 h-full flex flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
