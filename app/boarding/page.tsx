"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const pageMap: Record<string, { title: string; crumb: string[] }> = {
  "/dashboard": { title: "Dashboard", crumb: [] },
  "/stock": { title: "Stok Barang", crumb: ["Stock"] },
  "/stock/tambah": { title: "Tambah Barang", crumb: ["Stock", "Tambah"] },
  "/penjualan": { title: "Penjualan", crumb: ["Penjualan"] },
  "/penjualan/tambah": { title: "Tambah Penjualan", crumb: ["Penjualan", "Tambah"] },
  "/supplier": { title: "Supplier", crumb: ["Supplier"] },
  "/supplier/tambah": { title: "Tambah Supplier", crumb: ["Supplier", "Tambah"] },
  "/user": { title: "Manajemen User", crumb: ["User"] },
  "/user/tambah": { title: "Tambah User", crumb: ["User", "Tambah"] },
};

function getPageMeta(pathname: string) {
  if (pageMap[pathname]) return pageMap[pathname];

  const editMatch = pathname.match(/^(\/[^/]+)\/edit\/[^/]+$/);
  if (editMatch) {
    const section = editMatch[1].replace("/", "");
    const sectionLabel = section.charAt(0).toUpperCase() + section.slice(1);
    return { title: `Edit ${sectionLabel}`, crumb: [sectionLabel, "Edit"] };
  }

  return { title: "Dashboard", crumb: [] };
}

interface HeaderProps {
  userInitials?: string;
  hasNotification?: boolean;
}

export default function Header({
  userInitials = "AR",
  hasNotification = false,
}: HeaderProps) {
  const pathname = usePathname();
  const { title, crumb } = getPageMeta(pathname);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-black/[0.06] shadow-sm"
          : "bg-[#F6F5FA] border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 h-14">

        {/* Left — logo + divider + page info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo-inventix.png"
              alt="Inventix"
              className="w-8 h-8 rounded-lg object-contain"
            />
            <span className="font-black tracking-[0.18em] text-[11px] text-[#212121]">
              INVENTIX
            </span>
          </div>

          <div className="w-px h-5 bg-black/10" />

          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-[#212121] leading-none">
              {title}
            </span>
            {crumb.length > 0 && (
              <div className="flex items-center gap-1 leading-none">
                <span className="text-[10px] text-[#212121]/40">Inventix</span>
                {crumb.map((c) => (
                  <span key={c} className="flex items-center gap-1">
                    <span className="text-[10px] text-[#212121]/25">›</span>
                    <span className="text-[10px] text-[#212121]/40">{c}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — notif + avatar */}
        <div className="flex items-center gap-2.5">
          <button
            aria-label="Notifikasi"
            className="relative w-8 h-8 rounded-full border border-black/10 bg-black/[0.03] flex items-center justify-center hover:bg-black/[0.06] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#212121]/60"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {hasNotification && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
            )}
          </button>

          <button
            aria-label="Profil"
            className="w-8 h-8 rounded-full bg-[#212121] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <span className="text-white text-[10px] font-bold tracking-wide">
              {userInitials}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}