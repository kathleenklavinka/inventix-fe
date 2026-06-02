"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { COOKIE_ROLE } from "@/lib/auth";
import { api } from "@/lib/api";

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const IconReport = ({ size = 18, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l7 7v9a2 2 0 0 1-2 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconTrendingUp = ({ size = 18, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconBarChart = ({ size = 18, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 5H9.5a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5H17" />
  </svg>
);

const IconUsers = ({ size = 18, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconSearch = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

interface PurchaseOrder {
  id: string;
  nomorPO: string;
  supplier: string;
  tanggal: string;
  status: string;
  nilaiTotal: number;
  namaBarang: string;
  jumlah: number;
  satuan: string;
  catatan: string;
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = date.getDate();
  const month = BULAN[date.getMonth()] || "";
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function normalizeStatus(status: unknown) {
  const raw = String(status || "").toUpperCase();
  if (raw === 'DITOLAK' || raw === 'DIBATALKAN') return "rejected";
  if (raw === 'SELESAI') return "completed";
  if (raw === 'DIKIRIM') return "supplier_acc";
  if (raw === 'DISETUJUI') return "approved";
  if (raw === 'MENUNGGU_PERSETUJUAN' || raw === 'DRAFT') return "pending";
  // Fallback to English checks
  const lower = raw.toLowerCase();
  if (lower.includes("reject") || lower.includes("tolak")) return "rejected";
  if (lower.includes("complete") || lower.includes("selesai") || lower.includes("done")) return "completed";
  if (lower.includes("supplier") && lower.includes("acc")) return "supplier_acc";
  if (lower.includes("approve") || lower.includes("acc")) return "approved";
  if (lower.includes("pending") || lower.includes("menunggu")) return "pending";
  return lower || "pending";
}

const PO_STATUS_CFG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "Menunggu", bg: "#FEF9D6", text: "#7A5A00", border: "#F5C878" },
  approved: { label: "Disetujui", bg: "#FFF8E7", text: "#92650a", border: "#FFE6A2" },
  supplier_acc: { label: "Dalam Pengiriman", bg: "#FFF5E6", text: "#B8680E", border: "#FFDDB3" },
  completed: { label: "Selesai", bg: "#F0FDF4", text: "#065f46", border: "#A8DEBC" },
  rejected: { label: "Ditolak", bg: "#F5D6D6", text: "#8A2020", border: "#E8A8A8" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = PO_STATUS_CFG[status] || PO_STATUS_CFG.pending;
  return (
    <span style={{ background: cfg.bg, color: cfg.text, fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", padding: "3px 9px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 4, border: `1.5px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  );
}

function parsePurchaseOrder(raw: unknown): PurchaseOrder {
  const item = raw as Record<string, unknown>;
  const nilaiTotal = Number(item.total_nilai ?? item.total ?? item.nilai ?? item.nilai_total ?? item.nominal ?? 0) || 0;
  const jumlah = Number(item.jumlah ?? item.jumlah_dipesan ?? item.qty ?? 0) || 0;
  return {
    id: String(item.id ?? item.po_id ?? item.purchase_order_id ?? "0"),
    nomorPO: String(item.nomor_po ?? item.nomorPO ?? item.nomor ?? `PO-${item.id ?? item.po_id ?? "000"}`),
    supplier: String((item.supplier as Record<string, unknown>)?.nama ?? item.supplier_nama ?? item.supplierNama ?? (item.supplier as Record<string, unknown>)?.nama_supplier ?? (item.supplier as Record<string, unknown>)?.name ?? "Supplier"),
    tanggal: String(item.tanggal_po ?? item.dibuat_pada ?? item.tanggal ?? item.created_at ?? item.createdAt ?? ""),
    status: normalizeStatus(item.status ?? item.status_po ?? item.status_supplier ?? item.statusSupplier),
    nilaiTotal,
    namaBarang: String(item.nama_barang ?? item.namaBarang ?? (item.stok as Record<string, unknown>)?.nama ?? item.produk ?? "-"),
    jumlah,
    satuan: String(item.satuan ?? item.satuan_barang ?? item.unit ?? "pcs"),
    catatan: String(item.catatan ?? item.keterangan ?? item.notes ?? "-"),
  };
}

export default function LaporanPOPage() {
  const router = useRouter();
  const role = Cookies.get(COOKIE_ROLE) || null;
  const [loading, setLoading] = useState<boolean>(role === "owner");
  const [poList, setPoList] = useState<PurchaseOrder[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (role === "owner") loadPurchaseOrders();
  }, [role]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function loadPurchaseOrders() {
    setLoading(true);
    try {
      const res = await api.purchaseOrder.getAll();
      if (res?.data) {
        const parsed = res.data.map(parsePurchaseOrder);
        setPoList(parsed);
      } else {
        setPoList([]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(message);
      setToast({ msg: "Gagal memuat laporan PO. Coba muat ulang.", type: "error" });
      setPoList([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredPO = poList.filter((po) => {
    const matchSearch = [po.nomorPO, po.supplier, po.namaBarang, po.status].some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    );
    if (!matchSearch) return false;
    const dateValue = po.tanggal ? new Date(po.tanggal) : null;
    if (fromDate && dateValue && dateValue < new Date(`${fromDate}T00:00:00`)) return false;
    if (toDate && dateValue && dateValue > new Date(`${toDate}T23:59:59`)) return false;
    return true;
  });

  const totalPO = filteredPO.length;
  const totalPengeluaran = filteredPO.reduce((sum, po) => sum + po.nilaiTotal, 0);
  const avgPengeluaran = totalPO ? Math.round(totalPengeluaran / totalPO) : 0;
  const supplierCount = new Set(filteredPO.map((po) => po.supplier)).size;

  const topSupplier = Object.entries(
    filteredPO.reduce<Record<string, number>>((acc, po) => {
      acc[po.supplier] = (acc[po.supplier] || 0) + po.nilaiTotal;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ background: "#F9F9FA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "rgba(146,101,10,0.5)" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>📊</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Memuat laporan...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (role !== "owner") {
    return (
      <>
        <Header />
        <div style={{ background: "#F9F9FA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "40px", maxWidth: 420, textAlign: "center", border: "1.5px solid rgba(255,200,120,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#92650a", margin: "0 0 8px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Akses Terbatas</h2>
            <p style={{ fontSize: 12, color: "rgba(146,101,10,0.65)", margin: "0 0 24px" }}>Halaman laporan ini hanya dapat diakses oleh owner.</p>
            <button onClick={() => router.push("/dashboard")} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#CAA017,#92650a)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Kembali ke Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ background: "#F9F9FA", minHeight: "100vh", color: "#212121" }}>
        {/* ── HERO ── */}
        <section className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12" style={{ background: "linear-gradient(160deg,#FFFAF4 0%,#FFF5E6 45%,#FFFCF7 100%)" }}>
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none" style={{ background: "#FFECB3", filter: "blur(80px)", opacity: 0.28 }} />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full pointer-events-none" style={{ background: "#FFE599", filter: "blur(60px)", opacity: 0.22 }} />

          <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 11, fontWeight: 500, color: "rgba(146,101,10,0.4)" }}>
              <span style={{ color: "#92650a", fontWeight: 700 }}>Laporan</span>
              <span>/</span>
              <span>Purchase Order Kumulatif</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600, color: "rgba(146,101,10,0.4)" }}>Owner Dashboard</p>
                <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: 32, lineHeight: 1, margin: 0, color: "#92650a" }}>Laporan Purchase Order</h1>
                <p style={{ fontSize: 11, marginTop: 8, fontWeight: 500, color: "rgba(146,101,10,0.5)" }}>Rekap pengeluaran Purchase Order dalam periode tertentu</p>
              </div>

              {/* Stat strip */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "Total Purchase Order", val: totalPO, icon: <IconReport size={16} />, bg: "#FEF9D6", valColor: "#92650a" },
                  { label: "Total Pengeluaran", val: formatRupiah(totalPengeluaran), icon: <IconTrendingUp size={16} />, bg: "#FFF8E7", valColor: "#CA8A04" },
                  { label: "Rata-rata Purchase Order", val: formatRupiah(avgPengeluaran), icon: <IconBarChart size={16} />, bg: "#FFECB3", valColor: "#A16207" },
                  { label: "Supplier Terlibat", val: supplierCount, icon: <IconUsers size={16} />, bg: "#FFE599", valColor: "#9C6C04" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: s.bg, padding: "12px 16px", borderRadius: 14, border: "1px solid rgba(200,160,30,0.2)", flex: "1 1 calc(50% - 4px)" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#92650a", flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "rgba(146,101,10,0.5)", margin: 0 }}>{s.label}</p>
                      <p style={{ fontSize: 13, fontWeight: 800, color: s.valColor, margin: "4px 0 0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
          {/* FILTER SECTION */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(200,160,30,0.15)", borderRadius: 20, padding: 24, marginBottom: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#92650a", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Filter & Cari Data</h2>
              <p style={{ fontSize: 11, color: "rgba(146,101,10,0.55)", margin: "6px 0 0" }}>Gunakan filter tanggal dan pencarian untuk menemukan Purchase Order yang spesifik</p>
            </div>

            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(146,101,10,0.6)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Dari tanggal</label>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid rgba(200,160,30,0.25)", borderRadius: 10, fontSize: 12, fontFamily: "'Inter', sans-serif", background: "rgba(255,255,255,0.8)", color: "#212121", outline: "none", transition: "border-color 0.2s" }} />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(146,101,10,0.6)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Hingga tanggal</label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid rgba(200,160,30,0.25)", borderRadius: 10, fontSize: 12, fontFamily: "'Inter', sans-serif", background: "rgba(255,255,255,0.8)", color: "#212121", outline: "none", transition: "border-color 0.2s" }} />
              </div>
            </div>

            <div style={{ position: "relative", marginBottom: 16 }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(146,101,10,0.3)" }}>
                <IconSearch size={14} />
              </div>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nomor PO, supplier, atau barang..." style={{ width: "100%", paddingLeft: 38, padding: "9px 12px", border: "1.5px solid rgba(200,160,30,0.25)", borderRadius: 10, fontSize: 12, fontFamily: "'Inter', sans-serif", background: "rgba(255,255,255,0.8)", color: "#212121", outline: "none" }} />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => { setSearch(""); setFromDate(""); setToDate(""); }} style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid rgba(200,160,30,0.2)", background: "#FFFFFF", color: "#92650a", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Bersihkan</button>
              <button onClick={loadPurchaseOrders} style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#CAA017,#92650a)", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Segarkan Data</button>
            </div>
          </div>

          {/* TOP SUPPLIERS */}
          {topSupplier.length > 0 && (
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(200,160,30,0.15)", borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#92650a", margin: "0 0 16px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Top 3 Supplier Teratas</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {topSupplier.map(([supplier, value], idx) => (
                  <div key={supplier} style={{ background: "linear-gradient(135deg,rgba(254,243,199,0.4),rgba(255,235,147,0.3))", border: "1.5px solid rgba(200,160,30,0.2)", borderLeft: "4px solid rgba(202,160,23,0.6)", borderRadius: "0 12px 12px 0", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 800, color: "#92650a", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{idx + 1}. {supplier}</p>
                      <p style={{ fontSize: 10, color: "rgba(146,101,10,0.55)", margin: "4px 0 0" }}>Total pengeluaran periode ini</p>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#92650a", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{formatRupiah(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TABLE */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(200,160,30,0.15)", borderRadius: 20, padding: 24, overflow: "hidden" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#92650a", margin: "0 0 16px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rincian Semua Purchase Order</h2>

            {filteredPO.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(146,101,10,0.4)" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
                <p style={{ fontSize: 12, fontWeight: 600 }}>Tidak ada purchase order yang sesuai filter</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(90deg,rgba(254,243,199,0.7),rgba(255,235,147,0.6))", borderBottom: "1.5px solid rgba(200,160,30,0.15)" }}>
                      <th style={{ textAlign: "left", padding: "12px 14px", fontSize: 10, fontWeight: 700, color: "rgba(146,101,10,0.6)", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No</th>
                      <th style={{ textAlign: "left", padding: "12px 14px", fontSize: 10, fontWeight: 700, color: "rgba(146,101,10,0.6)", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nomor PO</th>
                      <th style={{ textAlign: "left", padding: "12px 14px", fontSize: 10, fontWeight: 700, color: "rgba(146,101,10,0.6)", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Supplier</th>
                      <th style={{ textAlign: "left", padding: "12px 14px", fontSize: 10, fontWeight: 700, color: "rgba(146,101,10,0.6)", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tanggal</th>
                      <th style={{ textAlign: "left", padding: "12px 14px", fontSize: 10, fontWeight: 700, color: "rgba(146,101,10,0.6)", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Status</th>
                      <th style={{ textAlign: "left", padding: "12px 14px", fontSize: 10, fontWeight: 700, color: "rgba(146,101,10,0.6)", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total</th>
                      <th style={{ textAlign: "left", padding: "12px 14px", fontSize: 10, fontWeight: 700, color: "rgba(146,101,10,0.6)", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Barang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPO.map((po, idx) => (
                      <tr key={po.id} style={{ background: idx % 2 === 0 ? "transparent" : "rgba(254,243,199,0.2)", borderBottom: "1px solid rgba(200,160,30,0.1)" }}>
                        <td style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, color: "rgba(146,101,10,0.6)" }}>{idx + 1}</td>
                        <td style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 700, color: "#92650a", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{po.nomorPO}</td>
                        <td style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, color: "#212121" }}>{po.supplier}</td>
                        <td style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, color: "#212121" }}>{formatDate(po.tanggal)}</td>
                        <td style={{ textAlign: "left", padding: "12px 14px" }}><StatusBadge status={po.status} /></td>
                        <td style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 700, color: "#92650a", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{formatRupiah(po.nilaiTotal)}</td>
                        <td style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, color: "#212121" }}>{po.namaBarang} · {po.jumlah} {po.satuan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, background: "rgba(254,243,199,0.3)", padding: "10px 14px", borderRadius: 12, fontSize: 11, color: "#92650a", fontWeight: 600 }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 800 }}>{filteredPO.length}</span>
              <span>entri ditampilkan</span>
            </div>
          </div>
        </main>
      </div>
      <Footer />

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50, minWidth: 260, padding: "12px 16px", borderRadius: 14, color: "#fff", fontWeight: 600, fontSize: 12, background: toast.type === "error" ? "#D9467A" : "#048857", boxShadow: "0 18px 42px rgba(15, 23, 42, 0.12)", animation: "slideIn 0.28s ease" }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
