"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { COOKIE_NAME, COOKIE_ROLE } from "@/lib/auth";
import { api } from "@/lib/api";

const SHOW_OPTIONS = [5, 10, 25, 50];
const HARI = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

// Icons 
const IconBox           = ({ size=18, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IconAlertTriangle = ({ size=18, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IconTrendingDown  = ({ size=18, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>;
const IconCheckCircle   = ({ size=18, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconPlus          = ({ size=15, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconEdit          = ({ size=13, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash         = ({ size=13, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconSearch        = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconCheck         = ({ size=15, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconX             = ({ size=15, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconSort          = ({ size=12, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 5 19 12"/></svg>;
const IconSortDown      = ({ size=12, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 19 19 12"/></svg>;
const IconGrid          = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IconList          = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IconPackageCheck  = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16l2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IconFlame         = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
const IconClock         = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

//  Types 
type POStatus = "pending" | "approved" | "supplier_acc" | "completed" | "rejected";

interface StockItem {
  id: string;
  nama: string;
  kategori: string;
  jumlah: number;
  satuan: string;
  max: number;
  harga: number;
  tanggalExpired?: string | null;
  pendingPO?: { jumlah: number; status: POStatus; supplierNama?: string } | null;
}

interface WasteItem {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  kategori: string;
  tanggalExpired: string;
  tanggalCatat: string;
  alasan: string;
}

function StatusBadge({ jumlah, max }: { jumlah: number; max: number }) {
  if (jumlah === 0) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-red-100 text-red-600">
      <IconX size={9} color="#dc2626" /> Habis
    </span>
  );
  if (jumlah / max < 0.3) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background:"#EFF0A3", color:"#212121" }}>
      <IconAlertTriangle size={9} color="#92650a" /> Menipis
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background:"#CFDECA", color:"#212121" }}>
      <IconCheck size={9} color="#2d6a3f" /> Tersedia
    </span>
  );
}

function ExpiredBadge({ tanggalExpired }: { tanggalExpired?: string | null }) {
  if (!tanggalExpired) return (
    <span className="text-[10px]" style={{ color:"rgba(33,33,33,0.25)" }}>—</span>
  );
  const exp = new Date(tanggalExpired);
  const now = new Date();
  const diffDays = Math.floor((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const label = exp.toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" });
  if (diffDays < 0) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background:"#fee2e2", color:"#991b1b" }}>
      ✕ Expired {label}
    </span>
  );
  if (diffDays <= 7) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background:"#FEF9D6", color:"#7A5A00" }}>
      ⚠ Exp {label}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background:"rgba(33,33,33,0.07)", color:"rgba(33,33,33,0.55)" }}>
      <IconClock size={9} color="rgba(33,33,33,0.40)"/> {label}
    </span>
  );
}

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

//  Helper: check & auto-move expired items
function autoMoveExpired(
  items: StockItem[],
  existingWaste: WasteItem[]
): { remaining: StockItem[]; newWaste: WasteItem[] } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const remaining: StockItem[] = [];
  const newWaste: WasteItem[] = [...existingWaste];

  for (const item of items) {
    if (item.tanggalExpired) {
      const exp = new Date(item.tanggalExpired);
      exp.setHours(0, 0, 0, 0);
      // Kalau sudah expired, langsung pindahkan ke waste (kalau belum ada di waste) dan jangan masukkan ke remaining
      if (exp < today) {
        const alreadyInWaste = existingWaste.some(
          w => w.nama === item.nama && w.tanggalExpired === item.tanggalExpired
        );
        if (!alreadyInWaste) {
          newWaste.unshift({
            id: `auto-${item.id}-${Date.now()}`,
            nama: item.nama,
            jumlah: item.jumlah,
            satuan: item.satuan,
            kategori: item.kategori,
            tanggalExpired: item.tanggalExpired,
            tanggalCatat: new Date().toISOString().split("T")[0],
            alasan: "Otomatis — melewati tanggal expired",
          });
        }
        continue;
      }
    }
    remaining.push(item);
  }

  return { remaining, newWaste };
}

export default function StockPage() {
  const [mounted, setMounted]   = useState(false);
  const [animIn, setAnimIn]     = useState(false);
  const [tanggal, setTanggal]   = useState("");
  const [search, setSearch]     = useState("");
  const [showCount, setShowCount] = useState(10);
  const [sortCol, setSortCol]   = useState<string | null>(null);
  const [sortDir, setSortDir]   = useState<"asc" | "desc">("asc");
  const [page, setPage]         = useState(1);
  const [data, setData]         = useState<StockItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleteModal, setDeleteModal] = useState<any | null>(null);
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [userName, setUserName] = useState("Andi Pratama");
  const [userRole, setUserRole] = useState("user");
  const [userInitials, setUserInitials] = useState("AP");

  // Waste states
  const [filterTab, setFilterTab]         = useState<"stok" | "waste">("stok");
  const [wasteLog, setWasteLog]           = useState<WasteItem[]>([]);
  const [deleteWasteModal, setDeleteWasteModal] = useState<WasteItem | null>(null);
  const [wasteSearch, setWasteSearch]     = useState("");
  

  // Banner for auto-moved items this session
  const [autoMovedCount, setAutoMovedCount] = useState(0);

  const adaStokHabis  = data.some(d => d.jumlah === 0);
  const kategoriList  = ["Semua", ...Array.from(new Set(data.map(d => d.kategori)))];
  const adaPOIncoming = data.some(d => d.pendingPO && d.pendingPO.status !== "rejected");

  const loadStok = async () => {
    try {
      setLoading(true);
      const res = await api.stok.getAll();
      const mapped: StockItem[] = res.data.map((item: any) => ({
        id: String(item.id),
        nama: item.nama,
        jumlah: item.jumlah_saat_ini,
        kategori: item.klasifikasi?.jenis || "Umum",
        max: item.max || 100,
        harga: item.harga || 15000,
        satuan: item.satuan,
        tanggalExpired: item.tanggal_expired || null,
        pendingPO: item.purchase_order ? {
          jumlah: item.purchase_order.jumlah || 0,
          status: item.purchase_order.status as POStatus,
          supplierNama: item.purchase_order.supplier_nama,
        } : null,
      }));

      // Auto-move expired items
      setWasteLog(prev => {
        const { remaining, newWaste } = autoMoveExpired(mapped, prev);
        const addedCount = newWaste.length - prev.length;
        if (addedCount > 0) {
          setAutoMovedCount(addedCount);
          setToast({ msg: `${addedCount} barang expired otomatis dipindahkan ke waste.`, type: "success" });
        }
        setData(remaining);
        return newWaste;
      });
    } catch (err: any) {
      setToast({ msg: err.message || "Gagal memuat stok.", type:"error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const name = Cookies.get(COOKIE_NAME) || "Andi Pratama";
    const role = Cookies.get(COOKIE_ROLE) || "user";
    setUserName(decodeURIComponent(name));
    setUserRole(role);
    setUserInitials(decodeURIComponent(name).split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase());
    loadStok();
    const now = new Date();
    setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    setTimeout(() => { setMounted(true); setAnimIn(true); }, 100);
  }, []);

  const isAdmin = userRole === "admin" || userRole === "owner";

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  // Waste helpers 
  function handleDeleteWaste(item: WasteItem) {
    setWasteLog(prev => prev.filter(w => w.id !== item.id));
    setDeleteWasteModal(null);
    setToast({ msg: `Catatan waste ${item.nama} dihapus.`, type:"success" });
  }

  // Stock filter / sort / paginate
  const filtered = data.filter(d => {
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase()) || d.satuan.toLowerCase().includes(search.toLowerCase());
    const matchKat = filterKategori === "Semua" || d.kategori === filterKategori;
    return matchSearch && matchKat;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const va = (a as any)[sortCol], vb = (b as any)[sortCol];
    if (typeof va === "number") return sortDir === "asc" ? va - vb : vb - va;
    return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });

  const totalPages = Math.ceil(sorted.length / showCount);
  const paginated  = sorted.slice((page-1)*showCount, page*showCount);

  // Waste filter
  const filteredWaste = wasteLog.filter(w =>
    w.nama.toLowerCase().includes(wasteSearch.toLowerCase()) ||
    w.kategori.toLowerCase().includes(wasteSearch.toLowerCase()) ||
    w.alasan.toLowerCase().includes(wasteSearch.toLowerCase())
  );

  function handleSort(col: string) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  }

  async function handleDelete(item: any) {
    try {
      await api.stok.delete(item.id);
      setData(prev => prev.filter(d => d.id !== item.id));
      setDeleteModal(null);
      setToast({ msg:`${item.nama} berhasil dihapus.`, type:"success" });
    } catch (err: any) {
      setToast({ msg: err.message || "Gagal menghapus stok.", type:"error" });
    }
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <span style={{ color:"rgba(33,33,33,0.20)", display:"inline-flex" }}><IconSort size={11}/></span>;
    return <span style={{ color:"#212121", display:"inline-flex" }}>{sortDir === "asc" ? <IconSort size={11}/> : <IconSortDown size={11}/>}</span>;
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)} }
        @keyframes blob { 0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-30px) scale(1.07)}66%{transform:translate(-25px,25px) scale(0.95)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes pulseGreen { 0%,100%{opacity:1}50%{opacity:0.55} }
        @keyframes shimmer { 0%{background-position:-200% 0}100%{background-position:200% 0} }

        .anim-fade-up{animation:fadeUp 0.6s cubic-bezier(.22,1,.36,1) both}
        .d50{animation-delay:.05s}.d100{animation-delay:.10s}.d150{animation-delay:.15s}
        .d200{animation-delay:.20s}.d250{animation-delay:.25s}.d300{animation-delay:.30s}
        .d350{animation-delay:.35s}.d400{animation-delay:.40s}
        .blob{animation:blob 9s ease-in-out infinite}
        .blob2{animation:blob 12s ease-in-out infinite reverse;animation-delay:3s}
        .pulse-green{animation:pulseGreen 2s ease-in-out infinite}

        .zoom-card{transition:transform .30s cubic-bezier(.22,1,.36,1),box-shadow .30s cubic-bezier(.22,1,.36,1);will-change:transform;cursor:default}
        .zoom-card:hover{transform:scale(1.018);box-shadow:0 20px 48px rgba(33,33,33,0.10)}

        .tbl-row{transition:background .18s,transform .22s cubic-bezier(.22,1,.36,1)}
        .tbl-row:hover{background:rgba(255,255,255,0.70) !important;transform:scale(1.008) translateX(2px)}

        .btn-primary{background:#2a1f08;color:#ffffff;border:none;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;padding:10px 20px;font-size:13px;cursor:pointer;letter-spacing:0.01em;transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s,background .18s;display:inline-flex;align-items:center;gap:7px}
        .btn-primary:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 28px rgba(42,31,8,0.25);background:#3d2e0e}
        .btn-primary:active{transform:scale(0.97)}

        .btn-waste{background:#7A1A1A;color:#ffffff;border:none;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;padding:10px 20px;font-size:13px;cursor:pointer;letter-spacing:0.01em;transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s,background .18s;display:inline-flex;align-items:center;gap:7px}
        .btn-waste:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 28px rgba(122,26,26,0.28);background:#9b2020}
        .btn-waste:active{transform:scale(0.97)}

        .btn-ghost{background:rgba(33,33,33,0.06);color:#212121;border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;padding:7px 14px;font-size:12px;cursor:pointer;transition:background .18s,transform .2s;display:inline-flex;align-items:center;gap:5px}
        .btn-ghost:hover{background:rgba(33,33,33,0.12);transform:scale(1.03)}

        .btn-danger{background:rgba(220,38,38,0.08);color:#dc2626;border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;padding:7px 14px;font-size:12px;cursor:pointer;transition:background .18s,transform .2s;display:inline-flex;align-items:center;gap:5px}
        .btn-danger:hover{background:rgba(220,38,38,0.15);transform:scale(1.03)}

        .search-input{border:1.5px solid rgba(33,33,33,0.12);border-radius:12px;padding:9px 14px 9px 38px;font-size:13px;background:rgba(255,255,255,0.7);color:#212121;outline:none;width:100%;max-width:260px;font-family:'Inter',sans-serif;transition:border-color .2s,box-shadow .2s}
        .search-input:focus{border-color:rgba(33,33,33,0.35);box-shadow:0 0 0 3px rgba(33,33,33,0.06)}
        @media (max-width:640px) {
          .search-input{max-width:100%;padding-left:36px}
        }

        .select-input{border:1.5px solid rgba(33,33,33,0.12);border-radius:10px;padding:8px 12px;font-size:12px;font-family:'Inter',sans-serif;background:rgba(255,255,255,0.7);color:#212121;outline:none;cursor:pointer}

        .page-btn{width:32px;height:32px;border-radius:8px;border:none;font-size:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .18s}
        .page-btn.active{background:#212121;color:#EFF0A3}
        .page-btn:not(.active){background:rgba(33,33,33,0.06);color:#212121}
        .page-btn:not(.active):hover{background:rgba(33,33,33,0.14)}
        .page-btn:disabled{opacity:0.3;cursor:default}

        .modal-overlay{animation:fadeIn .18s ease both}
        .modal-box{animation:fadeUp .22s cubic-bezier(.22,1,.36,1) both}
        .toast{animation:slideIn .35s cubic-bezier(.22,1,.36,1) both}

        .stat-strip{display:flex;background:rgba(255,255,255,0.52);border:1px solid rgba(200,180,130,0.22);border-radius:16px;overflow:hidden;backdrop-filter:blur(14px)}
        .stat-strip-item{flex:1;padding:16px 18px;display:flex;align-items:center;gap:13px;position:relative;cursor:default;transition:background .2s}
        .stat-strip-item:hover{background:rgba(255,255,255,0.72)}
        .stat-strip-item+.stat-strip-item::before{content:'';position:absolute;left:0;top:20%;height:60%;width:1px;background:rgba(180,155,100,0.20)}
        .stat-strip-icon{width:38px;height:38px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:transform .25s cubic-bezier(.22,1,.36,1)}
        .stat-strip-item:hover .stat-strip-icon{transform:scale(1.14) rotate(4deg)}
        /* Responsive: allow stat strip items to wrap on small screens */
        @media (max-width:640px) {
          .stat-strip{flex-wrap:wrap}
          .stat-strip-item{flex:1 1 160px;padding:12px}
          .stat-strip-item+.stat-strip-item::before{display:none}
        }

        .progress-bar{transition:width 1.2s cubic-bezier(.22,1,.36,1)}
        .sort-th{cursor:pointer;user-select:none}
        .sort-th:hover{color:#212121 !important}

        .kat-pill{padding:5px 13px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;border:none;transition:all .18s;font-family:'Plus Jakarta Sans',sans-serif}
        .kat-pill.on{background:#2a1f08;color:#EFF0A3}
        .kat-pill.off{background:rgba(42,31,8,0.08);color:rgba(42,31,8,0.50)}
        .kat-pill.off:hover{background:rgba(42,31,8,0.15);color:#2a1f08}

        .waste-pill{padding:5px 13px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;border:none;transition:all .18s;font-family:'Plus Jakarta Sans',sans-serif}
        .waste-pill.on{background:#7A1A1A;color:#EFF0A3}
        .waste-pill.off{background:rgba(122,26,26,0.08);color:rgba(122,26,26,0.55)}
        .waste-pill.off:hover{background:rgba(122,26,26,0.15);color:#7A1A1A}

        .view-toggle-btn{width:30px;height:30px;border-radius:8px;border:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .18s}
        .view-toggle-btn.on{background:#2a1f08;color:#EFF0A3}
        .view-toggle-btn.off{background:rgba(42,31,8,0.08);color:rgba(42,31,8,0.40)}
        .view-toggle-btn.off:hover{background:rgba(42,31,8,0.15);color:#2a1f08}

        .stk-grid-card{border:1.5px solid rgba(33,33,33,0.09);border-radius:16px;padding:20px;background:rgba(255,255,255,0.80);transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s,border-color .2s;cursor:default}
        .stk-grid-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(42,31,8,0.10);border-color:rgba(42,31,8,0.20)}

        .waste-card{border:1.5px solid rgba(122,26,26,0.12);border-radius:16px;padding:18px 20px;background:rgba(255,255,255,0.90);transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s;cursor:default}
        .waste-card:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(122,26,26,0.09)}

        .form-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:rgba(33,33,33,0.45);margin-bottom:5px;display:block}
        .form-input{border:1.5px solid rgba(33,33,33,0.12);border-radius:10px;padding:9px 12px;font-size:13px;background:#fff;color:#212121;outline:none;width:100%;font-family:'Inter',sans-serif;transition:border-color .2s,box-shadow .2s;box-sizing:border-box}
        .form-input:focus{border-color:rgba(122,26,26,0.40);box-shadow:0 0 0 3px rgba(122,26,26,0.07)}
        .form-input::placeholder{color:rgba(33,33,33,0.30)}

        .waste-banner{background:linear-gradient(90deg,rgba(122,26,26,0.07),rgba(122,26,26,0.03));border:1px solid rgba(122,26,26,0.15);border-radius:14px;padding:14px 18px;display:flex;align-items:center;gap:12px;margin-bottom:20px}
        @media (max-width:640px) {
          .waste-banner{flex-wrap:wrap;padding:12px;gap:10px}
        }

        .exp-near-row { background: rgba(254,243,199,0.30); }
      `}</style>

      <div
        className={`min-h-screen text-[#212121] font-['Inter'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background:"#F9F9FA" }}
      >
        <Header hasNotification={adaStokHabis} userInitials={userInitials} />

        <main className="w-full">

          {/* ── HERO ── */}
          <section className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12"
            style={{ background:"linear-gradient(160deg,#f5f0e8 0%,#ede8da 45%,#f9f7f2 100%)" }}>
            <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full opacity-30 blob pointer-events-none" style={{ background:"#e8d5a3", filter:"blur(72px)" }}/>
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-20 blob2 pointer-events-none" style={{ background:"#CFDECA", filter:"blur(60px)" }}/>

            <Inner>
              <div className="anim-fade-up flex items-center gap-2 mb-5 text-[11px] font-medium" style={{ color:"rgba(80,65,40,0.45)" }}>
                <Link href="/dashboard" className="hover:text-[#2a1f08] transition-colors">Dashboard</Link>
                <span>/</span>
                <span style={{ color:"#2a1f08" }} className="font-semibold">Stok Barang</span>
              </div>

              <div className="anim-fade-up d100 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.20em] uppercase mb-1.5 font-medium" style={{ color:"rgba(80,65,40,0.42)" }}>Manajemen</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.2rem] leading-none" style={{ color:"#2a1f08" }}>Stok Barang</h1>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color:"rgba(80,65,40,0.38)" }}>{tanggal}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {isAdmin && (
                    <Link href="/stock/tambah">
                      <button className="btn-primary"><IconPlus size={15} color="#ffffff"/> Tambah Barang</button>
                    </Link>
                  )}
                </div>
              </div>

              {/* STAT STRIP */}
              <div className="anim-fade-up d200 stat-strip mt-7">
                {[
                  { label:"Total Barang",   val:data.length,                                                icon:<IconBox size={18} color="#7a5c2e"/>,           iconBg:"#e8dfc8", valColor:"#2a1f08" },
                  { label:"Stok Habis",     val:data.filter(d => d.jumlah===0).length,                     icon:<IconAlertTriangle size={18} color="#dc2626"/>,  iconBg:"#fee2e2", valColor:"#dc2626" },
                  { label:"Stok Menipis",   val:data.filter(d => d.jumlah>0 && d.jumlah/d.max<0.3).length, icon:<IconTrendingDown size={18} color="#92650a"/>,   iconBg:"#fef3c7", valColor:"#92650a" },
                  { label:"Stok Tersedia",  val:data.filter(d => d.jumlah/d.max>=0.3).length,              icon:<IconCheckCircle size={18} color="#2d6a3f"/>,    iconBg:"#CFDECA", valColor:"#2d6a3f" },
                  { label:"Total Waste",    val:wasteLog.length,                                            icon:<IconFlame size={18} color="#7A1A1A"/>,          iconBg:"#fee2e2", valColor:"#7A1A1A" },
                ].map((s,i) => (
                  <div key={i} className="stat-strip-item">
                    <div className="stat-strip-icon" style={{ background:s.iconBg }}>{s.icon}</div>
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-black text-xl sm:text-2xl leading-none" style={{ color:s.valColor }}>{s.val}</p>
                      <p className="text-[10px] sm:text-[11px] mt-1 font-medium" style={{ color:"rgba(80,65,40,0.45)" }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stok habis banner */}
              {adaStokHabis && (
                <div className="anim-fade-up d300 relative mt-3.5 flex items-center gap-3 px-4 sm:px-5 py-3.5 border"
                  style={{ background:"rgba(254,242,242,0.85)", backdropFilter:"blur(8px)", borderColor:"rgba(248,113,113,0.25)", borderRadius:"14px" }}>
                  <span className="flex-shrink-0"><IconAlertTriangle size={16} color="#dc2626"/></span>
                  <p className="text-xs sm:text-sm font-medium text-red-600">
                    Terdapat <span className="font-bold">{data.filter(d=>d.jumlah===0).length} barang</span> dengan stok habis. Segera lakukan restok.
                  </p>
                </div>
              )}

              {/* Near-expired banner */}
              {(() => {
                const nearExpired = data.filter(d => {
                  if (!d.tanggalExpired) return false;
                  const diff = Math.floor((new Date(d.tanggalExpired).getTime() - Date.now()) / (1000*60*60*24));
                  return diff >= 0 && diff <= 7;
                });
                if (nearExpired.length === 0) return null;
                return (
                  <div className="anim-fade-up d300 relative mt-3 flex items-center gap-3 px-4 sm:px-5 py-3.5 border"
                    style={{ background:"rgba(254,243,199,0.70)", backdropFilter:"blur(8px)", borderColor:"rgba(217,119,6,0.25)", borderRadius:"14px" }}>
                    <span className="flex-shrink-0"><IconClock size={16} color="#92650a"/></span>
                    <p className="text-xs sm:text-sm font-medium" style={{ color:"#92400e" }}>
                      <span className="font-bold">{nearExpired.length} barang</span> akan expired dalam 7 hari — segera habiskan atau pindahkan ke waste.
                    </p>
                    <button className="ml-auto flex-shrink-0 text-[11px] font-bold" style={{ color:"#92400e", textDecoration:"underline", background:"none", border:"none", cursor:"pointer" }}
                      onClick={() => { setSortCol("tanggalExpired"); setSortDir("asc"); setFilterTab("stok"); }}>
                      Urutkan →
                    </button>
                  </div>
                );
              })()}

              {/* Auto-moved banner */}
              {autoMovedCount > 0 && (
                <div className="anim-fade-up d300 relative mt-3 flex items-center gap-3 px-4 sm:px-5 py-3.5 border"
                  style={{ background:"rgba(122,26,26,0.06)", backdropFilter:"blur(8px)", borderColor:"rgba(122,26,26,0.18)", borderRadius:"14px" }}>
                  <span className="flex-shrink-0"><IconFlame size={16} color="#7A1A1A"/></span>
                  <p className="text-xs sm:text-sm font-medium" style={{ color:"#7A1A1A" }}>
                    <span className="font-bold">{autoMovedCount} barang</span> otomatis dipindahkan ke waste karena sudah melewati tanggal expired.
                  </p>
                  <button className="ml-auto flex-shrink-0 text-[11px] font-bold" style={{ color:"#7A1A1A", textDecoration:"underline", background:"none", border:"none", cursor:"pointer" }}
                    onClick={() => setFilterTab("waste")}>
                    Lihat Waste →
                  </button>
                </div>
              )}

              {/* PO Incoming banner */}
              {adaPOIncoming && (
                <div className="anim-fade-up d300 relative mt-3 flex items-center gap-3 px-4 sm:px-5 py-3.5 border"
                  style={{ background:"rgba(207,222,202,0.50)", backdropFilter:"blur(8px)", borderColor:"rgba(59,109,17,0.22)", borderRadius:"14px" }}>
                  <span className="flex-shrink-0 pulse-green"><IconPackageCheck size={16} color="#3B6D11"/></span>
                  <p className="text-xs sm:text-sm font-medium" style={{ color:"#27500A" }}>
                    Ada <span className="font-bold">{data.filter(d => d.pendingPO && d.pendingPO.status !== "rejected").length} PO</span> sedang dalam proses — stok akan otomatis bertambah setelah supplier ACC.
                  </p>
                  <Link href="/notification" className="ml-auto flex-shrink-0">
                    <span className="text-[11px] font-bold" style={{ color:"#3B6D11", textDecoration:"underline" }}>Lihat PO →</span>
                  </Link>
                </div>
              )}

              {/* Waste banner if any */}
              {wasteLog.length > 0 && autoMovedCount === 0 && (
                <div className="anim-fade-up d300 relative mt-3 flex items-center gap-3 px-4 sm:px-5 py-3.5 border"
                  style={{ background:"rgba(122,26,26,0.05)", backdropFilter:"blur(8px)", borderColor:"rgba(122,26,26,0.18)", borderRadius:"14px" }}>
                  <span className="flex-shrink-0"><IconFlame size={16} color="#7A1A1A"/></span>
                  <p className="text-xs sm:text-sm font-medium" style={{ color:"#7A1A1A" }}>
                    <span className="font-bold">{wasteLog.length} barang</span> tercatat sebagai waste. Pantau dan kurangi pemborosan.
                  </p>
                  <button className="ml-auto flex-shrink-0 text-[11px] font-bold" style={{ color:"#7A1A1A", textDecoration:"underline", background:"none", border:"none", cursor:"pointer" }}
                    onClick={() => setFilterTab("waste")}>
                    Lihat Waste →
                  </button>
                </div>
              )}
            </Inner>
          </section>

          {/* ── TABLE / WASTE SECTION ── */}
          <section className="w-full py-10 sm:py-12" style={{ background:"#FFFFFF" }}>
            <Inner>

              {/* ── Tab + Filter pills ── */}
              <div className="anim-fade-up d100 flex items-center gap-2 flex-wrap mb-5">
                <button className={`kat-pill ${filterTab==="stok" ? "on" : "off"}`} onClick={() => setFilterTab("stok")}>Semua Stok</button>
                <button className={`waste-pill ${filterTab==="waste" ? "on" : "off"}`} onClick={() => setFilterTab("waste") }>
                  Waste {wasteLog.length > 0 && `(${wasteLog.length})`}
                </button>
                {filterTab === "stok" && (
                  <>
                    <div className="w-px h-4 mx-0.5" style={{ background:"rgba(33,33,33,0.12)" }}/>
                    {kategoriList.map(k => (
                      <button key={k} className={`kat-pill ${filterKategori===k?"on":"off"}`} onClick={() => { setFilterKategori(k); setPage(1); }}>{k}</button>
                    ))}
                  </>
                )}
              </div>

              {/* STOK TAB */}
              {filterTab === "stok" && (
                <>
                  {/* Controls */}
                  <div className="anim-fade-up d200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-medium" style={{ color:"rgba(33,33,33,0.45)" }}>Tampilkan</span>
                      <select className="select-input" value={showCount} onChange={e => { setShowCount(Number(e.target.value)); setPage(1); }}>
                        {SHOW_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <span className="text-[11px] font-medium" style={{ color:"rgba(33,33,33,0.45)" }}>entri</span>
                      <div className="flex items-center gap-1 ml-1 border rounded-[8px] p-0.5" style={{ borderColor:"rgba(42,31,8,0.12)" }}>
                        <button className={`view-toggle-btn ${viewMode==="table"?"on":"off"}`} onClick={() => setViewMode("table")} title="Tampilan tabel"><IconList size={13}/></button>
                        <button className={`view-toggle-btn ${viewMode==="grid"?"on":"off"}`} onClick={() => setViewMode("grid")} title="Tampilan kartu"><IconGrid size={13}/></button>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center" style={{ color:"rgba(33,33,33,0.35)" }}><IconSearch size={14}/></span>
                      <input className="search-input" placeholder="Cari barang…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
                    </div>
                  </div>

                  {/* TABLE VIEW */}
                  {viewMode === "table" && (
                    <div className="anim-fade-up d300 zoom-card overflow-hidden border"
                      style={{ background:"rgba(255,255,255,0.60)", backdropFilter:"blur(22px)", borderColor:"rgba(33,33,33,0.08)", borderRadius:"18px", boxShadow:"0 8px 32px rgba(33,33,33,0.07), inset 0 1px 0 rgba(255,255,255,0.95)" }}>
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ background:"rgba(33,33,33,0.03)", borderBottom:"1px solid rgba(33,33,33,0.07)" }}>
                              {[
                                { label:"No",           col:null },
                                { label:"Nama Barang",  col:"nama" },
                                { label:"Kategori",     col:"kategori" },
                                { label:"Jumlah",       col:"jumlah" },
                                { label:"Satuan",       col:"satuan" },
                                { label:"Status",       col:null },
                                { label:"Tgl Expired",  col:"tanggalExpired" },
                                ...(isAdmin ? [{ label:"Aksi", col:null }] : []),
                              ].map((h,i) => (
                                <th key={i} className={`px-6 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase ${h.col?"sort-th":""}`}
                                  style={{ color:"rgba(33,33,33,0.35)" }}
                                  onClick={() => h.col && handleSort(h.col)}>
                                  <span className="flex items-center gap-1.5">{h.label} {h.col && <SortIcon col={h.col}/>}</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {paginated.length === 0 ? (
                              <tr><td colSpan={isAdmin?8:7} className="px-6 py-12 text-center text-sm" style={{ color:"rgba(33,33,33,0.35)" }}>Tidak ada barang ditemukan.</td></tr>
                            ) : paginated.map((item, i) => {
                              const isNearExpired = item.tanggalExpired
                                ? Math.floor((new Date(item.tanggalExpired).getTime() - Date.now()) / (1000*60*60*24)) <= 7
                                : false;
                              return (
                                <tr key={item.id} className={`tbl-row ${isNearExpired ? "exp-near-row" : ""}`}
                                  style={{ borderTop:"1px solid rgba(33,33,33,0.05)", background: i%2===0 ? undefined : "rgba(33,33,33,0.012)" }}>
                                  <td className="px-6 py-4 text-[11px] font-bold" style={{ color:"rgba(33,33,33,0.32)" }}>{(page-1)*showCount+i+1}</td>
                                  <td className="px-6 py-4 font-semibold text-[#212121] text-xs sm:text-sm">{item.nama}</td>
                                  <td className="px-6 py-4">
                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background:"rgba(42,31,8,0.08)", color:"#2a1f08" }}>{item.kategori}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(33,33,33,0.09)" }}>
                                        <div className={`h-full rounded-full progress-bar ${item.jumlah===0?"bg-red-400":item.jumlah/item.max<0.3?"bg-[#d4a843]":"bg-[#CFDECA]"}`}
                                          style={{ width: animIn ? `${Math.min((item.jumlah/item.max)*100,100)}%` : "0%", transitionDelay:`${i*50}ms` }}/>
                                      </div>
                                      <span className="text-xs font-semibold" style={{ color:"rgba(33,33,33,0.60)" }}>{item.jumlah}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-xs font-medium" style={{ color:"rgba(33,33,33,0.55)" }}>{item.satuan}</td>
                                  <td className="px-6 py-4"><StatusBadge jumlah={item.jumlah} max={item.max}/></td>
                                  <td className="px-6 py-4"><ExpiredBadge tanggalExpired={item.tanggalExpired}/></td>
                                  {isAdmin && (
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <Link href={`/stock/edit/${item.id}`}><button className="btn-ghost"><IconEdit size={13}/> Edit</button></Link>
                                        <button className="btn-danger" onClick={() => setDeleteModal(item)}><IconTrash size={13} color="#dc2626"/> Hapus</button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile */}
                      <div className="sm:hidden divide-y" style={{ borderColor:"rgba(33,33,33,0.06)" }}>
                        {paginated.length === 0 ? (
                          <div className="py-12 text-center text-sm" style={{ color:"rgba(33,33,33,0.35)" }}>Tidak ada barang.</div>
                        ) : paginated.map((item, i) => (
                          <div key={item.id} className="tbl-row px-4 py-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <p className="font-semibold text-sm text-[#212121]">{item.nama}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background:"rgba(42,31,8,0.08)", color:"#2a1f08" }}>{item.kategori}</span>
                                  <p className="text-[11px] font-medium" style={{ color:"rgba(33,33,33,0.45)" }}>{item.satuan}</p>
                                </div>
                              </div>
                              <StatusBadge jumlah={item.jumlah} max={item.max}/>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(33,33,33,0.09)" }}>
                                <div className={`h-full rounded-full progress-bar ${item.jumlah===0?"bg-red-400":item.jumlah/item.max<0.3?"bg-[#d4a843]":"bg-[#CFDECA]"}`}
                                  style={{ width: animIn ? `${Math.min((item.jumlah/item.max)*100,100)}%` : "0%" }}/>
                              </div>
                              <span className="text-[10px] font-semibold flex-shrink-0" style={{ color:"rgba(33,33,33,0.45)" }}>{item.jumlah}/{item.max}</span>
                            </div>
                            <div className="mb-2">
                              <ExpiredBadge tanggalExpired={item.tanggalExpired}/>
                            </div>
                            {isAdmin && (
                              <div className="flex gap-2">
                                <Link href={`/stock/edit/${item.id}`} className="flex-1"><button className="btn-ghost w-full justify-center"><IconEdit size={13}/> Edit</button></Link>
                                <button className="btn-danger flex-1 justify-center" onClick={() => setDeleteModal(item)}><IconTrash size={13} color="#dc2626"/> Hapus</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* GRID VIEW */}
                  {viewMode === "grid" && (
                    <div className="anim-fade-up d300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {paginated.length === 0 ? (
                        <div className="col-span-3 py-12 text-center text-sm" style={{ color:"rgba(33,33,33,0.35)" }}>Tidak ada barang ditemukan.</div>
                      ) : paginated.map((item,i) => {
                        const isNearExpired = item.tanggalExpired
                          ? Math.floor((new Date(item.tanggalExpired).getTime() - Date.now()) / (1000*60*60*24)) <= 7
                          : false;
                        return (
                          <div key={item.id} className="stk-grid-card"
                            style={{ borderColor: isNearExpired ? "rgba(217,119,6,0.30)" : "rgba(33,33,33,0.09)" }}>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div>
                                <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm leading-snug text-[#212121]">{item.nama}</p>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block" style={{ background:"rgba(42,31,8,0.08)", color:"#2a1f08" }}>{item.kategori}</span>
                              </div>
                              <StatusBadge jumlah={item.jumlah} max={item.max}/>
                            </div>
                            <div className="py-3 border-t border-b mb-3" style={{ borderColor:"rgba(33,33,33,0.07)" }}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-medium" style={{ color:"rgba(33,33,33,0.40)" }}>Stok saat ini</span>
                                <span className="text-[11px] font-bold" style={{ color:"rgba(33,33,33,0.60)" }}>{item.jumlah}/{item.max} {item.satuan}</span>
                              </div>
                              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background:"rgba(33,33,33,0.09)" }}>
                                <div className={`h-full rounded-full progress-bar ${item.jumlah===0?"bg-red-400":item.jumlah/item.max<0.3?"bg-[#d4a843]":"bg-[#CFDECA]"}`}
                                  style={{ width: animIn ? `${Math.min((item.jumlah/item.max)*100,100)}%` : "0%", transitionDelay:`${i*40}ms` }}/>
                              </div>
                              <div className="mt-2">
                                <ExpiredBadge tanggalExpired={item.tanggalExpired}/>
                              </div>
                            </div>
                            {isAdmin && (
                              <div className="flex gap-2">
                                <Link href={`/stock/edit/${item.id}`} className="flex-1"><button className="btn-ghost w-full justify-center"><IconEdit size={13}/> Edit</button></Link>
                                <button className="btn-danger flex-1 justify-center" onClick={() => setDeleteModal(item)}><IconTrash size={13} color="#dc2626"/> Hapus</button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  <div className="anim-fade-up d400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                    <p className="text-[11px] font-medium" style={{ color:"rgba(33,33,33,0.40)" }}>
                      Menampilkan {Math.min((page-1)*showCount+1, sorted.length)}–{Math.min(page*showCount, sorted.length)} dari {sorted.length} entri
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button className="page-btn" disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</button>
                      {Array.from({ length:totalPages },(_,i)=>i+1)
                        .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
                        .reduce<(number|"…")[]>((acc,p,idx,arr) => { if(idx>0&&p-(arr[idx-1] as number)>1) acc.push("…"); acc.push(p); return acc; },[])
                        .map((p,i) => p==="…"
                          ? <span key={i} className="text-[11px] px-1" style={{ color:"rgba(33,33,33,0.35)" }}>…</span>
                          : <button key={i} className={`page-btn${page===p?" active":""}`} onClick={() => setPage(p as number)}>{p}</button>
                        )}
                      <button className="page-btn" disabled={page===totalPages||totalPages===0} onClick={() => setPage(p=>p+1)}>›</button>
                    </div>
                  </div>
                </>
              )}

              {/* WASTE TAB */}
              {filterTab === "waste" && (
                <div className="anim-fade-up d100">
                  <div className="waste-banner">
                    <div className="flex-1">
                      <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm" style={{ color:"#7A1A1A" }}>Log Barang Terbuang (Waste)</p>
                      <p className="text-[11px] mt-0.5" style={{ color:"rgba(122,26,26,0.65)" }}>
                        Barang expired otomatis dipindahkan ke sini. Total: <span className="font-bold">{wasteLog.length} item</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
                    <p className="text-[11px] font-medium" style={{ color:"rgba(33,33,33,0.40)" }}>{filteredWaste.length} catatan waste ditemukan</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center" style={{ color:"rgba(33,33,33,0.35)" }}><IconSearch size={14}/></span>
                      <input className="search-input" placeholder="Cari waste…" value={wasteSearch} onChange={e => setWasteSearch(e.target.value)}/>
                    </div>
                  </div>

                  {filteredWaste.length === 0 ? (
                    <div className="py-16 text-center" style={{ border:"1.5px dashed rgba(122,26,26,0.18)", borderRadius:"16px" }}>
                      <p className="text-3xl mb-3">🗑</p>
                      <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm" style={{ color:"rgba(33,33,33,0.40)" }}>
                        {wasteLog.length === 0 ? "Belum ada barang yang dicatat sebagai waste." : "Tidak ada hasil yang cocok."}
                      </p>
                      {wasteLog.length === 0 && (
                        <></>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="hidden sm:block overflow-hidden border"
                        style={{ borderRadius:"18px", borderColor:"rgba(122,26,26,0.10)", boxShadow:"0 4px 20px rgba(122,26,26,0.06)" }}>
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ background:"rgba(122,26,26,0.04)", borderBottom:"1px solid rgba(122,26,26,0.09)" }}>
                              {["No","Nama Barang","Kategori","Jumlah","Tgl Expired","Tgl Dicatat","Alasan","Aksi"].map((h,i) => (
                                <th key={i} className="px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase" style={{ color:"rgba(122,26,26,0.45)" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredWaste.map((item, i) => (
                              <tr key={item.id} className="tbl-row" style={{ borderTop:"1px solid rgba(122,26,26,0.06)", background: i%2===0 ? "transparent" : "rgba(122,26,26,0.015)" }}>
                                <td className="px-5 py-4 text-[11px] font-bold" style={{ color:"rgba(122,26,26,0.35)" }}>{i+1}</td>
                                <td className="px-5 py-4 font-semibold text-sm text-[#212121]">
                                  {item.nama}
                                  {item.alasan.startsWith("Otomatis") && (
                                    <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background:"#fee2e2", color:"#991b1b" }}>AUTO</span>
                                  )}
                                </td>
                                <td className="px-5 py-4">
                                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background:"rgba(122,26,26,0.08)", color:"#7A1A1A" }}>{item.kategori}</span>
                                </td>
                                <td className="px-5 py-4 text-xs font-semibold" style={{ color:"#7A1A1A" }}>
                                  {item.jumlah} <span className="font-normal" style={{ color:"rgba(33,33,33,0.45)" }}>{item.satuan}</span>
                                </td>
                                <td className="px-5 py-4">
                                  <ExpiredBadge tanggalExpired={item.tanggalExpired}/>
                                </td>
                                <td className="px-5 py-4 text-[11px]" style={{ color:"rgba(33,33,33,0.45)" }}>
                                  {new Date(item.tanggalCatat).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" })}
                                </td>
                                <td className="px-5 py-4 text-xs" style={{ color:"rgba(33,33,33,0.60)", maxWidth:"160px" }}>
                                  <span className="line-clamp-1">{item.alasan}</span>
                                </td>
                                <td className="px-5 py-4">
                                  <button className="btn-danger" onClick={() => setDeleteWasteModal(item)}>
                                    <IconTrash size={13} color="#dc2626"/> Hapus
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="sm:hidden flex flex-col gap-3">
                        {filteredWaste.map(item => (
                          <div key={item.id} className="waste-card">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <p className="font-semibold text-sm text-[#212121]">
                                  {item.nama}
                                  {item.alasan.startsWith("Otomatis") && (
                                    <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background:"#fee2e2", color:"#991b1b" }}>AUTO</span>
                                  )}
                                </p>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block" style={{ background:"rgba(122,26,26,0.08)", color:"#7A1A1A" }}>{item.kategori}</span>
                              </div>
                              <ExpiredBadge tanggalExpired={item.tanggalExpired}/>
                            </div>
                            <div className="flex items-center gap-4 mb-3 text-xs">
                              <span style={{ color:"rgba(33,33,33,0.55)" }}>Jumlah: <span className="font-bold text-[#7A1A1A]">{item.jumlah} {item.satuan}</span></span>
                              <span style={{ color:"rgba(33,33,33,0.40)" }}>
                                Dicatat {new Date(item.tanggalCatat).toLocaleDateString("id-ID", { day:"2-digit", month:"short" })}
                              </span>
                            </div>
                            {item.alasan && (
                              <p className="text-[11px] mb-3 px-3 py-2 rounded-lg" style={{ background:"rgba(122,26,26,0.05)", color:"rgba(122,26,26,0.65)" }}>
                                "{item.alasan}"
                              </p>
                            )}
                            <button className="btn-danger w-full justify-center" onClick={() => setDeleteWasteModal(item)}>
                              <IconTrash size={13} color="#dc2626"/> Hapus Catatan
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

            </Inner>
          </section>

          {/* STAT BAR */}
          <section className="w-full relative overflow-hidden py-5 sm:py-6" style={{ background:"#212121" }}>
            <Inner>
              <div className="anim-fade-up d300 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
                  {[
                    { val:`${data.length} item`, label:"Total stok" },
                    { val:`${data.filter(d=>d.jumlah===0).length}`, label:"Stok habis", danger:true },
                    { val:`${data.filter(d=>d.jumlah>0&&d.jumlah/d.max<0.3).length}`, label:"Stok menipis" },
                    { val:`${data.filter(d => d.tanggalExpired && Math.floor((new Date(d.tanggalExpired).getTime()-Date.now())/(1000*60*60*24)) <= 7 && Math.floor((new Date(d.tanggalExpired).getTime()-Date.now())/(1000*60*60*24)) >= 0).length}`, label:"Exp ≤7 hari", warn:true },
                    { val:`${wasteLog.length}`, label:"Total waste", waste:true },
                  ].map((s,i) => (
                    <div key={i} className="flex items-center gap-4 sm:gap-8">
                      {i>0 && <div className="w-px h-8 hidden sm:block" style={{ background:"rgba(249,249,250,0.08)" }}/>}
                      <div className="text-center cursor-default">
                        <p className={`font-['Plus_Jakarta_Sans'] font-black text-base sm:text-lg ${(s as any).danger?"text-red-400":(s as any).warn?"text-yellow-300":(s as any).waste?"text-orange-300":"text-[#F9F9FA]"}`}>{s.val}</p>
                        <p className="text-[9px] sm:text-[10px] font-medium mt-0.5" style={{ color:"rgba(249,249,250,0.28)" }}>{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] sm:text-[10px] font-medium" style={{ color:"rgba(249,249,250,0.18)" }}>Inventix v1.0 · Stok Barang</p>
              </div>
            </Inner>
          </section>
        </main>

        <Footer/>

        {/* DELETE STOCK MODAL */}
        {deleteModal && (
          <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background:"rgba(33,33,33,0.45)", backdropFilter:"blur(8px)" }}
            onClick={() => setDeleteModal(null)}>
            <div className="modal-box w-full max-w-sm p-6 sm:p-7 border"
              style={{ background:"#FFFFFF", borderRadius:"20px", borderColor:"rgba(33,33,33,0.08)", boxShadow:"0 24px 64px rgba(33,33,33,0.18)" }}
              onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background:"#fee2e2" }}>
                <IconTrash size={22} color="#dc2626"/>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-black text-lg text-[#212121] mb-1.5">Hapus Barang?</h2>
              <p className="text-sm mb-6" style={{ color:"rgba(33,33,33,0.55)" }}>
                <span className="font-semibold text-[#212121]">{deleteModal.nama}</span> akan dihapus permanen dari sistem dan tidak bisa dipulihkan.
              </p>
              <div className="flex gap-3">
                <button className="btn-ghost flex-1 justify-center" onClick={() => setDeleteModal(null)}>Batal</button>
                <button className="btn-danger flex-1 justify-center font-bold" style={{ padding:"10px 20px", fontSize:"13px" }} onClick={() => handleDelete(deleteModal)}>
                  <IconTrash size={13} color="#dc2626"/> Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE WASTE MODAL */}
        {deleteWasteModal && (
          <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background:"rgba(33,33,33,0.45)", backdropFilter:"blur(8px)" }}
            onClick={() => setDeleteWasteModal(null)}>
            <div className="modal-box w-full max-w-sm p-6 sm:p-7 border"
              style={{ background:"#FFFFFF", borderRadius:"20px", borderColor:"rgba(122,26,26,0.10)", boxShadow:"0 24px 64px rgba(33,33,33,0.18)" }}
              onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background:"#fee2e2" }}>
                <IconFlame size={22} color="#7A1A1A"/>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-black text-lg text-[#212121] mb-1.5">Hapus Catatan Waste?</h2>
              <p className="text-sm mb-6" style={{ color:"rgba(33,33,33,0.55)" }}>
                Catatan waste untuk <span className="font-semibold text-[#212121]">{deleteWasteModal.nama}</span> akan dihapus. Aksi ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button className="btn-ghost flex-1 justify-center" onClick={() => setDeleteWasteModal(null)}>Batal</button>
                <button className="btn-danger flex-1 justify-center font-bold" style={{ padding:"10px 20px", fontSize:"13px" }} onClick={() => handleDeleteWaste(deleteWasteModal)}>
                  <IconTrash size={13} color="#dc2626"/> Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className="toast fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 shadow-2xl border"
            style={{ background:toast.type==="success"?"#CFDECA":"#fee2e2", borderColor:"rgba(255,255,255,0.7)", borderRadius:"14px", minWidth:"260px" }}>
            <span className="flex-shrink-0">{toast.type==="success" ? <IconCheck size={15} color="#2d6a3f"/> : <IconX size={15} color="#dc2626"/>}</span>
            <p className="text-xs sm:text-sm font-semibold text-[#212121]">{toast.msg}</p>
          </div>
        )}
      </div>
    </>
  );
}