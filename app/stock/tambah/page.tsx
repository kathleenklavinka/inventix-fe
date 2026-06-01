"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { COOKIE_NAME } from "@/lib/auth";
import { api } from "@/lib/api";

const SATUAN_OPTIONS = ["kg", "gram", "liter", "ml", "pcs", "botol", "dus", "karton", "lusin", "sak"];

// ── SVG ICONS ──
const IconArrowLeft = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconPlus = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconRefresh = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.36"/>
  </svg>
);

const IconPackage = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconCheckCircle = ({ size = 48, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconInfo = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const IconLoader = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: "spin 1s linear infinite" }}>
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

const IconArrowRight = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconCheck = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconLightbulb = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
);

const IconChevronUp = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

const IconChevronDown = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

function FormField({
  label, required, hint, children, error,
}: { label: string; required?: boolean; hint?: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] sm:text-xs font-bold tracking-[0.07em] uppercase flex items-center gap-1.5"
        style={{ color: "rgba(80,65,40,0.55)" }}>
        {label} {required && <span style={{ color: "#c0392b" }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[10px] font-medium flex items-center gap-1" style={{ color: "rgba(80,65,40,0.38)" }}>
          <IconInfo size={10} color="rgba(80,65,40,0.38)" /> {hint}
        </p>
      )}
      {error && <p className="text-[10px] font-semibold" style={{ color: "#c0392b" }}>{error}</p>}
    </div>
  );
}

