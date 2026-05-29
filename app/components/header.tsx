"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Stock", href: "/stock" },
  { label: "Penjualan", href: "/penjualan" },
  { label: "Supplier", href: "/supplier" },
  { label: "User", href: "/user" },
];

interface HeaderProps {
  userInitials?: string;
  hasNotification?: boolean;
}

export default function Header({
  userInitials = "AR",
  hasNotification = false,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/auth/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/60 backdrop-blur-xl border-b border-black/[0.07] shadow-sm"
          : "bg-[#F6F5FA] border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 h-14">

        {/* Left — logo only */}
        <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
          <Image
            src="/logo-inventix.png"
            alt="Inventix"
            width={32}
            height={32}
            className="rounded-lg object-contain"
          />
          <span className="font-black tracking-[0.18em] text-[11px] text-[#212121]">
            INVENTIX
          </span>
        </Link>

        {/* Right — nav + notif + avatar + logout */}
        <div className="flex items-center gap-4">

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#212121] text-white"
                      : "text-[#212121]/50 hover:text-[#212121] hover:bg-black/[0.05]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block w-px h-5 bg-black/10" />

          {/* Notif */}
          <button
            aria-label="Notifikasi"
            className="relative w-8 h-8 rounded-full border border-black/10 bg-black/[0.03] flex items-center justify-center hover:bg-black/[0.06] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#212121]/60">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {hasNotification && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
            )}
          </button>

          {/* Avatar */}
          <button
            aria-label="Profil"
            className="w-8 h-8 rounded-full bg-[#212121] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <span className="text-white text-[10px] font-bold tracking-wide">
              {userInitials}
            </span>
          </button>

          {/* Logout — desktop */}
          <button
            onClick={handleLogout}
            className="hidden md:block text-xs font-medium text-[#212121]/40 hover:text-[#212121] transition-colors"
          >
            Logout
          </button>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden text-xl text-[#212121]"
            onClick={() => setOpenMenu(!openMenu)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          openMenu ? "max-h-64 pb-4" : "max-h-0"
        } ${isScrolled ? "bg-white/60 backdrop-blur-xl" : "bg-[#F6F5FA]"}`}
      >
        <nav className="flex flex-col px-6 gap-3 pt-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpenMenu(false)}
                className={`text-sm font-medium ${
                  isActive ? "text-[#212121] font-semibold" : "text-[#212121]/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="text-left text-sm font-medium text-red-500/70 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}