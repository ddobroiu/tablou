"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  Calendar,
  Package,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Truck,
  FileText,
  User,
  Mail,
  Loader2,
  RefreshCw,
  Type,
  Palette,
  UploadCloud,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowUpDown,
  Trash2,
  Download,
  Upload,
  Building2,
  Megaphone,
  Globe,
  LayoutGrid,
  List,
  Printer,
  Copy,
  Eye,
  Check,
  X,
  History,
  CornerDownRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import AdminAwbControl from "@/components/AdminAwbControl";
import AdminInvoiceControl from "@/components/AdminInvoiceControl";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- TYPES ---
type OrderItem = {
  id: string;
  name: string;
  qty: number;
  unit: any;
  total: any;
  artworkUrl?: string | null;
  metadata?: Record<string, any> | null;
};

type Order = {
  id: string;
  orderNo: number;
  createdAt: string | Date;
  status: string;
  paymentMethod: string;
  total: any;
  shippingFee: any;
  user?: {
    name: string | null;
    email: string;
    phone: string | null;
  };
  address: any;
  billing: any;
  marketing?: any;
  items: OrderItem[];
  awbNumber?: string | null;
  awbCarrier?: string | null;
  invoiceLink?: string | null;
  source?: string | null;
};

interface OrdersDashboardProps {
  initialOrders: Order[];
}

// --- UTILS ---
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (amount: any) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(Number(amount));
};

// --- COMPONENTS ---