export default function TambahStokPage() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ 
    nama: "", 
    jumlah: "", 
    satuan: "kg", 
    klasifikasi_id: "",
    supplier_id: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const namaRef = useRef<HTMLInputElement>(null);

  const [userInitials, setUserInitials] = useState("AP");
  const [kategoriList, setKategoriList] = useState<any[]>([]);
  const [supplierList, setSupplierList] = useState<any[]>([]);

  useEffect(() => {
    const name = Cookies.get(COOKIE_NAME) || "Andi Pratama";
    setUserInitials(decodeURIComponent(name).split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase());

    const loadDropdowns = async () => {
      try {
        const resKat = await api.klasifikasiStok.getAll();
        setKategoriList(resKat.data);
        if (resKat.data.length > 0) {
          setForm(f => ({ ...f, klasifikasi_id: String(resKat.data[0].id) }));
        }

        const resSup = await api.supplier.getAll();
        setSupplierList(resSup.data);
        if (resSup.data.length > 0) {
          setForm(f => ({ ...f, supplier_id: String(resSup.data[0].id) }));
        }
      } catch (err) {
        console.error("Gagal memuat dropdown:", err);
      }
    };

    loadDropdowns();
    setTimeout(() => setMounted(true), 80);
    setTimeout(() => namaRef.current?.focus(), 380);
  }, []);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.nama.trim()) e.nama = "Nama barang wajib diisi.";
    else if (form.nama.trim().length < 2) e.nama = "Nama minimal 2 karakter.";
    if (form.jumlah === "" || isNaN(Number(form.jumlah))) e.jumlah = "Jumlah wajib diisi dengan angka.";
    else if (Number(form.jumlah) < 0) e.jumlah = "Jumlah tidak boleh negatif.";
    if (!form.klasifikasi_id) e.klasifikasi_id = "Kategori wajib dipilih.";
    if (!form.supplier_id) e.supplier_id = "Supplier wajib dipilih.";
    return e;
  }

  function handleChange(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => { const next = { ...e }; delete next[k]; return next; });
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    
    try {
      const sku = "SKU-" + form.nama.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 6) + "-" + Math.floor(100 + Math.random() * 900);
      
      await api.stok.create({
        nama: form.nama,
        kode_sku: sku,
        klasifikasi_id: Number(form.klasifikasi_id),
        supplier_id: Number(form.supplier_id),
        satuan: form.satuan,
        jumlah_saat_ini: Number(form.jumlah),
      });
      
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan barang. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setForm(f => ({
      ...f,
      nama: "",
      jumlah: "",
      satuan: "kg",
    }));
    setErrors({});
    setSuccess(false);
    setTimeout(() => namaRef.current?.focus(), 100);
  }

  const jumlahNum = Number(form.jumlah) || 0;
  const isFormDirty = form.nama || form.jumlah;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blob {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(40px,-30px) scale(1.07); }
          66%      { transform:translate(-25px,25px) scale(0.95); }
        }
        @keyframes checkPop {
          0%   { transform:scale(0) rotate(-10deg); opacity:0; }
          65%  { transform:scale(1.12) rotate(3deg); opacity:1; }
          100% { transform:scale(1) rotate(0); opacity:1; }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes shimmerSlide {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .anim-fade-up { animation:fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .d50 { animation-delay:.05s } .d100 { animation-delay:.10s } .d150 { animation-delay:.15s }
        .d200 { animation-delay:.20s } .d250 { animation-delay:.25s } .d300 { animation-delay:.30s }
        .d350 { animation-delay:.35s } .d400 { animation-delay:.40s }

        .blob  { animation:blob 9s ease-in-out infinite; }
        .blob2 { animation:blob 12s ease-in-out infinite reverse; animation-delay:3s; }

        .form-input {
          width:100%; border:1.5px solid rgba(140,110,60,0.18); border-radius:12px;
          padding:12px 16px; font-size:13.5px;
          background:rgba(255,255,255,0.82);
          color:#2a1f08; outline:none; font-family:'Inter',sans-serif;
          transition:border-color .2s, box-shadow .2s, background .2s;
        }
        .form-input:focus {
          border-color:rgba(80,60,20,0.45);
          box-shadow:0 0 0 4px rgba(80,60,20,0.07);
          background:#fff;
        }
        .form-input.error {
          border-color:rgba(192,57,43,0.50);
          box-shadow:0 0 0 3px rgba(192,57,43,0.07);
        }
        .form-input::placeholder { color:rgba(80,65,40,0.28); }

        .form-select {
          width:100%; border:1.5px solid rgba(140,110,60,0.18); border-radius:12px;
          padding:12px 16px; font-size:13.5px; background:rgba(255,255,255,0.82);
          color:#2a1f08; outline:none; font-family:'Inter',sans-serif; cursor:pointer;
          transition:border-color .2s, box-shadow .2s;
          appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9' stroke='%235a3e1b' stroke-opacity='.45' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right 14px center;
          padding-right:38px;
        }
        .form-select:focus {
          border-color:rgba(80,60,20,0.45);
          box-shadow:0 0 0 4px rgba(80,60,20,0.07);
        }

        .btn-primary {
          background:#2a1f08; color:#fff; border:none; border-radius:12px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:700;
          padding:13px 28px; font-size:13.5px; cursor:pointer;
          transition:transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s, background .18s;
          display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%;
        }
        .btn-primary:hover:not(:disabled) {
          transform:translateY(-2px) scale(1.025);
          box-shadow:0 10px 28px rgba(42,31,8,0.25);
          background:#3d2e0e;
        }
        .btn-primary:active:not(:disabled) { transform:scale(0.97); }
        .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }

        .btn-primary.shimmer {
          background:linear-gradient(90deg,#2a1f08 0%,#5a3e1b 40%,#2a1f08 60%,#2a1f08 100%);
          background-size:200% 100%;
          animation:shimmerSlide 1.4s infinite linear;
        }

        .btn-secondary {
          background:rgba(80,65,40,0.08); color:#2a1f08; border:none; border-radius:12px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;
          padding:13px 28px; font-size:13.5px; cursor:pointer; width:100%;
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          transition:background .18s, transform .2s;
        }
        .btn-secondary:hover { background:rgba(80,65,40,0.14); transform:scale(1.02); }

        .zoom-card {
          transition:transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s;
          will-change:transform;
        }
        .zoom-card:hover { transform:translateY(-2px); box-shadow:0 18px 44px rgba(42,31,8,0.09); }

        .success-check { animation:checkPop 0.5s cubic-bezier(.22,1,.36,1) both; }

        .counter-btn {
          width:22px; height:22px; border-radius:6px; border:none; cursor:pointer;
          display:inline-flex; align-items:center; justify-content:center;
          background:rgba(80,65,40,0.10); color:rgba(80,65,40,0.65);
          transition:background .15s, transform .15s;
        }
        .counter-btn:hover { background:rgba(80,65,40,0.18); transform:scale(1.08); }
      `}</style>

      <div
        className={`min-h-screen text-[#2a1f08] font-['Inter'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F9F9FA" }}>

        <Header hasNotification={false} userInitials={userInitials} />

        <main className="w-full">

          {/* ── HERO ── */}
          <section className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12"
            style={{ background: "linear-gradient(160deg, #f5f0e8 0%, #ede8da 45%, #f9f7f2 100%)" }}>

            <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full opacity-30 blob pointer-events-none"
              style={{ background: "#e8d5a3", filter: "blur(72px)" }} />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-20 blob2 pointer-events-none"
              style={{ background: "#CFDECA", filter: "blur(60px)" }} />

            <Inner className="relative z-10">
              {/* Breadcrumb */}
              <div className="anim-fade-up flex items-center gap-2 mb-6 text-[11px] font-medium"
                style={{ color: "rgba(80,65,40,0.42)" }}>
                <Link href="/dashboard" className="hover:text-[#2a1f08] transition-colors">Dashboard</Link>
                <span>/</span>
                <Link href="/stock" className="hover:text-[#2a1f08] transition-colors">Stok Barang</Link>
                <span>/</span>
                <span style={{ color: "#2a1f08" }} className="font-semibold">Tambah Barang</span>
              </div>

              <div className="anim-fade-up d100">
                <p className="text-[10px] sm:text-[11px] tracking-[0.20em] uppercase mb-1.5 font-medium"
                  style={{ color: "rgba(80,65,40,0.42)" }}>Manajemen · Stok</p>
                <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.2rem] leading-none"
                  style={{ color: "#2a1f08" }}>
                  Tambah Barang
                </h1>
                <p className="text-[12px] mt-2 font-medium" style={{ color: "rgba(80,65,40,0.42)" }}>
                  Isi semua field yang wajib untuk menambahkan item baru ke inventaris.
                </p>
              </div>
            </Inner>
          </section>

          {/* FORM SECTION */}
          <section className="w-full py-10 sm:py-12" style={{ background: "#FFFFFF" }}>
            <Inner>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 items-start">

                {/* MAIN FORM */}
                <div className="sm:col-span-2">
                  {!success ? (
                    <div className="anim-fade-up d150 zoom-card border p-6 sm:p-8"
                      style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(22px)", borderColor: "rgba(140,110,60,0.12)", borderRadius: "20px", boxShadow: "0 8px 32px rgba(42,31,8,0.07)" }}>

                      <div className="flex items-center gap-3 mb-7">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "#e8dfc8" }}>
                          <IconPackage size={18} color="#7a5c2e" />
                        </div>
                        <div>
                          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base" style={{ color: "#2a1f08" }}>
                            Data Barang Baru
                          </h2>
                          <p className="text-[11px] mt-0.5" style={{ color: "rgba(80,65,40,0.40)" }}>
                            Lengkapi semua field yang bertanda *
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Nama */}
                        <div className="sm:col-span-2">
                          <FormField label="Nama Barang" required hint="Nama yang jelas dan spesifik" error={errors.nama}>
                            <input ref={namaRef} className={`form-input${errors.nama ? " error" : ""}`}
                              placeholder="cth: Tepung Terigu Premium"
                              value={form.nama}
                              onChange={e => handleChange("nama", e.target.value)} />
                          </FormField>
                        </div>

                        {/* Jumlah */}
                        <FormField label="Jumlah Stok" required hint="Jumlah awal masuk" error={errors.jumlah}>
                          <div className="relative">
                            <input className={`form-input pr-12${errors.jumlah ? " error" : ""}`}
                              type="number" min="0" placeholder="cth: 50"
                              value={form.jumlah}
                              onChange={e => handleChange("jumlah", e.target.value)} />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                              <button type="button" className="counter-btn"
                                onClick={() => handleChange("jumlah", String(Math.max(0, jumlahNum + 1)))}>
                                <IconChevronUp size={10} />
                              </button>
                              <button type="button" className="counter-btn"
                                onClick={() => handleChange("jumlah", String(Math.max(0, jumlahNum - 1)))}>
                                <IconChevronDown size={10} />
                              </button>
                            </div>
                          </div>
                        </FormField>

                        {/* Satuan */}
                        <FormField label="Satuan" required error={errors.satuan}>
                          <select className="form-select" value={form.satuan}
                            onChange={e => handleChange("satuan", e.target.value)}>
                            {SATUAN_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </FormField>
                        {/* Kategori */}
                        <FormField label="Kategori" required error={errors.klasifikasi_id}>
                          <select className="form-select" value={form.klasifikasi_id}
                            onChange={e => handleChange("klasifikasi_id", e.target.value)}>
                            <option value="">— Pilih Kategori —</option>
                            {kategoriList.map(k => <option key={k.id} value={k.id}>{k.jenis}</option>)}
                          </select>
                        </FormField>

                        {/* Supplier */}
                        <FormField label="Supplier" required error={errors.supplier_id}>
                          <select className="form-select" value={form.supplier_id}
                            onChange={e => handleChange("supplier_id", e.target.value)}>
                            <option value="">— Pilih Supplier —</option>
                            {supplierList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                          </select>
                        </FormField>
                      </div>

                      <div className="my-6" style={{ height: "1px", background: "rgba(140,110,60,0.10)" }} />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button className="btn-secondary" type="button" onClick={handleReset}
                          style={{ opacity: isFormDirty ? 1 : 0.45 }}>
                          <IconRefresh size={14} color="#2a1f08" /> Reset Form
                        </button>
                        <button className={`btn-primary${submitting ? " shimmer" : ""}`} type="button"
                          disabled={submitting} onClick={handleSubmit}>
                          {submitting
                            ? <><IconLoader size={15} color="#fff" /> Menyimpan…</>
                            : <><IconPlus size={15} color="#fff" /> Tambah Barang</>}
                        </button>
                      </div>
                    </div>

                  ) : (

                    <div className="anim-fade-up zoom-card border p-8 sm:p-10 flex flex-col items-center text-center"
                      style={{ background: "rgba(207,222,202,0.22)", backdropFilter: "blur(22px)", borderColor: "rgba(207,222,202,0.55)", borderRadius: "20px", boxShadow: "0 8px 32px rgba(42,31,8,0.07)" }}>
                      <div className="success-check w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: "#CFDECA" }}>
                        <IconCheckCircle size={36} color="#2d6a3f" />
                      </div>
                      <h2 className="font-['Plus_Jakarta_Sans'] font-black text-xl sm:text-2xl mb-2" style={{ color: "#2a1f08" }}>
                        Barang Berhasil Ditambahkan!
                      </h2>
                      <p className="text-sm mb-1.5" style={{ color: "rgba(80,65,40,0.60)" }}>
                        <span className="font-semibold" style={{ color: "#2a1f08" }}>{form.nama}</span> berhasil disimpan ke sistem.
                      </p>
                      <p className="text-[11px] mb-7" style={{ color: "rgba(80,65,40,0.42)" }}>
                        {jumlahNum} {form.satuan}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                        <button className="btn-secondary" onClick={handleReset}>
                          <IconPlus size={14} color="#2a1f08" /> Tambah Lagi
                        </button>
                        <Link href="/stock" className="flex-1">
                          <button className="btn-primary" style={{ whiteSpace: "nowrap" }}>
                            Lihat Stok <IconArrowRight size={14} color="#fff" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* SIDEBAR */}
                <div className="flex flex-col gap-4">

                  {/* Preview card */}
                  <div className="anim-fade-up d250 zoom-card border p-5 sm:p-6"
                    style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(22px)", borderColor: "rgba(140,110,60,0.10)", borderRadius: "18px", boxShadow: "0 8px 28px rgba(42,31,8,0.06)" }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm" style={{ color: "#2a1f08" }}>Preview</h3>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(140,110,60,0.10)", color: "rgba(80,65,40,0.45)" }}>Live</span>
                    </div>
                    <div className="p-4 border rounded-2xl relative overflow-hidden"
                      style={{ background: "#ede8da", borderColor: "rgba(255,255,255,0.65)" }}>
                      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full pointer-events-none"
                        style={{ background: "rgba(255,255,255,0.25)" }} />
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(140,110,60,0.18)" }}>
                          <IconPackage size={14} color="#7a5c2e" />
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: jumlahNum === 0 ? "#fee2e2" : "#CFDECA",
                            color: jumlahNum === 0 ? "#dc2626" : "#2d6a3f"
                          }}>
                          {jumlahNum === 0 ? "Habis" : "Tersedia"}
                        </span>
                      </div>
                      <p className="font-['Plus_Jakarta_Sans'] font-black text-base leading-snug mb-0.5" style={{ color: "#2a1f08" }}>
                        {form.nama || <span style={{ color: "rgba(80,65,40,0.30)" }}>Nama Barang…</span>}
                      </p>
                      <p className="text-[11px] font-medium" style={{ color: "rgba(80,65,40,0.50)" }}>
                        {form.jumlah || "–"} {form.satuan}
                      </p>
                      <div className="mt-3 w-full h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(140,110,60,0.18)" }}>
                        <div className="h-full rounded-full" style={{ width: "0%", background: "rgba(122,92,46,0.35)" }} />
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="anim-fade-up d300 border p-4"
                    style={{ background: "rgba(232,223,200,0.40)", borderColor: "rgba(140,110,60,0.22)", borderRadius: "14px" }}>
                    <p className="text-[10px] font-bold tracking-[0.06em] uppercase mb-2.5 flex items-center gap-1.5"
                      style={{ color: "rgba(80,65,40,0.50)" }}>
                      <IconLightbulb size={13} color="rgba(80,65,40,0.50)" /> Tips
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Gunakan nama barang yang spesifik dan unik",
                        "Cek satuan sebelum menyimpan",
                        "Pastikan jumlah stok sesuai kondisi fisik",
                      ].map((t, i) => (
                        <li key={i} className="text-[11px] font-medium flex items-start gap-1.5"
                          style={{ color: "rgba(80,65,40,0.55)" }}>
                          <span className="mt-0.5 flex-shrink-0">
                            <IconCheck size={10} color="rgba(80,65,40,0.40)" />
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Inner>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}