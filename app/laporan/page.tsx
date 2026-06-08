"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { COOKIE_ROLE } from "@/lib/auth";
import { api } from "@/lib/api";

const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const HARI  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

const SHOW_OPTIONS = [5, 10, 25, 50];

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconReport       = ({ size=18, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l7 7v9a2 2 0 0 1-2 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IconTrendingUp   = ({ size=18, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 17"/><polyline points="17 6 23 6 23 12"/></svg>;
const IconBarChart      = ({ size=18, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="18" y="13" width="4" height="8"/></svg>;
const IconUsers        = ({ size=18, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconSearch       = ({ size=14, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconCheck        = ({ size=15, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconX            = ({ size=15, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconSort         = ({ size=12, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 5 19 12"/></svg>;
const IconSortDown     = ({ size=12, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 19 19 12"/></svg>;
const IconRefresh      = ({ size=14, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const IconAward        = ({ size=18, color="currentColor" }: { size?: number; color?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;

// ─── Types ────────────────────────────────────────────────────────────────────
interface PurchaseOrder {
  id: string;
  nomorPO: string;
  supplier: string;
  tanggal: string;
  status: string;
  nilaiTotal: number;
  namaBarang: string;
  jumlah: number;
  satuan: string;
  catatan: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getDate()} ${BULAN[date.getMonth()]} ${date.getFullYear()}`;
}

function normalizeStatus(status: unknown) {
  const raw = String(status || "").toUpperCase();
  if (raw === "DITOLAK" || raw === "DIBATALKAN") return "rejected";
  if (raw === "SELESAI") return "completed";
  if (raw === "DIKIRIM") return "supplier_acc";
  if (raw === "DISETUJUI") return "approved";
  if (raw === "MENUNGGU_PERSETUJUAN" || raw === "DRAFT") return "pending";
  const lower = raw.toLowerCase();
  if (lower.includes("reject") || lower.includes("tolak")) return "rejected";
  if (lower.includes("complete") || lower.includes("selesai")) return "completed";
  if (lower.includes("supplier") && lower.includes("acc")) return "supplier_acc";
  if (lower.includes("approve") || lower.includes("acc")) return "approved";
  return "pending";
}

function parsePurchaseOrder(raw: unknown): PurchaseOrder {
  const item = raw as Record<string, unknown>;
  return {
    id: String(item.id ?? item.po_id ?? "0"),
    nomorPO: String(item.nomor_po ?? item.nomorPO ?? `PO-${item.id ?? "000"}`),
    supplier: String(
      item.supplier_nama ??
      (item.supplier as Record<string,unknown>)?.nama ??
      item.supplierNama ?? "Supplier"
    ),
    tanggal: String(item.tanggal_po ?? item.dibuat_pada ?? item.tanggal ?? item.created_at ?? ""),
    status: normalizeStatus(item.status ?? item.status_po ?? item.status_supplier),
    nilaiTotal: Number(item.subtotal ?? item.total_nilai ?? item.total ?? 0) || 0,
    namaBarang: String(item.barang_nama ?? item.nama_barang ?? (item.stok as Record<string,unknown>)?.nama ?? "—"),
    jumlah: Number(item.jumlah_dipesan ?? item.jumlah ?? 0) || 0,
    satuan: String(item.satuan ?? item.unit ?? "pcs"),
    catatan: String(item.catatan ?? item.keterangan ?? "—"),
  };
}

// ─── Status badge ─────────────────────────────────────────────────────────────
const PO_STATUS_CFG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending:      { label: "Menunggu",         bg: "#EFEEFC", text: "#5B5491", border: "#C5C2E8" },
  approved:     { label: "Disetujui",        bg: "#F0FDF4", text: "#065f46", border: "#A8DEBC" },
  supplier_acc: { label: "Dalam Pengiriman", bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE" },
  completed:    { label: "Selesai",          bg: "#DDD9F5", text: "#4B4591", border: "#B5B0E0" },
  rejected:     { label: "Ditolak",          bg: "#F5D6D6", text: "#8A2020", border: "#E8A8A8" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = PO_STATUS_CFG[status] || PO_STATUS_CFG.pending;
  return (
    <span style={{ background: cfg.bg, color: cfg.text, fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", padding: "3px 9px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 4, border: `1.5px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  );
}

// ─── Inner wrapper ────────────────────────────────────────────────────────────
function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LaporanPOPage() {
  const role = Cookies.get(COOKIE_ROLE) || null;

  const [mounted, setMounted]   = useState(false);
  const [animIn, setAnimIn]     = useState(false);
  const [tanggal, setTanggal]   = useState("");
  const [loading, setLoading]   = useState(true);
  const [poList, setPoList]     = useState<PurchaseOrder[]>([]);
  const [search, setSearch]     = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate]     = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [sortCol, setSortCol]   = useState<string | null>(null);
  const [sortDir, setSortDir]   = useState<"asc" | "desc">("asc");
  const [showCount, setShowCount] = useState(10);
  const [page, setPage]         = useState(1);
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const now = new Date();
    setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    if (role === "owner") loadPurchaseOrders();
    else setLoading(false);
    setTimeout(() => { setMounted(true); setAnimIn(true); }, 100);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  async function loadPurchaseOrders() {
    setLoading(true);
    try {
      const res = await api.laporan.getPengeluaran();
      setPoList(res?.data ? res.data.map(parsePurchaseOrder) : []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(message);
      setToast({ msg: "Gagal memuat laporan PO. Coba muat ulang.", type: "error" });
      setPoList([]);
    } finally {
      setLoading(false);
    }
  }

  // ── Filter / sort / paginate ───────────────────────────────────────────────
  const statusList = ["Semua", ...Object.keys(PO_STATUS_CFG)];

  const filtered = poList.filter((po) => {
    const matchSearch = [po.nomorPO, po.supplier, po.namaBarang].some(v =>
      v.toLowerCase().includes(search.toLowerCase())
    );
    if (!matchSearch) return false;
    if (filterStatus !== "Semua" && po.status !== filterStatus) return false;
    const d = po.tanggal ? new Date(po.tanggal) : null;
    if (fromDate && d && d < new Date(`${fromDate}T00:00:00`)) return false;
    if (toDate   && d && d > new Date(`${toDate}T23:59:59`))   return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const va = (a as unknown as Record<string,unknown>)[sortCol];
    const vb = (b as unknown as Record<string,unknown>)[sortCol];
    if (typeof va === "number") return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    return sortDir === "asc"
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va));
  });

  const totalPages = Math.ceil(sorted.length / showCount);
  const paginated  = sorted.slice((page - 1) * showCount, page * showCount);

  function handleSort(col: string) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <span style={{ color: "rgba(133,125,179,0.25)", display: "inline-flex" }}><IconSort size={11} /></span>;
    return <span style={{ color: "#2E2860", display: "inline-flex" }}>{sortDir === "asc" ? <IconSort size={11} /> : <IconSortDown size={11} />}</span>;
  }

  // ── Summary stats ──────────────────────────────────────────────────────────
  const totalPO           = filtered.length;
  const totalPengeluaran  = filtered.reduce((s, p) => s + p.nilaiTotal, 0);
  const avgPengeluaran    = totalPO ? Math.round(totalPengeluaran / totalPO) : 0;
  const supplierCount     = new Set(filtered.map(p => p.supplier)).size;

  const topSupplier = Object.entries(
    filtered.reduce<Record<string, number>>((acc, po) => {
      acc[po.supplier] = (acc[po.supplier] || 0) + po.nilaiTotal;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // ── Restricted / loading views ─────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Header />
        <Footer />
      </>
    );
  }

  if (role !== "owner") {
    return (
      <>
        <Header />
        <div style={{ background: "#F9F9FA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "40px", maxWidth: 420, textAlign: "center", border: "1.5px solid rgba(133,125,179,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#2E2860", margin: "0 0 8px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Akses Terbatas</h2>
            <p style={{ fontSize: 12, color: "rgba(133,125,179,0.65)", margin: "0 0 24px" }}>Halaman laporan ini hanya dapat diakses oleh owner.</p>
            <Link href="/dashboard">
              <button style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#A09AC8,#2E2860)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Kembali ke Dashboard
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blob    { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.07)} 66%{transform:translate(-25px,25px) scale(0.95)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }

        .anim-fade-up{animation:fadeUp 0.6s cubic-bezier(.22,1,.36,1) both}
        .d50 {animation-delay:.05s}.d100{animation-delay:.10s}.d150{animation-delay:.15s}
        .d200{animation-delay:.20s}.d250{animation-delay:.25s}.d300{animation-delay:.30s}
        .d350{animation-delay:.35s}.d400{animation-delay:.40s}
        .blob {animation:blob 9s ease-in-out infinite}
        .blob2{animation:blob 12s ease-in-out infinite reverse;animation-delay:3s}

        .zoom-card{transition:transform .30s cubic-bezier(.22,1,.36,1),box-shadow .30s;will-change:transform}
        .zoom-card:hover{transform:scale(1.012);box-shadow:0 20px 48px rgba(133,125,179,0.12)}

        .tbl-row{transition:background .18s,transform .22s cubic-bezier(.22,1,.36,1)}
        .tbl-row:hover{background:rgba(238,236,252,0.50) !important;transform:scale(1.006) translateX(2px)}

        /* stat strip */
        .stat-strip{display:flex;background:rgba(255,255,255,0.52);border:1px solid rgba(180,170,220,0.22);border-radius:16px;overflow:hidden;backdrop-filter:blur(14px)}
        .stat-strip-item{flex:1;padding:16px 18px;display:flex;align-items:center;gap:13px;position:relative;cursor:default;transition:background .2s}
        .stat-strip-item:hover{background:rgba(255,255,255,0.72)}
        .stat-strip-item+.stat-strip-item::before{content:'';position:absolute;left:0;top:20%;height:60%;width:1px;background:rgba(160,154,200,0.20)}
        .stat-strip-icon{width:38px;height:38px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:transform .25s cubic-bezier(.22,1,.36,1)}
        .stat-strip-item:hover .stat-strip-icon{transform:scale(1.14) rotate(4deg)}
        @media (max-width:640px){
          .stat-strip{flex-wrap:wrap}
          .stat-strip-item{flex:1 1 160px;padding:12px}
          .stat-strip-item+.stat-strip-item::before{display:none}
        }

        /* buttons */
        .btn-primary{background:#4B4591;color:#ffffff;border:none;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;padding:10px 20px;font-size:13px;cursor:pointer;transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s,background .18s;display:inline-flex;align-items:center;gap:7px}
        .btn-primary:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 28px rgba(75,69,145,0.30);background:#5B5491}
        .btn-primary:active{transform:scale(0.97)}
        .btn-ghost-pu{background:rgba(133,125,179,0.09);color:#2E2860;border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;padding:7px 14px;font-size:12px;cursor:pointer;transition:background .18s,transform .2s;display:inline-flex;align-items:center;gap:5px}
        .btn-ghost-pu:hover{background:rgba(133,125,179,0.18);transform:scale(1.03)}

        /* search */
        .search-input-pu{border:1.5px solid rgba(133,125,179,0.20);border-radius:12px;padding:9px 14px 9px 38px;font-size:13px;background:rgba(255,255,255,0.7);color:#212121;outline:none;width:100%;max-width:280px;font-family:'Inter',sans-serif;transition:border-color .2s,box-shadow .2s}
        .search-input-pu:focus{border-color:rgba(133,125,179,0.50);box-shadow:0 0 0 3px rgba(133,125,179,0.08)}
        @media (max-width:640px){.search-input-pu{max-width:100%}}

        .select-input{border:1.5px solid rgba(133,125,179,0.18);border-radius:10px;padding:8px 12px;font-size:12px;font-family:'Inter',sans-serif;background:rgba(255,255,255,0.7);color:#212121;outline:none;cursor:pointer}

        /* sort th */
        .sort-th{cursor:pointer;user-select:none}
        .sort-th:hover{color:#2E2860 !important}

        /* pills */
        .status-pill{padding:5px 13px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;border:none;transition:all .18s;font-family:'Plus Jakarta Sans',sans-serif}
        .status-pill.on{background:#4B4591;color:#EEE9FF}
        .status-pill.off{background:rgba(75,69,145,0.08);color:rgba(75,69,145,0.55)}
        .status-pill.off:hover{background:rgba(75,69,145,0.16);color:#4B4591}

        /* pagination */
        .page-btn{width:32px;height:32px;border-radius:8px;border:none;font-size:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .18s}
        .page-btn.active{background:#4B4591;color:#EEE9FF}
        .page-btn:not(.active){background:rgba(133,125,179,0.09);color:#2E2860}
        .page-btn:not(.active):hover{background:rgba(133,125,179,0.18)}
        .page-btn:disabled{opacity:0.3;cursor:default}

        /* modal / toast */
        .modal-overlay{animation:fadeIn .18s ease both}
        .modal-box{animation:fadeUp .22s cubic-bezier(.22,1,.36,1) both}
        .toast{animation:slideIn .35s cubic-bezier(.22,1,.36,1) both}

        /* top supplier bar */
        .supplier-bar-track{height:6px;border-radius:999px;background:rgba(133,125,179,0.12);overflow:hidden;flex:1}
        .supplier-bar-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#A09AC8,#2E2860);transition:width 1.2s cubic-bezier(.22,1,.36,1)}
      `}</style>

      <div
        className={`min-h-screen text-[#212121] font-['Inter'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F9F9FA" }}
      >
        <Header />

        <main className="w-full">

          {/* ── HERO ── */}
          <section className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12"
            style={{ background: "linear-gradient(160deg,#F8F7FE 0%,#F0EFFE 45%,#F8F7FE 100%)" }}>
            <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full opacity-25 blob pointer-events-none" style={{ background: "#DDD9F5", filter: "blur(72px)" }} />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-20 blob2 pointer-events-none" style={{ background: "#C5C2E8", filter: "blur(60px)" }} />

            <Inner>
              {/* breadcrumb */}
              <div className="anim-fade-up flex items-center gap-2 mb-5 text-[11px] font-medium" style={{ color: "rgba(133,125,179,0.40)" }}>
                <Link href="/dashboard" className="hover:text-[#2E2860] transition-colors">Dashboard</Link>
                <span>/</span>
                <span style={{ color: "#2E2860" }} className="font-semibold">Laporan Purchase Order</span>
              </div>

              {/* heading row */}
              <div className="anim-fade-up d100 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.20em] uppercase mb-1.5 font-medium" style={{ color: "rgba(133,125,179,0.40)" }}>Owner Dashboard</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.2rem] leading-none" style={{ color: "#2E2860" }}>Laporan Purchase Order</h1>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(133,125,179,0.40)" }}>{tanggal}</p>
                </div>
                <button className="btn-primary" onClick={loadPurchaseOrders}>
                  <IconRefresh size={14} color="#fff" /> Segarkan Data
                </button>
              </div>

              {/* ── STAT STRIP ── */}
              <div className="anim-fade-up d200 stat-strip mt-7">
                {[
                  { label: "Total PO",            val: totalPO,                      icon: <IconReport size={18} color="#2E2860" />,   iconBg: "#EFEEFC", valColor: "#4B4591" },
                  { label: "Total Pengeluaran",   val: formatRupiah(totalPengeluaran), icon: <IconTrendingUp size={18} color="#6B64A0"/>, iconBg: "#E8E6F8", valColor: "#4B4591" },
                  { label: "Rata-rata per PO",    val: formatRupiah(avgPengeluaran),  icon: <IconBarChart size={18} color="#2E2860" />, iconBg: "#DDD9F5", valColor: "#5B5491" },
                  { label: "Supplier Terlibat",   val: supplierCount,                 icon: <IconUsers size={18} color="#6B64A0" />,   iconBg: "#EFEEFC", valColor: "#5B5491" },
                ].map((s, i) => (
                  <div key={i} className="stat-strip-item">
                    <div className="stat-strip-icon" style={{ background: s.iconBg }}>{s.icon}</div>
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-black text-xl sm:text-2xl leading-none" style={{ color: s.valColor }}>{s.val}</p>
                      <p className="text-[10px] sm:text-[11px] mt-1 font-medium" style={{ color: "rgba(133,125,179,0.45)" }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Inner>
          </section>

          {/* ── TABLE SECTION ── */}
          <section className="w-full py-10 sm:py-12" style={{ background: "#FFFFFF" }}>
            <Inner>

              {/* ── Status filter pills ── */}
              <div className="anim-fade-up d100 flex items-center gap-2 flex-wrap mb-5">
                {statusList.map(s => {
                  const label = s === "Semua" ? "Semua Status" : (PO_STATUS_CFG[s]?.label ?? s);
                  return (
                    <button key={s} className={`status-pill ${filterStatus === s ? "on" : "off"}`}
                      onClick={() => { setFilterStatus(s); setPage(1); }}>
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* ── Controls row ── */}
              <div className="anim-fade-up d200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* date range */}
                  <div className="flex items-center gap-2">
                    <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPage(1); }}
                      className="select-input" style={{ fontSize: 12 }} />
                    <span style={{ fontSize: 11, color: "rgba(133,125,179,0.50)", fontWeight: 600 }}>–</span>
                    <input type="date" value={toDate}   onChange={e => { setToDate(e.target.value); setPage(1); }}
                      className="select-input" style={{ fontSize: 12 }} />
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: "rgba(133,125,179,0.45)" }}>Tampilkan</span>
                  <select className="select-input" value={showCount} onChange={e => { setShowCount(Number(e.target.value)); setPage(1); }}>
                    {SHOW_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="text-[11px] font-medium" style={{ color: "rgba(133,125,179,0.45)" }}>entri</span>
                  {(search || fromDate || toDate || filterStatus !== "Semua") && (
                    <button className="btn-ghost-pu" onClick={() => { setSearch(""); setFromDate(""); setToDate(""); setFilterStatus("Semua"); setPage(1); }}>
                      <IconX size={12} /> Reset
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center" style={{ color: "rgba(133,125,179,0.35)" }}><IconSearch size={14} /></span>
                  <input className="search-input-pu" placeholder="Cari nomor PO, supplier, barang…"
                    value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>
              </div>

              {/* ── Top 3 Supplier (inline) ── */}
              {topSupplier.length > 0 && (
                <div className="anim-fade-up d250 mb-6 p-5 border rounded-2xl"
                  style={{ borderColor: "rgba(133,125,179,0.15)", background: "linear-gradient(135deg,rgba(238,236,252,0.35),rgba(221,217,245,0.20))" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <IconAward size={16} color="#2E2860" />
                    <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-sm" style={{ color: "#2E2860" }}>Top Supplier Periode Ini</h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {topSupplier.map(([supplier, value], idx) => {
                      const pct = topSupplier[0][1] > 0 ? (value / topSupplier[0][1]) * 100 : 0;
                      return (
                        <div key={supplier} className="flex items-center gap-3">
                          <span className="font-['Plus_Jakarta_Sans'] font-black text-xs w-5 flex-shrink-0" style={{ color: "rgba(133,125,179,0.45)" }}>{idx + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-xs truncate" style={{ color: "#4B4591" }}>{supplier}</p>
                              <p className="font-bold text-xs flex-shrink-0 ml-3" style={{ color: "#2E2860" }}>{formatRupiah(value)}</p>
                            </div>
                            <div className="supplier-bar-track">
                              <div className="supplier-bar-fill" style={{ width: animIn ? `${pct}%` : "0%" }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── TABLE ── */}
              <div className="anim-fade-up d300 zoom-card overflow-hidden border"
                style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(22px)", borderColor: "rgba(133,125,179,0.10)", borderRadius: "18px", boxShadow: "0 8px 32px rgba(133,125,179,0.07), inset 0 1px 0 rgba(255,255,255,0.95)" }}>

                {/* Desktop */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(133,125,179,0.04)", borderBottom: "1px solid rgba(133,125,179,0.08)" }}>
                        {[
                          { label: "No",         col: null },
                          { label: "Nomor PO",   col: "nomorPO" },
                          { label: "Supplier",   col: "supplier" },
                          { label: "Tanggal",    col: "tanggal" },
                          { label: "Status",     col: "status" },
                          { label: "Total",      col: "nilaiTotal" },
                          { label: "Barang",     col: "namaBarang" },
                        ].map((h, i) => (
                          <th key={i}
                            className={`px-6 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase ${h.col ? "sort-th" : ""}`}
                            style={{ color: "rgba(133,125,179,0.45)" }}
                            onClick={() => h.col && handleSort(h.col)}>
                            <span className="flex items-center gap-1.5">{h.label} {h.col && <SortIcon col={h.col} />}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-16 text-center">
                            <div style={{ color: "rgba(133,125,179,0.40)" }}>
                              <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
                              <p style={{ fontSize: 13, fontWeight: 600 }}>Tidak ada purchase order yang sesuai filter.</p>
                            </div>
                          </td>
                        </tr>
                      ) : paginated.map((po, i) => (
                        <tr key={po.id} className="tbl-row"
                          style={{ borderTop: "1px solid rgba(133,125,179,0.06)", background: i % 2 !== 0 ? "rgba(238,236,252,0.12)" : "transparent" }}>
                          <td className="px-6 py-4 text-[11px] font-bold" style={{ color: "rgba(133,125,179,0.35)" }}>{(page-1)*showCount+i+1}</td>
                          <td className="px-6 py-4 font-bold text-xs" style={{ color: "#2E2860", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{po.nomorPO}</td>
                          <td className="px-6 py-4 text-xs font-medium text-[#212121]">{po.supplier}</td>
                          <td className="px-6 py-4 text-xs" style={{ color: "rgba(33,33,33,0.55)" }}>{formatDate(po.tanggal)}</td>
                          <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                          <td className="px-6 py-4 font-bold text-xs" style={{ color: "#4B4591", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{formatRupiah(po.nilaiTotal)}</td>
                          <td className="px-6 py-4 text-xs" style={{ color: "rgba(33,33,33,0.60)" }}>{po.namaBarang} · {po.jumlah} {po.satuan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="sm:hidden divide-y" style={{ borderColor: "rgba(133,125,179,0.08)" }}>
                  {paginated.length === 0 ? (
                    <div className="py-12 text-center" style={{ color: "rgba(133,125,179,0.40)" }}>
                      <p className="text-sm font-semibold">Tidak ada data.</p>
                    </div>
                  ) : paginated.map((po, i) => (
                    <div key={po.id} className="tbl-row px-4 py-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-bold text-sm" style={{ color: "#2E2860" }}>{po.nomorPO}</p>
                          <p className="text-xs mt-0.5" style={{ color: "rgba(33,33,33,0.55)" }}>{po.supplier}</p>
                        </div>
                        <StatusBadge status={po.status} />
                      </div>
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="text-[11px]" style={{ color: "rgba(33,33,33,0.45)" }}>{formatDate(po.tanggal)}</span>
                        <span className="font-bold text-[11px]" style={{ color: "#4B4591" }}>{formatRupiah(po.nilaiTotal)}</span>
                      </div>
                      <p className="text-[11px]" style={{ color: "rgba(33,33,33,0.50)" }}>{po.namaBarang} · {po.jumlah} {po.satuan}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Pagination ── */}
              <div className="anim-fade-up d400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                <p className="text-[11px] font-medium" style={{ color: "rgba(133,125,179,0.45)" }}>
                  Menampilkan {sorted.length === 0 ? 0 : (page-1)*showCount+1}–{Math.min(page*showCount, sorted.length)} dari {sorted.length} entri
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx-1] as number) > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) => p === "…"
                      ? <span key={i} className="text-[11px] px-1" style={{ color: "rgba(133,125,179,0.40)" }}>…</span>
                      : <button key={i} className={`page-btn${page === p ? " active" : ""}`} onClick={() => setPage(p as number)}>{p}</button>
                    )}
                  <button className="page-btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              </div>

            </Inner>
          </section>
        </main>

        <Footer />

        {/* TOAST */}
        {toast && (
          <div className="toast fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 shadow-2xl border"
            style={{ background: toast.type === "success" ? "#DDD9F5" : "#F5D6D6", borderColor: "rgba(255,255,255,0.6)", borderRadius: "14px", minWidth: "260px" }}>
            <span className="flex-shrink-0">
              {toast.type === "success" ? <IconCheck size={15} color="#4B4591" /> : <IconX size={15} color="#8A2020" />}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#212121]">{toast.msg}</p>
          </div>
        )}
      </div>
    </>
  );
}