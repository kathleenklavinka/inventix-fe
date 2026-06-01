"use client";

import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { api, mapRoleToFrontend } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
type Actor    = "Admin" | "Gudang" | "Sistem" | "Owner";
type Category = "Stock" | "Penjualan" | "Supplier" | "User" | "Sistem" | "Purchase Order";
type UserRole = "owner" | "admin" | "user" | "supplier";

interface ActivityLog {
  id:           string;
  timestamp:    string;
  actor:        Actor;
  actorName:    string;
  category:     Category;
  action:       string;
  detail:       string;
  target?:      string;
  status:       "success" | "warning" | "info";
  readBy:       Actor[];
  poAmount?:    number;
  isPOWarning?: boolean;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", minimumFractionDigits:0 }).format(amount);
}

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

function formatActivityAction(namaTabel: string, aksi: string): string {
  const t = namaTabel?.toLowerCase();
  const a = aksi?.toLowerCase();

  let actionStr = "";
  if (a === "buat") actionStr = "Tambah";
  else if (a === "edit") actionStr = "Ubah";
  else if (a === "hapus") actionStr = "Hapus";
  else actionStr = "Aktivitas";

  let tableStr = "";
  if (t === "stok") tableStr = "Stok";
  else if (t === "supplier") tableStr = "Supplier";
  else if (t === "purchaseorder" || t === "purchase_order") tableStr = "Purchase Order";
  else if (t === "pembeliantransaksi" || t === "pembelian_transaksi") tableStr = "Transaksi";
  else if (t === "akun") tableStr = "User";
  else tableStr = namaTabel || "Sistem";

  return `${actionStr} ${tableStr}`;
}

const ACTOR_STYLE: Record<Actor, { bg: string; text: string; dot: string; border: string }> = {
  Admin:  { bg:"#D6EDF5", text:"#1A4D66", dot:"#81C3DE", border:"#B0D9EE" },
  Gudang: { bg:"#F5E6D6", text:"#7A4520", dot:"#E8A87C", border:"#F0C9A8" },
  Sistem: { bg:"#E8D6F5", text:"#5B2D8A", dot:"#C4A0E8", border:"#D8B8F5" },
  Owner:  { bg:"#D6F5E8", text:"#1A6647", dot:"#78C89A", border:"#A8DEBC" },
};

const CAT_STYLE: Record<Category, { emoji: string; bg: string }> = {
  Stock:            { emoji:"📦", bg:"#FEF9D6" },
  Penjualan:        { emoji:"🧾", bg:"#D6F0F5" },
  Supplier:         { emoji:"🏭", bg:"#D6F5E8" },
  User:             { emoji:"👤", bg:"#E8D6F5" },
  Sistem:           { emoji:"⚙️", bg:"#F5D6F0" },
  "Purchase Order": { emoji:"🛒", bg:"#FFF0E0" },
};

const STATUS_STYLE: Record<string, { bar: string; label: string }> = {
  success: { bar:"#78C89A", label:"#1A6647" },
  warning: { bar:"#E8A850", label:"#7A4A10" },
  info:    { bar:"#81C3DE", label:"#1A4D66" },
};

function ActorBadge({ actor }: { actor: Actor }) {
  const s = ACTOR_STYLE[actor] || ACTOR_STYLE.Sistem;
  return (
    <span style={{
      background:s.bg, color:s.text, fontSize:9, fontWeight:700,
      letterSpacing:"0.06em", padding:"3px 9px", borderRadius:20,
      display:"inline-flex", alignItems:"center", gap:4,
      border:`1.5px solid ${s.border}`,
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, display:"inline-block" }} />
      {actor.toUpperCase()}
    </span>
  );
}

