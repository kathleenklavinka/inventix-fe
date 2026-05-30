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

const SHOW_OPTIONS = [5, 10, 25, 50];
const HARI  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function fmt(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

const IconReceipt = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconCheckCircle = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconClock = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconXCircle = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);
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
const IconSort = ({ size = 11, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);
const IconSortDown = ({ size = 11, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 19 19 12"/>
  </svg>
);
const IconDownload = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

function StatusBadge({ status }: { status: string }) {
  if (status === "sukses") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background: "#CFDECA", color: "#212121" }}>
      <IconCheck size={9} color="#2d6a3f" /> Sukses
    </span>
  );
  if (status === "pending") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background: "#EFF0A3", color: "#212121" }}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#92650a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Pending
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-red-100 text-red-600">
      <IconX size={9} color="#dc2626" /> Batal
    </span>
  );
}

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

export default function PenjualanPage() {
  const [mounted, setMounted]     = useState(false);
  const [tanggal, setTanggal]     = useState("");
  const [search, setSearch]       = useState("");
  const [showCount, setShowCount] = useState(10);
  const [sortCol, setSortCol]     = useState<string | null>(null);
  const [sortDir, setSortDir]     = useState<"asc" | "desc">("asc");
  const [page, setPage]           = useState(1);
  const [data, setData]           = useState(penjualanData);
  const [deleteModal, setDeleteModal] = useState<typeof penjualanData[0] | null>(null);
  const [toast, setToast]         = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<"semua" | "sukses" | "pending" | "batal">("semua");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    };
    update();
    setTimeout(() => setMounted(true), 100);
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

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const va = (a as any)[sortCol];
    const vb = (b as any)[sortCol];
    if (typeof va === "number") return sortDir === "asc" ? va - vb : vb - va;
    return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });

  const totalPages = Math.ceil(sorted.length / showCount);
  const paginated  = sorted.slice((page - 1) * showCount, page * showCount);

  function handleSort(col: string) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  }

  function handleDelete(item: typeof penjualanData[0]) {
    setData(prev => prev.filter(d => d.id !== item.id));
    setDeleteModal(null);
    setToast({ msg: `Transaksi ${item.kode} berhasil dihapus.`, type: "success" });
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <span style={{ color: "rgba(33,33,33,0.20)", display: "inline-flex" }}><IconSort /></span>;
    return <span style={{ color: "#212121", display: "inline-flex" }}>{sortDir === "asc" ? <IconSort /> : <IconSortDown />}</span>;
  }

  const totalPenjualan  = data.reduce((a, b) => a + (b.status === "sukses" ? b.total : 0), 0);
  const totalTrxHariIni = data.filter(d => d.tanggal === "30 Mei 2026").length;
  const totalSukses     = data.filter(d => d.status === "sukses").length;
  const totalBatal      = data.filter(d => d.status === "batal").length;
  const totalPending    = data.filter(d => d.status === "pending").length;

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn  { from{opacity:0}to{opacity:1} }
        @keyframes blob {
          0%,100%{transform:translate(0,0) scale(1)}
          33%    {transform:translate(40px,-30px) scale(1.07)}
          66%    {transform:translate(-25px,25px) scale(0.95)}
        }
        .anim-fade-up{animation:fadeUp 0.6s cubic-bezier(.22,1,.36,1) both}
        .d50{animation-delay:.05s}.d100{animation-delay:.10s}.d150{animation-delay:.15s}
        .d200{animation-delay:.20s}.d250{animation-delay:.25s}.d300{animation-delay:.30s}
        .d350{animation-delay:.35s}.d400{animation-delay:.40s}
        .blob {animation:blob 9s ease-in-out infinite}
        .blob2{animation:blob 12s ease-in-out infinite reverse;animation-delay:3s}
        .zoom-card{transition:transform .30s cubic-bezier(.22,1,.36,1),box-shadow .30s cubic-bezier(.22,1,.36,1);will-change:transform;cursor:default}
        .zoom-card:hover{transform:scale(1.018);box-shadow:0 20px 48px rgba(33,33,33,0.10)}
        .tbl-row{transition:background .18s,transform .22s cubic-bezier(.22,1,.36,1)}
        .tbl-row:hover{background:rgba(255,255,255,0.70)!important;transform:scale(1.008) translateX(2px)}
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
          background:rgba(33,33,33,0.06);color:#212121;border:none;border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;
          padding:7px 14px;font-size:12px;cursor:pointer;
          transition:background .18s,transform .2s;
          display:inline-flex;align-items:center;gap:5px;
        }
        .btn-ghost:hover{background:rgba(33,33,33,0.12);transform:scale(1.03)}
        .btn-danger{
          background:rgba(220,38,38,0.08);color:#dc2626;border:none;border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;
          padding:7px 14px;font-size:12px;cursor:pointer;
          transition:background .18s,transform .2s;
          display:inline-flex;align-items:center;gap:5px;
        }
        .btn-danger:hover{background:rgba(220,38,38,0.15);transform:scale(1.03)}
        .search-input{
          border:1.5px solid rgba(33,33,33,0.12);border-radius:12px;
          padding:9px 14px 9px 38px;font-size:13px;background:rgba(255,255,255,0.7);
          color:#212121;outline:none;width:100%;max-width:260px;
          font-family:'Inter',sans-serif;transition:border-color .2s,box-shadow .2s;
        }
        .search-input:focus{border-color:rgba(33,33,33,0.35);box-shadow:0 0 0 3px rgba(33,33,33,0.06)}
        .select-input{
          border:1.5px solid rgba(33,33,33,0.12);border-radius:10px;
          padding:8px 12px;font-size:12px;font-family:'Inter',sans-serif;
          background:rgba(255,255,255,0.7);color:#212121;outline:none;cursor:pointer;
        }
        .page-btn{
          width:32px;height:32px;border-radius:8px;border:none;font-size:12px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;cursor:pointer;
          display:inline-flex;align-items:center;justify-content:center;transition:all .18s;
        }
        .page-btn.active{background:#212121;color:#EFF0A3}
        .page-btn:not(.active){background:rgba(33,33,33,0.06);color:#212121}
        .page-btn:not(.active):hover{background:rgba(33,33,33,0.14)}
        .page-btn:disabled{opacity:.3;cursor:default}
        .modal-overlay{animation:fadeIn .18s ease both}
        .modal-box{animation:fadeUp .22s cubic-bezier(.22,1,.36,1) both}
        .toast{animation:slideIn .35s cubic-bezier(.22,1,.36,1) both}
        .stat-strip{
          display:flex;background:rgba(255,255,255,0.52);
          border:1px solid rgba(200,180,130,0.22);
          border-radius:16px;overflow:hidden;backdrop-filter:blur(14px);
        }
        .stat-strip-item{
          flex:1;padding:16px 18px;display:flex;align-items:center;gap:13px;
          position:relative;cursor:default;transition:background .2s;
        }
        .stat-strip-item:hover{background:rgba(255,255,255,0.72)}
        .stat-strip-item+.stat-strip-item::before{
          content:'';position:absolute;left:0;top:20%;height:60%;
          width:1px;background:rgba(180,155,100,0.20);
        }
        .stat-strip-icon{
          width:38px;height:38px;border-radius:11px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          transition:transform .25s cubic-bezier(.22,1,.36,1);
        }
        .stat-strip-item:hover .stat-strip-icon{transform:scale(1.14) rotate(4deg)}
        .filter-pill{transition:background .2s,color .2s,transform .15s;cursor:pointer}
        .filter-pill:hover{opacity:.85}
        .filter-pill:active{transform:scale(0.96)}
        .sort-th{cursor:pointer;user-select:none}
        .sort-th:hover{color:#212121!important}
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

              <div className="anim-fade-up d200 stat-strip mt-7">
                {[
                  { label: "Total Penjualan",    val: fmt(totalPenjualan),            icon: <IconReceipt size={18} color="#7a5c2e" />,    iconBg: "#e8dfc8", valColor: "#2a1f08" },
                  { label: "Transaksi Hari Ini", val: `${totalTrxHariIni} Transaksi`,       icon: <IconClock size={18} color="#2a3a52" />,      iconBg: "#D8DFE9", valColor: "#2a1f08" },
                  { label: "Sukses",             val: `${totalSukses}`,               icon: <IconCheckCircle size={18} color="#2d6a3f" />, iconBg: "#CFDECA", valColor: "#2d6a3f" },
                  { label: "Batal / Pending",    val: `${totalBatal + totalPending}`, icon: <IconXCircle size={18} color="#dc2626" />,    iconBg: "#fee2e2", valColor: "#dc2626" },
                ].map((s, i) => (
                  <div key={i} className="stat-strip-item">
                    <div className="stat-strip-icon" style={{ background: s.iconBg }}>{s.icon}</div>
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-black text-lg sm:text-xl leading-none"
                        style={{ color: s.valColor }}>{s.val}</p>
                      <p className="text-[10px] sm:text-[11px] mt-1 font-medium"
                        style={{ color: "rgba(80,65,40,0.45)" }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Inner>
          </section>

          <section className="w-full py-10 sm:py-12" style={{ background: "#FFFFFF" }}>
            <Inner>
              <div className="anim-fade-up d200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.45)" }}>Tampilkan</span>
                  <select className="select-input" value={showCount}
                    onChange={e => { setShowCount(Number(e.target.value)); setPage(1); }}>
                    {SHOW_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.45)" }}>entri</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center" style={{ color: "rgba(33,33,33,0.35)" }}>
                      <IconSearch size={14} />
                    </span>
                    <input className="search-input" placeholder="Cari transaksi…" value={search}
                      onChange={e => { setSearch(e.target.value); setPage(1); }} />
                  </div>
                  <button className="btn-ghost flex-shrink-0">
                    <IconDownload size={13} color="rgba(33,33,33,0.55)" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>

              <div className="anim-fade-up d250 flex items-center gap-2 mb-5 flex-wrap">
                {(["semua","sukses","pending","batal"] as const).map(s => (
                  <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
                    className="filter-pill text-[10px] font-bold px-3 py-1.5 rounded-full capitalize"
                    style={{
                      background: filterStatus === s ? "#212121" : "rgba(33,33,33,0.06)",
                      color: filterStatus === s ? "#EFF0A3" : "rgba(33,33,33,0.40)",
                    }}>
                    {s}
                  </button>
                ))}
                <span className="ml-auto text-[10px]" style={{ color: "rgba(33,33,33,0.28)" }}>{sorted.length} transaksi</span>
              </div>

              <div className="anim-fade-up d300 zoom-card overflow-hidden border"
                style={{ background: "rgba(255,255,255,0.60)", backdropFilter: "blur(22px)", borderColor: "rgba(33,33,33,0.08)", borderRadius: "18px", boxShadow: "0 8px 32px rgba(33,33,33,0.07), inset 0 1px 0 rgba(255,255,255,0.95)" }}>

                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(33,33,33,0.03)", borderBottom: "1px solid rgba(33,33,33,0.07)" }}>
                        {[
                          { label: "No",      col: null },
                          { label: "Kode",    col: "kode" },
                          { label: "Tanggal", col: "tanggal" },
                          { label: "Waktu",   col: "waktu" },
                          { label: "Item",    col: "items" },
                          { label: "Total",   col: "total" },
                          { label: "Metode",  col: "metode" },
                          { label: "Status",  col: "status" },
                          ...(isAdmin ? [{ label: "Aksi", col: null }] : []),
                        ].map((h, i) => (
                          <th key={i}
                            className={`px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase ${h.col ? "sort-th" : ""}`}
                            style={{ color: "rgba(33,33,33,0.35)" }}
                            onClick={() => h.col && handleSort(h.col)}>
                            <span className="flex items-center gap-1.5">
                              {h.label} {h.col && <SortIcon col={h.col} />}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.length === 0 ? (
                        <tr><td colSpan={isAdmin ? 9 : 8} className="px-6 py-12 text-center text-sm" style={{ color: "rgba(33,33,33,0.35)" }}>
                          Tidak ada transaksi ditemukan.
                        </td></tr>
                      ) : paginated.map((item, i) => (
                        <tr key={item.id} className="tbl-row"
                          style={{ borderTop: "1px solid rgba(33,33,33,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(33,33,33,0.012)" }}>
                          <td className="px-5 py-4 text-[11px] font-bold" style={{ color: "rgba(33,33,33,0.32)" }}>
                            {(page - 1) * showCount + i + 1}
                          </td>
                          <td className="px-5 py-4 font-bold text-[11px] text-[#212121]">{item.kode}</td>
                          <td className="px-5 py-4 text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.50)" }}>{item.tanggal}</td>
                          <td className="px-5 py-4 text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.45)" }}>{item.waktu}</td>
                          <td className="px-5 py-4 text-[11px]" style={{ color: "rgba(33,33,33,0.60)", maxWidth: "180px" }}>
                            <span className="line-clamp-1">{item.items}</span>
                          </td>
                          <td className="px-5 py-4 font-black text-xs text-[#212121]">{fmt(item.total)}</td>
                          <td className="px-5 py-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                              style={{ background: "rgba(33,33,33,0.07)", color: "rgba(33,33,33,0.55)" }}>
                              {item.metode}
                            </span>
                          </td>
                          <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                          {isAdmin && (
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <Link href={`/penjualan/edit/${item.id}`}>
                                  <button className="btn-ghost"><IconEdit size={13} /> Edit</button>
                                </Link>
                                <button className="btn-danger" onClick={() => setDeleteModal(item)}>
                                  <IconTrash size={13} color="#dc2626" /> Hapus
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden divide-y" style={{ borderColor: "rgba(33,33,33,0.06)" }}>
                  {paginated.length === 0 ? (
                    <div className="py-12 text-center text-sm" style={{ color: "rgba(33,33,33,0.35)" }}>Tidak ada transaksi.</div>
                  ) : paginated.map((item) => (
                    <div key={item.id} className="tbl-row px-4 py-4">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <p className="font-bold text-sm text-[#212121]">{item.kode}</p>
                          <p className="text-[10px] mt-0.5 font-medium" style={{ color: "rgba(33,33,33,0.40)" }}>{item.tanggal} · {item.waktu}</p>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="text-[11px] mb-1.5 truncate" style={{ color: "rgba(33,33,33,0.55)" }}>{item.items}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-sm text-[#212121]">{fmt(item.total)}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                          style={{ background: "rgba(33,33,33,0.07)", color: "rgba(33,33,33,0.55)" }}>{item.metode}</span>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <Link href={`/penjualan/edit/${item.id}`} className="flex-1">
                            <button className="btn-ghost w-full justify-center"><IconEdit size={13} /> Edit</button>
                          </Link>
                          <button className="btn-danger flex-1 justify-center" onClick={() => setDeleteModal(item)}>
                            <IconTrash size={13} color="#dc2626" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="anim-fade-up d400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                <p className="text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.40)" }}>
                  Menampilkan {Math.min((page - 1) * showCount + 1, sorted.length)}–{Math.min(page * showCount, sorted.length)} dari {sorted.length} entri
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                      acc.push(p); return acc;
                    }, [])
                    .map((p, i) => p === "…"
                      ? <span key={i} className="text-[11px] px-1" style={{ color: "rgba(33,33,33,0.35)" }}>…</span>
                      : <button key={i} className={`page-btn${page === p ? " active" : ""}`} onClick={() => setPage(p as number)}>{p}</button>
                    )}
                  <button className="page-btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              </div>
            </Inner>
          </section>

          <section className="w-full relative overflow-hidden py-5 sm:py-6" style={{ background: "#212121" }}>
            <Inner>
              <div className="anim-fade-up d300 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
                  {[
                    { val: fmt(totalPenjualan),          label: "Total penjualan",    danger: false },
                    { val: `${totalTrxHariIni} trx`,      label: "Transaksi hari ini", danger: false },
                    { val: `${totalBatal + totalPending}`, label: "Batal / pending",    danger: (totalBatal + totalPending) > 0 },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-4 sm:gap-8">
                      {i > 0 && <div className="w-px h-8 hidden sm:block" style={{ background: "rgba(249,249,250,0.08)" }} />}
                      <div className="text-center cursor-default">
                        <p className={`font-['Plus_Jakarta_Sans'] font-black text-base sm:text-lg ${(s as any).danger ? "text-red-400" : "text-[#F9F9FA]"}`}>{s.val}</p>
                        <p className="text-[9px] sm:text-[10px] font-medium mt-0.5" style={{ color: "rgba(249,249,250,0.28)" }}>{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] sm:text-[10px] font-medium" style={{ color: "rgba(249,249,250,0.18)" }}>Inventix v1.0 · Penjualan</p>
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
                Transaksi <span className="font-semibold text-[#212121]">{deleteModal.kode}</span> akan dihapus permanen dari sistem dan tidak bisa dipulihkan.
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