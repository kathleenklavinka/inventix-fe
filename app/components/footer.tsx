"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerCols = [
  {
    title: "Navigasi",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Stok Barang", href: "/stock" },
      { label: "Penjualan", href: "/penjualan" },
      { label: "Supplier", href: "/supplier" },
    ],
  },
  {
    title: "Manajemen",
    links: [
      { label: "Tambah Barang", href: "/stock/tambah" },
      { label: "Tambah Penjualan", href: "/penjualan/tambah" },
      { label: "Tambah Supplier", href: "/supplier/tambah" },
      { label: "Manajemen User", href: "/user" },
    ],
  },
  {
    title: "Akun",
    links: [
      { label: "Profil", href: "/profil" },
      { label: "Pengaturan", href: "/settings" },
      { label: "Keluar", href: "/auth/login" },
    ],
  },
];

const bottomLinks = [
  { label: "Kebijakan Privasi", href: "#" },
  { label: "Syarat Penggunaan", href: "#" },
  { label: "Bantuan", href: "#" },
];

const slideThemes = [
  { bg: "#CFDECA" },
  { bg: "#D8DFE9" },
  { bg: "#EFF0A3" },
];

interface FooterProps {
  currentSlide?: number;
}

export default function Footer({ currentSlide }: FooterProps) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/" || pathname === "/boarding";

  const bg =
    isOnboarding && currentSlide !== undefined
      ? (slideThemes[currentSlide]?.bg ?? "#F6F5FA")
      : "#F6F5FA";

  const year = new Date().getFullYear();

  return (
    <footer style={{ background: bg }} className="border-t border-[#212121]/[0.08] transition-colors duration-500">

      {/* Main footer body */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand col */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
            <Link href="/dashboard" className="flex items-center gap-2.5 w-fit">
              <Image
                src="/logo-inventix.png"
                alt="Inventix"
                width={32}
                height={32}
                className="rounded-lg object-contain"
              />
              <span className="font-['Plus_Jakarta_Sans'] font-black tracking-[0.18em] text-[11px] text-[#212121]">
                INVENTIX
              </span>
            </Link>
            <p className="font-['Inter'] text-xs text-[#212121]/45 leading-relaxed max-w-[200px]">
              Solusi manajemen inventaris modern untuk bisnis yang lebih efisien.
            </p>
            {/* Status badge */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="relative flex h-1.5 w-1.5">
              </span>
            </div>
          </div>

          {/* Link cols */}
          {footerCols.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] tracking-[0.12em] text-[#212121] uppercase">
                {col.title}
              </p>
              <div className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-['Inter'] text-xs text-[#212121]/45 hover:text-[#212121] transition-colors w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#212121]/[0.07]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-['Inter'] text-[11px] text-[#212121]/30">
            © {year} Inventix. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-5">
            {bottomLinks.map((link, i) => (
              <span key={i} className="flex items-center gap-4 sm:gap-5">
                <Link
                  href={link.href}
                  className="font-['Inter'] text-[11px] text-[#212121]/35 hover:text-[#212121] transition-colors"
                >
                  {link.label}
                </Link>
                {i < bottomLinks.length - 1 && (
                  <span className="w-px h-3 bg-[#212121]/15" />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}