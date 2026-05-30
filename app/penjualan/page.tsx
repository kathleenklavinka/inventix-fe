"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";

const user = { nama: "Andi Pratama", role: "Admin", initials: "AP" };
const isAdmin = true;

const penjualanData = [
  { id: 1,  kode: "#TRX-0842", waktu: "14:32", tanggal: "30 Mei 2026",   items: "Kopi Arabika x2, Focaccia x1",         total: 185000, metode: "QRIS",     status: "sukses"  },
  { id: 2,  kode: "#TRX-0841", waktu: "14:15", tanggal: "30 Mei 2026",   items: "Cold Brew x3, Croissant x2",            total: 225000, metode: "Tunai",    status: "sukses"  },
  { id: 3,  kode: "#TRX-0840", waktu: "13:58", tanggal: "30 Mei 2026",   items: "Matcha Latte x1",                       total: 35000,  metode: "Transfer", status: "sukses"  },
  { id: 4,  kode: "#TRX-0839", waktu: "13:44", tanggal: "30 Mei 2026",   items: "Focaccia Original x4",                  total: 100000, metode: "QRIS",     status: "sukses"  },
  { id: 5,  kode: "#TRX-0838", waktu: "13:20", tanggal: "30 Mei 2026",   items: "Kopi Arabika x1, Croissant x1",         total: 110000, metode: "Tunai",    status: "pending" },
  { id: 6,  kode: "#TRX-0837", waktu: "12:55", tanggal: "30 Mei 2026",   items: "Cold Brew x2",                          total: 90000,  metode: "QRIS",     status: "sukses"  },
  { id: 7,  kode: "#TRX-0836", waktu: "12:30", tanggal: "30 Mei 2026",   items: "Matcha Latte x2, Focaccia x1",          total: 95000,  metode: "Transfer", status: "batal"   },
  { id: 8,  kode: "#TRX-0835", waktu: "11:47", tanggal: "30 Mei 2026",   items: "Kopi Arabika x3",                       total: 255000, metode: "QRIS",     status: "sukses"  },
  { id: 9,  kode: "#TRX-0834", waktu: "11:22", tanggal: "30 Mei 2026",   items: "Croissant Butter x2, Cold Brew x1",     total: 120000, metode: "Tunai",    status: "sukses"  },
  { id: 10, kode: "#TRX-0833", waktu: "10:58", tanggal: "30 Mei 2026",   items: "Matcha Latte x3",                       total: 105000, metode: "Transfer", status: "sukses"  },
  { id: 11, kode: "#TRX-0832", waktu: "10:31", tanggal: "30 Mei 2026",   items: "Focaccia Original x2, Kopi Arabika x1", total: 135000, metode: "QRIS",     status: "sukses"  },
  { id: 12, kode: "#TRX-0831", waktu: "09:55", tanggal: "30 Mei 2026",   items: "Cold Brew x1",                          total: 45000,  metode: "Tunai",    status: "pending" },
  { id: 13, kode: "#TRX-0830", waktu: "09:20", tanggal: "29 Mei 2026",   items: "Kopi Arabika x2, Matcha Latte x1",      total: 205000, metode: "QRIS",     status: "sukses"  },
  { id: 14, kode: "#TRX-0829", waktu: "16:45", tanggal: "29 Mei 2026",   items: "Croissant Butter x4",                   total: 100000, metode: "Transfer", status: "sukses"  },
  { id: 15, kode: "#TRX-0828", waktu: "15:30", tanggal: "29 Mei 2026",   items: "Focaccia Original x1, Cold Brew x2",    total: 115000, metode: "Tunai",    status: "batal"   },
];

const HARI  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function fmt(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

const IconPlus = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconEdit = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconSearch = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconCheck = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconX = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconDownload = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconCreditCard = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const IconTrendingUp = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconCalendar = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconChevronLeft = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IconChevronRight = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

function StatusBadge({ status }: { status: string }) {
  if (status === "sukses") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "#CFDECA", color: "#2d6a3f" }}>
      <IconCheck size={8} color="#2d6a3f" /> Sukses
    </span>
  );
  if (status === "pending") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "#EFF0A3", color: "#92650a" }}>
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#92650a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Pending
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "#fee2e2", color: "#dc2626" }}>
      <IconX size={8} color="#dc2626" /> Batal
    </span>
  );
}

