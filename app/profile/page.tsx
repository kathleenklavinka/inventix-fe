"use client";

import Header from "../components/header";
import Link from "next/link";
import { useState, useEffect } from "react";

const user = {
  nama: "Andi Pratama",
  email: "andi.pratama@inventix.id",
  role: "Admin",
  initials: "AP",
  telepon: "+62 812-3456-7890",
  jabatan: "Inventory Manager",
  bergabung: "12 Januari 2024",
  lastLogin: "Hari ini, 08:42",
  avatar: null,
};

const stats = [
  { label: "Transaksi",    value: "284", bg: "#D8DFE9" },
  { label: "Stok Dikelola",value: "128", bg: "#CFDECA" },
  { label: "Supplier",     value: "14",  bg: "#EFF0A3" },
];

const activityLog = [
  { action: "Menambah stok Kopi Arabika",      time: "5 menit lalu",  type: "stock"    },
  { action: "Konfirmasi penjualan x12 Gula",   time: "1 jam lalu",    type: "sale"     },
  { action: "Update data Supplier Mitra Jaya", time: "3 jam lalu",    type: "supplier" },
  { action: "Login dari perangkat baru",       time: "Kemarin 19:22", type: "login"    },
  { action: "Menghapus stok item expired",     time: "2 hari lalu",   type: "delete"   },
];

const IconEdit2 = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 1.36l3-.06a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.09 6.09l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
  </svg>
);

