"use client";

import Header from "../../../components/header";
import Footer from "../../../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const user = { nama: "Andi Pratama", role: "Admin", initials: "AP" };

const supplierData: Record<number, {
  id: number; nama: string; kategori: string; aktif: boolean;
  alamat: string; kota: string; provinsi: string; kodePos: string;
  telepon: string; email: string; namaKontak: string;
}> = {
  1: { id: 1, nama: "PT Sumber Makmur", kategori: "Bahan Pokok", aktif: true, alamat: "Jl. Raya Bogor No. 45, RT 03/02, Kelurahan Cibinong", kota: "Jakarta Timur", provinsi: "DKI Jakarta", kodePos: "13710", telepon: "021-8765432", email: "info@sumbermakmur.co.id", namaKontak: "Budi Santoso" },
  2: { id: 2, nama: "CV Mitra Pangan", kategori: "Bumbu & Rempah", aktif: true, alamat: "Jl. Gatot Subroto No. 12", kota: "Bandung", provinsi: "Jawa Barat", kodePos: "40261", telepon: "022-5543210", email: "", namaKontak: "Siti Rahayu" },
  3: { id: 3, nama: "UD Berkah Jaya", kategori: "Minuman", aktif: false, alamat: "Jl. Pemuda No. 78", kota: "Surabaya", provinsi: "Jawa Timur", kodePos: "60271", telepon: "031-3456789", email: "berkah@gmail.com", namaKontak: "" },
};

const KATEGORI_OPTIONS = ["Bahan Pokok", "Bumbu & Rempah", "Minuman", "Kemasan", "Lainnya"];
const PROVINSI_OPTIONS = ["DKI Jakarta","Jawa Barat","Jawa Tengah","Jawa Timur","Banten","DI Yogyakarta","Bali","Sumatera Utara","Sumatera Selatan","Kalimantan Timur","Sulawesi Selatan","Lainnya"];

const IconArrowLeft = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconSave = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

const IconRefresh = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.36"/>
  </svg>
);

const IconCheckCircle = ({ size = 44, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconLoader = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: "spin 1s linear infinite" }}>
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

