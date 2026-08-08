import React from 'react';
import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/lib/adminSession';
import AdminSidebar from '@/components/AdminSidebar';
import { redirect } from 'next/navigation';

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="relative z-10 flex h-full w-full overflow-hidden">
      {/* Sidebar-ul rămâne vizibil pe desktop, ascuns implicit pe mobil de componenta AdminSidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <AdminSidebar />
      </div>
      {/* Pe mobil, AdminSidebar e probabil un overlay sau meniu burger gestionat intern */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        {/* Aici ar veni butonul de meniu mobil dacă nu e inclus în AdminSidebar */}
        <AdminSidebar />
      </div>

      {/* Zona Principală de Conținut */}
      <main className="flex-1 flex flex-col h-full w-full min-w-0 bg-transparent lg:ml-72 transition-all duration-300">
        {/* Wrapper Scrollabil */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 sm:p-4 lg:p-6 w-full h-full scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          <div className="w-full h-full max-w-[1920px] mx-auto flex flex-col">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
