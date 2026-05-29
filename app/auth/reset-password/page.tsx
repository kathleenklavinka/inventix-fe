"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const LOGO_URL = "/logo-inventix.png";

  const [isMounted, setIsMounted] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Kata sandi baru dan konfirmasi tidak cocok!");
      return;
    }

    setIsSuccess(true);
  };

  return (
    <div className={`min-h-screen bg-[#F6F5FA] text-[#212121] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto select-none font-sans transition-all duration-700 ease-out ${isMounted ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet" />

      <div className="bg-white rounded-2xl border border-[#D8DFE9] p-8 sm:p-10 md:p-12 max-w-md w-full shadow-xl space-y-6 transition-all duration-300">
        
        <div className="flex items-center gap-3 justify-center">
          <img src={LOGO_URL} alt="Logo" className="w-6 h-6 object-contain rounded-md" />
          <span className="font-['Plus_Jakarta_Sans'] font-black tracking-widest text-xs text-[#212121]">INVENTIX</span>
        </div>

        {!isSuccess ? (
          <>
            <div className="space-y-2 text-center">
              <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-3xl text-[#212121] tracking-tight">
                Atur Ulang Sandi
              </h1>
              <p className="font-['Inter'] text-sm text-[#212121]/60">
                Silakan masukkan kata sandi baru untuk akun Anda.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-['Inter'] font-semibold text-xs text-[#212121]/80">Kata Sandi Baru</label>
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full font-['Inter'] text-sm bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-4 py-3 text-[#212121] placeholder-[#212121]/30 focus:outline-none focus:border-[#212121] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-['Inter'] font-semibold text-xs text-[#212121]/80">Konfirmasi Kata Sandi Baru</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full font-['Inter'] text-sm bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-4 py-3 text-[#212121] placeholder-[#212121]/30 focus:outline-none focus:border-[#212121] focus:bg-white transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full font-['Inter'] font-bold text-sm bg-[#212121] text-[#F6F5FA] py-3 rounded-xl shadow-md hover:bg-[#212121]/90 transition-all active:scale-[0.98] mt-2"
              >
                Perbarui Kata Sandi
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="space-y-3 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#CFDECA] text-[#212121] flex items-center justify-center mx-auto shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl text-[#212121] tracking-tight">
                Sandi Berhasil Diubah
              </h1>
              <p className="font-['Inter'] text-sm text-[#212121]/60 leading-relaxed">
                Kata sandi baru Anda telah aktif. Silakan masuk kembali ke aplikasi menggunakan kredensial baru.
              </p>
              
              <button 
                type="button"
                onClick={() => router.push("/auth/login")}
                className="w-full font-['Inter'] font-bold text-sm bg-[#212121] text-[#F6F5FA] py-3 rounded-xl shadow-md hover:bg-[#212121]/90 transition-all active:scale-[0.98] mt-4 block text-center"
              >
                Login Kembali
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}