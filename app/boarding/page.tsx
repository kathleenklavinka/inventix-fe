"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingBoarding() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [isExiting, setIsExiting] = useState(false);

  const LOGO_URL = "/logo-inventix.png"; 

  const slides = [
    {
      tagline: "INTEGRASI BISNIS CERDAS",
      title: "Satu Aplikasi untuk Semua Mitra Usaha",
      description: "Inventix hadir sebagai solusi manajemen modern untuk membantu berbagai lini bisnis—dari F&B, ritel, hingga manufaktur—dalam mengelola operasional harian secara efisien.",
      bgImage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      accent: "bg-[#CFDECA]"
    },
    {
      tagline: "STOK & LOGISTIK EFISIEN",
      title: "Kendali Penuh Stok & Inventaris",
      description: "Pantau pergerakan bahan baku, produk jadi, hingga rantai pasok antar gudang atau cabang secara real-time. Minimalisir selisih data dan optimalkan profit bisnis Anda.",
      bgImage: "https://images.unsplash.com/photo-1648824572347-517357c9c44e?q=80&w=912&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      accent: "bg-[#D8DFE9]"
    },
    {
      tagline: "KOLABORASI TIM TANPA HAMBATAN",
      title: "Hubungkan Seluruh Divisi Secara Instan",
      description: "Sinergikan kinerja tim operasional, kasir, hingga tim produksi di dapur atau pabrik. Alur kerja otomatis demi kepuasan pelanggan mitra Anda.",
      bgImage: "https://plus.unsplash.com/premium_photo-1661274033354-1847f286e957?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      accent: "bg-[#EFF0A3]"
    }
  ];

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 2000);

    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNavigateWithTransition = () => {
    setIsExiting(true); // Aktifkan animasi keluar
    
    setTimeout(() => {
      router.push("/auth/login");
    }, 500);
  };

  return (
    <div className={`min-h-screen max-h-screen bg-[#F6F5FA] text-[#212121] relative overflow-hidden select-none font-sans transition-all duration-500 ease-in-out ${isExiting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet" />

      {showSplash && (
        <div className={`absolute inset-0 bg-[#212121] flex flex-col items-center justify-center z-50 transition-all duration-500 ease-in-out ${fadeSplash ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"}`}>
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <img 
              src={LOGO_URL} 
              alt="Logo Inventix" 
              className="w-20 h-20 object-contain rounded-xl shadow-2xl"
            />
            <h1 className="font-['Plus_Jakarta_Sans'] font-black tracking-[0.2em] text-2xl text-[#F6F5FA] pt-3 ml-[0.2em]">
              INVENTIX
            </h1>
          </div>
          <p className="absolute bottom-10 font-['Inter'] text-xs text-[#F6F5FA]/40 tracking-widest uppercase text-center px-4">
            Selamat Datang di Inventix - Solusi Manajemen Bisnis untuk Usaha Anda
          </p>
        </div>
      )}

      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        
        {/* SISI KIRI: KONTEN UTAMA */}
        <div className="h-[60vh] md:h-screen p-8 sm:p-12 lg:p-20 flex flex-col justify-between bg-[#F6F5FA] z-10 relative">
          
          <div className="flex items-center justify-between w-full flex-shrink-0">
            <div className="flex items-center gap-3">
              <img 
                src={LOGO_URL} 
                alt="Logo" 
                className="w-7 h-7 object-contain rounded-md"
              />
              <span className="font-['Plus_Jakarta_Sans'] font-black tracking-widest text-sm text-[#212121]">INVENTIX</span>
            </div>

            <button 
              onClick={handleNavigateWithTransition}
              className="font-['Inter'] font-semibold text-xs text-[#212121]/50 hover:text-[#212121] transition-colors py-1 px-3 rounded-lg hover:bg-[#D8DFE9]/30"
            >
              Lewati
            </button>
          </div>

          <div className="max-w-md space-y-4 md:space-y-6 my-auto py-4 overflow-y-auto max-h-[35vh] md:max-h-[55vh] scrollbar-none" key={`text-${currentSlide}`}>
            <div>
              <span className={`inline-block font-['Inter'] font-bold text-[10px] tracking-widest text-[#212121] ${slides[currentSlide].accent} px-3 py-1 rounded-md transition-all duration-300`}>
                {slides[currentSlide].tagline}
              </span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] font-black text-3xl sm:text-4xl lg:text-5xl text-[#212121] leading-[1.15] tracking-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="font-['Inter'] font-normal text-[#212121]/60 text-sm sm:text-base md:text-lg leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </div>

          <div className="border-t border-[#D8DFE9] pt-6 flex items-center justify-between flex-shrink-0 bg-[#F6F5FA]">
            <div className="flex gap-1.5">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "w-8 bg-[#212121]" : "w-1.5 bg-[#D8DFE9]"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentSlide > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="font-['Inter'] font-semibold text-xs sm:text-sm text-[#212121]/60 px-4 py-2.5 rounded-xl hover:bg-[#D8DFE9]/40 transition-colors"
                >
                  Kembali
                </button>
              )}

              {currentSlide < slides.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="font-['Inter'] font-semibold text-xs sm:text-sm bg-[#212121] text-[#F6F5FA] px-5 py-2.5 rounded-xl hover:bg-[#212121]/90 transition-colors shadow-md"
                >
                  Lanjut
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNavigateWithTransition}
                  className="font-['Inter'] font-bold text-xs sm:text-sm bg-[#EFF0A3] text-[#212121] border border-[#212121]/20 px-5 py-2.5 rounded-xl hover:bg-[#CFDECA] transition-colors shadow-md"
                >
                  Mulai Sekarang
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="h-[40vh] md:h-screen w-full relative bg-[#D8DFE9] overflow-hidden order-first md:order-last">
          <img
            key={`img-${currentSlide}`}
            src={slides[currentSlide].bgImage}
            alt="Presentasi Universal Inventix"
            className="w-full h-full object-cover object-center transition-all duration-500 opacity-100"
          />
          <div className="absolute inset-0 bg-[#212121]/5 pointer-events-none" />
        </div>

      </div>
    </div>
  );
}