function MetodeBadge({ metode }: { metode: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    "QRIS":     { bg: "rgba(99,102,241,0.10)", color: "#4f46e5" },
    "Tunai":    { bg: "rgba(34,197,94,0.10)",  color: "#16a34a" },
    "Transfer": { bg: "rgba(14,165,233,0.10)", color: "#0284c7" },
  };
  const s = map[metode] || { bg: "rgba(33,33,33,0.07)", color: "#555" };
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
      style={{ background: s.bg, color: s.color, letterSpacing: "0.04em" }}>
      {metode}
    </span>
  );
}

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

const ITEMS_PER_PAGE = 8;

export default function PenjualanPage() {
  const [mounted, setMounted]   = useState(false);
  const [tanggal, setTanggal]   = useState("");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [data, setData]         = useState(penjualanData);
  const [deleteModal, setDeleteModal] = useState<typeof penjualanData[0] | null>(null);
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<"semua" | "sukses" | "pending" | "batal">("semua");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    setTimeout(() => setMounted(true), 80);
  }, []);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  const filtered = data.filter(d => {
    const matchSearch = d.kode.toLowerCase().includes(search.toLowerCase()) ||
      d.items.toLowerCase().includes(search.toLowerCase()) ||
      d.metode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "semua" || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const selected = data.find(d => d.id === selectedId) ?? null;

  function handleDelete(item: typeof penjualanData[0]) {
    setData(prev => prev.filter(d => d.id !== item.id));
    setDeleteModal(null);
    if (selectedId === item.id) setSelectedId(null);
    setToast({ msg: `Transaksi ${item.kode} berhasil dihapus.`, type: "success" });
  }

  const totalPenjualan  = data.reduce((a, b) => a + (b.status === "sukses" ? b.total : 0), 0);
  const totalTrxHariIni = data.filter(d => d.tanggal === "30 Mei 2026").length;
  const totalSukses     = data.filter(d => d.status === "sukses").length;
  const totalPending    = data.filter(d => d.status === "pending").length;
  const totalBatal      = data.filter(d => d.status === "batal").length;

  const metodeSummary = ["QRIS", "Tunai", "Transfer"].map(m => ({
    metode: m,
    count: data.filter(d => d.metode === m && d.status === "sukses").length,
    total: data.filter(d => d.metode === m && d.status === "sukses").reduce((a, b) => a + b.total, 0),
  }));
  const maxMetode = Math.max(...metodeSummary.map(m => m.total), 1);

  const groupedByDate: Record<string, typeof penjualanData> = {};
  paginated.forEach(item => {
    if (!groupedByDate[item.tanggal]) groupedByDate[item.tanggal] = [];
    groupedByDate[item.tanggal].push(item);
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn  { from{opacity:0}to{opacity:1} }
        @keyframes blobFloat {
          0%,100%{transform:translate(0,0) scale(1)}
          33%    {transform:translate(40px,-30px) scale(1.07)}
          66%    {transform:translate(-25px,25px) scale(0.95)}
        }
        @keyframes barGrow { from{width:0}to{width:var(--w)} }
        @keyframes shimmer {
          0%{background-position:-200% 0}
          100%{background-position:200% 0}
        }

        .anim-fade-up{animation:fadeUp 0.55s cubic-bezier(.22,1,.36,1) both}
        .d50 {animation-delay:.05s}.d100{animation-delay:.10s}.d150{animation-delay:.15s}
        .d200{animation-delay:.20s}.d250{animation-delay:.25s}.d300{animation-delay:.30s}
        .d350{animation-delay:.35s}.d400{animation-delay:.40s}.d450{animation-delay:.45s}

        .blob {animation:blobFloat 9s ease-in-out infinite}
        .blob2{animation:blobFloat 12s ease-in-out infinite reverse;animation-delay:3s}

        .btn-primary{
          background:#2a1f08;color:#ffffff;border:none;border-radius:12px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;
          padding:10px 20px;font-size:13px;cursor:pointer;letter-spacing:.01em;
          transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s,background .18s;
          display:inline-flex;align-items:center;gap:7px;
        }
        .btn-primary:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 28px rgba(42,31,8,.25);background:#3d2e0e}
        .btn-primary:active{transform:scale(0.97)}

        .btn-ghost{
          background:rgba(33,33,33,0.06);color:#212121;border:none;border-radius:9px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;
          padding:6px 12px;font-size:11.5px;cursor:pointer;
          transition:background .18s,transform .2s;
          display:inline-flex;align-items:center;gap:5px;
        }
        .btn-ghost:hover{background:rgba(33,33,33,0.12);transform:scale(1.03)}
        .btn-danger{
          background:rgba(220,38,38,0.08);color:#dc2626;border:none;border-radius:9px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;
          padding:6px 12px;font-size:11.5px;cursor:pointer;
          transition:background .18s,transform .2s;
          display:inline-flex;align-items:center;gap:5px;
        }
        .btn-danger:hover{background:rgba(220,38,38,0.15);transform:scale(1.03)}

        .search-input{
          border:1.5px solid rgba(33,33,33,0.11);border-radius:11px;
          padding:8px 13px 8px 36px;font-size:12.5px;background:rgba(255,255,255,0.75);
          color:#212121;outline:none;width:100%;max-width:240px;
          font-family:'Inter',sans-serif;transition:border-color .2s,box-shadow .2s;
        }
        .search-input:focus{border-color:rgba(33,33,33,0.30);box-shadow:0 0 0 3px rgba(33,33,33,0.05)}

        .filter-pill{
          padding:5px 13px;border-radius:99px;border:none;cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:10px;
          transition:background .18s,color .18s,transform .15s;letter-spacing:.02em;
        }
        .filter-pill:hover{opacity:.85}
        .filter-pill:active{transform:scale(0.96)}

        /* Receipt card */
        .receipt-card{
          position:relative;background:#fff;border-radius:14px;
          border:1.5px solid rgba(33,33,33,0.07);
          transition:border-color .2s,box-shadow .2s,transform .25s cubic-bezier(.22,1,.36,1);
          cursor:pointer;overflow:hidden;
        }
        .receipt-card::before{
          content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
          background:transparent;border-radius:3px 0 0 3px;
          transition:background .2s;
        }
        .receipt-card:hover{
          border-color:rgba(33,33,33,0.14);
          box-shadow:0 8px 28px rgba(33,33,33,0.08);
          transform:translateY(-1px) scale(1.005);
        }
        .receipt-card.selected{
          border-color:rgba(42,31,8,0.22);
          box-shadow:0 10px 32px rgba(42,31,8,0.10);
        }
        .receipt-card.selected::before{background:#2a1f08}
        .receipt-card.status-sukses::before{background:#CFDECA}
        .receipt-card.status-sukses.selected::before{background:#2d6a3f}
        .receipt-card.status-pending::before{background:#EFF0A3}
        .receipt-card.status-pending.selected::before{background:#92650a}
        .receipt-card.status-batal::before{background:#fee2e2}
        .receipt-card.status-batal.selected::before{background:#dc2626}

        /* Detail panel */
        .detail-panel{
          background:#fff;border-radius:16px;border:1.5px solid rgba(33,33,33,0.08);
          box-shadow:0 8px 32px rgba(33,33,33,0.06);
          position:sticky;top:24px;
          transition:box-shadow .3s;
        }
        .detail-panel:hover{box-shadow:0 12px 40px rgba(33,33,33,0.10)}

        /* Receipt dashed edge */
        .receipt-edge{
          width:100%;height:10px;position:relative;overflow:hidden;
          background:repeating-linear-gradient(90deg,transparent,transparent 8px,#f0ece4 8px,#f0ece4 16px);
          opacity:.6;
        }

        /* Bar */
        .method-bar{
          height:6px;border-radius:4px;background:#e8dfc8;overflow:hidden;
          transition:all .3s;
        }
        .method-bar-fill{
          height:100%;border-radius:4px;
          transition:width 1s cubic-bezier(.22,1,.36,1);
        }

        /* Page btn */
        .page-btn{
          width:30px;height:30px;border-radius:8px;border:none;font-size:11.5px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;cursor:pointer;
          display:inline-flex;align-items:center;justify-content:center;
          transition:all .18s;
        }
        .page-btn.active{background:#2a1f08;color:#EFF0A3}
        .page-btn:not(.active){background:rgba(33,33,33,0.06);color:#212121}
        .page-btn:not(.active):hover{background:rgba(33,33,33,0.13)}
        .page-btn:disabled{opacity:.3;cursor:default}

        .modal-overlay{animation:fadeIn .18s ease both}
        .modal-box{animation:fadeUp .22s cubic-bezier(.22,1,.36,1) both}
        .toast{animation:slideIn .35s cubic-bezier(.22,1,.36,1) both}

        .timeline-date-label{
          display:inline-flex;align-items:center;gap:6px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:11px;
          color:rgba(80,65,40,0.55);letter-spacing:.06em;text-transform:uppercase;
          padding:4px 10px;border-radius:8px;background:rgba(42,31,8,0.05);
        }

        .empty-state{
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:10px;padding:60px 20px;
          color:rgba(33,33,33,0.30);font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;
        }
      `}</style>

      <div className={`min-h-screen text-[#212121] font-['Inter'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F9F9FA" }}>

        <Header hasNotification={false} userInitials={user.initials} />

        <main className="w-full">

          <section className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12"
            style={{ background: "linear-gradient(160deg, #f5f0e8 0%, #ede8da 45%, #f9f7f2 100%)" }}>
            <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full opacity-30 blob pointer-events-none"
              style={{ background: "#e8d5a3", filter: "blur(72px)" }} />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-20 blob2 pointer-events-none"
              style={{ background: "#CFDECA", filter: "blur(60px)" }} />

            <Inner>
              <div className="anim-fade-up flex items-center gap-2 mb-5 text-[11px] font-medium"
                style={{ color: "rgba(80,65,40,0.45)" }}>
                <Link href="/dashboard" className="hover:text-[#2a1f08] transition-colors">Dashboard</Link>
                <span>/</span>
                <span style={{ color: "#2a1f08" }} className="font-semibold">Penjualan</span>
              </div>

              <div className="anim-fade-up d100 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.20em] uppercase mb-1.5 font-medium"
                    style={{ color: "rgba(80,65,40,0.42)" }}>Manajemen</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.2rem] leading-none"
                    style={{ color: "#2a1f08" }}>Penjualan</h1>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(80,65,40,0.38)" }}>{tanggal}</p>
                </div>
                {isAdmin && (
                  <Link href="/penjualan/tambah">
                    <button className="btn-primary">
                      <IconPlus size={15} color="#ffffff" /> Tambah Transaksi
                    </button>
                  </Link>
                )}
              </div>

              <div className="anim-fade-up d200 mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Penjualan",    val: fmt(totalPenjualan),           sub: "dari transaksi sukses",       valColor: "#2a1f08",  bg: "rgba(255,255,255,0.65)", border: "rgba(200,180,130,0.22)" },
                  { label: "Transaksi Hari Ini", val: `${totalTrxHariIni}`,          sub: "transaksi masuk hari ini",    valColor: "#2a1f08",  bg: "rgba(255,255,255,0.65)", border: "rgba(200,180,130,0.22)" },
                  { label: "Sukses",             val: `${totalSukses}`,              sub: `dari ${data.length} total`,   valColor: "#2d6a3f",  bg: "rgba(207,222,202,0.35)", border: "rgba(45,106,63,0.15)"  },
                  { label: "Batal & Pending",    val: `${totalBatal + totalPending}`,sub: `${totalBatal}B · ${totalPending}P`,valColor:"#92650a",bg:"rgba(239,240,163,0.35)",border:"rgba(146,101,10,0.15)"},
                ].map((s, i) => (
                  <div key={i} className="anim-fade-up rounded-2xl px-4 py-4 border backdrop-blur-sm"
                    style={{ background: s.bg, borderColor: s.border, animationDelay: `${0.20 + i * 0.05}s` }}>
                    <p className="font-['Plus_Jakarta_Sans'] font-black text-xl sm:text-2xl leading-none mb-1"
                      style={{ color: s.valColor }}>{s.val}</p>
                    <p className="font-['Plus_Jakarta_Sans'] font-bold text-[10px] sm:text-[11px]"
                      style={{ color: "rgba(80,65,40,0.55)" }}>{s.label}</p>
                    <p className="text-[9px] mt-0.5 font-medium"
                      style={{ color: "rgba(80,65,40,0.32)" }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            </Inner>
          </section>

          <section className="w-full py-8 sm:py-10" style={{ background: "#fff" }}>
            <Inner>
              <div className="flex flex-col lg:flex-row gap-6">

                <div className="flex-1 min-w-0">
                  <div className="anim-fade-up d200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {(["semua","sukses","pending","batal"] as const).map(s => (
                        <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
                          className="filter-pill capitalize"
                          style={{
                            background: filterStatus === s ? "#2a1f08" : "rgba(33,33,33,0.06)",
                            color: filterStatus === s ? "#EFF0A3" : "rgba(33,33,33,0.45)",
                          }}>
                          {s}
                        </button>
                      ))}
                      <span className="text-[10px] font-medium ml-1" style={{ color: "rgba(33,33,33,0.28)" }}>
                        {filtered.length} transaksi
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(33,33,33,0.35)" }}>
                          <IconSearch size={13} />
                        </span>
                        <input className="search-input" placeholder="Cari transaksi…" value={search}
                          onChange={e => { setSearch(e.target.value); setPage(1); }} />
                      </div>
                      <button className="btn-ghost flex-shrink-0">
                        <IconDownload size={12} color="rgba(33,33,33,0.5)" />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                    </div>
                  </div>

                  <div className="anim-fade-up d300 space-y-6">
                    {filtered.length === 0 ? (
                      <div className="empty-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .4 }}>
                          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <p>Tidak ada transaksi ditemukan.</p>
                      </div>
                    ) : Object.entries(groupedByDate).map(([date, items]) => (
                      <div key={date}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="timeline-date-label">
                            <IconCalendar size={10} color="rgba(80,65,40,0.5)" />
                            {date}
                          </span>
                          <div className="flex-1 h-px" style={{ background: "rgba(33,33,33,0.06)" }} />
                          <span className="text-[9px] font-semibold" style={{ color: "rgba(33,33,33,0.28)" }}>
                            {items.length} transaksi · {fmt(items.filter(x => x.status === "sukses").reduce((a, b) => a + b.total, 0))}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {items.map((item, i) => (
                            <div
                              key={item.id}
                              className={`receipt-card status-${item.status}${selectedId === item.id ? " selected" : ""}`}
                              style={{ animationDelay: `${i * 40}ms` }}
                              onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                            >
                              <div className="px-4 py-3.5 flex items-center gap-3">
                                <div className="flex-shrink-0 text-center w-11">
                                  <p className="font-['Plus_Jakarta_Sans'] font-black text-sm leading-none" style={{ color: "#2a1f08" }}>{item.waktu}</p>
                                  <p className="text-[8px] mt-0.5 font-medium" style={{ color: "rgba(33,33,33,0.30)" }}>WIB</p>
                                </div>

                                <div className="w-px h-8 flex-shrink-0" style={{ background: "rgba(33,33,33,0.07)" }} />

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                    <p className="font-['Plus_Jakarta_Sans'] font-black text-[12px]" style={{ color: "#212121" }}>{item.kode}</p>
                                    <MetodeBadge metode={item.metode} />
                                  </div>
                                  <p className="text-[11px] truncate" style={{ color: "rgba(33,33,33,0.50)" }}>{item.items}</p>
                                </div>

                                <div className="flex-shrink-0 text-right">
                                  <p className="font-['Plus_Jakarta_Sans'] font-black text-sm" style={{ color: "#212121" }}>{fmt(item.total)}</p>
                                  <div className="mt-0.5 flex justify-end">
                                    <StatusBadge status={item.status} />
                                  </div>
                                </div>
                              </div>

                              {selectedId === item.id && isAdmin && (
                                <div className="px-4 pb-3 flex items-center justify-between border-t"
                                  style={{ borderColor: "rgba(33,33,33,0.06)", background: "rgba(42,31,8,0.02)" }}>
                                  <p className="text-[10px] font-medium mt-2" style={{ color: "rgba(33,33,33,0.35)" }}>
                                    ID: {item.id} · Klik lagi untuk tutup
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Link href={`/penjualan/edit/${item.id}`}>
                                      <button className="btn-ghost" onClick={e => e.stopPropagation()}>
                                        <IconEdit size={12} /> Edit
                                      </button>
                                    </Link>
                                    <button className="btn-danger" onClick={e => { e.stopPropagation(); setDeleteModal(item); }}>
                                      <IconTrash size={12} color="#dc2626" /> Hapus
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="anim-fade-up d400 flex items-center justify-between mt-6">
                      <p className="text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>
                        Hlm. {page} dari {totalPages} · {filtered.length} transaksi
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                          <IconChevronLeft size={12} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                          .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                            acc.push(p); return acc;
                          }, [])
                          .map((p, i) => p === "…"
                            ? <span key={i} className="text-[11px] px-1" style={{ color: "rgba(33,33,33,0.30)" }}>…</span>
                            : <button key={i} className={`page-btn${page === p ? " active" : ""}`} onClick={() => setPage(p as number)}>{p}</button>
                          )}
                        <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                          <IconChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                  {selected ? (
                    <div className="detail-panel anim-fade-up">
                      <div className="px-5 pt-5 pb-1">
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div>
                            <p className="text-[9px] font-bold tracking-[.12em] uppercase mb-1" style={{ color: "rgba(33,33,33,0.35)" }}>Detail Transaksi</p>
                            <p className="font-['Plus_Jakarta_Sans'] font-black text-lg" style={{ color: "#2a1f08" }}>{selected.kode}</p>
                          </div>
                          <StatusBadge status={selected.status} />
                        </div>
                        <div className="receipt-edge" />
                      </div>
                      <div className="px-5 py-4 space-y-3">
                        {[
                          { label: "Tanggal", val: selected.tanggal },
                          { label: "Waktu",   val: selected.waktu + " WIB" },
                          { label: "Metode",  val: <MetodeBadge metode={selected.metode} /> },
                          { label: "Item",    val: selected.items },
                        ].map((row, i) => (
                          <div key={i} className="flex justify-between gap-2">
                            <p className="text-[11px] font-medium flex-shrink-0" style={{ color: "rgba(33,33,33,0.40)" }}>{row.label}</p>
                            {typeof row.val === "string"
                              ? <p className="text-[11px] font-semibold text-right" style={{ color: "#212121" }}>{row.val}</p>
                              : row.val}
                          </div>
                        ))}
                      </div>
                      <div className="receipt-edge" style={{ transform: "scaleX(-1)" }} />
                      <div className="px-5 py-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-bold" style={{ color: "rgba(33,33,33,0.40)" }}>TOTAL</p>
                          <p className="font-['Plus_Jakarta_Sans'] font-black text-lg" style={{ color: "#2a1f08" }}>{fmt(selected.total)}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="px-5 pb-5 flex gap-2">
                          <Link href={`/penjualan/edit/${selected.id}`} className="flex-1">
                            <button className="btn-ghost w-full justify-center"><IconEdit size={12} /> Edit</button>
                          </Link>
                          <button className="btn-danger flex-1 justify-center" onClick={() => setDeleteModal(selected)}>
                            <IconTrash size={12} color="#dc2626" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="detail-panel anim-fade-up d200">
                      <div className="px-5 pt-5 pb-3">
                        <p className="text-[9px] font-bold tracking-[.12em] uppercase mb-3" style={{ color: "rgba(33,33,33,0.35)" }}>Ringkasan</p>
                        <div className="rounded-xl p-4 mb-4" style={{ background: "linear-gradient(135deg,#2a1f08 0%,#4a3415 100%)" }}>
                          <p className="text-[9px] font-bold tracking-[.10em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>Total Pendapatan</p>
                          <p className="font-['Plus_Jakarta_Sans'] font-black text-xl" style={{ color: "#EFF0A3" }}>{fmt(totalPenjualan)}</p>
                          <p className="text-[9px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.30)" }}>dari {totalSukses} transaksi sukses</p>
                        </div>

                        <div className="space-y-2 mb-5">
                          {[
                            { label: "Sukses",  val: totalSukses,  color: "#2d6a3f", bg: "#CFDECA" },
                            { label: "Pending", val: totalPending, color: "#92650a", bg: "#EFF0A3" },
                            { label: "Batal",   val: totalBatal,   color: "#dc2626", bg: "#fee2e2" },
                          ].map((s, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.bg, border: `1.5px solid ${s.color}` }} />
                              <p className="text-[11px] font-medium flex-1" style={{ color: "rgba(33,33,33,0.55)" }}>{s.label}</p>
                              <p className="font-['Plus_Jakarta_Sans'] font-black text-sm" style={{ color: s.color }}>{s.val}</p>
                            </div>
                          ))}
                        </div>

                        <div className="h-px mb-4" style={{ background: "rgba(33,33,33,0.07)" }} />

                        <p className="text-[9px] font-bold tracking-[.12em] uppercase mb-3" style={{ color: "rgba(33,33,33,0.35)" }}>Metode Pembayaran</p>
                        <div className="space-y-3">
                          {metodeSummary.map((m, i) => (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  <IconCreditCard size={10} color="rgba(33,33,33,0.45)" />
                                  <p className="text-[11px] font-semibold" style={{ color: "rgba(33,33,33,0.60)" }}>{m.metode}</p>
                                </div>
                                <p className="text-[10px] font-bold" style={{ color: "#2a1f08" }}>{m.count}x</p>
                              </div>
                              <div className="method-bar">
                                <div className="method-bar-fill"
                                  style={{
                                    width: `${(m.total / maxMetode) * 100}%`,
                                    background: m.metode === "QRIS" ? "#818cf8" : m.metode === "Tunai" ? "#4ade80" : "#38bdf8"
                                  }} />
                              </div>
                              <p className="text-[9px] mt-0.5 font-medium" style={{ color: "rgba(33,33,33,0.35)" }}>{fmt(m.total)}</p>
                            </div>
                          ))}
                        </div>

                        <div className="h-px my-4" style={{ background: "rgba(33,33,33,0.07)" }} />

                        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(42,31,8,0.04)" }}>
                          <IconTrendingUp size={14} color="#7a5c2e" />
                          <p className="text-[10px] font-medium" style={{ color: "rgba(80,65,40,0.60)" }}>
                            Klik transaksi untuk melihat detail & aksi.
                          </p>
                        </div>
                      </div>
                      <div className="px-5 pb-5" />
                    </div>
                  )}
                </div>
              </div>
            </Inner>
          </section>
        </main>

        <Footer />

        {deleteModal && (
          <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(33,33,33,0.45)", backdropFilter: "blur(8px)" }}
            onClick={() => setDeleteModal(null)}>
            <div className="modal-box w-full max-w-sm p-6 sm:p-7 border"
              style={{ background: "#FFFFFF", borderRadius: "20px", borderColor: "rgba(33,33,33,0.08)", boxShadow: "0 24px 64px rgba(33,33,33,0.18)" }}
              onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#fee2e2" }}>
                <IconTrash size={22} color="#dc2626" />
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-black text-lg text-[#212121] mb-1.5">Hapus Transaksi?</h2>
              <p className="text-sm mb-6" style={{ color: "rgba(33,33,33,0.55)" }}>
                Transaksi <span className="font-semibold text-[#212121]">{deleteModal.kode}</span> akan dihapus permanen dan tidak bisa dipulihkan.
              </p>
              <div className="flex gap-3">
                <button className="btn-ghost flex-1 justify-center" onClick={() => setDeleteModal(null)}>Batal</button>
                <button className="btn-danger flex-1 justify-center font-bold" style={{ padding: "10px 20px", fontSize: "13px" }}
                  onClick={() => handleDelete(deleteModal)}>
                  <IconTrash size={13} color="#dc2626" /> Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="toast fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 shadow-2xl border"
            style={{ background: toast.type === "success" ? "#CFDECA" : "#fee2e2", borderColor: "rgba(255,255,255,0.7)", borderRadius: "14px", minWidth: "260px" }}>
            <span className="flex-shrink-0">
              {toast.type === "success" ? <IconCheck size={15} color="#2d6a3f" /> : <IconX size={15} color="#dc2626" />}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#212121]">{toast.msg}</p>
          </div>
        )}
      </div>
    </>
  );
}