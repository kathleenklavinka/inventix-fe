"use client";

import Header from "../components/header";
import { useState, useEffect } from "react";

type Actor    = "Admin" | "Gudang" | "Sistem" | "Owner";
type Category = "Stock" | "Penjualan" | "Supplier" | "User" | "Sistem";

interface ActivityLog {
  id:        string;
  timestamp: string;
  actor:     Actor;
  actorName: string;
  category:  Category;
  action:    string;
  detail:    string;
  target?:   string;
  status:    "success" | "warning" | "info";
  readBy:    Actor[];
}

const LOGS: ActivityLog[] = [
  { id:"l1",  timestamp:"2026-05-31T09:14:00", actor:"Admin",  actorName:"Andi Pratama",    category:"Stock",     action:"Tambah Stok",       detail:"Menambahkan 200 unit produk ke stok gudang.",                                                         target:"Aqua 600ml (Karton)",                status:"success", readBy:["Admin"] },
  { id:"l2",  timestamp:"2026-05-31T09:15:30", actor:"Sistem", actorName:"Inventix System", category:"Sistem",    action:"Notifikasi Owner",   detail:"Owner diberitahu bahwa Andi Pratama menambah 200 unit Aqua 600ml.",                                    status:"info",    readBy:["Sistem","Owner"] },
  { id:"l3",  timestamp:"2026-05-31T10:02:00", actor:"Gudang", actorName:"Budi Santoso",    category:"Stock",     action:"Ubah Stok",          detail:"Mengubah jumlah stok minimum dari 50 menjadi 30 unit.",                                               target:"Indomie Goreng (Karton)",             status:"warning", readBy:["Gudang"] },
  { id:"l4",  timestamp:"2026-05-31T10:03:15", actor:"Sistem", actorName:"Inventix System", category:"Sistem",    action:"Log Audit",          detail:"Sistem mencatat perubahan stok minimum oleh Budi Santoso dan mengirim ringkasan ke Owner.",            status:"info",    readBy:["Sistem","Owner"] },
  { id:"l5",  timestamp:"2026-05-31T11:30:00", actor:"Admin",  actorName:"Andi Pratama",    category:"Supplier",  action:"Tambah Supplier",    detail:"Mendaftarkan supplier baru ke sistem.",                                                               target:"CV. Maju Bersama",                   status:"success", readBy:["Admin","Owner"] },
  { id:"l6",  timestamp:"2026-05-31T13:45:00", actor:"Admin",  actorName:"Andi Pratama",    category:"Penjualan", action:"Buat Transaksi",     detail:"Mencatat penjualan 10 karton ke pelanggan.",                                                         target:"Toko Sinar Jaya — Rp 1.250.000",     status:"success", readBy:["Admin"] },
  { id:"l7",  timestamp:"2026-05-31T13:46:10", actor:"Sistem", actorName:"Inventix System", category:"Stock",     action:"Update Otomatis",    detail:"Stok Aqua 600ml dikurangi otomatis sebesar 10 karton akibat transaksi penjualan #TRX-0312.",          target:"Aqua 600ml (Karton)",                status:"info",    readBy:["Sistem"] },
  { id:"l8",  timestamp:"2026-05-31T15:00:00", actor:"Gudang", actorName:"Budi Santoso",    category:"Stock",     action:"Hapus Produk",       detail:"Menghapus produk yang sudah tidak aktif dari daftar stok.",                                          target:"Teh Botol Sosro 250ml (Kadaluarsa)", status:"warning", readBy:["Gudang","Admin"] },
  { id:"l9",  timestamp:"2026-05-30T08:20:00", actor:"Admin",  actorName:"Andi Pratama",    category:"User",      action:"Tambah User",        detail:"Menambahkan akun pengguna baru dengan role Gudang.",                                                  target:"Cahya Dewi (Role: Gudang)",          status:"success", readBy:["Admin","Owner"] },
  { id:"l10", timestamp:"2026-05-30T09:00:00", actor:"Sistem", actorName:"Inventix System", category:"Sistem",    action:"Kirim Email",        detail:"Email undangan dan kredensial login dikirim ke Cahya Dewi.",                                         target:"cahya.dewi@inventix.id",             status:"info",    readBy:["Sistem"] },
];

