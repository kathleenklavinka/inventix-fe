"use client";

import Header from "../../../components/header";
import Footer from "../../../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const user = { nama: "Andi Pratama", role: "Admin", initials: "AP" };

// ── MOCK DATA (sama seperti halaman list) ──
const penjualanData = [
  { id: 1,  kode: "#TRX-0842", waktu: "14:32", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 1, jumlah: 2 }, { barangId: 4, jumlah: 1 }], total: 185000, metode: "QRIS",     status: "sukses",  catatan: "" },
  { id: 2,  kode: "#TRX-0841", waktu: "14:15", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 2, jumlah: 3 }, { barangId: 5, jumlah: 2 }], total: 225000, metode: "Tunai",    status: "sukses",  catatan: "" },
  { id: 3,  kode: "#TRX-0840", waktu: "13:58", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 3, jumlah: 1 }],                             total: 35000,  metode: "Transfer", status: "sukses",  catatan: "" },
  { id: 4,  kode: "#TRX-0839", waktu: "13:44", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 4, jumlah: 4 }],                             total: 100000, metode: "QRIS",     status: "sukses",  catatan: "" },
  { id: 5,  kode: "#TRX-0838", waktu: "13:20", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 1, jumlah: 1 }, { barangId: 5, jumlah: 1 }], total: 110000, metode: "Tunai",    status: "pending", catatan: "Menunggu konfirmasi pelanggan" },
  { id: 6,  kode: "#TRX-0837", waktu: "12:55", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 2, jumlah: 2 }],                             total: 90000,  metode: "QRIS",     status: "sukses",  catatan: "" },
  { id: 7,  kode: "#TRX-0836", waktu: "12:30", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 3, jumlah: 2 }, { barangId: 4, jumlah: 1 }], total: 95000,  metode: "Transfer", status: "batal",   catatan: "Pelanggan membatalkan pesanan" },
  { id: 8,  kode: "#TRX-0835", waktu: "11:47", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 1, jumlah: 3 }],                             total: 255000, metode: "QRIS",     status: "sukses",  catatan: "" },
  { id: 9,  kode: "#TRX-0834", waktu: "11:22", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 5, jumlah: 2 }, { barangId: 2, jumlah: 1 }], total: 120000, metode: "Tunai",    status: "sukses",  catatan: "" },
  { id: 10, kode: "#TRX-0833", waktu: "10:58", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 3, jumlah: 3 }],                             total: 105000, metode: "Transfer", status: "sukses",  catatan: "" },
  { id: 11, kode: "#TRX-0832", waktu: "10:31", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 4, jumlah: 2 }, { barangId: 1, jumlah: 1 }], total: 135000, metode: "QRIS",     status: "sukses",  catatan: "" },
  { id: 12, kode: "#TRX-0831", waktu: "09:55", tanggal: "30 Mei 2026",   rawItems: [{ barangId: 2, jumlah: 1 }],                             total: 45000,  metode: "Tunai",    status: "pending", catatan: "" },
  { id: 13, kode: "#TRX-0830", waktu: "09:20", tanggal: "29 Mei 2026",   rawItems: [{ barangId: 1, jumlah: 2 }, { barangId: 3, jumlah: 1 }], total: 205000, metode: "QRIS",     status: "sukses",  catatan: "" },
  { id: 14, kode: "#TRX-0829", waktu: "16:45", tanggal: "29 Mei 2026",   rawItems: [{ barangId: 5, jumlah: 4 }],                             total: 100000, metode: "Transfer", status: "sukses",  catatan: "" },
  { id: 15, kode: "#TRX-0828", waktu: "15:30", tanggal: "29 Mei 2026",   rawItems: [{ barangId: 4, jumlah: 1 }, { barangId: 2, jumlah: 2 }], total: 115000, metode: "Tunai",    status: "batal",   catatan: "" },
];

