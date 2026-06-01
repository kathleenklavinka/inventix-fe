"use client";

import Header from "../../components/header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const IconChevronLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconAlertCircle = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

type Tab = "profil" | "password";

export default function ProfileEditPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [profile, setProfile] = useState<any>(null);

  // Profil form
  const [originalForm, setOriginalForm] = useState({ nama: "", email: "", telepon: "", jabatan: "" });
  const [form, setForm] = useState({ nama: "", email: "", telepon: "", jabatan: "" });
  const isDirty = JSON.stringify(form) !== JSON.stringify(originalForm);

  // Password form
  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const pwStrength = (() => {
    const p = pwForm.new;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)           s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9]/.test(p))         s++;
    if (/[^A-Za-z0-9]/.test(p))  s++;
    return s;
  })();
  const pwStrengthLabel = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][pwStrength];
  const pwStrengthColor = ["", "#dc2626", "#d97706", "#2d6a3f", "#2d6a3f"][pwStrength];

  const loadProfile = async () => {
    try {
      const res = await api.akun.profile();
      const p = res.data;
      setProfile(p);
      
      let mappedJabatan = "Staff Gudang";
      if (p.peran === "OWNER") mappedJabatan = "Business Owner";
      else if (p.peran === "ADMIN") mappedJabatan = "Inventory Manager";
      else if (p.peran === "SUPPLIER") mappedJabatan = "Mitra Supplier";

      const initData = {
        nama: p.nama || "",
        email: p.email || "",
        telepon: "",
        jabatan: mappedJabatan,
      };

      setForm(initData);
      setOriginalForm(initData);
    } catch (err) {
      console.error("Gagal memuat profil:", err);
    }
  };

  useEffect(() => {
    loadProfile();
    setTimeout(() => setMounted(true), 100);
  }, []);

  const validateProfil = () => {
    const e: Record<string, string> = {};
    if (!form.nama.trim())         e.nama   = "Nama tidak boleh kosong";
    if (!form.email.includes("@")) e.email  = "Format email tidak valid";
    if (form.telepon && !/^[+0-9\s-]+$/.test(form.telepon)) e.telepon = "Format telepon tidak valid";
    return e;
  };

  const validatePassword = () => {
    const e: Record<string, string> = {};
    if (!pwForm.current)               e.current = "Masukkan password saat ini";
    if (pwForm.new.length < 8)         e.new     = "Minimal 8 karakter";
    if (pwForm.new !== pwForm.confirm)  e.confirm = "Password tidak cocok";
    return e;
  };

  const handleSaveProfil = async () => {
    const e = validateProfil();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    if (!profile) return;

    try {
      await api.akun.update(profile.id, {
        nama: form.nama,
        email: form.email,
        peran: profile.peran,
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); router.push("/profile"); }, 1800);
    } catch (err: any) {
      setErrors({ submit: err.message || "Gagal menyimpan perubahan ke server." });
    }
  };

  const handleSavePassword = async () => {
    const e = validatePassword();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    if (!profile) return;

    try {
      await api.akun.update(profile.id, {
        nama: profile.nama,
        email: profile.email,
        peran: profile.peran,
        password: pwForm.new,
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setPwForm({ current: "", new: "", confirm: "" });
        router.push("/profile");
      }, 1800);
    } catch (err: any) {
      setErrors({ submit: err.message || "Gagal memperbarui password." });
    }
  };

  const initials = profile?.nama
    ? profile.nama.split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("")
    : "??";

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }

        @keyframes blob {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(30px,-20px) scale(1.05); }
          66%      { transform:translate(-18px,18px) scale(0.96); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(10px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes successPop {
          0%   { transform:scale(0.8); opacity:0; }
          60%  { transform:scale(1.05); opacity:1; }
          100% { transform:scale(1); opacity:1; }
        }
        .anim-fade-up  { animation:fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        .anim-slide-in { animation:slideIn 0.35s cubic-bezier(.22,1,.36,1) both; }
        .anim-success  { animation:successPop 0.45s cubic-bezier(.22,1,.36,1) both; }
        .d100{animation-delay:.10s}.d150{animation-delay:.15s}.d200{animation-delay:.20s}
        .d250{animation-delay:.25s}.d300{animation-delay:.30s}
        .blob  { animation:blob 10s ease-in-out infinite; }
        .blob2 { animation:blob 13s ease-in-out infinite reverse; animation-delay:3s; }

        /* Tab buttons */
        .tab-btn {
          transition:background .18s, color .18s, transform .18s cubic-bezier(.22,1,.36,1);
          font-family:var(--font-plus-jakarta), sans-serif;
        }
        .tab-btn:hover:not(.tab-active) { background:rgba(33,33,33,0.05); }

        /* Form fields */
        .field-wrap input, .field-wrap textarea {
          width:100%;
          background:rgba(255,255,255,0.65);
          border:1px solid rgba(33,33,33,0.12);
          border-radius:12px;
          padding:10px 14px;
          font-size:13px;
          font-family:var(--font-inter), sans-serif;
          color:#212121;
          outline:none;
          transition:border-color .18s, box-shadow .18s, background .18s;
          box-sizing:border-box;
        }
        .field-wrap input:focus, .field-wrap textarea:focus {
          border-color:rgba(33,33,33,0.35);
          background:rgba(255,255,255,0.95);
          box-shadow:0 0 0 3px rgba(33,33,33,0.07);
        }
        .field-wrap.has-error input,
        .field-wrap.has-error textarea {
          border-color:rgba(220,38,38,0.45);
          background:rgba(254,242,242,0.5);
        }
        .field-wrap.has-error input:focus,
        .field-wrap.has-error textarea:focus {
          box-shadow:0 0 0 3px rgba(220,38,38,0.09);
        }

        /* Password toggle */
        .pw-wrap { position:relative; }
        .pw-wrap input { padding-right:38px; }
        .pw-toggle {
          position:absolute; right:12px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; padding:2px;
          color:rgba(33,33,33,0.35); transition:color .15s;
        }
        .pw-toggle:hover { color:#212121; }

        /*BUTTON ROW: full width 2-col grid*/
        .btn-row {
          display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-top:8px;
        }

        /*PRIMARY SAVE BUTTON*/
        .save-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          width:100%; padding:12px 20px; border-radius:14px;
          background:#212121; color:#F9F9FA;
          font-family:var(--font-plus-jakarta), sans-serif;
          font-size:13.5px; font-weight:700;
          border:none; cursor:pointer;
          transition:background .18s, transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s, opacity .18s;
        }
        .save-btn:hover:not(:disabled) {
          background:#2d2d2d;
          transform:translateY(-1px);
          box-shadow:0 8px 24px rgba(33,33,33,0.20);
        }
        .save-btn:active:not(:disabled) { transform:scale(0.97); }
        .save-btn:disabled { opacity:0.38; cursor:not-allowed; }

        /*CANCEL BUTTON — hover merah*/
        .cancel-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:7px;
          width:100%; padding:12px 20px; border-radius:14px;
          background:rgba(33,33,33,0.04); color:rgba(33,33,33,0.55);
          font-family:var(--font-plus-jakarta), sans-serif;
          font-size:13.5px; font-weight:600;
          border:1px solid rgba(33,33,33,0.11);
          cursor:pointer; text-decoration:none;
          transition:background .18s, color .18s, border-color .18s, transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s;
        }
        .cancel-btn:hover {
          background:rgba(220,38,38,0.07);
          color:#dc2626;
          border-color:rgba(220,38,38,0.25);
          box-shadow:0 4px 14px rgba(220,38,38,0.08);
        }
        .cancel-btn:active { transform:scale(0.97); }

        .zoom-card {
          transition:box-shadow .28s cubic-bezier(.22,1,.36,1), transform .28s;
        }
        .zoom-card:hover { transform:translateY(-2px); box-shadow:0 16px 40px rgba(33,33,33,0.09); }

        .pw-seg {
          height:3px; flex:1; border-radius:99px;
          transition:background .35s;
        }
      `}</style>

      <div
        className={`min-h-screen text-[#212121] transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F9F9FA", fontFamily: "var(--font-inter), sans-serif" }}>

        <Header userInitials={initials} hasNotification={false} />

        <main className="w-full">

          {/* HERO */}
          <section className="w-full relative overflow-hidden pt-16 pb-8 sm:pt-20 sm:pb-10"
            style={{ background: "linear-gradient(160deg, #edf1f5 0%, #edf3eb 40%, #f4f6e4 72%, #f9f9f7 100%)" }}>

            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-28 blob pointer-events-none"
              style={{ background: "#CFDECA", filter: "blur(65px)" }} />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full opacity-18 blob2 pointer-events-none"
              style={{ background: "#EFF0A3", filter: "blur(50px)" }} />

            <div className="max-w-2xl mx-auto px-4 sm:px-8">
              <div className="anim-fade-up flex items-center gap-2 mb-5 text-[11px] font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>
                <Link href="/dashboard" className="hover:text-[#212121] transition-colors">Dashboard</Link>
                <span>/</span>
                <Link href="/profile" className="hover:text-[#212121] transition-colors">Profil</Link>
                <span>/</span>
                <span className="text-[#212121]">Edit</span>
              </div>

              <div className="anim-fade-up d100 flex items-center gap-3">
                <Link href="/profile"
                  className="w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all hover:bg-white/70 active:scale-95"
                  style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", color: "#212121" }}>
                  <IconChevronLeft />
                </Link>
                <div>
                  <h1 className="font-black text-xl sm:text-2xl text-[#212121] leading-tight"
                    style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>Edit Profil</h1>
                  <p className="text-[11px] font-medium mt-0.5" style={{ color: "rgba(33,33,33,0.40)" }}>Perbarui informasi akunmu</p>
                </div>
              </div>
            </div>
          </section>

          {/* FORM AREA */}
          <section className="w-full py-8 sm:py-10" style={{ background: "#FFFFFF" }}>
            <div className="max-w-2xl mx-auto px-4 sm:px-8">
              {saved && (
                <div className="anim-success mb-5 flex items-center gap-3 px-4 py-3.5 rounded-xl border"
                  style={{ background: "rgba(207,222,202,0.6)", borderColor: "rgba(45,106,63,0.20)" }}>
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#CFDECA" }}>
                    <IconCheck />
                  </span>
                  <p className="text-sm font-semibold text-[#2d6a3f]">
                    {activeTab === "profil" ? "Profil berhasil disimpan!" : "Password berhasil diperbarui! Mengalihkan…"}
                  </p>
                </div>
              )}

              {/* Tabs */}
              <div className="anim-fade-up d150 flex gap-1 p-1 rounded-xl mb-6"
                style={{ background: "rgba(33,33,33,0.05)", width: "fit-content" }}>
                {(["profil", "password"] as Tab[]).map((tab) => (
                  <button key={tab}
                    onClick={() => { setActiveTab(tab); setErrors({}); setSaved(false); }}
                    className={`tab-btn flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold capitalize ${activeTab === tab ? "tab-active" : ""}`}
                    style={activeTab === tab
                      ? { background: "#212121", color: "#F9F9FA" }
                      : { color: "rgba(33,33,33,0.45)" }}>
                    {tab === "profil" ? <><IconUser /> Informasi Profil</> : <><IconLock /> Ganti Password</>}
                  </button>
                ))}
              </div>

              {/*TAB: PROFIL*/}
              {activeTab === "profil" && (
                <div className="anim-slide-in zoom-card border rounded-2xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.75)", borderColor: "rgba(33,33,33,0.08)", boxShadow: "0 4px 20px rgba(33,33,33,0.05)" }}>

                  {/* Avatar editor */}
                  <div className="px-6 py-5 flex items-center gap-5"
                    style={{ borderBottom: "1px solid rgba(33,33,33,0.07)", background: "linear-gradient(135deg, rgba(216,223,233,0.22), rgba(207,222,202,0.14))" }}>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: "#212121" }}>
                        <span className="font-black text-xl text-white"
                          style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>AP</span>
                      </div>
                      <button className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                        style={{ background: "#D8DFE9" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#2a3a52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#212121]"
                        style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>Foto Profil</p>
                      <p className="text-[11px] font-medium mt-0.5" style={{ color: "rgba(33,33,33,0.38)" }}>JPG, PNG max 2MB</p>
                    </div>
                  </div>

                  <div className="px-6 py-6 space-y-4">
                    {/* Nama */}
                    <div className={`field-wrap ${errors.nama ? "has-error" : ""}`}>
                      <label className="block text-[11px] font-bold mb-1.5 tracking-wide uppercase"
                        style={{ color: "rgba(33,33,33,0.40)", fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input type="text" value={form.nama}
                        onChange={e => { setForm({ ...form, nama: e.target.value }); setErrors({ ...errors, nama: "" }); }}
                        placeholder="Nama lengkap" />
                      {errors.nama && (
                        <p className="mt-1.5 text-[11px] font-medium flex items-center gap-1 text-red-500">
                          <IconAlertCircle /> {errors.nama}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className={`field-wrap ${errors.email ? "has-error" : ""}`}>
                      <label className="block text-[11px] font-bold mb-1.5 tracking-wide uppercase"
                        style={{ color: "rgba(33,33,33,0.40)", fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input type="email" value={form.email}
                        onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                        placeholder="email@domain.com" />
                      {errors.email && (
                        <p className="mt-1.5 text-[11px] font-medium flex items-center gap-1 text-red-500">
                          <IconAlertCircle /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Telepon + Jabatan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={`field-wrap ${errors.telepon ? "has-error" : ""}`}>
                        <label className="block text-[11px] font-bold mb-1.5 tracking-wide uppercase"
                          style={{ color: "rgba(33,33,33,0.40)", fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                          Telepon
                        </label>
                        <input type="tel" value={form.telepon}
                          onChange={e => { setForm({ ...form, telepon: e.target.value }); setErrors({ ...errors, telepon: "" }); }}
                          placeholder="+62 812-xxxx-xxxx" />
                        {errors.telepon && (
                          <p className="mt-1.5 text-[11px] font-medium flex items-center gap-1 text-red-500">
                            <IconAlertCircle /> {errors.telepon}
                          </p>
                        )}
                      </div>
                      <div className="field-wrap">
                        <label className="block text-[11px] font-bold mb-1.5 tracking-wide uppercase"
                          style={{ color: "rgba(33,33,33,0.40)", fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                          Jabatan
                        </label>
                        <input type="text" value={form.jabatan}
                          onChange={e => setForm({ ...form, jabatan: e.target.value })}
                          placeholder="Jabatan / posisi" />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="btn-row">
                      <Link href="/profile" className="cancel-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Batal
                      </Link>
                      <button onClick={handleSaveProfil} disabled={!isDirty} className="save-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Simpan Perubahan
                      </button>
                    </div>
                    {!isDirty && (
                      <p className="text-[11px] font-medium text-center pt-1" style={{ color: "rgba(33,33,33,0.28)" }}>
                        Belum ada perubahan
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: PASSWORD */}
              {activeTab === "password" && (
                <div className="anim-slide-in zoom-card border rounded-2xl p-6 space-y-4"
                  style={{ background: "rgba(255,255,255,0.75)", borderColor: "rgba(33,33,33,0.08)", boxShadow: "0 4px 20px rgba(33,33,33,0.05)" }}>

                  {/* Password saat ini */}
                  <div className={`field-wrap ${errors.current ? "has-error" : ""}`}>
                    <label className="block text-[11px] font-bold mb-1.5 tracking-wide uppercase"
                      style={{ color: "rgba(33,33,33,0.40)", fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      Password Saat Ini <span className="text-red-500">*</span>
                    </label>
                    <div className="pw-wrap">
                      <input type={showPw.current ? "text" : "password"} value={pwForm.current}
                        onChange={e => { setPwForm({ ...pwForm, current: e.target.value }); setErrors({ ...errors, current: "" }); }}
                        placeholder="Password sekarang" />
                      <button className="pw-toggle" onClick={() => setShowPw({ ...showPw, current: !showPw.current })}>
                        {showPw.current ? <IconEyeOff /> : <IconEye />}
                      </button>
                    </div>
                    {errors.current && (
                      <p className="mt-1.5 text-[11px] font-medium flex items-center gap-1 text-red-500">
                        <IconAlertCircle /> {errors.current}
                      </p>
                    )}
                  </div>

                  {/* Password baru */}
                  <div className={`field-wrap ${errors.new ? "has-error" : ""}`}>
                    <label className="block text-[11px] font-bold mb-1.5 tracking-wide uppercase"
                      style={{ color: "rgba(33,33,33,0.40)", fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      Password Baru <span className="text-red-500">*</span>
                    </label>
                    <div className="pw-wrap">
                      <input type={showPw.new ? "text" : "password"} value={pwForm.new}
                        onChange={e => { setPwForm({ ...pwForm, new: e.target.value }); setErrors({ ...errors, new: "" }); }}
                        placeholder="Minimal 8 karakter" />
                      <button className="pw-toggle" onClick={() => setShowPw({ ...showPw, new: !showPw.new })}>
                        {showPw.new ? <IconEyeOff /> : <IconEye />}
                      </button>
                    </div>
                    {pwForm.new && (
                      <div className="mt-2.5">
                        <div className="flex gap-1 mb-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="pw-seg"
                              style={{ background: i <= pwStrength ? pwStrengthColor : "rgba(33,33,33,0.10)" }} />
                          ))}
                        </div>
                        <p className="text-[10px] font-bold" style={{ color: pwStrengthColor }}>{pwStrengthLabel}</p>
                      </div>
                    )}
                    {errors.new && (
                      <p className="mt-1.5 text-[11px] font-medium flex items-center gap-1 text-red-500">
                        <IconAlertCircle /> {errors.new}
                      </p>
                    )}
                  </div>

                  {/* Konfirmasi */}
                  <div className={`field-wrap ${errors.confirm ? "has-error" : ""}`}>
                    <label className="block text-[11px] font-bold mb-1.5 tracking-wide uppercase"
                      style={{ color: "rgba(33,33,33,0.40)", fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      Konfirmasi Password Baru <span className="text-red-500">*</span>
                    </label>
                    <div className="pw-wrap">
                      <input type={showPw.confirm ? "text" : "password"} value={pwForm.confirm}
                        onChange={e => { setPwForm({ ...pwForm, confirm: e.target.value }); setErrors({ ...errors, confirm: "" }); }}
                        placeholder="Ulangi password baru" />
                      <button className="pw-toggle" onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}>
                        {showPw.confirm ? <IconEyeOff /> : <IconEye />}
                      </button>
                    </div>
                    {!errors.confirm && pwForm.confirm && pwForm.new === pwForm.confirm && (
                      <p className="mt-1.5 text-[11px] font-medium flex items-center gap-1" style={{ color: "#2d6a3f" }}>
                        <IconCheck /> Password cocok
                      </p>
                    )}
                    {errors.confirm && (
                      <p className="mt-1.5 text-[11px] font-medium flex items-center gap-1 text-red-500">
                        <IconAlertCircle /> {errors.confirm}
                      </p>
                    )}
                  </div>

                  {/* Tips */}
                  <div className="rounded-xl p-3.5" style={{ background: "rgba(216,223,233,0.30)", border: "1px solid rgba(216,223,233,0.55)" }}>
                    <p className="text-[11px] font-bold text-[#212121] mb-1.5"
                      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>Tips password kuat:</p>
                    <ul className="space-y-1">
                      {[
                        "Minimal 8 karakter",
                        "Kombinasi huruf besar & kecil",
                        "Sertakan angka",
                        "Tambahkan simbol (!, @, #, ...)",
                      ].map((tip, i) => (
                        <li key={i} className="text-[10px] font-medium flex items-center gap-1.5"
                          style={{ color: "rgba(33,33,33,0.50)" }}>
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "rgba(33,33,33,0.25)" }} />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action */}
                  <div className="btn-row">
                    <Link href="/profile" className="cancel-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      Batal
                    </Link>
                    <button onClick={handleSavePassword} className="save-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Perbarui Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}