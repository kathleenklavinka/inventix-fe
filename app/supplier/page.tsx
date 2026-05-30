"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";

const user = { nama: "Andi Pratama", role: "Admin", initials: "AP" };
const isAdmin = true;

const supplierData = [
  { id: 1, nama: "PT Sumber Makmur", alamat: "Jl. Raya Bogor No. 45, Jakarta Timur", telepon: "021-8765432", kategori: "Bahan Pokok", aktif: true },
  { id: 2, nama: "CV Mitra Pangan", alamat: "Jl. Gatot Subroto No. 12, Bandung", telepon: "022-5543210", kategori: "Bumbu & Rempah", aktif: true },
  { id: 3, nama: "UD Berkah Jaya", alamat: "Jl. Pemuda No. 78, Surabaya", telepon: "031-3456789", kategori: "Minuman", aktif: false },
  { id: 4, nama: "PT Agro Nusantara", alamat: "Jl. Sudirman Kav. 22, Jakarta Pusat", telepon: "021-5501234", kategori: "Bahan Pokok", aktif: true },
  { id: 5, nama: "CV Delta Sejahtera", alamat: "Jl. Ahmad Yani No. 90, Semarang", telepon: "024-7654321", kategori: "Kemasan", aktif: true },
  { id: 6, nama: "PT Indah Lestari", alamat: "Jl. Diponegoro No. 33, Yogyakarta", telepon: "0274-543210", kategori: "Minuman", aktif: false },
  { id: 7, nama: "UD Mandiri Sukses", alamat: "Jl. Veteran No. 15, Malang", telepon: "0341-876543", kategori: "Bumbu & Rempah", aktif: true },
  { id: 8, nama: "PT Fortuna Abadi", alamat: "Jl. Imam Bonjol No. 8, Medan", telepon: "061-4567890", kategori: "Kemasan", aktif: true },
];

const SHOW_OPTIONS = [5, 10, 25, 50];
const HARI = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const IconBuilding = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2"/>
    <path d="M9 3v18M15 3v18M2 9h20M2 15h20"/>
  </svg>
);

