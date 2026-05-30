"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const currentUser = { id: 1, nama: "Andi Pratama", role: "Admin", initials: "AP" };

function getInitials(nama: string): string {
  const parts = nama.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const AVATAR_PALETTE = [
  { bg: "#e8dfc8", color: "#7a5c2e" },
  { bg: "#CFDECA", color: "#2d6a3f" },
  { bg: "#D8DFE9", color: "#2a3a52" },
  { bg: "#EFF0A3", color: "#5a6a00" },
  { bg: "#e0d5f5", color: "#5b21b6" },
  { bg: "#ffe4cc", color: "#92400e" },
  { bg: "#d1f0f7", color: "#0e7490" },
  { bg: "#f5d0e0", color: "#9d174d" },
  { bg: "#d4f0d4", color: "#166534" },
  { bg: "#dce8ff", color: "#1e40af" },
];
function pickAvatarColor(initials: string) {
  const code = (initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0);
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}

const IconArrowLeft = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconUser = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconLock = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconShield = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconEye = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconCheck = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconAlertCircle = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconChevronDown = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

function getStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Lemah", color: "#dc2626" };
  if (score === 2) return { level: 2, label: "Sedang", color: "#d97706" };
  return { level: 3, label: "Kuat", color: "#2d6a3f" };
}

