"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { COOKIE_NAME } from "@/lib/auth";
import { api } from "@/lib/api";

const METODE_OPTIONS = ["QRIS", "Tunai", "Transfer"];
const HARI  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function fmt(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

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

  const [lines, setLines] = useState<LineItem[]>([
    { uid: Date.now(), barangId: null, jumlah: 1, error: "" },
  ]);
  const [metode, setMetode] = useState("QRIS");
  const [catatan, setCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const [userInitials, setUserInitials] = useState("AP");
  const [stokData, setStokData] = useState<any[]>([]);

  useEffect(() => {
    const name = Cookies.get(COOKIE_NAME) || "Andi Pratama";
    setUserInitials(decodeURIComponent(name).split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase());

    const loadStok = async () => {
      try {
        const res = await api.stok.getAll();
        const mapped = res.data.map((item: any) => ({
          id: item.id,
          nama: item.nama,
          satuan: item.satuan,
          harga: item.harga || 15000,
          stok: item.jumlah_saat_ini
        }));
        setStokData(mapped);
      } catch (err) {
        console.error("Gagal memuat stok:", err);
      }
    };

    loadStok();
    const now = new Date();
    setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    setTimeout(() => setMounted(true), 80);
  }, []);

  function updateLine(uid: number, patch: Partial<LineItem>) {
    setLines(prev =>
      prev.map(l => {
        if (l.uid !== uid) return l;
        const updated = { ...l, ...patch };
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

  const lineDetails = lines.map(l => {
    const barang = stokData.find(s => s.id === l.barangId);
    return { ...l, barang, subtotal: barang ? barang.harga * l.jumlah : 0 };
  });
  const grandTotal = lineDetails.reduce((a, b) => a + b.subtotal, 0);
  const hasError   = lines.some(l => l.error !== "");
  const hasEmpty   = lines.some(l => l.barangId === null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");
    if (hasEmpty) { setGlobalError("Pilih barang untuk semua baris item."); return; }
    if (hasError)  { setGlobalError("Perbaiki error stok sebelum menyimpan."); return; }
    if (lines.length === 0) { setGlobalError("Tambahkan minimal satu item."); return; }
    
    setSubmitting(true);
    try {
      await api.pembelianTransaksi.bulkCreate({
        transaksi: lines.map(line => ({
          stok_id: Number(line.barangId),
          jenis: "keluar", // 'keluar' represents a sale transaction reducing stock
          jumlah: Number(line.jumlah),
          detail_po_id: null
        }))
      });
      setSubmitted(true);
    } catch (err: any) {
      setGlobalError(err.message || "Gagal menyimpan transaksi. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  const usedIds = lines.map(l => l.barangId).filter(Boolean) as number[];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0}to{opacity:1} }
        @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.07)} 66%{transform:translate(-25px,25px) scale(0.95)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes rowIn   { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes successPop { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }

        .anim-fade-up { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both }
        .d50{animation-delay:.05s} .d100{animation-delay:.10s} .d150{animation-delay:.15s}
        .d200{animation-delay:.20s} .d250{animation-delay:.25s} .d300{animation-delay:.30s}
        .d350{animation-delay:.35s} .d400{animation-delay:.40s}

        .blob  { animation: blobFloat 10s ease-in-out infinite }
        .blob2 { animation: blobFloat 13s ease-in-out infinite reverse; animation-delay:3s }
        .blob3 { animation: blobFloat 16s ease-in-out infinite; animation-delay:6s }
        .blob4 { animation: blobFloat 11s ease-in-out infinite reverse; animation-delay:1.5s }

        .row-in { animation: rowIn 0.3s cubic-bezier(.22,1,.36,1) both }
        .success-pop { animation: successPop 0.5s cubic-bezier(.22,1,.36,1) both }

        .field-label {
          display: block; font-size: 11px; font-weight: 700; letter-spacing: .07em;
          text-transform: uppercase; color: rgba(74,69,48,0.50); margin-bottom: 7px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .field-input {
          width: 100%; border: 1.5px solid rgba(249,229,90,0.45); border-radius: 12px;
          padding: 10px 14px; font-size: 13px; font-family: 'Inter', sans-serif;
          background: rgba(255,255,255,0.85); color: #4A4530; outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .field-input:focus { border-color: #F9E55A; box-shadow: 0 0 0 3px rgba(249,229,90,0.20) }
        .field-input.error { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.08) }
        .field-select { appearance: none; -webkit-appearance: none; background-image: none; cursor: pointer }

        .btn-primary {
          background: #F9E55A; color: #4A4530; border: none; border-radius: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800;
          padding: 10px 22px; font-size: 13px; cursor: pointer; letter-spacing: .01em;
          transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s, background .18s;
          display: inline-flex; align-items: center; gap: 7px;
          box-shadow: 0 4px 18px rgba(249,229,90,0.45);
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px) scale(1.04); box-shadow: 0 10px 28px rgba(249,229,90,.55); background: #fded6b }
        .btn-primary:active:not(:disabled) { transform: scale(0.97) }
        .btn-primary:disabled { opacity: .5; cursor: not-allowed }

        .btn-ghost {
          background: rgba(74,69,48,0.07); color: #4A4530; border: none; border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          padding: 8px 15px; font-size: 12px; cursor: pointer;
          transition: background .18s, transform .2s;
          display: inline-flex; align-items: center; gap: 5px;
        }
        .btn-ghost:hover { background: rgba(74,69,48,0.13); transform: scale(1.02) }

        .btn-icon-danger {
          background: rgba(220,38,38,0.07); border: none; border-radius: 9px;
          width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: background .18s, transform .2s;
        }
        .btn-icon-danger:hover { background: rgba(220,38,38,0.14); transform: scale(1.08) }
        .btn-icon-danger:disabled { opacity: .3; cursor: default; transform: none }

        .btn-add-line {
          background: transparent; border: 1.5px dashed rgba(74,69,48,0.22); border-radius: 12px;
          padding: 10px 18px; font-size: 12px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: rgba(74,69,48,0.55); cursor: pointer; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: border-color .2s, color .2s, background .2s, transform .2s;
        }
        .btn-add-line:hover { border-color: rgba(249,229,90,0.65); color: #4A4530; background: rgba(249,229,90,0.08); transform: scale(1.01) }

        .card {
          background: rgba(255,255,255,0.85); backdrop-filter: blur(20px);
          border: 1.5px solid rgba(249,229,90,0.28); border-radius: 20px;
          box-shadow: 0 8px 32px rgba(249,229,90,0.10), inset 0 1px 0 rgba(255,255,255,0.95);
        }

        .line-row {
          background: #FFFEF5; border: 1.5px solid rgba(249,229,90,0.22);
          border-radius: 14px; padding: 14px 16px;
          transition: border-color .2s, box-shadow .2s;
        }
        .line-row:hover { border-color: rgba(249,229,90,0.45); box-shadow: 0 4px 14px rgba(249,229,90,0.14) }
        .line-row.has-error { border-color: rgba(220,38,38,0.35) !important }

        .stok-pill {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 10px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 3px 9px; border-radius: 20px;
        }
        .stok-pill.ok   { background: #C5D9C0; color: #2d6640 }
        .stok-pill.low  { background: #FEE2E2; color: #991b1b }
        .stok-pill.zero { background: #FECACA; color: #b91c1c }

        .summary-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 0; border-bottom: 1px solid rgba(249,229,90,0.20);
          font-size: 12px; color: rgba(74,69,48,0.50);
        }
        .summary-row:last-of-type { border-bottom: none }
        .summary-row .val { font-weight: 700; color: #4A4530; font-family: 'Plus Jakarta Sans', sans-serif }

        .error-msg { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #dc2626; font-weight: 600; margin-top: 5px }

        .pill-metode {
          flex: 1; padding: 10px 6px; text-align: center; border-radius: 10px;
          font-size: 12px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; border: none; transition: background .18s, color .18s, transform .15s, box-shadow .18s;
        }
        .pill-metode.active { background: #F9E55A; color: #4A4530; box-shadow: 0 3px 12px rgba(249,229,90,0.50) }
        .pill-metode:not(.active) { background: rgba(74,69,48,0.07); color: rgba(74,69,48,0.45) }
        .pill-metode:not(.active):hover { background: rgba(249,229,90,0.20); transform: scale(1.03) }

        .spinner {
          width: 16px; height: 16px; border: 2.5px solid rgba(74,69,48,0.25);
          border-top-color: #4A4530; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0 }
        input[type=number] { -moz-appearance: textfield }
      `}</style>

      <div
        className={`min-h-screen font-['Inter'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#FFFEF5", color: "#4A4530" }}
      >
        <Header hasNotification={false} userInitials={userInitials} />

        <main className="w-full">

          <section
            className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12"
            style={{ background: "linear-gradient(145deg, #FEFCE8 0%, #FEF9C3 35%, #FFFDE7 65%, #FEFCE8 100%)" }}
          >
            <div className="absolute -top-20 -right-16 w-96 h-96 rounded-full blob pointer-events-none"
              style={{ background: "#FBCFE8", opacity: 0.45, filter: "blur(80px)" }} />
            <div className="absolute top-12 left-10 w-72 h-72 rounded-full blob2 pointer-events-none"
              style={{ background: "#C5D9C0", opacity: 0.50, filter: "blur(70px)" }} />
            <div className="absolute -bottom-10 right-1/3 w-80 h-80 rounded-full blob3 pointer-events-none"
              style={{ background: "#DDD6FE", opacity: 0.38, filter: "blur(85px)" }} />
            <div className="absolute bottom-0 -left-10 w-64 h-64 rounded-full blob4 pointer-events-none"
              style={{ background: "#FEE2E2", opacity: 0.42, filter: "blur(70px)" }} />

            <Inner>
              <div className="anim-fade-up flex items-center gap-2 mb-5 text-[11px] font-semibold"
                style={{ color: "rgba(74,69,48,0.42)" }}>
                <Link href="/dashboard" className="hover:text-[#92661a] transition-colors">Dashboard</Link>
                <span style={{ color: "rgba(74,69,48,0.25)" }}>/</span>
                <Link href="/penjualan" className="hover:text-[#92661a] transition-colors">Penjualan</Link>
                <span style={{ color: "rgba(74,69,48,0.25)" }}>/</span>
                <span style={{ color: "#92661a" }} className="font-semibold">Tambah Transaksi</span>
              </div>

              <div className="anim-fade-up d100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase mb-2 font-bold"
                    style={{ color: "rgba(146,102,26,0.55)" }}>Penjualan</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-3xl sm:text-[2.5rem] leading-none"
                    style={{ color: "#4A4530" }}>Tambah Transaksi</h1>
                  <p className="text-[11px] mt-2 font-medium" style={{ color: "rgba(74,69,48,0.42)" }}>{tanggal}</p>
                </div>
                <Link href="/penjualan">
                  <button className="btn-ghost">
                    <IconArrowLeft size={14} color="rgba(74,69,48,0.55)" />
                    Kembali
                  </button>
                </Link>
              </div>
            </Inner>
          </section>

          <section className="w-full py-10 sm:py-12" style={{ background: "#FFFEF5" }}>
            <Inner>
              {submitted ? (
                <div className="success-pop card p-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: "#C5D9C0" }}>
                    <IconCheck size={28} color="#2d6640" />
                  </div>
                  <h2 className="font-['Plus_Jakarta_Sans'] font-black text-2xl mb-2"
                    style={{ color: "#4A4530" }}>
                    Transaksi Berhasil Disimpan!
                  </h2>
                  <p className="text-sm mb-1" style={{ color: "rgba(74,69,48,0.50)" }}>
                    Transaksi baru telah ditambahkan ke daftar penjualan.
                  </p>
                  <p className="font-['Plus_Jakarta_Sans'] font-black text-lg mt-1 mb-7"
                    style={{ color: "#92661a" }}>
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
                      <IconPlus size={14} color="#4A4530" /> Tambah Lagi
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

                    <div className="flex flex-col gap-5">

                      <div className="anim-fade-up d100 card p-6">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "#FEF9C3" }}>
                            <IconPackage size={16} color="#92661a" />
                          </div>
                          <div>
                            <h2 className="font-['Plus_Jakarta_Sans'] font-black text-sm leading-tight"
                              style={{ color: "#4A4530" }}>
                              Daftar Item
                            </h2>
                            <p className="text-[10px] mt-0.5" style={{ color: "rgba(74,69,48,0.40)" }}>
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
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-[10px] font-bold uppercase tracking-widest"
                                    style={{ color: "rgba(74,69,48,0.38)" }}>
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
                                      style={{ color: "rgba(74,69,48,0.40)" }}>
                                      <IconChevronDown size={14} />
                                    </span>
                                  </div>
                                </div>

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
                                      <span className="text-xs font-black" style={{ color: "#92661a" }}>
                                        {fmt(subtotal)}
                                      </span>
                                    )}
                                  </div>
                                </div>

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

                        <button type="button" className="btn-add-line mt-3" onClick={addLine}>
                          <IconPlus size={13} color="rgba(74,69,48,0.55)" />
                          Tambah Item Lain
                        </button>
                      </div>

                      <div className="anim-fade-up d200 card p-6">
                        <label className="field-label" style={{ marginBottom: "8px", display: "block" }}>
                          Catatan{" "}
                          <span className="normal-case font-normal tracking-normal"
                            style={{ color: "rgba(74,69,48,0.35)" }}>(opsional)</span>
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

                    <div className="flex flex-col gap-5">

                      <div className="anim-fade-up d150 card p-6">
                        <h2 className="font-['Plus_Jakarta_Sans'] font-black text-sm mb-4"
                          style={{ color: "#4A4530" }}>
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

                      <div className="anim-fade-up d200 card p-6">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "#FEF9C3" }}>
                            <IconReceipt size={15} color="#92661a" />
                          </div>
                          <h2 className="font-['Plus_Jakarta_Sans'] font-black text-sm"
                            style={{ color: "#4A4530" }}>
                            Ringkasan Order
                          </h2>
                        </div>

                        <div>
                          {lineDetails.map(l =>
                            l.barang ? (
                              <div key={l.uid} className="summary-row">
                                <span className="font-medium text-[11px] truncate max-w-[130px]" title={l.barang.nama}>
                                  {l.barang.nama} ×{l.jumlah}
                                </span>
                                <span className="val text-[11px]">{fmt(l.subtotal)}</span>
                              </div>
                            ) : null
                          )}
                          {lineDetails.every(l => !l.barang) && (
                            <p className="text-[11px] text-center py-4" style={{ color: "rgba(74,69,48,0.30)" }}>
                              Belum ada item dipilih
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-3" style={{ borderTop: "2px solid rgba(249,229,90,0.25)" }}>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider"
                              style={{ color: "rgba(74,69,48,0.40)" }}>Total</span>
                            <span className="font-['Plus_Jakarta_Sans'] font-black text-xl"
                              style={{ color: "#92661a" }}>
                              {fmt(grandTotal)}
                            </span>
                          </div>
                          <p className="text-[10px] mt-1 text-right" style={{ color: "rgba(74,69,48,0.30)" }}>
                            via {metode}
                          </p>
                        </div>
                      </div>

                      {globalError && (
                        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
                          style={{ background: "#FEE2E2", border: "1px solid rgba(220,38,38,0.20)" }}>
                          <IconAlertTriangle size={14} color="#dc2626" />
                          <p className="text-xs font-semibold" style={{ color: "#dc2626" }}>{globalError}</p>
                        </div>
                      )}

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
                            <><IconCheck size={15} color="#4A4530" /> Simpan Transaksi</>
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

        </main>
        <Footer />
      </div>
    </>
  );
}