const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconBriefcase = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconActivity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const ACTIVITY_META: Record<string, { color: string; icon: React.ReactNode }> = {
  stock:    { color: "#D8DFE9", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2a3a52" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
  sale:     { color: "#CFDECA", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2d6a3f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  supplier: { color: "#EFF0A3", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7a6a10" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  login:    { color: "#D8DFE9", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2a3a52" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> },
  delete:   { color: "#fee2e2", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> },
};

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [animCards, setAnimCards] = useState(false);

  useEffect(() => {
    setTimeout(() => { setMounted(true); setAnimCards(true); }, 100);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blob {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(30px,-20px) scale(1.06); }
          66%      { transform:translate(-20px,20px) scale(0.95); }
        }
        .anim-fade-up { animation:fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .d100{animation-delay:.10s}.d150{animation-delay:.15s}.d200{animation-delay:.20s}
        .d250{animation-delay:.25s}.d300{animation-delay:.30s}.d350{animation-delay:.35s}
        .d400{animation-delay:.40s}.d450{animation-delay:.45s}.d500{animation-delay:.50s}
        .blob  { animation:blob 10s ease-in-out infinite; }
        .blob2 { animation:blob 14s ease-in-out infinite reverse; animation-delay:4s; }
        .zoom-card {
          transition:transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s;
        }
        .zoom-card:hover { transform:translateY(-3px); box-shadow:0 20px 48px rgba(33,33,33,0.10); }
        .info-row {
          transition:background .15s, transform .22s cubic-bezier(.22,1,.36,1);
          border-radius:10px;
        }
        .info-row:hover { background:rgba(33,33,33,0.03); transform:translateX(4px); }
        .act-row {
          border-radius:10px;
          transition:background .15s, transform .22s cubic-bezier(.22,1,.36,1);
        }
        .act-row:hover { background:rgba(255,255,255,0.65); transform:translateX(5px); }
        .stat-chip { transition:transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s; }
        .stat-chip:hover { transform:scale(1.06) translateY(-2px); box-shadow:0 10px 24px rgba(33,33,33,0.10); }

        /* Edit Profil button */
        .edit-btn {
          transition:background .18s, transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s;
        }
        .edit-btn:hover { background:#2d2d2d; box-shadow:0 8px 20px rgba(33,33,33,0.18); transform:translateY(-1px); }
        .edit-btn:active { transform:scale(0.97); }

        .avatar-ring { transition:transform .28s cubic-bezier(.22,1,.36,1); }
        .avatar-ring:hover { transform:scale(1.04); }
        .progress-bar { transition:width 1.3s cubic-bezier(.22,1,.36,1); }

        /* Small inline edit link */
        .inline-edit-link {
          transition:background .15s, color .15s;
          border-radius:8px;
        }
        .inline-edit-link:hover { background:#212121 !important; color:#F9F9FA !important; border-color:#212121 !important; }
      `}</style>

      <div
        className={`min-h-screen text-[#212121] transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F9F9FA", fontFamily: "var(--font-inter), sans-serif" }}>

        <Header userInitials={user.initials} hasNotification={false} />

        <main className="w-full">

          {/*  HERO SECTION  */}
          <section className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12"
            style={{ background: "linear-gradient(160deg, #edf1f5 0%, #edf3eb 40%, #f4f6e4 72%, #f9f9f7 100%)" }}>
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-30 blob pointer-events-none"
              style={{ background: "#CFDECA", filter: "blur(72px)" }} />
            <div className="absolute top-8 left-1/3 w-56 h-56 rounded-full opacity-20 blob2 pointer-events-none"
              style={{ background: "#EFF0A3", filter: "blur(60px)" }} />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full opacity-20 blob pointer-events-none"
              style={{ background: "#D8DFE9", filter: "blur(55px)" }} />

            <div className="max-w-4xl mx-auto px-4 sm:px-8">
              <div className="anim-fade-up flex items-center gap-2 mb-6 text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>
                <Link href="/dashboard" className="hover:text-[#212121] transition-colors">Dashboard</Link>
                <span>/</span>
                <span className="text-[#212121]">Profil</span>
              </div>

              {/* Avatar + nama */}
              <div className="anim-fade-up d100 flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-7">
                <div className="avatar-ring relative">
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: "conic-gradient(#D8DFE9, #CFDECA, #EFF0A3, #D8DFE9)", padding: "3px", borderRadius: "9999px" }}>
                    <div className="w-full h-full rounded-full" style={{ background: "#dce4ee" }} />
                  </div>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center z-10 m-[3px]"
                    style={{ background: "#212121" }}>
                    <span className="font-black text-2xl sm:text-3xl text-white tracking-wide"
                      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      {user.initials}
                    </span>
                  </div>
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white z-20" />
                </div>

                <div className="flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-1">
                    <h1 className="font-black text-2xl sm:text-3xl text-[#212121] leading-none"
                      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      {user.nama}
                    </h1>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: "#212121", color: "#EFF0A3", letterSpacing: "0.04em", fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: "rgba(33,33,33,0.50)" }}>{user.jabatan}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: "rgba(33,33,33,0.32)" }}>{user.email}</p>
                </div>

                <Link href="/profile/edit"
                  className="edit-btn anim-fade-up d200 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: "#212121", textDecoration: "none", fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                  <IconEdit2 />
                  Edit Profil
                </Link>
              </div>

              {/* Stat chips */}
              <div className="anim-fade-up d250 flex flex-wrap gap-2.5 mt-7">
                {stats.map((s, i) => (
                  <div key={i} className="stat-chip flex items-center gap-2 px-3.5 py-2 rounded-xl border"
                    style={{ background: s.bg, borderColor: "rgba(255,255,255,0.55)" }}>
                    <span className="font-black text-sm text-[#212121]"
                      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>{s.value}</span>
                    <span className="text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.52)" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/*  MAIN CONTENT  */}
          <section className="w-full py-8 sm:py-10" style={{ background: "#FFFFFF" }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-5">

                {/*  LEFT: Info detail  */}
                <div className="sm:col-span-3 flex flex-col gap-4">

                  {/* Informasi Akun */}
                  <div className="anim-fade-up d300 zoom-card border rounded-2xl overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.70)", borderColor: "rgba(33,33,33,0.07)", boxShadow: "0 4px 20px rgba(33,33,33,0.05)" }}>
                    <div className="px-5 sm:px-6 py-4 flex items-center justify-between"
                      style={{ borderBottom: "1px solid rgba(33,33,33,0.06)" }}>
                      <div className="flex items-center gap-2 text-[#212121]">
                        <IconUser />
                        <h2 className="font-bold text-[13px] sm:text-sm"
                          style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>Informasi Akun</h2>
                      </div>
                      <Link href="/profile/edit"
                        className="inline-edit-link text-[10px] font-bold px-2.5 py-1 rounded-lg border"
                        style={{ color: "rgba(33,33,33,0.38)", borderColor: "rgba(33,33,33,0.10)" }}>
                        Edit
                      </Link>
                    </div>
                    <div className="px-5 sm:px-6 py-3 space-y-0.5">
                      {[
                        { icon: <IconUser />,      label: "Nama Lengkap",   value: user.nama      },
                        { icon: <IconMail />,      label: "Email",          value: user.email     },
                        { icon: <IconPhone />,     label: "Telepon",        value: user.telepon   },
                        { icon: <IconBriefcase />, label: "Jabatan",        value: user.jabatan   },
                        { icon: <IconShield />,    label: "Role",           value: user.role      },
                        { icon: <IconCalendar />,  label: "Bergabung",      value: user.bergabung },
                        { icon: <IconClock />,     label: "Login Terakhir", value: user.lastLogin },
                      ].map((row, i) => (
                        <div key={i} className="info-row flex items-center gap-3 px-2 py-2.5">
                          <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: "rgba(33,33,33,0.05)", color: "rgba(33,33,33,0.45)" }}>
                            {row.icon}
                          </span>
                          <span className="text-xs font-medium w-28 flex-shrink-0" style={{ color: "rgba(33,33,33,0.38)" }}>
                            {row.label}
                          </span>
                          <span className="text-xs font-semibold text-[#212121] truncate">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress kontribusi */}
                  <div className="anim-fade-up d350 zoom-card border rounded-2xl p-5 sm:p-6"
                    style={{ background: "rgba(255,255,255,0.70)", borderColor: "rgba(33,33,33,0.07)", boxShadow: "0 4px 20px rgba(33,33,33,0.05)" }}>
                    <h2 className="font-bold text-[13px] sm:text-sm text-[#212121] mb-5"
                      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>Ringkasan Kontribusi</h2>
                    <div className="space-y-4">
                      {[
                        { label: "Manajemen Stok",  pct: 88, color: "#D8DFE9", track: "#2a3a52" },
                        { label: "Penjualan Input", pct: 72, color: "#CFDECA", track: "#2d6a3f" },
                        { label: "Data Supplier",   pct: 55, color: "#EFF0A3", track: "#7a6a10" },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-xs font-semibold text-[#212121]">{item.label}</span>
                            <span className="text-xs font-bold" style={{ color: "rgba(33,33,33,0.45)" }}>{item.pct}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(33,33,33,0.07)" }}>
                            <div className="h-full rounded-full progress-bar"
                              style={{ width: animCards ? `${item.pct}%` : "0%", background: item.color, transitionDelay: `${i * 120}ms` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Log aktivitas */}
                <div className="sm:col-span-2 flex flex-col gap-4">

                  {/* Aktivitas Terbaru */}
                  <div className="anim-fade-up d400 zoom-card border rounded-2xl overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.70)", borderColor: "rgba(33,33,33,0.07)", boxShadow: "0 4px 20px rgba(33,33,33,0.05)" }}>
                    <div className="px-5 py-4 flex items-center gap-2"
                      style={{ borderBottom: "1px solid rgba(33,33,33,0.06)" }}>
                      <IconActivity />
                      <h2 className="font-bold text-[13px] sm:text-sm text-[#212121]"
                        style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>Aktivitas Terbaru</h2>
                    </div>
                    <div className="px-4 py-3 space-y-0.5">
                      {activityLog.map((item, i) => {
                        const meta = ACTIVITY_META[item.type];
                        return (
                          <div key={i} className="act-row flex items-center gap-3 px-2 py-2.5">
                            <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: meta.color }}>
                              {meta.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-[#212121] leading-snug truncate">{item.action}</p>
                              <p className="text-[10px] font-medium mt-0.5" style={{ color: "rgba(33,33,33,0.35)" }}>{item.time}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* STAT BAR */}
          <section className="w-full py-5 sm:py-6" style={{ background: "#212121" }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
              <div className="anim-fade-up d500 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 sm:gap-10 flex-wrap">
                  {[
                    { val: "284",   label: "Total transaksi" },
                    { val: "14 bln",label: "Masa bergabung"  },
                    { val: "Admin", label: "Level akses"     },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-6 sm:gap-10">
                      {i > 0 && <div className="w-px h-8 hidden sm:block" style={{ background: "rgba(249,249,250,0.08)" }} />}
                      <div className="text-center">
                        <p className="font-black text-base sm:text-lg"
                          style={{ color: "#F9F9FA", fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>{s.val}</p>
                        <p className="text-[9px] sm:text-[10px] font-medium mt-0.5" style={{ color: "rgba(249,249,250,0.28)" }}>{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] font-medium" style={{ color: "rgba(249,249,250,0.18)" }}>Inventix v1.0</p>
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}