const IconMapPin = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconPhone = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconPlus = ({ size = 14, color = "currentColor" }) => (
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
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconSearch = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
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

const IconCheck = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconX = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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

const KATEGORI_COLORS: Record<string, { bg: string; text: string }> = {
  "Bahan Pokok": { bg: "#d1fae5", text: "#065f46" },
  "Bumbu & Rempah": { bg: "#fef3c7", text: "#92400e" },
  "Minuman": { bg: "#dbeafe", text: "#1e40af" },
  "Kemasan": { bg: "#ede9fe", text: "#5b21b6" },
};

function getInitials(nama: string) {
  return nama.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function AvatarIcon({ nama }: { nama: string }) {
  const idx = nama.charCodeAt(0) % 5;
  const bgs = ["#bbf7d0","#a7f3d0","#6ee7b7","#34d399","#10b981"];
  const bg = bgs[idx];
  return (
    <div style={{ width: 36, height: 36, borderRadius: "10px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: "11px", fontWeight: 800, color: "#064e3b", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {getInitials(nama)}
      </span>
    </div>
  );
}

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

export default function SupplierPage() {
  const [mounted, setMounted] = useState(false);
  const [tanggal, setTanggal] = useState("");
  const [search, setSearch] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [data, setData] = useState(supplierData);
  const [deleteModal, setDeleteModal] = useState<typeof supplierData[0] | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filterKategori, setFilterKategori] = useState("Semua");

  useEffect(() => {
    const now = new Date();
    setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    setTimeout(() => setMounted(true), 80);
  }, []);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  const kategoriList = ["Semua", ...Array.from(new Set(data.map(d => d.kategori)))];

  const filtered = data.filter(d => {
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.alamat.toLowerCase().includes(search.toLowerCase()) ||
      d.telepon.includes(search);
    const matchKat = filterKategori === "Semua" || d.kategori === filterKategori;
    return matchSearch && matchKat;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const va = (a as any)[sortCol];
    const vb = (b as any)[sortCol];
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === "asc" ? va - vb : vb - va;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / showCount));
  const paginated = sorted.slice((page - 1) * showCount, page * showCount);

  function handleSort(col: string) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  }

  function handleDelete(item: typeof supplierData[0]) {
    setData(prev => prev.filter(d => d.id !== item.id));
    setDeleteModal(null);
    setToast({ msg: `${item.nama} berhasil dihapus.`, type: "success" });
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <span style={{ color: "rgba(6,78,59,0.22)", display: "inline-flex" }}><IconSort size={11} /></span>;
    return <span style={{ color: "#064e3b", display: "inline-flex" }}>{sortDir === "asc" ? <IconSort size={11} /> : <IconSortDown size={11} />}</span>;
  }

  const aktifCount = data.filter(d => d.aktif).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes floatBlob {
          0%,100% { transform:translate(0,0) scale(1); }
          40%     { transform:translate(30px,-20px) scale(1.05); }
          70%     { transform:translate(-20px,18px) scale(0.97); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(28px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }

        .su-fade-up { animation:fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .d1{animation-delay:.05s}.d2{animation-delay:.10s}.d3{animation-delay:.15s}
        .d4{animation-delay:.20s}.d5{animation-delay:.25s}.d6{animation-delay:.30s}
        .d7{animation-delay:.35s}.d8{animation-delay:.40s}

        .blob-g { animation:floatBlob 10s ease-in-out infinite; }
        .blob-g2 { animation:floatBlob 14s ease-in-out infinite reverse; animation-delay:4s; }

        .su-card {
          transition: transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s;
          will-change: transform;
        }
        .su-card:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(6,78,59,0.10); }

        .tbl-row { transition:background .15s, transform .2s cubic-bezier(.22,1,.36,1); }
        .tbl-row:hover { background:rgba(236,253,245,0.80) !important; transform:translateX(3px); }

        .btn-green {
          background:#064e3b; color:#ecfdf5; border:none; border-radius:12px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:700;
          padding:10px 20px; font-size:13px; cursor:pointer;
          transition:transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s, background .18s;
          display:inline-flex; align-items:center; gap:7px;
        }
        .btn-green:hover { transform:translateY(-2px) scale(1.04); box-shadow:0 10px 28px rgba(6,78,59,0.30); background:#065f46; }
        .btn-green:active { transform:scale(0.97); }

        .btn-ghost-g {
          background:rgba(6,78,59,0.07); color:#064e3b; border:none; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-weight:600;
          padding:7px 13px; font-size:12px; cursor:pointer;
          transition:background .18s, transform .2s;
          display:inline-flex; align-items:center; gap:5px;
        }
        .btn-ghost-g:hover { background:rgba(6,78,59,0.13); transform:scale(1.03); }

        .btn-danger-g {
          background:rgba(220,38,38,0.07); color:#dc2626; border:none; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-weight:600;
          padding:7px 13px; font-size:12px; cursor:pointer;
          transition:background .18s, transform .2s;
          display:inline-flex; align-items:center; gap:5px;
        }
        .btn-danger-g:hover { background:rgba(220,38,38,0.14); transform:scale(1.03); }

        .search-input-g {
          border:1.5px solid rgba(6,78,59,0.15); border-radius:12px;
          padding:9px 14px 9px 36px; font-size:13px;
          background:rgba(255,255,255,0.75); color:#064e3b; outline:none;
          width:100%; max-width:250px; font-family:'DM Sans',sans-serif;
          transition:border-color .2s, box-shadow .2s;
        }
        .search-input-g:focus { border-color:rgba(6,78,59,0.40); box-shadow:0 0 0 3px rgba(6,78,59,0.07); }
        .search-input-g::placeholder { color:rgba(6,78,59,0.30); }

        .select-g {
          border:1.5px solid rgba(6,78,59,0.15); border-radius:10px;
          padding:8px 12px; font-size:12px; font-family:'DM Sans',sans-serif;
          background:rgba(255,255,255,0.75); color:#064e3b; outline:none; cursor:pointer;
          transition:border-color .2s;
        }
        .select-g:focus { border-color:rgba(6,78,59,0.40); }

        .page-btn-g {
          width:32px; height:32px; border-radius:8px; border:none; font-size:12px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; cursor:pointer;
          display:inline-flex; align-items:center; justify-content:center;
          transition:all .18s;
        }
        .page-btn-g.active { background:#064e3b; color:#d1fae5; }
        .page-btn-g:not(.active) { background:rgba(6,78,59,0.07); color:#064e3b; }
        .page-btn-g:not(.active):hover { background:rgba(6,78,59,0.14); }
        .page-btn-g:disabled { opacity:0.3; cursor:default; }

        .view-toggle-btn {
          width:30px; height:30px; border-radius:8px; border:none; cursor:pointer;
          display:inline-flex; align-items:center; justify-content:center;
          transition:all .18s;
        }
        .view-toggle-btn.on { background:#064e3b; color:#d1fae5; }
        .view-toggle-btn.off { background:rgba(6,78,59,0.08); color:rgba(6,78,59,0.50); }
        .view-toggle-btn.off:hover { background:rgba(6,78,59,0.14); color:#064e3b; }

        .kat-pill {
          padding:5px 12px; border-radius:999px; font-size:11px; font-weight:600;
          cursor:pointer; border:none; transition:all .18s;
          font-family:'DM Sans',sans-serif;
        }
        .kat-pill.on { background:#064e3b; color:#d1fae5; }
        .kat-pill.off { background:rgba(6,78,59,0.08); color:rgba(6,78,59,0.55); }
        .kat-pill.off:hover { background:rgba(6,78,59,0.15); color:#064e3b; }

        .sort-th { cursor:pointer; user-select:none; }
        .sort-th:hover { color:#064e3b !important; }

        .modal-overlay { animation:fadeIn .18s ease both; }
        .modal-box { animation:fadeUp .22s cubic-bezier(.22,1,.36,1) both; }
        .toast-g { animation:slideIn .32s cubic-bezier(.22,1,.36,1) both; }

        /* Grid view card */
        .sup-grid-card {
          border:1.5px solid rgba(6,78,59,0.10); border-radius:16px;
          padding:20px; background:rgba(255,255,255,0.75);
          transition:transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s, border-color .2s;
          cursor:default;
        }
        .sup-grid-card:hover { transform:translateY(-4px); box-shadow:0 18px 40px rgba(6,78,59,0.11); border-color:rgba(6,78,59,0.22); }
      `}</style>

      <div className={`min-h-screen text-[#064e3b] font-['DM_Sans'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#f0fdf4" }}>

        <Header hasNotification={false} userInitials={user.initials} />

        <main>
          {/* HERO */}
          <section className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12"
            style={{ background: "linear-gradient(160deg, #edf2eb 0%, #e4ece1 45%, #f4f7f3 100%)" }}>

            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full blob-g pointer-events-none"
              style={{ background: "#6ee7b7", filter: "blur(80px)", opacity: 0.28 }} />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full blob-g2 pointer-events-none"
              style={{ background: "#a7f3d0", filter: "blur(60px)", opacity: 0.22 }} />

            <Inner className="relative z-10">
              {/* Breadcrumb */}
              <div className="su-fade-up flex items-center gap-2 mb-5 text-[11px] font-medium"
                style={{ color: "rgba(6,78,59,0.40)" }}>
                <Link href="/dashboard" className="hover:text-[#064e3b] transition-colors">Dashboard</Link>
                <span>/</span>
                <span style={{ color: "#064e3b" }} className="font-semibold">Supplier</span>
              </div>

              <div className="su-fade-up d2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase mb-1.5 font-medium"
                    style={{ color: "rgba(6,78,59,0.40)" }}>Manajemen</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.1rem] leading-none"
                    style={{ color: "#022c22" }}>
                    Data Supplier
                  </h1>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(6,78,59,0.38)" }}>{tanggal}</p>
                </div>
                {isAdmin && (
                  <Link href="/supplier/tambah">
                    <button className="btn-green">
                      <IconPlus size={14} color="#d1fae5" /> Tambah Supplier
                    </button>
                  </Link>
                )}
              </div>

              {/* Stat strip */}
              <div className="su-fade-up d4 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Supplier", val: data.length, accent: "#022c22", bg: "rgba(255,255,255,0.60)" },
                  { label: "Aktif", val: aktifCount, accent: "#047857", bg: "rgba(209,250,229,0.60)" },
                  { label: "Nonaktif", val: data.length - aktifCount, accent: "#b45309", bg: "rgba(254,243,199,0.60)" },
                  { label: "Kategori", val: new Set(data.map(d => d.kategori)).size, accent: "#1e40af", bg: "rgba(219,234,254,0.60)" },
                ].map((s, i) => (
                  <div key={i} className="su-card flex flex-col gap-1 px-4 py-3.5 border"
                    style={{ background: s.bg, borderColor: "rgba(6,78,59,0.10)", borderRadius: "14px", backdropFilter: "blur(16px)" }}>
                    <p className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[1.7rem] leading-none"
                      style={{ color: s.accent }}>{s.val}</p>
                    <p className="text-[10px] sm:text-[11px] font-medium" style={{ color: "rgba(6,78,59,0.45)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </Inner>
          </section>

          {/* TABLE / GRID SECTION */}
          <section className="w-full py-10 sm:py-12" style={{ background: "#ffffff" }}>
            <Inner>
              {/* Filter pills */}
              <div className="su-fade-up d3 flex items-center gap-2 flex-wrap mb-5">
                {kategoriList.map(k => (
                  <button key={k} className={`kat-pill ${filterKategori === k ? "on" : "off"}`}
                    onClick={() => { setFilterKategori(k); setPage(1); }}>
                    {k}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="su-fade-up d4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-medium" style={{ color: "rgba(6,78,59,0.42)" }}>Tampilkan</span>
                  <select className="select-g" value={showCount}
                    onChange={e => { setShowCount(Number(e.target.value)); setPage(1); }}>
                    {SHOW_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="text-[11px] font-medium" style={{ color: "rgba(6,78,59,0.42)" }}>entri</span>
                  {/* View toggle */}
                  <div className="flex items-center gap-1 ml-1 border rounded-[8px] p-0.5" style={{ borderColor: "rgba(6,78,59,0.12)" }}>
                    <button className={`view-toggle-btn ${viewMode === "table" ? "on" : "off"}`} onClick={() => setViewMode("table")} title="Tampilan tabel">
                      <IconList size={13} />
                    </button>
                    <button className={`view-toggle-btn ${viewMode === "grid" ? "on" : "off"}`} onClick={() => setViewMode("grid")} title="Tampilan kartu">
                      <IconGrid size={13} />
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(6,78,59,0.32)", display: "flex" }}>
                    <IconSearch size={14} />
                  </span>
                  <input className="search-input-g" placeholder="Cari supplier…" value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>
              </div>

              {/* TABLE VIEW */}
              {viewMode === "table" && (
                <div className="su-fade-up d5 su-card overflow-hidden border"
                  style={{ borderColor: "rgba(6,78,59,0.09)", borderRadius: "18px", background: "rgba(255,255,255,0.70)", backdropFilter: "blur(20px)", boxShadow: "0 6px 28px rgba(6,78,59,0.07)" }}>
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: "rgba(6,78,59,0.03)", borderBottom: "1px solid rgba(6,78,59,0.07)" }}>
                          {[
                            { label: "No", col: null },
                            { label: "Supplier", col: "nama" },
                            { label: "Kategori", col: "kategori" },
                            { label: "Alamat", col: "alamat" },
                            { label: "Telepon", col: "telepon" },
                            { label: "Status", col: null },
                            ...(isAdmin ? [{ label: "Aksi", col: null }] : []),
                          ].map((h, i) => (
                            <th key={i}
                              className={`px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase ${h.col ? "sort-th" : ""}`}
                              style={{ color: "rgba(6,78,59,0.38)" }}
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
                          <tr><td colSpan={isAdmin ? 7 : 6} className="px-5 py-12 text-center text-sm"
                            style={{ color: "rgba(6,78,59,0.35)" }}>Tidak ada supplier ditemukan.</td></tr>
                        ) : paginated.map((item, i) => (
                          <tr key={item.id} className="tbl-row"
                            style={{ borderTop: "1px solid rgba(6,78,59,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(6,78,59,0.012)" }}>
                            <td className="px-5 py-4 text-[11px] font-bold" style={{ color: "rgba(6,78,59,0.30)" }}>
                              {(page - 1) * showCount + i + 1}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <AvatarIcon nama={item.nama} />
                                <span className="font-semibold text-xs sm:text-sm" style={{ color: "#022c22" }}>{item.nama}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                style={{ background: KATEGORI_COLORS[item.kategori]?.bg || "#f3f4f6", color: KATEGORI_COLORS[item.kategori]?.text || "#374151" }}>
                                {item.kategori}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-xs" style={{ color: "rgba(6,78,59,0.58)", maxWidth: "200px" }}>
                              <div className="flex items-start gap-1.5">
                                <span className="flex-shrink-0 mt-0.5"><IconMapPin size={11} color="rgba(6,78,59,0.40)" /></span>
                                <span className="line-clamp-2">{item.alamat}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-xs font-medium" style={{ color: "rgba(6,78,59,0.60)" }}>
                              <div className="flex items-center gap-1.5">
                                <IconPhone size={11} color="rgba(6,78,59,0.40)" />
                                {item.telepon}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              {item.aktif ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                  style={{ background: "#d1fae5", color: "#065f46" }}>
                                  <IconCheck size={9} color="#065f46" /> Aktif
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                  style={{ background: "#fee2e2", color: "#991b1b" }}>
                                  <IconX size={9} color="#991b1b" /> Nonaktif
                                </span>
                              )}
                            </td>
                            {isAdmin && (
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <Link href={`/supplier/edit/${item.id}`}>
                                    <button className="btn-ghost-g"><IconEdit size={13} /> Edit</button>
                                  </Link>
                                  <button className="btn-danger-g" onClick={() => setDeleteModal(item)}>
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

                  {/* Mobile list */}
                  <div className="sm:hidden divide-y" style={{ borderColor: "rgba(6,78,59,0.07)" }}>
                    {paginated.length === 0 ? (
                      <div className="py-10 text-center text-sm" style={{ color: "rgba(6,78,59,0.35)" }}>Tidak ada supplier.</div>
                    ) : paginated.map((item) => (
                      <div key={item.id} className="tbl-row px-4 py-4">
                        <div className="flex items-start gap-3 mb-3">
                          <AvatarIcon nama={item.nama} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-sm" style={{ color: "#022c22" }}>{item.nama}</p>
                              {item.aktif
                                ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ background: "#d1fae5", color: "#065f46" }}>Aktif</span>
                                : <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ background: "#fee2e2", color: "#991b1b" }}>Nonaktif</span>
                              }
                            </div>
                            <p className="text-[11px] mt-0.5" style={{ color: "rgba(6,78,59,0.50)" }}>
                              <span className="font-medium px-1.5 py-0.5 rounded-md mr-1"
                                style={{ background: KATEGORI_COLORS[item.kategori]?.bg, color: KATEGORI_COLORS[item.kategori]?.text, fontSize: "10px" }}>
                                {item.kategori}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1 mb-3 pl-11">
                          <p className="text-[11px] flex items-start gap-1.5" style={{ color: "rgba(6,78,59,0.55)" }}>
                            <IconMapPin size={11} color="rgba(6,78,59,0.40)" /> {item.alamat}
                          </p>
                          <p className="text-[11px] flex items-center gap-1.5" style={{ color: "rgba(6,78,59,0.55)" }}>
                            <IconPhone size={11} color="rgba(6,78,59,0.40)" /> {item.telepon}
                          </p>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2 pl-11">
                            <Link href={`/supplier/edit/${item.id}`} className="flex-1">
                              <button className="btn-ghost-g w-full justify-center"><IconEdit size={13} /> Edit</button>
                            </Link>
                            <button className="btn-danger-g flex-1 justify-center" onClick={() => setDeleteModal(item)}>
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
                <div className="su-fade-up d5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginated.length === 0 ? (
                    <div className="col-span-3 py-12 text-center text-sm" style={{ color: "rgba(6,78,59,0.35)" }}>
                      Tidak ada supplier ditemukan.
                    </div>
                  ) : paginated.map((item) => (
                    <div key={item.id} className="sup-grid-card">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <AvatarIcon nama={item.nama} />
                          <div>
                            <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm leading-snug" style={{ color: "#022c22" }}>{item.nama}</p>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                              style={{ background: KATEGORI_COLORS[item.kategori]?.bg, color: KATEGORI_COLORS[item.kategori]?.text }}>
                              {item.kategori}
                            </span>
                          </div>
                        </div>
                        {item.aktif
                          ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0" style={{ background: "#d1fae5", color: "#065f46" }}>Aktif</span>
                          : <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0" style={{ background: "#fee2e2", color: "#991b1b" }}>Nonaktif</span>
                        }
                      </div>
                      <div className="space-y-2 py-3 border-t border-b mb-3" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
                        <p className="text-[11px] flex items-start gap-2" style={{ color: "rgba(6,78,59,0.55)" }}>
                          <span className="flex-shrink-0 mt-0.5"><IconMapPin size={11} color="rgba(6,78,59,0.42)" /></span>
                          {item.alamat}
                        </p>
                        <p className="text-[11px] flex items-center gap-2" style={{ color: "rgba(6,78,59,0.55)" }}>
                          <IconPhone size={11} color="rgba(6,78,59,0.42)" />
                          {item.telepon}
                        </p>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <Link href={`/supplier/edit/${item.id}`} className="flex-1">
                            <button className="btn-ghost-g w-full justify-center"><IconEdit size={13} /> Edit</button>
                          </Link>
                          <button className="btn-danger-g flex-1 justify-center" onClick={() => setDeleteModal(item)}>
                            <IconTrash size={13} color="#dc2626" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="su-fade-up d7 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                <p className="text-[11px] font-medium" style={{ color: "rgba(6,78,59,0.40)" }}>
                  Menampilkan {Math.min((page-1)*showCount+1, sorted.length)}–{Math.min(page*showCount, sorted.length)} dari {sorted.length} entri
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button className="page-btn-g" disabled={page===1} onClick={() => setPage(p => p-1)}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i+1)
                    .filter(p => p===1||p===totalPages||Math.abs(p-page)<=1)
                    .reduce<(number|"…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx-1] as number) > 1) acc.push("…");
                      acc.push(p); return acc;
                    }, [])
                    .map((p, i) => p === "…"
                      ? <span key={i} className="text-[11px] px-1" style={{ color: "rgba(6,78,59,0.35)" }}>…</span>
                      : <button key={i} className={`page-btn-g${page===p?" active":""}`} onClick={() => setPage(p as number)}>{p}</button>
                    )}
                  <button className="page-btn-g" disabled={page===totalPages} onClick={() => setPage(p => p+1)}>›</button>
                </div>
              </div>
            </Inner>
          </section>
        </main>

        <Footer />

        {/* DELETE MODAL */}
        {deleteModal && (
          <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(2,44,34,0.45)", backdropFilter: "blur(8px)" }}
            onClick={() => setDeleteModal(null)}>
            <div className="modal-box w-full max-w-sm p-6 sm:p-7 border"
              style={{ background: "#ffffff", borderRadius: "20px", borderColor: "rgba(6,78,59,0.10)", boxShadow: "0 24px 60px rgba(2,44,34,0.22)" }}
              onClick={e => e.stopPropagation()}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "#fee2e2" }}>
                <IconTrash size={20} color="#dc2626" />
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-black text-lg mb-1.5" style={{ color: "#022c22" }}>Hapus Supplier?</h2>
              <p className="text-sm mb-6" style={{ color: "rgba(6,78,59,0.55)" }}>
                <span className="font-semibold" style={{ color: "#022c22" }}>{deleteModal.nama}</span> akan dihapus permanen dari sistem.
              </p>
              <div className="flex gap-3">
                <button className="btn-ghost-g flex-1 justify-center" style={{ padding: "10px 16px", fontSize: "13px" }}
                  onClick={() => setDeleteModal(null)}>Batal</button>
                <button className="btn-danger-g flex-1 justify-center font-bold" style={{ padding: "10px 16px", fontSize: "13px" }}
                  onClick={() => handleDelete(deleteModal)}>
                  <IconTrash size={13} color="#dc2626" /> Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className="toast-g fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 shadow-2xl border"
            style={{ background: toast.type === "success" ? "#d1fae5" : "#fee2e2", borderColor: "rgba(255,255,255,0.70)", borderRadius: "14px", minWidth: "250px" }}>
            <span className="flex-shrink-0">
              {toast.type === "success" ? <IconCheck size={14} color="#065f46" /> : <IconX size={14} color="#dc2626" />}
            </span>
            <p className="text-xs sm:text-sm font-semibold" style={{ color: "#022c22" }}>{toast.msg}</p>
          </div>
        )}
      </div>
    </>
  );
}