type FormData = {
  nama: string;
  email: string;
  password: string;
  konfirmasi: string;
  role: "Admin" | "User";
  aktif: boolean;
};
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function TambahUserPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormData>({
    nama: "",
    email: "",
    password: "",
    konfirmasi: "",
    role: "User",
    aktif: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPw, setShowPw]     = useState(false);
  const [showKon, setShowKon]   = useState(false);
  const [touched, setTouched]   = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const strength = getStrength(form.password);
  const initials = getInitials(form.nama);
  const avatarColor = pickAvatarColor(initials === "?" ? "??" : initials);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  function validateField(name: keyof FormData, value: string | boolean): string {
    switch (name) {
      case "nama":
        if (!(value as string).trim()) return "Nama wajib diisi.";
        if ((value as string).trim().length < 2) return "Nama minimal 2 karakter.";
        return "";
      case "email":
        if (!(value as string).trim()) return "Email wajib diisi.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) return "Format email tidak valid.";
        return "";
      case "password":
        if (!(value as string)) return "Password wajib diisi.";
        if ((value as string).length < 8) return "Password minimal 8 karakter.";
        return "";
      case "konfirmasi":
        if (!(value as string)) return "Konfirmasi password wajib diisi.";
        if ((value as string) !== form.password) return "Password tidak cocok.";
        return "";
      default:
        return "";
    }
  }

  function handleChange(name: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
    if (name === "password" && touched.konfirmasi) {
      setErrors(prev => ({
        ...prev,
        konfirmasi: form.konfirmasi !== value ? "Password tidak cocok." : "",
      }));
    }
  }

  function handleBlur(name: keyof FormData) {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, form[name]) }));
  }

  function validateAll(): FormErrors {
    const e: FormErrors = {};
    (["nama", "email", "password", "konfirmasi"] as (keyof FormData)[]).forEach(k => {
      const msg = validateField(k, form[k]);
      if (msg) e[k] = msg;
    });
    return e;
  }

  function handleSubmit() {
    const allTouched: Partial<Record<keyof FormData, boolean>> = { nama: true, email: true, password: true, konfirmasi: true };
    setTouched(allTouched);
    const e = validateAll();
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push("/user"), 1800);
    }, 1200);
  }

  const inputBase = `
    w-full border rounded-xl px-4 py-2.5 text-sm font-['Inter'] text-[#212121] outline-none
    transition-all duration-200 bg-white
    placeholder:text-[rgba(33,33,33,0.28)]
  `;
  const inputNormal = "border-[rgba(33,33,33,0.14)] focus:border-[rgba(33,33,33,0.35)] focus:shadow-[0_0_0_3px_rgba(33,33,33,0.06)]";
  const inputError  = "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]";
  const inputOk     = "border-[#CFDECA] focus:border-[#2d6a3f] focus:shadow-[0_0_0_3px_rgba(45,106,63,0.07)]";

  function inputClass(name: keyof FormData) {
    if (errors[name] && touched[name]) return `${inputBase} ${inputError}`;
    if (!errors[name] && touched[name] && form[name]) return `${inputBase} ${inputOk}`;
    return `${inputBase} ${inputNormal}`;
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0}to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)} }
        @keyframes spinAnim{ from{transform:rotate(0deg)}to{transform:rotate(360deg)} }

        .anim-fade-up{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both}
        .d50 {animation-delay:.05s}.d100{animation-delay:.10s}.d150{animation-delay:.15s}
        .d200{animation-delay:.20s}.d250{animation-delay:.25s}.d300{animation-delay:.30s}

        .btn-primary{
          background:#2a1f08;color:#ffffff;border:none;border-radius:11px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;
          padding:11px 24px;font-size:14px;cursor:pointer;letter-spacing:.01em;
          transition:transform .2s cubic-bezier(.22,1,.36,1),box-shadow .2s,background .15s,opacity .15s;
          display:inline-flex;align-items:center;gap:8px;
        }
        .btn-primary:hover:not(:disabled){transform:translateY(-2px) scale(1.03);box-shadow:0 10px 28px rgba(42,31,8,.22);background:#3d2e0e}
        .btn-primary:active:not(:disabled){transform:scale(0.97)}
        .btn-primary:disabled{opacity:.55;cursor:not-allowed}

        .btn-ghost{
          background:rgba(33,33,33,0.06);color:#212121;border:none;border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;
          padding:10px 20px;font-size:13px;cursor:pointer;
          transition:background .15s,transform .18s;
          display:inline-flex;align-items:center;gap:6px;
        }
        .btn-ghost:hover{background:rgba(33,33,33,0.11);transform:scale(1.02)}

        .pw-toggle{
          position:absolute;right:12px;top:50%;transform:translateY(-50%);
          background:none;border:none;cursor:pointer;padding:2px;
          color:rgba(33,33,33,0.35);transition:color .15s;
          display:flex;align-items:center;
        }
        .pw-toggle:hover{color:rgba(33,33,33,0.70)}

        .role-card{
          border:1.5px solid rgba(33,33,33,0.10);border-radius:12px;padding:14px 16px;
          cursor:pointer;transition:border-color .18s,background .18s,box-shadow .2s;
          display:flex;align-items:flex-start;gap:12px;
        }
        .role-card:hover{border-color:rgba(33,33,33,0.25);background:rgba(33,33,33,0.02)}
        .role-card.selected{border-color:#2a1f08;background:rgba(42,31,8,0.03);box-shadow:0 0 0 3px rgba(42,31,8,0.07)}

        .radio-dot{
          width:18px;height:18px;border-radius:50%;border:2px solid rgba(33,33,33,0.20);
          flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;
          transition:border-color .15s,background .15s;
        }
        .role-card.selected .radio-dot{border-color:#2a1f08;background:#2a1f08}
        .radio-inner{width:6px;height:6px;border-radius:50%;background:#EFF0A3}

        .toggle-wrap{
          width:44px;height:24px;border-radius:12px;cursor:pointer;
          transition:background .2s;position:relative;flex-shrink:0;border:none;padding:0;
        }
        .toggle-thumb{
          width:18px;height:18px;border-radius:9px;background:#ffffff;
          position:absolute;top:3px;transition:left .2s cubic-bezier(.22,1,.36,1);
          box-shadow:0 1px 4px rgba(0,0,0,0.18);
        }

        .strength-bar{
          height:3px;border-radius:2px;flex:1;
          transition:background .25s,opacity .25s;
        }

        .avatar-preview{
          border-radius:16px;display:flex;align-items:center;justify-content:center;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;
          transition:background .3s,color .3s;
        }

        .success-overlay{
          animation:fadeIn .2s ease both;
          position:fixed;inset:0;z-index:60;
          background:rgba(33,33,33,0.40);backdrop-filter:blur(8px);
          display:flex;align-items:center;justify-content:center;padding:1rem;
        }
        .success-card{animation:scaleIn .28s cubic-bezier(.22,1,.36,1) both}

        .spinner{
          width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.3);
          border-top-color:#ffffff;border-radius:50%;
          animation:spinAnim .7s linear infinite;
        }

        .field-err{display:flex;align-items:center;gap:5px;margin-top:5px;color:#dc2626;font-size:11px;font-weight:500}
        .field-ok {display:flex;align-items:center;gap:5px;margin-top:5px;color:#2d6a3f;font-size:11px;font-weight:500}
      `}</style>

      <div
        className={`min-h-screen font-['Inter'] text-[#212121] transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F4F4F5" }}
      >
        <Header hasNotification={false} userInitials={currentUser.initials} />

        <main className="w-full">

          <section className="w-full pt-8 pb-6 sm:pt-10 sm:pb-8" style={{ background: "#F4F4F5" }}>
            <Inner>
              <div className="anim-fade-up flex items-center gap-2 mb-4 text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>
                <Link href="/dashboard" className="hover:text-[#2a1f08] transition-colors">Dashboard</Link>
                <span>/</span>
                <Link href="/user" className="hover:text-[#2a1f08] transition-colors">User</Link>
                <span>/</span>
                <span style={{ color: "#2a1f08" }} className="font-semibold">Tambah User</span>
              </div>

              <div className="anim-fade-up d100 flex items-center gap-3">
                <Link href="/user">
                  <button className="btn-ghost !px-2.5 !py-2">
                    <IconArrowLeft size={15} />
                  </button>
                </Link>
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase font-semibold mb-0.5" style={{ color: "rgba(33,33,33,0.32)" }}>Manajemen User</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-3xl leading-none" style={{ color: "#212121" }}>Tambah User</h1>
                </div>
              </div>
            </Inner>
          </section>

          <section className="w-full pb-12" style={{ background: "#F4F4F5" }}>
            <Inner>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

                <div className="anim-fade-up d150 lg:col-span-1 flex flex-col gap-4">

                  <div className="bg-white border border-[rgba(33,33,33,0.08)] rounded-2xl p-5 flex flex-col items-center text-center">
                    <p className="text-[10px] tracking-[0.15em] uppercase font-bold mb-4" style={{ color: "rgba(33,33,33,0.30)" }}>Preview</p>
                    <div
                      className="avatar-preview mb-3"
                      style={{ width: 72, height: 72, fontSize: 26, background: avatarColor.bg, color: avatarColor.color }}
                    >
                      {initials}
                    </div>
                    <p className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#212121] leading-snug min-h-[20px]">
                      {form.nama.trim() || <span style={{ color: "rgba(33,33,33,0.25)" }}>Nama lengkap</span>}
                    </p>
                    <p className="text-[11px] mt-0.5 min-h-[16px]" style={{ color: "rgba(33,33,33,0.40)" }}>
                      {form.email || <span style={{ color: "rgba(33,33,33,0.22)" }}>email@contoh.com</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                        style={form.role === "Admin"
                          ? { background: "#e8dfc8", color: "#7a5c2e" }
                          : { background: "#D8DFE9", color: "#2a3a52" }}>
                        {form.role === "Admin"
                          ? <><IconShield size={9} color="#7a5c2e" /> Admin</>
                          : <><IconUser size={9} color="#2a3a52" /> User</>}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                        style={form.aktif
                          ? { background: "#CFDECA", color: "#2d6a3f" }
                          : { background: "rgba(33,33,33,0.07)", color: "rgba(33,33,33,0.40)" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                        {form.aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border border-[rgba(33,33,33,0.08)] rounded-2xl p-4">
                    <p className="text-[11px] font-bold mb-2.5 tracking-[0.05em] uppercase" style={{ color: "rgba(33,33,33,0.35)" }}>Panduan</p>
                    <ul className="flex flex-col gap-2">
                      {[
                        "Gunakan nama lengkap agar mudah dikenali.",
                        "Email harus unik dan aktif.",
                        "Password minimal 8 karakter dengan kombinasi huruf & angka.",
                        "Admin memiliki akses penuh ke semua fitur.",
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: "rgba(33,33,33,0.50)" }}>
                          <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                            style={{ background: "rgba(33,33,33,0.06)", fontSize: 9, color: "rgba(33,33,33,0.40)", fontWeight: 700 }}>
                            {i + 1}
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="anim-fade-up d200 lg:col-span-2 flex flex-col gap-4">

                  <div className="bg-white border border-[rgba(33,33,33,0.08)] rounded-2xl p-5 sm:p-6">
                    <p className="text-[11px] font-bold tracking-[0.12em] uppercase mb-5" style={{ color: "rgba(33,33,33,0.32)" }}>
                      Informasi Dasar
                    </p>

                    <div className="mb-4">
                      <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "rgba(33,33,33,0.65)" }}>
                        Nama Lengkap <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center" style={{ color: "rgba(33,33,33,0.30)" }}>
                          <IconUser size={14} />
                        </span>
                        <input
                          type="text"
                          placeholder="Contoh: Budi Santoso"
                          value={form.nama}
                          onChange={e => handleChange("nama", e.target.value)}
                          onBlur={() => handleBlur("nama")}
                          className={`${inputClass("nama")} !pl-9`}
                        />
                        {touched.nama && !errors.nama && form.nama && (
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2"><IconCheck size={14} color="#2d6a3f" /></span>
                        )}
                      </div>
                      {touched.nama && errors.nama && (
                        <p className="field-err"><IconAlertCircle size={12} color="#dc2626" />{errors.nama}</p>
                      )}
                      {touched.nama && !errors.nama && form.nama && (
                        <p className="field-ok"><IconCheck size={12} color="#2d6a3f" />Nama valid</p>
                      )}
                    </div>

                    <div className="mb-0">
                      <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "rgba(33,33,33,0.65)" }}>
                        Email <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center" style={{ color: "rgba(33,33,33,0.30)" }}>
                          <IconMail size={14} />
                        </span>
                        <input
                          type="email"
                          placeholder="Contoh: budi@inventix.id"
                          value={form.email}
                          onChange={e => handleChange("email", e.target.value)}
                          onBlur={() => handleBlur("email")}
                          className={`${inputClass("email")} !pl-9`}
                        />
                        {touched.email && !errors.email && form.email && (
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2"><IconCheck size={14} color="#2d6a3f" /></span>
                        )}
                      </div>
                      {touched.email && errors.email && (
                        <p className="field-err"><IconAlertCircle size={12} color="#dc2626" />{errors.email}</p>
                      )}
                      {touched.email && !errors.email && form.email && (
                        <p className="field-ok"><IconCheck size={12} color="#2d6a3f" />Email valid</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-[rgba(33,33,33,0.08)] rounded-2xl p-5 sm:p-6">
                    <p className="text-[11px] font-bold tracking-[0.12em] uppercase mb-5" style={{ color: "rgba(33,33,33,0.32)" }}>
                      Keamanan
                    </p>

                    <div className="mb-4">
                      <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "rgba(33,33,33,0.65)" }}>
                        Password <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center" style={{ color: "rgba(33,33,33,0.30)" }}>
                          <IconLock size={14} />
                        </span>
                        <input
                          type={showPw ? "text" : "password"}
                          placeholder="Minimal 8 karakter"
                          value={form.password}
                          onChange={e => handleChange("password", e.target.value)}
                          onBlur={() => handleBlur("password")}
                          className={`${inputClass("password")} !pl-9 !pr-10`}
                        />
                        <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                          {showPw ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                        </button>
                      </div>
                      {form.password && (
                        <div className="mt-2">
                          <div className="flex gap-1.5 mb-1">
                            {[1, 2, 3].map(lvl => (
                              <div key={lvl} className="strength-bar" style={{
                                background: strength.level >= lvl ? strength.color : "rgba(33,33,33,0.08)",
                                opacity: strength.level >= lvl ? 1 : 0.5,
                              }} />
                            ))}
                          </div>
                          <p className="text-[11px] font-semibold" style={{ color: strength.color }}>
                            Password {strength.label}
                          </p>
                        </div>
                      )}
                      {touched.password && errors.password && (
                        <p className="field-err"><IconAlertCircle size={12} color="#dc2626" />{errors.password}</p>
                      )}
                    </div>

                    <div className="mb-0">
                      <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "rgba(33,33,33,0.65)" }}>
                        Konfirmasi Password <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center" style={{ color: "rgba(33,33,33,0.30)" }}>
                          <IconLock size={14} />
                        </span>
                        <input
                          type={showKon ? "text" : "password"}
                          placeholder="Ulangi password"
                          value={form.konfirmasi}
                          onChange={e => handleChange("konfirmasi", e.target.value)}
                          onBlur={() => handleBlur("konfirmasi")}
                          className={`${inputClass("konfirmasi")} !pl-9 !pr-10`}
                        />
                        <button type="button" className="pw-toggle" onClick={() => setShowKon(v => !v)} tabIndex={-1}>
                          {showKon ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                        </button>
                      </div>
                      {touched.konfirmasi && errors.konfirmasi && (
                        <p className="field-err"><IconAlertCircle size={12} color="#dc2626" />{errors.konfirmasi}</p>
                      )}
                      {touched.konfirmasi && !errors.konfirmasi && form.konfirmasi && (
                        <p className="field-ok"><IconCheck size={12} color="#2d6a3f" />Password cocok</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-[rgba(33,33,33,0.08)] rounded-2xl p-5 sm:p-6">
                    <p className="text-[11px] font-bold tracking-[0.12em] uppercase mb-5" style={{ color: "rgba(33,33,33,0.32)" }}>
                      Role & Status
                    </p>

                    <div className="mb-5">
                      <label className="block text-[12px] font-semibold mb-2.5" style={{ color: "rgba(33,33,33,0.65)" }}>
                        Role <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

                        <div
                          className={`role-card ${form.role === "User" ? "selected" : ""}`}
                          onClick={() => handleChange("role", "User")}
                        >
                          <div className="radio-dot mt-0.5">
                            {form.role === "User" && <div className="radio-inner" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <IconUser size={13} color={form.role === "User" ? "#2a1f08" : "rgba(33,33,33,0.45)"} />
                              <p className="text-[13px] font-bold" style={{ color: form.role === "User" ? "#2a1f08" : "rgba(33,33,33,0.70)" }}>User</p>
                            </div>
                            <p className="text-[11px]" style={{ color: "rgba(33,33,33,0.42)" }}>Akses terbatas — hanya bisa melihat stok.</p>
                          </div>
                        </div>

                        <div
                          className={`role-card ${form.role === "Admin" ? "selected" : ""}`}
                          onClick={() => handleChange("role", "Admin")}
                        >
                          <div className="radio-dot mt-0.5">
                            {form.role === "Admin" && <div className="radio-inner" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <IconShield size={13} color={form.role === "Admin" ? "#2a1f08" : "rgba(33,33,33,0.45)"} />
                              <p className="text-[13px] font-bold" style={{ color: form.role === "Admin" ? "#2a1f08" : "rgba(33,33,33,0.70)" }}>Admin</p>
                            </div>
                            <p className="text-[11px]" style={{ color: "rgba(33,33,33,0.42)" }}>Akses penuh — kelola stok, penjualan & user.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3.5 border-t" style={{ borderColor: "rgba(33,33,33,0.07)" }}>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "rgba(33,33,33,0.75)" }}>Status Akun</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "rgba(33,33,33,0.40)" }}>
                          {form.aktif ? "User dapat langsung login setelah dibuat." : "User tidak bisa login sampai diaktifkan."}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="toggle-wrap"
                        style={{ background: form.aktif ? "#2d6a3f" : "rgba(33,33,33,0.15)" }}
                        onClick={() => handleChange("aktif", !form.aktif)}
                        aria-label="Toggle status aktif"
                      >
                        <div className="toggle-thumb" style={{ left: form.aktif ? "23px" : "3px" }} />
                      </button>
                    </div>
                  </div>

                  <div className="anim-fade-up d300 flex items-center justify-between gap-3 pt-1">
                    <Link href="/user">
                      <button className="btn-ghost">Batal</button>
                    </Link>
                    <button
                      className="btn-primary"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <><div className="spinner" /> Menyimpan…</>
                      ) : (
                        <><IconCheck size={14} color="#ffffff" /> Simpan User</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Inner>
          </section>
        </main>

        <Footer />

        {success && (
          <div className="success-overlay">
            <div className="success-card bg-white border border-[rgba(33,33,33,0.08)] rounded-2xl p-8 w-full max-w-sm text-center"
              style={{ boxShadow: "0 24px 64px rgba(33,33,33,0.16)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#CFDECA" }}>
                <IconCheck size={26} color="#2d6a3f" />
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-black text-xl text-[#212121] mb-1.5">User berhasil dibuat!</h2>
              <p className="text-sm mb-1" style={{ color: "rgba(33,33,33,0.50)" }}>
                Akun <span className="font-semibold text-[#212121]">{form.nama}</span> sudah ditambahkan.
              </p>
              <p className="text-[11px]" style={{ color: "rgba(33,33,33,0.35)" }}>Mengalihkan ke halaman user…</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}