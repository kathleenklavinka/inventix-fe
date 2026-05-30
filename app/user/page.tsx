"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";

const currentUser = { id: 1, nama: "Andi Pratama", role: "Admin", initials: "AP" };

const initialUsers = [
  { id: 1,  nama: "Andi Pratama",    email: "andi@inventix.id",    role: "Admin", bergabung: "12 Jan 2025", avatar: "AP", aktif: true  },
  { id: 2,  nama: "Budi Santoso",    email: "budi@inventix.id",    role: "User",  bergabung: "18 Jan 2025", avatar: "BS", aktif: true  },
  { id: 3,  nama: "Citra Dewi",      email: "citra@inventix.id",   role: "User",  bergabung: "22 Feb 2025", avatar: "CD", aktif: true  },
  { id: 4,  nama: "Dian Kusuma",     email: "dian@inventix.id",    role: "Admin", bergabung: "01 Mar 2025", avatar: "DK", aktif: true  },
  { id: 5,  nama: "Eko Prasetyo",    email: "eko@inventix.id",     role: "User",  bergabung: "15 Mar 2025", avatar: "EP", aktif: false },
  { id: 6,  nama: "Fajar Nugroho",   email: "fajar@inventix.id",   role: "User",  bergabung: "02 Apr 2025", avatar: "FN", aktif: true  },
  { id: 7,  nama: "Gita Larasati",   email: "gita@inventix.id",    role: "Admin", bergabung: "10 Apr 2025", avatar: "GL", aktif: true  },
  { id: 8,  nama: "Hendra Wijaya",   email: "hendra@inventix.id",  role: "User",  bergabung: "28 Apr 2025", avatar: "HW", aktif: false },
  { id: 9,  nama: "Indah Permata",   email: "indah@inventix.id",   role: "User",  bergabung: "05 Mei 2025", avatar: "IP", aktif: true  },
  { id: 10, nama: "Joko Susilo",     email: "joko@inventix.id",    role: "User",  bergabung: "20 Mei 2025", avatar: "JS", aktif: true  },
  { id: 11, nama: "Kartika Sari",    email: "kartika@inventix.id", role: "User",  bergabung: "08 Jun 2025", avatar: "KS", aktif: true  },
  { id: 12, nama: "Lukman Hakim",    email: "lukman@inventix.id",  role: "Admin", bergabung: "17 Jun 2025", avatar: "LH", aktif: true  },
];

const PAGE_SIZE = 8;
const HARI  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const AVATAR_COLORS: Record<string, { bg: string; color: string }> = {
  AP: { bg: "#e8dfc8", color: "#7a5c2e" },
  BS: { bg: "#CFDECA", color: "#2d6a3f" },
  CD: { bg: "#D8DFE9", color: "#2a3a52" },
  DK: { bg: "#EFF0A3", color: "#5a6a00" },
  EP: { bg: "#fde8e8", color: "#9b1c1c" },
  FN: { bg: "#e0d5f5", color: "#5b21b6" },
  GL: { bg: "#ffe4cc", color: "#92400e" },
  HW: { bg: "#d1f0f7", color: "#0e7490" },
  IP: { bg: "#f5d0e0", color: "#9d174d" },
  JS: { bg: "#d4f0d4", color: "#166534" },
  KS: { bg: "#f0e6d4", color: "#7c3d12" },
  LH: { bg: "#dce8ff", color: "#1e40af" },
};
function avatarStyle(initials: string) {
  return AVATAR_COLORS[initials] ?? { bg: "#e8dfc8", color: "#7a5c2e" };
}

