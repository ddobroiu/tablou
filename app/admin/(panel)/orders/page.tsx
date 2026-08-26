import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/lib/adminSession';
import { listOrders, StoredOrder } from '@/lib/orderStore';
import OrdersDashboard from './OrdersDashboard';
import { TrendingUp, ShoppingBag, CheckCircle2, AlertCircle } from 'lucide-react';

function fmtRON(n: number) {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 2 }).format(n);
}

function normalizeStatus(status?: string | null): 'in_progress' | 'fulfilled' | 'canceled' {
  if (status === 'fulfilled') return 'fulfilled';
  if (status === 'canceled') return 'canceled';
  return 'in_progress';
}

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  const session = verifyAdminSession(token);

  // Dacă nu există sesiune, layout-ul se ocupă de randare, dar aici putem afișa mesajul de acces interzis
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Acces Neautorizat</h1>
          <p className="mt-2 text-sm text-slate-500">
            Te rugăm să te autentifici pentru a accesa panoul de comenzi.
          </p>
          <a
            href="/admin/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500"
          >
            Mergi la Login
          </a>
        </div>
      </div>
    );
  }

  // Fetch comenzi pentru statistici și listare
  // NOTĂ: Asigură-te că funcția listOrders din lib/orderStore returnează și relația `items`
  let allOrders: StoredOrder[] = [];
  let fetchError = false;
  try {
    allOrders = await listOrders(200);
  } catch (error) {
    console.error('Error listing orders:', error);
    fetchError = true;
  }


  const now = Date.now();
  const totals = allOrders.reduce(
    (acc, order) => {
      const total = Number(order.total || 0);
      const statusKey = normalizeStatus((order as any).status);
      acc.totalValue += total;
      acc[statusKey] += 1;
      const createdAt = order.createdAt ? new Date(order.createdAt).getTime() : 0;
      if (createdAt && createdAt >= now - 24 * 60 * 60 * 1000) acc.last24h += 1;
      return acc;
    },
    { totalValue: 0, in_progress: 0, fulfilled: 0, canceled: 0, last24h: 0 }
  );
  const totalOrders = allOrders.length;
  const averageValue = totalOrders ? totals.totalValue / totalOrders : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-2">
      {/* Header Pagina */}
      <div className="flex flex-col gap-3 sm:gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Dashboard Comenzi</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Monitorizare în timp real și gestionare comenzi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400 font-medium uppercase">Ultima actualizare</p>
            <p className="text-sm text-slate-900 font-mono">{new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
        {/* Card Total Comenzi */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:bg-slate-50 transition-colors group touch-manipulation">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">Total Comenzi</p>
              <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900">{totalOrders}</h3>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20 transition-colors">
              <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs">
            <span className="flex items-center text-emerald-600 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
              +{totals.last24h}
            </span>
            <span className="text-slate-400">în ultimele 24h</span>
          </div>
        </div>

        {/* Card Venituri */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:bg-slate-50 transition-colors group touch-manipulation">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">Venit Total</p>
              <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900">{fmtRON(totals.totalValue)}</h3>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20 transition-colors">
              <TrendingUp size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Medie:</span>
            <span className="text-slate-900 font-mono">{fmtRON(averageValue)}</span>
          </div>
        </div>

        {/* Card In Lucru */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:bg-slate-50 transition-colors group touch-manipulation">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">În Prelucrare</p>
              <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900">{totals.in_progress}</h3>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/20 transition-colors">
              <AlertCircle size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 w-full bg-slate-50 rounded-full h-1.5">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totals.in_progress / (totalOrders || 1)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Card Finalizate */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:bg-slate-50 transition-colors group touch-manipulation">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">Finalizate</p>
              <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900">{totals.fulfilled}</h3>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-slate-200 transition-colors">
              <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs">
            <span className="text-rose-600">{totals.canceled} anulate</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-400">Rată succes {((totals.fulfilled / (totalOrders || 1)) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {fetchError && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">A apărut o eroare la preluarea datelor din baza de date. Te rugăm să reîncarci pagina.</p>
        </div>
      )}

      {/* Orders Dashboard Component - Tabelul Principal */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white backdrop-blur-sm overflow-hidden">
        <OrdersDashboard initialOrders={JSON.parse(JSON.stringify(allOrders))} />
      </div>
    </div>
  );
}
