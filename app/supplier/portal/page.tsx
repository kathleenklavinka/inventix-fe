"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { api } from "@/lib/api";

// Types
type POStatus = "menunggu" | "dikonfirmasi" | "ditolak";

interface POItem {
  nama: string;
  jumlah: number;
  satuan: string;
  harga: number;
}

interface PurchaseOrder {
  id: number;
  noPO: string;
  tanggal: string;
  dibuatOleh: string;
  items: POItem[];
  status: POStatus;
  catatan?: string;
}

const HARI  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function fmt(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
function fmtDate(iso: string) {
  if (!iso) return "–";
  const d = new Date(iso);
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

//Icons
const IconCheck  = ({ size=14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconX      = ({ size=14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconBox    = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IconClock  = ({ size=14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconUser   = ({ size=14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconLogout = ({ size=14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconNote   = ({ size=14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;

// Status Badge
function StatusBadge({ status }: { status: POStatus }) {
  const map = {
    menunggu:     { bg: "#EFF0A3", color: "#2a1f08", icon: <IconClock size={9} />,  label: "Menunggu" },
    dikonfirmasi: { bg: "#CFDECA", color: "#2d6a3f", icon: <IconCheck size={9} />,  label: "Dikonfirmasi" },
    ditolak:      { bg: "#fee2e2", color: "#dc2626", icon: <IconX size={9} />,       label: "Ditolak" },
  };
  const s = map[status];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg"
      style={{ background: s?.bg || "#EFF0A3", color: s?.color || "#2a1f08" }}>
      {s?.icon || <IconClock size={9} />} {s?.label || "Menunggu"}
    </span>
  );
}

// Main Page
export default function SupplierPortal() {
  const LOGO_URL   = "/logo-inventix.png";

  const [mounted, setMounted]     = useState(false);
  const [tanggal, setTanggal]     = useState("");
  const [poList, setPOList]       = useState<PurchaseOrder[]>([]);
  const [activeTab, setActiveTab] = useState<"semua" | POStatus>("semua");
  const [expandId, setExpandId]   = useState<number | null>(null);
  const [modal, setModal]         = useState<{ po: PurchaseOrder; action: "konfirmasi" | "tolak" } | null>(null);
  const [toast, setToast]         = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading]     = useState(true);

  const [supplierRecord, setSupplierRecord] = useState<any>(null);
  const [supplierName, setSupplierName]     = useState("Supplier");
  const [errorMsg, setErrorMsg]             = useState("");

  const loadPortalData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. Get current logged in user profile
      const profileRes = await api.akun.profile();
      const profile = profileRes.data;

      // 2. Get all suppliers and find which one is associated with this user ID
      const suppliersRes = await api.supplier.getAll();
      const matchedSup = suppliersRes.data.find((s: any) => s.user_id === profile.id);

      if (!matchedSup) {
        setErrorMsg("Akun pengguna Anda belum terhubung dengan data Supplier di database. Hubungi Administrator.");
        setLoading(false);
        return;
      }

      setSupplierRecord(matchedSup);
      setSupplierName(matchedSup.nama);

      // 3. Load all POs
      const poRes = await api.purchaseOrder.getAll();
      // Filter POs belonging to this supplier
      const filteredPOs = poRes.data.filter((p: any) => p.supplier_id === matchedSup.id);

      // Map backend POs to frontend PurchaseOrder structure
      const mapped: PurchaseOrder[] = filteredPOs.map((p: any) => {
        let mappedStatus: POStatus = "menunggu";
        if (p.status_supplier === "DIKONFIRMASI") mappedStatus = "dikonfirmasi";
        if (p.status_supplier === "DITOLAK") mappedStatus = "ditolak";

        return {
          id: p.id,
          noPO: p.nomor_po,
          tanggal: p.tanggal_po || p.dibuat_pada,
          dibuatOleh: "System Admin",
          status: mappedStatus,
          catatan: p.catatan,
          items: (p.detail_po || []).map((d: any) => ({
            nama: d.stok?.nama || "Barang",
            jumlah: d.jumlah_dipesan || 0,
            satuan: "Pcs", // default fallback
            harga: d.harga_satuan || 0
          }))
        };
      });

      setPOList(mapped);
    } catch (err: any) {
      console.error("Gagal memuat portal supplier:", err);
      setErrorMsg(err.message || "Gagal memuat data portal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const now = new Date();
    setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    loadPortalData();
    setTimeout(() => setMounted(true), 80);
  }, []);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  const handleAction = async (po: PurchaseOrder, action: "konfirmasi" | "tolak") => {
    try {
      const statusSupplierVal = action === "konfirmasi" ? "DIKONFIRMASI" : "DITOLAK";
      await api.purchaseOrder.update(po.id, { status_supplier: statusSupplierVal });

      setPOList(prev => prev.map(p =>
        p.id === po.id
          ? { ...p, status: action === "konfirmasi" ? "dikonfirmasi" : "ditolak" }
          : p
      ));
      setModal(null);
      setExpandId(null);
      setToast({
        msg: action === "konfirmasi"
          ? `${po.noPO} berhasil dikonfirmasi.`
          : `${po.noPO} ditolak.`,
        type: action === "konfirmasi" ? "success" : "error",
      });
    } catch (err: any) {
      setToast({ msg: err.message || "Gagal mengupdate status PO.", type: "error" });
    }
  };

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("role", { path: "/" });
    Cookies.remove("user_name", { path: "/" });
    window.location.href = "/auth/login";
  };

  const tabs: { key: "semua" | POStatus; label: string }[] = [
    { key: "semua",        label: "Semua" },
    { key: "menunggu",     label: "Menunggu" },
    { key: "dikonfirmasi", label: "Dikonfirmasi" },
    { key: "ditolak",      label: "Ditolak" },
  ];

  const filtered = activeTab === "semua"
    ? poList
    : poList.filter(p => p.status === activeTab);

  const stats = {
    total:        poList.length,
    menunggu:     poList.filter(p => p.status === "menunggu").length,
    dikonfirmasi: poList.filter(p => p.status === "dikonfirmasi").length,
    ditolak:      poList.filter(p => p.status === "ditolak").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(32px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes blob {
          0%,100%{ transform:translate(0,0) scale(1); }
          33%    { transform:translate(30px,-20px) scale(1.06); }
          66%    { transform:translate(-20px,20px) scale(0.96); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }

        .fade-up   { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
        .d1{animation-delay:.05s} .d2{animation-delay:.10s} .d3{animation-delay:.15s}
        .d4{animation-delay:.20s} .d5{animation-delay:.25s} .d6{animation-delay:.30s}

        .blob  { animation: blob 10s ease-in-out infinite; }
        .blob2 { animation: blob 13s ease-in-out infinite reverse; animation-delay:2s; }

        .po-card {
          background: rgba(255,255,255,0.75);
          border: 1.5px solid rgba(33,33,33,0.09);
          border-radius: 18px;
          backdrop-filter: blur(16px);
          transition: transform .28s cubic-bezier(.22,1,.36,1),
                      box-shadow .28s cubic-bezier(.22,1,.36,1),
                      border-color .2s;
          cursor: pointer;
        }
        .po-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(42,31,8,.10);
          border-color: rgba(42,31,8,.18);
        }

        .tab-pill {
          padding: 6px 16px; border-radius: 999px; font-size: 11px; font-weight: 700;
          cursor: pointer; border: none; transition: all .18s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .tab-pill.on  { background: #2a1f08; color: #EFF0A3; }
        .tab-pill.off { background: rgba(42,31,8,0.08); color: rgba(42,31,8,0.45); }
        .tab-pill.off:hover { background: rgba(42,31,8,0.15); color: #2a1f08; }

        .btn-confirm {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 12px;
          background: #CFDECA; color: #2d6a3f;
          transition: background .18s, transform .2s;
        }
        .btn-confirm:hover { background: #b8deb1; transform: scale(1.03); }

        .btn-reject {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 12px;
          background: rgba(220,38,38,0.08); color: #dc2626;
          transition: background .18s, transform .2s;
        }
        .btn-reject:hover { background: rgba(220,38,38,0.15); transform: scale(1.03); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 12px;
          background: rgba(33,33,33,0.07); color: #212121;
          transition: background .18s, transform .2s;
        }
        .btn-ghost:hover { background: rgba(33,33,33,0.13); transform: scale(1.03); }

        .modal-overlay { animation: fadeIn .18s ease both; }
        .modal-box     { animation: fadeUp .22s cubic-bezier(.22,1,.36,1) both; }
        .toast         { animation: slideIn .32s cubic-bezier(.22,1,.36,1) both; }

        .stat-strip {
          display: flex;
          background: rgba(255,255,255,0.52);
          border: 1px solid rgba(200,180,130,0.22);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(14px);
        }
        .stat-item {
          flex: 1; padding: 14px 18px;
          display: flex; align-items: center; gap: 12px;
          position: relative; transition: background .2s; cursor: default;
        }
        .stat-item:hover { background: rgba(255,255,255,0.70); }
        .stat-item + .stat-item::before {
          content:''; position:absolute; left:0; top:20%; height:60%;
          width:1px; background: rgba(180,155,100,0.20);
        }
        .stat-icon {
          width:36px; height:36px; border-radius:10px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          transition: transform .25s cubic-bezier(.22,1,.36,1);
        }
        .stat-item:hover .stat-icon { transform: scale(1.13) rotate(4deg); }

        .items-table th {
          text-align:left; padding:8px 12px;
          font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
          color:rgba(80,65,40,0.45);
          border-bottom:1px solid rgba(42,31,8,0.08);
        }
        .items-table td {
          padding:9px 12px; font-size:12px;
          border-bottom:1px solid rgba(42,31,8,0.05);
          color:rgba(33,33,33,0.75);
        }
        .items-table tr:last-child td { border-bottom: none; }
        .items-table tr:hover td { background: rgba(42,31,8,0.025); }
      `}</style>

      <div className="min-h-screen font-['Inter'] relative overflow-x-hidden"
        style={{
          background: "#F9F9FA",
          opacity: mounted ? 1 : 0,
          transition: "opacity .4s ease",
        }}>

        {/* HEADER */}
        <header className="sticky top-0 z-40 border-b"
          style={{
            background: "rgba(249,249,250,0.85)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(33,33,33,0.07)",
          }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Logo" className="w-6 h-6 object-contain rounded-md" />
              <span className="font-['Plus_Jakarta_Sans'] font-black tracking-widest text-[11px] text-[#212121]">
                INVENTIX
              </span>
              <span style={{ color: "rgba(33,33,33,0.18)" }}>|</span>
              <span className="font-['Inter'] text-xs font-medium"
                style={{ color: "rgba(33,33,33,0.45)" }}>
                Supplier Portal
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: "rgba(42,31,8,0.06)" }}>
                <IconUser size={12} />
                <span className="text-[11px] font-semibold text-[#2a1f08]">{supplierName}</span>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 text-[11px] font-medium transition-colors"
                style={{ color: "rgba(33,33,33,0.45)" }}
                onMouseOver={e => (e.currentTarget.style.color = "#212121")}
                onMouseOut={e => (e.currentTarget.style.color = "rgba(33,33,33,0.45)")}>
                <IconLogout size={13} /> Keluar
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="relative overflow-hidden pt-14 pb-10"
          style={{ background: "linear-gradient(160deg,#f5f0e8 0%,#ede8da 45%,#f9f7f2 100%)" }}>

          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-30 blob pointer-events-none"
            style={{ background: "#e8d5a3", filter: "blur(64px)" }} />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full opacity-20 blob2 pointer-events-none"
            style={{ background: "#CFDECA", filter: "blur(56px)" }} />

          <div className="max-w-4xl mx-auto px-5 sm:px-8 relative">

            {/* Breadcrumb */}
            <div className="fade-up flex items-center gap-2 mb-5 text-[11px] font-medium"
              style={{ color: "rgba(80,65,40,0.45)" }}>
              <span style={{ color: "#2a1f08" }} className="font-semibold">Supplier Portal</span>
            </div>

            {/* Title */}
            <div className="fade-up d1 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] tracking-[0.20em] uppercase mb-1.5 font-medium"
                  style={{ color: "rgba(80,65,40,0.42)" }}>Purchase Order</p>
                <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2rem] leading-none"
                  style={{ color: "#2a1f08" }}>
                  Daftar PO Masuk
                </h1>
                <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(80,65,40,0.38)" }}>
                  {tanggal}
                </p>
              </div>
            </div>

            {/* Stat Strip */}
            <div className="fade-up d2 stat-strip">
              {[
                { label: "Total PO",       val: stats.total,        bg: "#e8dfc8", color: "#2a1f08", icon: <IconBox size={16} /> },
                { label: "Menunggu",       val: stats.menunggu,     bg: "#EFF0A3", color: "#92650a", icon: <IconClock size={15} /> },
                { label: "Dikonfirmasi",   val: stats.dikonfirmasi, bg: "#CFDECA", color: "#2d6a3f", icon: <IconCheck size={15} /> },
                { label: "Ditolak",        val: stats.ditolak,      bg: "#fee2e2", color: "#dc2626", icon: <IconX size={15} /> },
              ].map((s, i) => (
                <div key={i} className="stat-item">
                  <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                  <div>
                    <p className="font-['Plus_Jakarta_Sans'] font-black text-xl leading-none"
                      style={{ color: s.color }}>{s.val}</p>
                    <p className="text-[10px] mt-0.5 font-medium"
                      style={{ color: "rgba(80,65,40,0.45)" }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Menunggu banner */}
            {stats.menunggu > 0 && (
              <div className="fade-up d3 mt-3 flex items-center gap-3 px-4 py-3 rounded-2xl border"
                style={{ background: "rgba(239,240,163,0.6)", borderColor: "rgba(212,168,67,0.30)" }}>
                <span style={{ color: "#92650a" }}><IconClock size={15} /></span>
                <p className="text-xs font-medium" style={{ color: "#92650a" }}>
                  Ada <span className="font-bold">{stats.menunggu} PO</span> yang menunggu konfirmasi Anda.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* PO LIST */}
        <section className="py-10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">

            {/* Tabs */}
            <div className="fade-up d3 flex items-center gap-2 flex-wrap mb-6">
              {tabs.map(t => (
                <button key={t.key}
                  className={`tab-pill ${activeTab === t.key ? "on" : "off"}`}
                  onClick={() => setActiveTab(t.key)}>
                  {t.label}
                  {t.key !== "semua" && (
                    <span className="ml-1 opacity-60">
                      ({t.key === "menunggu" ? stats.menunggu
                        : t.key === "dikonfirmasi" ? stats.dikonfirmasi
                        : stats.ditolak})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Error view */}
            {errorMsg && (
              <div className="fade-up p-5 text-center border rounded-2xl"
                style={{ borderColor: "#fee2e2", background: "#fef2f2" }}>
                <p className="text-sm font-semibold" style={{ color: "#991b1b" }}>{errorMsg}</p>
                <button onClick={loadPortalData} className="btn-ghost mt-4 font-bold">
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Loading view */}
            {loading && !errorMsg && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <span className="animate-spin border-4 border-t-transparent border-[#2a1f08] rounded-full w-8 h-8" />
                <p className="text-sm font-bold text-[#2a1f08] animate-pulse">Memuat PO untuk supplier...</p>
              </div>
            )}

            {/* PO Cards */}
            {!loading && !errorMsg && (
              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <div className="fade-up text-center py-16 text-sm"
                    style={{ color: "rgba(33,33,33,0.35)" }}>
                    Tidak ada PO pada kategori ini.
                  </div>
                ) : filtered.map((po, idx) => {
                  const totalPO = po.items.reduce((s, i) => s + i.harga * i.jumlah, 0);
                  const isOpen  = expandId === po.id;

                  return (
                    <div key={po.id}
                      className={`po-card fade-up`}
                      style={{ animationDelay: `${idx * 0.06}s` }}
                      onClick={() => setExpandId(isOpen ? null : po.id)}>

                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(42,31,8,0.07)", color: "#2a1f08" }}>
                            <IconNote size={15} />
                          </div>
                          <div>
                            <p className="font-['Plus_Jakarta_Sans'] font-black text-sm text-[#212121]">
                              {po.noPO}
                            </p>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-[11px] font-medium flex items-center gap-1"
                                style={{ color: "rgba(33,33,33,0.45)" }}>
                                <IconUser size={11} /> {po.dibuatOleh}
                              </span>
                              <span className="text-[11px] font-medium flex items-center gap-1"
                                style={{ color: "rgba(33,33,33,0.45)" }}>
                                <IconClock size={11} /> {fmtDate(po.tanggal)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <StatusBadge status={po.status} />
                          <p className="font-['Plus_Jakarta_Sans'] font-black text-sm"
                            style={{ color: "#2a1f08" }}>
                            {fmt(totalPO)}
                          </p>
                        </div>
                      </div>

                      {/* Expand: item table + actions */}
                      {isOpen && (
                        <div onClick={e => e.stopPropagation()}
                          style={{ borderTop: "1px solid rgba(42,31,8,0.07)" }}>

                          {/* Items table */}
                          <div className="px-5 py-4">
                            <p className="text-[10px] font-bold tracking-widest uppercase mb-3"
                              style={{ color: "rgba(80,65,40,0.42)" }}>
                              Detail Barang
                            </p>
                            <div className="rounded-xl overflow-hidden border"
                              style={{ borderColor: "rgba(42,31,8,0.08)" }}>
                              <table className="w-full items-table">
                                <thead>
                                  <tr style={{ background: "rgba(42,31,8,0.03)" }}>
                                    <th>Nama Barang</th>
                                    <th>Jumlah</th>
                                    <th>Harga Satuan</th>
                                    <th>Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {po.items.map((item, i) => (
                                    <tr key={i}>
                                      <td className="font-semibold" style={{ color: "#212121" }}>{item.nama}</td>
                                      <td>{item.jumlah} {item.satuan}</td>
                                      <td>{fmt(item.harga)}</td>
                                      <td className="font-semibold" style={{ color: "#2a1f08" }}>
                                        {fmt(item.harga * item.jumlah)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr style={{ borderTop: "1.5px solid rgba(42,31,8,0.10)", background: "rgba(42,31,8,0.03)" }}>
                                    <td colSpan={3} className="font-bold text-[11px]"
                                      style={{ padding: "10px 12px", color: "rgba(80,65,40,0.55)" }}>
                                      Total
                                    </td>
                                    <td className="font-['Plus_Jakarta_Sans'] font-black text-sm"
                                      style={{ padding: "10px 12px", color: "#2a1f08" }}>
                                      {fmt(totalPO)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>

                            {/* Catatan */}
                            {po.catatan && (
                              <div className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl"
                                style={{ background: "rgba(42,31,8,0.04)", border: "1px solid rgba(42,31,8,0.07)" }}>
                                <IconNote size={12} />
                                <p className="text-[11px] font-medium" style={{ color: "rgba(42,31,8,0.65)" }}>
                                  {po.catatan}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action buttons — only if menunggu */}
                          {po.status === "menunggu" && (
                            <div className="px-5 pb-5 flex items-center gap-3">
                              <button className="btn-confirm"
                                onClick={() => setModal({ po, action: "konfirmasi" })}>
                                <IconCheck size={13} /> Konfirmasi PO
                              </button>
                              <button className="btn-reject"
                                onClick={() => setModal({ po, action: "tolak" })}>
                                <IconX size={13} /> Tolak PO
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM BAR */}
        <div className="w-full py-5" style={{ background: "#212121" }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {[
                { val: `${stats.total} PO`,          label: "Total" },
                { val: `${stats.menunggu}`,           label: "Menunggu", danger: stats.menunggu > 0 },
                { val: `${stats.dikonfirmasi}`,       label: "Dikonfirmasi" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-6" style={{ display: "flex" }}>
                  {i > 0 && <div className="w-px h-7 hidden sm:block" style={{ background: "rgba(249,249,250,0.08)", margin: "0 15px" }} />}
                  <div className="text-center cursor-default">
                    <p className={`font-['Plus_Jakarta_Sans'] font-black text-base ${s.danger ? "text-yellow-400" : "text-[#F9F9FA]"}`}>{s.val}</p>
                    <p className="text-[9px] font-medium mt-0.5" style={{ color: "rgba(249,249,250,0.28)" }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] font-medium" style={{ color: "rgba(249,249,250,0.18)" }}>
              Inventix v1.0 · Supplier Portal
            </p>
          </div>
        </div>

        {/* MODAL */}
        {modal && (
          <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(33,33,33,0.45)", backdropFilter: "blur(8px)" }}
            onClick={() => setModal(null)}>
            <div className="modal-box w-full max-w-sm p-6 border"
              style={{ background: "#FFFFFF", borderRadius: "20px", borderColor: "rgba(33,33,33,0.08)", boxShadow: "0 24px 64px rgba(33,33,33,0.18)" }}
              onClick={e => e.stopPropagation()}>

              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: modal.action === "konfirmasi" ? "#CFDECA" : "#fee2e2" }}>
                {modal.action === "konfirmasi"
                  ? <IconCheck size={20} />
                  : <IconX size={20} />}
              </div>

              <h2 className="font-['Plus_Jakarta_Sans'] font-black text-lg text-[#212121] mb-1.5">
                {modal.action === "konfirmasi" ? "Konfirmasi PO?" : "Tolak PO?"}
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(33,33,33,0.55)" }}>
                {modal.action === "konfirmasi"
                  ? <>PO <span className="font-semibold text-[#212121]">{modal.po.noPO}</span> akan dikonfirmasi dan tidak bisa diubah kembali.</>
                  : <>PO <span className="font-semibold text-[#212121]">{modal.po.noPO}</span> akan ditolak. Pastikan kamu sudah menghubungi tim Inventix.</>
                }
              </p>

              <div className="flex gap-3">
                <button className="btn-ghost flex-1 justify-center" onClick={() => setModal(null)}>
                  Batal
                </button>
                <button
                  className={modal.action === "konfirmasi" ? "btn-confirm flex-1 justify-center" : "btn-reject flex-1 justify-center"}
                  style={{ padding: "10px 20px", fontSize: "13px" }}
                  onClick={() => handleAction(modal.po, modal.action)}>
                  {modal.action === "konfirmasi"
                    ? <><IconCheck size={13} /> Ya, Konfirmasi</>
                    : <><IconX size={13} /> Ya, Tolak</>
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className="toast fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 shadow-2xl border"
            style={{
              background: toast.type === "success" ? "#CFDECA" : "#fee2e2",
              borderColor: "rgba(255,255,255,0.7)",
              borderRadius: "14px",
              minWidth: "260px",
            }}>
            <span className="flex-shrink-0">
              {toast.type === "success"
                ? <IconCheck size={14} />
                : <IconX size={14} />}
            </span>
            <p className="text-xs font-semibold text-[#212121]">{toast.msg}</p>
          </div>
        )}
      </div>
    </>
  );
}