const stokData = [
  { id: 1, nama: "Kopi Arabika",      satuan: "cup", harga: 45000, stok: 48 },
  { id: 2, nama: "Cold Brew",         satuan: "cup", harga: 45000, stok: 30 },
  { id: 3, nama: "Matcha Latte",      satuan: "cup", harga: 35000, stok: 22 },
  { id: 4, nama: "Focaccia Original", satuan: "pcs", harga: 25000, stok: 15 },
  { id: 5, nama: "Croissant Butter",  satuan: "pcs", harga: 32000, stok: 20 },
  { id: 6, nama: "Espresso Shot",     satuan: "cup", harga: 28000, stok: 60 },
  { id: 7, nama: "Caramel Macchiato", satuan: "cup", harga: 52000, stok: 0  },
];

const METODE_OPTIONS = ["QRIS", "Tunai", "Transfer"];
const STATUS_OPTIONS = ["sukses", "pending", "batal"] as const;
const HARI  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

type StatusType = "sukses" | "pending" | "batal";

function fmt(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

// ── ICONS ──
const IconArrowLeft = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconPlus = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconTrash = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconCheck = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconAlertTriangle = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconReceipt = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconChevronDown = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconPackage = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconEdit = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconInfo = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const IconX = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

interface LineItem {
  uid: number;
  barangId: number | null;
  jumlah: number;
  error: string;
}

function StatusBadgeInline({ status }: { status: StatusType }) {
  const map: Record<StatusType, { bg: string; color: string; label: string }> = {
    sukses:  { bg: "#CFDECA", color: "#2d6a3f", label: "Sukses" },
    pending: { bg: "#EFF0A3", color: "#92650a", label: "Pending" },
    batal:   { bg: "#fee2e2", color: "#dc2626", label: "Batal" },
  };
  const s = map[status];
  return (
    <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-lg"
      style={{ background: s.bg, color: s.color }}>{s.label}</span>
  );
}

function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-3xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

export default function EditPenjualanPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = Number(params?.id);

  const [mounted, setMounted]       = useState(false);
  const [tanggal, setTanggal]       = useState("");
  const [notFound, setNotFound]     = useState(false);
  const [originalData, setOriginalData] = useState<typeof penjualanData[0] | null>(null);

  // Form state
  const [lines, setLines]           = useState<LineItem[]>([]);
  const [metode, setMetode]         = useState("QRIS");
  const [status, setStatus]         = useState<StatusType>("sukses");
  const [catatan, setCatatan]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [globalError, setGlobalError] = useState("");

  // Dirty state tracking
  const [isDirty, setIsDirty]       = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingNav, setPendingNav]  = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);

    const trx = penjualanData.find(d => d.id === id);
    if (!trx) { setNotFound(true); setTimeout(() => setMounted(true), 80); return; }

    setOriginalData(trx);
    setMetode(trx.metode);
    setStatus(trx.status as StatusType);
    setCatatan(trx.catatan);
    setLines(
      trx.rawItems.map((item, i) => ({
        uid: Date.now() + i,
        barangId: item.barangId,
        jumlah: item.jumlah,
        error: "",
      }))
    );
    setTimeout(() => setMounted(true), 80);
  }, [id]);

  // Mark dirty whenever form changes after mount
  useEffect(() => {
    if (mounted && !submitted) setIsDirty(true);
  }, [lines, metode, status, catatan]);

  // ── LINE HELPERS ──
  function updateLine(uid: number, patch: Partial<LineItem>) {
    setLines(prev =>
      prev.map(l => {
        if (l.uid !== uid) return l;
        const updated = { ...l, ...patch };
        if ("jumlah" in patch || "barangId" in patch) {
          const barang = stokData.find(s => s.id === (updated.barangId ?? -1));
          if (barang && updated.jumlah > barang.stok) {
            updated.error = `Stok tersedia hanya ${barang.stok} ${barang.satuan}`;
          } else {
            updated.error = "";
          }
        }
        return updated;
      })
    );
  }

  function addLine() {
    setLines(prev => [...prev, { uid: Date.now(), barangId: null, jumlah: 1, error: "" }]);
  }

  function removeLine(uid: number) {
    setLines(prev => prev.filter(l => l.uid !== uid));
  }

  // ── SUMMARY ──
  const lineDetails = lines.map(l => {
    const barang = stokData.find(s => s.id === l.barangId);
    return { ...l, barang, subtotal: barang ? barang.harga * l.jumlah : 0 };
  });
  const grandTotal = lineDetails.reduce((a, b) => a + b.subtotal, 0);
  const hasError   = lines.some(l => l.error !== "");
  const hasEmpty   = lines.some(l => l.barangId === null);
  const usedIds    = lines.map(l => l.barangId).filter(Boolean) as number[];

  // ── SUBMIT ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");
    if (hasEmpty) { setGlobalError("Pilih barang untuk semua baris item."); return; }
    if (hasError)  { setGlobalError("Perbaiki error stok sebelum menyimpan."); return; }
    if (lines.length === 0) { setGlobalError("Tambahkan minimal satu item."); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
    setIsDirty(false);
  }

  // ── DISCARD NAVIGATION ──
  function handleNavAttempt(href: string) {
    if (isDirty && !submitted) {
      setPendingNav(href);
      setShowDiscardModal(true);
    } else {
      router.push(href);
    }
  }

  function confirmDiscard() {
    setShowDiscardModal(false);
    if (pendingNav) router.push(pendingNav);
  }

  // ── 404 STATE ──
  if (mounted && notFound) {
    return (
      <>
        <div className="min-h-screen flex flex-col" style={{ background: "#F9F9FA", fontFamily: "Inter, sans-serif" }}>
          <Header hasNotification={false} userInitials={user.initials} />
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "#fee2e2" }}>
                <IconAlertTriangle size={28} color="#dc2626" />
              </div>
              <h2 className="font-black text-2xl mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#212121" }}>
                Transaksi Tidak Ditemukan
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(33,33,33,0.50)" }}>
                Transaksi dengan ID <span className="font-semibold">#{id}</span> tidak ada di sistem.
              </p>
              <Link href="/penjualan">
                <button style={{ background: "#2a1f08", color: "#fff", border: "none", borderRadius: "12px", padding: "11px 22px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "7px" }}>
                  <IconArrowLeft size={14} color="#fff" /> Kembali ke Penjualan
                </button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0}to{opacity:1} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)} }
        @keyframes blob      { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.07)} 66%{transform:translate(-25px,25px) scale(0.95)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes rowIn     { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes successPop{ 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        @keyframes modalPop  { from{opacity:0;transform:scale(0.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)} }

        .anim-fade-up{animation:fadeUp 0.55s cubic-bezier(.22,1,.36,1) both}
        .d50{animation-delay:.05s}.d100{animation-delay:.10s}.d150{animation-delay:.15s}
        .d200{animation-delay:.20s}.d250{animation-delay:.25s}.d300{animation-delay:.30s}
        .d350{animation-delay:.35s}.d400{animation-delay:.40s}

        .blob {animation:blob 9s ease-in-out infinite}
        .blob2{animation:blob 12s ease-in-out infinite reverse;animation-delay:3s}
        .row-in{animation:rowIn 0.3s cubic-bezier(.22,1,.36,1) both}
        .success-pop{animation:successPop 0.5s cubic-bezier(.22,1,.36,1) both}
        .modal-pop{animation:modalPop 0.22s cubic-bezier(.22,1,.36,1) both}
        .modal-fade{animation:fadeIn .18s ease both}

        .field-label{
          display:block;font-size:11px;font-weight:700;letter-spacing:.07em;
          text-transform:uppercase;color:rgba(80,65,40,0.50);margin-bottom:7px;
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .field-input{
          width:100%;border:1.5px solid rgba(33,33,33,0.12);border-radius:12px;
          padding:10px 14px;font-size:13px;font-family:'Inter',sans-serif;
          background:rgba(255,255,255,0.75);color:#212121;outline:none;
          transition:border-color .2s,box-shadow .2s;
        }
        .field-input:focus{border-color:rgba(42,31,8,0.35);box-shadow:0 0 0 3px rgba(42,31,8,0.07)}
        .field-input.error{border-color:#dc2626;box-shadow:0 0 0 3px rgba(220,38,38,0.08)}
        .field-select{appearance:none;-webkit-appearance:none;background-image:none;cursor:pointer}

        .btn-primary{
          background:#2a1f08;color:#ffffff;border:none;border-radius:12px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;
          padding:11px 22px;font-size:13px;cursor:pointer;letter-spacing:.01em;
          transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s,background .18s;
          display:inline-flex;align-items:center;gap:7px;
        }
        .btn-primary:hover:not(:disabled){transform:translateY(-2px) scale(1.03);box-shadow:0 10px 28px rgba(42,31,8,.25);background:#3d2e0e}
        .btn-primary:active:not(:disabled){transform:scale(0.97)}
        .btn-primary:disabled{opacity:.5;cursor:not-allowed}

        .btn-ghost{
          background:rgba(33,33,33,0.06);color:#212121;border:none;border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;
          padding:8px 15px;font-size:12px;cursor:pointer;
          transition:background .18s,transform .2s;
          display:inline-flex;align-items:center;gap:5px;
        }
        .btn-ghost:hover{background:rgba(33,33,33,0.11);transform:scale(1.02)}

        .btn-danger-solid{
          background:#dc2626;color:#fff;border:none;border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;
          padding:10px 18px;font-size:13px;cursor:pointer;
          transition:background .18s,transform .2s;
          display:inline-flex;align-items:center;gap:6px;
        }
        .btn-danger-solid:hover{background:#b91c1c;transform:scale(1.03)}

        .btn-icon-danger{
          background:rgba(220,38,38,0.07);border:none;border-radius:9px;
          width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;
          cursor:pointer;flex-shrink:0;transition:background .18s,transform .2s;
        }
        .btn-icon-danger:hover{background:rgba(220,38,38,0.14);transform:scale(1.08)}
        .btn-icon-danger:disabled{opacity:.3;cursor:default;transform:none}

        .btn-add-line{
          background:transparent;border:1.5px dashed rgba(42,31,8,0.22);border-radius:12px;
          padding:10px 18px;font-size:12px;font-weight:700;
          font-family:'Plus Jakarta Sans',sans-serif;
          color:rgba(42,31,8,0.55);cursor:pointer;width:100%;
          display:flex;align-items:center;justify-content:center;gap:6px;
          transition:border-color .2s,color .2s,background .2s,transform .2s;
        }
        .btn-add-line:hover{border-color:rgba(42,31,8,0.45);color:#2a1f08;background:rgba(42,31,8,0.04);transform:scale(1.01)}

        .card{
          background:rgba(255,255,255,0.72);backdrop-filter:blur(20px);
          border:1px solid rgba(33,33,33,0.08);border-radius:20px;
          box-shadow:0 8px 32px rgba(33,33,33,0.07),inset 0 1px 0 rgba(255,255,255,0.95);
        }

        .line-row{
          background:rgba(249,247,242,0.70);border:1.5px solid rgba(200,180,130,0.16);
          border-radius:14px;padding:14px 16px;transition:border-color .2s,box-shadow .2s;
        }
        .line-row:hover{border-color:rgba(200,180,130,0.32);box-shadow:0 4px 14px rgba(42,31,8,0.06)}
        .line-row.has-error{border-color:rgba(220,38,38,0.35)!important}

        .stok-pill{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;padding:3px 9px;border-radius:20px}
        .stok-pill.ok  {background:#CFDECA;color:#2d6a3f}
        .stok-pill.low {background:#EFF0A3;color:#92650a}
        .stok-pill.zero{background:#fee2e2;color:#dc2626}

        .summary-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(33,33,33,0.06);font-size:12px;color:rgba(33,33,33,0.55)}
        .summary-row:last-of-type{border-bottom:none}
        .summary-row .val{font-weight:700;color:#212121;font-family:'Plus Jakarta Sans',sans-serif}

        .error-msg{display:flex;align-items:center;gap:5px;font-size:11px;color:#dc2626;font-weight:600;margin-top:5px}

        .pill-metode{
          flex:1;padding:10px 6px;text-align:center;border-radius:10px;
          font-size:12px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;
          cursor:pointer;border:none;transition:background .18s,color .18s,transform .15s;
        }
        .pill-metode.active{background:#2a1f08;color:#EFF0A3}
        .pill-metode:not(.active){background:rgba(33,33,33,0.06);color:rgba(33,33,33,0.50)}
        .pill-metode:not(.active):hover{background:rgba(33,33,33,0.11);transform:scale(1.03)}

        .pill-status{
          flex:1;padding:9px 6px;text-align:center;border-radius:10px;
          font-size:11px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;
          cursor:pointer;border:none;transition:background .18s,color .18s,transform .15s;
          text-transform:capitalize;
        }
        .pill-status.sukses.active  {background:#CFDECA;color:#2d6a3f}
        .pill-status.pending.active {background:#EFF0A3;color:#92650a}
        .pill-status.batal.active   {background:#fee2e2;color:#dc2626}
        .pill-status:not(.active){background:rgba(33,33,33,0.06);color:rgba(33,33,33,0.38)}
        .pill-status:not(.active):hover{background:rgba(33,33,33,0.10);transform:scale(1.03)}

        .spinner{width:16px;height:16px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite}

        .dirty-dot{width:7px;height:7px;border-radius:50%;background:#f59e0b;display:inline-block;margin-right:4px;flex-shrink:0}

        .original-badge{
          font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
          padding:2px 7px;border-radius:6px;background:rgba(33,33,33,0.06);
          color:rgba(33,33,33,0.38);font-family:'Plus Jakarta Sans',sans-serif;
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        input[type=number]{-moz-appearance:textfield}
      `}</style>

      <div
        className={`min-h-screen text-[#212121] font-['Inter'] relative overflow-x-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#F9F9FA" }}
      >
        <Header hasNotification={false} userInitials={user.initials} />

        <main className="w-full">

          {/* ── HERO ── */}
          <section
            className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12"
            style={{ background: "linear-gradient(160deg, #f5f0e8 0%, #ede8da 45%, #f9f7f2 100%)" }}
          >
            <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full opacity-30 blob pointer-events-none"
              style={{ background: "#e8d5a3", filter: "blur(72px)" }} />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-20 blob2 pointer-events-none"
              style={{ background: "#CFDECA", filter: "blur(60px)" }} />

            <Inner>
              {/* Breadcrumb */}
              <div className="anim-fade-up flex items-center gap-2 mb-5 text-[11px] font-medium flex-wrap"
                style={{ color: "rgba(80,65,40,0.45)" }}>
                <Link href="/dashboard" className="hover:text-[#2a1f08] transition-colors">Dashboard</Link>
                <span>/</span>
                <button onClick={() => handleNavAttempt("/penjualan")}
                  className="hover:text-[#2a1f08] transition-colors bg-transparent border-none p-0 cursor-pointer font-medium text-[11px]"
                  style={{ color: "rgba(80,65,40,0.45)", fontFamily: "Inter, sans-serif" }}>
                  Penjualan
                </button>
                <span>/</span>
                <span style={{ color: "#2a1f08" }} className="font-semibold">
                  Edit {originalData?.kode}
                </span>
              </div>

              <div className="anim-fade-up d100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.20em] uppercase mb-1.5 font-medium"
                    style={{ color: "rgba(80,65,40,0.42)" }}>Penjualan</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.2rem] leading-none"
                      style={{ color: "#2a1f08" }}>Edit Transaksi</h1>
                    {originalData && <StatusBadgeInline status={originalData.status as StatusType} />}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <p className="text-[11px] font-bold" style={{ color: "rgba(80,65,40,0.55)" }}>
                      {originalData?.kode}
                    </p>
                    <span style={{ color: "rgba(80,65,40,0.25)" }}>·</span>
                    <p className="text-[11px] font-medium" style={{ color: "rgba(80,65,40,0.38)" }}>
                      {originalData?.tanggal}, {originalData?.waktu}
                    </p>
                    {isDirty && !submitted && (
                      <span className="flex items-center text-[10px] font-semibold" style={{ color: "#f59e0b" }}>
                        <span className="dirty-dot" />Perubahan belum disimpan
                      </span>
                    )}
                  </div>
                </div>
                <button className="btn-ghost self-start sm:self-auto"
                  onClick={() => handleNavAttempt("/penjualan")}>
                  <IconArrowLeft size={14} color="rgba(33,33,33,0.55)" />
                  Kembali
                </button>
              </div>
            </Inner>
          </section>

          {/* ── FORM SECTION ── */}
          <section className="w-full py-10 sm:py-12" style={{ background: "#FFFFFF" }}>
            <Inner>

              {/* SUCCESS STATE */}
              {submitted ? (
                <div className="success-pop card p-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: "#CFDECA" }}>
                    <IconCheck size={28} color="#2d6a3f" />
                  </div>
                  <h2 className="font-['Plus_Jakarta_Sans'] font-black text-2xl text-[#212121] mb-2">
                    Transaksi Berhasil Diperbarui!
                  </h2>
                  <p className="text-sm mb-1" style={{ color: "rgba(33,33,33,0.50)" }}>
                    Perubahan pada <span className="font-semibold text-[#212121]">{originalData?.kode}</span> telah disimpan.
                  </p>
                  <p className="font-bold text-lg mt-1 mb-7" style={{ color: "#2a1f08" }}>
                    {fmt(grandTotal)} · <span className="capitalize">{metode}</span>
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <Link href="/penjualan">
                      <button className="btn-ghost">Lihat Semua Penjualan</button>
                    </Link>
                    <button className="btn-primary" onClick={() => {
                      setSubmitted(false);
                      setIsDirty(false);
                    }}>
                      <IconEdit size={14} color="#ffffff" /> Edit Lagi
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

                    {/* ── LEFT ── */}
                    <div className="flex flex-col gap-5">

                      {/* Original info banner */}
                      {originalData && (
                        <div className="anim-fade-up d50 flex items-start gap-3 px-4 py-3.5 rounded-2xl"
                          style={{ background: "rgba(216,223,233,0.35)", border: "1px solid rgba(42,58,82,0.12)" }}>
                          <IconInfo size={14} color="#2a3a52" />
                          <div>
                            <p className="text-[11px] font-semibold mb-0.5" style={{ color: "#2a3a52" }}>
                              Mengedit transaksi asli
                            </p>
                            <p className="text-[10px]" style={{ color: "rgba(42,58,82,0.60)" }}>
                              Total awal: <span className="font-bold">{fmt(originalData.total)}</span>
                              &nbsp;·&nbsp;Metode awal: <span className="font-bold">{originalData.metode}</span>
                              &nbsp;·&nbsp;Status awal: <span className="font-bold capitalize">{originalData.status}</span>
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Item list card */}
                      <div className="anim-fade-up d100 card p-6">
                        <div className="flex items-center justify-between gap-3 mb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: "#e8dfc8" }}>
                              <IconPackage size={16} color="#7a5c2e" />
                            </div>
                            <div>
                              <h2 className="font-['Plus_Jakarta_Sans'] font-black text-sm text-[#212121] leading-tight">
                                Daftar Item
                              </h2>
                              <p className="text-[10px] mt-0.5" style={{ color: "rgba(33,33,33,0.40)" }}>
                                {lines.length} item dalam transaksi ini
                              </p>
                            </div>
                          </div>
                          <span className="original-badge">Prefilled</span>
                        </div>

                        <div className="flex flex-col gap-3">
                          {lines.map((line, idx) => {
                            const barang    = stokData.find(s => s.id === line.barangId);
                            const subtotal  = barang ? barang.harga * line.jumlah : 0;
                            const stokLevel = !barang ? null : barang.stok === 0 ? "zero" : barang.stok <= 5 ? "low" : "ok";

                            return (
                              <div key={line.uid} className={`line-row row-in ${line.error ? "has-error" : ""}`}>

                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-[10px] font-bold uppercase tracking-widest"
                                    style={{ color: "rgba(80,65,40,0.38)" }}>
                                    Item {idx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn-icon-danger"
                                    disabled={lines.length === 1}
                                    onClick={() => removeLine(line.uid)}
                                    title="Hapus item"
                                  >
                                    <IconTrash size={13} color="#dc2626" />
                                  </button>
                                </div>

                                {/* Barang select */}
                                <div className="mb-3">
                                  <label className="field-label">Nama Barang</label>
                                  <div className="relative">
                                    <select
                                      className={`field-input field-select pr-9 ${line.error ? "error" : ""}`}
                                      value={line.barangId ?? ""}
                                      onChange={e => {
                                        const val = e.target.value === "" ? null : Number(e.target.value);
                                        updateLine(line.uid, { barangId: val, jumlah: 1 });
                                      }}
                                    >
                                      <option value="">— Pilih barang —</option>
                                      {stokData.map(s => (
                                        <option
                                          key={s.id}
                                          value={s.id}
                                          disabled={s.stok === 0 || (usedIds.includes(s.id) && line.barangId !== s.id)}
                                        >
                                          {s.nama} ({s.stok === 0 ? "Stok habis" : `${s.stok} ${s.satuan}`}) — {fmt(s.harga)}
                                        </option>
                                      ))}
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                      style={{ color: "rgba(33,33,33,0.35)" }}>
                                      <IconChevronDown size={14} />
                                    </span>
                                  </div>
                                </div>

                                {/* Jumlah + info */}
                                <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                                  <div>
                                    <label className="field-label">Jumlah</label>
                                    <input
                                      type="number"
                                      min={1}
                                      max={barang?.stok ?? 9999}
                                      className={`field-input ${line.error ? "error" : ""}`}
                                      value={line.jumlah}
                                      onChange={e => {
                                        const val = Math.max(1, parseInt(e.target.value) || 1);
                                        updateLine(line.uid, { jumlah: val });
                                      }}
                                      disabled={!barang}
                                    />
                                  </div>
                                  <div className="pb-0.5 flex flex-col items-end gap-1.5">
                                    {barang && stokLevel && (
                                      <span className={`stok-pill ${stokLevel}`}>
                                        Stok: {barang.stok} {barang.satuan}
                                      </span>
                                    )}
                                    {subtotal > 0 && (
                                      <span className="text-xs font-black" style={{ color: "#2a1f08" }}>
                                        {fmt(subtotal)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {line.error && (
                                  <div className="error-msg mt-2">
                                    <IconAlertTriangle size={13} color="#dc2626" /> {line.error}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <button type="button" className="btn-add-line mt-3" onClick={addLine}>
                          <IconPlus size={13} color="rgba(42,31,8,0.55)" />
                          Tambah Item Lain
                        </button>
                      </div>

                      {/* Catatan */}
                      <div className="anim-fade-up d200 card p-6">
                        <label className="field-label" style={{ marginBottom: "8px", display: "block" }}>
                          Catatan{" "}
                          <span className="normal-case font-normal tracking-normal"
                            style={{ color: "rgba(33,33,33,0.35)" }}>(opsional)</span>
                        </label>
                        <textarea
                          className="field-input resize-none"
                          rows={3}
                          placeholder="Catatan tambahan untuk transaksi ini…"
                          value={catatan}
                          onChange={e => setCatatan(e.target.value)}
                          style={{ paddingTop: "10px", paddingBottom: "10px" }}
                        />
                      </div>
                    </div>

                    {/* ── RIGHT ── */}
                    <div className="flex flex-col gap-5">

                      {/* Metode */}
                      <div className="anim-fade-up d150 card p-6">
                        <h2 className="font-['Plus_Jakarta_Sans'] font-black text-sm text-[#212121] mb-4">
                          Metode Pembayaran
                        </h2>
                        <div className="flex gap-2">
                          {METODE_OPTIONS.map(m => (
                            <button key={m} type="button"
                              className={`pill-metode ${metode === m ? "active" : ""}`}
                              onClick={() => setMetode(m)}>
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="anim-fade-up d200 card p-6">
                        <h2 className="font-['Plus_Jakarta_Sans'] font-black text-sm text-[#212121] mb-4">
                          Status Transaksi
                        </h2>
                        <div className="flex gap-2">
                          {STATUS_OPTIONS.map(s => (
                            <button key={s} type="button"
                              className={`pill-status ${s} ${status === s ? "active" : ""}`}
                              onClick={() => setStatus(s)}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="anim-fade-up d250 card p-6">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "#D8DFE9" }}>
                            <IconReceipt size={15} color="#2a3a52" />
                          </div>
                          <h2 className="font-['Plus_Jakarta_Sans'] font-black text-sm text-[#212121]">
                            Ringkasan Order
                          </h2>
                        </div>

                        <div>
                          {lineDetails.map(l =>
                            l.barang ? (
                              <div key={l.uid} className="summary-row">
                                <span className="font-medium text-[11px] truncate max-w-[130px]" title={l.barang.nama}>
                                  {l.barang.nama} ×{l.jumlah}
                                </span>
                                <span className="val text-[11px]">{fmt(l.subtotal)}</span>
                              </div>
                            ) : null
                          )}
                          {lineDetails.every(l => !l.barang) && (
                            <p className="text-[11px] text-center py-4" style={{ color: "rgba(33,33,33,0.30)" }}>
                              Belum ada item dipilih
                            </p>
                          )}
                        </div>

                        {/* Diff indicator */}
                        {originalData && grandTotal !== originalData.total && grandTotal > 0 && (
                          <div className="mt-3 pt-3 flex items-center justify-between text-[11px]"
                            style={{ borderTop: "1px dashed rgba(33,33,33,0.10)" }}>
                            <span style={{ color: "rgba(33,33,33,0.38)" }}>Sebelumnya</span>
                            <span className="font-bold line-through" style={{ color: "rgba(33,33,33,0.35)" }}>
                              {fmt(originalData.total)}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 pt-3" style={{ borderTop: "2px solid rgba(33,33,33,0.08)" }}>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider"
                              style={{ color: "rgba(33,33,33,0.40)" }}>Total Baru</span>
                            <span className="font-['Plus_Jakarta_Sans'] font-black text-xl"
                              style={{ color: "#2a1f08" }}>
                              {fmt(grandTotal)}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            <p className="text-[10px]" style={{ color: "rgba(33,33,33,0.30)" }}>
                              via {metode}
                            </p>
                            <span style={{ color: "rgba(33,33,33,0.18)" }}>·</span>
                            <StatusBadgeInline status={status} />
                          </div>
                        </div>
                      </div>

                      {/* Global error */}
                      {globalError && (
                        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
                          style={{ background: "#fee2e2", border: "1px solid rgba(220,38,38,0.2)" }}>
                          <IconAlertTriangle size={14} color="#dc2626" />
                          <p className="text-xs font-semibold text-red-600">{globalError}</p>
                        </div>
                      )}

                      {/* Submit */}
                      <div className="anim-fade-up d300 flex flex-col gap-2">
                        <button
                          type="submit"
                          className="btn-primary w-full justify-center"
                          disabled={submitting || hasError || hasEmpty || lines.length === 0}
                          style={{ padding: "13px 22px", fontSize: "14px" }}
                        >
                          {submitting ? (
                            <><span className="spinner" /> Menyimpan…</>
                          ) : (
                            <><IconCheck size={15} color="#fff" /> Simpan Perubahan</>
                          )}
                        </button>
                        <button type="button" className="btn-ghost w-full justify-center"
                          onClick={() => handleNavAttempt("/penjualan")}>
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

            </Inner>
          </section>

          {/* ── STAT BAR ── */}
          <section className="w-full py-5 sm:py-6" style={{ background: "#212121" }}>
            <Inner>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-[11px] font-medium" style={{ color: "rgba(249,249,250,0.35)" }}>
                  Mengedit transaksi {originalData?.kode ?? `#${id}`}
                </p>
                <p className="text-[10px] font-medium" style={{ color: "rgba(249,249,250,0.18)" }}>
                  Inventix v1.0 · Penjualan / Edit
                </p>
              </div>
            </Inner>
          </section>
        </main>

        <Footer />

        {/* ── DISCARD CHANGES MODAL ── */}
        {showDiscardModal && (
          <div className="modal-fade fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(33,33,33,0.45)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowDiscardModal(false)}>
            <div className="modal-pop w-full max-w-sm p-6 sm:p-7 border"
              style={{ background: "#FFFFFF", borderRadius: "20px", borderColor: "rgba(33,33,33,0.08)", boxShadow: "0 24px 64px rgba(33,33,33,0.18)" }}
              onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "#EFF0A3" }}>
                <IconAlertTriangle size={22} color="#92650a" />
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-black text-lg text-[#212121] mb-1.5">
                Tinggalkan Halaman?
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(33,33,33,0.55)" }}>
                Perubahan yang belum disimpan pada{" "}
                <span className="font-semibold text-[#212121]">{originalData?.kode}</span>{" "}
                akan hilang jika kamu meninggalkan halaman ini.
              </p>
              <div className="flex gap-3">
                <button className="btn-ghost flex-1 justify-center"
                  onClick={() => setShowDiscardModal(false)}>
                  Lanjut Edit
                </button>
                <button className="btn-danger-solid flex-1 justify-center"
                  onClick={confirmDiscard}>
                  <IconX size={13} color="#fff" /> Ya, Tinggalkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}