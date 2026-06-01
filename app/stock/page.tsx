"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";

const user = { nama: "Andi Pratama", role: "Admin", initials: "AP" };
const isAdmin = true;

const stokData = [
  { id: 1,  nama: "Tepung Terigu",    jumlah: 0,   satuan: "kg",    max: 100, kategori: "Tepung & Kering" },
  { id: 2,  nama: "Gula Pasir",       jumlah: 50,  satuan: "kg",    max: 100, kategori: "Pemanis" },
  { id: 3,  nama: "Minyak Goreng",    jumlah: 0,   satuan: "liter", max: 80,  kategori: "Lemak & Minyak" },
  { id: 4,  nama: "Susu UHT",         jumlah: 120, satuan: "pcs",   max: 200, kategori: "Susu & Dairy" },
  { id: 5,  nama: "Kopi Arabika",     jumlah: 30,  satuan: "kg",    max: 60,  kategori: "Minuman" },
  { id: 6,  nama: "Teh Hijau",        jumlah: 15,  satuan: "pcs",   max: 50,  kategori: "Minuman" },
  { id: 7,  nama: "Beras Premium",    jumlah: 200, satuan: "kg",    max: 300, kategori: "Tepung & Kering" },
  { id: 8,  nama: "Garam Halus",      jumlah: 8,   satuan: "kg",    max: 40,  kategori: "Bumbu" },
  { id: 9,  nama: "Mentega",          jumlah: 0,   satuan: "pcs",   max: 60,  kategori: "Lemak & Minyak" },
  { id: 10, nama: "Coklat Bubuk",     jumlah: 22,  satuan: "kg",    max: 50,  kategori: "Pemanis" },
  { id: 11, nama: "Vanilla Essence",  jumlah: 40,  satuan: "botol", max: 80,  kategori: "Bumbu" },
  { id: 12, nama: "Baking Powder",    jumlah: 5,   satuan: "pcs",   max: 30,  kategori: "Tepung & Kering" },
];

const SHOW_OPTIONS = [5, 10, 25, 50];
const HARI = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

//  SVG ICONS 
const IconBox = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconAlertTriangle = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconTrendingDown = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
);

const IconCheckCircle = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconPlus = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
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
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconSearch = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconCheck = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconX = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconSort = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <polyline points="5 12 12 5 19 12"/>
  </svg>
);

const IconSortDown = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <polyline points="5 12 12 19 19 12"/>
  </svg>
);

const IconGrid = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const IconList = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

function StatusBadge({ jumlah, max }: { jumlah: number; max: number }) {
  if (jumlah === 0) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-red-100 text-red-600">
      <IconX size={9} color="#dc2626" /> Habis
    </span>
  );
  if (jumlah / max < 0.3) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background: "#EFF0A3", color: "#212121" }}>
      <IconAlertTriangle size={9} color="#92650a" /> Menipis
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background: "#CFDECA", color: "#212121" }}>
      <IconCheck size={9} color="#2d6a3f" /> Tersedia
    </span>
  );
}

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

