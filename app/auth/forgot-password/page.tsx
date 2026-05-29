"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const LOGO_URL = "/logo-inventix.png";

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#212121] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto select-none font-sans opacity-100 scale-100">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet" />

      <div className="bg-white rounded-2xl border border-[#D8DFE9] p-8 sm:p-10 md:p-12 max-w-md w-full shadow-xl space-y-6 transition-all duration-300">
        
        <div className="flex items-center gap-3 justify-center">
          <img src={LOGO_URL} alt="Logo" className="w-6 h-6 object-contain rounded-md" />
          <span className="font-['Plus_Jakarta_Sans'] font-black tracking-widest text-xs text-[#212121]">INVENTIX</span>
        </div>

        {!isSubmitted ? (
          <>
            <div className="space-y-2 text-center">
              <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-3xl text-[#212121] tracking-tight">
                Pemulihan Sandi
              </h1>
              <p className="font-['Inter'] text-sm text-[#212121]/60">
                Masukkan email Anda untuk menerima tautan pengaturan ulang kata sandi.
              </p>
            </div>

            <form onSubmit={handleResetRequest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-['Inter'] font-semibold text-xs text-[#212121]/80">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full font-['Inter'] text-sm bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-4 py-3 text-[#212121] placeholder-[#212121]/30 focus:outline-none focus:border-[#212121] focus:bg-white transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full font-['Inter'] font-bold text-sm bg-[#212121] text-[#F6F5FA] py-3 rounded-xl shadow-md hover:bg-[#212121]/90 transition-all active:scale-[0.98] mt-2"
              >
                Kirim Tautan Pemulihan
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-3 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#CFDECA] text-[#212121] flex items-center justify-center mx-auto shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl text-[#212121] tracking-tight">
              Periksa Email Anda
            </h1>
            <p className="font-['Inter'] text-sm text-[#212121]/60 leading-relaxed">
              Kami telah mengirimkan instruksi perubahan kata sandi ke <strong className="text-[#212121]">{email}</strong>.
            </p>
          </div>
        )}

        <div className="pt-2 text-center border-t border-[#D8DFE9]/60">
          <button 
            type="button"
            onClick={() => router.push("/auth/login")}
            className="inline-flex items-center gap-2 font-['Inter'] font-bold text-sm text-[#212121] hover:text-[#212121]/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Login
          </button>
        </div>

      </div>
    </div>
  );
}