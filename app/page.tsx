"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingBoarding() {
  const router = useRouter();
  const [phase, setPhase] = useState<"splash" | "boarding">("splash");
  const [splashOut, setSplashOut] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [slideDir, setSlideDir] = useState<"next" | "prev">("next");
  const [slideKey, setSlideKey] = useState(0);

  // Splash sub-phases
  const [logoVisible, setLogoVisible] = useState(false);
  const [wordmarkVisible, setWordmarkVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [rippleVisible, setRippleVisible] = useState(false);
  const [dotsVisible, setDotsVisible] = useState(false);

  const slides = [
    {
      tagline: "INTEGRASI BISNIS CERDAS",
      title: "Satu Aplikasi untuk Semua Mitra Usaha",
      description:
        "Inventix hadir sebagai solusi manajemen modern untuk membantu berbagai lini bisnis dari F&B, ritel, hingga manufaktur dalam mengelola operasional harian secara efisien.",
      bgImage:
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=870&auto=format&fit=crop",
      accent: "bg-[#CFDECA]",
      accentColor: "#CFDECA",
      features: [
        {
          icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          ),
          label: "Multi-gudang",
        },
        {
          icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          ),
          label: "Laporan Real-time",
        },
        {
          icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          ),
          label: "Notifikasi Stok",
        },
      ],
    },
    {
      tagline: "STOK & LOGISTIK EFISIEN",
      title: "Kendali Penuh Stok & Inventaris",
      description:
        "Pantau pergerakan bahan baku, produk jadi, hingga rantai pasok antar gudang atau cabang secara real-time. Minimalisir selisih data dan optimalkan profit bisnis Anda.",
      bgImage:
        "https://images.unsplash.com/photo-1648824572347-517357c9c44e?q=80&w=912&auto=format&fit=crop",
      accent: "bg-[#D8DFE9]",
      accentColor: "#D8DFE9",
      features: [
        {
          icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          ),
          label: "Stok Real-time",
        },
        {
          icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          ),
          label: "Manajemen Supplier",
        },
        {
          icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          ),
          label: "Dashboard Analitik",
        },
      ],
    },
    {
      tagline: "KOLABORASI TIM TANPA HAMBATAN",
      title: "Hubungkan Seluruh Divisi Secara Instan",
      description:
        "Sinergikan kinerja tim operasional, kasir, hingga tim produksi di dapur atau pabrik. Alur kerja otomatis demi kepuasan pelanggan mitra Anda.",
      bgImage:
        "https://plus.unsplash.com/premium_photo-1661274033354-1847f286e957?q=80&w=870&auto=format&fit=crop",
      accent: "bg-[#EFF0A3]",
      accentColor: "#EFF0A3",
      features: [
        {
          icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          ),
          label: "Multi-pengguna",
        },
        {
          icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          ),
          label: "Kontrol Akses",
        },
        {
          icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          ),
          label: "Riwayat Aktivitas",
        },
      ],
    },
  ];

  // Splash orchestration
  useEffect(() => {
    const t1 = setTimeout(() => setRippleVisible(true), 100);
    const t2 = setTimeout(() => setLogoVisible(true), 400);
    const t3 = setTimeout(() => setWordmarkVisible(true), 900);
    const t4 = setTimeout(() => setTaglineVisible(true), 1350);
    const t5 = setTimeout(() => setDotsVisible(true), 1700);
    const t6 = setTimeout(() => setSplashOut(true), 3000);
    const t7 = setTimeout(() => setPhase("boarding"), 3600);
    return () => [t1, t2, t3, t4, t5, t6, t7].forEach(clearTimeout);
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setSlideDir("next");
      setSlideKey(k => k + 1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setSlideDir("prev");
      setSlideKey(k => k + 1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNavigateWithTransition = () => {
    setIsExiting(true);
    setTimeout(() => router.push("/auth/login"), 500);
  };

  // ── SPLASH ──
  if (phase === "splash") {
    return (
      <>
        <style>{`
          @keyframes rippleExpand {
            0%   { transform:scale(0); opacity:0.5; }
            100% { transform:scale(6); opacity:0; }
          }
          @keyframes logoReveal {
            0%   { opacity:0; transform:scale(0.55) rotate(-14deg); filter:blur(10px); }
            65%  { opacity:1; transform:scale(1.07) rotate(2deg); filter:blur(0); }
            100% { opacity:1; transform:scale(1) rotate(0deg); }
          }
          @keyframes wordmarkReveal {
            0%   { opacity:0; transform:translateX(-28px) skewX(-10deg); }
            100% { opacity:1; transform:translateX(0) skewX(0deg); }
          }
          @keyframes taglineFade {
            0%   { opacity:0; transform:translateY(8px); }
            100% { opacity:1; transform:translateY(0); }
          }
          @keyframes dotBounce {
            0%,100% { transform:translateY(0); opacity:0.35; }
            50%     { transform:translateY(-8px); opacity:1; }
          }
          @keyframes splashExit {
            0%   { opacity:1; transform:scale(1); }
            100% { opacity:0; transform:scale(1.06); }
          }
          @keyframes blobFloat {
            0%,100% { transform:translate(0,0) scale(1); }
            33%     { transform:translate(30px,-20px) scale(1.07); }
            66%     { transform:translate(-20px,18px) scale(0.95); }
          }
          @keyframes shimmer {
            0%   { background-position:-400px 0; }
            100% { background-position:400px 0; }
          }
          .splash-exit { animation:splashExit 0.55s cubic-bezier(.4,0,.2,1) both; }
          .logo-anim   { animation:logoReveal 0.72s cubic-bezier(.22,1,.36,1) both; }
          .word-anim   { animation:wordmarkReveal 0.6s cubic-bezier(.22,1,.36,1) both; }
          .tag-anim    { animation:taglineFade 0.5s ease both; }
          .dot-anim    { animation:dotBounce 1.1s ease-in-out infinite; }
          .blob-s1     { animation:blobFloat 8s ease-in-out infinite; }
          .blob-s2     { animation:blobFloat 11s ease-in-out infinite reverse; animation-delay:2s; }
          .blob-s3     { animation:blobFloat 14s ease-in-out infinite; animation-delay:5s; }
          .logo-shine {
            background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.50) 50%,transparent 62%);
            background-size:400px 100%;
            animation:shimmer 2.4s ease-in-out infinite;
            animation-delay:1.1s;
          }
        `}</style>

        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden ${splashOut ? "splash-exit" : ""}`}
          style={{ background: "#0e0c06" }}
        >
          {/* Blobs */}
          <div className="blob-s1 absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, #3d2e0e 0%, transparent 70%)", opacity: 0.55 }} />
          <div className="blob-s2 absolute -bottom-40 -right-40 w-[580px] h-[580px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(207,222,202,0.12) 0%, transparent 70%)" }} />
          <div className="blob-s3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(239,240,163,0.05) 0%, transparent 60%)" }} />

          {/* Ripple rings */}
          {rippleVisible && [0, 1, 2].map(i => (
            <div key={i} className="absolute rounded-full pointer-events-none"
              style={{
                width: 140, height: 140,
                border: "1.5px solid rgba(239,240,163,0.15)",
                animation: `rippleExpand 2.8s cubic-bezier(.2,.6,.4,1) ${i * 0.55}s infinite`,
              }} />
          ))}

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-5 z-10">
            {/* Logo */}
            {logoVisible && (
              <div className="logo-anim relative">
                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(239,240,163,0.12) 0%, transparent 70%)",
                    transform: "scale(2.8)",
                  }} />
                <div className="relative w-[80px] h-[80px] rounded-[24px] flex items-center justify-center overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, #1a1408, #2e2208)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}>
                  {/* The actual Inventix logo */}
                  <img
                    src="/logo-inventix.png"
                    alt="Inventix"
                    className="w-12 h-12 object-contain relative z-10"
                    style={{ filter: "brightness(1.05)" }}
                  />
                  {/* Shine overlay */}
                  <div className="logo-shine absolute inset-0 z-20 rounded-[24px]" />
                </div>
              </div>
            )}

            {/* Wordmark + tagline */}
            <div className="flex flex-col items-center gap-2">
              {wordmarkVisible && (
                <span className="word-anim font-['Plus_Jakarta_Sans'] font-black text-[30px] sm:text-[36px] tracking-[0.18em] text-[#F9F9FA]">
                  inventix
                </span>
              )}
              {taglineVisible && (
                <span className="tag-anim font-['Inter'] font-medium text-[11px] tracking-[0.16em] uppercase"
                  style={{ color: "rgba(249,249,250,0.30)" }}>
                  Sistem Manajemen Inventaris
                </span>
              )}
            </div>

            {/* Loading dots */}
            {dotsVisible && (
              <div className="flex items-center gap-2 mt-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="dot-anim w-1.5 h-1.5 rounded-full"
                    style={{ background: "#EFF0A3", animationDelay: `${i * 0.18}s`, opacity: 0.35 }} />
                ))}
              </div>
            )}
          </div>

          {/* Version */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <span className="font-['Inter'] text-[10px] tracking-widest" style={{ color: "rgba(249,249,250,0.12)" }}>
              v1.0.0
            </span>
          </div>
        </div>
      </>
    );
  }

  // ── BOARDING ──
  return (
    <>
      <style>{`
        @keyframes boardingIn {
          0%   { opacity:0; transform:scale(1.03); }
          100% { opacity:1; transform:scale(1); }
        }
        @keyframes slideInNext {
          0%   { opacity:0; transform:translateX(36px); }
          100% { opacity:1; transform:translateX(0); }
        }
        @keyframes slideInPrev {
          0%   { opacity:0; transform:translateX(-36px); }
          100% { opacity:1; transform:translateX(0); }
        }
        @keyframes imageReveal {
          0%   { opacity:0; transform:scale(1.06); }
          100% { opacity:1; transform:scale(1); }
        }
        @keyframes fadeUp {
          0%   { opacity:0; transform:translateY(16px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes blobFloat {
          0%,100% { transform:translate(0,0) scale(1); }
          33%     { transform:translate(30px,-20px) scale(1.07); }
          66%     { transform:translate(-20px,18px) scale(0.95); }
        }

        .boarding-in { animation:boardingIn 0.65s cubic-bezier(.22,1,.36,1) both; }
        .slide-next  { animation:slideInNext 0.48s cubic-bezier(.22,1,.36,1) both; }
        .slide-prev  { animation:slideInPrev 0.48s cubic-bezier(.22,1,.36,1) both; }
        .img-reveal  { animation:imageReveal 0.75s cubic-bezier(.22,1,.36,1) both; }
        .fu-d1       { animation:fadeUp 0.55s cubic-bezier(.22,1,.36,1) 0.05s both; }
        .fu-d2       { animation:fadeUp 0.55s cubic-bezier(.22,1,.36,1) 0.12s both; }

        .blob-b1 { animation:blobFloat 9s ease-in-out infinite; }
        .blob-b2 { animation:blobFloat 12s ease-in-out infinite reverse; animation-delay:3s; }

        .btn-lanjut {
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:13px;
          background:#212121; color:#F6F5FA;
          padding:11px 22px; border-radius:14px; border:none; cursor:pointer;
          transition:transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s, background .18s;
          display:inline-flex; align-items:center; gap:7px;
          box-shadow:0 4px 16px rgba(33,33,33,0.20);
        }
        .btn-lanjut:hover { transform:translateY(-2px) scale(1.04); box-shadow:0 10px 28px rgba(33,33,33,0.28); background:#2d2d2d; }
        .btn-lanjut:active { transform:scale(0.97); }

        .btn-mulai {
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; font-size:13px;
          background:#EFF0A3; color:#212121;
          padding:11px 22px; border-radius:14px; border:1.5px solid rgba(33,33,33,0.14); cursor:pointer;
          transition:transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s, background .18s;
          display:inline-flex; align-items:center; gap:7px;
          box-shadow:0 4px 16px rgba(239,240,163,0.28);
        }
        .btn-mulai:hover { transform:translateY(-2px) scale(1.04); box-shadow:0 10px 28px rgba(239,240,163,0.38); background:#CFDECA; }
        .btn-mulai:active { transform:scale(0.97); }

        .btn-kembali {
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; font-size:13px;
          background:rgba(33,33,33,0.06); color:rgba(33,33,33,0.50);
          padding:11px 18px; border-radius:14px; border:none; cursor:pointer;
          transition:background .18s, color .18s, transform .2s;
          display:inline-flex; align-items:center;
        }
        .btn-kembali:hover { background:rgba(33,33,33,0.11); color:#212121; transform:scale(1.03); }

        .dot-indicator {
          height:5px; border-radius:999px;
          transition:all 0.35s cubic-bezier(.22,1,.36,1);
          cursor:pointer;
        }

        .feat-pill {
          background:rgba(255,255,255,0.55);
          border:1px solid rgba(33,33,33,0.07);
          border-radius:10px;
          padding:8px 12px;
          font-family:'Inter',sans-serif;
          font-size:11px;
          font-weight:600;
          color:rgba(33,33,33,0.58);
          display:inline-flex; align-items:center; gap:6px;
          transition:transform .22s cubic-bezier(.22,1,.36,1), background .18s;
        }
        .feat-pill:hover { transform:translateY(-2px); background:rgba(255,255,255,0.88); }
      `}</style>

      <div
        className={`min-h-screen boarding-in ${isExiting ? "opacity-0 scale-[1.03]" : "opacity-100"}`}
        style={{ transition: "opacity 0.5s ease, transform 0.5s ease" }}
      >
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 min-h-screen">

          {/* ── LEFT PANEL ── */}
          <div className="h-[60vh] md:h-screen flex flex-col justify-between relative overflow-hidden"
            style={{ background: "linear-gradient(160deg, #f5f0e8 0%, #ede8da 50%, #f9f7f2 100%)" }}>

            <div className="blob-b1 absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "#e8d5a3", filter: "blur(70px)", opacity: 0.35 }} />
            <div className="blob-b2 absolute bottom-0 -left-16 w-52 h-52 rounded-full pointer-events-none"
              style={{ background: "#CFDECA", filter: "blur(55px)", opacity: 0.25 }} />

            {/* Header */}
            <div className="fu-d1 flex items-center justify-between px-8 sm:px-12 lg:px-16 pt-8 sm:pt-10 flex-shrink-0 relative z-10">
              <div className="flex items-center gap-3">
                {/* Logo mark with actual Inventix logo */}
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, #1a1408, #2e2208)",
                    boxShadow: "0 3px 12px rgba(42,31,8,0.30)",
                  }}>
                  <img
                    src="/logo-inventix.png"
                    alt="Inventix"
                    className="w-5 h-5 object-contain"
                    style={{ filter: "brightness(1.05)" }}
                  />
                </div>
                <span className="font-['Plus_Jakarta_Sans'] font-black tracking-[0.18em] text-[13px] text-[#2a1f08]">
                  inventix
                </span>
              </div>
              <button onClick={handleNavigateWithTransition}
                className="font-['Inter'] font-semibold text-[11px] text-[#2a1f08]/40 hover:text-[#2a1f08] transition-colors py-1.5 px-3.5 rounded-xl hover:bg-[#2a1f08]/08">
                Lewati
              </button>
            </div>

            {/* Slide content */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-6 relative z-10 overflow-hidden">
              <div
                key={`slide-${slideKey}`}
                className={slideDir === "next" ? "slide-next" : "slide-prev"}
              >
                {/* Accent tag */}
                <div className="mb-5">
                  <span className={`inline-block font-['Inter'] font-bold text-[10px] tracking-[0.18em] text-[#212121] ${slides[currentSlide].accent} px-3 py-1.5 rounded-lg`}>
                    {slides[currentSlide].tagline}
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-3xl lg:text-[2.35rem] text-[#2a1f08] leading-[1.18] tracking-tight mb-4">
                  {slides[currentSlide].title}
                </h1>

                {/* Description */}
                <p className="font-['Inter'] font-normal text-[#212121]/55 text-sm sm:text-[15px] leading-relaxed mb-6 max-w-md">
                  {slides[currentSlide].description}
                </p>

                {/* Feature pills with SVG icons */}
                <div className="flex flex-wrap gap-2">
                  {slides[currentSlide].features.map((f) => (
                    <div key={f.label} className="feat-pill">
                      {f.icon}
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="px-8 sm:px-12 lg:px-16 pb-8 sm:pb-10 relative z-10">
              <div className="border-t pt-5 flex items-center justify-between" style={{ borderColor: "rgba(42,31,8,0.12)" }}>
                {/* Dots */}
                <div className="flex gap-1.5 items-center">
                  {slides.map((_, index) => (
                    <div
                      key={index}
                      className="dot-indicator"
                      onClick={() => {
                        setSlideDir(index > currentSlide ? "next" : "prev");
                        setSlideKey(k => k + 1);
                        setCurrentSlide(index);
                      }}
                      style={{
                        width: index === currentSlide ? 28 : 6,
                        background: index === currentSlide ? "#2a1f08" : "rgba(42,31,8,0.18)",
                      }}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  {currentSlide > 0 && (
                    <button className="btn-kembali" onClick={handlePrev}>Kembali</button>
                  )}
                  {currentSlide < slides.length - 1 ? (
                    <button className="btn-lanjut" onClick={handleNext}>
                      Lanjut
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </button>
                  ) : (
                    <button className="btn-mulai" onClick={handleNavigateWithTransition}>
                      Mulai Sekarang
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="hidden md:block h-screen relative overflow-hidden">
            <div
              key={`img-${currentSlide}`}
              className="img-reveal absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[currentSlide].bgImage})` }}
            />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.40) 100%)" }} />

            {/* Floating card */}
            <div className="absolute bottom-10 left-8 right-8 z-10">
              <div
                key={`card-${currentSlide}`}
                className="slide-next p-5 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(22px)",
                  border: "1px solid rgba(255,255,255,0.20)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
                }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#EFF0A3", animation: "pulse 2s infinite" }} />
                  <span className="font-['Inter'] font-bold text-[10px] tracking-[0.16em] text-white/65 uppercase">
                    {slides[currentSlide].tagline}
                  </span>
                </div>
                <p className="font-['Plus_Jakarta_Sans'] font-bold text-white text-sm sm:text-[15px] leading-snug">
                  {slides[currentSlide].title}
                </p>
              </div>
            </div>

            {/* Counter */}
            <div className="absolute top-8 right-8 z-10">
              <span className="font-['Inter'] font-semibold text-[11px] text-white/38">
                {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}