const IconUsers = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconShield = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconUser = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconUserX = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/>
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
const IconAlertTriangle = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconCalendar = ({ size = 11, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconGrid = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconList = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

function Avatar({ initials, size = 36, radius = 10 }: { initials: string; size?: number; radius?: number }) {
  const s = avatarStyle(initials);
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  if (role === "Admin") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
      style={{ background: "#e8dfc8", color: "#7a5c2e" }}>
      <IconShield size={9} color="#7a5c2e" /> Admin
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
      style={{ background: "#D8DFE9", color: "#2a3a52" }}>
      <IconUser size={9} color="#2a3a52" /> User
    </span>
  );
}

function AktifBadge({ aktif }: { aktif: boolean }) {
  if (aktif) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
      style={{ background: "#CFDECA", color: "#2d6a3f" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2d6a3f", display: "inline-block" }} />
      Aktif
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
      style={{ background: "rgba(33,33,33,0.07)", color: "rgba(33,33,33,0.40)" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(33,33,33,0.28)", display: "inline-block" }} />
      Nonaktif
    </span>
  );
}

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

type UserType = typeof initialUsers[0];

export default function UserPage() {
  const [mounted, setMounted]         = useState(false);
  const [tanggal, setTanggal]         = useState("");
  const [users, setUsers]             = useState(initialUsers);
  const [search, setSearch]           = useState("");
  const [filterRole, setFilterRole]   = useState<"semua" | "Admin" | "User">("semua");
  const [filterAktif, setFilterAktif] = useState<"semua" | "aktif" | "nonaktif">("semua");
  const [view, setView]               = useState<"grid" | "list">("grid");
  const [page, setPage]               = useState(1);
  const [deleteModal, setDeleteModal] = useState<UserType | null>(null);
  const [selfDeleteError, setSelfDeleteError] = useState(false);
  const [toast, setToast]             = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const now = new Date();
    setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    setTimeout(() => setMounted(true), 100);
  }, []);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3200); return () => clearTimeout(t); }
  }, [toast]);

  useEffect(() => {
    if (selfDeleteError) { const t = setTimeout(() => setSelfDeleteError(false), 4000); return () => clearTimeout(t); }
  }, [selfDeleteError]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.nama.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
    const matchRole  = filterRole === "semua"  || u.role === filterRole;
    const matchAktif = filterAktif === "semua" || (filterAktif === "aktif" ? u.aktif : !u.aktif);
    return matchSearch && matchRole && matchAktif;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleDeleteClick(u: UserType) {
    if (u.id === currentUser.id) { setSelfDeleteError(true); return; }
    setDeleteModal(u);
  }

  function handleDelete(u: UserType) {
    setUsers(prev => prev.filter(x => x.id !== u.id));
    setDeleteModal(null);
    setToast({ msg: `User ${u.nama} berhasil dihapus.`, type: "success" });
  }

  function changeFilter(type: "role" | "aktif", val: string) {
    if (type === "role") setFilterRole(val as typeof filterRole);
    else setFilterAktif(val as typeof filterAktif);
    setPage(1);
  }

  const totalAdmin    = users.filter(u => u.role === "Admin").length;
  const totalUser     = users.filter(u => u.role === "User").length;
  const totalNonaktif = users.filter(u => !u.aktif).length;

  const pillBase   = "text-[11px] font-bold px-3 py-1.5 rounded-full cursor-pointer transition-all duration-150 border border-transparent";
  const pillActive = "bg-[#2a1f08] text-[#EFF0A3]";
  const pillIdle   = "bg-[rgba(33,33,33,0.06)] text-[rgba(33,33,33,0.45)] hover:bg-[rgba(33,33,33,0.11)]";

  const viewBtnBase   = "w-8 h-8 flex items-center justify-center transition-all duration-150 cursor-pointer border-none";
  const viewBtnActive = "bg-[rgba(33,33,33,0.08)]";
  const viewBtnIdle   = "bg-transparent hover:bg-[rgba(33,33,33,0.04)]";

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn  { from{opacity:0}to{opacity:1} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.5} }

        .anim-fade-up{animation:fadeUp 0.55s cubic-bezier(.22,1,.36,1) both}
        .d50{animation-delay:.05s}.d100{animation-delay:.10s}.d150{animation-delay:.15s}
        .d200{animation-delay:.20s}.d250{animation-delay:.25s}.d300{animation-delay:.30s}
        .d350{animation-delay:.35s}.d400{animation-delay:.40s}

        .btn-primary{
          background:#2a1f08;color:#ffffff;border:none;border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;
          padding:9px 18px;font-size:13px;cursor:pointer;
          transition:transform .2s cubic-bezier(.22,1,.36,1),box-shadow .2s,background .15s;
          display:inline-flex;align-items:center;gap:6px;
        }
        .btn-primary:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 8px 24px rgba(42,31,8,.22);background:#3d2e0e}
        .btn-primary:active{transform:scale(0.97)}

        .btn-ghost{
          background:rgba(33,33,33,0.06);color:#212121;border:none;border-radius:8px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;
          padding:6px 12px;font-size:12px;cursor:pointer;
          transition:background .15s,transform .18s;
          display:inline-flex;align-items:center;gap:5px;
        }
        .btn-ghost:hover{background:rgba(33,33,33,0.11);transform:scale(1.02)}

        .btn-danger{
          background:rgba(220,38,38,0.07);color:#dc2626;border:none;border-radius:8px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;
          padding:6px 12px;font-size:12px;cursor:pointer;
          transition:background .15s,transform .18s;
          display:inline-flex;align-items:center;gap:5px;
        }
        .btn-danger:hover{background:rgba(220,38,38,0.13);transform:scale(1.02)}
        .btn-danger.self{opacity:.3;cursor:not-allowed}
        .btn-danger.self:hover{background:rgba(220,38,38,0.07);transform:none}

        .search-input{
          border:1.5px solid rgba(33,33,33,0.12);border-radius:10px;
          padding:8px 12px 8px 34px;font-size:13px;background:#ffffff;
          color:#212121;outline:none;width:100%;
          font-family:'Inter',sans-serif;transition:border-color .2s,box-shadow .2s;
        }
        .search-input:focus{border-color:rgba(33,33,33,0.30);box-shadow:0 0 0 3px rgba(33,33,33,0.05)}

        /* USER CARD */
        .user-card{
          background:#ffffff;border:1px solid rgba(33,33,33,0.08);border-radius:16px;
          padding:1.25rem 1rem 1rem;display:flex;flex-direction:column;align-items:center;text-align:center;
          position:relative;transition:border-color .2s,box-shadow .25s,transform .25s cubic-bezier(.22,1,.36,1);
        }
        .user-card:hover{border-color:rgba(33,33,33,0.18);box-shadow:0 12px 32px rgba(33,33,33,0.07);transform:translateY(-2px)}

        /* LIST ROW */
        .list-row{
          background:#ffffff;border:1px solid rgba(33,33,33,0.08);border-radius:12px;
          padding:12px 16px;display:flex;align-items:center;gap:14px;
          transition:border-color .18s,box-shadow .2s;
        }
        .list-row:hover{border-color:rgba(33,33,33,0.18);box-shadow:0 4px 16px rgba(33,33,33,0.05)}

        /* STAT CARDS */
        .stat-card{
          background:#ffffff;border:1px solid rgba(33,33,33,0.08);border-radius:14px;
          padding:14px 16px;display:flex;align-items:center;gap:12px;
          transition:box-shadow .2s,transform .2s cubic-bezier(.22,1,.36,1);cursor:default;
        }
        .stat-card:hover{box-shadow:0 8px 24px rgba(33,33,33,0.07);transform:translateY(-1px)}

        .page-btn{
          width:30px;height:30px;border-radius:7px;border:1px solid transparent;font-size:12px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;cursor:pointer;
          display:inline-flex;align-items:center;justify-content:center;transition:all .15s;
        }
        .page-btn.active{background:#212121;color:#EFF0A3;border-color:#212121}
        .page-btn:not(.active){background:rgba(33,33,33,0.05);color:#212121;border-color:rgba(33,33,33,0.08)}
        .page-btn:not(.active):hover{background:rgba(33,33,33,0.10)}
        .page-btn:disabled{opacity:.3;cursor:default}

        .modal-overlay{animation:fadeIn .18s ease both}
        .modal-box{animation:fadeUp .22s cubic-bezier(.22,1,.36,1) both}
        .toast{animation:slideIn .32s cubic-bezier(.22,1,.36,1) both}
        .err-bar{animation:fadeIn .2s ease both}

        .view-toggle-wrap{display:flex;border:1px solid rgba(33,33,33,0.10);border-radius:9px;overflow:hidden}
        .view-toggle-btn{width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;transition:background .15s}
        .view-toggle-btn.active{background:rgba(33,33,33,0.08)}
        .view-toggle-btn:not(.active){background:transparent}
        .view-toggle-btn:not(.active):hover{background:rgba(33,33,33,0.04)}
      `}</style>

      <div
        className={`min-h-screen text-[#212121] font-['Inter'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F4F4F5" }}
      >
        <Header hasNotification={false} userInitials={currentUser.initials} />

        <main className="w-full">

          <section className="w-full pt-8 pb-6 sm:pt-10 sm:pb-8" style={{ background: "#F4F4F5" }}>
            <Inner>
              <div className="anim-fade-up flex items-center gap-2 mb-4 text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>
                <Link href="/dashboard" className="hover:text-[#2a1f08] transition-colors">Dashboard</Link>
                <span>/</span>
                <span style={{ color: "#2a1f08" }} className="font-semibold">Manajemen User</span>
              </div>

              <div className="anim-fade-up d100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase font-semibold mb-1" style={{ color: "rgba(33,33,33,0.32)" }}>Manajemen</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-3xl leading-none" style={{ color: "#212121" }}>User</h1>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(33,33,33,0.35)" }}>{tanggal}</p>
                </div>
                <Link href="/user/tambah">
                  <button className="btn-primary">
                    <IconPlus size={14} color="#ffffff" /> Tambah User
                  </button>
                </Link>
              </div>

              <div className="anim-fade-up d200 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { label: "Total User",   val: users.length,    icon: <IconUsers size={17} color="#7a5c2e" />,   bg: "#e8dfc8", valColor: "#2a1f08" },
                  { label: "Admin",        val: totalAdmin,      icon: <IconShield size={17} color="#185FA5" />,  bg: "#E6F1FB", valColor: "#2a1f08" },
                  { label: "User biasa",   val: totalUser,       icon: <IconUser size={17} color="#0F6E56" />,    bg: "#E1F5EE", valColor: "#2a1f08" },
                  { label: "Nonaktif",     val: totalNonaktif,   icon: <IconUserX size={17} color="#dc2626" />,   bg: "#fee2e2", valColor: totalNonaktif > 0 ? "#dc2626" : "#2a1f08" },
                ].map((s, i) => (
                  <div key={i} className="stat-card">
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-black text-xl leading-none" style={{ color: s.valColor }}>{s.val}</p>
                      <p className="text-[11px] mt-1 font-medium" style={{ color: "rgba(33,33,33,0.40)" }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Inner>
          </section>

          <section className="w-full pb-12" style={{ background: "#F4F4F5" }}>
            <Inner>

              {selfDeleteError && (
                <div className="err-bar flex items-center gap-2.5 px-4 py-3 rounded-xl mb-4"
                  style={{ background: "#fee2e2", border: "1px solid rgba(220,38,38,0.18)" }}>
                  <IconAlertTriangle size={15} color="#dc2626" />
                  <p className="text-sm font-semibold text-red-600">Kamu tidak bisa menghapus akunmu sendiri.</p>
                </div>
              )}

              <div className="anim-fade-up d250 flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center" style={{ color: "rgba(33,33,33,0.32)" }}>
                    <IconSearch size={13} />
                  </span>
                  <input
                    className="search-input"
                    placeholder="Cari nama atau email…"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {(["semua", "Admin", "User"] as const).map(r => (
                    <button key={r} onClick={() => changeFilter("role", r)}
                      className={`${pillBase} ${filterRole === r ? pillActive : pillIdle}`}>
                      {r === "semua" ? "Semua role" : r}
                    </button>
                  ))}
                </div>

                <div className="w-px h-5 hidden sm:block" style={{ background: "rgba(33,33,33,0.10)" }} />

                <div className="flex items-center gap-1.5 flex-wrap">
                  {(["semua", "aktif", "nonaktif"] as const).map(a => (
                    <button key={a} onClick={() => changeFilter("aktif", a)}
                      className={`${pillBase} capitalize ${filterAktif === a ? pillActive : pillIdle}`}>
                      {a === "semua" ? "Semua status" : a}
                    </button>
                  ))}
                </div>

                <div className="view-toggle-wrap ml-auto">
                  <button
                    className={`view-toggle-btn ${view === "grid" ? "active" : ""}`}
                    onClick={() => setView("grid")}
                    title="Grid view">
                    <IconGrid size={15} color="rgba(33,33,33,0.55)" />
                  </button>
                  <button
                    className={`view-toggle-btn ${view === "list" ? "active" : ""}`}
                    onClick={() => setView("list")}
                    title="List view">
                    <IconList size={15} color="rgba(33,33,33,0.55)" />
                  </button>
                </div>
              </div>

              <p className="anim-fade-up d300 text-[11px] font-medium mb-3" style={{ color: "rgba(33,33,33,0.35)" }}>
                {filtered.length} user ditemukan
              </p>

              {view === "grid" && (
                <div className="anim-fade-up d300 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {paginated.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-sm" style={{ color: "rgba(33,33,33,0.35)" }}>
                      Tidak ada user ditemukan.
                    </div>
                  ) : paginated.map(u => (
                    <div key={u.id} className="user-card">
                      {u.id === currentUser.id && (
                        <span className="absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ background: "#EFF0A3", color: "#5a6a00" }}>Kamu</span>
                      )}
                      <Avatar initials={u.avatar} size={48} radius={13} />
                      <p className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] mt-2.5 mb-0.5 text-[#212121] leading-tight">{u.nama}</p>
                      <p className="text-[10px] mb-2.5 w-full truncate" style={{ color: "rgba(33,33,33,0.40)" }}>{u.email}</p>
                      <div className="flex items-center justify-center gap-1.5 mb-2 flex-wrap">
                        <RoleBadge role={u.role} />
                        <AktifBadge aktif={u.aktif} />
                      </div>
                      <p className="flex items-center gap-1 text-[10px] mb-3" style={{ color: "rgba(33,33,33,0.35)" }}>
                        <IconCalendar size={10} /> {u.bergabung}
                      </p>
                      <div className="flex gap-1.5 w-full">
                        <Link href={`/user/edit/${u.id}`} className="flex-1">
                          <button className="btn-ghost w-full justify-center text-[11px] py-1.5">
                            <IconEdit size={11} /> Edit
                          </button>
                        </Link>
                        <button
                          className={`btn-danger flex-1 justify-center text-[11px] py-1.5 ${u.id === currentUser.id ? "self" : ""}`}
                          onClick={() => handleDeleteClick(u)}>
                          <IconTrash size={11} color="#dc2626" /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {view === "list" && (
                <div className="anim-fade-up d300 flex flex-col gap-2">
                  {paginated.length === 0 ? (
                    <div className="py-16 text-center text-sm" style={{ color: "rgba(33,33,33,0.35)" }}>
                      Tidak ada user ditemukan.
                    </div>
                  ) : paginated.map(u => (
                    <div key={u.id} className="list-row">
                      <Avatar initials={u.avatar} size={38} radius={10} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] text-[#212121]">{u.nama}</p>
                          {u.id === currentUser.id && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: "#EFF0A3", color: "#5a6a00" }}>Kamu</span>
                          )}
                        </div>
                        <p className="text-[11px] truncate" style={{ color: "rgba(33,33,33,0.42)" }}>{u.email}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                        <RoleBadge role={u.role} />
                        <AktifBadge aktif={u.aktif} />
                        <span className="flex items-center gap-1 text-[10px] font-medium ml-1" style={{ color: "rgba(33,33,33,0.35)" }}>
                          <IconCalendar size={10} /> {u.bergabung}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Link href={`/user/edit/${u.id}`}>
                          <button className="btn-ghost"><IconEdit size={12} /> <span className="hidden sm:inline">Edit</span></button>
                        </Link>
                        <button
                          className={`btn-danger ${u.id === currentUser.id ? "self" : ""}`}
                          onClick={() => handleDeleteClick(u)}>
                          <IconTrash size={12} color="#dc2626" /> <span className="hidden sm:inline">Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filtered.length > PAGE_SIZE && (
                <div className="anim-fade-up d400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                  <p className="text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>
                    Menampilkan {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)} dari {filtered.length} user
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button className="page-btn" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                      .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                        acc.push(p); return acc;
                      }, [])
                      .map((p, i) => p === "…"
                        ? <span key={i} className="text-[11px] px-1" style={{ color: "rgba(33,33,33,0.30)" }}>…</span>
                        : <button key={i} className={`page-btn${safePage === p ? " active" : ""}`} onClick={() => setPage(p as number)}>{p}</button>
                      )}
                    <button className="page-btn" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                  </div>
                </div>
              )}
            </Inner>
          </section>
        </main>

        <Footer />

        {deleteModal && (
          <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(33,33,33,0.45)", backdropFilter: "blur(8px)" }}
            onClick={() => setDeleteModal(null)}>
            <div className="modal-box w-full max-w-sm p-6 border"
              style={{ background: "#FFFFFF", borderRadius: "18px", borderColor: "rgba(33,33,33,0.08)", boxShadow: "0 24px 64px rgba(33,33,33,0.18)" }}
              onClick={e => e.stopPropagation()}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "#fee2e2" }}>
                <IconTrash size={20} color="#dc2626" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Avatar initials={deleteModal.avatar} size={40} radius={11} />
                <div>
                  <p className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#212121]">{deleteModal.nama}</p>
                  <p className="text-[11px]" style={{ color: "rgba(33,33,33,0.42)" }}>{deleteModal.email}</p>
                </div>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-black text-[17px] text-[#212121] mb-1.5">Hapus user ini?</h2>
              <p className="text-sm mb-5" style={{ color: "rgba(33,33,33,0.52)" }}>
                Akun <span className="font-semibold text-[#212121]">{deleteModal.nama}</span> akan dihapus permanen dan tidak bisa dipulihkan.
              </p>
              <div className="flex gap-2.5">
                <button className="btn-ghost flex-1 justify-center" onClick={() => setDeleteModal(null)}>Batal</button>
                <button className="btn-danger flex-1 justify-center" style={{ padding: "9px 18px", fontSize: "13px" }}
                  onClick={() => handleDelete(deleteModal)}>
                  <IconTrash size={13} color="#dc2626" /> Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="toast fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 shadow-xl border"
            style={{ background: toast.type === "success" ? "#CFDECA" : "#fee2e2", borderColor: "rgba(255,255,255,0.6)", borderRadius: "12px", minWidth: "240px" }}>
            <span className="flex-shrink-0">
              {toast.type === "success" ? <IconCheck size={14} color="#2d6a3f" /> : <IconX size={14} color="#dc2626" />}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#212121]">{toast.msg}</p>
          </div>
        )}
      </div>
    </>
  );
}