export default function StockPage() {
  const [mounted, setMounted] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [tanggal, setTanggal] = useState("");
  const [search, setSearch] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(stokData);
  const [deleteModal, setDeleteModal] = useState<typeof stokData[0] | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const adaStokHabis = data.some((d) => d.jumlah === 0);
  const kategoriList = ["Semua", ...Array.from(new Set(data.map(d => d.kategori)))];

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    };
    update();
    setTimeout(() => { setMounted(true); setAnimIn(true); }, 100);
  }, []);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  const filtered = data.filter((d) => {
    const matchSearch =
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.satuan.toLowerCase().includes(search.toLowerCase());
    const matchKat = filterKategori === "Semua" || d.kategori === filterKategori;
    return matchSearch && matchKat;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const va = (a as any)[sortCol];
    const vb = (b as any)[sortCol];
    if (typeof va === "number") return sortDir === "asc" ? va - vb : vb - va;
    return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });

  const totalPages = Math.ceil(sorted.length / showCount);
  const paginated = sorted.slice((page - 1) * showCount, page * showCount);

  function handleSort(col: string) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  }

  function handleDelete(item: typeof stokData[0]) {
    setData(prev => prev.filter(d => d.id !== item.id));
    setDeleteModal(null);
    setToast({ msg: `${item.nama} berhasil dihapus.`, type: "success" });
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <span style={{ color: "rgba(33,33,33,0.20)", display:"inline-flex" }}><IconSort size={11} /></span>;
    return <span style={{ color: "#212121", display:"inline-flex" }}>{sortDir === "asc" ? <IconSort size={11} /> : <IconSortDown size={11} />}</span>;
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blob {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(40px,-30px) scale(1.07); }
          66%      { transform:translate(-25px,25px) scale(0.95); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(32px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }

        .anim-fade-up { animation:fadeUp 0.6s cubic-bezier(.22,1,.36,1) both; }
        .d50{animation-delay:.05s}.d100{animation-delay:.10s}.d150{animation-delay:.15s}
        .d200{animation-delay:.20s}.d250{animation-delay:.25s}.d300{animation-delay:.30s}
        .d350{animation-delay:.35s}.d400{animation-delay:.40s}

        .blob  { animation:blob 9s ease-in-out infinite; }
        .blob2 { animation:blob 12s ease-in-out infinite reverse; animation-delay:3s; }

        .zoom-card {
          transition:transform .30s cubic-bezier(.22,1,.36,1), box-shadow .30s cubic-bezier(.22,1,.36,1);
          will-change:transform; cursor:default;
        }
        .zoom-card:hover { transform:scale(1.018); box-shadow:0 20px 48px rgba(33,33,33,0.10); }

        .tbl-row { transition:background .18s, transform .22s cubic-bezier(.22,1,.36,1); }
        .tbl-row:hover { background:rgba(255,255,255,0.70) !important; transform:scale(1.008) translateX(2px); }

        .btn-primary {
          background:#2a1f08; color:#ffffff; border:none; border-radius:12px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:700;
          padding:10px 20px; font-size:13px; cursor:pointer; letter-spacing:0.01em;
          transition:transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s, background .18s;
          display:inline-flex; align-items:center; gap:7px;
        }
        .btn-primary:hover { transform:translateY(-2px) scale(1.04); box-shadow:0 10px 28px rgba(42,31,8,0.25); background:#3d2e0e; }
        .btn-primary:active { transform:scale(0.97); }

        .btn-ghost {
          background:rgba(33,33,33,0.06); color:#212121; border:none; border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;
          padding:7px 14px; font-size:12px; cursor:pointer;
          transition:background .18s, transform .2s;
          display:inline-flex; align-items:center; gap:5px;
        }
        .btn-ghost:hover { background:rgba(33,33,33,0.12); transform:scale(1.03); }

        .btn-danger {
          background:rgba(220,38,38,0.08); color:#dc2626; border:none; border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;
          padding:7px 14px; font-size:12px; cursor:pointer;
          transition:background .18s, transform .2s;
          display:inline-flex; align-items:center; gap:5px;
        }
        .btn-danger:hover { background:rgba(220,38,38,0.15); transform:scale(1.03); }

        .search-input {
          border:1.5px solid rgba(33,33,33,0.12); border-radius:12px;
          padding:9px 14px 9px 38px; font-size:13px; background:rgba(255,255,255,0.7);
          color:#212121; outline:none; width:100%; max-width:260px;
          font-family:'Inter',sans-serif;
          transition:border-color .2s, box-shadow .2s;
        }
        .search-input:focus { border-color:rgba(33,33,33,0.35); box-shadow:0 0 0 3px rgba(33,33,33,0.06); }

        .select-input {
          border:1.5px solid rgba(33,33,33,0.12); border-radius:10px;
          padding:8px 12px; font-size:12px; font-family:'Inter',sans-serif;
          background:rgba(255,255,255,0.7); color:#212121; outline:none; cursor:pointer;
        }

        .page-btn {
          width:32px; height:32px; border-radius:8px; border:none; font-size:12px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; cursor:pointer;
          display:inline-flex; align-items:center; justify-content:center;
          transition:all .18s;
        }
        .page-btn.active { background:#212121; color:#EFF0A3; }
        .page-btn:not(.active) { background:rgba(33,33,33,0.06); color:#212121; }
        .page-btn:not(.active):hover { background:rgba(33,33,33,0.14); }
        .page-btn:disabled { opacity:0.3; cursor:default; }

        .modal-overlay { animation:fadeIn .18s ease both; }
        .modal-box { animation:fadeUp .22s cubic-bezier(.22,1,.36,1) both; }
        .toast { animation:slideIn .35s cubic-bezier(.22,1,.36,1) both; }

        .stat-strip {
          display:flex;
          background:rgba(255,255,255,0.52);
          border:1px solid rgba(200,180,130,0.22);
          border-radius:16px;
          overflow:hidden;
          backdrop-filter:blur(14px);
        }
        .stat-strip-item {
          flex:1; padding:16px 18px;
          display:flex; align-items:center; gap:13px;
          position:relative; cursor:default;
          transition:background .2s;
        }
        .stat-strip-item:hover { background:rgba(255,255,255,0.72); }
        .stat-strip-item + .stat-strip-item::before {
          content:'';
          position:absolute; left:0; top:20%; height:60%;
          width:1px; background:rgba(180,155,100,0.20);
        }
        .stat-strip-icon {
          width:38px; height:38px; border-radius:11px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          transition:transform .25s cubic-bezier(.22,1,.36,1);
        }
        .stat-strip-item:hover .stat-strip-icon { transform:scale(1.14) rotate(4deg); }

        .progress-bar { transition:width 1.2s cubic-bezier(.22,1,.36,1); }
        .sort-th { cursor:pointer; user-select:none; }
        .sort-th:hover { color:#212121 !important; }

        .kat-pill {
          padding:5px 13px; border-radius:999px; font-size:11px; font-weight:600;
          cursor:pointer; border:none; transition:all .18s;
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .kat-pill.on { background:#2a1f08; color:#EFF0A3; }
        .kat-pill.off { background:rgba(42,31,8,0.08); color:rgba(42,31,8,0.50); }
        .kat-pill.off:hover { background:rgba(42,31,8,0.15); color:#2a1f08; }

        .view-toggle-btn {
          width:30px; height:30px; border-radius:8px; border:none; cursor:pointer;
          display:inline-flex; align-items:center; justify-content:center;
          transition:all .18s;
        }
        .view-toggle-btn.on { background:#2a1f08; color:#EFF0A3; }
        .view-toggle-btn.off { background:rgba(42,31,8,0.08); color:rgba(42,31,8,0.40); }
        .view-toggle-btn.off:hover { background:rgba(42,31,8,0.15); color:#2a1f08; }

        .stk-grid-card {
          border:1.5px solid rgba(33,33,33,0.09); border-radius:16px;
          padding:20px; background:rgba(255,255,255,0.80);
          transition:transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s, border-color .2s;
          cursor:default;
        }
        .stk-grid-card:hover {
          transform:translateY(-4px);
          box-shadow:0 18px 40px rgba(42,31,8,0.10);
          border-color:rgba(42,31,8,0.20);
        }
      `}</style>

      <div className={`min-h-screen text-[#212121] font-['Inter'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F9F9FA" }}>

        <Header hasNotification={adaStokHabis} userInitials={user.initials} />

        <main className="w-full">

          {/*  HERO SECTION  */}
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
                <span style={{ color: "#2a1f08" }} className="font-semibold">Stok Barang</span>
              </div>

              {/* Page header */}
              <div className="anim-fade-up d100 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.20em] uppercase mb-1.5 font-medium"
                    style={{ color: "rgba(80,65,40,0.42)" }}>Manajemen</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.2rem] leading-none"
                    style={{ color: "#2a1f08" }}>
                    Stok Barang
                  </h1>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(80,65,40,0.38)" }}>{tanggal}</p>
                </div>
                {isAdmin && (
                  <Link href="/stock/tambah">
                    <button className="btn-primary">
                      <IconPlus size={15} color="#ffffff" /> Tambah Barang
                    </button>
                  </Link>
                )}
              </div>

              {/* STAT STRIP */}
              <div className="anim-fade-up d200 stat-strip mt-7">
                {[
                  {
                    label: "Total Barang",
                    val: data.length,
                    icon: <IconBox size={18} color="#7a5c2e" />,
                    iconBg: "#e8dfc8",
                    valColor: "#2a1f08",
                  },
                  {
                    label: "Stok Habis",
                    val: data.filter(d => d.jumlah === 0).length,
                    icon: <IconAlertTriangle size={18} color="#dc2626" />,
                    iconBg: "#fee2e2",
                    valColor: "#dc2626",
                  },
                  {
                    label: "Stok Menipis",
                    val: data.filter(d => d.jumlah > 0 && d.jumlah / d.max < 0.3).length,
                    icon: <IconTrendingDown size={18} color="#92650a" />,
                    iconBg: "#fef3c7",
                    valColor: "#92650a",
                  },
                  {
                    label: "Stok Tersedia",
                    val: data.filter(d => d.jumlah / d.max >= 0.3).length,
                    icon: <IconCheckCircle size={18} color="#2d6a3f" />,
                    iconBg: "#CFDECA",
                    valColor: "#2d6a3f",
                  },
                ].map((s, i) => (
                  <div key={i} className="stat-strip-item">
                    <div className="stat-strip-icon" style={{ background: s.iconBg }}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-black text-xl sm:text-2xl leading-none"
                        style={{ color: s.valColor }}>{s.val}</p>
                      <p className="text-[10px] sm:text-[11px] mt-1 font-medium"
                        style={{ color: "rgba(80,65,40,0.45)" }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stok habis banner */}
              {adaStokHabis && (
                <div className="anim-fade-up d300 relative mt-3.5 flex items-center gap-3 px-4 sm:px-5 py-3.5 border"
                  style={{ background:"rgba(254,242,242,0.85)", backdropFilter:"blur(8px)", borderColor:"rgba(248,113,113,0.25)", borderRadius:"14px" }}>
                  <span className="flex-shrink-0"><IconAlertTriangle size={16} color="#dc2626" /></span>
                  <p className="text-xs sm:text-sm font-medium text-red-600">
                    Terdapat <span className="font-bold">{data.filter(d => d.jumlah === 0).length} barang</span> dengan stok habis. Segera lakukan restok.
                  </p>
                </div>
              )}
            </Inner>
          </section>

          {/* TABLE SECTION */}
          <section className="w-full py-10 sm:py-12" style={{ background: "#FFFFFF" }}>
            <Inner>

              {/* FILTER */}
              <div className="anim-fade-up d100 flex items-center gap-2 flex-wrap mb-5">
                {kategoriList.map(k => (
                  <button
                    key={k}
                    className={`kat-pill ${filterKategori === k ? "on" : "off"}`}
                    onClick={() => { setFilterKategori(k); setPage(1); }}
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="anim-fade-up d200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.45)" }}>Tampilkan</span>
                  <select className="select-input" value={showCount}
                    onChange={e => { setShowCount(Number(e.target.value)); setPage(1); }}>
                    {SHOW_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.45)" }}>entri</span>
                  {/* View toggle */}
                  <div className="flex items-center gap-1 ml-1 border rounded-[8px] p-0.5" style={{ borderColor: "rgba(42,31,8,0.12)" }}>
                    <button
                      className={`view-toggle-btn ${viewMode === "table" ? "on" : "off"}`}
                      onClick={() => setViewMode("table")}
                      title="Tampilan tabel"
                    >
                      <IconList size={13} />
                    </button>
                    <button
                      className={`view-toggle-btn ${viewMode === "grid" ? "on" : "off"}`}
                      onClick={() => setViewMode("grid")}
                      title="Tampilan kartu"
                    >
                      <IconGrid size={13} />
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center" style={{ color: "rgba(33,33,33,0.35)" }}>
                    <IconSearch size={14} />
                  </span>
                  <input className="search-input" placeholder="Cari barang…" value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>
              </div>

              {/* TABLE VIEW */}
              {viewMode === "table" && (
                <div className="anim-fade-up d300 zoom-card overflow-hidden border"
                  style={{ background: "rgba(255,255,255,0.60)", backdropFilter:"blur(22px)", borderColor:"rgba(33,33,33,0.08)", borderRadius:"18px", boxShadow:"0 8px 32px rgba(33,33,33,0.07), inset 0 1px 0 rgba(255,255,255,0.95)" }}>

                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background:"rgba(33,33,33,0.03)", borderBottom:"1px solid rgba(33,33,33,0.07)" }}>
                          {[
                            { label:"No",          col:null },
                            { label:"Nama Barang", col:"nama" },
                            { label:"Kategori",    col:"kategori" },
                            { label:"Jumlah",      col:"jumlah" },
                            { label:"Satuan",      col:"satuan" },
                            { label:"Status",      col:null },
                            ...(isAdmin ? [{ label:"Aksi", col:null }] : []),
                          ].map((h, i) => (
                            <th key={i}
                              className={`px-6 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase ${h.col ? "sort-th" : ""}`}
                              style={{ color:"rgba(33,33,33,0.35)" }}
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
                          <tr><td colSpan={isAdmin ? 7 : 6} className="px-6 py-12 text-center text-sm" style={{ color:"rgba(33,33,33,0.35)" }}>
                            Tidak ada barang ditemukan.
                          </td></tr>
                        ) : paginated.map((item, i) => (
                          <tr key={item.id} className="tbl-row"
                            style={{ borderTop:"1px solid rgba(33,33,33,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(33,33,33,0.012)" }}>
                            <td className="px-6 py-4 text-[11px] font-bold" style={{ color:"rgba(33,33,33,0.32)" }}>
                              {(page - 1) * showCount + i + 1}
                            </td>
                            <td className="px-6 py-4 font-semibold text-[#212121] text-xs sm:text-sm">{item.nama}</td>
                            <td className="px-6 py-4">
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                style={{ background: "rgba(42,31,8,0.08)", color: "#2a1f08" }}>
                                {item.kategori}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(33,33,33,0.09)" }}>
                                  <div className={`h-full rounded-full progress-bar ${item.jumlah===0?"bg-red-400":item.jumlah/item.max<0.3?"bg-[#d4a843]":"bg-[#CFDECA]"}`}
                                    style={{ width: animIn ? `${Math.min((item.jumlah/item.max)*100,100)}%` : "0%", transitionDelay:`${i*50}ms` }} />
                                </div>
                                <span className="text-xs font-semibold" style={{ color:"rgba(33,33,33,0.60)" }}>{item.jumlah}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium" style={{ color:"rgba(33,33,33,0.55)" }}>{item.satuan}</td>
                            <td className="px-6 py-4"><StatusBadge jumlah={item.jumlah} max={item.max} /></td>
                            {isAdmin && (
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Link href={`/stock/edit/${item.id}`}>
                                    <button className="btn-ghost">
                                      <IconEdit size={13} /> Edit
                                    </button>
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

                  {/* Mobile cards */}
                  <div className="sm:hidden divide-y" style={{ borderColor:"rgba(33,33,33,0.06)" }}>
                    {paginated.length === 0 ? (
                      <div className="py-12 text-center text-sm" style={{ color:"rgba(33,33,33,0.35)" }}>Tidak ada barang.</div>
                    ) : paginated.map((item, i) => (
                      <div key={item.id} className="tbl-row px-4 py-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="font-semibold text-sm text-[#212121]">{item.nama}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                                style={{ background: "rgba(42,31,8,0.08)", color: "#2a1f08" }}>
                                {item.kategori}
                              </span>
                              <p className="text-[11px] font-medium" style={{ color:"rgba(33,33,33,0.45)" }}>{item.satuan}</p>
                            </div>
                          </div>
                          <StatusBadge jumlah={item.jumlah} max={item.max} />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(33,33,33,0.09)" }}>
                            <div className={`h-full rounded-full progress-bar ${item.jumlah===0?"bg-red-400":item.jumlah/item.max<0.3?"bg-[#d4a843]":"bg-[#CFDECA]"}`}
                              style={{ width: animIn ? `${Math.min((item.jumlah/item.max)*100,100)}%` : "0%" }} />
                          </div>
                          <span className="text-[10px] font-semibold flex-shrink-0" style={{ color:"rgba(33,33,33,0.45)" }}>{item.jumlah}/{item.max}</span>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <Link href={`/stock/edit/${item.id}`} className="flex-1">
                              <button className="btn-ghost w-full justify-center">
                                <IconEdit size={13} /> Edit
                              </button>
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
              )}

              {/* GRID VIEW */}
              {viewMode === "grid" && (
                <div className="anim-fade-up d300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginated.length === 0 ? (
                    <div className="col-span-3 py-12 text-center text-sm" style={{ color:"rgba(33,33,33,0.35)" }}>
                      Tidak ada barang ditemukan.
                    </div>
                  ) : paginated.map((item, i) => (
                    <div key={item.id} className="stk-grid-card">
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm leading-snug text-[#212121]">{item.nama}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block"
                            style={{ background: "rgba(42,31,8,0.08)", color: "#2a1f08" }}>
                            {item.kategori}
                          </span>
                        </div>
                        <StatusBadge jumlah={item.jumlah} max={item.max} />
                      </div>

                      {/* Progress + jumlah */}
                      <div className="py-3 border-t border-b mb-3" style={{ borderColor:"rgba(33,33,33,0.07)" }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-medium" style={{ color:"rgba(33,33,33,0.40)" }}>Stok saat ini</span>
                          <span className="text-[11px] font-bold" style={{ color:"rgba(33,33,33,0.60)" }}>{item.jumlah} / {item.max} {item.satuan}</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background:"rgba(33,33,33,0.09)" }}>
                          <div
                            className={`h-full rounded-full progress-bar ${item.jumlah===0?"bg-red-400":item.jumlah/item.max<0.3?"bg-[#d4a843]":"bg-[#CFDECA]"}`}
                            style={{ width: animIn ? `${Math.min((item.jumlah/item.max)*100,100)}%` : "0%", transitionDelay:`${i*40}ms` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      {isAdmin && (
                        <div className="flex gap-2">
                          <Link href={`/stock/edit/${item.id}`} className="flex-1">
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
              )}

              {/* Pagination */}
              <div className="anim-fade-up d400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                <p className="text-[11px] font-medium" style={{ color:"rgba(33,33,33,0.40)" }}>
                  Menampilkan {Math.min((page-1)*showCount+1, sorted.length)}–{Math.min(page*showCount, sorted.length)} dari {sorted.length} entri
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button className="page-btn" disabled={page===1} onClick={() => setPage(p => p - 1)}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number|"…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                      acc.push(p); return acc;
                    }, [])
                    .map((p, i) => p === "…"
                      ? <span key={i} className="text-[11px] px-1" style={{ color:"rgba(33,33,33,0.35)" }}>…</span>
                      : <button key={i} className={`page-btn${page===p?" active":""}`} onClick={() => setPage(p as number)}>{p}</button>
                    )}
                  <button className="page-btn" disabled={page===totalPages||totalPages===0} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              </div>
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
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-4 sm:gap-8">
                      {i > 0 && <div className="w-px h-8 hidden sm:block" style={{ background:"rgba(249,249,250,0.08)" }}/>}
                      <div className="text-center cursor-default">
                        <p className={`font-['Plus_Jakarta_Sans'] font-black text-base sm:text-lg ${(s as any).danger ? "text-red-400" : "text-[#F9F9FA]"}`}>{s.val}</p>
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

        <Footer />

        {/* DELETE MODAL */}
        {deleteModal && (
          <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background:"rgba(33,33,33,0.45)", backdropFilter:"blur(8px)" }}
            onClick={() => setDeleteModal(null)}>
            <div className="modal-box w-full max-w-sm p-6 sm:p-7 border"
              style={{ background:"#FFFFFF", borderRadius:"20px", borderColor:"rgba(33,33,33,0.08)", boxShadow:"0 24px 64px rgba(33,33,33,0.18)" }}
              onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background:"#fee2e2" }}>
                <IconTrash size={22} color="#dc2626" />
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-black text-lg text-[#212121] mb-1.5">Hapus Barang?</h2>
              <p className="text-sm mb-6" style={{ color:"rgba(33,33,33,0.55)" }}>
                <span className="font-semibold text-[#212121]">{deleteModal.nama}</span> akan dihapus permanen dari sistem dan tidak bisa dipulihkan.
              </p>
              <div className="flex gap-3">
                <button className="btn-ghost flex-1 justify-center" onClick={() => setDeleteModal(null)}>Batal</button>
                <button className="btn-danger flex-1 justify-center font-bold" style={{ padding:"10px 20px", fontSize:"13px" }}
                  onClick={() => handleDelete(deleteModal)}>
                  <IconTrash size={13} color="#dc2626" /> Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className="toast fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 shadow-2xl border"
            style={{ background: toast.type==="success" ? "#CFDECA" : "#fee2e2", borderColor:"rgba(255,255,255,0.7)", borderRadius:"14px", minWidth:"260px" }}>
            <span className="flex-shrink-0">
              {toast.type === "success"
                ? <IconCheck size={15} color="#2d6a3f" />
                : <IconX size={15} color="#dc2626" />}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#212121]">{toast.msg}</p>
          </div>
        )}
      </div>
    </>
  );
}