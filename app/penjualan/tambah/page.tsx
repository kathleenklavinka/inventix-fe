"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";

const user = { nama: "Andi Pratama", role: "Admin", initials: "AP" };

// ── MOCK STOCK DATA ──
const stokData = [
  { id: 1, nama: "Kopi Arabika",       satuan: "cup",  harga: 45000,  stok: 48 },
  { id: 2, nama: "Cold Brew",          satuan: "cup",  harga: 45000,  stok: 30 },
  { id: 3, nama: "Matcha Latte",       satuan: "cup",  harga: 35000,  stok: 22 },
  { id: 4, nama: "Focaccia Original",  satuan: "pcs",  harga: 25000,  stok: 15 },
  { id: 5, nama: "Croissant Butter",   satuan: "pcs",  harga: 32000,  stok: 20 },
  { id: 6, nama: "Espresso Shot",      satuan: "cup",  harga: 28000,  stok: 60 },
  { id: 7, nama: "Caramel Macchiato", satuan: "cup",  harga: 52000,  stok: 0  },
];

const METODE_OPTIONS = ["QRIS", "Tunai", "Transfer"];
const HARI  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function fmt(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ── ICONS ──
const IconArrowLeft = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconPlus = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconTrash = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconCheck = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconAlertTriangle = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconReceipt = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconChevronDown = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconPackage = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

interface LineItem {
  uid: number;
  barangId: number | null;
  jumlah: number;
  error: string;
}

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-3xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

export default function TambahPenjualanPage() {
  const [mounted, setMounted] = useState(false);
  const [tanggal, setTanggal] = useState("");

  // Form state
  const [lines, setLines] = useState<LineItem[]>([
    { uid: Date.now(), barangId: null, jumlah: 1, error: "" },
  ]);
  const [metode, setMetode] = useState("QRIS");
  const [catatan, setCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    const now = new Date();
    setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    setTimeout(() => setMounted(true), 80);
  }, []);

  // ── LINE HELPERS ──
  function updateLine(uid: number, patch: Partial<LineItem>) {
    setLines(prev =>
      prev.map(l => {
        if (l.uid !== uid) return l;
        const updated = { ...l, ...patch };
        // revalidate on change
        if ("jumlah" in patch || "barangId" in patch) {
          const barang = stokData.find(s => s.id === (updated.barangId ?? -1));
          if (barang && updated.jumlah > barang.stok) {
            updated.error = `Stok tersedia hanya ${barang.stok} ${barang.satuan}`;
          } else {
            updated.error = "";
          }
        }
        return updated;
      })
    );
  }

  function addLine() {
    setLines(prev => [...prev, { uid: Date.now(), barangId: null, jumlah: 1, error: "" }]);
  }

  function removeLine(uid: number) {
    setLines(prev => prev.filter(l => l.uid !== uid));
  }

  // ── SUMMARY ──
  const lineDetails = lines.map(l => {
    const barang = stokData.find(s => s.id === l.barangId);
    return { ...l, barang, subtotal: barang ? barang.harga * l.jumlah : 0 };
  });
  const grandTotal = lineDetails.reduce((a, b) => a + b.subtotal, 0);
  const hasError   = lines.some(l => l.error !== "");
  const hasEmpty   = lines.some(l => l.barangId === null);

  // ── SUBMIT ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");

    if (hasEmpty) { setGlobalError("Pilih barang untuk semua baris item."); return; }
    if (hasError)  { setGlobalError("Perbaiki error stok sebelum menyimpan."); return; }
    if (lines.length === 0) { setGlobalError("Tambahkan minimal satu item."); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900)); // simulate API
    setSubmitting(false);
    setSubmitted(true);
  }

  // ── USED BARANG IDS (prevent duplicate rows) ──
  const usedIds = lines.map(l => l.barangId).filter(Boolean) as number[];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0}to{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)} }
        @keyframes blob    { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.07)} 66%{transform:translate(-25px,25px) scale(0.95)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes rowIn   { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes successPop { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }

        .anim-fade-up { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both }
        .d50{animation-delay:.05s} .d100{animation-delay:.10s} .d150{animation-delay:.15s}
        .d200{animation-delay:.20s} .d250{animation-delay:.25s} .d300{animation-delay:.30s}
        .d350{animation-delay:.35s} .d400{animation-delay:.40s}

        .blob  { animation: blob 9s ease-in-out infinite }
        .blob2 { animation: blob 12s ease-in-out infinite reverse; animation-delay:3s }

        .row-in { animation: rowIn 0.3s cubic-bezier(.22,1,.36,1) both }
        .success-pop { animation: successPop 0.5s cubic-bezier(.22,1,.36,1) both }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: rgba(80,65,40,0.50);
          margin-bottom: 7px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .field-input {
          width: 100%;
          border: 1.5px solid rgba(33,33,33,0.12);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          background: rgba(255,255,255,0.75);
          color: #212121;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .field-input:focus {
          border-color: rgba(42,31,8,0.35);
          box-shadow: 0 0 0 3px rgba(42,31,8,0.07);
        }
        .field-input.error {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
        }
        .field-select {
          appearance: none;
          -webkit-appearance: none;
          background-image: none;
          cursor: pointer;
        }

        .btn-primary {
          background: #2a1f08; color: #ffffff; border: none; border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;
          padding: 11px 22px; font-size: 13px; cursor: pointer; letter-spacing: .01em;
          transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s, background .18s;
          display: inline-flex; align-items: center; gap: 7px;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 10px 28px rgba(42,31,8,.25);
          background: #3d2e0e;
        }
        .btn-primary:active:not(:disabled) { transform: scale(0.97) }
        .btn-primary:disabled { opacity: .5; cursor: not-allowed }

        .btn-ghost {
          background: rgba(33,33,33,0.06); color: #212121; border: none; border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          padding: 8px 15px; font-size: 12px; cursor: pointer;
          transition: background .18s, transform .2s;
          display: inline-flex; align-items: center; gap: 5px;
        }
        .btn-ghost:hover { background: rgba(33,33,33,0.11); transform: scale(1.02) }

        .btn-icon-danger {
          background: rgba(220,38,38,0.07); border: none; border-radius: 9px;
          width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: background .18s, transform .2s;
        }
        .btn-icon-danger:hover { background: rgba(220,38,38,0.14); transform: scale(1.08) }
        .btn-icon-danger:disabled { opacity: .3; cursor: default; transform: none }

        .btn-add-line {
          background: transparent; border: 1.5px dashed rgba(42,31,8,0.22); border-radius: 12px;
          padding: 10px 18px; font-size: 12px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: rgba(42,31,8,0.55); cursor: pointer; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: border-color .2s, color .2s, background .2s, transform .2s;
        }
        .btn-add-line:hover {
          border-color: rgba(42,31,8,0.45); color: #2a1f08;
          background: rgba(42,31,8,0.04); transform: scale(1.01);
        }

        .card {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(33,33,33,0.08);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(33,33,33,0.07), inset 0 1px 0 rgba(255,255,255,0.95);
        }

        .line-row {
          background: rgba(249,247,242,0.70);
          border: 1.5px solid rgba(200,180,130,0.16);
          border-radius: 14px;
          padding: 14px 16px;
          transition: border-color .2s, box-shadow .2s;
        }
        .line-row:hover { border-color: rgba(200,180,130,0.32); box-shadow: 0 4px 14px rgba(42,31,8,0.06) }
        .line-row.has-error { border-color: rgba(220,38,38,0.35) !important }

        .stok-pill {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 10px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 3px 9px; border-radius: 20px;
        }
        .stok-pill.ok   { background: #CFDECA; color: #2d6a3f }
        .stok-pill.low  { background: #EFF0A3; color: #92650a }
        .stok-pill.zero { background: #fee2e2; color: #dc2626 }

        .summary-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 0; border-bottom: 1px solid rgba(33,33,33,0.06);
          font-size: 12px; color: rgba(33,33,33,0.55);
        }
        .summary-row:last-of-type { border-bottom: none }
        .summary-row .val { font-weight: 700; color: #212121; font-family: 'Plus Jakarta Sans', sans-serif }

        .error-msg {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: #dc2626; font-weight: 600;
          margin-top: 5px;
        }

        .pill-metode {
          flex: 1; padding: 10px 6px; text-align: center; border-radius: 10px;
          font-size: 12px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; border: none; transition: background .18s, color .18s, transform .15s;
        }
        .pill-metode.active { background: #2a1f08; color: #EFF0A3 }
        .pill-metode:not(.active) { background: rgba(33,33,33,0.06); color: rgba(33,33,33,0.50) }
        .pill-metode:not(.active):hover { background: rgba(33,33,33,0.11); transform: scale(1.03) }

        .spinner {
          width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .toast { animation: slideIn .35s cubic-bezier(.22,1,.36,1) both }

        /* qty input */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0 }
        input[type=number] { -moz-appearance: textfield }
      `}</style>

      <div
        className={`min-h-screen text-[#212121] font-['Inter'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F9F9FA" }}
      >
        <Header hasNotification={false} userInitials={user.initials} />

        <main className="w-full">

          {/* ── HERO ── */}
          <section
            className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12"
            style={{ background: "linear-gradient(160deg, #f5f0e8 0%, #ede8da 45%, #f9f7f2 100%)" }}
          >
            <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full opacity-30 blob pointer-events-none"
              style={{ background: "#e8d5a3", filter: "blur(72px)" }} />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-20 blob2 pointer-events-none"
              style={{ background: "#CFDECA", filter: "blur(60px)" }} />

            <Inner>
              {/* Breadcrumb */}
              <div className="anim-fade-up flex items-center gap-2 mb-5 text-[11px] font-medium"
                style={{ color: "rgba(80,65,40,0.45)" }}>
                <Link href="/dashboard" className="hover:text-[#2a1f08] transition-colors">Dashboard</Link>
                <span>/</span>
                <Link href="/penjualan" className="hover:text-[#2a1f08] transition-colors">Penjualan</Link>
                <span>/</span>
                <span style={{ color: "#2a1f08" }} className="font-semibold">Tambah Transaksi</span>
              </div>

              <div className="anim-fade-up d100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.20em] uppercase mb-1.5 font-medium"
                    style={{ color: "rgba(80,65,40,0.42)" }}>Penjualan</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.2rem] leading-none"
                    style={{ color: "#2a1f08" }}>Tambah Transaksi</h1>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(80,65,40,0.38)" }}>{tanggal}</p>
                </div>
                <Link href="/penjualan">
                  <button className="btn-ghost">
                    <IconArrowLeft size={14} color="rgba(33,33,33,0.55)" />
                    Kembali
                  </button>
                </Link>
              </div>
            </Inner>
          </section>

          {/* ── FORM SECTION ── */}
          <section className="w-full py-10 sm:py-12" style={{ background: "#FFFFFF" }}>
            <Inner>

              {/* SUCCESS STATE */}
              {submitted ? (
                <div className="success-pop card p-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: "#CFDECA" }}>
                    <IconCheck size={28} color="#2d6a3f" />
                  </div>
                  <h2 className="font-['Plus_Jakarta_Sans'] font-black text-2xl text-[#212121] mb-2">
                    Transaksi Berhasil Disimpan!
                  </h2>
                  <p className="text-sm mb-1" style={{ color: "rgba(33,33,33,0.50)" }}>
                    Transaksi baru telah ditambahkan ke daftar penjualan.
                  </p>
                  <p className="font-bold text-lg mt-1 mb-7" style={{ color: "#2a1f08" }}>
                    {fmt(grandTotal)}
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <Link href="/penjualan">
                      <button className="btn-ghost">Lihat Semua Penjualan</button>
                    </Link>
                    <button className="btn-primary" onClick={() => {
                      setSubmitted(false);
                      setLines([{ uid: Date.now(), barangId: null, jumlah: 1, error: "" }]);
                      setMetode("QRIS");
                      setCatatan("");
                      setGlobalError("");
                    }}>
                      <IconPlus size={14} color="#ffffff" /> Tambah Lagi
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

                    {/* ── LEFT: ITEMS ── */}
                    <div className="flex flex-col gap-5">

                      {/* Item list card */}
                      <div className="anim-fade-up d100 card p-6">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "#e8dfc8" }}>
                            <IconPackage size={16} color="#7a5c2e" />
                          </div>
                          <div>
                            <h2 className="font-['Plus_Jakarta_Sans'] font-black text-sm text-[#212121] leading-tight">
                              Daftar Item
                            </h2>
                            <p className="text-[10px] mt-0.5" style={{ color: "rgba(33,33,33,0.40)" }}>
                              Tambahkan barang yang terjual
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          {lines.map((line, idx) => {
                            const barang    = stokData.find(s => s.id === line.barangId);
                            const subtotal  = barang ? barang.harga * line.jumlah : 0;
                            const stokLevel = !barang ? null : barang.stok === 0 ? "zero" : barang.stok <= 5 ? "low" : "ok";

                            return (
                              <div key={line.uid} className={`line-row row-in ${line.error ? "has-error" : ""}`}>

                                {/* Row header */}
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-[10px] font-bold uppercase tracking-widest"
                                    style={{ color: "rgba(80,65,40,0.38)" }}>
                                    Item {idx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn-icon-danger"
                                    disabled={lines.length === 1}
                                    onClick={() => removeLine(line.uid)}
                                    title="Hapus item"
                                  >
                                    <IconTrash size={13} color="#dc2626" />
                                  </button>
                                </div>

                                {/* Barang select */}
                                <div className="mb-3">
                                  <label className="field-label">Nama Barang</label>
                                  <div className="relative">
                                    <select
                                      className={`field-input field-select pr-9 ${line.error ? "error" : ""}`}
                                      value={line.barangId ?? ""}
                                      onChange={e => {
                                        const val = e.target.value === "" ? null : Number(e.target.value);
                                        updateLine(line.uid, { barangId: val, jumlah: 1 });
                                      }}
                                    >
                                      <option value="">— Pilih barang —</option>
                                      {stokData.map(s => (
                                        <option
                                          key={s.id}
                                          value={s.id}
                                          disabled={s.stok === 0 || (usedIds.includes(s.id) && line.barangId !== s.id)}
                                        >
                                          {s.nama} ({s.stok === 0 ? "Stok habis" : `${s.stok} ${s.satuan}`}) — {fmt(s.harga)}
                                        </option>
                                      ))}
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                      style={{ color: "rgba(33,33,33,0.35)" }}>
                                      <IconChevronDown size={14} />
                                    </span>
                                  </div>
                                </div>

                                {/* Jumlah + stok info */}
                                <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                                  <div>
                                    <label className="field-label">Jumlah</label>
                                    <input
                                      type="number"
                                      min={1}
                                      max={barang?.stok ?? 9999}
                                      className={`field-input ${line.error ? "error" : ""}`}
                                      value={line.jumlah}
                                      onChange={e => {
                                        const val = Math.max(1, parseInt(e.target.value) || 1);
                                        updateLine(line.uid, { jumlah: val });
                                      }}
                                      disabled={!barang}
                                    />
                                  </div>
                                  <div className="pb-0.5 flex flex-col items-end gap-1.5">
                                    {barang && stokLevel && (
                                      <span className={`stok-pill ${stokLevel}`}>
                                        Stok: {barang.stok} {barang.satuan}
                                      </span>
                                    )}
                                    {subtotal > 0 && (
                                      <span className="text-xs font-black" style={{ color: "#2a1f08" }}>
                                        {fmt(subtotal)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Error */}
                                {line.error && (
                                  <div className="error-msg mt-2">
                                    <IconAlertTriangle size={13} color="#dc2626" />
                                    {line.error}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Add line button */}
                        <button type="button" className="btn-add-line mt-3" onClick={addLine}>
                          <IconPlus size={13} color="rgba(42,31,8,0.55)" />
                          Tambah Item Lain
                        </button>
                      </div>

                      {/* Catatan card */}
                      <div className="anim-fade-up d200 card p-6">
                        <label className="field-label" style={{ marginBottom: "8px", display: "block" }}>
                          Catatan <span className="normal-case font-normal tracking-normal"
                            style={{ color: "rgba(33,33,33,0.35)" }}>(opsional)</span>
                        </label>
                        <textarea
                          className="field-input resize-none"
                          rows={3}
                          placeholder="Catatan tambahan untuk transaksi ini…"
                          value={catatan}
                          onChange={e => setCatatan(e.target.value)}
                          style={{ paddingTop: "10px", paddingBottom: "10px" }}
                        />
                      </div>
                    </div>

                    {/* ── RIGHT: SUMMARY + METODE ── */}
                    <div className="flex flex-col gap-5">

                      {/* Metode pembayaran */}
                      <div className="anim-fade-up d150 card p-6">
                        <h2 className="font-['Plus_Jakarta_Sans'] font-black text-sm text-[#212121] mb-4">
                          Metode Pembayaran
                        </h2>
                        <div className="flex gap-2">
                          {METODE_OPTIONS.map(m => (
                            <button
                              key={m}
                              type="button"
                              className={`pill-metode ${metode === m ? "active" : ""}`}
                              onClick={() => setMetode(m)}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Order summary */}
                      <div className="anim-fade-up d200 card p-6">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "#D8DFE9" }}>
                            <IconReceipt size={15} color="#2a3a52" />
                          </div>
                          <h2 className="font-['Plus_Jakarta_Sans'] font-black text-sm text-[#212121]">
                            Ringkasan Order
                          </h2>
                        </div>

                        <div>
                          {lineDetails.map((l, i) => (
                            l.barang ? (
                              <div key={l.uid} className="summary-row">
                                <span className="font-medium text-[11px] truncate max-w-[130px]" title={l.barang.nama}>
                                  {l.barang.nama} ×{l.jumlah}
                                </span>
                                <span className="val text-[11px]">{fmt(l.subtotal)}</span>
                              </div>
                            ) : null
                          ))}

                          {lineDetails.every(l => !l.barang) && (
                            <p className="text-[11px] text-center py-4" style={{ color: "rgba(33,33,33,0.30)" }}>
                              Belum ada item dipilih
                            </p>
                          )}
                        </div>

                        {/* Divider + total */}
                        <div className="mt-3 pt-3" style={{ borderTop: "2px solid rgba(33,33,33,0.08)" }}>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider"
                              style={{ color: "rgba(33,33,33,0.40)" }}>Total</span>
                            <span className="font-['Plus_Jakarta_Sans'] font-black text-xl"
                              style={{ color: "#2a1f08" }}>
                              {fmt(grandTotal)}
                            </span>
                          </div>
                          <p className="text-[10px] mt-1 text-right" style={{ color: "rgba(33,33,33,0.30)" }}>
                            via {metode}
                          </p>
                        </div>
                      </div>

                      {/* Global error */}
                      {globalError && (
                        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
                          style={{ background: "#fee2e2", border: "1px solid rgba(220,38,38,0.2)" }}>
                          <IconAlertTriangle size={14} color="#dc2626" />
                          <p className="text-xs font-semibold text-red-600">{globalError}</p>
                        </div>
                      )}

                      {/* Submit */}
                      <div className="anim-fade-up d300 flex flex-col gap-2">
                        <button
                          type="submit"
                          className="btn-primary w-full justify-center"
                          disabled={submitting || hasError || hasEmpty || lines.length === 0}
                          style={{ padding: "13px 22px", fontSize: "14px" }}
                        >
                          {submitting ? (
                            <><span className="spinner" /> Menyimpan…</>
                          ) : (
                            <><IconCheck size={15} color="#fff" /> Simpan Transaksi</>
                          )}
                        </button>
                        <Link href="/penjualan" className="w-full">
                          <button type="button" className="btn-ghost w-full justify-center">Batal</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              )}

            </Inner>
          </section>

          {/* ── STAT BAR ── */}
          <section className="w-full py-5 sm:py-6" style={{ background: "#212121" }}>
            <Inner>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-[11px] font-medium" style={{ color: "rgba(249,249,250,0.35)" }}>
                  Tambah transaksi baru ke sistem penjualan
                </p>
                <p className="text-[10px] font-medium" style={{ color: "rgba(249,249,250,0.18)" }}>
                  Inventix v1.0 · Penjualan / Tambah
                </p>
              </div>
            </Inner>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}