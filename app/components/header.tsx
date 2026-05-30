"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { label: "Stock",     href: "/stock"     },
  { label: "Penjualan", href: "/penjualan" },
  { label: "Supplier",  href: "/supplier"  },
  { label: "User",      href: "/user"      },
];

interface HeaderProps {
  userInitials?: string;
  hasNotification?: boolean;
}

export default function Header({
  userInitials = "AR",
  hasNotification = false,
}: HeaderProps) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [isScrolled,    setIsScrolled]    = useState(false);
  const [openMenu,      setOpenMenu]      = useState(false);
  const [openProfile,   setOpenProfile]   = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/auth/login");
  };

  const isNotifActive = pathname === "/notification";

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .profile-dropdown { animation:dropIn 0.22s cubic-bezier(.22,1,.36,1) both; }
        .dd-item {
          display:flex; align-items:center; gap:10px;
          padding:8px 12px; border-radius:10px;
          font-size:12px; font-weight:600;
          color:rgba(33,33,33,0.70);
          text-decoration:none;
          transition:background .15s, color .15s, transform .18s cubic-bezier(.22,1,.36,1);
          cursor:pointer; border:none; background:none; width:100%; text-align:left;
        }
        .dd-item:hover { background:rgba(33,33,33,0.05); color:#212121; transform:translateX(3px); }
        .dd-item.danger { color:rgba(220,38,38,0.70); }
        .dd-item.danger:hover { background:rgba(254,242,242,0.7); color:#dc2626; }
        .dd-item svg { flex-shrink:0; }
        .notif-btn {
          transition:background .15s, transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s;
          text-decoration: none;
          display: flex; align-items: center; justify-content: center;
        }
        .notif-btn:hover { background:rgba(33,33,33,0.08) !important; transform:scale(1.05); }
        .notif-btn.active { background:rgba(196,181,253,0.20) !important; border-color:rgba(196,181,253,0.6) !important; }
        .avatar-btn { transition:opacity .15s, transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s; }
        .avatar-btn:hover { opacity:0.85; transform:scale(1.05); box-shadow:0 4px 12px rgba(33,33,33,0.18); }
      `}</style>

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/60 backdrop-blur-xl border-b border-black/[0.07] shadow-sm"
            : "bg-[#F6F5FA] border-b border-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-14">

          {/* Left — logo */}
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

          {/* Right */}
          <div className="flex items-center gap-3">

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

            <Link
              href="/notification"
              aria-label="Notifikasi"
              className={`notif-btn relative w-8 h-8 rounded-full border border-black/10 bg-black/[0.03] ${isNotifActive ? "active" : ""}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                className={isNotifActive ? "text-[#7C5CBF]" : "text-[#212121]/60"}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {hasNotification && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
              )}
            </Link>

            {/* Avatar + dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                aria-label="Profil"
                aria-expanded={openProfile}
                onClick={() => setOpenProfile(!openProfile)}
                className="avatar-btn w-8 h-8 rounded-full bg-[#212121] flex items-center justify-center"
              >
                <span className="text-white text-[10px] font-bold tracking-wide">
                  {userInitials}
                </span>
              </button>

              {/* Dropdown */}
              {openProfile && (
                <div className="profile-dropdown absolute right-0 mt-2 w-52 border rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(20px)",
                    borderColor: "rgba(33,33,33,0.09)",
                    boxShadow: "0 12px 40px rgba(33,33,33,0.13), 0 2px 8px rgba(33,33,33,0.06)",
                    zIndex: 100,
                  }}>

                  {/* User info */}
                  <div className="px-4 py-3.5" style={{ borderBottom: "1px solid rgba(33,33,33,0.07)" }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "#212121" }}>
                        <span className="text-white text-[10px] font-bold">{userInitials}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#212121] truncate">Andi Pratama</p>
                        <p className="text-[10px] font-medium truncate" style={{ color: "rgba(33,33,33,0.38)" }}>
                          andi.pratama@inventix.id
                        </p>
                      </div>
                    </div>
                    <span className="mt-2 inline-block text-[9px] font-bold px-2 py-0.5 rounded-lg"
                      style={{ background: "#212121", color: "#EFF0A3", letterSpacing: "0.04em" }}>
                      Admin
                    </span>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">
                    <Link href="/profile" onClick={() => setOpenProfile(false)} className="dd-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      Lihat Profil
                    </Link>
                    <Link href="/profile/edit" onClick={() => setOpenProfile(false)} className="dd-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit Profil
                    </Link>
                    <Link href="/profile/edit" onClick={() => setOpenProfile(false)} className="dd-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Ganti Password
                    </Link>

                    <div style={{ height: "1px", background: "rgba(33,33,33,0.07)", margin: "4px 0" }} />

                    <button onClick={handleLogout} className="dd-item danger">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

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
            openMenu ? "max-h-72 pb-4" : "max-h-0"
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
            <Link href="/notification" onClick={() => setOpenMenu(false)}
              className={`text-sm font-medium ${pathname === "/notification" ? "text-[#7C5CBF] font-semibold" : "text-[#212121]/50"}`}>
              Notifikasi
            </Link>
            <Link href="/profile" onClick={() => setOpenMenu(false)}
              className="text-sm font-medium text-[#212121]/50">
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className="text-left text-sm font-medium text-red-500/70 hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}