const IconInfo = ({ size = 11, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const IconEdit = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconAlertTriangle = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconCheck = ({ size = 10, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
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

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

function FormField({ label, required, hint, children, error }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold tracking-[0.07em] uppercase flex items-center gap-1.5"
        style={{ color: "rgba(6,78,59,0.52)" }}>
        {label} {required && <span style={{ color: "#b91c1c" }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[10px] font-medium flex items-center gap-1" style={{ color: "rgba(6,78,59,0.38)" }}>
          <IconInfo size={10} color="rgba(6,78,59,0.38)" /> {hint}
        </p>
      )}
      {error && <p className="text-[10px] font-semibold" style={{ color: "#b91c1c" }}>{error}</p>}
    </div>
  );
}

// Diff detector
function hasDiff(original: Record<string, unknown>, current: Record<string, unknown>) {
  return Object.keys(original).some(k => original[k] !== current[k]);
}

export default function EditSupplierPage() {
  const params = useParams();
  const id = Number(params?.id);
  const original = supplierData[id];

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState(
    original
      ? { ...original }
      : { id: 0, nama: "", kategori: "Bahan Pokok", aktif: true, alamat: "", kota: "", provinsi: "DKI Jakarta", kodePos: "", telepon: "", email: "", namaKontak: "" }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isDirty = original ? hasDiff(original as unknown as Record<string, unknown>, form as unknown as Record<string, unknown>) : false;

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  function handleChange(k: string, v: string | boolean) {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.nama.trim()) e.nama = "Nama supplier wajib diisi.";
    if (!form.alamat.trim()) e.alamat = "Alamat wajib diisi.";
    if (!form.kota.trim()) e.kota = "Kota wajib diisi.";
    if (!form.telepon.trim()) e.telepon = "Nomor telepon wajib diisi.";
    else if (!/^[\d\-+() ]{8,16}$/.test(form.telepon)) e.telepon = "Format telepon tidak valid.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid.";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSuccess(true); }, 1400);
  }

  function handleReset() {
    if (original) setForm({ ...original });
    setErrors({});
  }

  const KATEGORI_COLORS: Record<string, { bg: string; text: string }> = {
    "Bahan Pokok": { bg: "#d1fae5", text: "#065f46" },
    "Bumbu & Rempah": { bg: "#fef3c7", text: "#92400e" },
    "Minuman": { bg: "#dbeafe", text: "#1e40af" },
    "Kemasan": { bg: "#ede9fe", text: "#5b21b6" },
    "Lainnya": { bg: "#f3f4f6", text: "#374151" },
  };

  // Changed fields tracker
  const changedFields = original
    ? Object.keys(original).filter(k => (original as any)[k] !== (form as any)[k])
    : [];

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
        @keyframes checkPop {
          0%   { transform:scale(0) rotate(-10deg); opacity:0; }
          65%  { transform:scale(1.15) rotate(4deg); opacity:1; }
          100% { transform:scale(1) rotate(0); opacity:1; }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        @keyframes pulse-border {
          0%,100% { border-color: rgba(6,78,59,0.28); }
          50%     { border-color: rgba(6,78,59,0.55); }
        }

        .su-fade-up { animation:fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .d1{animation-delay:.05s}.d2{animation-delay:.10s}.d3{animation-delay:.15s}
        .d4{animation-delay:.20s}.d5{animation-delay:.25s}

        .blob-g  { animation:floatBlob 10s ease-in-out infinite; }
        .blob-g2 { animation:floatBlob 13s ease-in-out infinite reverse; animation-delay:4s; }

        .su-card {
          transition:transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s;
          will-change:transform;
        }
        .su-card:hover { transform:translateY(-2px); box-shadow:0 16px 40px rgba(6,78,59,0.10); }

        .form-input-g {
          width:100%; border:1.5px solid rgba(6,78,59,0.15); border-radius:12px;
          padding:11px 15px; font-size:13.5px;
          background:rgba(255,255,255,0.85); color:#022c22; outline:none;
          font-family:'DM Sans',sans-serif;
          transition:border-color .2s, box-shadow .2s, background .2s;
        }
        .form-input-g:focus {
          border-color:rgba(6,78,59,0.45);
          box-shadow:0 0 0 4px rgba(6,78,59,0.07);
          background:#fff;
        }
        .form-input-g.error { border-color:rgba(185,28,28,0.50); box-shadow:0 0 0 3px rgba(185,28,28,0.06); }
        .form-input-g.changed { border-color:rgba(6,78,59,0.40); background:rgba(209,250,229,0.30); }
        .form-input-g::placeholder { color:rgba(6,78,59,0.28); }

        .form-select-g {
          width:100%; border:1.5px solid rgba(6,78,59,0.15); border-radius:12px;
          padding:11px 38px 11px 15px; font-size:13.5px;
          background:rgba(255,255,255,0.85) url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9' stroke='%23064e3b' stroke-opacity='.40' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 14px center;
          color:#022c22; outline:none; cursor:pointer; font-family:'DM Sans',sans-serif;
          appearance:none;
          transition:border-color .2s, box-shadow .2s;
        }
        .form-select-g:focus { border-color:rgba(6,78,59,0.45); box-shadow:0 0 0 4px rgba(6,78,59,0.07); }
        .form-select-g.changed { border-color:rgba(6,78,59,0.40); background-color:rgba(209,250,229,0.30); }

        .form-textarea-g {
          width:100%; border:1.5px solid rgba(6,78,59,0.15); border-radius:12px;
          padding:11px 15px; font-size:13.5px; resize:vertical; min-height:80px;
          background:rgba(255,255,255,0.85); color:#022c22; outline:none;
          font-family:'DM Sans',sans-serif;
          transition:border-color .2s, box-shadow .2s;
        }
        .form-textarea-g:focus { border-color:rgba(6,78,59,0.45); box-shadow:0 0 0 4px rgba(6,78,59,0.07); background:#fff; }
        .form-textarea-g.error { border-color:rgba(185,28,28,0.50); }
        .form-textarea-g.changed { border-color:rgba(6,78,59,0.40); background:rgba(209,250,229,0.30); }
        .form-textarea-g::placeholder { color:rgba(6,78,59,0.28); }

        .btn-green-g {
          background:#064e3b; color:#ecfdf5; border:none; border-radius:12px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:700;
          padding:13px 26px; font-size:13.5px; cursor:pointer; width:100%;
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          transition:transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s, background .18s;
        }
        .btn-green-g:hover:not(:disabled) { transform:translateY(-2px) scale(1.025); box-shadow:0 10px 28px rgba(6,78,59,0.28); background:#065f46; }
        .btn-green-g:active:not(:disabled) { transform:scale(0.97); }
        .btn-green-g:disabled { opacity:0.55; cursor:not-allowed; }
        .btn-green-g.shimmer {
          background:linear-gradient(90deg,#064e3b 0%,#10b981 40%,#064e3b 60%,#064e3b 100%);
          background-size:200% 100%; animation:shimmer 1.4s infinite linear;
        }

        .btn-back-g {
          background:rgba(6,78,59,0.08); color:#064e3b; border:none; border-radius:12px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;
          padding:13px 26px; font-size:13.5px; cursor:pointer; width:100%;
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          transition:background .18s, transform .2s;
        }
        .btn-back-g:hover { background:rgba(6,78,59,0.14); transform:scale(1.02); }

        .btn-reset-g {
          background:transparent; color:rgba(6,78,59,0.50); border:1.5px solid rgba(6,78,59,0.14); border-radius:10px;
          font-family:'DM Sans',sans-serif; font-weight:600;
          padding:7px 13px; font-size:12px; cursor:pointer;
          display:inline-flex; align-items:center; gap:5px;
          transition:all .18s;
        }
        .btn-reset-g:hover { border-color:rgba(6,78,59,0.30); color:#064e3b; background:rgba(6,78,59,0.05); }

        .toggle-wrap {
          display:flex; align-items:center; gap:10px; padding:12px 14px;
          border:1.5px solid rgba(6,78,59,0.13); border-radius:12px;
          background:rgba(255,255,255,0.80); cursor:pointer;
          transition:border-color .2s, background .2s;
        }
        .toggle-wrap:hover { border-color:rgba(6,78,59,0.30); background:#fff; }
        .toggle-wrap.changed { border-color:rgba(6,78,59,0.40); background:rgba(209,250,229,0.30); }

        .toggle-track {
          width:38px; height:22px; border-radius:999px; position:relative;
          flex-shrink:0; transition:background .25s;
        }
        .toggle-thumb {
          position:absolute; top:3px; width:16px; height:16px; border-radius:50%;
          background:#fff; box-shadow:0 1px 4px rgba(0,0,0,0.18);
          transition:left .25s cubic-bezier(.22,1,.36,1);
        }

        .diff-badge {
          display:inline-flex; align-items:center; gap:4px;
          font-size:9px; font-weight:700; letter-spacing:0.04em;
          padding:2px 7px; border-radius:999px;
          background:rgba(6,78,59,0.12); color:#065f46;
        }

        .success-check { animation:checkPop .5s cubic-bezier(.22,1,.36,1) both; }

        .section-divider {
          display:flex; align-items:center; gap:3 gap-10px; margin:20px 0 16px;
        }
        .section-divider-line { flex:1; height:1px; background:rgba(6,78,59,0.08); }
        .section-divider-label {
          font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
          color:rgba(6,78,59,0.38); white-space:nowrap; padding:0 10px;
        }
      `}</style>

      <div className={`min-h-screen text-[#022c22] font-['DM_Sans'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
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
              <div className="su-fade-up flex items-center gap-2 mb-5 text-[11px] font-medium"
                style={{ color: "rgba(6,78,59,0.40)" }}>
                <Link href="/dashboard" className="hover:text-[#064e3b] transition-colors">Dashboard</Link>
                <span>/</span>
                <Link href="/supplier" className="hover:text-[#064e3b] transition-colors">Supplier</Link>
                <span>/</span>
                <span style={{ color: "#064e3b" }} className="font-semibold">Edit</span>
              </div>

              <div className="su-fade-up d2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase mb-1.5 font-medium" style={{ color: "rgba(6,78,59,0.40)" }}>Manajemen · Supplier</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.1rem] leading-none" style={{ color: "#022c22" }}>
                    Edit Supplier
                  </h1>
                  {original && (
                    <p className="text-[12px] mt-1.5 font-medium flex items-center gap-2" style={{ color: "rgba(6,78,59,0.42)" }}>
                      Mengedit: <span className="font-bold" style={{ color: "#064e3b" }}>{original.nama}</span>
                      {isDirty && <span className="diff-badge"><span>●</span> Ada perubahan</span>}
                    </p>
                  )}
                </div>
                {isDirty && (
                  <button className="btn-reset-g" onClick={handleReset}>
                    <IconRefresh size={12} color="rgba(6,78,59,0.55)" /> Reset perubahan
                  </button>
                )}
              </div>
            </Inner>
          </section>

          {/* FORM */}
          <section className="w-full py-10 sm:py-12" style={{ background: "#ffffff" }}>
            <Inner>
              {!original ? (
                <div className="text-center py-16">
                  <p className="text-sm" style={{ color: "rgba(6,78,59,0.45)" }}>Supplier tidak ditemukan.</p>
                  <Link href="/supplier">
                    <button className="btn-back-g mt-4" style={{ width: "auto", padding: "10px 20px" }}>
                      <IconArrowLeft size={13} color="#064e3b" /> Kembali ke Supplier
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 items-start">

                  {/* MAIN FORM */}
                  <div className="sm:col-span-2">
                    {!success ? (
                      <div className="su-fade-up d3 su-card border p-6 sm:p-8"
                        style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(22px)", borderColor: "rgba(6,78,59,0.10)", borderRadius: "20px", boxShadow: "0 8px 32px rgba(6,78,59,0.08)" }}>

                        <div className="flex items-center gap-3 mb-7">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#d1fae5" }}>
                            <IconEdit size={17} color="#065f46" />
                          </div>
                          <div>
                            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base" style={{ color: "#022c22" }}>Edit Data Supplier</h2>
                            <p className="text-[11px] mt-0.5" style={{ color: "rgba(6,78,59,0.42)" }}>Field yang diubah ditandai dengan latar hijau</p>
                          </div>
                        </div>

                        {/* SECTION: Identitas */}
                        <div className="section-divider">
                          <div className="section-divider-line" />
                          <span className="section-divider-label">Identitas</span>
                          <div className="section-divider-line" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
                          <div className="sm:col-span-2">
                            <FormField label="Nama Supplier" required error={errors.nama}>
                              <input className={`form-input-g${errors.nama ? " error" : changedFields.includes("nama") ? " changed" : ""}`}
                                value={form.nama}
                                onChange={e => handleChange("nama", e.target.value)} />
                            </FormField>
                          </div>

                          <FormField label="Kategori">
                            <select className={`form-select-g${changedFields.includes("kategori") ? " changed" : ""}`}
                              value={form.kategori}
                              onChange={e => handleChange("kategori", e.target.value)}>
                              {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                          </FormField>

                          <FormField label="Status Supplier">
                            <div className={`toggle-wrap${changedFields.includes("aktif") ? " changed" : ""}`}
                              onClick={() => handleChange("aktif", !form.aktif)}>
                              <div className="toggle-track" style={{ background: form.aktif ? "#064e3b" : "rgba(6,78,59,0.18)" }}>
                                <div className="toggle-thumb" style={{ left: form.aktif ? "19px" : "3px" }} />
                              </div>
                              <div>
                                <p className="text-[13px] font-semibold" style={{ color: "#022c22" }}>
                                  {form.aktif ? "Aktif" : "Nonaktif"}
                                </p>
                                <p className="text-[10px]" style={{ color: "rgba(6,78,59,0.45)" }}>
                                  {form.aktif ? "Supplier bisa menerima order" : "Supplier dinonaktifkan"}
                                </p>
                              </div>
                            </div>
                          </FormField>

                          <FormField label="Nama Kontak PIC" hint="Opsional">
                            <input className={`form-input-g${changedFields.includes("namaKontak") ? " changed" : ""}`}
                              value={form.namaKontak}
                              onChange={e => handleChange("namaKontak", e.target.value)} />
                          </FormField>
                        </div>

                        {/* SECTION: Lokasi */}
                        <div className="section-divider">
                          <div className="section-divider-line" />
                          <span className="section-divider-label">Lokasi & Kontak</span>
                          <div className="section-divider-line" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="sm:col-span-2">
                            <FormField label="Alamat" required error={errors.alamat}>
                              <textarea className={`form-textarea-g${errors.alamat ? " error" : changedFields.includes("alamat") ? " changed" : ""}`}
                                value={form.alamat}
                                onChange={e => handleChange("alamat", e.target.value)} />
                            </FormField>
                          </div>

                          <FormField label="Kota / Kabupaten" required error={errors.kota}>
                            <input className={`form-input-g${errors.kota ? " error" : changedFields.includes("kota") ? " changed" : ""}`}
                              value={form.kota}
                              onChange={e => handleChange("kota", e.target.value)} />
                          </FormField>

                          <FormField label="Provinsi">
                            <select className={`form-select-g${changedFields.includes("provinsi") ? " changed" : ""}`}
                              value={form.provinsi}
                              onChange={e => handleChange("provinsi", e.target.value)}>
                              {PROVINSI_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </FormField>

                          <FormField label="Kode Pos" hint="Opsional">
                            <input className={`form-input-g${changedFields.includes("kodePos") ? " changed" : ""}`}
                              value={form.kodePos}
                              onChange={e => handleChange("kodePos", e.target.value)} />
                          </FormField>

                          <FormField label="Nomor Telepon" required error={errors.telepon}>
                            <input className={`form-input-g${errors.telepon ? " error" : changedFields.includes("telepon") ? " changed" : ""}`}
                              value={form.telepon}
                              onChange={e => handleChange("telepon", e.target.value)} />
                          </FormField>

                          <div className="sm:col-span-2">
                            <FormField label="Email" hint="Opsional" error={errors.email}>
                              <input className={`form-input-g${errors.email ? " error" : changedFields.includes("email") ? " changed" : ""}`}
                                type="email"
                                value={form.email}
                                onChange={e => handleChange("email", e.target.value)} />
                            </FormField>
                          </div>
                        </div>

                        {/* Unsaved warning */}
                        {isDirty && (
                          <div className="mt-5 flex items-center gap-2.5 px-4 py-3 border rounded-2xl"
                            style={{ background: "rgba(254,243,199,0.60)", borderColor: "rgba(217,119,6,0.20)" }}>
                            <IconAlertTriangle size={14} color="#b45309" />
                            <p className="text-[11px] font-medium" style={{ color: "#92400e" }}>
                              Ada <strong>{changedFields.length} field</strong> yang diubah. Klik Simpan untuk menyimpan perubahan.
                            </p>
                          </div>
                        )}

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <Link href="/supplier">
                            <button className="btn-back-g">
                              <IconArrowLeft size={13} color="#064e3b" /> Batal
                            </button>
                          </Link>
                          <button className={`btn-green-g${submitting ? " shimmer" : ""}`}
                            disabled={submitting || !isDirty}
                            onClick={handleSubmit}>
                            {submitting
                              ? <><IconLoader size={14} color="#ecfdf5" /> Menyimpan…</>
                              : <><IconSave size={14} color="#ecfdf5" /> Simpan Perubahan</>}
                          </button>
                        </div>
                      </div>

                    ) : (
                      <div className="su-fade-up su-card border p-8 sm:p-10 flex flex-col items-center text-center"
                        style={{ background: "rgba(209,250,229,0.22)", borderColor: "rgba(6,78,59,0.18)", borderRadius: "20px", boxShadow: "0 8px 32px rgba(6,78,59,0.08)" }}>
                        <div className="success-check w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                          style={{ background: "#d1fae5" }}>
                          <IconCheckCircle size={38} color="#065f46" />
                        </div>
                        <h2 className="font-['Plus_Jakarta_Sans'] font-black text-xl sm:text-2xl mb-2" style={{ color: "#022c22" }}>
                          Perubahan Disimpan!
                        </h2>
                        <p className="text-sm mb-2" style={{ color: "rgba(6,78,59,0.58)" }}>
                          Data <span className="font-semibold" style={{ color: "#022c22" }}>{form.nama}</span> berhasil diperbarui.
                        </p>
                        <p className="text-[11px] mb-7" style={{ color: "rgba(6,78,59,0.40)" }}>
                          {changedFields.length} field diubah
                        </p>
                        <Link href="/supplier">
                          <button className="btn-green-g" style={{ width: "auto", padding: "12px 24px" }}>
                            <IconArrowLeft size={13} color="#ecfdf5" /> Kembali ke Daftar Supplier
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* SIDEBAR */}
                  <div className="flex flex-col gap-4">
                    {/* Diff summary */}
                    <div className="su-fade-up d4 su-card border p-5"
                      style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(18px)", borderColor: "rgba(6,78,59,0.10)", borderRadius: "18px", boxShadow: "0 6px 24px rgba(6,78,59,0.06)" }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm" style={{ color: "#022c22" }}>Perubahan</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: isDirty ? "rgba(6,78,59,0.12)" : "rgba(6,78,59,0.06)", color: isDirty ? "#065f46" : "rgba(6,78,59,0.35)" }}>
                          {changedFields.length} field
                        </span>
                      </div>
                      {changedFields.length === 0 ? (
                        <p className="text-[11px] font-medium" style={{ color: "rgba(6,78,59,0.38)" }}>
                          Belum ada perubahan dari data asli.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {changedFields.map(k => (
                            <div key={k} className="flex items-start gap-2 p-2.5 border rounded-xl"
                              style={{ borderColor: "rgba(6,78,59,0.12)", background: "rgba(209,250,229,0.25)" }}>
                              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ background: "#d1fae5" }}>
                                <IconCheck size={8} color="#065f46" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(6,78,59,0.45)" }}>{k}</p>
                                <p className="text-[11px] font-medium truncate" style={{ color: "#022c22" }}>
                                  {typeof (form as any)[k] === "boolean"
                                    ? ((form as any)[k] ? "Aktif" : "Nonaktif")
                                    : String((form as any)[k]) || "–"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Data asli */}
                    <div className="su-fade-up d5 su-card border p-5"
                      style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(18px)", borderColor: "rgba(6,78,59,0.10)", borderRadius: "18px", boxShadow: "0 6px 24px rgba(6,78,59,0.06)" }}>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm mb-4" style={{ color: "#022c22" }}>Data Saat Ini</h3>
                      <div className="p-4 border rounded-2xl" style={{ background: "#f0fdf4", borderColor: "rgba(6,78,59,0.10)" }}>
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm leading-snug" style={{ color: "#022c22" }}>{original.nama}</p>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0"
                            style={{ background: original.aktif ? "#d1fae5" : "#fee2e2", color: original.aktif ? "#065f46" : "#991b1b" }}>
                            {original.aktif ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md mb-2.5 inline-block"
                          style={{ background: KATEGORI_COLORS[original.kategori]?.bg, color: KATEGORI_COLORS[original.kategori]?.text }}>
                          {original.kategori}
                        </span>
                        <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
                          <p className="text-[11px] flex items-start gap-1.5" style={{ color: "rgba(6,78,59,0.55)" }}>
                            <IconMapPin size={11} color="rgba(6,78,59,0.42)" /> {original.kota}, {original.provinsi}
                          </p>
                          <p className="text-[11px] flex items-center gap-1.5" style={{ color: "rgba(6,78,59,0.55)" }}>
                            <IconPhone size={11} color="rgba(6,78,59,0.42)" /> {original.telepon}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Inner>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}