function POWarningCard({ log, expanded, onToggle, isUnread, onDismiss }: {
  log: ActivityLog; expanded: boolean; onToggle: () => void;
  isUnread: boolean; onDismiss: (id: string) => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: expanded ? "#FFF8F0" : "#FFFAF4",
        border: `1.5px solid ${expanded ? "#E8A850" : "#F5C878"}`,
        borderRadius: 16, padding:"14px 16px 14px 20px",
        cursor:"pointer", position:"relative", overflow:"hidden",
        transition:"box-shadow .2s, transform .2s, border-color .2s",
        boxShadow: expanded
          ? "0 8px 32px rgba(232,168,80,0.18)"
          : "0 2px 8px rgba(232,168,80,0.10)",
        transform: expanded ? "translateY(-1px)" : "none",
      }}
    >
      <div style={{
        position:"absolute", left:0, top:0, bottom:0,
        width:4, background:"linear-gradient(180deg,#F5A623,#E8792A)",
        borderRadius:"16px 0 0 16px",
      }} />

      <button
        onClick={e => { e.stopPropagation(); onDismiss(log.id); }}
        style={{
          position:"absolute", top:10, right:10,
          width:22, height:22, borderRadius:7,
          background:"rgba(232,168,80,0.15)", border:"none",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", transition:"background .15s",
          color:"#B87820",
        }}
        title="Abaikan notifikasi ini"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        <div style={{
          width:40, height:40, borderRadius:13,
          background:"linear-gradient(135deg,#FFF0CC,#FFE0A0)",
          border:"1.5px solid #F5C878",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:18, flexShrink:0, position:"relative",
        }}>
          ⚠️
          {isUnread && (
            <span style={{
              position:"absolute", top:-3, right:-3,
              width:8, height:8, borderRadius:"50%",
              background:"#F5837A", border:"2px solid #FFFAF4",
            }} />
          )}
        </div>

        <div style={{ flex:1, minWidth:0, paddingRight:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:5 }}>
            <span style={{
              background:"#FEF0D6", color:"#8A4A00", fontSize:9, fontWeight:800,
              letterSpacing:"0.08em", padding:"3px 9px", borderRadius:20,
              border:"1.5px solid #F5C878", display:"inline-flex", alignItems:"center", gap:4,
            }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              PERINGATAN PO
            </span>
            <ActorBadge actor={log.actor} />
            <span style={{ fontSize:10, color:"#A07840", fontWeight:500 }}>{log.actorName}</span>
            <span style={{ marginLeft:"auto", fontSize:10, color:"#A07840", fontWeight:500, whiteSpace:"nowrap" }}>
              {formatTime(log.timestamp)} · {relativeTime(log.timestamp)}
            </span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <p style={{ fontSize:12, fontWeight:800, color:"#6A3000", margin:0 }}>
              Purchase Order Melebihi Batas
            </p>
            <span style={{
              background:"linear-gradient(90deg,#F5A623,#E8792A)",
              color:"#fff", fontSize:11, fontWeight:800,
              padding:"3px 10px", borderRadius:20,
              letterSpacing:"0.02em",
            }}>
              {formatRupiah(log.poAmount!)}
            </span>
          </div>

          {log.target && (
            <p style={{ fontSize:11, fontWeight:600, color:"#8A4A00", margin:"3px 0 0" }}>
              🛒 {log.target}
            </p>
          )}

          {expanded && (
            <div style={{ marginTop:12, paddingTop:12, borderTop:"1.5px dashed #F5C878" }}>
              <p style={{ fontSize:11, color:"#6A4000", lineHeight:1.75, margin:"0 0 12px" }}>
                {log.detail}
              </p>

              <div style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"8px 12px", borderRadius:10,
                background:"rgba(232,168,80,0.12)", border:"1px solid #F5C878",
                marginBottom:10,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ fontSize:10, color:"#8A5820", fontWeight:600, margin:0 }}>
                  Batas otomatis: <strong>Rp 500.000</strong> · Nilai PO ini{" "}
                  <strong style={{ color:"#C85020" }}>
                    {((log.poAmount! / 500000 - 1) * 100).toFixed(0)}% di atas batas
                  </strong>
                </p>
              </div>

              <div>
                <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.07em", color:"#A07840", marginBottom:5 }}>
                  HANYA TERLIHAT OLEH
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
                        {seen && a === "Owner" ? "👑 " : ""}{a}
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

function LogCard({ log, expanded, onToggle, isUnread }: {
  log: ActivityLog; expanded: boolean; onToggle: () => void; isUnread: boolean;
}) {
  const cat = CAT_STYLE[log.category] || CAT_STYLE.Sistem;
  const st  = STATUS_STYLE[log.status] || STATUS_STYLE.info;

  return (
    <div
      onClick={onToggle}
      style={{
        background: isUnread ? "#FAFFF8" : "#FFFFFF",
        border: expanded ? "1.5px solid #A5D4AB" : "1.5px solid #D0E8D4",
        borderRadius:16, padding:"13px 15px 13px 18px",
        cursor:"pointer", position:"relative", overflow:"hidden",
        transition:"box-shadow .2s, transform .2s, border-color .2s",
        boxShadow: expanded ? "0 6px 28px rgba(78,168,90,0.10)" : "0 1px 4px rgba(78,168,90,0.05)",
        transform: expanded ? "translateY(-1px)" : "none",
      }}
    >
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3.5, background:st.bar, borderRadius:"16px 0 0 16px" }} />
      <div style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
        <div style={{ width:36, height:36, borderRadius:11, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>
          {cat.emoji}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:4 }}>
            <ActorBadge actor={log.actor} />
            <span style={{ fontSize:10, color:"#7A9B82", fontWeight:500 }}>{log.actorName}</span>
            {isUnread && <span style={{ width:6, height:6, borderRadius:"50%", background:"#F5837A", flexShrink:0 }} />}
            <span style={{ marginLeft:"auto", fontSize:10, color:"#7A9B82", fontWeight:500, whiteSpace:"nowrap" }}>
              {formatTime(log.timestamp)} · {relativeTime(log.timestamp)}
            </span>
          </div>
          <p style={{ fontSize:12, fontWeight:700, color:"#1C3320", margin:"0 0 2px" }}>{log.action}</p>
          {log.target && <p style={{ fontSize:11, fontWeight:600, color:st.label, margin:"0 0 2px" }}>{log.target}</p>}
          {expanded && (
            <div style={{ marginTop:12, paddingTop:12, borderTop:"1.5px dashed #D0E8D4" }}>
              <p style={{ fontSize:11, color:"#4A6B52", lineHeight:1.7, margin:0 }}>{log.detail}</p>
              <div style={{ marginTop:10 }}>
                <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.07em", color:"#7A9B82", marginBottom:6 }}>TERLIHAT OLEH</p>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {(["Admin","Gudang","Sistem","Owner"] as Actor[]).map(a => {
                    const seen = log.readBy.includes(a);
                    const as   = ACTOR_STYLE[a];
                    return (
                      <span key={a} style={{ fontSize:9, fontWeight:700, letterSpacing:"0.05em", padding:"2px 9px", borderRadius:20, background:seen ? as.bg : "rgba(0,0,0,0.04)", color:seen ? as.text : "#9AAA9F", border:`1.5px solid ${seen ? as.border : "transparent"}` }}>
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

type FilterKey = "Semua" | "⚠️ PO Warning" | Actor | Category;

function buildFilterTabs(role: UserRole): { key: FilterKey; label: string }[] {
  const base: { key: FilterKey; label: string }[] = [
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
  if (role === "owner") {
    base.splice(1, 0, { key:"⚠️ PO Warning", label:"⚠️ PO Warning" });
  }
  return base;
}

export default function NotificationPage() {
  const [currentUser, setCurrentUser] = useState({
    role: "owner" as UserRole,
    name: "Owner Inventix",
    initials: "OI",
  });
  
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,    setFilter]    = useState<FilterKey>("Semua");
  const [search,    setSearch]    = useState("");
  const [expanded,  setExpanded]  = useState<string | null>(null);
  const [mounted,   setMounted]   = useState(false);
  const [readAll,   setReadAll]   = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [showNewPOBanner, setShowNewPOBanner] = useState(false);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [unreadIds, setUnreadIds] = useState<Set<string>>(new Set());

  const FILTER_TABS = buildFilterTabs(currentUser.role);

  const poWarningLogs = logs.filter(l => l.isPOWarning && !dismissed.has(l.id));
  const allUnreadCount = readAll ? 0 : logs.filter(l => unreadIds.has(l.id) && !dismissed.has(l.id)).length;

  const loadProfileAndLogs = async () => {
    try {
      const resProfile = await api.akun.profile();
      const p = resProfile.data;
      const fRole = mapRoleToFrontend(p.peran) as UserRole;
      const name = p.nama || "User";
      const initials = name.split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("");
      setCurrentUser({
        role: fRole,
        name: name,
        initials,
      });

      if (fRole === "owner") {
        setShowNewPOBanner(true);
      }

      // Fetch Riwayat Aktivitas
      const resLogs = await api.riwayatAktivitas.getAll();
      const mapped = resLogs.data.map((item: any) => {
        const u = item.akun || {};
        const actorName = u.nama || "Sistem";
        
        let actor: Actor = "Sistem";
        const r = u.peran?.toUpperCase();
        if (r === "OWNER") actor = "Owner";
        else if (r === "ADMIN") actor = "Admin";
        else if (r === "GUDANG") actor = "Gudang";
        else if (r === "SUPPLIER") actor = "Gudang";

        const category: Category = (() => {
          const t = item.nama_tabel?.toLowerCase();
          if (t === "stok") return "Stock";
          if (t === "supplier") return "Supplier";
          if (t === "purchaseorder" || t === "purchase_order") return "Purchase Order";
          if (t === "pembeliantransaksi" || t === "pembelian_transaksi") return "Penjualan";
          if (t === "akun") return "User";
          return "Sistem";
        })();

        // Try to parse target
        const target = item.data_baru
          ? (item.data_baru.nama || item.data_baru.nomor_po || item.data_baru.email || item.data_baru.sku || `ID: ${item.data_baru.id || item.record_id}`)
          : (item.data_lama ? (item.data_lama.nama || item.data_lama.nomor_po || item.data_lama.email || `ID: ${item.record_id}`) : `ID: ${item.record_id}`);

        const poAmount = category === "Purchase Order" && item.data_baru?.total_nilai
          ? parseFloat(item.data_baru.total_nilai)
          : undefined;

        const isPOWarning = poAmount !== undefined && poAmount > 500000;

        const status: "success" | "warning" | "info" = (() => {
          if (isPOWarning) return "warning";
          if (item.aksi === "buat") return "success";
          if (item.aksi === "edit") return "info";
          return "warning"; // hapus
        })();

        return {
          id: String(item.id),
          timestamp: item.dilakukan_pada || new Date().toISOString(),
          actor,
          actorName,
          category,
          action: formatActivityAction(item.nama_tabel, item.aksi),
          detail: item.data_baru
            ? `${actorName} berhasil melakukan aksi ${item.aksi} pada data ${category.toLowerCase()}.`
            : `${actorName} berhasil melakukan aksi ${item.aksi} di sistem.`,
          target,
          status,
          readBy: ["Owner", "Admin", "Gudang"] as Actor[],
          poAmount,
          isPOWarning,
        };
      });

      // Sort logs by newest first
      mapped.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLogs(mapped);

      // Randomly mark the newest 3 logs as unread for the nice visual notification dot!
      const unreads = new Set(mapped.slice(0, 3).map((l: any) => l.id));
      setUnreadIds(unreads);
    } catch (err) {
      console.error("Gagal memuat profile/logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileAndLogs();
    setTimeout(() => setMounted(true), 80);
  }, []);

  useEffect(() => {
    if (showNewPOBanner) {
      bannerTimerRef.current = setTimeout(() => setShowNewPOBanner(false), 8000);
    }
    return () => { if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current); };
  }, [showNewPOBanner]);

  const filteredLogs = logs.filter(log => {
    if (dismissed.has(log.id)) return false;
    let mf = false;
    if (filter === "Semua") {
      mf = true;
    } else if (filter === "⚠️ PO Warning") {
      mf = !!log.isPOWarning;
    } else {
      mf = log.actor === filter || log.category === filter || log.readBy.includes(filter as Actor);
    }
    const q = search.toLowerCase();
    const ms = !q ||
      log.action.toLowerCase().includes(q)       ||
      log.detail.toLowerCase().includes(q)       ||
      (log.target ?? "").toLowerCase().includes(q) ||
      log.actorName.toLowerCase().includes(q);
    return mf && ms;
  });

  const grouped     = groupByDate(filteredLogs);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  function dismissLog(id: string) {
    setDismissed(prev => new Set([...prev, id]));
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-20px); max-height:0; }
          to   { opacity:1; transform:translateY(0);   max-height:200px; }
        }
        @keyframes pulse {
          0%,100% { opacity:1; } 50% { opacity:0.6; }
        }
        .anim-fade-up  { animation:fadeUp .45s cubic-bezier(.22,1,.36,1) both; }
        .d100{animation-delay:.10s} .d150{animation-delay:.15s}
        .d200{animation-delay:.20s} .d250{animation-delay:.25s}
        .log-entry     { animation:fadeUp .24s ease both; }
        .po-banner     { animation:slideDown .4s cubic-bezier(.22,1,.36,1) both; overflow:hidden; }
        .pulse-dot     { animation:pulse 1.8s ease-in-out infinite; }

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
        .tab-btn.tab-warning { color:#A06020 !important; }
        .tab-btn.tab-warning.tab-active { border-bottom-color:#E8A850 !important; }

        .log-card-wrap { transition:transform .22s cubic-bezier(.22,1,.36,1); }
        .log-card-wrap:hover { transform:translateY(-2px); }

        .date-label {
          font-size:10px; font-weight:700; letter-spacing:0.10em;
          color:#7A9B82; text-transform:uppercase;
          display:flex; align-items:center; gap:8px; margin-bottom:6px;
        }
        .date-label::after { content:''; flex:1; height:1px; background:#D0E8D4; }

        .mark-read-btn {
          display:inline-flex; align-items:center; gap:6px;
          background:#FFFFFF; border:1.5px solid #A5D4AB; border-radius:10px;
          padding:8px 14px; font-size:11px; font-weight:700; letter-spacing:0.02em;
          color:#2D6B37; cursor:pointer; font-family:inherit;
          transition:background .18s, border-color .18s, color .18s, transform .15s;
          box-shadow:0 1px 4px rgba(78,168,90,0.12);
        }
        .mark-read-btn:hover {
          background:#4EA85A; border-color:#4EA85A; color:#fff;
          transform:translateY(-1px); box-shadow:0 4px 14px rgba(78,168,90,0.25);
        }
        .mark-read-btn:active { transform:scale(0.97); }
        .mark-read-btn .btn-icon {
          width:18px; height:18px; border-radius:6px; background:#D6F5E8;
          display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background .18s;
        }
        .mark-read-btn:hover .btn-icon { background:rgba(255,255,255,0.22); }

        .po-section-header {
          display:flex; align-items:center; gap:10px; padding:10px 14px;
          border-radius:12px; margin-bottom:10px;
          background:linear-gradient(90deg,#FFF5E0,#FFF9F0);
          border:1.5px solid #F5C878;
        }
      `}</style>

      <div
        className={`min-h-screen text-[#1C3320] transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background:"#E8F5EC", fontFamily:"var(--font-inter),sans-serif" }}
      >
        <Header userInitials={currentUser.initials} hasNotification={allUnreadCount > 0} />

        {showNewPOBanner && currentUser.role === "owner" && poWarningLogs.length > 0 && (
          <div className="po-banner" style={{ background:"linear-gradient(90deg,#7A3800,#A05000)", padding:"0" }}>
            <div style={{ maxWidth:896, margin:"0 auto", padding:"10px 24px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
              <span className="pulse-dot" style={{ width:8, height:8, borderRadius:"50%", background:"#F5C878", flexShrink:0 }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5C878" strokeWidth="2.2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p style={{ fontSize:12, fontWeight:700, color:"#FFF5E0", margin:0, flex:1 }}>
                <strong style={{ color:"#F5C878" }}>{poWarningLogs.length} Purchase Order</strong> oleh Admin melebihi batas Rp 500.000 dan memerlukan perhatian Anda.
              </p>
              <button
                onClick={() => { setFilter("⚠️ PO Warning"); setShowNewPOBanner(false); }}
                style={{ background:"#F5C878", color:"#7A3800", border:"none", borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:800, cursor:"pointer", flexShrink:0 }}
              >
                Lihat Sekarang →
              </button>
              <button
                onClick={() => setShowNewPOBanner(false)}
                style={{ background:"transparent", border:"none", color:"#F5C878", cursor:"pointer", padding:4, flexShrink:0 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        <main className="w-full">

          <section
            className="w-full relative overflow-hidden pt-16 sm:pt-20"
            style={{
              background:"linear-gradient(160deg,#C8E6CC 0%,#D4EDD9 50%,#C5E4CA 100%)",
              borderBottom:"1.5px solid #B5D9BB",
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
                    display:"flex", alignItems:"center", justifySelf:"center", justifyContent:"center",
                    flexShrink:0, position:"relative",
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3A8F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    {allUnreadCount > 0 && (
                      <span className="pulse-dot" style={{ position:"absolute", top:8, right:8, width:9, height:9, borderRadius:"50%", background:"#F5837A", border:"2px solid #D4EDD9" }} />
                    )}
                  </div>

                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <h1 style={{ fontSize:22, fontWeight:800, color:"#2D6B37", letterSpacing:"-0.03em", lineHeight:1, margin:0, fontFamily:"var(--font-plus-jakarta),sans-serif" }}>
                        Notifikasi
                      </h1>
                      {allUnreadCount > 0 && (
                        <span style={{ background:"#F5837A", color:"#fff", fontSize:10, fontWeight:800, padding:"3px 9px", borderRadius:20, letterSpacing:"0.04em", lineHeight:1.6 }}>
                          {allUnreadCount} baru
                        </span>
                      )}
                      {currentUser.role === "owner" && poWarningLogs.length > 0 && (
                        <span style={{ background:"linear-gradient(90deg,#F5A623,#E8792A)", color:"#fff", fontSize:10, fontWeight:800, padding:"3px 9px", borderRadius:20, letterSpacing:"0.04em", lineHeight:1.6, display:"inline-flex", alignItems:"center", gap:4 }}>
                          ⚠️ {poWarningLogs.length} PO
                        </span>
                      )}
                    </div>
                    <p style={{ margin:"4px 0 0", fontSize:11, color:"#4A6B52", fontWeight:500 }}>
                      Log audit · Admin · Sistem · {currentUser.role === "owner" ? "Owner" : "Gudang"}
                    </p>
                  </div>
                </div>

                {allUnreadCount > 0 && (
                  <button className="mark-read-btn" onClick={() => setReadAll(true)}>
                    <span className="btn-icon">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1A6647" strokeWidth="2.8" strokeLinecap="round">
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
                    className={`tab-btn${filter === key ? " tab-active" : ""}${key === "⚠️ PO Warning" ? " tab-warning" : ""}`}
                    onClick={() => setFilter(key)}
                  >
                    {label}
                    {key === "⚠️ PO Warning" && poWarningLogs.length > 0 && (
                      <span style={{ marginLeft:4, background:"#E8A850", color:"#fff", fontSize:8, fontWeight:800, padding:"1px 5px", borderRadius:10 }}>
                        {poWarningLogs.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full py-6 sm:py-8" style={{ background:"#FFFFFF" }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-8">

              {currentUser.role === "owner" && filter === "Semua" && poWarningLogs.length > 0 && (
                <div className="anim-fade-up po-section-header mb-5">
                  <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#FFE0A0,#F5C050)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A4A00" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12, fontWeight:800, color:"#7A3800", margin:"0 0 1px" }}>
                      {poWarningLogs.length} Purchase Order Menunggu Perhatian
                    </p>
                    <p style={{ fontSize:10, color:"#A06020", margin:0, fontWeight:500 }}>
                      Total nilai: <strong>{formatRupiah(poWarningLogs.reduce((s, l) => s + (l.poAmount ?? 0), 0))}</strong> · Semua PO melebihi batas Rp 500.000
                    </p>
                  </div>
                  <button
                    onClick={() => setFilter("⚠️ PO Warning")}
                    style={{ background:"#F5A623", color:"#fff", border:"none", borderRadius:9, padding:"6px 12px", fontSize:11, fontWeight:800, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap" }}
                  >
                    Lihat PO →
                  </button>
                </div>
              )}

              <div className="anim-fade-up d200 relative mb-5">
                <svg
                  style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#7A9B82", pointerEvents:"none" }}
                  width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
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

              {loading ? (
                <div style={{ textAlign:"center", padding:"60px 0", color:"#7A9B82" }}>
                  <p style={{ fontSize:13, fontWeight:600 }}>Memuat log aktivitas riil...</p>
                </div>
              ) : sortedDates.length === 0 ? (
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
                        <div key={log.id} className="log-entry log-card-wrap" style={{ animationDelay:`${i * 35}ms` }}>
                          {log.isPOWarning ? (
                            <POWarningCard
                              log={log}
                              expanded={expanded === log.id}
                              isUnread={!readAll && unreadIds.has(log.id)}
                              onToggle={() => setExpanded(expanded === log.id ? null : log.id)}
                              onDismiss={dismissLog}
                            />
                          ) : (
                            <LogCard
                              log={log}
                              expanded={expanded === log.id}
                              isUnread={!readAll && unreadIds.has(log.id)}
                              onToggle={() => setExpanded(expanded === log.id ? null : log.id)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              <p style={{ textAlign:"center", fontSize:10, color:"#9AAA9F", fontWeight:500, letterSpacing:"0.04em", marginTop:16 }}>
                Inventix Audit Log · Data diperbarui real-time
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}