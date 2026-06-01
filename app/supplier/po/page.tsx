"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { COOKIE_NAME, COOKIE_ROLE } from "@/lib/auth";
import { api } from "@/lib/api";

const HARI  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

// Icons
const IcPlus      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcTrash     = ({ size=13 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IcCheck     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcX         = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcChevDown  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IcPrinter   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;
const IcSend      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IcBuilding  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M9 3v18M15 3v18M2 9h20M2 15h20"/></svg>;
const IcCalendar  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcInfo      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

// Types
interface POItem {
  id: number;
  stok_id: string | number;
  produk: string;
  satuan: string;
  qty: number;
  harga: number;
}

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function generateNoPO() {
  const now = new Date();
  const yy  = String(now.getFullYear()).slice(2);
  const mm  = String(now.getMonth()+1).padStart(2,"0");
  const dd  = String(now.getDate()).padStart(2,"0");
  const rnd = String(Math.floor(Math.random()*9000)+1000);
  return `PO-${yy}${mm}${dd}-${rnd}`;
}

function Inner({ children, className="" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-5xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

function POPageInner() {
  const searchParams  = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [tanggal, setTanggal] = useState("");
  const [noPO,    setNoPO]    = useState("");
  const [toast,   setToast]   = useState<{ msg: string; type: "success"|"error" } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Form fields
  const initSupId = Number(searchParams?.get("supplier")) || 0;
  const initSupNm = searchParams?.get("nama") ? decodeURIComponent(searchParams.get("nama")!) : "";

  const [supplierId,    setSupplierId]    = useState(initSupId);
  const [supplierNama,  setSupplierNama]  = useState(initSupNm);
  const [tglPO,         setTglPO]         = useState("");
  const [tglKirim,      setTglKirim]      = useState("");
  const [metodeBayar,   setMetodeBayar]   = useState("Transfer Bank");
  const [catatan,       setCatatan]       = useState("");
  const [items,         setItems]         = useState<POItem[]>([
    { id: 1, stok_id: "", produk: "", satuan: "Pcs", qty: 1, harga: 0 },
  ]);

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);

  const [userName, setUserName] = useState("Andi Pratama");
  const [userRole, setUserRole] = useState("user");
  const [userInitials, setUserInitials] = useState("AP");

  const satuanList   = ["Pcs", "Kg", "Gram", "Liter", "ml", "Dus", "Karton", "Lusin", "Roll", "Meter"];
  const bayarList    = ["Transfer Bank", "COD", "Net 30", "Net 60", "Kredit"];

  useEffect(() => {
    const name = Cookies.get(COOKIE_NAME) || "Andi Pratama";
    const role = Cookies.get(COOKIE_ROLE) || "user";
    setUserName(decodeURIComponent(name));
    setUserRole(role);
    setUserInitials(decodeURIComponent(name).split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase());

    const now = new Date();
    setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    const y = now.getFullYear(), m = String(now.getMonth()+1).padStart(2,"0"), d = String(now.getDate()).padStart(2,"0");
    setTglPO(`${y}-${m}-${d}`);
    setNoPO(generateNoPO());

    async function loadInitialData() {
      try {
        const [supsRes, stocksRes] = await Promise.all([
          api.supplier.getAll(),
          api.stok.getAll()
        ]);
        
        setSuppliers(supsRes.data);
        setStocks(stocksRes.data);
      } catch (err: any) {
        console.error("Gagal memuat data master:", err);
        setToast({ msg: err.message || "Gagal memuat data dari server.", type: "error" });
      }
    }

    loadInitialData();
    setTimeout(() => setMounted(true), 80);
  }, []);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); }
  }, [toast]);

  // Sync supplier name when id changes manually
  function handleSupplierChange(id: number) {
    setSupplierId(id);
    const found = suppliers.find(s => s.id === id);
    setSupplierNama(found ? found.nama : "");
  }

  // Items CRUD
  function addItem() {
    setItems(prev => [...prev, { id: Date.now(), stok_id: "", produk: "", satuan: "Pcs", qty: 1, harga: 0 }]);
  }
  function removeItem(id: number) {
    setItems(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);
  }
  
  function handleProductSelect(id: number, stokIdVal: string | number) {
    const selectedStock = stocks.find(s => s.id === Number(stokIdVal));
    if (selectedStock) {
      setItems(prev =>
        prev.map(i =>
          i.id === id
            ? {
                ...i,
                stok_id: selectedStock.id,
                produk: selectedStock.nama,
                satuan: selectedStock.satuan || "Pcs",
                harga: selectedStock.harga || 15000
              }
            : i
        )
      );
    } else {
      setItems(prev =>
        prev.map(i =>
          i.id === id
            ? { ...i, stok_id: "", produk: "", satuan: "Pcs", harga: 0 }
            : i
        )
      );
    }
  }

  function updateItem(id: number, field: keyof POItem, value: string | number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  }

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.harga, 0);
  const ppn      = Math.round(subtotal * 0.11);
  const total    = subtotal + ppn;

  async function handleSubmit() {
    if (!supplierId) { setToast({ msg: "Pilih supplier terlebih dahulu.", type:"error" }); return; }
    if (!tglKirim)   { setToast({ msg: "Tanggal pengiriman wajib diisi.", type:"error" }); return; }
    if (items.some(i => !i.stok_id)) { setToast({ msg: "Semua produk wajib dipilih.", type:"error" }); return; }
    if (items.some(i => i.harga === 0)) { setToast({ msg: "Harga produk tidak boleh nol.", type:"error" }); return; }
    
    setSubmitting(true);
    try {
      const payload = {
        nomor_po: noPO,
        supplier_id: Number(supplierId),
        catatan: catatan || `Metode pembayaran: ${metodeBayar}. Pengiriman: ${tglKirim}`,
        detail_po: items.map(item => ({
          stok_id: Number(item.stok_id),
          jumlah_dipesan: Number(item.qty),
          harga_satuan: Number(item.harga)
        }))
      };
      
      await api.purchaseOrder.create(payload);
      setSubmitted(true);
      setToast({ msg: `PO ${noPO} berhasil dibuat!`, type:"success" });
    } catch (err: any) {
      setToast({ msg: err.message || "Gagal mengirim PO ke server.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleReset() {
    setSupplierId(0);
    setSupplierNama("");
    setTglKirim("");
    setMetodeBayar("Transfer Bank");
    setCatatan("");
    setItems([{ id: 1, stok_id: "", produk: "", satuan: "Pcs", qty: 1, harga: 0 }]);
    setNoPO(generateNoPO());
    setSubmitted(false);
  }

  const selectedSupplier = suppliers.find(s => s.id === supplierId);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes floatBlob { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(30px,-20px) scale(1.05)} 70%{transform:translate(-20px,18px) scale(0.97)} }
        @keyframes popIn   { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }

        .po-fade-up{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both}
        .d1{animation-delay:.04s}.d2{animation-delay:.09s}.d3{animation-delay:.14s}
        .d4{animation-delay:.19s}.d5{animation-delay:.24s}.d6{animation-delay:.30s}

        .blob-a{animation:floatBlob 11s ease-in-out infinite}
        .blob-b{animation:floatBlob 15s ease-in-out infinite reverse;animation-delay:5s}

        /* Card */
        .po-card{background:rgba(255,255,255,0.76);border:1.5px solid rgba(6,78,59,0.09);border-radius:18px;backdrop-filter:blur(18px);box-shadow:0 6px 28px rgba(6,78,59,0.06)}

        /* Inputs */
        .inp-g{border:1.5px solid rgba(6,78,59,0.15);border-radius:11px;padding:9px 13px;font-size:13px;font-family:'DM Sans',sans-serif;color:#022c22;background:rgba(255,255,255,0.80);outline:none;width:100%;transition:border-color .2s,box-shadow .2s}
        .inp-g:focus{border-color:rgba(6,78,59,0.40);box-shadow:0 0 0 3px rgba(6,78,59,0.07)}
        .inp-g::placeholder{color:rgba(6,78,59,0.28)}
        .inp-g:disabled{background:rgba(6,78,59,0.04);color:rgba(6,78,59,0.45);cursor:not-allowed}

        .sel-g{border:1.5px solid rgba(6,78,59,0.15);border-radius:11px;padding:9px 13px;font-size:13px;font-family:'DM Sans',sans-serif;color:#022c22;background:rgba(255,255,255,0.80);outline:none;width:100%;cursor:pointer;transition:border-color .2s,box-shadow .2s;appearance:none;-webkit-appearance:none}
        .sel-g:focus{border-color:rgba(6,78,59,0.40);box-shadow:0 0 0 3px rgba(6,78,59,0.07)}
        .sel-g:disabled{background:rgba(6,78,59,0.04);color:rgba(6,78,59,0.45);cursor:not-allowed}

        .label-g{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(6,78,59,0.42);font-family:'Plus Jakarta Sans',sans-serif;margin-bottom:5px;display:block}

        /* Buttons */
        .btn-primary{background:#064e3b;color:#ecfdf5;border:none;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;padding:11px 22px;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s,background .18s}
        .btn-primary:hover:not(:disabled){transform:translateY(-2px) scale(1.03);box-shadow:0 10px 28px rgba(6,78,59,0.28);background:#065f46}
        .btn-primary:active:not(:disabled){transform:scale(0.97)}
        .btn-primary:disabled{opacity:.55;cursor:not-allowed;transform:none;box-shadow:none}

        .btn-outline{background:transparent;color:#064e3b;border:1.5px solid rgba(6,78,59,0.25);border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;padding:11px 22px;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all .2s}
        .btn-outline:hover{background:rgba(6,78,59,0.06);border-color:rgba(6,78,59,0.40)}

        .btn-ghost{background:rgba(6,78,59,0.07);color:#064e3b;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-weight:600;padding:7px 12px;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:background .18s,transform .2s}
        .btn-ghost:hover{background:rgba(6,78,59,0.13);transform:scale(1.02)}

        .btn-danger{background:rgba(220,38,38,0.07);color:#dc2626;border:none;border-radius:9px;font-family:'DM Sans',sans-serif;font-weight:600;padding:6px 10px;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:background .18s,transform .2s}
        .btn-danger:hover{background:rgba(220,38,38,0.14);transform:scale(1.02)}
        .btn-danger:disabled{opacity:.3;cursor:not-allowed;transform:none}

        .btn-add-item{background:rgba(6,78,59,0.07);color:#064e3b;border:1.5px dashed rgba(6,78,59,0.22);border-radius:11px;width:100%;padding:10px;font-size:12px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background .2s,border-color .2s,transform .2s}
        .btn-add-item:hover{background:rgba(6,78,59,0.12);border-color:rgba(6,78,59,0.35);transform:scale(1.005)}

        /* Items table */
        .item-row{display:grid;grid-template-columns:1fr 80px 72px 120px 32px;gap:8px;align-items:start}
        @media(max-width:600px){
          .item-row{grid-template-columns:1fr 1fr;gap:6px}
          .item-row-del{grid-column:span 2;display:flex;justify-content:flex-end}
        }

        /* Summary */
        .summary-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(6,78,59,0.06)}
        .summary-total{display:flex;justify-content:space-between;align-items:center;padding:12px 0 0;border-top:2px solid rgba(6,78,59,0.15);margin-top:4px}

        /* Toast */
        .toast-g{animation:slideIn .3s cubic-bezier(.22,1,.36,1) both}

        /* Select wrapper */
        .sel-wrap{position:relative}
        .sel-wrap .chev{position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:rgba(6,78,59,0.40);display:flex}

        /* Divider label */
        .section-title{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:13px;color:#022c22;letter-spacing:.01em;display:flex;align-items:center;gap:8px}
        .section-title::before{content:'';display:block;width:3px;height:16px;background:#064e3b;border-radius:2px;flex-shrink:0}

        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className={`min-h-screen font-['DM_Sans'] relative overflow-x-hidden transition-opacity duration-500 ${mounted?"opacity-100":"opacity-0"}`}
        style={{ background:"#f0fdf4", color:"#064e3b" }}>

        <Header hasNotification={false} userInitials={userInitials} />

        <main>
          {/* HERO */}
          <section className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12"
            style={{ background:"linear-gradient(160deg,#edf2eb 0%,#e4ece1 45%,#f4f7f3 100%)" }}>
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blob-a pointer-events-none"
              style={{ background:"#6ee7b7", filter:"blur(76px)", opacity:0.26 }}/>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full blob-b pointer-events-none"
              style={{ background:"#a7f3d0", filter:"blur(60px)", opacity:0.20 }}/>

            <Inner className="relative z-10">
              {/* Breadcrumb */}
              <div className="po-fade-up d1 flex items-center gap-2 mb-5 text-[11px] font-medium"
                style={{ color:"rgba(6,78,59,0.40)" }}>
                <Link href="/dashboard" className="hover:text-[#064e3b] transition-colors">Dashboard</Link>
                <span>/</span>
                <Link href="/supplier" className="hover:text-[#064e3b] transition-colors">Supplier</Link>
                <span>/</span>
                <span style={{ color:"#064e3b" }} className="font-semibold">Buat PO</span>
              </div>

              <div className="po-fade-up d2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase mb-1.5 font-medium" style={{ color:"rgba(6,78,59,0.40)" }}>Pengadaan</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.1rem] leading-none" style={{ color:"#022c22" }}>
                    Purchase Order
                  </h1>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color:"rgba(6,78,59,0.38)" }}>{tanggal}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <p className="text-[10px] font-medium" style={{ color:"rgba(6,78,59,0.42)" }}>No. PO</p>
                    <p className="font-['Plus_Jakarta_Sans'] font-black text-base" style={{ color:"#022c22" }}>{noPO}</p>
                  </div>
                </div>
              </div>
            </Inner>
          </section>

          {/* FORM */}
          <section className="w-full py-10 sm:py-12" style={{ background:"#ffffff" }}>
            <Inner>
              <div ref={printRef} className="print-area space-y-6">

                {/* Supplier & Tanggal */}
                <div className="po-fade-up d2 po-card p-6 sm:p-8">
                  <p className="section-title mb-5">Informasi Supplier & PO</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Pilih Supplier */}
                    <div>
                      <label className="label-g">Supplier *</label>
                      <div className="sel-wrap">
                        <select className="sel-g" value={supplierId} disabled={submitted}
                          onChange={e => handleSupplierChange(Number(e.target.value))}>
                          <option value={0}>-- Pilih Supplier --</option>
                          {suppliers.map(s => (
                            <option key={s.id} value={s.id}>{s.nama} ({s.deskripsi || "Bahan Pokok"})</option>
                          ))}
                        </select>
                        <span className="chev"><IcChevDown/></span>
                      </div>
                      {selectedSupplier && (
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-medium"
                          style={{ color:"rgba(6,78,59,0.50)" }}>
                          <IcBuilding/>
                          <span>Kategori: <strong style={{ color:"#064e3b" }}>{selectedSupplier.deskripsi || "Bahan Pokok"}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Tanggal PO */}
                    <div>
                      <label className="label-g">Tanggal PO</label>
                      <div className="sel-wrap">
                        <input type="date" className="inp-g" value={tglPO} disabled
                          style={{ paddingLeft:"36px" }}/>
                        <span className="chev" style={{ left:"12px", right:"auto" }}><IcCalendar/></span>
                      </div>
                    </div>

                    {/* Tanggal Pengiriman */}
                    <div>
                      <label className="label-g">Estimasi Pengiriman *</label>
                      <div className="sel-wrap">
                        <input type="date" className="inp-g" value={tglKirim} disabled={submitted}
                          min={tglPO} style={{ paddingLeft:"36px" }}
                          onChange={e => setTglKirim(e.target.value)}/>
                        <span className="chev" style={{ left:"12px", right:"auto" }}><IcCalendar/></span>
                      </div>
                    </div>

                    {/* Metode Bayar */}
                    <div>
                      <label className="label-g">Metode Pembayaran</label>
                      <div className="sel-wrap">
                        <select className="sel-g" value={metodeBayar} disabled={submitted}
                          onChange={e => setMetodeBayar(e.target.value)}>
                          {bayarList.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <span className="chev"><IcChevDown/></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="po-fade-up d3 po-card p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-5">
                    <p className="section-title">Daftar Item</p>
                    <span className="text-[11px] font-semibold" style={{ color:"rgba(6,78,59,0.42)" }}>
                      {items.length} item
                    </span>
                  </div>

                  {/* Header row (desktop) */}
                  <div className="item-row mb-2 hidden sm:grid">
                    {["Produk","Satuan","Qty","Harga/Unit",""].map((h,i) => (
                      <p key={i} className="label-g mb-0" style={{ marginBottom:0 }}>{h}</p>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div key={item.id} className="item-row p-3 rounded-xl" style={{ background:"rgba(6,78,59,0.025)", border:"1px solid rgba(6,78,59,0.07)" }}>
                        {/* Produk */}
                        <div>
                          <label className="label-g sm:hidden">Produk</label>
                          <div className="sel-wrap">
                            <select className="sel-g" value={item.stok_id} disabled={submitted}
                              onChange={e => handleProductSelect(item.id, e.target.value)}>
                              <option value="">-- Pilih Produk --</option>
                              {stocks.map(p => (
                                <option key={p.id} value={p.id}>{p.nama}</option>
                              ))}
                            </select>
                            <span className="chev"><IcChevDown/></span>
                          </div>
                        </div>

                        {/* Satuan */}
                        <div>
                          <label className="label-g sm:hidden">Satuan</label>
                          <div className="sel-wrap">
                            <select className="sel-g" value={item.satuan} disabled={submitted}
                              onChange={e => updateItem(item.id,"satuan",e.target.value)}>
                              {satuanList.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <span className="chev"><IcChevDown/></span>
                          </div>
                        </div>

                        {/* Qty */}
                        <div>
                          <label className="label-g sm:hidden">Qty</label>
                          <input type="number" className="inp-g" min={1} value={item.qty} disabled={submitted}
                            onChange={e => updateItem(item.id,"qty",Math.max(1,Number(e.target.value)))}/>
                        </div>

                        {/* Harga */}
                        <div>
                          <label className="label-g sm:hidden">Harga/Unit (Rp)</label>
                          <input type="number" className="inp-g" min={0} placeholder="0" value={item.harga || ""} disabled={submitted}
                            onChange={e => updateItem(item.id,"harga",Math.max(0,Number(e.target.value)))}/>
                          {item.harga > 0 && item.qty > 0 && (
                            <p className="text-[10px] mt-1 font-semibold" style={{ color:"rgba(6,78,59,0.50)" }}>
                              = {formatRupiah(item.qty * item.harga)}
                            </p>
                          )}
                        </div>

                        {/* Delete */}
                        <div className="item-row-del flex items-start justify-end pt-0.5">
                          <button className="btn-danger" disabled={items.length === 1 || submitted}
                            onClick={() => removeItem(item.id)} title="Hapus item">
                            <IcTrash/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!submitted && (
                    <button className="btn-add-item mt-3" onClick={addItem}>
                      <IcPlus/> Tambah Item
                    </button>
                  )}
                </div>

                {/* Summary + Catatan */}
                <div className="po-fade-up d4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Catatan */}
                  <div className="po-card p-6 sm:p-8">
                    <p className="section-title mb-4">Catatan</p>
                    <label className="label-g">Keterangan Tambahan</label>
                    <textarea className="inp-g" rows={5} placeholder="Instruksi pengiriman, syarat khusus, dll…"
                      value={catatan} disabled={submitted}
                      onChange={e => setCatatan(e.target.value)}
                      style={{ resize:"vertical", minHeight:"100px" }}/>
                    <div className="flex items-start gap-1.5 mt-3 text-[11px]" style={{ color:"rgba(6,78,59,0.42)" }}>
                      <IcInfo/> PO yang sudah dikirim tidak dapat diedit.
                    </div>
                  </div>

                  {/* Ringkasan Biaya */}
                  <div className="po-card p-6 sm:p-8">
                    <p className="section-title mb-4">Ringkasan Biaya</p>
                    <div>
                      <div className="summary-row">
                        <span className="text-sm" style={{ color:"rgba(6,78,59,0.60)" }}>Subtotal</span>
                        <span className="text-sm font-semibold" style={{ color:"#022c22" }}>{formatRupiah(subtotal)}</span>
                      </div>
                      <div className="summary-row">
                        <span className="text-sm" style={{ color:"rgba(6,78,59,0.60)" }}>PPN (11%)</span>
                        <span className="text-sm font-semibold" style={{ color:"#022c22" }}>{formatRupiah(ppn)}</span>
                      </div>
                      <div className="summary-total">
                        <span className="font-['Plus_Jakarta_Sans'] font-black text-base" style={{ color:"#022c22" }}>Total</span>
                        <span className="font-['Plus_Jakarta_Sans'] font-black text-xl" style={{ color:"#064e3b" }}>{formatRupiah(total)}</span>
                      </div>
                    </div>

                    <div className="mt-5 p-3.5 rounded-xl" style={{ background:"rgba(6,78,59,0.04)", border:"1px solid rgba(6,78,59,0.08)" }}>
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span style={{ color:"rgba(6,78,59,0.55)" }}>Metode Bayar</span>
                        <span style={{ color:"#022c22" }}>{metodeBayar}</span>
                      </div>
                      {supplierNama && (
                        <div className="flex items-center justify-between text-[11px] font-semibold mt-1.5">
                          <span style={{ color:"rgba(6,78,59,0.55)" }}>Supplier</span>
                          <span style={{ color:"#022c22" }}>{supplierNama}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="po-fade-up d5 no-print flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 pb-6">
                  <Link href="/supplier">
                    <button className="btn-outline">Kembali</button>
                  </Link>
                  <div className="flex items-center gap-3 flex-wrap">
                    {submitted ? (
                      <>
                        <button className="btn-outline" onClick={handlePrint}>
                          <IcPrinter/> Print PO
                        </button>
                        <button className="btn-outline" onClick={handleReset}>
                          Buat PO Baru
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-outline" onClick={handlePrint}>
                          <IcPrinter/> Preview Print
                        </button>
                        <button className="btn-primary" disabled={submitting} onClick={handleSubmit}>
                          {submitting ? (
                            <>
                              <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-3.5 h-3.5 mr-1 inline-block" />
                              Mengirim…
                            </>
                          ) : (
                            <>
                              <IcSend/> Kirim PO
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </Inner>
          </section>
        </main>

        <Footer/>

        {/* TOAST */}
        {toast && (
          <div className="toast-g fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 shadow-2xl border"
            style={{ background:toast.type==="success"?"#d1fae5":"#fee2e2", borderColor:"rgba(255,255,255,0.70)", borderRadius:"14px", minWidth:"260px" }}>
            <span className="flex-shrink-0" style={{ color:toast.type==="success"?"#065f46":"#dc2626" }}>
              {toast.type==="success" ? <IcCheck/> : <IcX/>}
            </span>
            <p className="text-xs sm:text-sm font-semibold" style={{ color:"#022c22" }}>{toast.msg}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function POPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9FA] text-sm font-semibold text-[rgba(33,33,33,0.38)]">
        Memuat formulir PO...
      </div>
    }>
      <POPageInner />
    </Suspense>
  );
}