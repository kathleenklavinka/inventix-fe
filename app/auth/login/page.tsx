"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getRedirectByRole,
  COOKIE_TOKEN,
  COOKIE_ROLE,
  COOKIE_NAME,
} from "@/lib/auth";
import { api, mapRoleToFrontend } from "@/lib/api";

export default function AuthLogin() {
  const router     = useRouter();
  const LOGO_URL   = "/logo-inventix.png";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.auth.login({ email, password });
      const { token, user } = response.data;
      const mappedRole = mapRoleToFrontend(user.peran);

      const maxAge = 86400;
      document.cookie = `${COOKIE_TOKEN}=${token}; path=/; max-age=${maxAge}`;
      document.cookie = `${COOKIE_ROLE}=${mappedRole}; path=/; max-age=${maxAge}`;
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(user.nama)}; path=/; max-age=${maxAge}`;

      window.location.href = getRedirectByRole(mappedRole);
    } catch (err: any) {
      setError(err.message || "Email atau password salah!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#212121] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto select-none font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet" />

      <div className="bg-white rounded-2xl border border-[#D8DFE9] p-8 sm:p-10 md:p-12 max-w-md w-full shadow-xl space-y-6">

        {/* Logo */}
        <div className="flex items-center gap-3 justify-center">
          <img src={LOGO_URL} alt="Logo" className="w-6 h-6 object-contain rounded-md" />
          <span className="font-['Plus_Jakarta_Sans'] font-black tracking-widest text-xs text-[#212121]">
            INVENTIX
          </span>
        </div>

        {/* Heading */}
        <div className="space-y-2 text-center">
          <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-3xl text-[#212121] tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className="font-['Inter'] text-sm text-[#212121]/60">
            Masukkan kredensial Anda!
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-['Inter'] rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-['Inter'] font-semibold text-xs text-[#212121]/80">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.com"
              className="w-full font-['Inter'] text-sm bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-4 py-3 text-[#212121] placeholder-[#212121]/30 focus:outline-none focus:border-[#212121] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-['Inter'] font-semibold text-xs text-[#212121]/80">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => router.push("/auth/forgot-password")}
                className="font-['Inter'] text-xs font-medium text-[#212121]/50 hover:text-[#212121] transition-colors"
              >
                Lupa sandi?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full font-['Inter'] text-sm bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-4 py-3 text-[#212121] placeholder-[#212121]/30 focus:outline-none focus:border-[#212121] focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full font-['Inter'] font-bold text-sm bg-[#212121] text-[#F6F5FA] py-3 rounded-xl shadow-md hover:bg-[#212121]/90 transition-all active:scale-[0.98] mt-2"
          >
            Masuk ke Aplikasi
          </button>
        </form>

        {/* Register link */}
        <p className="font-['Inter'] text-center text-sm text-[#212121]/60 pt-2">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/register")}
            className="font-bold text-[#212121] underline hover:text-[#212121]/80 transition-colors"
          >
            Daftar
          </button>
        </p>

      </div>
    </div>
  );
}