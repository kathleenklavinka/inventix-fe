"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api, mapRoleToFrontend } from "@/lib/api";

const HARI  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

// SVG ICONS ──
const IconBox = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconReceipt = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconFactory = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
    <path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>
  </svg>
);

const IconUsers = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconAlertTriangle = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconEdit = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconSale = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const IconSupplier = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const IconUserPlus = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

const IconWarning = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconArrowRight = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconTrendUp = ({ size = 10, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const IconTrendDown = ({ size = 10, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
);

const IconMinus = ({ size = 10, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconCheck = ({ size = 10, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CARD_ICONS = [
  <IconBox size={20} color="#2a3a52" />,
  <IconReceipt size={20} color="#2d6a3f" />,
  <IconFactory size={20} color="#7a6a10" />,
  <IconUsers size={20} color="#2a3a52" />,
];

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  edit:     <IconEdit size={14} color="#7a6a10" />,
  sale:     <IconSale size={14} color="#2d6a3f" />,
  supplier: <IconSupplier size={14} color="#2a3a52" />,
  user:     <IconUserPlus size={14} color="#2a3a52" />,
  warning:  <IconWarning size={14} color="#dc2626" />,
};

function formatActivityAction(namaTabel: string, aksi: string): string {
  const t = namaTabel?.toLowerCase();
  const a = aksi?.toLowerCase();

  let actionStr = "";
  if (a === "buat") actionStr = "ditambahkan";
  else if (a === "edit") actionStr = "diperbarui";
  else if (a === "hapus") actionStr = "dihapus";
  else actionStr = "berubah";

  let tableStr = "";
  if (t === "stok") tableStr = "Stok barang";
  else if (t === "supplier") tableStr = "Supplier";
  else if (t === "purchaseorder" || t === "purchase_order") tableStr = "Purchase Order";
  else if (t === "pembeliantransaksi" || t === "pembelian_transaksi") tableStr = "Transaksi";
  else if (t === "akun") tableStr = "User";
  else tableStr = namaTabel || "Sistem";

  return `${tableStr} ${actionStr}`;
}

function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return "–";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDays === 1) return "Kemarin";
  return `${diffDays} hari lalu`;
}

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [animCards, setAnimCards] = useState(false);

  const [user, setUser] = useState({ nama: "Memuat...", role: "...", initials: "??" });
  const [summaryCards, setSummaryCards] = useState<any[]>([
    { label: "Total Item Stok",    value: "0",      trend: "memuat...",  trendUp: null,  bg: "#D8DFE9", progress: 0 },
    { label: "Penjualan Hari Ini", value: "Rp 0",   trend: "memuat...",  trendUp: null,  bg: "#CFDECA", progress: 0 },
    { label: "Jumlah Supplier",    value: "0",      trend: "memuat...",  trendUp: null,  bg: "#EFF0A3", progress: 0 },
    { label: "Jumlah User",        value: "0",      trend: "memuat...",  trendUp: null,  bg: "#D8DFE9", progress: 0 },
  ]);

  const [stokTerbaru, setStokTerbaru] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [salesChart, setSalesChart] = useState<any[]>([]);
  const [topBarang, setTopBarang] = useState<any[]>([]);
  
  const adaStokHabis = stokTerbaru.some(item => item.jumlah === 0);
  const totalPenjualan = salesChart.reduce((a, b) => a + b.val, 0);
  const maxVal = Math.max(...salesChart.map(d => d.val), 1);

  const loadDashboardData = async () => {
    try {
      const resProfile = await api.akun.profile();
      const profile = resProfile.data;
      const fRole = mapRoleToFrontend(profile.peran);
      setUser({
        nama: profile.nama || "User",
        role: fRole.charAt(0).toUpperCase() + fRole.slice(1),
        initials: profile.nama ? profile.nama.split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("") : "??"
      });

      // Load other datasets
      const [resStok, resSupplier, resAkun, resTrans, resAktivitas] = await Promise.all([
        api.stok.getAll().catch(() => ({ data: [] })),
        api.supplier.getAll().catch(() => ({ data: [] })),
        api.akun.getAll().catch(() => ({ data: [] })),
        api.pembelianTransaksi.getAll().catch(() => ({ data: [] })),
        api.riwayatAktivitas.getAll().catch(() => ({ data: [] })),
      ]);

      // 1. summary cards
      const totalStok = resStok.data.length;
      const totalSupplier = resSupplier.data.length;
      const totalAkun = resAkun.data.length;

      // calculate sales today
      const todayString = new Date().toDateString();
      let salesToday = 0;
      let salesYesterday = 0;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      resTrans.data.forEach((item: any) => {
        const itemVal = item.jumlah * (item.stok?.harga || 15000);
        const itemDateStr = new Date(item.dibuat_pada).toDateString();
        if (item.jenis === "keluar") {
          if (itemDateStr === todayString) {
            salesToday += itemVal;
          } else if (itemDateStr === yesterdayString) {
            salesYesterday += itemVal;
          }
        }
      });

      const salesTodayFormatted = salesToday > 1000000
        ? `Rp ${(salesToday / 1000000).toFixed(1).replace(".", ",")}jt`
        : `Rp ${salesToday.toLocaleString("id-ID")}`;

      const saleTrendUp = salesToday >= salesYesterday;
      const salePercentDiff = salesYesterday > 0
        ? Math.round((Math.abs(salesToday - salesYesterday) / salesYesterday) * 100)
        : 0;

      setSummaryCards([
        {
          label: "Total Item Stok",
          value: String(totalStok),
          trend: `naik ${Math.min(4, totalStok)} item minggu ini`,
          trendUp: true,
          bg: "#D8DFE9",
          progress: Math.min(100, Math.round((totalStok / 150) * 100))
        },
        {
          label: "Penjualan Hari Ini",
          value: salesTodayFormatted,
          trend: salePercentDiff > 0 ? `${salePercentDiff}% vs kemarin` : "sama seperti kemarin",
          trendUp: salesToday === salesYesterday ? null : saleTrendUp,
          bg: "#CFDECA",
          progress: Math.min(100, Math.round((salesToday / 5000000) * 100))
        },
        {
          label: "Jumlah Supplier",
          value: String(totalSupplier),
          trend: "mitra aktif terdaftar",
          trendUp: null,
          bg: "#EFF0A3",
          progress: Math.min(100, Math.round((totalSupplier / 25) * 100))
        },
        {
          label: "Jumlah User",
          value: String(totalAkun),
          trend: "akses gudang & admin",
          trendUp: true,
          bg: "#D8DFE9",
          progress: Math.min(100, Math.round((totalAkun / 10) * 100))
        },
      ]);

      // 2. stok terbaru (tabel)
      const formattedStok = resStok.data.slice(0, 5).map((item: any) => ({
        nama: item.nama,
        jumlah: item.jumlah_saat_ini,
        satuan: item.satuan || "pcs",
        harga: item.harga ? `Rp ${item.harga.toLocaleString("id-ID")}` : "Rp 15.000",
        max: Math.max(item.jumlah_saat_ini * 2, 100)
      }));
      setStokTerbaru(formattedStok);

      // 3. recent activity feed
      const formattedActivity = resAktivitas.data.slice(0, 5).map((item: any) => {
        const t = item.nama_tabel?.toLowerCase();
        const a = item.aksi?.toLowerCase();
        let type = "edit";
        let color = "#D8DFE9";

        if (a === "hapus") {
          type = "warning";
          color = "#fee2e2";
        } else if (t === "stok") {
          type = "edit";
          color = "#EFF0A3";
        } else if (t === "pembeliantransaksi" || t === "pembelian_transaksi") {
          type = "sale";
          color = "#CFDECA";
        } else if (t === "supplier") {
          type = "supplier";
          color = "#D8DFE9";
        } else if (t === "akun") {
          type = "user";
          color = "#D8DFE9";
        }

        return {
          action: formatActivityAction(item.nama_tabel, item.aksi),
          time: formatTimeAgo(item.dilakukan_pada),
          color,
          type
        };
      });
      setRecentActivity(formattedActivity);

      // 4. sales chart (last 7 days)
      const DAYS_ABBR = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = DAYS_ABBR[d.getDay()];
        const dayString = d.toDateString();

        let dayTotal = 0;
        resTrans.data.forEach((item: any) => {
          if (item.jenis === "keluar" && new Date(item.dibuat_pada).toDateString() === dayString) {
            dayTotal += item.jumlah * (item.stok?.harga || 15000);
          }
        });

        chartData.push({
          day: dayName,
          val: parseFloat((dayTotal / 1000000).toFixed(1)),
        });
      }
      setSalesChart(chartData);

      // 5. top barang terjual
      const itemSales: Record<string, { nama: string; terjual: number; satuan: string }> = {};
      resTrans.data.forEach((item: any) => {
        if (item.jenis === "keluar" && item.stok) {
          const name = item.stok.nama;
          if (!itemSales[name]) {
            itemSales[name] = { nama: name, terjual: 0, satuan: item.stok.satuan || "pcs" };
          }
          itemSales[name].terjual += item.jumlah;
        }
      });
      const sortedTop = Object.values(itemSales)
        .sort((a, b) => b.terjual - a.terjual)
        .slice(0, 4);

      const maxTerjual = sortedTop[0]?.terjual || 1;
      const mappedTopBarang = sortedTop.map(item => ({
        ...item,
        pct: Math.round((item.terjual / maxTerjual) * 100),
      }));

      // fallback top barang if transactions are empty
      if (mappedTopBarang.length === 0) {
        setTopBarang([
          { nama: "Kopi Arabika",  terjual: 0,  satuan: "kg",  pct: 0 },
          { nama: "Susu UHT",      terjual: 0,  satuan: "pcs", pct: 0 },
          { nama: "Gula Pasir",    terjual: 0,  satuan: "kg",  pct: 0 },
        ]);
      } else {
        setTopBarang(mappedTopBarang);
      }
      
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTanggal(`${HARI[now.getDay()]} , ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setJam(`${hh}:${mm}`);
    };
    update();
    const iv = setInterval(update, 1000);
    loadDashboardData();
    setTimeout(() => { setMounted(true); setAnimCards(true); }, 150);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blob {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(40px,-30px) scale(1.07); }
          66%      { transform:translate(-25px,25px) scale(0.95); }
        }

        .anim-fade-up { animation:fadeUp 0.6s cubic-bezier(.22,1,.36,1) both; }
        .d50{animation-delay:.05s}.d100{animation-delay:.10s}.d150{animation-delay:.15s}
        .d200{animation-delay:.20s}.d250{animation-delay:.25s}.d300{animation-delay:.30s}
        .d350{animation-delay:.35s}.d400{animation-delay:.40s}.d450{animation-delay:.45s}
        .d500{animation-delay:.50s}.d550{animation-delay:.55s}.d600{animation-delay:.60s}

        .blob  { animation:blob 9s ease-in-out infinite; }
        .blob2 { animation:blob 12s ease-in-out infinite reverse; animation-delay:3s; }
        .blob3 { animation:blob 15s ease-in-out infinite; animation-delay:6s; }

        .progress-bar { transition:width 1.4s cubic-bezier(.22,1,.36,1); }

        .zoom-card {
          transition:transform .30s cubic-bezier(.22,1,.36,1), box-shadow .30s cubic-bezier(.22,1,.36,1);
          will-change:transform; cursor:default;
        }
        .zoom-card:hover { transform:scale(1.018); box-shadow:0 20px 48px rgba(33,33,33,0.10); }

        .sum-card {
          transition:transform .30s cubic-bezier(.22,1,.36,1), box-shadow .30s cubic-bezier(.22,1,.36,1);
          will-change:transform; cursor:pointer;
        }
        .sum-card:hover { transform:scale(1.055) translateY(-4px); box-shadow:0 18px 40px rgba(33,33,33,0.12); }
        .sum-card:hover .card-icon { transform:scale(1.15) rotate(6deg); }

        .card-icon { transition:transform .28s cubic-bezier(.22,1,.36,1); }

        .act-row {
          border-radius:12px;
          transition:background .18s, transform .25s cubic-bezier(.22,1,.36,1), box-shadow .22s;
        }
        .act-row:hover { background:rgba(255,255,255,0.70); transform:translateX(6px) scale(1.015); box-shadow:0 4px 14px rgba(33,33,33,0.07); }
        .act-row:hover .act-icon { transform:scale(1.18) rotate(6deg); }
        .act-icon { transition:transform .28s cubic-bezier(.22,1,.36,1); }

        .tbl-row { transition:background .18s, transform .22s cubic-bezier(.22,1,.36,1); }
        .tbl-row:hover { background:rgba(255,255,255,0.65) !important; transform:scale(1.012) translateX(3px); }

        .stat-item:hover .stat-num { transform:scale(1.20); }
        .stat-num { display:inline-block; transition:transform .22s cubic-bezier(.22,1,.36,1); }

        .bar-col { transition:height .55s cubic-bezier(.22,1,.36,1), background .2s; }
        .bar-wrap { transition:transform .22s cubic-bezier(.22,1,.36,1); }
        .bar-wrap:hover { transform:scaleY(1.06); transform-origin:bottom; }

        .welcome-card {
          transition:box-shadow .30s cubic-bezier(.22,1,.36,1), transform .30s cubic-bezier(.22,1,.36,1);
        }
        .welcome-card:hover { transform:translateY(-3px); box-shadow:0 16px 48px rgba(33,33,33,0.09); }
      `}</style>

      <div
        className={`min-h-screen text-[#212121] font-['Inter'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F9F9FA" }}>

        <Header hasNotification={adaStokHabis} userInitials={user.initials} />

        <main className="w-full">

          {/* HERO */}
          <section className="w-full relative overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-14"
            style={{ background: "linear-gradient(175deg, #D8DFE9 0%, #e8ecf2 40%, #ffffff 100%)" }}>
            <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full opacity-25 blob pointer-events-none" style={{ background: "#CFDECA", filter: "blur(72px)" }} />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-18 blob2 pointer-events-none" style={{ background: "#EFF0A3", filter: "blur(60px)" }} />
            <div className="absolute top-1/2 left-1/3 w-[480px] h-32 rounded-full opacity-10 blob3 pointer-events-none" style={{ background: "#D8DFE9", filter: "blur(80px)" }} />

            <Inner>
              {/* Welcome card */}
              <div className="anim-fade-up welcome-card relative z-10 border px-6 sm:px-10 py-7 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                style={{ background: "rgba(255,255,255,0.78)", backdropFilter: "blur(18px)", borderColor: "rgba(255,255,255,0.9)", borderRadius: "20px", boxShadow: "0 4px 24px rgba(33,33,33,0.07), inset 0 1px 0 rgba(255,255,255,0.9)" }}>

                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full"
                  style={{ background: "linear-gradient(180deg, #D8DFE9, #CFDECA, #EFF0A3)", borderRadius: "0 4px 4px 0" }} />

                <div className="pl-3">
                  <p className="text-[10px] sm:text-[11px] tracking-[0.20em] uppercase mb-1.5 font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>
                    Selamat datang kembali
                  </p>
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                    <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.4rem] leading-none text-[#212121]">
                      {user.nama}
                    </h1>
                    <span className="font-bold text-[10px] sm:text-xs px-3 py-1"
                      style={{ background: "#212121", color: "#EFF0A3", borderRadius: "8px", letterSpacing: "0.04em" }}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(33,33,33,0.32)" }}>{tanggal}</p>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-5 sm:gap-2.5">
                  <div className="font-['Plus_Jakarta_Sans'] font-black tabular-nums tracking-tight text-[#212121]"
                    style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", lineHeight: 1 }}>
                    {jam}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600">Sistem normal</span>
                  </div>
                </div>
              </div>

              {/* Stok habis banner */}
              {adaStokHabis && (
                <div className="anim-fade-up d200 relative z-10 mt-3.5 flex items-center gap-3 px-4 sm:px-5 py-3.5 border"
                  style={{ background: "rgba(254,242,242,0.85)", backdropFilter: "blur(8px)", borderColor: "rgba(248,113,113,0.25)", borderRadius: "14px" }}>
                  <span className="flex-shrink-0"><IconAlertTriangle size={16} color="#dc2626" /></span>
                  <p className="text-xs sm:text-sm font-medium text-red-600">
                    Terdapat <span className="font-bold">{stokTerbaru.filter(d => d.jumlah === 0).length} barang</span> dengan stok habis. Segera lakukan restok.
                  </p>
                  <Link href="/stock"
                    className="ml-auto text-[10px] sm:text-xs font-bold px-3 py-1.5 border transition-all flex-shrink-0 hover:bg-red-50 active:scale-95 flex items-center gap-1"
                    style={{ color: "#dc2626", borderColor: "rgba(248,113,113,0.35)", borderRadius: "9px" }}>
                    Cek Stok <IconArrowRight size={10} color="#dc2626" />
                  </Link>
                </div>
              )}
            </Inner>
          </section>

          {/* SUMMARY CARDS */}
          <section className="w-full relative overflow-hidden py-10 sm:py-12" style={{ background: "#FFFFFF" }}>
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20 blob pointer-events-none" style={{ background: "#CFDECA", filter: "blur(44px)" }} />
            <Inner>
              <p className="anim-fade-up d100 text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase mb-6" style={{ color: "rgba(33,33,33,0.32)" }}>
                Ringkasan
              </p>
              {loading ? (
                <div className="text-center py-8 text-sm text-[rgba(33,33,33,0.35)] font-semibold">Memuat metrik ringkasan...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {summaryCards.map((card, i) => (
                    <div key={i}
                      className={`anim-fade-up d${(i + 1) * 100 + 100} sum-card p-4 sm:p-5 flex flex-col gap-3 relative overflow-hidden border`}
                      style={{ background: card.bg, borderColor: "rgba(255,255,255,0.65)", borderRadius: "18px" }}>
                      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/25 pointer-events-none" />
                      <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-white/18 pointer-events-none" />

                      <div className="flex items-start justify-between relative z-10">
                        <div className="card-icon w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.50)" }}>
                          {CARD_ICONS[i]}
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          card.trendUp === true  ? "bg-emerald-100 text-emerald-700" :
                          card.trendUp === false ? "bg-red-100 text-red-600" :
                          "bg-white/45 text-[#212121]/45"}`}>
                          {card.trendUp === true  ? <><IconTrendUp size={9} color="#059669" /> naik</> :
                           card.trendUp === false ? <><IconTrendDown size={9} color="#dc2626" /> turun</> :
                           <><IconMinus size={9} color="rgba(33,33,33,0.45)" /> tetap</>}
                        </span>
                      </div>

                      <div className="relative z-10">
                        <p className="font-['Plus_Jakarta_Sans'] font-black text-xl sm:text-2xl text-[#212121] leading-tight">{card.value}</p>
                        <p className="text-[10px] sm:text-[11px] mt-0.5 font-medium" style={{ color: "rgba(33,33,33,0.52)" }}>{card.label}</p>
                      </div>

                      <div className="relative z-10">
                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.45)" }}>
                          <div className="h-full rounded-full progress-bar" style={{ width: animCards ? `${card.progress}%` : "0%", background: "rgba(33,33,33,0.22)" }} />
                        </div>
                        <p className="text-[9px] mt-1.5 font-medium" style={{ color: "rgba(33,33,33,0.38)" }}>{card.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Inner>
          </section>

          {/* CHART + ACTIVITY */}
          <section className="w-full relative overflow-hidden py-10 sm:py-12" style={{ background: "#edf5f0" }}>
            <div className="absolute -top-10 -left-10 w-[500px] h-[500px] rounded-full pointer-events-none blob" style={{ background: "#7ecb8f", opacity: 0.22, filter: "blur(70px)" }} />
            <div className="absolute -top-10 right-0 w-[360px] h-[360px] rounded-full pointer-events-none blob3" style={{ background: "#a8c4d8", opacity: 0.20, filter: "blur(55px)" }} />
            <div className="absolute bottom-0 left-1/2 w-[340px] h-[280px] rounded-full pointer-events-none blob2" style={{ background: "#6db8d4", opacity: 0.15, filter: "blur(60px)" }} />

            <Inner className="relative z-10">
              <p className="anim-fade-up d200 text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase mb-6" style={{ color: "rgba(33,33,33,0.38)" }}>
                Penjualan & Aktivitas
              </p>
              {loading ? (
                <div className="text-center py-10 text-sm text-[rgba(33,33,33,0.38)] font-semibold">Memuat chart & aktivitas terbaru...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">

                  {/* Bar Chart */}
                  <div className="anim-fade-up d300 sm:col-span-3 zoom-card p-5 sm:p-7 border"
                    style={{ background: "rgba(255,255,255,0.42)", backdropFilter: "blur(22px)", borderColor: "rgba(255,255,255,0.85)", borderRadius: "18px", boxShadow: "0 8px 32px rgba(33,33,33,0.08), inset 0 1px 0 rgba(255,255,255,0.95)" }}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-[15px] text-[#212121]">Penjualan 7 Hari</h2>
                        <p className="text-[11px] mt-0.5" style={{ color: "rgba(33,33,33,0.38)" }}>
                          Total: <span className="font-semibold text-[#212121]">Rp {totalPenjualan.toFixed(1).replace(".", ",")}jt</span>
                        </p>
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <IconTrendUp size={10} color="#059669" /> +18%
                      </span>
                    </div>
                    <div className="flex items-end gap-2 sm:gap-3.5" style={{ height: "120px" }}>
                      {salesChart.map((d, i) => {
                        const heightPct = (d.val / maxVal) * 100;
                        const isHovered = hoveredBar === i;
                        const isToday = i === salesChart.length - 1;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 cursor-pointer group bar-wrap"
                            onMouseEnter={() => setHoveredBar(i)}
                            onMouseLeave={() => setHoveredBar(null)}>
                            <span className={`text-[9px] sm:text-[10px] font-bold text-[#212121] transition-all duration-200 ${isHovered ? "opacity-100 scale-110" : "opacity-0"}`}>
                              {d.val}jt
                            </span>
                            <div className="w-full flex items-end rounded-t-xl overflow-hidden" style={{ height: "86px" }}>
                              <div className="w-full rounded-t-xl bar-col"
                                style={{
                                  height: animCards ? `${heightPct}%` : "4%",
                                  transitionDelay: `${i * 60}ms`,
                                  background: isToday ? "#212121" : isHovered ? "rgba(33,33,33,0.30)" : "rgba(216,223,233,0.7)",
                                }} />
                            </div>
                            <span className={`text-[9px] sm:text-[10px] font-medium transition-colors ${isToday ? "font-bold text-[#212121]" : "text-[#212121]/30 group-hover:text-[#212121]/65"}`}>
                              {d.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="anim-fade-up d400 sm:col-span-2 zoom-card p-5 sm:p-6 border"
                    style={{ background: "rgba(255,255,255,0.38)", backdropFilter: "blur(22px)", borderColor: "rgba(255,255,255,0.85)", borderRadius: "18px", boxShadow: "0 8px 32px rgba(33,33,33,0.08), inset 0 1px 0 rgba(255,255,255,0.95)" }}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-[15px] text-[#212121]">Aktivitas</h2>
                      <span className="text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ color: "rgba(33,33,33,0.38)", background: "rgba(33,33,33,0.06)" }}>Live</span>
                    </div>
                    <div className="space-y-1">
                      {recentActivity.length === 0 ? (
                        <div className="text-center py-10 text-xs text-[rgba(33,33,33,0.35)] font-semibold">Belum ada aktivitas.</div>
                      ) : (
                        recentActivity.map((item, i) => (
                          <div key={i} className="anim-fade-up act-row flex items-center gap-3 px-2.5 py-2.5 cursor-default"
                            style={{ animationDelay: `${0.4 + i * 0.07}s` }}>
                            <div className="act-icon w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: item.color }}>
                              {ACTIVITY_ICONS[item.type] || ACTIVITY_ICONS.edit}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] sm:text-xs font-semibold text-[#212121] truncate">{item.action}</p>
                              <p className="text-[9px] sm:text-[10px] font-medium mt-0.5" style={{ color: "rgba(33,33,33,0.32)" }}>{item.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Inner>
          </section>

          {/* TOP BARANG + STOK */}
          <section className="w-full relative overflow-hidden py-10 sm:py-12" style={{ background: "#FFFFFF" }}>
            <Inner className="relative z-10">
              <p className="anim-fade-up d300 text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase mb-6" style={{ color: "rgba(33,33,33,0.32)" }}>
                Stok & Penjualan
              </p>
              {loading ? (
                <div className="text-center py-10 text-sm text-[rgba(33,33,33,0.38)] font-semibold">Memuat stok barang...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">

                  {/* Top Barang */}
                  <div className="anim-fade-up d350 sm:col-span-2 zoom-card p-5 sm:p-6 border"
                    style={{ background: "rgba(255,255,255,0.42)", backdropFilter: "blur(22px)", borderColor: "rgba(255,255,255,0.88)", borderRadius: "18px", boxShadow: "0 8px 32px rgba(33,33,33,0.07), inset 0 1px 0 rgba(255,255,255,0.95)" }}>
                    <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-[15px] text-[#212121] mb-5">Top Barang Terjual</h2>
                    <div className="space-y-4">
                      {topBarang.map((item, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="font-['Plus_Jakarta_Sans'] font-black text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: i === 0 ? "#212121" : "rgba(33,33,33,0.09)", color: i === 0 ? "#EFF0A3" : "rgba(33,33,33,0.35)", fontSize: "10px" }}>
                                {i + 1}
                              </span>
                              <span className="text-[11px] sm:text-xs font-semibold text-[#212121]">{item.nama}</span>
                            </div>
                            <span className="text-[10px] font-medium" style={{ color: "rgba(33,33,33,0.45)" }}>{item.terjual} {item.satuan}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(33,33,33,0.07)" }}>
                            <div className="h-full rounded-full progress-bar"
                              style={{
                                width: animCards ? `${item.pct}%` : "0%",
                                background: i === 0 ? "#212121" : i === 1 ? "#CFDECA" : i === 2 ? "#D8DFE9" : "#EFF0A3",
                                transitionDelay: `${i * 110}ms`,
                              }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tabel Stok */}
                  <div className="anim-fade-up d450 sm:col-span-3 zoom-card overflow-hidden border"
                    style={{ background: "rgba(255,255,255,0.38)", backdropFilter: "blur(22px)", borderColor: "rgba(255,255,255,0.88)", borderRadius: "18px", boxShadow: "0 8px 32px rgba(33,33,33,0.07), inset 0 1px 0 rgba(255,255,255,0.95)" }}>
                    <div className="px-5 sm:px-7 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(33,33,33,0.07)" }}>
                      <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-[15px] text-[#212121]">Ringkasan Stok</h2>
                      <Link href="/stock" className="text-[10px] sm:text-xs font-bold transition-colors hover:text-[#212121] active:scale-95 flex items-center gap-1"
                        style={{ color: "rgba(33,33,33,0.32)" }}>
                        Lihat semua <IconArrowRight size={10} color="rgba(33,33,33,0.32)" />
                      </Link>
                    </div>

                    {/* Mobile */}
                    <div className="sm:hidden divide-y" style={{ borderColor: "rgba(33,33,33,0.06)" }}>
                      {stokTerbaru.map((item, i) => (
                        <div key={i} className="tbl-row px-5 py-3.5 flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs text-[#212121] truncate">{item.nama}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(33,33,33,0.08)" }}>
                                <div className={`h-full rounded-full progress-bar ${item.jumlah === 0 ? "bg-red-400" : "bg-[#CFDECA]"}`}
                                  style={{ width: animCards ? `${(item.jumlah / item.max) * 100}%` : "0%" }} />
                              </div>
                              <span className="text-[9px] font-medium flex-shrink-0" style={{ color: "rgba(33,33,33,0.38)" }}>{item.jumlah}/{item.max}</span>
                            </div>
                          </div>
                          {item.jumlah === 0
                            ? <span className="bg-red-100 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 flex-shrink-0"><IconAlertTriangle size={8} color="#dc2626" /> Habis</span>
                            : <span className="bg-[#CFDECA] text-[#212121] text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 flex-shrink-0"><IconCheck size={8} color="#2d6a3f" /> Tersedia</span>
                          }
                        </div>
                      ))}
                    </div>

                    {/* Desktop */}
                    <div className="hidden sm:block overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ background: "rgba(33,33,33,0.025)" }}>
                            {["Barang","Stok","Harga","Status"].map(h => (
                              <th key={h} className="px-6 py-3.5 font-bold text-[10px] text-left tracking-[0.08em] uppercase" style={{ color: "rgba(33,33,33,0.35)" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {stokTerbaru.map((item, i) => (
                            <tr key={i} className="tbl-row" style={{ borderTop: "1px solid rgba(33,33,33,0.05)" }}>
                              <td className="px-6 py-4 font-semibold text-[#212121] text-xs sm:text-sm">{item.nama}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(33,33,33,0.09)" }}>
                                    <div className={`h-full rounded-full progress-bar ${item.jumlah === 0 ? "bg-red-400" : item.jumlah / item.max < 0.3 ? "bg-[#EFF0A3]" : "bg-[#CFDECA]"}`}
                                      style={{ width: animCards ? `${(item.jumlah / item.max) * 100}%` : "0%", transitionDelay: `${i * 80}ms` }} />
                                  </div>
                                  <span className="text-xs font-medium" style={{ color: "rgba(33,33,33,0.55)" }}>{item.jumlah} {item.satuan}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs font-medium" style={{ color: "rgba(33,33,33,0.55)" }}>{item.harga}</td>
                              <td className="px-6 py-4">
                                {item.jumlah === 0
                                  ? <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1"><IconAlertTriangle size={9} color="#dc2626" /> Habis</span>
                                  : item.jumlah / item.max < 0.3
                                  ? <span className="bg-[#EFF0A3] text-[#212121] text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1"><IconAlertTriangle size={9} color="#92650a" /> Menipis</span>
                                  : <span className="bg-[#CFDECA] text-[#212121] text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1"><IconCheck size={9} color="#2d6a3f" /> Tersedia</span>
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </Inner>
          </section>

          {/* STAT BAR */}
          <section className="w-full relative overflow-hidden py-5 sm:py-6" style={{ background: "#212121" }}>
            <Inner>
              <div className="anim-fade-up d550 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
                  {[
                    { val: "99.8%", label: "Uptime sistem",      danger: false },
                    { val: "0.2s",  label: "Avg response",        danger: false },
                    { val: `${salesChart[salesChart.length-1]?.val > 0 ? "Aktif" : "Normal"}`, label: "Aktivitas hari ini",  danger: false },
                    { val: `${stokTerbaru.filter(d => d.jumlah === 0).length}`, label: "Stok habis", danger: stokTerbaru.some(d => d.jumlah === 0) },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 sm:gap-8">
                      {i > 0 && <div className="w-px h-8 hidden sm:block" style={{ background: "rgba(249,249,250,0.08)" }} />}
                      <div className="stat-item text-center cursor-default">
                        <p className={`stat-num font-['Plus_Jakarta_Sans'] font-black text-base sm:text-lg ${stat.danger ? "text-red-400" : ""}`}
                          style={!stat.danger ? { color: "#F9F9FA" } : {}}>
                          {stat.val}
                        </p>
                        <p className="text-[9px] sm:text-[10px] font-medium mt-0.5" style={{ color: "rgba(249,249,250,0.28)" }}>{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] sm:text-[10px] font-medium" style={{ color: "rgba(249,249,250,0.18)" }}>Inventix v1.0 · Diperbarui otomatis</p>
              </div>
            </Inner>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
}