const ACTOR_STYLE: Record<Actor, { bg: string; text: string; dot: string; border: string }> = {
  Admin:  { bg:"#D6EDF5", text:"#1A4D66", dot:"#81C3DE", border:"#B0D9EE" },
  Gudang: { bg:"#F5E6D6", text:"#7A4520", dot:"#E8A87C", border:"#F0C9A8" },
  Sistem: { bg:"#E8D6F5", text:"#5B2D8A", dot:"#C4A0E8", border:"#D8B8F5" },
  Owner:  { bg:"#D6F5E8", text:"#1A6647", dot:"#78C89A", border:"#A8DEBC" },
};

const CAT_STYLE: Record<Category, { emoji: string; bg: string }> = {
  Stock:     { emoji:"📦", bg:"#FEF9D6" },
  Penjualan: { emoji:"🧾", bg:"#D6F0F5" },
  Supplier:  { emoji:"🏭", bg:"#D6F5E8" },
  User:      { emoji:"👤", bg:"#E8D6F5" },
  Sistem:    { emoji:"⚙️", bg:"#F5D6F0" },
};

const STATUS_STYLE: Record<string, { bar: string; label: string }> = {
  success: { bar:"#78C89A", label:"#1A6647" },
  warning: { bar:"#E8C87A", label:"#7A5A20" },
  info:    { bar:"#81C3DE", label:"#1A4D66" },
};