// 1. Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; class: string; dot: string }> = {
    active: { 
      label: "În Lucru", 
      class: "bg-amber-500/10 text-amber-500 border-amber-500/20", 
      dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
    },
    fulfilled: { 
      label: "Finalizată", 
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", 
      dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
    },
    canceled: { 
      label: "Anulată", 
      class: "bg-rose-500/10 text-rose-400 border-rose-500/20", 
      dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" 
    },
    pending: { 
      label: "În așteptare", 
      class: "bg-blue-500/10 text-blue-400 border-blue-500/20", 
      dot: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
    }
  };

  const config = configs[status] || configs.pending;

  return (
    <div className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider", config.class)}>
      <span className={cn("inline-block w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </div>
  );
}

// 2. Client Initials
function ClientAvatar({ name, source }: { name: string; source?: string | null }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  let colorClass = 'from-emerald-500 to-teal-600'; // Default
  
  if (source === 'tablou.net') colorClass = 'from-purple-500 to-indigo-600';
  else if (source === 'prynt.ro') colorClass = 'from-pink-500 to-rose-600';
  else if (source === 'pliant.net') colorClass = 'from-blue-500 to-indigo-600';
  
  return (
    <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-black text-xs shadow-lg", colorClass)}>
      {initials}
    </div>
  );
}

// 3. Mini Progress Bar
function OrderProgress({ items }: { items: OrderItem[] }) {
  const total = items.length;
  const ready = items.filter(i => !!i.artworkUrl || i.metadata?.designOption === 'text_only' || i.metadata?.designOption === 'pro').length;
  const percentage = total > 0 ? (ready / total) * 100 : 0;
  
  return (
    <div className="flex flex-col gap-1 w-24">
      <div className="flex justify-between text-[9px] font-black uppercase text-zinc-500">
        <span>Grafică</span>
        <span className={ready === total ? "text-emerald-400" : "text-amber-400"}>{ready}/{total}</span>
      </div>
      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={cn("h-full rounded-full transition-all duration-500", ready === total ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-amber-500")}
        />
      </div>
    </div>
  );
}

// 4. Source Badge
function SourceBadge({ source }: { source?: string | null }) {
  if (!source) return null;
  const clean = source.replace('.ro', '').replace('prynt', 'Shop').replace('prynt', 'Prynt').replace('.net', '');
  
  let colorStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"; // prynt/default
  if (source.includes('prynt')) colorStyle = "bg-purple-500/10 text-purple-400 border-purple-500/20";
  if (source.includes('tablou')) colorStyle = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  if (source.includes('pliant')) colorStyle = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  
  return (
    <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tighter", colorStyle)}>
      {clean}
    </span>
  );
}

// 5. Main Dashboard View
export default function OrdersDashboard({ initialOrders = [] }: OrdersDashboardProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (newStatus === "canceled" && !confirm("Anulezi comanda?")) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/order/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Err");
      router.refresh();
    } catch (e) {
      alert("Eroare la update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("ȘTERGI DEFINITIV? Această acțiune nu poate fi anulată!")) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Err");
      setSelectedOrderId(null);
      router.refresh();
    } catch (e) {
      alert("Eroare la ștergere.");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return (initialOrders || []).filter((order) => {
      const s = searchTerm.toLowerCase();
      const address = order.address || {};
      const clientName = (address.nume_prenume || address.nume || order.user?.name || "").toLowerCase();
      const clientEmail = (address.email || order.user?.email || "").toLowerCase();
      const clientPhone = (address.telefon || order.user?.phone || "").toLowerCase();
      
      const matchesSearch = 
        order.orderNo.toString().includes(s) || 
        clientEmail.includes(s) || 
        clientName.includes(s) || 
        clientPhone.includes(s);
        
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesSource = sourceFilter === "all" || order.source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [initialOrders, searchTerm, statusFilter, sourceFilter]);

  const selectedOrder = useMemo(() => 
    initialOrders.find(o => o.id === selectedOrderId), 
    [initialOrders, selectedOrderId]
  );

  return (
    <div className="flex flex-col h-full bg-[#05070f] relative">
      
      {/* FILTER BAR - Floating Style */}
      <div className="p-4 sm:p-6 border-b border-white/5 bg-zinc-900/10 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative group flex-1 md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Caută în comenzi (Nr, Nume, Email)..."
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="p-2.5 bg-zinc-900/50 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-colors md:hidden">
                <Filter size={18} />
             </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
             {/* Source Select */}
             <div className="relative group">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <select 
                  className="bg-zinc-900/50 border border-white/10 rounded-2xl py-2 pl-9 pr-8 text-xs font-bold text-zinc-300 focus:outline-none focus:border-emerald-500/40 appearance-none cursor-pointer"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                >
                  <option value="all">Sursă: Toate</option>
                  <option value="tablou.net">Tablou</option>
                  <option value="prynt.ro">Prynt</option>
                  <option value="euprint.ro">EuPrint</option>
                  <option value="pliant.net">Pliant.net</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3 h-3 pointer-events-none" />
             </div>

             {/* Status Select */}
             <div className="relative group">
                <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <select 
                  className="bg-zinc-900/50 border border-white/10 rounded-2xl py-2 pl-9 pr-8 text-xs font-bold text-zinc-300 focus:outline-none focus:border-emerald-500/40 appearance-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Status: Toate</option>
                  <option value="active">În Lucru</option>
                  <option value="fulfilled">Finalizate</option>
                  <option value="canceled">Anulate</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3 h-3 pointer-events-none" />
             </div>

             <div className="w-px h-6 bg-white/5 mx-2" />
             
             <div className="flex bg-zinc-900/50 border border-white/10 rounded-2xl p-1">
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-1.5 rounded-xl transition-all", viewMode === 'list' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-white")}
                >
                  <List size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-1.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-white")}
                >
                  <LayoutGrid size={16} />
                </button>
             </div>

             <button 
                onClick={() => router.refresh()}
                className="p-2.5 bg-zinc-900/50 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-95"
              >
                <RefreshCw size={18} />
             </button>
          </div>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[1000px] p-4 sm:p-6 max-w-[1920px] mx-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[11px] font-black uppercase text-zinc-500 px-6">
                <th className="text-left pb-4 pl-6 w-16">ID</th>
                <th className="text-left pb-4">Client / Sursă</th>
                <th className="text-left pb-4">Status / Progres</th>
                <th className="text-left pb-4">Plată / Total</th>
                <th className="text-left pb-4">Dată</th>
                <th className="text-right pb-4 pr-6">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isSelected = selectedOrderId === order.id;
                const address = order.address || {};
                const name = address.nume_prenume || address.nume || order.user?.name || "Client Necunoscut";
                const isCard = order.paymentMethod === "Card";

                return (
                  <motion.tr 
                    key={order.id}
                    layoutId={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={cn(
                      "group cursor-pointer transition-all duration-300 relative",
                      isSelected ? "z-10" : "hover:z-10"
                    )}
                  >
                    {/* Background Overlay */}
                    <td colSpan={6} className="absolute inset-0 p-0 pointer-events-none">
                      <div className={cn(
                        "w-full h-full rounded-[2rem] border transition-all duration-300",
                        isSelected 
                          ? "bg-zinc-800/80 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 scale-[1.01]" 
                          : "bg-zinc-900/40 border-white/5 group-hover:bg-zinc-800/60 group-hover:border-white/10 group-hover:scale-[1.005]"
                      )} />
                    </td>

                    {/* Content Cells */}
                    <td className="relative py-5 pl-8">
                       <span className="font-mono text-zinc-400 text-sm font-bold">#{order.orderNo}</span>
                    </td>
                    
                    <td className="relative py-5">
                      <div className="flex items-center gap-3">
                        <ClientAvatar name={name} source={order.source} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-white truncate">{name}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <SourceBadge source={order.source} />
                            <span className="text-[10px] text-zinc-500 font-bold tracking-tight truncate">{address.email || order.user?.email || "fara@email.com"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="relative py-5">
                      <div className="flex items-center gap-6">
                        <StatusBadge status={order.status} />
                        <OrderProgress items={order.items} />
                      </div>
                    </td>

                    <td className="relative py-5">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          {isCard ? <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> : <Banknote className="w-3.5 h-3.5 text-amber-500" />}
                          <span className="text-sm font-black text-white">{formatMoney(order.total)}</span>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{isCard ? 'Plătit' : 'Plată livrare'}</span>
                      </div>
                    </td>

                    <td className="relative py-5">
                       <div className="flex flex-col">
                         <span className="text-xs font-bold text-zinc-300">{formatDate(order.createdAt).split(',')[0]}</span>
                         <span className="text-[10px] font-medium text-zinc-500">{formatDate(order.createdAt).split(',')[1]}</span>
                       </div>
                    </td>

                    <td className="relative py-5 pr-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95">
                            <ChevronRight size={18} />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="py-40 text-center">
              <Package size={48} className="mx-auto text-zinc-800 mb-6" />
              <h3 className="text-2xl font-black text-white">Nicio comandă găsită</h3>
              <p className="text-zinc-500 mt-2">Încearcă să schimbi filtrele sau caută după un alt cuvânt cheie.</p>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL DRAWER */}
      <AnimatePresence>
        {selectedOrderId && selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-[95%] bg-[#0a0c14] border-l border-white/10 z-[101] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedOrderId(null)}
                    className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-black text-white">Comanda #{selectedOrder.orderNo}</h2>
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                </div>
                 <div className="flex items-center gap-3">
                   <Link 
                     href={`/admin/orders/${selectedOrder.id}`}
                     className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-all text-xs font-bold border border-white/5"
                   >
                      <ExternalLink size={14} />
                      Pagina Editare
                   </Link>
                   <SourceBadge source={selectedOrder.source} />
                   <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                      {selectedOrder.status}
                   </div>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800">
                
                {/* 1. Status Section */}
                <div className="grid grid-cols-3 gap-4">
                   <div className="p-4 rounded-[2rem] bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-black text-zinc-500 uppercase mb-2">Plată</span>
                      <div className="text-white font-bold text-sm flex items-center gap-1.5">
                        {selectedOrder.paymentMethod === 'Card' ? <CreditCard size={16} className="text-emerald-500" /> : <Banknote size={16} className="text-amber-500" />}
                        {selectedOrder.paymentMethod}
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-1">{formatMoney(selectedOrder.total)}</span>
                   </div>
                   <div className="p-4 rounded-[2rem] bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-black text-zinc-500 uppercase mb-2 text-blue-400">Livrare</span>
                      <AdminAwbControl orderId={selectedOrder.id} currentAwb={selectedOrder.awbNumber} />
                   </div>
                   <div className="p-4 rounded-[2rem] bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-black text-zinc-500 uppercase mb-2 text-purple-400">Factură</span>
                      <AdminInvoiceControl id={selectedOrder.id} invoiceLink={selectedOrder.invoiceLink} />
                   </div>
                </div>

                {/* 2. Customer & Shipping & Billing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] border-l-2 border-emerald-500 pl-3">Client</h3>
                    <div className="bg-zinc-900/30 rounded-3xl p-5 border border-white/5 space-y-3 h-full">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                           <User size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white leading-tight">{selectedOrder.address.nume_prenume || selectedOrder.address.nume || "N/A"}</span>
                          <span className="text-xs text-zinc-500">{selectedOrder.address.email || "fara@email.com"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-300">
                        <Phone size={14} className="text-zinc-500" />
                        {selectedOrder.address.telefon || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] border-l-2 border-blue-500 pl-3">Adresă Livrare</h3>
                    <div className="bg-zinc-900/30 rounded-3xl p-5 border border-white/5 space-y-3 h-full">
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-zinc-500 mt-1 shrink-0" />
                        <div className="flex flex-col text-sm text-zinc-300 leading-snug">
                          <span className="font-bold text-white">{selectedOrder.address.localitate}, {selectedOrder.address.judet}</span>
                          <span>{selectedOrder.address.strada_nr}</span>
                          {selectedOrder.address.postCode && <span className="text-[10px] text-zinc-500 mt-1">COD: {selectedOrder.address.postCode}</span>}
                        </div>
                      </div>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedOrder.address.strada_nr}, ${selectedOrder.address.localitate}, ${selectedOrder.address.judet}`)}`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-white/5"
                      >
                        <Globe size={14} /> Vezi pe Hartă
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] border-l-2 border-purple-500 pl-3">Date Facturare</h3>
                    <div className="bg-zinc-900/30 rounded-3xl p-5 border border-white/5 space-y-3 h-full">
                      {selectedOrder.billing ? (
                        <div className="flex flex-col text-sm text-zinc-300 leading-snug space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 size={16} className="text-zinc-500" />
                            <span className="font-bold text-white">{selectedOrder.billing.nume_companie || selectedOrder.billing.nume_prenume}</span>
                          </div>
                          {selectedOrder.billing.cui && (
                            <div className="flex flex-col pl-6">
                              <span className="text-[10px] text-zinc-500 font-black uppercase">CUI / CIF</span>
                              <span className="text-xs">{selectedOrder.billing.cui}</span>
                            </div>
                          )}
                          {selectedOrder.billing.nrc && (
                            <div className="flex flex-col pl-6">
                              <span className="text-[10px] text-zinc-500 font-black uppercase">Reg. Com.</span>
                              <span className="text-xs">{selectedOrder.billing.nrc}</span>
                            </div>
                          )}
                          <div className="flex flex-col pl-6">
                            <span className="text-[10px] text-zinc-500 font-black uppercase">Sediu</span>
                            <span className="text-xs">{selectedOrder.billing.localitate}, {selectedOrder.billing.judet}</span>
                            <span className="text-[11px] text-zinc-400">{selectedOrder.billing.adresa}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-20 text-zinc-500 italic text-xs">
                           Aceleași cu datele de livrare
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Items List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] border-l-2 border-amber-500 pl-3">Produse ({selectedOrder.items.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => {
                      const meta = item.metadata || {};
                      const isReady = !!item.artworkUrl || meta.designOption === 'text_only' || meta.designOption === 'pro';

                      return (
                        <div key={item.id} className="bg-zinc-900/40 rounded-[2rem] p-5 border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4">
                           <div className="flex items-start justify-between">
                             <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden box-content shadow-inner">
                                   {item.artworkUrl ? (
                                     <img src={item.artworkUrl} className="w-full h-full object-cover opacity-80" alt="" />
                                   ) : (
                                     <Package size={24} className="text-zinc-600" />
                                   )}
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-lg font-black text-white leading-tight">{item.name}</span>
                                   <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Cantitate: {item.qty} buc</span>
                                </div>
                             </div>
                             <div className="flex flex-col items-end">
                                <span className="text-sm font-black text-white">{formatMoney(item.total || Number(item.unit) * item.qty)}</span>
                                <span className="text-[10px] text-zinc-500 mt-1">{formatMoney(item.unit)} / buc</span>
                             </div>
                           </div>

                           {/* Metadata Detail Tags */}
                           {meta && Object.keys(meta).length > 0 && (
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                               {Object.entries(meta).map(([key, val]) => {
                                 if (['designOption', 'textDesign', 'artworkUrl', 'price', 'totalAmount'].includes(key)) return null;
                                 if (!val) return null;
                                 return (
                                   <div key={key} className="bg-zinc-800/50 p-2 rounded-xl border border-white/5 hover:bg-zinc-800 transition-colors">
                                      <span className="text-[9px] font-black text-zinc-500 uppercase block mb-0.5">{key}</span>
                                      <span className="text-[11px] font-bold text-zinc-300 break-words">{String(val)}</span>
                                   </div>
                                 );
                               })}
                             </div>
                           )}

                           {/* Item Actions (Artwork) */}
                           <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 {isReady ? (
                                   <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                      <CheckCircle2 size={12} /> Grafică Gata
                                   </div>
                                 ) : (
                                   <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
                                      <AlertCircle size={12} /> În așteptare
                                   </div>
                                 )}
                              </div>

                              <div className="flex items-center gap-2">
                                 {item.artworkUrl && (
                                   <a 
                                     href={item.artworkUrl} 
                                     target="_blank"
                                     className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                                   >
                                     <Download size={14} /> Fișier Print
                                   </a>
                                 )}
                                 {meta.designOption === 'text_only' && (
                                   <div className="px-4 py-1.5 bg-zinc-800 text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                                      Text: {meta.textDesign}
                                   </div>
                                 )}
                              </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Action Center */}
                <div className="space-y-4 pt-10 pb-10">
                   <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] border-l-2 border-zinc-700 pl-3">Centru de Control</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-2 h-14 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-3xl text-sm font-black text-white transition-all active:scale-95 group">
                        <History className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300" />
                        Istoric Comandă
                      </button>
                      <button className="flex items-center justify-center gap-2 h-14 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-3xl text-sm font-black text-white transition-all active:scale-95 group">
                        <Printer className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300" />
                        Printează Detalii
                      </button>
                      
                      {/* Status Change - Special Block */}
                      <div className="col-span-2 p-1.5 bg-zinc-900 border border-white/10 rounded-[2.5rem] flex items-center justify-between">
                         <div className="pl-6 flex flex-col">
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Update status comandă</span>
                            <span className="text-sm font-bold text-white uppercase">{selectedOrder.status}</span>
                         </div>
                         <div className="flex gap-1">
                            <button 
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(selectedOrder.id, selectedOrder.status === 'fulfilled' ? 'active' : 'fulfilled')}
                              className="h-12 px-6 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                            >
                               {isUpdating ? <Loader2 className="animate-spin" /> : (selectedOrder.status === 'fulfilled' ? 'Pune în Lucru' : 'Finalizează')}
                            </button>
                            <button 
                              onClick={() => handleStatusChange(selectedOrder.id, 'canceled')}
                              className="h-12 w-12 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-all flex items-center justify-center"
                            >
                               <X />
                            </button>
                         </div>
                      </div>

                      <button 
                        onClick={() => handleDeleteOrder(selectedOrder.id)}
                        disabled={isUpdating}
                        className="col-span-2 flex items-center justify-center gap-2 h-14 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-3xl text-sm font-black text-rose-500 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                        Șterge Comanda
                      </button>
                   </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #18181b;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #27272a;
        }
        
        @supports (-webkit-touch-callout: none) {
          .pb-safe {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </div>
  );
}
