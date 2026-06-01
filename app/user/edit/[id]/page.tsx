"use client";

import Header from "../../../components/header";
import Footer from "../../../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { COOKIE_NAME } from "@/lib/auth";
import { api, mapRoleToFrontend, mapRoleToBackend, FrontendRole } from "@/lib/api";

const AVATAR_COLORS: Record<string, { bg: string; color: string }> = {
  OI: { bg: "#f5e6cc", color: "#92400e" },
  AI: { bg: "#e8dfc8", color: "#7a5c2e" },
  BS: { bg: "#CFDECA", color: "#2d6a3f" },
  CD: { bg: "#D8DFE9", color: "#2a3a52" },
  DK: { bg: "#EFF0A3", color: "#5a6a00" },
  EP: { bg: "#fde8e8", color: "#9b1c1c" },
  FN: { bg: "#e0d5f5", color: "#5b21b6" },
  GL: { bg: "#ffe4cc", color: "#92400e" },
  HW: { bg: "#d1f0f7", color: "#0e7490" },
  IP: { bg: "#f5d0e0", color: "#9d174d" },
  JS: { bg: "#d4f0d4", color: "#166534" },
  KS: { bg: "#f0e6d4", color: "#7c3d12" },
  LH: { bg: "#dce8ff", color: "#1e40af" },
};

function getInitials(nama: string) {
  return nama.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
}
function avatarStyle(initials: string) {
  return AVATAR_COLORS[initials] ?? { bg: "#e8dfc8", color: "#7a5c2e" };
}