const UNREAD_IDS = new Set(LOGS.slice(0, 6).map(l => l.id));

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Baru saja";
  if (mins < 60) return `${mins} mnt lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", { hour:"2-digit", minute:"2-digit" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    weekday:"long", day:"numeric", month:"long", year:"numeric",
  });
}

function groupByDate(logs: ActivityLog[]): Record<string, ActivityLog[]> {
  return logs.reduce((acc, log) => {
    const key = log.timestamp.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {} as Record<string, ActivityLog[]>);
}

function ActorBadge({ actor }: { actor: Actor }) {
  const s = ACTOR_STYLE[actor];
  return (
    <span style={{
      background: s.bg, color: s.text, fontSize: 9, fontWeight: 700,
      letterSpacing: "0.06em", padding: "3px 9px", borderRadius: 20,
      display: "inline-flex", alignItems: "center", gap: 4,
      border: `1.5px solid ${s.border}`,
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, display:"inline-block" }} />
      {actor.toUpperCase()}
    </span>
  );
}

function LogCard({ log, expanded, onToggle, isUnread }: {
  log: ActivityLog; expanded: boolean; onToggle: () => void; isUnread: boolean;
}) {
  const cat = CAT_STYLE[log.category];
  const st  = STATUS_STYLE[log.status];

  return (
    <div
      onClick={onToggle}
      style={{
        background: isUnread ? "#FAFFF8" : "#FFFFFF",
        border: expanded ? "1.5px solid #A5D4AB" : "1.5px solid #D0E8D4",
        borderRadius: 16,
        padding: "13px 15px 13px 18px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow .2s, transform .2s, border-color .2s",
        boxShadow: expanded
          ? "0 6px 28px rgba(78,168,90,0.10)"
          : "0 1px 4px rgba(78,168,90,0.05)",
        transform: expanded ? "translateY(-1px)" : "none",
      }}
    >
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 3.5, background: st.bar, borderRadius: "16px 0 0 16px",
      }} />

      <div style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
        <div style={{
          width:36, height:36, borderRadius:11, background:cat.bg,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:15, flexShrink:0,
        }}>
          {cat.emoji}
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:4 }}>
            <ActorBadge actor={log.actor} />
            <span style={{ fontSize:10, color:"#7A9B82", fontWeight:500 }}>{log.actorName}</span>
            {isUnread && (
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#F5837A", flexShrink:0 }} />
            )}
            <span style={{ marginLeft:"auto", fontSize:10, color:"#7A9B82", fontWeight:500, whiteSpace:"nowrap" }}>
              {formatTime(log.timestamp)} · {relativeTime(log.timestamp)}
            </span>
          </div>

          <p style={{ fontSize:12, fontWeight:700, color:"#1C3320", margin:"0 0 2px" }}>{log.action}</p>

          {log.target && (
            <p style={{ fontSize:11, fontWeight:600, color:st.label, margin:"0 0 2px" }}>{log.target}</p>
          )}

          {expanded && (
            <div style={{ marginTop:12, paddingTop:12, borderTop:"1.5px dashed #D0E8D4" }}>
              <p style={{ fontSize:11, color:"#4A6B52", lineHeight:1.7, margin:0 }}>
                {log.detail}
              </p>
              <div style={{ marginTop:10 }}>
                <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.07em", color:"#7A9B82", marginBottom:6 }}>
                  TERLIHAT OLEH
                </p>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {(["Admin","Gudang","Sistem","Owner"] as Actor[]).map(a => {
                    const seen = log.readBy.includes(a);
                    const as   = ACTOR_STYLE[a];
                    return (
                      <span key={a} style={{
                        fontSize:9, fontWeight:700, letterSpacing:"0.05em",
                        padding:"2px 9px", borderRadius:20,
                        background:   seen ? as.bg     : "rgba(0,0,0,0.04)",
                        color:        seen ? as.text   : "#9AAA9F",
                        border:       `1.5px solid ${seen ? as.border : "transparent"}`,
                      }}>
                        {a}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type FilterKey = "Semua" | Actor | Category;
const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key:"Semua",     label:"Semua" },
  { key:"Admin",     label:"Admin" },
  { key:"Gudang",    label:"Gudang" },
  { key:"Sistem",    label:"Sistem" },
  { key:"Owner",     label:"Owner" },
  { key:"Stock",     label:"📦 Stock" },
  { key:"Penjualan", label:"🧾 Penjualan" },
  { key:"Supplier",  label:"🏭 Supplier" },
  { key:"User",      label:"👤 User" },
];

export default function NotificationPage() {
  const [filter,   setFilter]   = useState<FilterKey>("Semua");
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted,  setMounted]  = useState(false);
  const [readAll,  setReadAll]  = useState(false);

  const unreadCount = readAll ? 0 : LOGS.filter(l => UNREAD_IDS.has(l.id)).length;

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const filtered = LOGS.filter(log => {
    const mf =
      filter === "Semua" ||
      log.actor    === filter ||
      log.category === filter ||
      log.readBy.includes(filter as Actor);
    const q = search.toLowerCase();
    const ms = !q ||
      log.action.toLowerCase().includes(q)   ||
      log.detail.toLowerCase().includes(q)   ||
      (log.target || "").toLowerCase().includes(q) ||
      log.actorName.toLowerCase().includes(q);
    return mf && ms;
  });

  const grouped     = groupByDate(filtered);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .anim-fade-up { animation: fadeUp .45s cubic-bezier(.22,1,.36,1) both; }
        .d100{animation-delay:.10s} .d150{animation-delay:.15s}
        .d200{animation-delay:.20s} .d250{animation-delay:.25s}
        .log-entry { animation: fadeUp .24s ease both; }

        .notif-search {
          width:100%; border:1.5px solid #D0E8D4; border-radius:12px;
          padding:10px 14px 10px 36px; font-size:12px;
          background:#F7FBF8; outline:none; color:#1C3320;
          transition:border-color .18s;
          font-family:var(--font-inter),sans-serif;
        }
        .notif-search:focus { border-color:#78BC82; }
        .notif-search::placeholder { color:#7A9B82; }

        .tab-btn {
          flex-shrink:0; padding:12px 14px 14px; font-size:11px; font-weight:700;
          color:#7A9B82; border:none; background:none; cursor:pointer;
          font-family:var(--font-inter),sans-serif; letter-spacing:0.03em;
          border-bottom:2.5px solid transparent; transition:all .18s;
          white-space:nowrap;
        }
        .tab-btn:hover { color:#2D6B37; }
        .tab-btn.tab-active { color:#2D6B37; border-bottom-color:#4EA85A; }

        .log-card-wrap { transition:transform .22s cubic-bezier(.22,1,.36,1); }
        .log-card-wrap:hover { transform:translateY(-2px); }

        .date-label {
          font-size:10px; font-weight:700; letter-spacing:0.10em;
          color:#7A9B82; text-transform:uppercase;
          display:flex; align-items:center; gap:8px; margin-bottom:6px;
        }
        .date-label::after {
          content:''; flex:1; height:1px; background:#D0E8D4;
        }

        /* Mark all read button — pill style with animated checkmark */
        .mark-read-btn {
          display:inline-flex; align-items:center; gap:6px;
          background:#FFFFFF; border:1.5px solid #A5D4AB;
          border-radius:10px; padding:8px 14px;
          font-size:11px; font-weight:700; letter-spacing:0.02em;
          color:#2D6B37; cursor:pointer; font-family:inherit;
          transition:background .18s, border-color .18s, color .18s, transform .15s;
          box-shadow:0 1px 4px rgba(78,168,90,0.12);
        }
        .mark-read-btn:hover {
          background:#4EA85A; border-color:#4EA85A; color:#fff;
          transform:translateY(-1px);
          box-shadow:0 4px 14px rgba(78,168,90,0.25);
        }
        .mark-read-btn:active { transform:scale(0.97); }
        .mark-read-btn .btn-icon {
          width:18px; height:18px; border-radius:6px;
          background:#D6F5E8; display:flex; align-items:center; justify-content:center;
          flex-shrink:0; transition:background .18s;
        }
        .mark-read-btn:hover .btn-icon { background:rgba(255,255,255,0.22); }
      `}</style>

      <div
        className={`min-h-screen text-[#1C3320] transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background:"#E8F5EC", fontFamily:"var(--font-inter),sans-serif" }}
      >
        <Header userInitials="AP" hasNotification={false} />

        <main className="w-full">

          <section
            className="w-full relative overflow-hidden pt-16 sm:pt-20"
            style={{
              background: "linear-gradient(160deg,#C8E6CC 0%,#D4EDD9 50%,#C5E4CA 100%)",
              borderBottom: "1.5px solid #B5D9BB",
            }}
          >
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none opacity-20"
              style={{ background:"#78BC82", filter:"blur(64px)" }} />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full pointer-events-none opacity-15"
              style={{ background:"#A5D4AB", filter:"blur(50px)" }} />

            <div className="max-w-4xl mx-auto px-4 sm:px-8">

              <div className="anim-fade-up d100 flex items-start sm:items-center justify-between gap-4 pt-6 pb-5 relative z-10 flex-wrap">
                <div className="flex items-center gap-4">

                  <div style={{
                    width:48, height:48, borderRadius:16,
                    background:"rgba(255,255,255,0.80)",
                    border:"1.5px solid #B5D9BB",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    flexShrink:0, position:"relative",
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3A8F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    {unreadCount > 0 && (
                      <span style={{
                        position:"absolute", top:8, right:8,
                        width:9, height:9, borderRadius:"50%",
                        background:"#F5837A", border:"2px solid #D4EDD9",
                      }} />
                    )}
                  </div>

                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <h1 style={{
                        fontSize:22, fontWeight:800, color:"#2D6B37",
                        letterSpacing:"-0.03em", lineHeight:1, margin:0,
                        fontFamily:"var(--font-plus-jakarta),sans-serif",
                      }}>
                        Notifikasi
                      </h1>
                      {unreadCount > 0 && (
                        <span style={{
                          background:"#F5837A", color:"#fff",
                          fontSize:10, fontWeight:800,
                          padding:"3px 9px", borderRadius:20,
                          letterSpacing:"0.04em", lineHeight:1.6,
                        }}>
                          {unreadCount} baru
                        </span>
                      )}
                    </div>
                    <p style={{ margin:"4px 0 0", fontSize:11, color:"#4A6B52", fontWeight:500 }}>
                      Log audit · Admin · Sistem · Owner
                    </p>
                  </div>
                </div>

                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={() => setReadAll(true)}>
                    <span className="btn-icon">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1A6647" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              <div
                className="anim-fade-up d150 flex gap-0 overflow-x-auto relative z-10"
                style={{ borderTop:"1px solid rgba(53,139,70,0.12)", scrollbarWidth:"none" }}
              >
                {FILTER_TABS.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`tab-btn${filter === key ? " tab-active" : ""}`}
                    onClick={() => setFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full py-6 sm:py-8" style={{ background:"#FFFFFF" }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-8">

              <div className="anim-fade-up d200 relative mb-5">
                <svg
                  style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#7A9B82", pointerEvents:"none" }}
                  width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  className="notif-search"
                  placeholder="Cari aktivitas, produk, atau pengguna..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {sortedDates.length === 0 ? (
                <div style={{ textAlign:"center", padding:"60px 0", color:"#7A9B82" }}>
                  <p style={{ fontSize:40, marginBottom:12 }}>📭</p>
                  <p style={{ fontSize:13, fontWeight:600 }}>Tidak ada aktivitas ditemukan</p>
                </div>
              ) : (
                sortedDates.map(date => (
                  <div key={date} style={{ marginBottom:24 }}>
                    <p className="date-label">{formatDate(date)}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {grouped[date].map((log, i) => (
                        <div
                          key={log.id}
                          className="log-entry log-card-wrap"
                          style={{ animationDelay:`${i * 35}ms` }}
                        >
                          <LogCard
                            log={log}
                            expanded={expanded === log.id}
                            isUnread={!readAll && UNREAD_IDS.has(log.id)}
                            onToggle={() => setExpanded(expanded === log.id ? null : log.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              <p style={{
                textAlign:"center", fontSize:10, color:"#9AAA9F",
                fontWeight:500, letterSpacing:"0.04em", marginTop:16,
              }}>
                Inventix Audit Log · Data diperbarui real-time
              </p>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}