const IconChevronLeft = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IconUser = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconShield = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconToggle = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="5" width="22" height="14" rx="7" ry="7"/>
    <circle cx="16" cy="12" r="3"/>
  </svg>
);
const IconLock = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconCheck = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconCalendar = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconAlertCircle = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconSave = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IconCrown = ({ size = 11, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20M4 20L2 8l6 4 6-8 6 8 6-4-2 12"/>
  </svg>
);

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-4xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

type FormErrors = Partial<Record<"nama" | "email" | "password" | "konfirmasi" | "submit", string>>;

export default function EditUserPage() {
  const params   = useParams();
  const router   = useRouter();
  const rawId    = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const userId   = rawId ? parseInt(rawId, 10) : NaN;

  const [mounted, setMounted]         = useState(false);
  const [originalUser, setOriginalUser] = useState<any>(null);
  const [loading, setLoading]         = useState(true);

  const [nama, setNama]               = useState("");
  const [email, setEmail]             = useState("");
  const [role, setRole]               = useState<"User" | "Admin" | "Owner" | "Supplier">("User");
  const [aktif, setAktif]             = useState(true);
  const [password, setPassword]       = useState("");
  const [konfirmasi, setKonfirmasi]   = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showKonfirm, setShowKonfirm] = useState(false);
  const [errors, setErrors]           = useState<FormErrors>({});
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);

  const [currentUser, setCurrentUser] = useState({
    id: 0,
    nama: "Admin Inventix",
    role: "admin",
    initials: "AI"
  });

  const isSelf = userId === currentUser.id;

  const previewInitials = getInitials(nama) || (originalUser?.avatar ?? "??");
  const avatarS = avatarStyle(originalUser?.avatar ?? previewInitials);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const res = await api.akun.profile();
        const profile = res.data;
        setCurrentUser({
          id: profile.id,
          nama: profile.nama,
          role: mapRoleToFrontend(profile.peran),
          initials: profile.nama.split(" ").map((w: any) => w[0]).join("").slice(0, 2).toUpperCase()
        });
      } catch (err) {
        console.error("Gagal memuat profil pengguna:", err);
      }
    }

    async function loadUserData() {
      setLoading(true);
      try {
        const res = await api.akun.getById(userId);
        const u = res.data;
        const fRole = mapRoleToFrontend(u.peran);
        
        let joiningDate = "–";
        if (u.dibuat_pada) {
          const d = new Date(u.dibuat_pada);
          const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
          joiningDate = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        const formattedRole = (fRole.charAt(0).toUpperCase() + fRole.slice(1)) as any; // "Admin" | "User" | "Owner" | "Supplier"

        const mapped = {
          id: u.id,
          nama: u.nama,
          email: u.email,
          role: formattedRole,
          bergabung: joiningDate,
          avatar: u.nama.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
          aktif: true
        };

        setOriginalUser(mapped);
        setNama(mapped.nama);
        setEmail(mapped.email);
        setRole(mapped.role);
        setAktif(mapped.aktif);
      } catch (err: any) {
        console.error("Gagal memuat detail user:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCurrentUser();
    if (userId) {
      loadUserData();
    }
    setTimeout(() => setMounted(true), 80);
  }, [userId]);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!nama.trim())                            e.nama      = "Nama tidak boleh kosong.";
    else if (nama.trim().length < 2)             e.nama      = "Nama minimal 2 karakter.";
    if (!email.trim())                           e.email     = "Email tidak boleh kosong.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Format email tidak valid.";
    if (password) {
      if (password.length < 8)                  e.password  = "Password minimal 8 karakter.";
      if (password !== konfirmasi)              e.konfirmasi = "Password tidak cocok.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    setErrors({});
    try {
      const backendRole = mapRoleToBackend(role.toLowerCase());
      const payload: any = {
        nama: nama,
        email: email,
        peran: backendRole
      };
      if (password) {
        payload.password = password;
      }
      await api.akun.update(userId, payload);
      setSaved(true);
      setTimeout(() => router.push("/user"), 1200);
    } catch (err: any) {
      setErrors({ submit: err.message || "Gagal menyimpan perubahan ke server." });
    } finally {
      setSaving(false);
    }
  }

  const isDirty = originalUser ? (
    nama !== originalUser.nama ||
    email !== originalUser.email ||
    role  !== originalUser.role ||
    aktif !== originalUser.aktif ||
    password !== "" || konfirmasi !== ""
  ) : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F4F4F5" }}>
        <div className="text-center flex flex-col items-center gap-3">
          <span className="animate-spin border-4 border-t-transparent border-[#2a1f08] rounded-full w-8 h-8" />
          <p className="text-sm font-semibold text-[#2a1f08] animate-pulse">Memuat detail user dari server...</p>
        </div>
      </div>
    );
  }

  if (!originalUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F4F4F5" }}>
        <div className="text-center">
          <p className="font-['Plus_Jakarta_Sans'] font-black text-2xl text-[#212121] mb-2">User tidak ditemukan</p>
          <Link href="/user"><button className="btn-primary mt-4">← Kembali</button></Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0}to{opacity:1} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)} }
        @keyframes checkPop { 0%{transform:scale(0) rotate(-10deg)}60%{transform:scale(1.15)}100%{transform:scale(1)} }
        @keyframes blobFloat{
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(30px,-20px) scale(1.05)}
          66%{transform:translate(-20px,20px) scale(.96)}
        }
        @keyframes spin { to{transform:rotate(360deg)} }

        .anim-fade-up{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both}
        .d50{animation-delay:.05s}.d100{animation-delay:.10s}.d150{animation-delay:.15s}
        .d200{animation-delay:.20s}.d250{animation-delay:.25s}.d300{animation-delay:.30s}
        .d350{animation-delay:.35s}

        .blob{animation:blobFloat 10s ease-in-out infinite}
        .blob2{animation:blobFloat 14s ease-in-out infinite reverse;animation-delay:4s}

        .btn-primary{
          background:#2a1f08;color:#fff;border:none;border-radius:11px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;
          padding:11px 22px;font-size:13.5px;cursor:pointer;
          transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s,background .15s;
          display:inline-flex;align-items:center;gap:7px;
        }
        .btn-primary:hover:not(:disabled){transform:translateY(-2px) scale(1.03);box-shadow:0 10px 28px rgba(42,31,8,.22);background:#3d2e0e}
        .btn-primary:active:not(:disabled){transform:scale(.97)}
        .btn-primary:disabled{opacity:.55;cursor:not-allowed}

        .btn-ghost{
          background:rgba(33,33,33,0.07);color:#212121;border:none;border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;
          padding:10px 18px;font-size:13px;cursor:pointer;
          transition:background .15s,transform .18s;
          display:inline-flex;align-items:center;gap:6px;
        }
        .btn-ghost:hover{background:rgba(33,33,33,0.12);transform:scale(1.02)}

        /* Form field */
        .field-wrap{display:flex;flex-direction:column;gap:6px}
        .field-label{
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:12px;
          color:rgba(33,33,33,0.55);letter-spacing:.04em;text-transform:uppercase;
          display:flex;align-items:center;gap:5px;
        }
        .field-input{
          border:1.5px solid rgba(33,33,33,0.12);border-radius:11px;
          padding:11px 14px;font-size:13.5px;background:#fff;
          color:#212121;outline:none;width:100%;
          font-family:'Inter',sans-serif;
          transition:border-color .2s,box-shadow .2s;
        }
        .field-input:focus{border-color:#2a1f08;box-shadow:0 0 0 3px rgba(42,31,8,.07)}
        .field-input.has-error{border-color:#dc2626;box-shadow:0 0 0 3px rgba(220,38,38,.06)}
        .field-input:disabled{background:rgba(33,33,33,0.04);color:rgba(33,33,33,0.40);cursor:not-allowed}
        .field-error{font-size:11.5px;color:#dc2626;display:flex;align-items:center;gap:4px;font-weight:500}
        .field-hint{font-size:11px;color:rgba(33,33,33,0.38);margin-top:1px}

        .pass-wrap{position:relative}
        .pass-toggle{
          position:absolute;right:12px;top:50%;transform:translateY(-50%);
          background:none;border:none;cursor:pointer;padding:2px;
          color:rgba(33,33,33,0.35);transition:color .15s;
        }
        .pass-toggle:hover{color:rgba(33,33,33,0.70)}

        /* Role selector */
        .role-option{
          flex:1;border:1.5px solid rgba(33,33,33,0.10);border-radius:12px;
          padding:12px 14px;cursor:pointer;
          display:flex;align-items:center;gap:10px;
          transition:border-color .18s,background .18s,box-shadow .18s;
          background:#fff;
        }
        .role-option:hover{border-color:rgba(33,33,33,0.22);background:rgba(33,33,33,0.02)}
        .role-option.selected-admin{border-color:#7a5c2e;background:#faf7f1;box-shadow:0 0 0 3px rgba(122,92,46,.07)}
        .role-option.selected-user{border-color:#2a3a52;background:#f4f7fb;box-shadow:0 0 0 3px rgba(42,58,82,.07)}
        .role-option.selected-owner{border-color:#92400e;background:#faf4eb;box-shadow:0 0 0 3px rgba(146,64,14,.07)}
        .role-option.selected-supplier{border-color:#5b21b6;background:#f5f3ff;box-shadow:0 0 0 3px rgba(91,33,182,.07)}

        .role-radio{
          width:17px;height:17px;border-radius:50%;border:2px solid rgba(33,33,33,0.20);
          flex-shrink:0;display:flex;align-items:center;justify-content:center;
          transition:border-color .15s,background .15s;
        }
        .role-option.selected-admin .role-radio{border-color:#7a5c2e;background:#7a5c2e}
        .role-option.selected-user  .role-radio{border-color:#2a3a52;background:#2a3a52}
        .role-option.selected-owner .role-radio{border-color:#92400e;background:#92400e}
        .role-option.selected-supplier .role-radio{border-color:#5b21b6;background:#5b21b6}

        /* Toggle switch */
        .toggle-switch{
          width:44px;height:24px;border-radius:99px;border:none;cursor:pointer;
          position:relative;transition:background .25s;flex-shrink:0;
        }
        .toggle-switch.on {background:#2d6a3f}
        .toggle-switch.off{background:rgba(33,33,33,0.18)}
        .toggle-knob{
          position:absolute;top:3px;width:18px;height:18px;border-radius:50%;
          background:#fff;transition:left .22s cubic-bezier(.22,1,.36,1);
          box-shadow:0 1px 4px rgba(0,0,0,0.16);
        }
        .toggle-switch.on  .toggle-knob{left:23px}
        .toggle-switch.off .toggle-knob{left:3px}

        /* Card */
        .form-card{
          background:#fff;border:1px solid rgba(33,33,33,0.08);border-radius:18px;
          box-shadow:0 4px 20px rgba(33,33,33,0.05);overflow:hidden;
        }

        /* Avatar preview */
        .avatar-preview{
          width:80px;height:80px;border-radius:22px;
          display:flex;align-items:center;justify-content:center;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:28px;
          flex-shrink:0;transition:transform .3s cubic-bezier(.22,1,.36,1);
        }
        .avatar-preview:hover{transform:scale(1.06) rotate(3deg)}

        /* Success overlay */
        .success-overlay{
          position:fixed;inset:0;z-index:100;
          display:flex;align-items:center;justify-content:center;
          background:rgba(255,255,255,0.82);backdrop-filter:blur(12px);
          animation:fadeIn .2s ease both;
        }
        .success-box{
          display:flex;flex-direction:column;align-items:center;gap:14px;
          animation:scaleIn .35s cubic-bezier(.22,1,.36,1) both;
        }
        .success-check{
          width:64px;height:64px;border-radius:20px;background:#CFDECA;
          display:flex;align-items:center;justify-content:center;
          animation:checkPop .4s cubic-bezier(.22,1,.36,1) .1s both;
        }

        /* Spinner */
        .spinner{
          width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);
          border-top-color:#fff;border-radius:50%;
          animation:spin .7s linear infinite;
        }

        /* Dirty indicator */
        .dirty-dot{
          width:7px;height:7px;border-radius:50%;background:#EFF0A3;
          box-shadow:0 0 0 2px rgba(239,240,163,0.3);
          animation:pulse 2s ease-in-out infinite;
        }
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.85)}}

        .section-divider{height:1px;background:rgba(33,33,33,0.07);margin:0 -1px}
      `}</style>

      <div className={`min-h-screen font-['Inter'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F4F4F5" }}>

        <Header hasNotification={false} userInitials={currentUser.initials} />

        <section className="w-full relative overflow-hidden pt-14 pb-8 sm:pt-18 sm:pb-10"
          style={{ background: "linear-gradient(155deg, #f5f0e8 0%, #ede8da 50%, #f9f7f2 100%)" }}>
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-25 blob pointer-events-none"
            style={{ background: "#e8d5a3", filter: "blur(64px)" }} />
          <div className="absolute -bottom-14 -left-14 w-60 h-60 rounded-full opacity-18 blob2 pointer-events-none"
            style={{ background: "#CFDECA", filter: "blur(52px)" }} />

          <Inner>
            <div className="anim-fade-up flex items-center gap-2 mb-5 text-[11px] font-medium flex-wrap"
              style={{ color: "rgba(80,65,40,0.45)" }}>
              <Link href="/dashboard" className="hover:text-[#2a1f08] transition-colors">Dashboard</Link>
              <span>/</span>
              <Link href="/user" className="hover:text-[#2a1f08] transition-colors">User</Link>
              <span>/</span>
              <span style={{ color: "#2a1f08" }} className="font-semibold">Edit</span>
            </div>

            <div className="anim-fade-up d100 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="avatar-preview" style={{ background: avatarS.bg, color: avatarS.color }}>
                  {previewInitials.slice(0, 2)}
                </div>
                <div>
                  <p className="text-[10px] tracking-[.18em] uppercase font-semibold mb-1"
                    style={{ color: "rgba(80,65,40,0.42)" }}>Edit User</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2rem] leading-none"
                    style={{ color: "#2a1f08" }}>
                    {originalUser.nama}
                    {isSelf && (
                      <span className="ml-2 text-[11px] font-bold px-2 py-0.5 rounded-lg align-middle"
                        style={{ background: "#EFF0A3", color: "#5a6a00", verticalAlign: "middle" }}>
                        Kamu
                      </span>
                    )}
                  </h1>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "rgba(80,65,40,0.40)" }}>
                      <IconMail size={10} color="rgba(80,65,40,0.35)" />
                      {originalUser.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "rgba(80,65,40,0.40)" }}>
                      <IconCalendar size={10} color="rgba(80,65,40,0.35)" />
                      Bergabung {originalUser.bergabung}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isDirty && !saved && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(42,31,8,0.08)" }}>
                    <div className="dirty-dot" />
                    <p className="text-[10.5px] font-semibold" style={{ color: "rgba(80,65,40,0.60)" }}>Ada perubahan belum disimpan</p>
                  </div>
                )}
                <Link href="/user">
                  <button className="btn-ghost text-[12.5px]">
                    <IconChevronLeft size={13} /> Kembali
                  </button>
                </Link>
              </div>
            </div>
          </Inner>
        </section>

        <section className="w-full py-8 sm:py-10">
          <Inner>
            <div className="flex flex-col lg:flex-row gap-5 items-start">

              <div className="flex-1 min-w-0 flex flex-col gap-5">

                <div className="anim-fade-up d150 form-card">
                  <div className="px-6 py-4 flex items-center gap-3 border-b" style={{ borderColor: "rgba(33,33,33,0.07)" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "#e8dfc8" }}>
                      <IconUser size={14} color="#7a5c2e" />
                    </div>
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-black text-[14px] text-[#212121]">Informasi Dasar</p>
                      <p className="text-[10.5px] font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>Nama dan alamat email user</p>
                    </div>
                  </div>
                  <div className="px-6 py-5 flex flex-col gap-4">
                    <div className="field-wrap">
                      <label className="field-label">
                        <IconUser size={11} color="rgba(33,33,33,0.45)" /> Nama Lengkap
                      </label>
                      <input
                        className={`field-input ${errors.nama ? "has-error" : ""}`}
                        value={nama}
                        onChange={e => { setNama(e.target.value); setErrors(p => ({ ...p, nama: undefined })); }}
                        placeholder="Contoh: Budi Santoso"
                      />
                      {errors.nama && (
                        <p className="field-error"><IconAlertCircle size={12} color="#dc2626" />{errors.nama}</p>
                      )}
                    </div>

                    <div className="field-wrap">
                      <label className="field-label">
                        <IconMail size={11} color="rgba(33,33,33,0.45)" /> Email
                      </label>
                      <input
                        className={`field-input ${errors.email ? "has-error" : ""}`}
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                        placeholder="email@inventix.id"
                      />
                      {errors.email && (
                        <p className="field-error"><IconAlertCircle size={12} color="#dc2626" />{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="anim-fade-up d200 form-card">
                  <div className="px-6 py-4 flex items-center gap-3 border-b" style={{ borderColor: "rgba(33,33,33,0.07)" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "#D8DFE9" }}>
                      <IconLock size={14} color="#2a3a52" />
                    </div>
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-black text-[14px] text-[#212121]">Password</p>
                      <p className="text-[10.5px] font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>Kosongkan jika tidak ingin mengubah password</p>
                    </div>
                  </div>
                  <div className="px-6 py-5 flex flex-col gap-4">
                    <div className="field-wrap">
                      <label className="field-label">
                        <IconLock size={11} color="rgba(33,33,33,0.45)" /> Password Baru
                      </label>
                      <div className="pass-wrap">
                        <input
                          className={`field-input ${errors.password ? "has-error" : ""}`}
                          type={showPass ? "text" : "password"}
                          value={password}
                          onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined, konfirmasi: undefined })); }}
                          placeholder="Min. 8 karakter"
                          style={{ paddingRight: 40 }}
                        />
                        <button className="pass-toggle" type="button" onClick={() => setShowPass(v => !v)}>
                          {showPass ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="field-error"><IconAlertCircle size={12} color="#dc2626" />{errors.password}</p>
                      )}
                      {password && !errors.password && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {[4,6,8].map(n => (
                            <div key={n} className="flex-1 h-1 rounded-full"
                              style={{ background: password.length >= n ? (n === 8 ? "#2d6a3f" : n === 6 ? "#d4a843" : "#dc2626") : "rgba(33,33,33,0.09)", transition: "background .3s" }} />
                          ))}
                          <p className="text-[10px] font-semibold ml-1"
                            style={{ color: password.length >= 8 ? "#2d6a3f" : password.length >= 6 ? "#d4a843" : "#dc2626" }}>
                            {password.length >= 8 ? "Kuat" : password.length >= 6 ? "Sedang" : "Lemah"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="field-wrap">
                      <label className="field-label">
                        <IconLock size={11} color="rgba(33,33,33,0.45)" /> Konfirmasi Password
                      </label>
                      <div className="pass-wrap">
                        <input
                          className={`field-input ${errors.konfirmasi ? "has-error" : (konfirmasi && konfirmasi === password ? "border-[#2d6a3f]" : "")}`}
                          type={showKonfirm ? "text" : "password"}
                          value={konfirmasi}
                          onChange={e => { setKonfirmasi(e.target.value); setErrors(p => ({ ...p, konfirmasi: undefined })); }}
                          placeholder="Ulangi password baru"
                          style={{ paddingRight: 40 }}
                        />
                        <button className="pass-toggle" type="button" onClick={() => setShowKonfirm(v => !v)}>
                          {showKonfirm ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                        </button>
                      </div>
                      {errors.konfirmasi ? (
                        <p className="field-error"><IconAlertCircle size={12} color="#dc2626" />{errors.konfirmasi}</p>
                      ) : konfirmasi && konfirmasi === password ? (
                        <p className="text-[11px] text-[#2d6a3f] flex items-center gap-1 font-medium mt-0.5">
                          <IconCheck size={11} color="#2d6a3f" /> Password cocok
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

              </div>

              <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-5">

                <div className="anim-fade-up d250 form-card">
                  <div className="px-5 py-4 flex items-center gap-3 border-b" style={{ borderColor: "rgba(33,33,33,0.07)" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "#e8dfc8" }}>
                      <IconShield size={14} color="#7a5c2e" />
                    </div>
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-black text-[13.5px] text-[#212121]">Role</p>
                      <p className="text-[10px] font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>Hak akses user</p>
                    </div>
                  </div>
                  <div className="px-5 py-4 flex flex-col gap-2.5">
                    {[
                      { r: "User" as const, label: "User", sub: "Akses Gudang (lihat & kelola stok)", icon: <IconUser size={11} color="#2a3a52" />, css: "selected-user" },
                      { r: "Admin" as const, label: "Admin", sub: "Akses Pengadaan (CRUD stok, PO)", icon: <IconShield size={11} color="#7a5c2e" />, css: "selected-admin" },
                      { r: "Owner" as const, label: "Owner", sub: "Akses Absolut (semua modul)", icon: <IconCrown size={11} color="#92400e" />, css: "selected-owner" },
                      { r: "Supplier" as const, label: "Supplier", sub: "Akses Supplier Portal (PO saja)", icon: <IconUser size={11} color="#5b21b6" />, css: "selected-supplier" }
                    ].map(({ r, label, sub, icon, css }) => (
                      <button key={r}
                        className={`role-option ${role === r ? css : ""}`}
                        onClick={() => setRole(r)}>
                        <div className="role-radio">
                          {role === r && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {icon}
                            <p className="font-['Plus_Jakarta_Sans'] font-black text-[12.5px]" style={{ color: "#212121" }}>{label}</p>
                          </div>
                          <p className="text-[9.5px] font-medium leading-snug" style={{ color: "rgba(33,33,33,0.40)" }}>
                            {sub}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="anim-fade-up d300 form-card">
                  <div className="px-5 py-4 flex items-center gap-3 border-b" style={{ borderColor: "rgba(33,33,33,0.07)" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: aktif ? "#CFDECA" : "rgba(33,33,33,0.08)" }}>
                      <IconToggle size={14} color={aktif ? "#2d6a3f" : "rgba(33,33,33,0.35)"} />
                    </div>
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-black text-[13.5px] text-[#212121]">Status Akun</p>
                      <p className="text-[10px] font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>Aktifkan atau nonaktifkan akun</p>
                    </div>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] text-[#212121]">
                        {aktif ? "Akun Aktif" : "Akun Nonaktif"}
                      </p>
                      <p className="text-[10.5px] mt-0.5 font-medium" style={{ color: "rgba(33,33,33,0.40)" }}>
                        {aktif ? "User dapat login ke sistem" : "User tidak dapat login"}
                      </p>
                    </div>
                    <button
                      className={`toggle-switch ${aktif ? "on" : "off"}`}
                      onClick={() => setAktif(v => !v)}
                      disabled={isSelf}
                      title={isSelf ? "Tidak bisa menonaktifkan akun sendiri" : undefined}
                      style={isSelf ? { opacity: .4, cursor: "not-allowed" } : {}}>
                      <div className="toggle-knob" />
                    </button>
                  </div>
                  {isSelf && (
                    <div className="px-5 pb-4">
                      <p className="text-[10.5px] font-medium px-3 py-2 rounded-lg"
                        style={{ background: "rgba(33,33,33,0.04)", color: "rgba(33,33,33,0.45)" }}>
                        Tidak bisa menonaktifkan akun yang sedang kamu gunakan.
                      </p>
                    </div>
                  )}
                </div>

                <div className="anim-fade-up d350 form-card">
                  <div className="px-5 py-4 flex flex-col gap-2.5">
                    {errors.submit && (
                      <div className="px-3 py-2.5 border rounded-xl text-[11px] font-semibold text-center mb-1" style={{ borderColor: "#fee2e2", background: "#fef2f2", color: "#991b1b" }}>
                        {errors.submit}
                      </div>
                    )}
                    <button
                      className="btn-primary w-full justify-center"
                      onClick={handleSubmit}
                      disabled={saving || saved || !isDirty}>
                      {saving ? (
                        <><div className="spinner" /> Menyimpan…</>
                      ) : saved ? (
                        <><IconCheck size={14} color="#fff" /> Tersimpan!</>
                      ) : (
                        <><IconSave size={14} color="#fff" /> Simpan Perubahan</>
                      )}
                    </button>
                    <Link href="/user">
                      <button className="btn-ghost w-full justify-center" style={{ fontSize: "12.5px" }}>
                        Batal
                      </button>
                    </Link>
                    {Object.keys(errors).filter(k => k !== "submit").length > 0 && (
                      <p className="text-[11px] text-center font-medium" style={{ color: "#dc2626" }}>
                        Periksa kembali kolom yang merah di atas.
                      </p>
                    )}
                  </div>
                </div>

                <div className="anim-fade-up d350 px-4 py-3 rounded-xl border"
                  style={{ background: "rgba(255,255,255,0.6)", borderColor: "rgba(33,33,33,0.08)" }}>
                  <p className="text-[9.5px] font-bold tracking-[.10em] uppercase mb-2"
                    style={{ color: "rgba(33,33,33,0.30)" }}>Info Akun</p>
                  {[
                    { label: "ID User",         val: `#${originalUser.id.toString().padStart(4, "0")}` },
                    { label: "Bergabung",        val: originalUser.bergabung },
                    { label: "Status awal",      val: originalUser.aktif ? "Aktif" : "Nonaktif" },
                    { label: "Role awal",        val: originalUser.role },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-t first:border-0"
                      style={{ borderColor: "rgba(33,33,33,0.05)" }}>
                      <p className="text-[10.5px] font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>{row.label}</p>
                      <p className="text-[10.5px] font-bold" style={{ color: "rgba(33,33,33,0.60)" }}>{row.val}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </Inner>
        </section>

        <Footer />

        {saved && (
          <div className="success-overlay">
            <div className="success-box">
              <div className="success-check">
                <IconCheck size={30} color="#2d6a3f" />
              </div>
              <div className="text-center">
                <p className="font-['Plus_Jakarta_Sans'] font-black text-xl text-[#212121]">Perubahan Disimpan</p>
                <p className="text-sm mt-1" style={{ color: "rgba(33,33,33,0.45)" }}>Mengarahkan kembali ke halaman user…</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}